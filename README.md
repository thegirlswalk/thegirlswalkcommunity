# React + Vite

## TGW brand and event gallery

The site uses the official TGW palette, Bebas Neue headings, Instrument Serif
italic (hero subline only), and DM Sans body text. The header is cream with the
yellow-and-burgundy TGW Community logo (`src/assets/tgw-logo-burgundy-yellow.png`) and burgundy nav
links. The homepage hero (`HomeHero` in `src/App.jsx`) is an edge-to-edge,
muted, looping background video that fills the whole first screen, running
under the nav: on Home the nav is see-through (same logo with a soft cream glow,
cream links, soft dark fade) until the visitor scrolls or opens the phone menu, then it turns
cream again (min 560px, 520px on phones). The hero heading is solid white with
"COMMUNITY" beneath it in spaced peach italics (`.home-hero-sub`), and
the typed blurb (`HERO_BLURB`) shows "for ambitious women, by ambitious women" in pink.
The video is TGW's walks & events recap (portrait source), trimmed to 98.2s to drop
its black ending, muted, 24fps (`src/assets/hero-reel-wide.mp4` 720×405
crop for desktop, `hero-reel-tall.mp4` 540×960 for phones ≤768px, plus
`hero-reel-poster-*.jpg` stills of the opening group shot). It has a pause/play button, and visitors with
reduced motion see the still only. Burgundy is used as an
accent: the Home marquee is burgundy with yellow text and peach dot separators, and the footer is a single
"© 2026 TGW Community" line plus nav and socials. The look is flat: 1px burgundy outlines (`BORDER`), no solid offset
"sticker" shadows, and hovers just lift slightly (polaroids keep a soft blurred shadow).
The WhatsApp invite link is `WHATSAPP_URL` in `src/App.jsx`. Burgundy `#46172C`
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
largest. Gallery ("Community Archives") and Events-page Past Events show the
covers as floating polaroids with a short blurb under each caption (one column on
phones). Home's Past Events uses `PastEventCards` (title, date and blurb above
the photo; 3 + 2 grid). Event blurbs and full stories live in
`src/eventStories.js` (`EVENT_STORIES`, keyed by album slug).

Photo rules for hero, About, and covers: only clear group or community moments
with 2+ people; no solo, founder/exec, scenery, object, or near-duplicate shots.
Albums include all Drive photos that show people, excluding scenery/object-only
shots (food, products, signs, empty rooms, landscapes), exact duplicates, and
`IMG_5069` (swan), `IMG_5071` (founder), and `IMG_5042` (exec), which are never
used anywhere. The
About photo is the large 2026 Walk Dump group shot from the
website reference doc (`src/assets/gallery-2026-walk-dump.jpg`, also the Walk
Dump cover), next to the "Built for women who move with intention" copy. Below it, the About page has count-up stats (3,000+ women in our
community, 20+ events & walks so far) and an "Our Community" auto-scrolling, draggable
photo strip of 11 hand-picked group shots with no near-duplicates, interleaved
so neighbouring photos come from different events (`STRIP_PICKS` in `src/App.jsx`),
shown borderless and flush. The About page also has an "Our Events" section
(`EventStory`: photo, short story, "Read the full story" toggle and "See all
photos" album link per event) and ends with the Our Partners strip.

Scroll and hover effects are dependency-free helpers in `src/App.jsx`
(`Reveal` fade-ups, `Mark` highlighter sweeps, `GrowBar` underline bars,
`CountUp`, `PhotoStrip`) driven by IntersectionObserver, plus `.lift` /
`.lift-card` hover classes in `src/App.css`. All motion is disabled under
`prefers-reduced-motion`. Icons are thin burgundy line-art SVGs (`LineIcon` /
`ICON_PATHS` in `src/App.jsx`), not emoji. The Events, Gallery and album pages
have retro concentric `WaveBands` (left edge + top-right corner; `WAVE_COLORS`
in `src/App.jsx`) that keep moving: the side bands drift in a seamless loop
(`waves-flow`), each band pulses in turn (`wave-breathe`), and the corner sways
and ripples (`waves-sway`); all paused under reduced motion, and the newsletter has wave bands on both sides
(`<WaveBands right corner={false} onScroll/>`) that sweep in when it scrolls into
view, behind a stacked email field + Subscribe button.

Home (and the end of About) has an "Our Partners" yellow section (on Home, between Events and Past Events)
(`PARTNERS` / `PartnerStrip` in `src/App.jsx`): transparent PNG logos from
`src/assets/partners/` on tilted, bobbing sticker cards in an endless strip
(auto-scrolls; drag or swipe; pauses on hover). Hover straightens the sticker
and colours its shadow and name tag with the brand `accent`. It shares the
`useAutoScroll` hook with the About `PhotoStrip`.

The Events page has a short intro blurb, white November 2026 and March 2027
event cards, and a Past Events polaroid grid. Shop is intentionally absent until merch is
available. Shopify donation configuration remains in `src/shopify.js`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
