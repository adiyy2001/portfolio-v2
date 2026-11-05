---
title: "Stream feature flags over WebSockets with delta resync in Node"
description: "Build a Node WebSocket server and client that stream versioned flag changes, resync after a gap and are tested against a real running server."
date: "2026-11-05T14:03:51+01:00"
slug: "stream-feature-flags-over-websockets-with-delta-resync"
tags: ["tutorial","node","javascript","websockets"]
ogImage: ./og.png
---

I benchmarked 5,000 WebSocket clients receiving 30 changes (150,000 frames) in flagtide, my self-hosted feature flag project. The protocol should be able to detect any missing frames since no human could visually identify a missing frame out of 150,000.

In this tutorial you build a small Node version of that idea. A server streams versioned flag changes. A client reconnects with the last version it applied and gets either exactly what it missed or a fresh snapshot. You need Node 24 and some familiarity with the `ws` package. The full project with all tests is at https://github.com/adiyy2001/flag-stream-sync-ws.

No build step, just plain JavaScript modules. Tests run real servers, enabling observation of every case of the protocol.

## Give every frame a type and every state a version

The whole protocol is JSON text frames with a `t` field, defined in [src/protocol.js](https://github.com/adiyy2001/flag-stream-sync-ws/blob/main/src/protocol.js). The client sends `hello` and `ack`. The server sends `snapshot`, `deltas`, `hb` (heartbeat) and `error`.

Why is there a version on everything? Simple. A client can state "I have 3" and the server can respond with exactly what happened after 3. Even if no data frames are received a heartbeat with the latest version can be used by the client to compare it with its own version and find out it missed something.

Client frames are parsed strictly. Frames longer than 4096 characters, bad JSON, an unknown type or fractional version close the socket with code 4400. A client that never says hello is closed with code 4408. Because frames are parsed strictly, everything past the parser is already shaped correctly. Defensive checks are not required in the rest of the code.

Snapshots carry the full flag map. Deltas carry `from`, `to` and a list of entries, each with its own version `v` and a list of changes, either `upsert` with a config or `remove`. The `from` field is the one that matters later: it is what lets the client prove a delta fits onto its state.

## Decide between a snapshot and deltas in the store

The versioned store in [src/flag-store.js](https://github.com/adiyy2001/flag-stream-sync-ws/blob/main/src/flag-store.js) keeps the current flags, a version counter and a bounded log of commits. Every commit that changes something bumps the version by one and appends an entry. A commit that changes nothing returns `null` and does not burn a version, so versions never advance without a real change.

![A decision diagram. A client says its version. If the log still reaches back to it, the server sends deltas. If there is no version, the version is ahead of the server, or it is older than the window, the server sends a snapshot.](https://adrianturbinski.pl/blog-img/stream-feature-flags-over-websockets-with-delta-resync/fig-1.png)

The decision lives in `planSync`. It returns deltas only when the log still reaches back to the client's version, and a snapshot in every other case:

```js
export class FlagStore {
planSync(since) {
  if (!Number.isSafeInteger(since) || since > this.#version || !this.#covers(since)) {
    return { kind: 'snapshot', snapshot: this.snapshot() };
  }
  const missed = this.#log.filter((entry) => entry.v > since);
  return { kind: 'deltas', from: since, to: this.#version, entries: structuredClone(missed) };
}

#covers(since) {
  if (since === this.#version) {
    return true;
  }
  return this.#log.length > 0 && this.#log[0].v <= since + 1;
}
}
```

Three things fall back to a snapshot: no version at all, a version ahead of the server (the server was restarted, for example) and a version older than the retained window. The `since + 1` check is the subtle one. If the oldest entry is version 4, a client at version 3 is covered, because entry 4 is the very next change it needs.

The log is capped by `capacity`, so memory stays bounded. The price is that a client offline for long enough pays for a full snapshot. That is the right trade, because the snapshot is always correct.

## Make the replica refuse to guess

On the client side, [src/replica.js](https://github.com/adiyy2001/flag-stream-sync-ws/blob/main/src/replica.js) holds the flags and the version, and its `apply` method returns one of four outcomes: applied, current, gap or invalid. It never throws and it never half-applies a frame.

![Four checks in order for a deltas frame: invalid shape, gap when from differs from version, contiguous entries, then apply. Each failing check returns an outcome before any change touches state.](https://adrianturbinski.pl/blog-img/stream-feature-flags-over-websockets-with-delta-resync/fig-2.png)

```js
export class Replica {
#applyDeltas({ from, to, entries }) {
  if (!isVersion(from) || !isVersion(to) || !Array.isArray(entries)) {
    return Outcome.INVALID;
  }
  if (this.#version === null || from !== this.#version) {
    return Outcome.GAP;
  }
  if (entries.length === 0) {
    return to === from ? Outcome.CURRENT : Outcome.INVALID;
  }
  if (!this.#isContiguous(from, to, entries)) {
    return Outcome.INVALID;
  }
  for (const entry of entries) {
    for (const change of entry.changes) {
      this.#applyChange(change);
    }
  }
  this.#version = to;
  return Outcome.APPLIED;
}
}
```

The order of the checks is deliberate. A delta whose `from` is not my version is a gap, and I detect it before looking at the entries. Then the entries are validated as one contiguous run, versions `from + 1` up to `to`, before the first change touches state. Because validation comes first, a bad frame leaves the replica exactly where it was.

A heartbeat goes through the same method. If its version differs from mine, the outcome is a gap. That single comparison is the whole stale data detection.

For the small case where this is overkill, I'll allow it. If your flags are changed a few times a day and the snapshot is small it is easier and acceptable to always send the snapshot. The biggest issue with deltas is the added code. There is indeed added code, but gap detection is also needed for snapshots since a client that can not detect the missing frame is incorrect as well.

## Push from the server, reconnect from the client

The server in [src/server.js](https://github.com/adiyy2001/flag-stream-sync-ws/blob/main/src/server.js) arms a hello deadline for every new socket. When the hello arrives, it opens a session:

![A loop. The client receives a frame; a gap or invalid outcome makes it drop the socket; it reconnects with backoff and sends hello with its version; the server answers with deltas or a snapshot.](https://adrianturbinski.pl/blog-img/stream-feature-flags-over-websockets-with-delta-resync/fig-3.png)

```js
function openSession(socket, hello, { store, heartbeatMs, clock }) {
  const plan = store.planSync(hello.version);
  sendIfOpen(
    socket,
    plan.kind === 'snapshot'
      ? snapshotFrame(plan.snapshot)
      : deltasFrame(plan.from, plan.to, plan.entries)
  );
  const unsubscribe = store.subscribe((entry, previousVersion) => {
    sendIfOpen(socket, deltasFrame(previousVersion, entry.v, [entry]));
  });
  const heartbeat = setInterval(() => {
    sendIfOpen(socket, heartbeatFrame(clock(), store.version));
  }, heartbeatMs);
  return {
    clientId: hello.clientId,
    stop() {
      unsubscribe();
      clearInterval(heartbeat);
    }
  };
}
```

Planning and subscribing happen in the same synchronous run, so no commit can slip between the catch up frame and the first live push. Each live push says `from` the previous version `to` the new one, which is exactly what the replica's gap check expects.

The client in [src/client.js](https://github.com/adiyy2001/flag-stream-sync-ws/blob/main/src/client.js) turns every outcome into an action:

```js
export class FlagStreamClient extends EventEmitter {
#receive(socket, text) {
  this.#armStaleTimer();
  let frame = null;
  try {
    frame = JSON.parse(text);
  } catch {
    frame = null;
  }
  const outcome = this.#replica.apply(frame);
  if (outcome === Outcome.GAP || outcome === Outcome.INVALID) {
    socket.terminate();
    return;
  }
  this.#attempt = 0;
  this.#setStatus('live');
  if (outcome === Outcome.APPLIED) {
    socket.send(ackFrame(this.#replica.version));
    this.emit('update', { version: this.#replica.version, via: frame.t });
  }
}
}
```

The repair for a gap is not clever on purpose. The client drops the socket and the normal reconnect path sends a fresh `hello` with its version, so there is one recovery route instead of two. Every frame also re-arms a stale timer, which defaults to 40000 ms against a 15000 ms heartbeat, so a silent connection is treated as dead.

Reconnect delays come from `backoffDelay`, exponential growth with full jitter: a random number times the smaller of the cap and `baseMs * 2 ** attempt`. Jitter matters because after a server restart you do not want every client back in the same millisecond.

## Run the tests and the project

The tests in [test/stream.test.js](https://github.com/adiyy2001/flag-stream-sync-ws/blob/main/test/stream.test.js) start the real server on port 0, so the OS picks a free port and nothing needs the network. The client gets a tiny backoff and a random function that returns 0, so reconnects are instant. The most telling test drops the connection and overruns the retained window:

```js
it('resyncs with a snapshot after a drop beyond the retained window', async () => {
  const { store, server } = await startServer({ store: new FlagStore({ capacity: 2 }) });
  store.upsert('alpha', {});
  const { client, updates } = startClient(server.url);
  await eventually(() => expect(client.version).toBe(1));
  server.dropConnections();
  for (const key of ['b', 'c', 'd', 'e']) {
    store.upsert(key, {});
  }
  await eventually(() => expect(client.version).toBe(5));
  expect(updates.at(-1)).toEqual({ version: 5, via: 'snapshot' });
});
```

With a capacity of 2 and four commits during the outage, the log no longer reaches back to version 1, so the only correct answer is a snapshot, and the assertion checks the `via` field to prove it. A sibling test does the same inside the window and expects `deltas`.

The file also covers the failure paths. A scripted server can send out skipped ahead deltas, a heartbeat with a newer version, or nothing at all. In all these cases, the client will have to reconnect carrying version 1. The protocol violation tests check the 4400 and 4408 close codes.

```bash
npm install
npm test
```

There is no standalone binary. The [README](https://github.com/adiyy2001/flag-stream-sync-ws/blob/main/README.md) shows how to import `FlagStore`, `startFlagServer` and `FlagStreamClient` into your own script, and the package needs Node 24 or newer.

## What to try next

Start with the unhappy path you can measure. Lower the store capacity in a script, drop the connections, commit a few changes and watch the client switch from `deltas` to `snapshot`. Then break something on purpose, for example make the server push a `from` that is off by one, and see which test fails first.

From there, a few extensions fit the design without bending it. Persist the replica's version and flags so a restarted process says hello with a real version instead of none. Use the `onAck` callback to track which version each client has reached. Cap how many frames you queue per socket, so one slow reader cannot hold up the others.

The complete code, including the store and replica unit tests, is in the repository: https://github.com/adiyy2001/flag-stream-sync-ws.

Takeaway: A reconnect path must never send less than its last known version. Check your own reconnect code this week. What does it say first?
