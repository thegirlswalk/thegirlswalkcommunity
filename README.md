# React + Vite

## TGW brand and event gallery

The site uses the official TGW palette, Bebas Neue headings, Instrument Serif
italic (hero subline only), and DM Sans body text. The header is cream with the
burgundy TGW logo (`src/assets/tgw-logo-burgundy-light.png`) and burgundy nav
links. The homepage hero (`HomeHero` in `src/App.jsx`) is an edge-to-edge,
muted, looping background video that fills the whole first screen, running
under the nav: on Home the nav is see-through (cream logo and links over a soft
dark fade) until the visitor scrolls or opens the phone menu, then it turns
cream again (min 560px, 520px on phones): TGW's "2026 Walking Recap" Instagram reel, trimmed
to 0:04–0:38.8 to drop its text cards (`src/assets/hero-reel-wide.mp4` 1080×608
crop for desktop, `hero-reel-tall.mp4` 540×960 for phones ≤768px, plus
`hero-reel-poster-*.jpg` stills). It has a pause/play button, and visitors with
reduced motion see the still only. Burgundy is used as an
accent: the marquee is yellow with burgundy text and the footer is cream. Burgundy `#46172C`
and butter yellow `#FFE99B` lead (buttons and accents). Page sections alternate
between cream `#FDF4EC` (main background) and peach `#FFE1CF` at every divider
line (Home Events and Newsletter, Events-page Past Events, About stats and Our
Community, Gallery grid, album photo grids are peach); the footer takes the opposite colour of each page's last
section (`endsOnPeach` in `App`), and hot pink `#EB1169` is used only as a small
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
Dump cover). Below it, the About page has count-up stats (members, signature
events, total album photos) and an "Our Community" auto-scrolling, draggable
photo strip of hand-picked group shots (`STRIP_PICKS` in `src/App.jsx`).

Scroll and hover effects are dependency-free helpers in `src/App.jsx`
(`Reveal` fade-ups, `Mark` highlighter sweeps, `GrowBar` underline bars,
`CountUp`, `PhotoStrip`) driven by IntersectionObserver, plus `.lift` /
`.lift-card` hover classes in `src/App.css`. All motion is disabled under
`prefers-reduced-motion`.

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
