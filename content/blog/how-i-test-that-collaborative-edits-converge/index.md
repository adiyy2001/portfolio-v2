---
title: "How I test that collaborative edits converge"
description: "A seeded network simulator that runs the real server and client, breaks the network, heals it and compares every document byte for byte."
date: "2026-10-06T08:02:47+02:00"
slug: "how-i-test-that-collaborative-edits-converge"
tags: ["testing","angular","architecture","typescript"]
ogImage: ./og.png
---

A unit test cannot establish convergence, convergence is about every possible ordering of messages. You only ever write the orderings you thought of. 

In coschema, my side project, a real-time collaborative diagram editor in Angular, I test it with a deterministic simulator.  It runs the real server logic and the real client over a hostile network, heals the network and compares every document byte for byte. 

Randomized runs are evidence, not formal proof, hence the word “test” and not “prove”.  The evidence is still strong though and one design decision made it possible: the shared document is allowed to be an invalid graph.

## What the simulator runs

The simulator does not mock the sync layer.  Instead it wires up the real server logic and real client code in a single process with 2 to 8 clients and puts a fake network in the middle.

![Two to eight real clients and real server logic connected through a fake network driven by one seeded generator, followed by four phases: edit under faults, heal, drain, compare encoded bytes.](/blog-img/how-i-test-that-collaborative-edits-converge/simulator.png)

The network treats messages differently, it can delay them, reorder them, duplicate or drop them altogether.  It can also cut a client off entirely and bring it back later.

Everything random comes from one seeded generator.  There is no wall clock or real socket.  Given the same seed the same run occurs again, step for step.

The network itself is small. This is a sketch of the idea not the repository code:

```ts
class FlakyNetwork {
  private queue: Packet[] = [];
  private now = 0;

  constructor(private rng: Rng, private faults: Faults) {}

  send(packet: Packet): void {
    if (this.rng.chance(this.faults.drop)) return;
    const copies = this.rng.chance(this.faults.duplicate) ? 2 : 1;
    for (let i = 0; i < copies; i++) {
      const at = this.now + this.rng.int(this.faults.maxDelay);
      this.queue.push({ ...packet, at });
    }
  }

  tick(): Packet[] {
    this.now++;
    const due = this.queue.filter((p) => p.at <= this.now);
    this.queue = this.queue.filter((p) => p.at > this.now);
    return due.sort((a, b) => a.at - b.at);
  }
}
```

Reordering needs no special feature. Two packets get different random delays, so the later one can arrive first.

## Heal, then compare bytes

A random run has two phases. First the clients make edits while the network misbehaves: moving nodes, editing labels, connecting edges, deleting nodes, going offline and coming back.

Then the faults stop. Cut-off clients reconnect, the network runs until nothing is in flight, and every document is encoded and compared.

```ts
function runScenario(seed: number): void {
  const rng = createRng(seed);
  const server = new RealServer();
  const net = new FlakyNetwork(rng, chaosFaults);
  const clients = Array.from(
    { length: rng.between(2, 8) },
    () => new RealClient(server, net)
  );

  for (const step of randomSteps(rng, clients)) step();

  net.heal();
  clients.forEach((c) => c.reconnect());
  net.drain();

  const reference = server.encodeState();
  for (const client of clients) {
    if (!bytesEqual(client.encodeState(), reference)) {
      throw new Error(`diverged, seed ${seed}`);
    }
  }
}
```

I compare bytes on purpose. Comparing the rendered diagram can hide a difference that only shows up later, when the next edit touches the part that was already different. The encoded state leaves nothing to interpret.

A failing run prints its seed, and that seed replays exactly. A divergence that would otherwise arrive as a flaky bug report from a customer becomes a command I can run in a debugger.

## Why the invalid graph made this possible

A diagram graph can become invalid without anyone doing anything wrong.  One person connects an edge to a node while another person deletes that node.  Both operations are legal on their own machines but merged results in an edge pointing at nothing.

![Alice connects an edge from A to B while Bob deletes B. After the merge the edge points at nothing, and a read-only view hides it.](/blog-img/how-i-test-that-collaborative-edits-converge/dangling-edge.png)

The obvious fix is to repair it, whoever encounters the dangling edge should delete it.  I decided against that in ADR 0007.  The shared document is allowed to be in this invalid state while a derived read-only view hides it.

```ts
function visibleEdges(doc: DiagramDoc): Edge[] {
  return doc.edges.filter(
    (edge) => doc.nodes.has(edge.from) && doc.nodes.has(edge.to)
  );
}
```

No client repairs anything.  Merging stays a pure merge, so the simulator only has to answer one question: did every replica receive the same set of updates and merge them to the same state?

The y-protocols layer underneath is built for exactly that.  My code adds no writes upon it that depend upon what a client happened to see.

## What repair would have cost the test

Suppose every client also repaired dangling edges as it saw them.  Now a merge triggers an edit, and that edit gets broadcast.

Two clients see the same dangling edge at the same moment and both delete it.  Or one repairs it while a third client still offline reconnects an edge to a new node with the same role.  The state after healing clearly depends upon who did what repair, and in what order.  

That is a repair storm, and one that hurts production as well as the test.  Such a run would not go quiet following healing, there would be ongoing traffic from repairs.  There would be no clean moment for the byte comparison to happen, and failure is likewise hard to pin on network or repair logic.  

With validity decided at read time there’s nothing to pin.  If the documents end up differing after healing it’s because the transport or merge operation was wrong.  That’s a short list of suspects.  

The same idea surfaces within the undo design.  Each client features its own undo manager limited to local changes, a drag is one undo step.  Undoing my move does not likewise revert some later label edit performed by another client, because the undo stack never reaches into remote history (ADR 0008).

## What ordinary unit tests miss

I still write unit tests for each piece, the derived view, the undo steps, the encoding.  They are fast and they point at the exact line. 

A unit test encodes the author's story of what happens.  Client A sends, client B receives, B sends back.  I wrote that story so I wrote the code to survive it. 

The simulator tells stories I would not write.  An update comes twice and the second copy follows a later edit.  A client gets cut off mid-batch.  A dropped message only gets repaired when a different client reconnects. 

It also tests the seams.  The bugs I expect in a sync system live between server and client, what one side assumes about the other.  Both are the real code so the assumptions get tested against each other not against a mock I wrote to agree with me. 

The limit is coverage.  A simulator finds the bugs its fault model can express, and a seed that passes says nothing about seeds I did not run.  If the fault model misses a kind of failure, the simulator remains silent.  So finding a new kind of failure in the wild means the first job is teaching the network to produce it. 

The repository is at https://github.com/adiyy2001/coschema if you want to read the real version of any of this.  The decision is written up in ADR 0012.

## Make convergence a property of the merge

To test convergence, first make it a property of the merge and nothing else. Every reactive write a client makes after a merge is one more thing your test has to explain.

Then build the test around a seed. Use one generator, no wall clock, the real code on both sides, a hostile network, a heal step and a byte comparison at the end. Print the seed when it fails.

Allowing the invalid state in the document looked like a concession when I made the decision. It turned out to be what made the whole system checkable.
