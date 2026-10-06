---
title: "How I test that collaborative edits converge"
description: "A seeded network simulator that runs the real server and client, breaks the network, heals it and compares every document byte for byte."
date: "2026-10-06T08:02:47+02:00"
slug: "how-i-test-that-collaborative-edits-converge"
tags: ["testing","angular","architecture","typescript"]
ogImage: ./og.png
---

A unit test cannot establish convergence. Convergence concerns every possible ordering of messages, and you only ever write the orderings you thought of.

In coschema, my side project, a real-time collaborative diagram editor in Angular, I test it with a deterministic simulator. It runs the real server logic and the real client over a hostile network, heals the network and compares every document byte for byte.

Randomized runs are evidence, not a formal proof, so I say "test" and not "prove". The evidence is still strong, and one design decision made it possible: the shared document is allowed to be an invalid graph.

## What the simulator runs

The simulator does not mock the sync layer. It wires the real server logic and the real client code together in one process, with 2 to 8 clients, and puts a fake network in the middle.

That network delays messages, reorders them, duplicates them and drops them. It can also cut a client off entirely and bring it back later.

Everything random comes from one seeded generator. There is no wall clock and no real socket. Given the same seed, the same run happens again, step for step.

The network itself is small. This is a sketch of the idea, not the repository code:

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

A diagram graph can become invalid without anyone doing anything wrong. One person connects an edge to a node while another person deletes that node. Both edits are legal on their own machines. Merged, you have an edge pointing at nothing.

The obvious fix is to repair it, so whoever notices the dangling edge deletes it. I decided against that in ADR 0007. The shared document is allowed to hold the invalid state, and a derived read-only view hides it.

```ts
function visibleEdges(doc: DiagramDoc): Edge[] {
  return doc.edges.filter(
    (edge) => doc.nodes.has(edge.from) && doc.nodes.has(edge.to)
  );
}
```

No client repairs anything. Merging stays a pure merge, so the simulator only has to answer one question: did every replica receive the same set of updates and merge them to the same state?

The y-protocols layer underneath is built for exactly that. My code adds no writes on top of it that depend on what a client happened to see.

## What repair would have cost the test

Suppose every client repaired dangling edges as it saw them. Now a merge triggers an edit, and that edit is broadcast.

Two clients see the same dangling edge at the same moment, and both delete it. Or one repairs it while a third client, still offline, reconnects an edge to a new node with the same role. The state after healing depends on who repaired what, and in which order.

That is a repair storm, and it hurts production as well as the test. The run would not go quiet after healing, because repairs keep generating traffic. The byte comparison would have no clean moment to happen at, and a failure would be hard to pin on the network or on the repair logic.

With validity decided at read time, there is nothing to pin. If documents differ after healing, the transport or the merge is wrong. That is a short list of suspects.

The same idea shows up in the undo design. Each client has its own undo manager that tracks only local changes, and a drag is one undo step. Undoing my move does not revert someone else's later label edit, because the undo stack never reaches into remote history (ADR 0008).

## What ordinary unit tests miss

I still write unit tests for the pieces: the derived view, the undo steps, the encoding. They are fast and they point at the exact line.

But a unit test encodes the author's story of what happens. Client A sends, client B receives, B sends back. I wrote that story, so I wrote the code to survive it.

The simulator tells stories I would not write. An update arrives twice, and the second copy lands after a later edit. A client is cut off in the middle of a batch. A dropped message is only repaired when a different client reconnects.

It also tests the seams. The bugs I expect in a sync system live between the server and the client, in what one side assumes about the other. Because both are the real code, those assumptions are tested against each other and not against a mock I wrote to agree with me.

The limit is coverage. A simulator finds the bugs its fault model can express, and a seed that passes says nothing about the seeds I did not run. If the fault model misses a failure, the simulator stays quiet. So when I find a new kind of failure in the wild, the first job is teaching the network to produce it.

The repository is at https://github.com/adiyy2001/coschema if you want to read the real version of any of this. The decision is written up in ADR 0012.

## Make convergence a property of the merge

To test convergence, first make it a property of the merge and nothing else. Every reactive write a client makes after a merge is one more thing your test has to explain.

Then build the test around a seed. Use one generator, no wall clock, the real code on both sides, a hostile network, a heal step and a byte comparison at the end. Print the seed when it fails.

Allowing the invalid state in the document looked like a concession when I made the decision. It turned out to be what made the whole system checkable.
