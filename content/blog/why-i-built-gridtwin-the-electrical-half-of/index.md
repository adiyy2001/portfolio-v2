---
title: "Why I built gridtwin, the electrical half of a single-line diagram"
description: "A case study of gridtwin: three design decisions behind an educational power flow twin, with the numbers, the trade-offs and the limits I state up front."
date: "2026-10-27T11:33:52+01:00"
slug: "why-i-built-gridtwin-the-electrical-half-of"
tags: ["java","angular","architecture","testing"]
ogImage: ./og.png
---

A single-line diagram shows connections between objects. However, it does not show what flows between them. This was troubling to me for some time and so I decided to address this issue.

I currently work on software which draws single-line diagrams of high-voltage substations: Angular and diagram rendering in the browser, Java 21 and Quarkus behind it. I decided to create the other side of this to model the electrical implications of these diagrams. I called this project gridtwin. It combines domain knowledge, numerical methods, a 3D front end and a Java back end in one place.

Opening a breaker in either the 3D substation or the single-line diagram will cause an AC power flow to redistribute the load, overload a line and potentially cascade into an outage. These simulations are run on the public IEEE 14-bus and IEEE 30-bus test cases. I will show three decisions I would defend in this case study, and also discuss what I left out.

## What a frontend engineer needs from a power flow

A network consists of buses and branches. Each bus has a voltage magnitude and angle. There are loads and generators which consume and produce power. AC power flow uses the power balance at each bus to compute the voltages.

These equations are nonlinear and thus Newton-Raphson is used. Each iteration involves solving a linear system derived from a Jacobian matrix. The Jacobian is sparse as each bus only interacts with its neighbours. There is also a slack bus which absorbs any mismatch that remains and fixes the angle reference.

That is all the theory required for the rest of this post. Overload flags, the cascade and line loading are all computed using the solved voltages.

The solver is thus a function transforming network state into numbers. The UI is a function of those numbers. Each breaker click triggers a new solve. This is only possible because the solve is cheap. For example an IEEE 30 solve from a flat start takes 0.67 ms median compared to a 10 ms target.

## Matching MATPOWER down to the convention

I chose MATPOWER 8.1 as the referee. I created 16 base case reference solutions and 4 N-1 reference files by executing MATPOWER inside Docker using GNU Octave. My solver is tested against these solutions. Voltage magnitude tolerance is 1e-6 pu and angle tolerance is 1e-4 degrees. The maximum error across all tested cases is 8.23e-9 pu and 4.06e-7 degrees.

![A flow: MATPOWER 8.1 in Docker with GNU Octave produces reference solutions, gridtwin is compared against them, and the maximum errors are far below the set tolerances.](https://adrianturbinski.pl/blog-img/why-i-built-gridtwin-the-electrical-half-of/fig-1.png)

This was not achieved through improved solving algorithms or numerics. Rather, it was achieved through attention to modeling conventions. For example, transformer tap locations, handling of reactive limits (all violating generators converted at once or one at a time), and whether the slack generator is limited all affect results to the third decimal place. A solver may be correct but still differ from the reference due to modeling differences. These differences can only be made explicit through documentation. I documented these in an ADR.

Another discovery came from a property test on random stressed networks. There exists a second, low-voltage root of the power flow equations near 0.4 pu. A warm start may settle on this solution. A solution below 0.5 pu now triggers a second run from a flat start.

```ts
function solveSafely(net: Network, warm: Solution): Solution {
  const first = solver.solve(net, warm);
  if (first.minVoltage() < 0.5) {
    return solver.solve(net, Solution.flat(net));
  }
  return first;
}
```

For the narrow case that would have also allowed a loose tolerance, I only need the code to appear correct. The biggest problem with my code is that 1e-6 pu is too strict for an educational toy. I believe the tolerance serves as a warning. Without it, I would not be able to differentiate between a convention and a bug and the wrong root would still be displayed. This would look like a very bad day for the grid.

By matching against MATPOWER I have verified that I have made the same decisions as MATPOWER. This has no implications for an actual grid.

## Islands and a slack per island

A breaker can divide the network into two parts. Prior to the solver seeing the network, the topology processor must deal with the fact that the solver assumes one connected network with one slack.

Islands are created using union-find on branches and closed switching devices connecting nodes. Each energized island is assigned a slack. Islands with no source are de-energized and their load is shed.

```ts
function findIslands(count: number, closed: [number, number][]): number[][] {
  const parent = Array.from({ length: count }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  for (const [a, b] of closed) {
    parent[find(a)] = find(b);
  }
  const groups = new Map<number, number[]>();
  for (let i = 0; i < count; i++) {
    const root = find(i);
    groups.set(root, [...(groups.get(root) ?? []), i]);
  }
  return [...groups.values()];
}
```

This is a TypeScript sketch, but the implementation is in Java. Load shedding involves a modelling decision, with a visible cost. The load is removed from the balance and the choice of slack generator for an island changes who absorbs the mismatch. Both of these options are documented in an ADR rather than being left as defaults within a loop.

Interlocks also exhibit this pattern. A line with an open breaker may still be fed from its far end. There must therefore be a definition of a live portion of the line. Earthing that line is not allowed.

## A fork-join pool for N-1 contingencies

N-1 analysis removes one component from the system and checks if the system remains operative. For the IEEE 30 system 47 outages were generated and each was solved independently using power flow.

![Comparison of measured median times against targets: IEEE 30 single solve 0.67 ms against 10 ms, and N-1 run of 47 outages on 20 threads 8.22 ms against 500 ms.](https://adrianturbinski.pl/blog-img/why-i-built-gridtwin-the-electrical-half-of/fig-2.png)

To solve the outages I use a fork-join pool. In Java 21 virtual threads are the new default. I was initially going to use virtual threads but they enable cheap waiting rather than computation. Our outage solvers do not wait on anything. When our outage solvers run they completely utilise CPU. Beyond the number of cores present there is no benefit to having more threads than cores. A pool bounded to the number of available cores is the correct choice.

Using 20 threads I observe a median of 8.22 ms to compute 47 outages of the IEEE 30 system, against a target of 500 ms. I have chosen a relatively high target so there is scope for the interactive application where each action can trigger a new analysis.

Virtual threads provide value in the scenario where each outage requires fetching something from a database or some other system. In this case the virtual threads will be blocked on each outage and cheap blocking is valuable in this situation.

A fixed sized pool can be considered old-fashioned. Maybe it can. However it is bounded and is visible in the design rather than hidden in the scheduling code. Under load the pool is also relatively easy to reason about. The value is also from a single machine and is used as a measured value rather than a guarantee.

## What I did not build, and where the model stops

I have written down the cuts in ADR 0027. There is no state estimation or fast decoupled power flow. IEEE 30 is solved and tested but there is no substation visible in the UI.

I feel that the sparse Newton-Raphson solve should be well within the computational budget for this system size. A faster approximation would require a second method that would need to agree with the first method. State estimation requires measurements. A twin of a public test system will not have any real measurements to perform state estimation from.

This educational model is built on public test systems. The substation that replaces bus 4 is made up. The cascade is a static reduction. A branch trips the instant it passes 120% of its rating. There is no protection timing. Sessions are stored in memory and the demo resets every hour.

gridtwin is not intended to represent any real power system and none of gridtwin represents any real power system.

## Build the half your drawing leaves out

A diagram consists of assertions about a system. If you only produce diagrams, no one will verify those assertions.

Working on the second half of a system has been more useful to my understanding of the diagrams I make in my job than producing the diagrams themselves. I also lost the safety of a diagram that can’t be wrong, and I miss that a little.

Now open the most recent screen you shipped that draws something from a domain and ask yourself what it would take to check it against an independent reference. If you can name that reference, write the first test this week.

Code available at [github.com/adiyy2001/gridtwin](https://github.com/adiyy2001/gridtwin), MIT. Live demo at gridtwin.adrianturbinski.pl.
