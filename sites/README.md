# Wzornik

Sample websites for made-up businesses. Every business here is invented: the names, people, addresses and prices do not belong to anyone real, and every page says so in its footer. There are no reviews or testimonials. The names were checked against real businesses in the same trade in Wrocław before publishing.

Each site has its own typeface, palette and one signature element, so the ten look like ten different studios made them.

| Site         | Trade                               | Path             |
| ------------ | ----------------------------------- | ---------------- |
| Sygnet       | law firm                            | `/sygnet/`       |
| Kajet        | accounting office                   | `/kajet/`        |
| Emalia       | dental practice                     | `/emalia/`       |
| Otoczak      | psychotherapy practice              | `/otoczak/`      |
| Cegielnia 14 | lofts in a former brickworks        | `/cegielnia-14/` |
| Szczypta     | bistro, Polish and English          | `/szczypta/`     |
| Ziarnik      | coffee roastery with a shop         | `/ziarnik/`      |
| Klamka       | estate agency, a listings magazine  | `/klamka/`       |
| Brelok 1912  | boutique hotel, Polish and English  | `/brelok/`       |
| Nakrętka     | car repair shop with a price widget | `/nakretka/`     |

The ten sites that came before them (Rozwaga, Rubryka, Szkliwo, Tafla, Przędza, Kminek, Trzask, Próg, Przęsło, Docisk) were removed. Their old addresses stay as small noindex pages in `public/<old>/` that send the visitor to the site that took the same trade.

## Run it

```sh
yarn install
yarn dev
yarn build
```

`yarn check` runs the Astro type check and Prettier, `yarn test` runs the unit tests.

## How it is built

One Astro project, ten sites. Each site keeps its pages in `src/pages/<slug>/`, its components, styles and data in `src/sites/<slug>/` and its fonts in `public/<slug>/fonts/`. Nothing is shared between sites except the sample note in the footer and the link helper. The sites ship no JavaScript unless a page needs it; interactive parts such as the cart, the listing filters, the booking flow and the price widget run as small Preact islands.

There is no back end. Forms validate in the browser and end with a message that nothing was sent. Carts and bookings live in `localStorage`.

The build is served from the portfolio at `/wzornik/`.
