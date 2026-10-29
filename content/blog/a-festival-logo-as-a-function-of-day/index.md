---
title: "A festival logo as a function of day, stage and tempo"
description: "How I built a deterministic generative logo for a made up festival: what stays fixed, why 12 variants read as one brand, and a sub 10 KB SVG export."
date: "2026-10-29T11:33:52+01:00"
slug: "a-festival-logo-as-a-function-of-day"
tags: ["generative","svg","typescript","webdev"]
ogImage: ./og.png
---

I published six sample identities on 2026-10-07. The identity I spent the most time debating with myself was the identity that is not a single logo.

Nośna is an example identity and not a client project. Nośna is an imagined three day event featuring new media art and electronic music within a converted spinning mill in Lodz. It is one of the six identities within my portfolio. The name comes from the idea of a carrier, specifically a carrier wave. The identity uses three parameters: day, stage and tempo to determine the identity. The case study for this identity is in Polish here: [Nośna case study](https://adrianturbinski.pl/wzornik/identyfikacja/nosna/)

This post is aimed at engineers who enjoy creative coding. There are three decisions made in the creation of this identity and each has a cost. I will outline them. Following this I will explain the generator used on the webpage and the pipeline used to generate the output files.

## What never moves

My first choice was constant versus generated. What never changes is the wordmark in Syne 800, a carrier line and a small receiver ring. Everything above this is generated using the parameters of day, stage and tempo. These three parameters determine the shape, colour, thread count and number of cycles.

![Three inputs, day, stage and tempo, feed a seed. The seed drives the generated shape, colour, thread count and cycles above a fixed wordmark, carrier line and receiver ring.](https://adrianturbinski.pl/blog-img/a-festival-logo-as-a-function-of-day/fig-1.png)

There are four stages: spinning, weaving, dyeing and finishing. These correspond to the four halls, which are named after the mill rooms. The days are Friday, Saturday and Sunday. So we have a tempo parameter and a small closed set. A seed can then be generated.

```ts
type Day = 'fri' | 'sat' | 'sun'
type Stage = 'spinning' | 'weaving' | 'dyeing' | 'finishing'

interface MarkInput {
  day: Day
  stage: Stage
  tempo: number
}

function seedOf({ day, stage, tempo }: MarkInput): number {
  const key = `${day}|${stage}|${tempo}`
  let h = 2166136261
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
```

There is no `Math.random` anywhere in the mark. The same inputs will always yield the same mark. This allows an organiser to send a colleague the three values and get the exact same file back. A poster and a web banner will never diverge.

In exchange, nobody can press a re-roll button. A generator without a re-roll button just doesn’t feel like a toy. I was fine with this because an identity that surprises its owner isn’t actually an identity.

## Why twelve marks still read as one brand

There are 12 versions, 3 days by 4 stages. All use the same thread weight, ring and carrier. The eye picks up the three first, then the difference.

I rejected two designs and will explain both. The first used 4 threads. Four lines give 12 designs that vary only in offset and thread weight within a family. These 12 are presented as a slider in one picture. The second was a moving accent. It was a small part that would change direction for each of the 12 designs. This was too small to carry 12 designs and was invisible on a phone.

There is one situation where extra freedom is warranted. If every artist on the lineup needed their own element, a fixed carrier would be limiting. This would not be an issue for a 3-day event with 4 halls.

My largest concern is that 12 is a tiny output space for a generator. This is accurate. However, the element will be encountered individually, on a ticket, tab or poster. Recognition will be via repetition and not the number of potential outputs.

Below 48 px the element ceases to be a field and becomes a simplified lens. The ring and carrier are on ink, which is what is displayed in the browser tab.

## Colour from the day, on bone

I then chose the day colours. These come only from the day. Friday is vermilion, Saturday is teal and Sunday is magenta. I chose light bone as the background as it breaks from the predominantly dark neon used on club flyers.

![Three contrast ratios of day colours against bone: 2.84 to 1, 2.11 to 1 and 2.78 to 1, with the policy that day colours are decorative and text uses a darker version.](https://adrianturbinski.pl/blog-img/a-festival-logo-as-a-function-of-day/fig-2.png)

I then ran contrast ratios for the day colours against the background. Vermilion: 2.84 to 1, Teal: 2.11 to 1 and Magenta: 2.78 to 1. I would not use these as text.

Therefore the day colours are purely decorative. Text uses a darker version of each colour if it passes AA contrast. I re-ran all 25 of the specified contrast ratios using an independent script. The contrast ratios used in the brand book are independent of the tool used in creating the colour scheme.

A dark background would have given the table more impact. Neon on black is also not inappropriate for a screen in a hall. A contrast table can also be used to retrospectively rationalise a colour decision. In this instance however I used it as a constraint. This highlighted that the colours could be used to indicate the day but not text.

The issue with using "only decoration" is that it is a polite term for using ineffectual colours. I propose that the shape carries the identity and the colour simply labels it. If the colour is removed from a mark it should remain identifiable, as it is in this instance.

I lost the most striking screenshots by choosing bone rather than neon and I still regret this.

## The generator on the page and its SVG

There's also a generator available on the case study page. It is a Preact island which an organiser can use to set the day, stage and tempo. It downloads an SVG under 10 KB with no text elements.

The small file size is largely due to restraint. Threads are represented as paths with integer coordinates, so no number has a long decimal expansion in the output.

```ts
function threads(input: MarkInput, count: number): string[] {
  const next = rng(seedOf(input))
  return Array.from({ length: count }, (_, i) => {
    const y = 10 + i * 12
    const bend = Math.round(next() * 40 - 20)
    return `M0 ${y}C100 ${y + bend} 300 ${y - bend} 400 ${y}`
  })
}
```

Here, `rng` is any small seeded generator. The point is that the seed is used once and the order of drawing is fixed. As a result, appending a thread at the end will not reorder the previous ones.

If the file contains no live text, the file will appear identical on a system that has never used the font. The wordmark is outlined at the time the file is sent to the exporter. Both of these rules can be checked during the build.

```ts
import { readFileSync, statSync } from 'node:fs'

const file = process.argv[2]
const svg = readFileSync(file, 'utf8')
const bytes = statSync(file).size

if (bytes >= 10 * 1024) {
  throw new Error(`too big: ${bytes} bytes`)
}
if (/<text[\s>]/.test(svg)) {
  throw new Error('text element found')
}
```

A budget that lives in a sentence in a case study gets broken by the next edit. A budget that fails the build holds.

## The pipeline behind the files

The generator itself is visible. There is a studio folder that has its own package.json which is not part of the site build. This is where the animations for all six identities are generated, as well as the logos and PDFs.

![A flow of the logo file pipeline: fontkit converts glyphs to paths, SVGO optimises, resvg renders a transparent PNG without a browser.](https://adrianturbinski.pl/blog-img/a-festival-logo-as-a-function-of-day/fig-3.png)

The logos are implemented using SVGs with no text elements. Instead, fontkit will lay out the text and convert every glyph into a path. SVGO is then used to optimize the resulting SVG and finally resvg will render the SVG to a transparent PNG without needing a browser.

```ts
import { openSync } from 'fontkit'

const font = openSync('Syne-ExtraBold.ttf')
const size = 120
const scale = size / font.unitsPerEm
const run = font.layout('Nośna')

let x = 0
const paths = run.glyphs.map((glyph, i) => {
  const d = glyph.path.scale(scale, -scale).translate(x, size).toSVG()
  x += run.positions[i].xAdvance * scale
  return d
})
```

Due to the inclusion of a ś in the name I examine all the Polish characters in all the fonts at all weights for each glyph. Even if the font appears to render well I will not use a font which does not include all Polish characters.

I learnt the second tip by looking at PDFs. Chromium PDFs embed variable fonts as Type 3. If a font is pinned to a specific weight with subset-font the font will be CID TrueType and the PDF will be reduced in size. Data URIs are used for pinned instances of the font in the business cards, letterheads and brand book.

The brand book is an HTML page rendered by Playwright. The page size is set to 1920 by 1080 px in CSS which results in a 1440 by 810 pt sized PDF. I check for the 16:9 aspect ratio rather than 1920 pt. Nośna has 28 pages.

## Give every input a reason

A generative identity is relatively easy to overdo. A generator tends to expose knobs. Each knob can add to the interest in the demo, so it is easy to expose all the knobs. The problems start when the outputs no longer look like one brand.

In Nośna there are three parameters, each with a defined role. The parameter called day controls the colour, stage controls the shape and tempo controls the rhythm of the threads. Everything else remains constant and it is this constant component that makes the system recognisable.

Open the last generator or theming system you released and list all the parameters. For each parameter describe the change a stranger would notice at a glance.

Any parameter which does not cause an obvious change should be removed.
