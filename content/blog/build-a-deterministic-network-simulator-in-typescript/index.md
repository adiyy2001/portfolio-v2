---
title: "Build a deterministic network simulator in TypeScript"
description: "Build a virtual clock, seeded PRNG and lossy link in TypeScript so sync tests replay exactly, plus a runner that replays a failing seed."
date: "2026-11-02T14:03:52+01:00"
slug: "build-a-deterministic-network-simulator-in-typescript"
tags: ["tutorial","typescript","testing","node"]
ogImage: ./og.png
---

Within my collaborative diagram editor in coschema the network simulator was the most useful component. Not due to an effective network simulation but because on failure it would print a seed and replay exactly. The last full run had 1,756,564 messages across 5,000 seeds with 0 failures.

In this tutorial we will implement a small example similar to this in TypeScript. We will create a virtual clock, a seeded random number generator, a link with latency, jitter, loss and duplication and a runner that finds a failing seed and replays it. We assume basic knowledge of TypeScript and Node 24.

The complete project, with tests and configuration, is in the [virtual-network-test-harness repository](https://github.com/adiyy2001/virtual-network-test-harness). The page explains the parts that matter, the repository holds every file.

## Seeded randomness you can fork

A flaky network test usually has two causes: `Math.random` and real timers. I replace both. Randomness comes first, because everything else draws from it.

The generator in [src/prng.ts](https://github.com/adiyy2001/virtual-network-test-harness/blob/main/src/prng.ts) is a small 32 bit mixer. It keeps the seed it started with and one integer of state, so the same seed always gives the same sequence.

```ts
export class Prng {
  readonly seed: number;
  private state: number;

  constructor(seed: number) {
    this.seed = seed >>> 0;
    this.state = this.seed;
  }

  nextUint32(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let mixed = this.state;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return (mixed ^ (mixed >>> 14)) >>> 0;
  }

  chance(probability: number): boolean {
    return this.next() < probability;
  }

  fork(label: string): Prng {
    const mixed = Math.imul(this.seed ^ hashLabel(label), 0x9e3779b1) + 0x85ebca6b;
    return new Prng(mixed >>> 0);
  }
}
```

`next()` divides `nextUint32()` by 2 to the power of 32, which gives a float from zero up to one. `hashLabel` is a short FNV-1a hash of a string, and the constructor in the file also rejects non integer seeds.

`fork` is the method I care about. It derives a new generator from the original seed and a label, not from the current state. That means a fork gives the same stream no matter how much the parent has been used. When I later add one more draw on the upstream link, the downstream link keeps dropping exactly the same messages. Without forks, every change to one part of the simulation reshuffles the faults in every other part, and your seeds stop meaning anything.

## A clock that only moves when the test says so

Real `setTimeout` makes tests slow and order dependent. The fix is a clock you advance by hand. [src/virtual-clock.ts](https://github.com/adiyy2001/virtual-network-test-harness/blob/main/src/virtual-clock.ts) exports a small `Clock` interface with `now`, `setTimeout` and `clearTimeout`, and `VirtualClock` implements it.

The two methods that matter keep a sorted list of timers and pop the due ones in order.

```ts
export class VirtualClock implements Clock {
setTimeout(callback: () => void, delayMs: number): number {
  const timer: ScheduledTimer = {
    id: this.nextId,
    time: this.currentTime + delayMs,
    callback,
  };
  this.nextId += 1;
  const position = this.timers.findIndex((existing) => existing.time > timer.time);
  if (position === -1) this.timers.push(timer);
  else this.timers.splice(position, 0, timer);
  return timer.id;
}

advance(durationMs: number): number {
  const target = this.currentTime + durationMs;
  let processed = 0;
  for (let timer = this.takeDue(target); timer !== undefined; timer = this.takeDue(target)) {
    this.currentTime = timer.time;
    timer.callback();
    processed += 1;
  }
  this.currentTime = target;
  return processed;
}
}
```

Insertion goes before the first timer that is strictly later, so two timers with the same time run in the order they were created. That tie break is what makes runs repeatable. `advance` sets the clock to each timer's own time before running its callback, so code that reads `now()` inside a callback sees the moment the timer was due, not the end of the window.

Callbacks may schedule new timers, and if they fall inside the window they run in the same call. The file also has `runUntilIdle`, which throws `VirtualClockOverflowError` after a fixed number of events. A retry loop that never stops would otherwise hang your test run, and a clear error is better than a timeout.

## A link that drops, delays and duplicates

Now the network itself. `SimulatedLink` in [src/link.ts](https://github.com/adiyy2001/virtual-network-test-harness/blob/main/src/link.ts) takes a clock, a generator, a delivery callback and a config with latency, jitter, loss rate and duplicate rate. The file ships three profiles: `clean`, `lossy` (60 ms latency, 40 ms jitter, 20 percent loss, 5 percent duplicates) and `chaotic`.

![A send call passes three checks in order: partitioned, lost, duplicated. Each arrival gets its own random delay, so reordering appears naturally.](https://adrianturbinski.pl/blog-img/build-a-deterministic-network-simulator-in-typescript/fig-1.png)

```ts
export class SimulatedLink<T> {
send(message: T): void {
  this.stats.sent += 1;
  if (this.isPartitioned) {
    this.stats.partitioned += 1;
    return;
  }
  if (this.random.chance(this.config.lossRate)) {
    this.stats.lost += 1;
    return;
  }
  this.scheduleArrival(message);
  if (this.random.chance(this.config.duplicateRate)) {
    this.stats.duplicated += 1;
    this.scheduleArrival(message);
  }
}

private scheduleArrival(message: T): void {
  const delay = this.config.latencyMs + this.random.between(0, this.config.jitterMs);
  this.clock.setTimeout(() => {
    this.arrive(message);
  }, delay);
}
}
```

No reordering is implemented and is intended this way. Every arrival gets its own random delay, so a later message may arrive before an earlier one if the jitter is large enough. Reordering is not an option that can be missed when testing, but rather naturally appears within the model.

The code under test is in [src/reliable-sync.ts](https://github.com/adiyy2001/virtual-network-test-harness/blob/main/src/reliable-sync.ts). A `SyncClient` numbers each update, keeps it until the server acknowledges it and retries on a timer. A `SyncServer` buffers out of order frames, applies them in order and acknowledges how many it has. The client takes a `Clock`, not the global timer, which is the only change the production code needs to be testable. `createSyncRig` wires both sides through two links and gives each one its own fork, `upstream` and `downstream`.

## A runner that replays a failing seed

Fixed seeds in unit tests only cover the cases you thought of. I want many seeds, and I want any failure to be something I can paste back in. [src/property.ts](https://github.com/adiyy2001/virtual-network-test-harness/blob/main/src/property.ts) does that with a case made of a seed and a size, where the size is the number of updates.

![Four steps in a row: derive a seed per run, run the property, shrink the size, print the replay line with seed and size.](https://adrianturbinski.pl/blog-img/build-a-deterministic-network-simulator-in-typescript/fig-2.png)

```ts
export function replayCase(property: Property, testCase: PropertyCase): string | undefined {
  try {
    property(testCase);
    return undefined;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

function caseForRun(baseSeed: number, run: number, maxSize: number): PropertyCase {
  const seed = new Prng(baseSeed).fork(`run:${run}`).seed;
  const size = 1 + new Prng(seed).fork('size').int(maxSize);
  return { seed, size };
}

function smallestFailingSize(property: Property, failing: PropertyCase, message: string) {
  for (let size = 1; size < failing.size; size += 1) {
    const candidateMessage = replayCase(property, { seed: failing.seed, size });
    if (candidateMessage !== undefined) return { size, message: candidateMessage };
  }
  return { size: failing.size, message };
}
```

Each run derives its seed from the base seed and the run number, so the whole report is reproducible from one number. When a run fails, the shrinker keeps the seed and tries smaller sizes until one still fails. A failure with 3 updates is easier to read than one with 19. `formatFailure` then prints the line you need: `replay with seed=... size=...`.

The test file [test/network.test.ts](https://github.com/adiyy2001/virtual-network-test-harness/blob/main/test/network.test.ts) proves the loop with a property that is meant to fail. The client gets a retry interval so large it never fires, over the lossy profile.

```ts
const deliversWithoutRetries: Property = ({ seed, size }) => {
  const { clock, client, server } = syncRigFor(seed, LINK_PROFILES.lossy, 1_000_000_000);
  updatesOf(size).forEach((value) => client.push(value));
  clock.advance(10_000);
  if (server.log.length !== size) {
    throw new Error(`server applied ${server.log.length} of ${size} updates`);
  }
};

it('finds a failing seed when the client never retries and replays it', () => {
  const report = runProperty(deliversWithoutRetries, { runs: 30 });
  const failure = report.failure;
  expect(failure).toBeDefined();
  if (failure === undefined) return;
  const replayed = replayCase(deliversWithoutRetries, { seed: failure.seed, size: failure.size });
  expect(replayed).toBe(failure.message);
});
```

A broken client is the honest way to test a bug finder. If the runner cannot catch a client with retries switched off, it will not catch a subtle one either. The mirror property, with a normal retry interval over the chaotic profile, must pass for every run.

## Run the tests and the project

The [package.json](https://github.com/adiyy2001/virtual-network-test-harness/blob/main/package.json) has two scripts, `test` and `typecheck`, and it needs Node 24 or newer. The repository also has an `.nvmrc` file that says 24.

```bash
npm install
npm run typecheck
npm test
```

These tests do not require a network, browser or environment variables. They test the clock, link, runner, sync example, generator and do not wait for time to pass during any test, meaning they are fast.

To see the harness on its own, the README shows a short script. It builds a `VirtualClock`, a `Prng` with seed 7 and a rig over two `lossy` links, pushes one update, advances the clock by 5000 and prints `rig.server.log`. Run it twice and you get the same drops, delays and duplicates. Change the seed and the trace changes.

Just one limitation to state outright. The simulator does not run your logic against an actual network, but against the faults you list. The simulator does not have knowledge of TCP behaviour or browser timers that throttle in background tabs. The biggest issue is that a model you wrote yourself can share your blind spots. This is accurate and I still feel a little uneasy about a green run. The solution is not to skip it, but to add the fault you forgot the moment production shows it to you.

## What to try next

Start by breaking the sync example in a new way. Make the server acknowledge before it applies a frame, or stop it ignoring duplicates, and see which seed the runner reports. Then replay that seed with `replayCase` and step through it. This is the loop that makes the whole setup worth building.

After that, a few extensions fit the existing pieces. Toggle `setPartitioned` in the middle of a property run and check recovery. Add a third link profile that is fine most of the time and terrible for one window. Print `formatFailure` in your CI log so a red build carries its own replay command.

The full code, including both test files, is in the [repository](https://github.com/adiyy2001/virtual-network-test-harness).

This week, pick one retry loop in your own code and move its timer behind a `Clock` interface. Nothing else has to change yet. Once the timer is injectable, the rest is a matter of afternoons.
