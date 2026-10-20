---
title: "A brand that has to work as a 16 px favicon and a sticker"
description: "A case study of Klamra, a sample coding school identity: the style, the logos I rejected at 24 px, the 16 px favicon and keyboard accessible stickers."
date: "2026-10-20T11:32:59+02:00"
slug: "a-brand-that-has-to-work-as-a"
tags: ["webdev","design","accessibility","css"]
ogImage: ./og.png
---

For a school with no advertising budget, visibility is crucial in a single frame. The smallest frame the school can appear in is 16 px wide.

Klamra is a sample project. The company and school don’t actually exist and no payment was made for this. It is one of six visual identities in my portfolio, each for an invented Polish company. None of it is client work.

My brief to myself: an online coding school for adults changing careers and school leavers in groups of up to 8, two evenings a week over a 4 month course. Every competitor looks the same; navy background with a purple gradient and a smiling person with a laptop. Klamra needs to be recognisable on a sticker on a student’s laptop. That one constraint decided most of what follows.

## A style that survives cheap reproduction

I was assigned neobrutalism. I used it as the authentic style for a code school and not as a style to mimic.

There are a few basic rules. There are thick black outlines. Shadows are hard offset with no blur. There are only four flat colors: lemon, pink, mint and sky. The display font is Epilogue 900 and all terminal-like elements are in JetBrains Mono. Klamra is the Polish name for a curly brace so the name is also indicative of the content.

```css
:root {
  --lemon: #ffe45c;
  --pink: #ff6fae;
  --mint: #7ee8b3;
  --sky: #7cc7ff;
  --ink: #111;
}

.card {
  background: var(--mint);
  border: 3px solid var(--ink);
  box-shadow: 6px 6px 0 var(--ink);
}

.card h2 {
  font: 900 2rem/1 'Epilogue', sans-serif;
}
```

A shadow without softness is more important than it appears. A soft shadow is a gradient. Gradients are the first to perish in small objects: icons, one colour shirts or stickers. A hard shadow is simply another graphic form.

Now for the exception to this. If your product lives only on screens at large sizes then soft depth is acceptable. The argument against neobrutalism though is that it is a fashion which will date. Probably. However a school with no budget requires a mark that anybody with a printer can reproduce. Outlines plus offset shapes do that.

The text can follow the same tenet. Say what happens, when and for how much. Show the work of a given week rather than promising a dream job. Even the kerning is important. Kl and ra are pulled tighter whilst am and mr are opened a little in order to ensure that a very heavy word maintains an even colour.

## Two logo directions that died at 24 px

I created three icons and dropped two. Both were at 24 px in real size and not scaled up.

![Three logo directions at 24 px. The K made from braces merges into a plain K. The terminal window is too wide. The braces with a cursor block are kept.](https://adrianturbinski.pl/blog-img/a-brand-that-has-to-work-as-a/fig-1.png)

One was a K made from braces. This is the cleverer idea and I still like it a little. At 24 px the arms merge into a plain K. It reads as a letter, not as code, so the one thing it was supposed to say is gone.

The second was a terminal window with a cursor. It looks like every school that has a console behind it and is also too wide for a favicon. A wide rectangle in a square slot shrinks until the detail is gone.

The only part of this worth keeping was the cursor. It moved inside the braces.

The icon that was selected features two thick braces with a pink cursor block between them. All is contained in a yellow frame with a hard shadow. The same drawing works as a sticker, a T-shirt print and a site icon. It also works because the cursor gives the braces a reason to be there. Braces by themselves are punctuation. Braces with a cursor are an editor waiting for you to type.

## From 24 px down to 16 px

The full mark with frame and shadow holds up from 24 px. Below that it does not, and I stopped pretending that scaling would fix it.

![Two drawings side by side. The full mark with frame and shadow holds from 24 px. The 16 px favicon is a separate drawing with thicker braces and a smaller cursor.](https://adrianturbinski.pl/blog-img/a-brand-that-has-to-work-as-a/fig-2.png)

The 16 px favicon is actually a separate drawing. The braces become thicker and the cursor becomes smaller. Thicker strokes survive being snapped to a 16 px grid, and a smaller cursor leaves room between them, so the gap isn’t filled in.

The cost is that there are now two versions of the same logo and they need to remain recognisably the same. I keep that honest by comparing them side by side at real size rather than by checking that the paths match.

The rule I took from it: a small size is its own design problem. If your favicon is a scaled down export of the full logo then nobody has ever looked at it.

## Stickers you can move with the arrow keys

The case study page has a laptop lid with draggable stickers and a shuffle button. It is the idea of the brand made interactive: this is what Klamra looks like on your laptop.

I used pointer events to implement drag and the stickers themselves can be keyboard accessed allowing focus and movement using arrow keys. A drag-only toy would leave those without mice excluded and would also be strange to feature in an accessibility conscious portfolio.

Both input paths call one function, so they cannot drift apart.

```ts
const arrows: Record<string, [number, number]> = {
  ArrowLeft: [-8, 0],
  ArrowRight: [8, 0],
  ArrowUp: [0, -8],
  ArrowDown: [0, 8],
};

function place(sticker: HTMLElement, x: number, y: number) {
  sticker.dataset.x = String(x);
  sticker.dataset.y = String(y);
  sticker.style.transform = `translate(${x}px, ${y}px)`;
}

function enableMove(sticker: HTMLElement) {
  sticker.tabIndex = 0;
  sticker.addEventListener('keydown', (event) => {
    const delta = arrows[event.key];
    if (!delta) return;
    event.preventDefault();
    place(
      sticker,
      Number(sticker.dataset.x ?? 0) + delta[0],
      Number(sticker.dataset.y ?? 0) + delta[1]
    );
  });
}
```

The pointer handler uses the current position of the pointer, rather than a delta, in place(). The focus outline appears to be a part of the visual style rather than a browser default fighting it, since it is thick and black like everything else.

## What ships in the folder

Mood boards are not allowed for clients. All identities in the project have a visual reference material (files).

Klamra has files as well.

Logo files are SVG. All characters are converted to paths. Therefore there is no text in the logo files and they do not require any specific installed fonts. There are PNGs at 512, 1024 and 2048 px; favicon, PDF and a logo system in six variants. Color values are shown in HEX, RGB, OKLCH and an approximate CMYK. A WCAG contrast table was generated using a script. All Polish characters are checked in all weights of the fonts used. The fonts are OFL.

The following items were created as well: 12 icons on a 24 px grid, pattern, business card (85 x 55 mm), PDF with 3 mm bleed, letterhead on A4, social media items and an email HTML signature. There is also an animated logo with a duration of 2 to 4 seconds. The animation is exported to WebM and MP4 at 1080 x 1080. A brand book in 16:9 is 27 to 29 pages and is in PDF. There is also a ZIP file that contains all the mentioned items.

All visual elements are created using canvas, CSS, SVG and code. There are no icon libraries or stock photos used. There is a studio folder containing the build scripts. This folder has its own package.json. The build does not get included in the site build. In the build process there is a variable font that is embedded as Type 3 in a Chromium PDF. For the PDFs the font is pinned to one weight and is then embedded as a smaller CID TrueType font.

The case study can be found at [adrianturbinski.pl/wzornik/identyfikacja/klamra](https://adrianturbinski.pl/wzornik/identyfikacja/klamra/). The site is in Polish.

## Limits, and what I would check first

The client doesn’t exist. No one has asked me to make the logo larger. No one has objected to the pink. No one has briefed me.

There has been no user testing. I think the logo is recognisable in one frame because it survives 24 px and 16 px. This speaks to legibility however and not memory. No one has put the logo on a laptop and one week later asked what the logo is. The stickers on the page have been checked for keyboard use but not with actual users. A search for conflicts on the brand name has been done but this is no proof of a clean name and not a legal clearance.

I would like to reiterate however the process I use across all projects. Test the smallest size first and then draw the rest. With the 24 px test two out of three of the directions were eliminated in minutes. If this had been discovered after the brand book had been laid out it would have been much more expensive.

This week view your own favicon at its actual size in a browser tab (not zoomed). If you cannot tell what it is then the full logo is not finished.
