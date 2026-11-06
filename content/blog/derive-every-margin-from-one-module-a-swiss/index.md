---
title: "Derive every margin from one module, a Swiss grid in code"
description: "How one square sets margins, name height and clear space in a sample Swiss identity, with the trade-offs and one honest gap."
date: "2026-11-06T11:33:54+01:00"
slug: "derive-every-margin-from-one-module-a-swiss"
tags: ["webdev","css","designsystems","frontend"]
ogImage: ./og.png
---

I made one square control all the margins in a logo system. I would do it again. There is a trade off as nothing can be adjusted by eye in the system.

Rzut is a logo system I created for an invented 5 person architecture studio based in Wroclaw. It is a logo created for a fictional studio as part of a series of six studio identities I created for my portfolio. Rzut is not client work. All strategy, logos, files and the presentation of those items are mine.

I write about it here because it is a layout problem as much as a design one. If you are creating a layout or design system or design tokens these examples will be recognisable. I made three decisions, each with a price.

## The brief and the first decision

Rzut is Polish for floor plan. The studio creates houses, small offices and public buildings in Lower Silesia for private investors, developers and municipalities that run competitions. Previously drawings were signed with a logo set in Arial and offers went out as PDFs exported from Word.

The most problematic element within the existing identity was the construction site board. The studio name became obscured behind the investor's details. As a result the mark had to hold its own next to other people's logos.

My first decision was the style. I chose Swiss modernism with one type family, Instrument Sans, black and white, and a visible 12 column grid. Text is set left aligned with a ragged right edge. Index numbers sit in the margin.

The trade-off is sameness. Swiss restraint is the default look of architecture, so I give up surprise and bet on discipline. This would not suit a hotel with a vineyard or a bakery, as these brands require warmth. However, for a studio whose product is drawings, a grid that anyone can see is part of the pitch.

One family also removes the usual place to hide weak decisions. Without a second typeface to add contrast, spacing has to do the work. That pressure is what led to the module.

## Cobalt instead of Swiss red

Traditionally the Swiss identities have been black, white and red. I chose cobalt.

There were two issues here. Firstly cobalt has an association to a blueprint; this is a desirable association for an architecture studio. The second issue was that another of the sample brands within the same portfolio also employs black, white and red. We have six identities that are meant to look like six different companies. They cannot share a signal colour.

Secondly there was an issue with the series and not with just this particular identity. This can be particularly problematic when creating individual identities as it can be easy to overlook issues with the overall series. A colour palette is only distinct relative to the other palettes in the same room.

The issue with cobalt is that it reads as corporate more easily than red and also loses some of the urgency of the Swiss poster tradition. I am okay with this. For a studio that signs technical drawings, urgency is not required, instead it needs to look exact. Every text and background pair still gets its WCAG ratio from a script, so the colour is checked rather than trusted.

## The module

The mark consists of a cobalt square with an entrance. This is the simplest floor plan of a room. I refer to this as the module. It does more than just sit next to the name.

![A cobalt square labelled one module, a gap of two modules, then the name whose height equals one module. Margins and clear space are also one module.](https://adrianturbinski.pl/blog-img/derive-every-margin-from-one-module-a-swiss/fig-1.png)

The height of the square is equal to the capital R. The gap between the square and the name is two modules. The margins originate from the module as does the clear space around the lockup. The name is laid out and converted to paths in the build. Therefore the name has no text element and its height is a fixed measurement that the square can match.

In code the whole relationship is almost embarrassingly small:

```ts
export interface Lockup {
  module: number;
}

export function gap(l: Lockup): number {
  return l.module * 2;
}

export function nameHeight(l: Lockup): number {
  return l.module;
}

export function margin(l: Lockup): number {
  return l.module;
}
```

On a page the same rule becomes one custom property that everything else derives from:

```css
.lockup {
  display: flex;
  align-items: center;
  gap: calc(var(--module) * 2);
  padding: var(--module);
}

.lockup__mark {
  width: var(--module);
  height: var(--module);
}

.lockup__name {
  font-size: calc(var(--module) / var(--cap-ratio));
}
```

I rejected two more proposals. The first was an index number that changes with every project. A digit provides no signet. The studio requires one constant mark. The second was an axis line through the name. At 24 px it disappears. A crossed letter looks struck out.

Both of these were rejected for the same reason. They introduced a variable into a mark that has to be the one fixed thing on the site board. The module has no variables, only a size.

## Sizes and the grid tester

A rule that derives everything from one length also tells you where the system stops working. The signet works from 16 px. The horizontal lockup works from 96 px. The full version with the caption works from 280 px.

![A ruler showing three variants by width: signet from 16 px, lockup from 96 px, full version with caption from 280 px.](https://adrianturbinski.pl/blog-img/derive-every-margin-from-one-module-a-swiss/fig-2.png)

I store these thresholds as data and not in a brand book as a paragraph. Both the page and the exports use the same answer:

```ts
type Variant = 'signet' | 'lockup' | 'full';

export function variantFor(width: number): Variant {
  if (width >= 280) return 'full';
  if (width >= 96) return 'lockup';
  return 'signet';
}
```

There is also a grid tester on the case study page which allows the rules to be tested rather than read. The 12 column grid can be turned on and off and the module size can be set to 4, 8 or 12 columns. Lockups will snap to the grid and minimum size and clear space can be measured in both px and mm. The mm measurement assumes the CSS reference pixel and thus provides an approximation from screen to paper rather than a print proof.

The page is in Polish, but the tester needs no language: https://adrianturbinski.pl/wzornik/identyfikacja/rzut/

There's one honest gap. The 16 and 32 px favicon.ico files are simple downscales with no pixel snapping. Since this mark is constructed on a strict module, hand-snapped favicons are deserved. A square with an entrance is exactly the shape that blurs at the wrong offset. I shipped the downscale and I know it is the weakest file in the set.

## The module is a spacing token

This is something that anyone that has worked on a design system would be familiar with. The module is a spacing token with a job description. It has one source of truth and all other spacing is derived from that. When that value changes, everything changes at once.

The difference here is the scale. A typical spacing scale has many steps and over time people pick the in-between value that looks right. Rzut has one value and a few multipliers. The strongest objection is that a logo is static artwork and a token system has to serve a living interface. While this is true, I would not force a single module onto a product UI. However, the discipline transfers. Whenever I derive a margin rather than choosing one the review conversation gets shorter since the only question left is whether the module is right.

## What I would check on Monday

Open the spacing scale in your current project and pick the value nobody can explain. If you can’t explain the origin of a value, it’s most likely a guess that made it through review.

I lost some freedom with a system that had one module. I miss being able to tweak a gap by eye, and I still catch my hand reaching for it. No one has pushed back on this rule in the sample studio because there is no real office there.

My rule after this project is: every margin gets a parent and the parent gets a name.
