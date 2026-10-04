---
title: "Review capacity is the new delivery bottleneck"
description: "AI made code cheap to generate, so review is what limits delivery. Here is how I budget for it on a team that uses Claude Code daily."
date: "2026-10-04T17:35:19+02:00"
slug: "review-capacity-is-the-new-delivery-bottleneck"
tags: ["ai","codereview","webdev","productivity"]
ogImage: ./og.png
---

Typing code is now nearly free. Understanding code is not, and that is where delivery gets stuck.

I use Claude Code daily for refactors, test generation and review. It is good at producing diffs. It does not produce a human who understands the diff well enough to put their name on it.

I think review capacity, not generation speed, now sets how fast a team ships. Tech leads should plan for it the way they plan for build capacity.

## Typing speed was never the job

Nobody ever shipped faster because they typed faster. The slow parts of delivery were always reading, deciding, checking and agreeing.

AI tools removed a step that was already cheap and made the expensive steps more frequent. More diffs arrive per day, and each one still needs somebody to read it.

Two sets of numbers keep pulling me back to this.

## The numbers do not add up to faster delivery

METR ran a randomized controlled trial with experienced open-source developers working on their own repositories. They were 19% slower with AI, and they believed AI had made them 20% faster.

The gap between those two figures is what interests me. If the people doing the work cannot feel the slowdown, a team will not notice it either until the dashboards show it.

The team-level data points the same way. Teams with high AI adoption merge 98% more PRs, review time goes up 91%, and DORA delivery metrics stay flat.

Individual output rises and code quality falls, while organizational delivery does not move. Work piles up in front of the reviewers, and reviewers are the one resource AI did not multiply.

## Why generated code is expensive to review

When a colleague writes a change, I can infer a lot from who wrote it. I know what they usually get right, where they cut corners, and which parts of the system they understand.

Generated code gives me none of that. It is fluent and consistently formatted, so it looks equally trustworthy everywhere, including the places where it is wrong.

The author is in a weaker position too. If the diff came from a prompt, they may not have a model of why each line is there. Then the reviewer is the first person who has to build that model, and that is the slow part.

So my first rule on the team is that the author must be able to explain every line in the PR. If they cannot, the PR is not ready for a reviewer.

## The objection that AI can review it too

The strongest objection is that this problem is temporary. If a model writes the code, a model can review it, and the bottleneck disappears.

I do use AI for review, and it helps. It catches mechanical issues, inconsistent naming, missing error handling and forgotten edge cases before a human spends time on them.

It does not remove the bottleneck, for two reasons. A reviewer from the same family of models shares many of the generator's blind spots, so their agreement is weaker evidence than it looks.

The other reason is accountability. Someone on the team has to own the change in production, and that person has to understand it. A model's approval does not give a human that understanding.

So I treat AI review as a filter that shrinks what the human has to read, and the human still reads it.

## Spend human review where judgment is needed

If review time is the scarce resource, it should go only where judgment is needed. Everything a machine can check should be checked before a person opens the PR.

```yaml
name: pr-gate
on:
  pull_request:
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
```

This is boring on purpose. A reviewer should never be the one to discover a failing type check.

Architecture helps too. In the grid application I lead at my current employer, the backend follows a hexagonal layout. A change in the domain core gets slow, careful review. A change in an adapter, such as a REST mapping or a persistence query, gets a lighter pass against the port it implements.

That gives reviewers a map of where to spend attention. Without boundaries, every generated diff demands the same suspicion everywhere.

## Review the spec before the implementation

The cheapest review happens before the code exists. When I ask an agent to change behavior, I want the expected behavior pinned in a test that a human wrote or at least read closely.

```ts
import { describe, expect, it } from '@jest/globals';
import { nextStep, defaultPolicy } from './retry-policy';

describe('nextStep', () => {
  it('retries while attempts remain', () => {
    const attempt = defaultPolicy.maxAttempts - 1;
    expect(nextStep(defaultPolicy, attempt)).toBe('retry');
  });

  it('dead-letters once attempts are exhausted', () => {
    const attempt = defaultPolicy.maxAttempts;
    expect(nextStep(defaultPolicy, attempt)).toBe('dead-letter');
  });
});
```

I care about this kind of rule in RabbitMQ based integrations, where retry and dead-letter behavior decides whether a long calculation survives a bad night.

Reading two small tests is far cheaper than inferring the same rule from a large diff. If the tests are right and green, the reviewer can skim the implementation for structure instead of re-deriving intent.

I also keep PRs small and ask for generated refactors to be split by concern. A large diff that mixes a rename, a behavior change and a new test file is the most expensive thing you can hand a reviewer.

## Put review hours in the plan

Most teams budget for building and treat review as something that happens in the gaps. That worked when writing was the slow step. It breaks when diffs arrive faster than people can read them.

On a team of five, review is a shared pool of attention, and it is finite. I plan around it explicitly.

I limit how many PRs one person can have open at once, so generation cannot run ahead of reading. I count review as real work when we discuss sprint capacity. I ask what a feature costs to review, not only what it costs to produce.

I also watch delivery rather than output. More merged PRs mean little if the metrics that describe getting value to users stay where they were.

Generation is cheap now. Understanding is what you still pay for, so budget for it.
