---
title: "Why I built coschema, a collaborative diagram editor"
description: "A case study of coschema: three design decisions with their trade-offs, measured results from one laptop, and the accessibility gap I have not closed."
date: "2026-10-30T11:33:52+01:00"
slug: "why-i-built-coschema-a-collaborative-diagram-editor"
tags: ["yjs","angular","architecture","webdev"]
ogImage: ./og.png
---

A collaborative editor is mostly a series of choices for what to do in the case where two people are both correct. The syncing is the part that tends to get the most showiness. The other choices are where the work or failure of the system resides.

Diagram editors are my day job. I work on software that generates single-line diagrams of high-voltage substations, and in real teams several people edit the same diagram at the same time. I wanted to build the hard parts of that myself: maintaining graph validity when two users edit at once, undoing only your own edits, and supporting clean offline editing and merge.

I also wanted an editor that is keyboard operable and announces remote changes to screen readers, because collaborative canvases rarely are. That became coschema, an MIT-licensed editor in Angular on top of Yjs, with live cursors, follow mode and offline editing backed by IndexedDB. This is a case study of the finished project, so I will go through three decisions, the numbers, and what I left out.

## My own sync server instead of Hocuspocus

I use Yjs 13 for the document and implemented my own sync server using the y-protocols. For the majority of products a ready-made solution like Hocuspocus would have been the appropriate choice and would have saved me a significant amount of code.

I implemented my own sync server due to a desire to own the wire protocol. A very early issue that arose was the lack of acknowledgement in y-protocols. When a client sends an update there is no way of the client being informed if the server has received it. This creates an issue for an offline capable editor as the user requires assurance over the safety of their previous changes.

I therefore decided to add an acknowledgement to the wire protocol (ADR 0009). The client counts the updates that are not safe yet and the UI can say so honestly. The updates are stored in an append-only log in PostgreSQL with compaction (ADR 0010).

The downside is now that I own the protocol, its bugs and its upgrades. One server process owns a room, and that limit comes straight from the design.

## Validity at read time instead of repair writes

A graph can also become invalid due to actions that appear to be innocent. One user adds an edge to a node and another user removes that node. Both actions are valid. The edge will then point to nothing after the merge.

The most obvious solution is for a client to detect the dangling edge and remove it. I opted against this solution because if two clients both repair, each will perform a write and each repair constitutes a concurrent edit that can trigger reactions from other users. This can cause a storm of writes.

Instead the shared document is allowed to remain in an invalid state, and a derived read-only view hides it (ADR 0007). Nothing repairs anything.

```ts
import * as Y from 'yjs';

interface EdgeData {
  id: string;
  from: string;
  to: string;
}

export function visibleEdges(
  nodes: Y.Map<unknown>,
  edges: Y.Map<EdgeData>
): EdgeData[] {
  const result: EdgeData[] = [];
  edges.forEach((edge) => {
    if (nodes.has(edge.from) && nodes.has(edge.to)) {
      result.push(edge);
    }
  });
  return result;
}
```

The case for repair writes is quite narrow. The output must be clean to other consumers, for example, a piece of export code that will consume the raw data. All consumers should then apply the same filter. This does incur a cost. Perhaps the most serious objection is that an invalid shared state smells bad. I argue that this only smells bad if consumed raw. The raw document itself is never rendered.

## Per-user undo where a drag is one step

A global undo is a bug in a shared document. I would like to undo my previous step, not a step made after my step.

Each client has an individual undo manager which only stores client-local data (ADR 0008). Undoing my step will not undo a label change made after my step by another user. A drag is implemented as one undo operation and not one undo operation per pointer event.

Its representation in Yjs looks something like this.

```ts
import * as Y from 'yjs';

const localOrigin = Symbol('local');

export function createUndo(nodes: Y.Map<Y.Map<number>>) {
  return new Y.UndoManager(nodes, {
    trackedOrigins: new Set([localOrigin]),
  });
}

export function moveNode(
  doc: Y.Doc,
  nodes: Y.Map<Y.Map<number>>,
  id: string,
  x: number,
  y: number
) {
  doc.transact(() => {
    const node = nodes.get(id);
    node?.set('x', x);
    node?.set('y', y);
  }, localOrigin);
}
```

The catch to this is that undo only makes sense in relation to your own history. If someone deleted the node you moved, your undo has nothing to act on and the editor has to cope with that quietly.

## What I measured and what I did not

There is an article for the convergence simulator. The simulator uses the real server logic and the real client with 2 to 8 clients connected over a message-reordering, -duplicating, -delaying and -dropping network and then does byte-for-byte document comparison of every document. It ran 5,000 seeds over 1,756,564 messages with 0 failures. On failure the run prints out a seed which can be used to replay it exactly.

The other figures are from a single laptop and should be considered a floor for my setup rather than a promise.

- Edit to remote render, p95: 18 ms against a 200 ms target.
- One Node process sustained 3,987 operations per second.
- Panning 5,000 nodes at 60 fps at every zoom level. I wrote that benchmark first, and my first renderer failed it.

There's a caveat to the accessibility result. Lighthouse accessibility is 100. The editor is keyboard operable and remote changes are announced to screen readers. However, it has not actually been tested with a real screen reader yet. Automated accessibility scoring only covers part of what a user with assistive technology requires. For now, I consider this claim unproven until that session happens.

I also prefer to express this in the README rather than let a 100 stand in for a test I have not done.

## What is not built, and what I would keep

Documented in ADR 0025. I did not implement comments on nodes, resize handles, waypoint dragging, the Quarkus auth service or version snapshots. I also did not implement support for several server instances per room. One process owns a room, so scaling out would require either sticky routing or pub/sub.

None of these changes whether two people converge on a valid diagram, which was the question the project set out to answer. Each one is a feature or a deployment concern I can add later without redoing the core.

The practice I would carry forward is small. Before you build the clever part, decide what the system does when two correct actions collide, and write that decision down. Then open the last collaborative feature you shipped and check who repairs the invalid state, and whether two clients can repair it at once.

The live demo is at coschema.adrianturbinski.pl, where the demo page runs two editors in your browser with latency, jitter and packet loss sliders and an offline switch.
