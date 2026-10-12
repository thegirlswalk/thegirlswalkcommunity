# React + Vite

## TGW brand and event gallery

The site uses the official TGW palette, Bebas Neue headings, and DM Sans body
text. Navigation and donation highlights use yellow `#FFE99B` with deep plum
`#46172C`; the main background is cream `#FDF4EC`.

The Gallery page's five event covers and album links are configured in
`galleryEvents` in `src/App.jsx`. Cover images in `src/assets/gallery-*.jpg`
come from the supplied website reference. Each card opens an on-site album page
showing curated photos from `src/assets/albums/<slug>/` (18 per event, resized
to max 1000px from the Google Drive albums), with a lightbox and a link to the
full Drive album. To add an event, add a cover, a photo folder, and a
`galleryEvents` entry. Keep the Drive folders shared as **Anyone with the link -
Viewer**. The first event, She's the Room, is featured largest.

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
