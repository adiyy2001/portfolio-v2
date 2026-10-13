---
title: "Why I built flagtide, one flag answer in Java and TypeScript"
description: "A case study of flagtide, my self-hosted feature flag service: three design decisions, their trade-offs and what the benchmark showed."
date: "2026-10-13T11:34:53+02:00"
slug: "why-i-built-flagtide-one-flag-answer-in"
tags: ["angular","java","architecture","typescript"]
ogImage: ./og.png
---

I use feature flags as part of my daily stack. I've used them for gradual rollouts and fast rollback. But I've never been completely satisfied with the way I knew they were working.

I had two questions. How do you manage to change a flag state and have it reach thousands of open browsers in well under a second? And how do you know that Java on the server and TypeScript in the browser give the same answer for the same flag?

My solution to both of these is flagtide. flagtide is a self-hosted feature flag service. It uses a Quarkus back end on PostgreSQL to push flag changes via WebSockets and an Angular SDK to evaluate the flags locally. This post is about the finished project, not a how to. I'll show you the motivations, three design decisions made and the trade-offs involved, the measured result and things that were left out intentionally.

## Why a feature flag service at all

There are many feature flag products. This is not intended as a replacement for those.

I primarily use Angular, but I also build Java and Quarkus back ends. Thus I find myself on both sides of the line where a flag is decided. A flag service is one of the few small systems that touch both sides and have real rules: targeting, percentage rollouts, versions, ordering of changes.

I also wanted one compact project that would demonstrate hexagonal architecture and domain-driven design on a real domain, not a CRUD toy. The domain core has no framework in it. Both the in-memory adapter and the PostgreSQL adapter run the same eight contract tests, so a port means something. The ArchUnit rules are shown to fail on a planted violation, because a rule that has never failed is a rule I do not trust (ADR 0005, ADR 0014).

This gave me the frame. The interesting parts are the three decisions below.

## One written spec, two engines, 616 vectors

The most severe kind of risk with flag services is quiet disagreement. A percentage rollout hashes the context key and maps it to a bucket. If the server and the browser differ in one detail, the same user lands in a different variant depending on who evaluated.

The details that bite are boring ones. A Java int wraps as a signed 32-bit integer whereas a JavaScript number is a double until you force it back using `Math.imul` or `| 0`. When hashing a string the same UTF-8 bytes must be present on both sides. However, JavaScript strings are UTF-16. Semver comparison needs one ordering rule, written down once.

This means that the algorithm itself is a written spec and both engines are my own code, one in Java and one in TypeScript. I did not wrap a library on one side and hope. Both engines run 616 shared vectors in CI. The expected hashes come from an independent Python oracle, so neither engine can vouch for itself.

The trade-off is real. Having two engines of my own means twice the code to maintain. Every new rule must also land in the spec, in both languages and in the vectors. I accept that because otherwise there would be a server-side evaluation call for each flag and that kills the point of evaluating locally in the browser.

## PostgreSQL NOTIFY as a pointer, not a broker

We need coordination between multiple servers on the ordering of change and each server then needs to publish out to its connected sockets. The typical solution is some form of message broker. I've seen that in RabbitMQ in my work and for this situation it was over-complicated rather than required.

We already have the data in PostgreSQL and we have LISTEN and NOTIFY. The issue is that NOTIFY is ordered but not durable and only supports 8,000 bytes per payload. If a listener drops at the wrong time then it will miss some notifications.

Thus the notification carries nothing important. It is only a pointer to a change which is recorded in a versioned change log. Each server then consumes the change log after the version they have already seen.

```sql
CREATE TABLE flag_change (
  version bigserial PRIMARY KEY,
  flag_key text NOT NULL,
  body jsonb NOT NULL
);

SELECT pg_notify('flag_changes', 'wake up');

SELECT version, flag_key, body
FROM flag_change
WHERE version > $1
ORDER BY version;
```

This is the shape, not the real schema. A missed notification incurs a delay, not a missed change. The next read always picks everything up from the last seen version. A reconnect on every listener causes a resync for the same reason.

The test kills the listener backend and verifies that the next change still arrives (ADR 0008). This is why I have faith in this design. The cost is one read per notification per instance. I judged this cheap next to running a broker.

## Serialize once, close the slow socket

Fan-out is the solution to the sub-second question. A change needs to make it to thousands of sockets across an instance.

The first rule is that changes are serialized per instance and all sockets receive the same string. Serializing per client is relatively easy to implement, but the CPU cost scales with the number of clients.

The second rule is less comfortable. If a connection has 256 frames pending on it the connection is closed (ADR 0017). One stuck client (for example, a laptop going to sleep with the tab still open) should not block all other clients. I prefer to drop one connection rather than introduce latency to all others.

```ts
interface Peer {
  send(frame: string): void;
  pending(): number;
  close(): void;
}

function broadcast(peers: Iterable<Peer>, change: object): void {
  const frame = JSON.stringify(change);
  for (const peer of peers) {
    if (peer.pending() >= 256) {
      peer.close();
      continue;
    }
    peer.send(frame);
  }
}
```

Our actual server is written in Java. This document is meant to be a translation into TypeScript of the idea. The largest issue with this design is that closing a socket seems rather abrupt. It does, but a client that can't keep pace is already stale and the SDK provides an accurate status for this (connecting, live, stale or offline). WebSocket pings are invisible to browsers so instead we implement a heartbeat from the server and compare timestamp values rather than number of timer ticks to account for throttling in background tabs (ADR 0010).

## What the benchmark said

Target p95 propagation from commit to client: 300 ms

Test ran with 5,000 WebSocket clients across 2 instances, 30 changes and 150,000 frames. Measured p50 propagation at 38 ms, p95 at 77 ms and p99 at 90 ms. Percentage rollout evaluates in 0.412 µs on average in Node compared to a target of 5 µs.

This was run on a single laptop using WSL2. Both clients and servers were on the same machine. This is a useful smoke test but is not a capacity claim. I would not use these results to size a production cluster. Firefox and Safari were not tested.

What I care about though is the margin. By having a target specified prior to the test it creates a comparison rather than a story I told afterwards.

## What I left out and what comes next

Four things are not built, on purpose, and ADR 0021 explains why: flag prerequisites, scheduled changes, an Oracle adapter and an SSE fallback. Each is real work, and none is needed to answer the two questions the project started with.

One limit is a shortcut I do not want anyone to copy. The admin keys reach the browser in a runtime config.json. That is fine for a public demo where anyone may edit the flags, and wrong for a real deployment.

The Oracle adapter is next. The contract tests already say what it has to do, which is the best argument I know for writing them first.

If you build something like this, write the spec before the second implementation, and let a third party compute the expected values. The project is MIT licensed, with 22 ADRs. The live demo is at flagtide.adrianturbinski.pl, admin and demo shop side by side, and the data goes back to the seed every hour. The SDK is on npm as @flagtide/core and @flagtide/angular.

Two implementations agree only when a third one has checked them.
