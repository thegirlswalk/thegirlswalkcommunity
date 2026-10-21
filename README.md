# React + Vite

## TGW brand and event gallery

The site uses the official TGW palette, Bebas Neue headings, and DM Sans body
text. The header is cream with the burgundy TGW logo
(`src/assets/tgw-logo-burgundy.png`) and burgundy nav links. Burgundy `#46172C`
and butter yellow `#FFE99B` lead (buttons and accents), peach `#FFE1CF` backs the Past Events/Gallery sections, cream
`#FDF4EC` is the main background, and hot pink `#EB1169` is used only as a small
accent.

The Gallery page's five event covers are configured in `galleryEvents` in
`src/App.jsx` (`src/assets/gallery-*.jpg`). Each card opens an on-site album
page showing that event's Google Drive photos, stored in
`src/assets/albums/<slug>/` (resized to max 1000×1333px), with a lightbox. Album
pages do not link out to Drive; their CTA sends visitors to the homepage
newsletter signup (`#newsletter`). The first event, She's the Room, is featured
largest.

Photo rules for hero, About, and covers: only clear group or community moments
with 2+ people; no solo, founder/exec, scenery, object, or near-duplicate shots.
Albums include all Drive photos that show people, excluding scenery/object-only
shots (food, products, signs, empty rooms, landscapes), exact duplicates, and
`IMG_5069` (swan), `IMG_5071` (founder), and `IMG_5042` (exec), which are never
used anywhere. The
About photo is the large 2026 Walk Dump group shot from the
website reference doc (`src/assets/gallery-2026-walk-dump.jpg`, also the Walk
Dump cover).

The Events page lists the Weekly Walk, a "Something New Is Coming" card, and a
Past Events gallery grid. Shop is intentionally absent until merch is
available. Shopify donation configuration remains in `src/shopify.js`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
