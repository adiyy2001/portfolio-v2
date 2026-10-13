---
title: "Review capacity is the new delivery bottleneck"
description: "AI made code cheap to generate, so review is what limits delivery. Here is how I budget for it on a team that uses Claude Code daily."
date: "2026-10-04T17:35:19+02:00"
slug: "review-capacity-is-the-new-delivery-bottleneck"
tags: ["ai","codereview","webdev","productivity"]
ogImage: ./og.png
---

Typing code is nearly free these days.  Understanding code is not, and that’s where delivery gets stuck.

I use Claude Code daily for refactors and reviews and test generation.  It’s good at producing diffs.  It does not produce a human who understands the diff well enough to put their name on it.  

I think review capacity, not generation speed, now determines how fast a team ships.  Tech leads should plan for this the same as they would for build capacity.

## Typing speed was never the job

Nobody ever shipped faster because they typed faster.  The slow parts of delivery were always reading, deciding, checking and agreeing.

AI tools eliminated a step that was already cheap but made expensive steps more frequent.  More diffs per day arrive but each still needs somebody to read them.

Two sets of numbers keep bringing me back to this.

## The numbers do not add up to faster delivery

METR ran a randomized controlled trial with experienced open-source developers working on their own repositories. They were 19% slower with AI, and they believed AI had made them 20% faster.

![Two panels. Teams with high AI adoption merged 98% more pull requests and spent 91% more time in review, while DORA delivery metrics stayed flat. In a randomized trial, experienced developers believed they were 20% faster and were measured 19% slower.](/blog-img/review-capacity-is-the-new-delivery-bottleneck/adoption-vs-delivery.png)

The gap between those two figures is what interests me. If the people doing the work cannot feel the slowdown, a team will not notice it either until the dashboards show it.

The team-level data points the same way. Teams with high AI adoption merge 98% more PRs, review time goes up 91%, and DORA delivery metrics stay flat.

Individual output rises and code quality falls, while organizational delivery does not move. Work piles up in front of the reviewers, and reviewers are the one resource AI did not multiply.

## Why generated code is expensive to review

When a colleague writes a change I can infer a lot from who wrote it: what they usually get right, where they cut corners and which parts of the system they understand.

Generated code presents none of that, it’s fluent and consistently formatted so it looks equally trustworthy everywhere including where it’s wrong.

The author is in a weaker position too, if it came from a prompt they may not have a model of why each line exists in the code. The reviewer is then the first person who has to build that model, and that is the slow part.

My first rule on the team is thus that the author must be able to explain every line within a PR. If they can’t then the PR is not ready for a reviewer.

## The objection that AI can review it too

The strongest objection is that this problem is temporary, the model writes the code and a model can review it, removing the bottleneck. 

I do use AI for review, it helps.  You find mechanical issues or things like inconsistent naming or missing error handling or edge cases before humans spend time on them.

That does not remove the bottleneck.  The reviewer itself comes from the same family of models as the generator so they share many of the same blind spots, the agreement is weaker evidence than it looks.

The other reason is accountability, someone on the team has to own the change in production and understand it.  A model’s approval does not give a human that understanding. 

So the AI review is a filter that makes less of what the human has to read, but the human still reads it.

## Spend human review where judgment is needed

If review time is the scarce resource, it should go only where judgment is needed.  Everything a machine can check should be checked before a person opens the PR.

![Four steps: the spec as a test, the author owning the diff, a machine gate of lint, typecheck, tests and AI review, then human review that is slow for the domain core and lighter for adapters.](/blog-img/review-capacity-is-the-new-delivery-bottleneck/where-review-goes.png)

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

This is boring on purpose, a reviewer should never be the one to discover a failing type check. 

The architecture helps here too.  The backend of the grid application I lead at my current employer follows a hexagonal layout.  Changes to the domain core get slow and careful review while changes to adapters like REST mappings or persistence queries get a lighter pass against the port they implement. 

This gives reviewers a map of where to spend attention, without boundaries every generated diff demands the same level of suspicion everywhere.

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

I care about this sort of rule within RabbitMQ integrations, the retry and dead-letter behavior decides if a long calculation survives a bad night.

Reading two small tests is far cheaper than inferring the same rule from a large diff.  If the tests are right and green the reviewer can skim the implementation for structure rather than re-deriving intent. 

PRs stay small and I ask for generated refactors to be split by concern.  A large diff including a rename, behavior change and new test file is the most expensive thing you can give a reviewer.

## Put review hours in the plan

Most teams budget for building, review happens in the gaps.  This worked when writing was the slow step.  It breaks when diffs come faster than people can read them. 

On a team of five, review is a shared pool of attention, and it’s finite.  I plan around this explicitly.

I limit how many PRs one person can have open at once, generation can’t outpace reading.  I count reviewing as real work when discussing sprint capacity.  I ask what a feature costs to review, not just to produce.

I watch delivery not output.  More merged PRs means little if the metrics describing getting value to users remain unchanged.

Generation is cheap now.  Understanding is what you still pay for.
