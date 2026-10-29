# Wzornik

Sample websites for made-up businesses. Every business here is invented: the names, people, addresses and prices do not belong to anyone real, and every page says so in its footer. There are no reviews or testimonials. The names were checked against real businesses in the same trade in Wrocław before publishing.

Each site has its own typeface, palette and one signature element, so the ten look like ten different studios made them.

| Site    | Trade                                 | Path        |
| ------- | ------------------------------------- | ----------- |
| Rozwaga | legal adviser                         | `/rozwaga/` |
| Rubryka | accounting office                     | `/rubryka/` |
| Szkliwo | dental clinic                         | `/szkliwo/` |
| Tafla   | psychotherapy practice                | `/tafla/`   |
| Przędza | flats in a converted mill             | `/przedza/` |
| Kminek  | bistro, Polish and English            | `/kminek/`  |
| Trzask  | coffee roastery with a shop           | `/trzask/`  |
| Próg    | real estate agency                    | `/prog/`    |
| Przęsło | hotel with online booking             | `/przeslo/` |
| Docisk  | car service with an AI assistant demo | `/docisk/`  |

## Run it

```sh
yarn install
yarn dev
yarn build
```

`yarn check` runs the Astro type check and Prettier, `yarn test` runs the unit tests.

## How it is built

One Astro project, ten sites. Each site keeps its pages in `src/pages/<slug>/`, its components, styles and data in `src/sites/<slug>/` and its fonts in `public/<slug>/fonts/`. Nothing is shared between sites except the sample note in the footer and the link helper. The sites ship no JavaScript unless a page needs it; the shop, the agency, the hotel and the car service use small Preact islands for the cart, the filters, the booking flow and the assistant.

There is no back end. Forms validate in the browser and end with a message that nothing was sent. Carts and bookings live in `localStorage`.

The build is served from the portfolio at `/wzornik/`.
