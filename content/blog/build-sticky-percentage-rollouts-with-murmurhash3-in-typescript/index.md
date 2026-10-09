---
title: "Build sticky percentage rollouts with MurmurHash3 in TypeScript"
description: "Write a TypeScript flag evaluator whose MurmurHash3 buckets are sticky per user, then pin it with shared conformance vectors and a property test."
date: "2026-10-09T14:01:28+02:00"
slug: "build-sticky-percentage-rollouts-with-murmurhash3-in-typescript"
tags: ["tutorial","typescript","node","testing"]
ogImage: ./og.png
---

A percentage rollout looks trivial until two runtimes disagree about a single user. In a self-hosted feature flag project of mine, rollouts hash the context key. Any difference in signed arithmetic or UTF-8 handling sends the same person to a different variant on the server than in the browser. This tutorial builds the TypeScript half of that idea: a small flag evaluator whose bucketing is sticky per user and specified precisely enough for another runtime to reproduce it.

You will implement MurmurHash3 with 32 bit integer arithmetic, turn a bucket into a variant with integer weights, evaluate rules in a fixed order, and test the result two ways. Shared JSON conformance vectors pin the behaviour for any language. A seeded property test shows that widening a rollout never removes a user who was already in.

You need Node 24, npm and basic TypeScript. There is no server and no build step, only pure functions and Vitest 3. The complete project, with every test and the vector files, is at https://github.com/adiyy2001/sticky-rollout-evaluator

## Decide what a bucket is before writing code

The whole design hangs on one pure function: text in, bucket out. Rules, variants and the property test all rest on the promise that the same text gives the same bucket in every runtime.

The rules fit in a list:

- The input is the string `flagKey.salt.userKey`.
- The hash is MurmurHash3 (x86, 32 bit, seed 0) of the UTF-8 bytes of that string, read as an unsigned number.
- The bucket is that number modulo 100000.

The weights of a rollout are deliberately not part of the input. If they were, changing a percentage would reshuffle everybody, and users would flip back and forth while you widen a rollout.

The objection I hear most is that I should call a hash library and move on. That works inside one language. Across two, a library answers only half of the question, because the spec still has to say how a string becomes bytes, which seed to use and how a hash becomes a bucket. So I treat the algorithm as a written spec and the code as one implementation of it.

The bucket calculation lives in [`src/bucket.ts`](https://github.com/adiyy2001/sticky-rollout-evaluator/blob/main/src/bucket.ts). It builds the input string and takes the modulo.

```ts
import { hashText } from "./murmur3.ts";

export const BUCKET_SPACE = 100_000;

export function bucketInput(flagKey: string, salt: string, contextKey: string): string {
  return `${flagKey}.${salt}.${contextKey}`;
}

export function bucketOfText(text: string): number {
  return hashText(text) % BUCKET_SPACE;
}

export function bucket(flagKey: string, salt: string, contextKey: string): number {
  return bucketOfText(bucketInput(flagKey, salt, contextKey));
}
```

The flag key and the salt are in the input so two flags never sort users the same way. Changing a flag's salt is the deliberate way to reshuffle everyone.

The modulo is only safe because `hashText` returns an unsigned number. A signed hash would give negative buckets, and a runtime with different integer types would disagree on the sign.

## Implement MurmurHash3 with 32 bit integer arithmetic

JavaScript has no 32 bit integer type, so the hash has to be coaxed out of doubles. Two things go wrong if you do it naively: multiplication and sign.

The file is [`src/murmur3.ts`](https://github.com/adiyy2001/sticky-rollout-evaluator/blob/main/src/murmur3.ts). I start with the constants and three helpers.

```ts
const C1 = 0xcc9e2d51;
const C2 = 0x1b873593;

function rotateLeft(value: number, bits: number): number {
  return ((value << bits) | (value >>> (32 - bits))) >>> 0;
}

function mixBlock(block: number): number {
  const scaled = Math.imul(block, C1);
  return Math.imul(rotateLeft(scaled, 15), C2);
}

function finalMix(input: number): number {
  let hash = input;
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return hash;
}
```

`Math.imul` multiplies as 32 bit integers and keeps the low bits. A plain `*` produces a product a double cannot hold exactly, so the low bits are silently wrong and the hash is wrong with them. A Java `int` wraps on overflow by itself, which is why a port to Java looks simpler and still has to match.

The bitwise operators in JavaScript return signed 32 bit values. The `>>> 0` after the rotation reinterprets the result as unsigned, so nothing downstream sees a negative number by accident.

The main function reads the input in blocks of four bytes, little endian, and handles the one to three leftover bytes as a tail.

```ts
export function murmur3(data: Uint8Array, seed = 0): number {
  const blockEnd = data.length - (data.length % 4);
  let hash = seed | 0;
  for (let index = 0; index < blockEnd; index += 4) {
    const block =
      data[index] |
      (data[index + 1] << 8) |
      (data[index + 2] << 16) |
      (data[index + 3] << 24);
    hash ^= mixBlock(block);
    hash = rotateLeft(hash, 13);
    hash = (Math.imul(hash, 5) + 0xe6546b64) | 0;
  }
  const remaining = data.length - blockEnd;
  if (remaining > 0) {
    let tail = 0;
    for (let offset = remaining - 1; offset >= 0; offset--) {
      tail = (tail << 8) | data[blockEnd + offset];
    }
    hash ^= mixBlock(tail);
  }
  return finalMix(hash ^ data.length) >>> 0;
}
```

The function takes bytes, not a string, on purpose. The hash stays free of any text decisions, and those decisions live in one small place.

The tail is built from the last byte backwards, which puts the first leftover byte in the lowest position, the same layout the full blocks use. The final `>>> 0` makes the result unsigned.

Turning a string into bytes is where runtimes quietly diverge.

```ts
const textEncoder = new TextEncoder();

export function encodeUtf8(text: string): Uint8Array {
  return textEncoder.encode(text);
}

export function hashText(text: string, seed = 0): number {
  return murmur3(encodeUtf8(text), seed);
}
```

`TextEncoder` always produces UTF-8, and it encodes a lone surrogate as U+FFFD. So a user key ending in `\ud800` buckets exactly like one ending in the replacement character, and the hashing tests pin that. Some runtimes substitute a question mark instead, which is the kind of difference the spec has to rule out.

There is also no Unicode normalization and no case folding. `User` and `user` are different people, and so are a composed and a decomposed `é`.

## Pick the variant from cumulative weights

A bucket is a whole number from zero up to one below the bucket space. A rollout is a list of variants with integer weights, in thousandths of a percent, so they always sum to 100000.

Integers matter here. With floating point percentages, two runtimes can round a boundary differently and put one bucket on opposite sides of it.

Selection lives in [`src/rollout.ts`](https://github.com/adiyy2001/sticky-rollout-evaluator/blob/main/src/rollout.ts). It walks the entries and serves the first variant whose cumulative weight is greater than the bucket.

```ts
export function pickVariant(entries: readonly RolloutEntry[], bucket: number): string {
  let cumulative = 0;
  for (const entry of entries) {
    cumulative += entry.weight;
    if (cumulative > bucket) {
      return entry.variant;
    }
  }
  throw new InvalidFlagError(`rollout weights do not cover bucket ${bucket}`);
}
```

The comparison is strict. A bucket equal to the cumulative weight is already out of that variant, and the last bucket below it is still in. A test checks both sides of that boundary.

The throw at the end only fires for a flag whose weights do not sum to the total. A separate validator rejects such flags before they ship, so this is a guard and not a normal code path.

Most rollouts are a single percentage, so a helper builds the two-entry list.

```ts
export const TOTAL_WEIGHT = 100_000;

const WEIGHT_UNITS_PER_PERCENT = 1_000;

export function percentageRollout(onVariant: string, offVariant: string, percent: number): Serve {
  const onWeight = Math.round(percent * WEIGHT_UNITS_PER_PERCENT);
  if (!Number.isFinite(percent) || onWeight < 0 || onWeight > TOTAL_WEIGHT) {
    throw new RangeError(`percent must be between 0 and 100, got ${percent}`);
  }
  return {
    rollout: [
      { variant: onVariant, weight: onWeight },
      { variant: offVariant, weight: TOTAL_WEIGHT - onWeight },
    ],
  };
}
```

The enabled variant comes first, so it owns the low end of the bucket space, from zero up to its weight. Raising the percentage moves one boundary to the right, and every bucket that was left of it stays left of it.

The off weight is computed as the remainder and never rounded on its own. That keeps the sum at the total for any input, including `0.001` percent.

## Evaluate rules in a fixed order

In [`src/evaluator.ts`](https://github.com/adiyy2001/sticky-rollout-evaluator/blob/main/src/evaluator.ts) the order of decisions becomes part of the spec. The kill switch comes first, then a disabled flag, then the rules in order, then the fallthrough.

A rule matches when all its conditions match, and the first matching rule wins. A missing attribute, or one of a type the operator cannot use, never matches, even with `negate`. People get that last point wrong, so it has vectors of its own.

```ts
function serve(
  flag: Flag,
  target: Serve,
  context: Context,
  reason: Reason,
  ruleIndex: number | null,
  ruleId: string | null,
): EvaluationResult {
  if ("variant" in target) {
    return resultFor(flag, target.variant, reason, ruleIndex, ruleId, null);
  }
  const bucketValue = bucket(flag.key, flag.salt, context.key);
  const variantKey = pickVariant(target.rollout, bucketValue);
  return resultFor(flag, variantKey, reason, ruleIndex, ruleId, bucketValue);
}

export function evaluate(flag: Flag, context: Context): EvaluationResult {
  if (flag.killSwitch) {
    return resultFor(flag, flag.offVariant, "KILL_SWITCH", null, null, null);
  }
  if (!flag.enabled) {
    return resultFor(flag, flag.offVariant, "OFF", null, null, null);
  }
  const attributes = context.attributes ?? {};
  const ruleIndex = flag.rules.findIndex((rule) =>
    rule.conditions.every((condition) => matchesCondition(condition, attributes)),
  );
  if (ruleIndex >= 0) {
    const rule = flag.rules[ruleIndex];
    return serve(flag, rule.serve, context, "RULE_MATCH", ruleIndex, rule.id);
  }
  return serve(flag, flag.fallthrough, context, "FALLTHROUGH", null, null);
}
```

The bucket is computed from `context.key` and nothing else. Attributes pick the rule but never touch the hash, so a user does not change bucket when their plan or age changes. That is what makes the rollout sticky.

The bucket is also computed lazily. A rule that serves a fixed variant never hashes anything, and the result reports `null` for the bucket. That detail turns out to be useful in the vectors.

`resultFor` looks the variant up and throws an `InvalidFlagError` if it does not exist. A flag that serves a variant it never declared should fail loudly, not hand back `undefined` to a caller who will treat it as falsy.

## Write the expected results by hand

Unit tests in one language only prove that the language agrees with itself. A second implementation needs something it can run without reading my TypeScript, so the repository ships two JSON files in `spec/vectors`.

`hashing.json` holds MurmurHash3 reference values for a range of inputs and seeds, and the buckets derived from them. For example, the input `abc` with seed 0 hashes to `b3dd93fa`, which is bucket 43002. A port that gets that wrong has a problem in the hash or the modulo, and the file says which.

[`spec/vectors/evaluations.json`](https://github.com/adiyy2001/sticky-rollout-evaluator/blob/main/spec/vectors/evaluations.json) holds complete flags and the results they must produce. I wrote the expected values by hand from the rules instead of running the evaluator and saving its output. A vector captured from the code under test only proves the code equals itself.

Here is a trimmed slice, the negation flag and two of its cases.

```json
{
  "flags": {
    "negation": {
      "key": "negation",
      "enabled": true,
      "killSwitch": false,
      "salt": "1a2b3c",
      "variants": [{ "key": "on", "value": true }, { "key": "off", "value": false }],
      "offVariant": "off",
      "rules": [{ "id": "outside-poland", "conditions": [{ "attribute": "country", "operator": "in", "values": ["PL"], "negate": true }], "serve": { "variant": "on" } }],
      "fallthrough": { "variant": "off" }
    }
  },
  "cases": [
    { "name": "negation with a missing attribute does not match", "flag": "negation", "context": { "key": "u18", "attributes": {} }, "expected": { "variantKey": "off", "value": false, "reason": "FALLTHROUGH", "ruleIndex": null, "ruleId": null, "bucketed": false } },
    { "name": "negation matches another country", "flag": "negation", "context": { "key": "u19", "attributes": { "country": "DE" } }, "expected": { "variantKey": "on", "value": true, "reason": "RULE_MATCH", "ruleIndex": 0, "ruleId": "outside-poland", "bucketed": false } }
  ]
}
```

The expected block uses `bucketed`, a boolean, instead of the bucket number. The hashing vectors already pin bucket numbers, and the boolean checks the other thing a port can get wrong: hashing when it should not, or skipping the hash when it should.

The file covers lists, text that looks like a number, an inclusive age bound, a kill switch that beats matching rules and an empty context key. A test requires at least 25 cases and unique names, and it validates every flag in the file.

The runner is a function in `test/support.ts` called `differences`. It evaluates one case, compares six fields and returns a list of readable mismatch messages. A runner that cannot fail is worthless, so a test corrupts a vector on purpose and expects the mismatch to be reported.

## Test that widening never removes a user

Vectors pin exact answers for a few users. They say nothing about the property that makes rollouts safe: going from 10 percent to 50 percent only ever adds people.

That statement covers all users and all pairs of percentages, so it gets a property test. It lives in [`test/rollout.property.test.ts`](https://github.com/adiyy2001/sticky-rollout-evaluator/blob/main/test/rollout.property.test.ts) and starts with three small helpers.

```ts
function rolloutFlag(percent: number, salt = "9f2c41"): Flag {
  return {
    key: "checkout",
    enabled: true,
    killSwitch: false,
    salt,
    variants: [
      { key: "on", value: true },
      { key: "off", value: false },
    ],
    offVariant: "off",
    rules: [],
    fallthrough: percentageRollout("on", "off", percent),
  };
}

function membership(flag: Flag, keys: string[]): boolean[] {
  return keys.map((key) => evaluate(flag, { key }).variantKey === "on");
}

function keepsEveryone(narrow: boolean[], wide: boolean[]): boolean {
  return narrow.every((wasIn, index) => !wasIn || wide[index]);
}
```

`keepsEveryone` is a logical implication: for every user, being in the narrow rollout implies being in the wide one. Writing it as `!wasIn || wide[index]` keeps the intent visible, and it allows new users to appear.

The test goes through the real `evaluate`, not through the bucket function. If someone later makes the evaluator depend on anything else, such as the percentage or the time, the property breaks.

```ts
it("never removes a user along a ladder of percentages", () => {
  const keys = userKeys(5000, 1);
  const ladder = [0, 1, 5, 10, 25, 50, 75, 99.999, 100];
  let previous = membership(rolloutFlag(ladder[0]), keys);
  for (const percent of ladder.slice(1)) {
    const current = membership(rolloutFlag(percent), keys);
    expect(keepsEveryone(previous, current)).toBe(true);
    expect(current.filter(Boolean).length).toBeGreaterThanOrEqual(previous.filter(Boolean).length);
    previous = current;
  }
});
```

The ladder includes the awkward ends: zero, a tiny step and `99.999`, one thousandth of a percent from full. A second test draws random pairs of percentages and checks the smaller against the larger.

All the randomness is seeded. `userKeys` and `createRandom` in `test/support.ts` are deterministic, so every run checks the same users and a failure reproduces on the next run instead of vanishing.

Two more groups sit next to it. One shows that repeated calls give identical results and that adding attributes does not change a rollout result when no rule uses them. The other checks that about a quarter of users land in a 25 percent rollout, and that changing the salt moves roughly half of users at 50 percent. The distribution bounds are loose on purpose, since they guard against a broken hash and not against statistical noise.

## Run the tests

The project has one script, and it runs everything: the hash vectors, the evaluation vectors, the unit tests and the property tests.

```bash
npm install
npm test
```

`npm test` runs `vitest run` once and exits. The project expects Node 24, and a `.nvmrc` file pins it for people who use a version manager.

There is nothing else to start. The evaluator is a set of pure functions that the tests import directly, so the test run is also the whole demonstration.

To see the safety net work, open `spec/vectors/hashing.json`, change one hash value by a character and run the tests again. The failure names the input and the seed. Change an expected variant in `evaluations.json` and the failure names the case and the field.

You will want the same from a second implementation. It reads the same two files and has to reproduce every line, and the first mismatch tells you whether the hash, the UTF-8 step, the modulo or the rule logic is at fault.

## What to try next

The most useful next step is a second runtime. Write the evaluator in Java, Go or Python, load both vector files and make every vector pass. Watch the three places this tutorial flagged: multiplication that wraps at 32 bits, unsigned reads and how lone surrogates become bytes.

Then grow the vectors where a port is most likely to fail. Add user keys with emoji, with composed and decomposed accents and with an empty string, and add the hash and bucket for each. The cheapest bug to prevent is the one you wrote a vector for.

You could also extend the property test to rollouts with three variants. The widening property is easiest to state with a single moving boundary, so work out what you want to guarantee before you write the test.

The full code, including the validator, the condition operators and the remaining tests, is in the repository: https://github.com/adiyy2001/sticky-rollout-evaluator

A rollout that two runtimes compute differently is a bug nobody notices until a user complains. Write the spec down, then make the code prove it.
