# React + Vite

## TGW brand and event gallery

The site uses the official TGW palette, Bebas Neue headings, and DM Sans body
text. Burgundy `#46172C` and butter yellow `#FFE99B` lead (navigation, buttons,
Past Events/Gallery sections), cream `#FDF4EC` is the main background, and hot
pink `#EB1169` is used only as a small accent.

The Gallery page's five event covers are configured in `galleryEvents` in
`src/App.jsx` (`src/assets/gallery-*.jpg`). Each card opens an on-site album
page showing curated photos from `src/assets/albums/<slug>/` (resized to max
1000px from the Google Drive albums), with a lightbox and a secondary link to
the full Drive album. The first event, She's the Room, is featured largest.

Photo curation rules for hero, About, covers, and albums: only clear group or
community moments with 2+ people; no solo, founder/exec, scenery, object, or
near-duplicate shots. Never use `IMG_5069` (swan), `IMG_5071` (founder), or
`IMG_5042` (exec). The About photo is the large 2026 Walk Dump group shot from the
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
