# React + Vite

## TGW brand and event gallery

The site uses the official TGW palette and two fonts throughout: Bebas Neue
headings and DM Sans body text (exceptions: the homepage hero title uses the
logo's Montserrat Black Italic). The header is cream with the
yellow-and-burgundy TGW Community logo (`src/assets/tgw-logo-burgundy-yellow.png`) and burgundy nav
links. The homepage hero (`HomeHero` in `src/App.jsx`) is an edge-to-edge,
muted, looping background video that fills the whole first screen, running
under the nav: on Home the nav is see-through (same logo with a soft cream glow,
cream links, soft dark fade) until the visitor scrolls or opens the phone menu, then it turns
cream again (min 560px, 520px on phones). The hero heading is solid white with
"COMMUNITY" beneath it in spaced peach italics (`.home-hero-sub`), and
the typed blurb (`HERO_BLURB`) is all white, with its key phrases in bold.
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
line (Home Events and Newsletter, Events-page Past Events, Gallery grid, album photo grids are peach); the footer takes the opposite colour of each page's last
section (`endsOnPeach` in `App`), and hot pink `#EB1169` is used only as a small
accent (eyebrows and event dates; the About page is the exception, with
colour-blocked sections). All underlines (`GrowBar` bars, nav hover, link
underlines) and the event-card tag pills are brand orange `#FF8944`. The
favicon / apple-touch icon (`public/favicon.png`, `public/apple-touch-icon.png`)
is the burgundy TGW wordmark on cream.

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
used anywhere.

The About page (`AboutPage` in `src/App.jsx`, `.about-*` styles at the end of
`src/App.css`) opens with the original split top: the parallaxing 2026 Walk Dump group
photo (`src/assets/gallery-2026-walk-dump.jpg`) in a rounded, bordered frame taking the right three-quarters and a cream panel
with a large one-line "ABOUT US" heading on the left, underlined across the bottom by a
hand-drawn burgundy marker stroke with an orange echo that draw in on load (heading above the photo on phones; no
scrolling banner); an orange "Who We Are" statement with a curved top, highlighted belief
line ("TheGirlsWalk Community was founded in April 2026 with a simple belief")
and count-up stats (3,000+ women in our community, 20+ events & walks so far),
meeting the next section in a wavy orange edge with drifting gold / rose / berry
bands (`AboutWaveDivider`); a plum "Built for women who move with intention." section with a sticky heading,
the mission / approach / belief / vision copy, and four cream "What We Do"
cards (`ABOUT_PILLARS`); a peach "Our Events" section (`EventStory`: photo,
short story, "Read the full story" toggle and "See all photos" album link per
event); a cream "Our Community" auto-scrolling, draggable photo strip of 11
hand-picked group shots with no near-duplicates, interleaved so neighbouring
photos come from different events (`STRIP_PICKS` in `src/App.jsx`); and the
Our Partners strip. Accents on About are orange (`#FF8944`).

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

Home (and the end of About) has an "Our Partners" white section (on Home, between Events and Past Events)
(`PARTNERS` / `PartnerStrip` in `src/App.jsx`): transparent PNG logos from
`src/assets/partners/` on tilted, bobbing sticker cards in an endless strip
(auto-scrolls; drag or swipe; pauses on hover). Hover straightens the sticker
and colours its shadow and name tag with the brand `accent`. It shares the
`useAutoScroll` hook with the About `PhotoStrip`.

The Events page has a short intro blurb, white November 2026 and March 2027
event cards, and a Past Events polaroid grid. Shop is intentionally absent until merch is
available. The Donate page embeds the Zeffy donation form inline
(`DONATE_EMBED_URL` in `src/App.jsx`, `.donate-embed` in `src/App.css`); Zeffy
handles amounts, payment and receipts. The iframe height follows Zeffy's
`zeffy-embed:step-changed` messages (short for the amount steps, tall for the
`payment` step), and a "Form not loading?" link opens the public form
(`DONATE_URL`). On phones the form sits right under the heading and intro, above
the three pillars (`.donate-grid` / `.donate-pillars` order in `src/App.css`). `src/shopify.js` is no longer used by the Donate page.

**App store pages.** `/privacy`, `/support`, `/community-guidelines` and `/delete-account` are plain
static pages in `public/<page>/index.html`, styled by `public/legal/legal.css`
(not part of the React app, so store reviewers and crawlers can read them
without JavaScript). The footer links to them. Google Play Console uses
`/privacy` as the privacy policy URL and `/delete-account` as the account
deletion URL; keep the legal name (TheGWalk Community) and contact email in
these pages matching the store accounts. `public/googled11720453867eaf2.html`
is Google's site-ownership verification file. Don't delete or rename it.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
