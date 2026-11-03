---
title: "Building an identity from noise that still exports cleanly"
description: "A case study of Skibka, a sample bakery identity: stamp mark, SVG noise edges, a seeded click-to-stamp element, and what the noise did to the export chain."
date: "2026-11-03T11:33:50+01:00"
slug: "building-an-identity-from-noise-that-still-exports"
tags: ["webdev","javascript","design","frontend"]
ogImage: ./og.png
---

I started with the loudest brand in my portfolio series because this was the most likely to break my export chain.

Skibka is a sample project for a fictional sourdough bakery located in Krakow. It is one of six identities in my portfolio series, never client work, and every page footer says so. The case study page itself is in Polish.

This post is directed at designers and front-end engineers. I will outline three decisions, the trade-offs behind each, and where the result falls short of my own plan.

## A brief with one stamp and one printer

The invented bakery is located in Podgorze. It has one oven and a 36 hour rhythm, because the dough matures for two days before baking. It sells through a window onto the street and delivers to four cafes. Before my identity, bags were signed with a pen.

My goal was to create an identity for the bakery that could be applied by the bakery itself at a low cost using only one printer and one rubber stamp that does not look like a chain store.

This became my initial point of departure. The mark had to be something you can press into a paper bag, so it had to be a stamp. I rejected two other directions. The first was a slice of bread with an S in it. At 24 px the S vanishes and a slice reads as supermarket toast. The second idea was a wheat ear made of three strokes. This is the most common bakery mark in Poland. It says nothing about sourdough and cannot be stamped on a bag in a way that looks like it belongs to this bakery.

The stamp survived because it works in three places at once. As an avatar and browser tab icon, as an imprint on a paper bag and as a quality mark on the cafe deliveries.

## Noise as a material, and why it went first

Organic craft style. No perfect circles or straight lines. All elements (pattern, paper grain and stamp rim) use SVG feTurbulence noise. Colours come from flour, crust and rye. The typeface is Young Serif with Karla.

The filter is small. This is the shape of the idea, not the production file.

```html
<svg width="0" height="0" aria-hidden="true">
  <filter id="rim" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.04"
      numOctaves="3" seed="7" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="6"/>
  </filter>
</svg>
```

This type of filter is a vector implementation of a raster effect. This is the worst scenario for export because of this. SVG renders perfectly in the browser. For transparent PNGs the noise must be rendered at three sizes. For print PDFs feTurbulence does not exist so somewhere in the pipeline the output must be flattened to pixels. For video every frame must render the noise identically.

So I started with Skibka as the foundation brand. The rationale was if the chain can support Skibka then they can support the remaining five.

I’ll allow one exception to that. If a mark needs to be processed by a machine within a specific tolerance (die cut, embroidery, etc) then a clean path is desired and noise is problematic. In the case of a rubber stamp the opposite is true. The imperfection is the process.

## Same number, same imprint

There is also a click to stamp interaction on the page. Each time you click you create an imprint. Each rim is a little different. The rule is that the imprint is created from a seed which is the number of the imprint. This means that the same number will always create the same imprint.

![Flow from imprint number to seed generator to a fixed imprint. Same number gives the same imprint, and imprint 2 differs from imprint 3.](https://adrianturbinski.pl/blog-img/building-an-identity-from-noise-that-still-exports/fig-1.png)

The objection I expected was that randomness and a brand do not mix. A brand requires a single answer. My answer to this is that noise with a fixed seed is not random, it is a fixed shape. The only way to observe variation is to request imprint 2 then later imprint 3.

A small seeded generator is all that is required.

```ts
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function imprint(n: number) {
  const rand = mulberry32(n);
  return {
    seed: Math.floor(rand() * 1000),
    rotate: (rand() - 0.5) * 6,
    pressure: 0.85 + rand() * 0.15
  };
}
```

The click handler then only writes those values into the filter and the element.

```ts
const turbulence = document.querySelector<SVGFETurbulenceElement>(
  '#rim feTurbulence'
)!;
const stamp = document.querySelector<SVGElement>('#stamp')!;

export function press(n: number) {
  const { seed, rotate, pressure } = imprint(n);
  turbulence.setAttribute('seed', String(seed));
  stamp.style.transform = `rotate(${rotate}deg)`;
  stamp.style.opacity = String(pressure);
}
```

The practical benefit is testability. A bug report can say imprint 14 looks wrong and you can reproduce it exactly. This is also the reason I seed every simulator I write.

## Legibility at 48 px and at 16 px

A noisy, detailed stamp is not suited to a browser tab. Thus there is two levels to the stamp.

The detailed stamp is used from 48 px. At smaller sizes the rim becomes indistinct and the internal text disappears. At smaller sizes I use a thick ring with a simple loaf. This can be used at 16 px and still be readable.

This is a distinct drawing and not a downscale. A downscale retains all the information but causes legibility to be lost. Therefore the small stamp contains less information intentionally.

This is the same as the rejected S slice. The S was tested at 24 px and the letter disappeared. It can take a few minutes to inspect a stamp at its smallest possible size. If this occurs after the files have shipped then it is far more costly.

## What it cost and what is still open

Skibka ended at 13 MB published against a 12 MB budget. The hard cap per brand was 16 MB and the whole set ended at 60 MB. So I was above target but under the hard cap. I chose the budget and then I broke the budget. That can be said of most budgets. However I do still find this slightly problematic as I had a rule and the noisiest brand failed to adhere to this rule.

![Bar scale showing Skibka at 13 MB, above the 12 MB budget and under the 16 MB hard cap.](https://adrianturbinski.pl/blog-img/building-an-identity-from-noise-that-still-exports/fig-2.png)

Then there is the simpler constraint. The bakery is invented so this stamp has not been pressed into a real bag by anyone. We also do not have experience with a real printer and a real rubber stamp, and their cost is untested. What the case study provides is the design, the files and the build, and not a result with a customer.

If you read Polish, the full case study is at https://adrianturbinski.pl/wzornik/identyfikacja/skibka/ and it lists every file in the set.

## Build the worst asset first

Pick an asset that is processed the worst in your pipeline. For me it was a noise filter. For you it may be a gradient in a video frame, a variable font in a PDF or a blur in a PNG.

Start there. As long as the chain survives this asset, the rest will largely be repetition.

For designs that require variation, seed them. This means that the same number will produce the same result and you can talk about a specific imprint rather than a feeling.
