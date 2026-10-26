import { Children, useEffect, useRef, useState } from "react";
import tgwLogo from "./assets/tgw-logo-burgundy-glow.png";
import { EVENT_STORIES } from "./eventStories";
import "./App.css";

// ── IMAGES ─── Change these to update photos on the site ───
// Hero (front page main photo)
// Homepage hero: TGW's "2026 Walking Recap" Instagram reel (0:04–0:38.8, muted, no text cards).
// Wide = 1080×608 crop for desktop; tall = 540×960 for phones.
import heroReelWide from "./assets/hero-reel-wide.mp4";
import heroReelTall from "./assets/hero-reel-tall.mp4";
import heroPosterWide from "./assets/hero-reel-poster-wide.jpg";
import heroPosterTall from "./assets/hero-reel-poster-tall.jpg";
// Gallery cover photos
import galleryBrunch from "./assets/gallery-meet-the-girls-brunch.jpg";
import galleryMayFlower from "./assets/gallery-may-flower.jpg";
import galleryPilates from "./assets/gallery-pilates-picnic.jpg";
import galleryRoom from "./assets/gallery-shes-the-room.jpg";
import galleryWalks from "./assets/gallery-2026-walk-dump.jpg"; // also used for About
import partnerGinny from "./assets/partners/ginny.png";
import partnerLoccitane from "./assets/partners/loccitane.png";
import partnerChickfila from "./assets/partners/chickfila.png";
import partnerGreenhouse from "./assets/partners/greenhouse.png";
import partnerHeali from "./assets/partners/heali.png";
import partnerEatsByEmee from "./assets/partners/eatsbyemee.png";
import partnerZakilo from "./assets/partners/zakilobakes.png";
import partnerScnt from "./assets/partners/scnt.png";
import partnerGoodForm from "./assets/partners/goodform.png";
import partnerMercified from "./assets/partners/mercifiedoven.png";

// Event album photos: Drive photos that show people (no scenery/object-only shots,
// duplicates, or IMG_5069/5071/5042), resized. Files live in src/assets/albums/<slug>/.
const sortedUrls = modules => Object.keys(modules).sort().map(k => modules[k]);
const ALBUM_PHOTOS = {
  room:      sortedUrls(import.meta.glob("./assets/albums/room/*.jpg",      { eager:true, import:"default" })),
  pilates:   sortedUrls(import.meta.glob("./assets/albums/pilates/*.jpg",   { eager:true, import:"default" })),
  mayflower: sortedUrls(import.meta.glob("./assets/albums/mayflower/*.jpg", { eager:true, import:"default" })),
  brunch:    sortedUrls(import.meta.glob("./assets/albums/brunch/*.jpg",    { eager:true, import:"default" })),
  walks:     sortedUrls(import.meta.glob("./assets/albums/walks/*.jpg",     { eager:true, import:"default" })),
};
// About page photo strip: hand-picked group shots (2+ people) — indices into each sorted album.
// Near-duplicate shots are left out, and events are interleaved so neighbours differ.
const ALBUM_NAMES = { room:"She’s the Room", pilates:"The Pilates Picnic", mayflower:"May Flowers", brunch:"Meet the Girls Brunch", walks:"a community walk" };
const STRIP_PICKS = { room:[25, 27], pilates:[18, 35], mayflower:[2, 13, 21], brunch:[0, 84], walks:[0, 24] };
const COMMUNITY_STRIP = (() => {
  const lists = Object.entries(STRIP_PICKS).map(([slug, picks]) =>
    picks.map((idx, i) => ({ src: ALBUM_PHOTOS[slug][idx], alt: `Community moment ${i + 1} from ${ALBUM_NAMES[slug]}` })));
  const out = [];
  for (let round = 0; lists.some(l => l[round]); round++) lists.forEach(l => l[round] && out.push(l[round]));
  return out.filter(p => p.src);
})();
// Main community chat (the old link went to the marketplace chat).
const WHATSAPP_URL = "https://chat.whatsapp.com/EY9clAx7vAF51UyoZl3Ww1?s=cl&p=i&mlu=4&ilr=4";

// ── COLOUR PALETTE ─────────────────────────────────────────────
// Official TGW brand palette (Brand Guide, Aug 2026)
const C = {
  pink:    "#EB1169", // primary bold pink
  orange:  "#FF8944", // brand orange
  yellow:  "#FFE99B", // soft brand yellow
  blush:   "#FD92EF", // light pink (logo fill)
  orchid:  "#B34A8E", // deeper pink for subtitle text on cream (AA contrast)
  peach:   "#FFE1CF", // light tint of brand orange; Past Events / Gallery backgrounds
  cream:   "#FDF4EC", // brand cream background
  dark:    "#46172C", // deep plum (primary text / dark sections)
  mid:     "#46172C", // secondary text uses the exact brand plum
  muted:   "#46172C",
  green:   "#3F9B5A", // accent (partner sticker shadows)
  sky:     "#8CCBEB",
};

// ── BOLD EDITORIAL DESIGN TOKENS (ISWIS-inspired) ──────────────
const DISPLAY = "'Bebas Neue','Impact',sans-serif";
const BORDER   = `1px solid ${C.dark}`;

// ── SCROLLING MARQUEE BAND ──
function Marquee({ items, bg = C.yellow, color = C.dark, dot = "#FFFFFF", border }) {
  const strip = [...items, ...items, ...items];
  return (
    <div style={{
      background: bg, overflow: "hidden", whiteSpace: "nowrap",
      borderTop: border, borderBottom: border, padding: "0.6rem 0",
    }}>
      <div className="marquee-track" style={{display:"inline-flex", alignItems:"center"}}>
        {strip.map((t, i) => (
          <span key={i} style={{
            fontFamily: DISPLAY, fontSize: "1.5rem", letterSpacing: "0.06em",
            color, textTransform: "uppercase", padding: "0 1.25rem",
            display: "inline-flex", alignItems: "center", gap: "1.25rem",
          }}>
            {t} <span aria-hidden="true" style={{width:8,height:8,borderRadius:"50%",background:dot,display:"inline-block"}}/>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── SCROLL EFFECTS ── each element animates once, the first time it scrolls into view.
// All motion is switched off in App.css under prefers-reduced-motion.
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

function usePrefersReducedMotion() {
  return useMediaQuery(REDUCED_MOTION);
}

function useInView() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return [ref, seen];
}

// Fades + rises into place. `fill` makes the child stretch (for grid cards).
function Reveal({ children, delay = 0, fill = false, className = "", style }) {
  const [ref, seen] = useInView();
  return (
    <div ref={ref} className={`reveal${fill ? " reveal-fill" : ""}${seen ? " is-visible" : ""} ${className}`}
      style={{...style, "--reveal-delay": `${delay}ms`}}>
      {children}
    </div>
  );
}

// Marker-style highlight that sweeps in left→right behind text.
function Mark({ children, color = C.yellow, delay = 0 }) {
  const [ref, seen] = useInView();
  return (
    <span ref={ref} className={`mark${seen ? " is-visible" : ""}`}
      style={{"--mark": color, transitionDelay: delay ? `${delay}ms` : undefined}}>
      {children}
    </span>
  );
}

// Short accent bar that grows out under a heading.
function GrowBar({ color = C.orange, center = false }) {
  const [ref, seen] = useInView();
  return <div ref={ref} aria-hidden="true" className={`grow-bar${center ? " grow-bar-center" : ""}${seen ? " is-visible" : ""}`} style={{background:color}}/>;
}

// Splits a heading into words that rise in one after another when scrolled into view.
// Plain text is split on spaces; elements (e.g. <Mark>) move as a single word.
function Words({ children, delay = 0 }) {
  const [ref, seen] = useInView();
  let n = 0;
  const pieces = [];
  Children.toArray(children).forEach((child, ci) => {
    if (typeof child === "string") {
      child.split(/(\s+)/).forEach((w, wi) => {
        if (!w) return;
        if (/^\s+$/.test(w)) pieces.push(w);
        else pieces.push(<span key={`${ci}-${wi}`} className="word" style={{"--wi": n++}}>{w}</span>);
      });
    } else if (child?.type === "br") {
      pieces.push(child);
    } else {
      pieces.push(<span key={ci} className="word" style={{"--wi": n++}}>{child}</span>);
    }
  });
  return <span ref={ref} className={`words${seen ? " is-visible" : ""}`} style={{"--wd": `${delay}ms`}}>{pieces}</span>;
}

// Wavy rug-style colour bands (inspired by the brand moodboard rug) that hug the left edge
// and curl into the top-right corner. Each band is a filled shape, layered widest-first,
// so they read as soft concentric stripes. The parent needs position:relative and
// isolation:isolate. `left`/`corner` pick which pieces to show.
const WAVE_COLORS = ["#EBC3B0", "#C97D93", "#A9A23A", "#D9B45E", "#A04C6E", "#5B1730"];

// Each left band repeats every WAVE_PERIOD units and is drawn 1.5 periods past both ends,
// so sliding it up by one period (CSS `waves-flow`) loops seamlessly.
const WAVE_PERIOD = 500;
const LEFT_BAND = WAVE_COLORS.map((_, i) => {
  const base = 130 - i * 20;
  const pts = [];
  for (let y = -WAVE_PERIOD; y <= 1000 + WAVE_PERIOD; y += 10) {
    const t = (2 * Math.PI * y) / WAVE_PERIOD;
    const x = base + 22 * Math.sin(t + 0.6) + 9 * Math.sin(2 * t + i * 0.5);
    pts.push(`${x.toFixed(1)} ${y}`);
  }
  return `M0 ${-WAVE_PERIOD} L${pts.join(" L")} L0 ${1000 + WAVE_PERIOD}Z`;
});

// Arcs run a little past 0–90° so the gentle sway never uncovers the corner.
const CORNER_BAND = WAVE_COLORS.map((_, i) => {
  const r = 280 - i * 38;
  const pts = [];
  for (let t = -12; t <= 102; t += 3) {
    const a = (t * Math.PI) / 180;
    const rr = r + 16 * Math.sin(a * 5 + i * 0.5);
    pts.push(`${(300 - rr * Math.cos(a)).toFixed(1)} ${(rr * Math.sin(a)).toFixed(1)}`);
  }
  return `M340 -40 L${pts.join(" L")} L340 ${(r + 40).toFixed(0)}Z`;
});

const bandPaths = (shapes) => shapes.map((d, i) => (
  <path key={i} className="wave-band" d={d} fill={WAVE_COLORS[i]} style={{"--i": i}}/>
));

function WaveBands({ left = true, right = false, corner = true, onScroll = false }) {
  const [ref, seen] = useInView();
  const cls = "waves-layer" + (onScroll ? " waves-on-scroll" + (seen ? " is-visible" : "") : "");
  return (
    <div ref={ref} className={cls} aria-hidden="true">
      {left && (
        <svg className="waves waves-left" viewBox="0 0 170 1000" preserveAspectRatio="none">
          <g className="waves-flow">{bandPaths(LEFT_BAND)}</g>
        </svg>
      )}
      {right && (
        <svg className="waves waves-right" viewBox="0 0 170 1000" preserveAspectRatio="none">
          <g transform="translate(170 0) scale(-1 1)">
            <g className="waves-flow waves-flow-alt">{bandPaths(LEFT_BAND)}</g>
          </g>
        </svg>
      )}
      {corner && (
        <svg className="waves waves-corner" viewBox="0 0 300 300" preserveAspectRatio="xMaxYMin meet">
          <g className="waves-sway">{bandPaths(CORNER_BAND)}</g>
        </svg>
      )}
    </div>
  );
}

// Wavy orange edge + retro bands where the About "Who We Are" (orange) section
// meets the plum section. The group drifts sideways one wave period on a loop.
const DIVIDER_PERIOD = 300;
function wavePath(y, amp, width) {
  let d = `M0 ${y} Q${DIVIDER_PERIOD / 4} ${y - amp} ${DIVIDER_PERIOD / 2} ${y}`;
  for (let x = DIVIDER_PERIOD; x <= width; x += DIVIDER_PERIOD / 2) d += ` T${x} ${y}`;
  return d;
}
const DIVIDER_W = 1500;
const DIVIDER_BANDS = ["#D9B45E", "#C97D93", "#A04C6E"];
function AboutWaveDivider() {
  return (
    <svg className="about-wave-divider" viewBox="0 0 1200 64" preserveAspectRatio="none" aria-hidden="true">
      <g className="about-wave-drift">
        {DIVIDER_BANDS.map((c, i) => (
          <path key={c} d={wavePath(25.5 + i * 7, 12, DIVIDER_W)} fill="none" stroke={c} strokeWidth="7"/>
        ))}
        <path d={`${wavePath(22, 12, DIVIDER_W)} L${DIVIDER_W} 0 L0 0 Z`} fill="#FF8944"/>
      </g>
    </svg>
  );
}

// Moves an element a little slower/faster than the page while scrolling. Uses the
// parent's position so the element's own offset doesn't feed back. `clamp` limits
// the offset to a fraction of the parent's height (for images scaled up to cover).
function useParallax(speed, clamp) {
  const ref = useRef(null);
  const reduceMotion = usePrefersReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      let y = (r.top + r.height / 2 - window.innerHeight / 2) * speed;
      if (clamp) y = Math.max(-r.height * clamp, Math.min(r.height * clamp, y));
      el.style.translate = `0 ${y.toFixed(1)}px`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive:true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      el.style.translate = "";
    };
  }, [speed, clamp, reduceMotion]);
  return ref;
}

// Counts up from 0 when scrolled into view.
function CountUp({ to, suffix = "" }) {
  const [ref, seen] = useInView();
  const reduceMotion = usePrefersReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen || reduceMotion) return;
    let raf;
    const start = performance.now();
    const tick = now => {
      const t = Math.min(1, (now - start) / 1600);
      setN(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, reduceMotion, to]);
  return (
    <span ref={ref}>
      <span aria-hidden="true">{(reduceMotion ? to : n).toLocaleString("en-CA")}{suffix}</span>
      <span className="sr-only">{to.toLocaleString("en-CA")}{suffix}</span>
    </span>
  );
}

// Thin line-art icons (single burgundy stroke) used instead of emoji.
const ICON_PATHS = {
  community: <>
    <circle cx="23" cy="22" r="7"/><path d="M9 50c0-8.5 6.3-15 14-15s14 6.5 14 15"/>
    <circle cx="43" cy="20" r="6"/><path d="M35 33.5c2.3-1.6 5-2.5 8-2.5 7.2 0 13 6 13 14.5"/>
  </>,
  wellness: <>
    <path d="M32 13c6.5 7 8.5 16 0 27-8.5-11-6.5-20 0-27z"/>
    <path d="M29.5 40C21 39 14 33 12 23c8 .3 14.5 4.3 17.5 11"/>
    <path d="M34.5 40C43 39 50 33 52 23c-8 .3-14.5 4.3-17.5 11"/>
    <path d="M28 41.5c-9 2.2-17 .3-22-5.5 5.5-3 12-3.4 18-.8"/>
    <path d="M36 41.5c9 2.2 17 .3 22-5.5-5.5-3-12-3.4-18-.8"/>
    <path d="M20 50h24"/>
  </>,
  growth: <>
    <path d="M32 54V29"/>
    <path d="M32 37c-1.5-9-8.5-14.5-20-14.5 1 10.5 8 15.5 20 14.5z"/>
    <path d="M32 31c.5-10.5 8-16.5 20-16.5-.8 11.5-8 17-20 16.5z"/>
    <path d="M20 54h24"/>
  </>,
  cheers: <>
    <g transform="rotate(10 18 48)"><path d="M12 10h12l-1.6 17a4.4 4.4 0 0 1-8.8 0z"/><path d="M13 19h10.2M18 31.5V48M12.5 48h11"/></g>
    <g transform="rotate(-10 46 48)"><path d="M40 10h12l-1.6 17a4.4 4.4 0 0 1-8.8 0z"/><path d="M40.8 19H51M46 31.5V48M40.5 48h11"/></g>
    <path d="M32 7V2M27 8l-2.5-2.5M37 8l2.5-2.5"/>
  </>,
  calendar: <><rect x="10" y="14" width="44" height="40" rx="5"/><path d="M10 26h44M22 8v10M42 8v10"/></>,
  pin: <><path d="M32 56S15 40.5 15 27a17 17 0 0 1 34 0c0 13.5-17 29-17 29z"/><circle cx="32" cy="27" r="6"/></>,
  ticket: <><path d="M8 18h48v8a6 6 0 0 0 0 12v8H8v-8a6 6 0 0 0 0-12z"/><path d="M38 18v28" strokeDasharray="3 4"/></>,
  chat: <path d="M10 14h44v28H26l-12 10V42h-4z"/>,
  book: <>
    <path d="M32 18c-6-4.5-13.5-5.5-22-4.5v35c8.5-1 16 0 22 4.5 6-4.5 13.5-5.5 22-4.5v-35c-8.5-1-16 0-22 4.5z"/>
    <path d="M32 18v35M16 24c3.5-.4 7 0 10 1.2M16 32c3.5-.4 7 0 10 1.2M38 25.2c3-1.2 6.5-1.6 10-1.2"/>
  </>,
  door: <>
    <path d="M20 54V8h24v46"/><path d="M20 8l14 5v45l-14-4"/><circle cx="30" cy="35" r="1.2"/>
    <path d="M12 54h40M51 16v7M47.5 19.5h7"/>
  </>,
};

function LineIcon({ name, size = 56, className, style }) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 64 64" fill="none"
      stroke="currentColor" strokeWidth={size < 32 ? 3.5 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  );
}

// Auto-scrolls a horizontal strip whose children are two identical halves (for a
// seamless loop). Drag with a mouse, swipe on touch; pauses on hover/touch/focus.
function useAutoScroll(speed = 0.045) {
  const ref = useRef(null);
  const paused = useRef(false);
  const drag = useRef(null);
  const resumeTimer = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => () => clearTimeout(resumeTimer.current), []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;
    let raf, last = performance.now(), pos = el.scrollLeft;
    const tick = now => {
      const dt = Math.min(now - last, 64);
      last = now;
      if (paused.current || drag.current) {
        pos = el.scrollLeft;
      } else {
        pos += dt * speed;
        const half = el.scrollWidth / 2;
        if (pos >= half) pos -= half;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion, speed]);

  const onPointerDown = e => {
    if (e.pointerType !== "mouse") return;
    drag.current = { x: e.clientX, left: ref.current.scrollLeft };
    ref.current.setPointerCapture(e.pointerId);
  };
  const onPointerMove = e => {
    if (!drag.current) return;
    ref.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const endDrag = () => { drag.current = null; };
  const pause = () => { clearTimeout(resumeTimer.current); paused.current = true; };
  const resume = () => { paused.current = false; };
  const resumeSoon = () => { resumeTimer.current = setTimeout(resume, 1200); };

  return {
    ref,
    onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag,
    onMouseEnter: pause, onMouseLeave: resume,
    onTouchStart: pause, onTouchEnd: resumeSoon,
    onFocus: pause, onBlur: resume,
  };
}

// Auto-scrolling photo strip (About page). Photos sit edge to edge.
function PhotoStrip({ photos, label }) {
  const scroll = useAutoScroll(0.022);
  return (
    <div {...scroll} className="photo-strip" tabIndex={0} role="region" aria-label={label}>
      {[...photos, ...photos].map((p, i) => (
        <div key={i} className="photo-strip-item" aria-hidden={i >= photos.length}>
          <img src={p.src} alt={i < photos.length ? p.alt : ""} loading="lazy" draggable={false}/>
        </div>
      ))}
    </div>
  );
}

const events = [
  {
    id: 2,
    type: "Next Event",
    title: "November Event",
    date: "November 2026 · Details TBA",
    location: "Location TBA",
    desc: "We have an event coming up in November 2026 — details are being finalised. Join our WhatsApp group to be the first to hear the date, location and how to sign up.",
    rsvp: false,
    color: C.pink,
    tag: "Details coming soon",
    joinUrl: WHATSAPP_URL,
  },
  {
    id: 1,
    type: "Upcoming Walk",
    title: "March Walk",
    date: "March 2027 · Stay updated",
    location: "Toronto & GTA",
    desc: "Our next walk is in March 2027. It’s free and all paces are welcome — this is about connection, fresh air, and showing up for yourself and each other. Join our WhatsApp group for updates about this event.",
    rsvp: false,
    color: C.pink,
    tag: "Free · All paces welcome",
    joinUrl: WHATSAPP_URL,
  },
];

const PILL_CTA = {
  background:C.yellow,color:C.dark,border:`1px solid ${C.dark}`,borderRadius:99,
  padding:"0.5rem 1.1rem",fontWeight:800,fontSize:"0.75rem",letterSpacing:"0.06em",textTransform:"uppercase",
  fontFamily:"inherit",textDecoration:"none",cursor:"pointer",whiteSpace:"nowrap",
};

// Info cards shown alongside upcoming events; laid out like EventCard so the row matches.
function InfoCard({ eyebrow, title, desc, cta, onClick, href }) {
  const linkProps = href ? { href, target:"_blank", rel:"noopener noreferrer" } : {};
  const Tag = href ? "a" : "button";
  return (
    <div className="lift-card" style={{background:"#FFFFFF",borderRadius:18,overflow:"hidden",border:BORDER,display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"1.5rem",display:"flex",flexDirection:"column",flex:1}}>
        <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.1em",color:C.pink,textTransform:"uppercase",marginBottom:"0.35rem"}}>{eyebrow}</div>
        <div style={{fontFamily:DISPLAY,fontSize:"2rem",color:C.dark,letterSpacing:"0.02em",lineHeight:1,marginBottom:"0.75rem"}}>{title}</div>
        <p style={{fontSize:"0.9rem",color:C.dark,lineHeight:1.65,margin:"0 0 1.25rem",flex:1}}>{desc}</p>
        <Tag {...linkProps} onClick={onClick} className="lift" style={{...PILL_CTA,alignSelf:"flex-start"}}>{cta}</Tag>
      </div>
    </div>
  );
}

// ── NAVIGATION BAR ──
function NavBar({ page, setPage }) {
  const links = ["Home","About","Events","Gallery","Donate"];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 12);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const active = page.startsWith("Album_") ? "Gallery" : page.startsWith("EventDetail_") ? "Events" : page;
  // On Home, the bar is see-through over the hero video until the visitor scrolls or opens the menu.
  const overHero = page === "Home" && !scrolled && !open;
  const linkColor = overHero ? C.cream : C.dark;
  return (
    <nav className="navbar" style={{
      position:"fixed", top:0, left:0, right:0, zIndex:200,
      background: overHero ? "linear-gradient(180deg, rgba(46,12,28,0.55) 0%, rgba(46,12,28,0) 100%)" : C.cream,
      borderBottom: overHero ? "none" : BORDER,
      boxShadow: scrolled ? "0 10px 30px rgba(70,23,44,0.12)" : "none",
      transition:"box-shadow 0.3s",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 2rem", height:68,
    }}>
      <button className="navbar-brand" onClick={()=>{setPage("Home"); setOpen(false);}} style={{
        background:"none", border:"none", cursor:"pointer",
        display:"flex", alignItems:"center", gap:"0.6rem",
      }}>
        <img src={tgwLogo} alt="TGW Community" style={{height:46, filter: overHero ? "drop-shadow(0 0 1px #FDF4EC) drop-shadow(0 0 4px rgba(253,244,236,0.7))" : "none"}} />
      </button>
      <button
        className="mobile-menu-toggle"
        onClick={()=>setOpen(v=>!v)}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        style={{
          display:"none", background:"transparent", border:`1px solid ${linkColor}`, cursor:"pointer",
          width:40, height:40, borderRadius:"50%", color:linkColor, fontSize:"1.2rem",
          alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        {open ? "✕" : "☰"}
      </button>
      <div className={`nav-links ${open ? "nav-links-open" : ""}`} style={{display:"flex", gap:"0.25rem", alignItems:"center"}}>
        {links.map(l => (
          <button className={`nav-link-button${l==="Donate" ? " nav-donate" : ""}`} key={l} aria-current={active===l ? "page" : undefined} onClick={()=>{setPage(l); setOpen(false);}} style={{
            background: l==="Donate" ? C.yellow : active===l ? C.dark : "transparent",
            color: l==="Donate" ? C.dark : active===l ? C.cream : linkColor,
            border: `1px solid ${l==="Donate" || active===l ? C.dark : "transparent"}`,
            boxShadow: l==="Donate" && active===l ? `0 0 0 1px ${C.dark}` : "none",
            cursor:"pointer",
            padding:"0.4rem 0.85rem", borderRadius:99,
            fontWeight:700, fontSize:"0.78rem", letterSpacing:"0.04em",
            transition:"all 0.15s", textTransform:"uppercase",
            fontFamily:"inherit",
          }}>{l}</button>
        ))}
        <a className="nav-cta-button" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{
          marginLeft:"0.5rem",
          background:C.dark, color:C.cream, border:`1px solid ${C.dark}`, cursor:"pointer",
          padding:"0.5rem 1.2rem", borderRadius:99,
          fontWeight:800, fontSize:"0.8rem", letterSpacing:"0.05em",
          textTransform:"uppercase",
          fontFamily:"inherit", textDecoration:"none",
        }}>Join Us →</a>
      </div>
    </nav>
  );
}

// ── HOME HERO VIDEO ── muted, looping community reel behind the headline.
const HERO_BLURB = [
  { text: "A space " },
  { text: "for ambitious women, by ambitious women", pink: true },
  { text: ", centred on " },
  { text: "wellness", hl: true },
  { text: ", " },
  { text: "networking", hl: true },
  { text: " and " },
  { text: "growing together", hl: true },
  { text: ". It’s a movement, literally." },
];

// Types the sentence out letter by letter. The full sentence is laid out from the start
// (untyped letters are invisible) so nothing shifts, and screen readers get it all at once.
function TypedText({ parts, className, startDelay = 0, speed = 28, reduceMotion }) {
  const total = parts.reduce((n, p) => n + p.text.length, 0);
  const [typed, setCount] = useState(0);
  const count = reduceMotion ? total : typed;
  useEffect(() => {
    if (reduceMotion) return;
    let timer;
    const start = setTimeout(() => {
      timer = setInterval(() => setCount(c => {
        if (c >= total) { clearInterval(timer); return c; }
        return c + 1;
      }), speed);
    }, startDelay);
    return () => { clearTimeout(start); clearInterval(timer); };
  }, [reduceMotion, total, speed, startDelay]);

  const starts = parts.map((_, i) => parts.slice(0, i).reduce((n, p) => n + p.text.length, 0));
  return (
    <p className={className}>
      <span className="sr-only">{parts.map(p => p.text).join("")}</span>
      <span aria-hidden="true">
        {parts.map((p, i) => {
          const left = count - starts[i];
          const shown = Math.max(0, Math.min(p.text.length, left));
          const caretHere = left >= 0 && left < p.text.length && count < total;
          return (
            <span key={i} className={p.hl ? "typed-hl" : p.pink ? "typed-pink" : undefined}>
              {p.text.slice(0, shown)}
              {caretHere && <span className="typed-caret"/>}
              <span style={{visibility:"hidden"}}>{p.text.slice(shown)}</span>
            </span>
          );
        })}
      </span>
    </p>
  );
}

// Reduced motion shows the still poster instead; the button lets anyone pause it.
function HomeHero({ setPage }) {
  const reduceMotion = usePrefersReducedMotion();
  const isPhone = useMediaQuery("(max-width: 768px)");
  const [paused, setPaused] = useState(false);
  const videoRef = useRef(null);
  const mediaRef = useParallax(-0.3);
  const src = isPhone ? heroReelTall : heroReelWide;
  const poster = isPhone ? heroPosterTall : heroPosterWide;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true; // React doesn't set the muted attribute; iOS needs it to autoplay
    if (paused) v.pause();
    else v.play().catch(err => { if (err.name === "NotAllowedError") setPaused(true); });
  }, [paused, src]);

  return (
    <section className="home-hero-wrap" aria-label="Welcome">
      <div className="home-hero">
        <div className="home-hero-media" ref={mediaRef}>
          {reduceMotion ? (
            <img src={poster} alt="" fetchPriority="high" decoding="async"/>
          ) : (
            <video key={src} ref={videoRef} src={src} poster={poster}
              autoPlay muted loop playsInline preload="auto" aria-hidden="true"/>
          )}
        </div>
        <div className="home-hero-scrim" aria-hidden="true"/>

        <div className="home-hero-copy">
          <h1 className="home-hero-heading"><Words delay={250}>The Girls Walk</Words> <span className="home-hero-sub">Community</span></h1>
          <TypedText className="home-hero-text" parts={HERO_BLURB} startDelay={700} reduceMotion={reduceMotion}/>
          <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap",justifyContent:"center"}}>
            <button onClick={()=>setPage("Events")} className="home-hero-btn" style={{
              background:C.yellow,color:C.dark,border:`1px solid ${C.yellow}`,
            }}>Sign up for an event →</button>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="home-hero-btn" style={{
              background:"transparent",color:C.cream,border:`1px solid rgba(253,244,236,0.85)`,
            }}>Join our WhatsApp</a>
          </div>
        </div>

        {!reduceMotion && (
          <div className="home-hero-dots">
            <button type="button" className="home-hero-play"
              aria-label={paused ? "Play background video" : "Pause background video"}
              aria-pressed={paused}
              onClick={()=>setPaused(p => !p)}>
              {paused ? (
                <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor"/></svg>
              ) : (
                <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" fill="currentColor"/></svg>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// `accent` colours each sticker's shadow on hover; `tilt` gives the wall a hand-stuck look.
const PARTNERS = [
  { name:"GINNY",                  logo:partnerGinny,      accent:"#F2501E", tilt:-4 },
  { name:"L’Occitane en Provence", logo:partnerLoccitane,  accent:C.dark,    tilt:3 },
  { name:"Chick-fil-A",            logo:partnerChickfila,  accent:"#DD0031", tilt:-2 },
  { name:"Greenhouse Juice Co.",   logo:partnerGreenhouse, accent:C.green,   tilt:4 },
  { name:"heali",                  logo:partnerHeali,      accent:"#3FB6A8", tilt:-3 },
  { name:"Eats by Emee",           logo:partnerEatsByEmee, accent:C.orange,  tilt:2 },
  { name:"Zakilo Bakes",           logo:partnerZakilo,     accent:"#C77DA0", tilt:-3 },
  { name:"scnt",                   logo:partnerScnt,       accent:"#5A3317", tilt:3 },
  { name:"The Good Form",          logo:partnerGoodForm,   accent:C.blush,   tilt:-2 },
  { name:"Mercified Oven",         logo:partnerMercified,  accent:"#F26A1B", tilt:4 },
];

// Partner logos as tilted, bobbing stickers in an endless strip you can drag or swipe.
function PartnerStrip() {
  const scroll = useAutoScroll(0.03);
  // Two sets per half so each half is wider than large screens; the strip loops on halves.
  const half = [...PARTNERS, ...PARTNERS];
  return (
    <div {...scroll} className="photo-strip partner-strip" tabIndex={0} role="region" aria-label="Our partners — drag or swipe to see more">
      {[...half, ...half].map((p, i) => (
        <figure key={i} className="partner-sticker" aria-hidden={i >= PARTNERS.length}
          style={{"--tilt": `${p.tilt}deg`, "--accent": p.accent, "--i": i % PARTNERS.length}}>
          <div className="partner-card">
            <img src={p.logo} alt={i < PARTNERS.length ? p.name : ""} loading="lazy" draggable={false}/>
          </div>
          <figcaption className="partner-name">{p.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function PartnersSection() {
  return (
    <div style={{padding:"4.5rem 0 4rem",background:"#FFFFFF",borderTop:BORDER,textAlign:"center",overflow:"hidden"}}>
      <div style={{marginBottom:"1.5rem",padding:"0 1.25rem"}}>
        <h2 className="section-heading" style={{fontFamily:DISPLAY,fontSize:"3rem",color:C.dark,letterSpacing:"0.02em",margin:0}}><Words>Our Partners</Words></h2>
        <GrowBar center/>
      </div>
      <PartnerStrip/>
      <p className="partners-cta">
        Want to partner with us? <a href="mailto:thegirlswalk@gmail.com?subject=Partnership%20enquiry">Send us an email! →</a>
      </p>
    </div>
  );
}

// Home "Past Events": each card is split in two, title + blurb on top and the photo below.
function PastEventCards({ setPage }) {
  return (
    <div className="past-cards">
      {galleryEvents.map((ev, i) => (
        <Reveal fill key={ev.slug} delay={(i % 3) * 90}>
          <button type="button" className="past-card lift-card" onClick={()=>setPage(`Album_${ev.slug}`)}
            aria-label={`${ev.title}: view photos`}>
            <span className="past-card-text">
              {ev.date && <span className="past-card-date">{ev.date}</span>}
              <span className="past-card-title">{ev.title}</span>
              <span className="past-card-blurb">{EVENT_STORIES[ev.slug].blurb}</span>
            </span>
            <span className="past-card-photo"><img src={ev.src} alt="" loading="lazy"/></span>
          </button>
        </Reveal>
      ))}
    </div>
  );
}

// ── HOME PAGE ──
function HomePage({ setPage }) {
  return (
    <div>
      <HomeHero setPage={setPage}/>

      <Marquee items={["Made for movement","Women’s wellness","Social networking","Curated experiences"]}
        bg={C.dark} color={C.yellow} dot={C.peach}/>

      {/* ── UPCOMING EVENTS SECTION ── */}
      <div className="section-padding" style={{padding:"5rem 4rem", background:C.peach}}>
        <div className="section-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"2.5rem"}}>
          <div>
            <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.2em",color:C.pink,textTransform:"uppercase",marginBottom:"0.5rem"}}>What's On</div>
            <h2 className="section-heading" style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"3rem",color:C.dark,letterSpacing:"0.02em",margin:0}}><Words><Mark>Events</Mark></Words></h2>
          </div>
          <button className="lift" onClick={()=>setPage("Events")} style={{
            background:C.yellow,border:BORDER,color:C.dark,
            cursor:"pointer",padding:"0.6rem 1.4rem",borderRadius:99,
            fontWeight:800,fontSize:"0.78rem",letterSpacing:"0.06em",
            textTransform:"uppercase",fontFamily:"inherit",
          }}>View All →</button>
        </div>
        <div className="cards-grid-3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.25rem"}}>
          {events.map(e=>(
            <Reveal fill key={e.id}><EventCard event={e} setPage={setPage}/></Reveal>
          ))}
          <Reveal fill delay={120}>
            <InfoCard eyebrow="Missed One?" title="Relive Past Events"
              desc="From She’s the Room to the Pilates Picnic — see the photos from our community events and walks."
              cta="See the Photos →" onClick={()=>setPage("Gallery")}/>
          </Reveal>
        </div>
      </div>

      {/* ── PARTNERS SECTION ── */}
      <PartnersSection/>

      {/* ── PHOTO GALLERY SECTION ── */}
      <div className="section-padding" style={{padding:"4rem",background:C.cream,borderTop:BORDER,borderBottom:BORDER}}>
        <div className="section-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"2rem"}}>
          <div>
            <h2 className="section-heading" style={{fontFamily:DISPLAY,fontSize:"3rem",color:C.dark,letterSpacing:"0.02em",margin:0}}><Words>Past Events</Words></h2>
            <GrowBar/>
          </div>
          <button className="lift" onClick={()=>setPage("Gallery")} style={{
            background:C.dark,border:BORDER,color:C.cream,
            cursor:"pointer",padding:"0.6rem 1.4rem",borderRadius:99,
            fontWeight:800,fontSize:"0.78rem",letterSpacing:"0.06em",
            textTransform:"uppercase",fontFamily:"inherit",
          }}>View Gallery →</button>
        </div>
        <PastEventCards setPage={setPage}/>
      </div>

      {/* ── NEWSLETTER SIGNUP ── */}
      <div id="newsletter" className="section-padding newsletter" style={{padding:"5.5rem 4rem",background:C.peach,textAlign:"center",scrollMarginTop:72,position:"relative",isolation:"isolate",overflow:"hidden"}}>
        <WaveBands right corner={false} onScroll/>
        <Reveal style={{maxWidth:620,margin:"0 auto"}}>
          <div style={{fontSize:"0.8rem",fontWeight:700,letterSpacing:"0.2em",color:C.pink,textTransform:"uppercase",marginBottom:"0.75rem"}}>Stay Connected</div>
          <h2 className="section-heading" style={{fontFamily:DISPLAY,fontSize:"3.4rem",color:C.dark,letterSpacing:"0.02em",margin:"0 0 1rem",lineHeight:1}}><Words>JOIN OUR <Mark delay={200}>NEWSLETTER</Mark></Words></h2>
          <p style={{fontSize:"1.05rem",color:C.dark,lineHeight:1.6,margin:"0 auto 2rem",maxWidth:520}}>
            Get updates on upcoming walks, events, and community stories — straight to your inbox.
          </p>
          <form className="newsletter-form" onSubmit={e=>e.preventDefault()}>
            <input type="email" aria-label="Email address" placeholder="Enter your email" required/>
            <button type="submit" className="lift">Subscribe</button>
          </form>
          <p style={{fontSize:"0.95rem",color:C.dark,marginTop:"1.5rem"}}>
            Or join our WhatsApp group for live updates:{" "}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{color:C.dark,fontWeight:800,textDecoration:"underline",textDecorationColor:C.orange,textDecorationThickness:2,textUnderlineOffset:4}}>
              Join WhatsApp →
            </a>
          </p>
          <p style={{fontSize:"0.78rem",color:C.dark,marginTop:"1rem"}}>No spam, ever. Unsubscribe anytime.</p>
        </Reveal>
      </div>
    </div>
  );
}

function EventCard({ event, setPage }) {
  return (
    <div className="lift-card" onClick={()=>setPage("EventDetail_"+event.id)} style={{
      background:"#FFFFFF",borderRadius:18,overflow:"hidden",cursor:"pointer",
      border:BORDER,height:"100%",display:"flex",flexDirection:"column",
    }}>
      <div style={{padding:"1.5rem",display:"flex",flexDirection:"column",flex:1}}>
        <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.1em",color:event.color,textTransform:"uppercase",marginBottom:"0.35rem"}}>{event.date}</div>
        <div style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"2rem",color:C.dark,letterSpacing:"0.02em",lineHeight:1,marginBottom:"0.75rem"}}>{event.title}</div>
        <p style={{fontSize:"0.9rem",color:C.dark,lineHeight:1.65,marginBottom:"1.25rem",flex:1}}>{event.desc}</p>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"0.75rem",flexWrap:"wrap"}}>
          <span style={PILL_CTA}>Details →</span>
          <span style={{fontSize:"0.72rem",fontWeight:700,color:C.dark,background:C.orange,padding:"0.25rem 0.6rem",borderRadius:99}}>{event.tag}</span>
        </div>
      </div>
    </div>
  );
}

function EventDetailPage({ eventId, setPage }) {
  const event = events.find(e=>e.id===eventId);
  if (!event) return null;
  return (
    <div style={{paddingTop:64,minHeight:"100vh",background:C.cream}}>
      <div className="event-detail-banner" style={{
        height:400,
        position:"relative",
        overflow:"hidden",
        borderBottom:`4px solid ${C.yellow}`,
        background:C.dark,
      }}>
        <div style={{position:"absolute",inset:0,background:`linear-gradient(to top,${C.dark}55,transparent 40%)`}}/>
        <button onClick={()=>setPage("Events")} style={{
          position:"absolute",top:"1.5rem",left:"1.5rem",
          background:`${C.cream}26`,backdropFilter:"blur(8px)",
          border:`1px solid ${C.cream}4D`,color:C.cream,cursor:"pointer",
          padding:"0.5rem 1rem",borderRadius:99,fontSize:"0.8rem",fontWeight:700,fontFamily:"inherit",
        }}>← Back to Events</button>
        <div className="event-detail-banner-copy" style={{position:"absolute",bottom:"2rem",left:"3rem",right:"3rem"}}>
          <span style={{background:`${C.cream}2E`,color:C.cream,padding:"0.3rem 0.9rem",borderRadius:99,fontSize:"0.72rem",fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",border:`1px solid ${C.cream}33`}}>{event.type}</span>
          <h1 className="page-heading" style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"3.5rem",color:C.cream,letterSpacing:"0.02em",margin:"0.75rem 0 0",lineHeight:1}}><Words>{event.title}</Words></h1>
        </div>
      </div>
      <div style={{maxWidth:800,margin:"0 auto",padding:"3rem 2rem"}}>
        <div className="detail-info-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"2rem"}}>
          {[["calendar",event.date],["pin",event.location],["ticket",event.tag],["chat","Join our WhatsApp for updates"]].map(([icon,text])=>(
            <div key={text} style={{background:C.cream,borderRadius:12,padding:"1rem 1.25rem",display:"flex",alignItems:"flex-start",gap:"0.75rem",border:BORDER}}>
              <LineIcon name={icon} size={22} style={{color:C.dark,flexShrink:0,marginTop:1}}/>
              <span style={{fontSize:"0.88rem",color:C.dark,lineHeight:1.5,fontWeight:500}}>{text}</span>
            </div>
          ))}
        </div>
        <h3 style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"1.6rem",color:C.dark,letterSpacing:"0.02em",marginBottom:"0.75rem"}}>About This Event</h3>
        <p style={{fontSize:"0.95rem",color:C.muted,lineHeight:1.8,marginBottom:"2rem"}}>{event.desc}</p>
        {event.ticketUrl || event.joinUrl ? (
          <a href={event.ticketUrl || event.joinUrl} target="_blank" rel="noopener noreferrer" style={{
            display:"inline-block",
            background:C.yellow,color:C.dark,border:BORDER,cursor:"pointer",
            padding:"1rem 2.5rem",borderRadius:99,fontWeight:800,fontSize:"1rem",
            letterSpacing:"0.05em",textTransform:"uppercase",fontFamily:"inherit",
            textDecoration:"none",
          }}>{event.ticketUrl ? "Get Tickets on Eventbrite →" : "Join the Walk →"}</a>
        ) : (
          <button style={{
            background:C.yellow,color:C.dark,border:BORDER,cursor:"pointer",
            padding:"1rem 2.5rem",borderRadius:99,fontWeight:800,fontSize:"1rem",
            letterSpacing:"0.05em",textTransform:"uppercase",fontFamily:"inherit",
          }}>{event.rsvp ? "Reserve My Spot →" : "Join the Walk →"}</button>
        )}
      </div>
    </div>
  );
}

// ── EVENTS PAGE ──
function EventsPage({ setPage }) {
  return (
    <div style={{paddingTop:64,minHeight:"100vh",background:C.cream}}>
      <div className="wave-page" style={{position:"relative",isolation:"isolate",overflow:"hidden"}}>
        <WaveBands/>
        <div className="section-padding page-banner" style={{padding:"4rem 4rem 2.5rem"}}>
          <h1 className="page-heading" style={{fontFamily:DISPLAY,fontSize:"4rem",color:C.dark,letterSpacing:"0.02em",margin:0,lineHeight:1}}><Words>UPCOMING <Mark>EVENTS</Mark></Words></h1>
          <p style={{fontSize:"1.2rem",color:C.dark,marginTop:"0.75rem",maxWidth:640}}>We host walks, challenges, and events to engage our community throughout the year and encourage continuous development.</p>
        </div>
        <div className="section-padding" style={{padding:"0 4rem 4rem"}}>
          <div className="cards-grid-3" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"1.5rem"}}>
            {events.map(e=><Reveal fill key={e.id}><EventCard event={e} setPage={setPage}/></Reveal>)}
          </div>
        </div>
      </div>
      <div className="section-padding" style={{padding:"4rem",background:C.peach,borderTop:BORDER}}>
        <div style={{fontSize:"0.72rem",fontWeight:800,letterSpacing:"0.2em",color:C.pink,textTransform:"uppercase",marginBottom:"0.5rem"}}>Missed One?</div>
        <h2 className="section-heading" style={{fontFamily:DISPLAY,fontSize:"3rem",color:C.dark,letterSpacing:"0.02em",margin:0}}><Words>Past Events</Words></h2>
        <div style={{marginBottom:"2rem"}}><GrowBar/></div>
        <EventGalleryGrid setPage={setPage}/>
      </div>
    </div>
  );
}

// About page event write-ups: short summary, "Read the full story" swaps in the long version.
function EventStory({ ev, i, setPage }) {
  const [open, setOpen] = useState(false);
  const story = EVENT_STORIES[ev.slug];
  const id = `story-${ev.slug}`;
  return (
    <Reveal>
      <article className={`event-story${i % 2 ? " event-story-flip" : ""}`}>
        <button type="button" className="event-story-photo" onClick={()=>setPage(`Album_${ev.slug}`)} aria-label={`See photos from ${ev.title}`}>
          <img src={ev.src} alt="" loading="lazy"/>
        </button>
        <div className="event-story-text">
          {ev.date && <div className="past-card-date">{ev.date}</div>}
          <h3 className="event-story-title">{ev.title}</h3>
          {!open && <p>{story.short}</p>}
          {story.long && (
            <div id={id} hidden={!open}>
              {story.long.map((para, k) => <p key={k}>{para}</p>)}
            </div>
          )}
          <div className="event-story-actions">
            {story.long && (
              <button type="button" className="event-story-more" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(o=>!o)}>
                {open ? "Show less ↑" : "Read the full story ↓"}
              </button>
            )}
            <button type="button" className="lift" onClick={()=>setPage(`Album_${ev.slug}`)} style={PILL_CTA}>See all photos →</button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

// ── ABOUT PAGE ──
const ABOUT_PILLARS = [
  {icon:"community",title:"Community & Connection",desc:"Building genuine friendships and meaningful relationships with women navigating similar seasons of life."},
  {icon:"wellness",title:"Wellness & Movement",desc:"Creating opportunities to move our bodies, care for our minds, and make wellness part of everyday life."},
  {icon:"growth",title:"Personal & Professional Growth",desc:"Making room for networking, learning, accountability, and conversations that inspire women to grow."},
  {icon:"cheers",title:"Experiences & Shared Moments",desc:"Bringing women together through thoughtfully curated events, workshops, social gatherings, and seasonal experiences."},
];

function AboutPage({ setPage }) {
  const photoRef = useParallax(0.1, 0.12);
  return (
    <div style={{paddingTop:64,minHeight:"100vh",background:C.cream}}>
      <div className="split-grid about-split" style={{display:"grid",gridTemplateColumns:"1fr 2fr",minHeight:560,borderBottom:BORDER}}>
        <div className="section-padding split-content" style={{background:C.cream,padding:"5rem 3rem",display:"flex",flexDirection:"column",justifyContent:"center",borderRight:BORDER}}>
          <h1 className="page-heading" style={{fontFamily:DISPLAY,fontSize:"4rem",color:C.dark,letterSpacing:"0.02em",margin:0,lineHeight:1}}><Words>ABOUT <Mark delay={300}>US</Mark></Words></h1>
        </div>
        <div className="about-photo" style={{overflow:"hidden",position:"relative"}}>
          <img ref={photoRef} src={galleryWalks} alt="The Girls Walk Community members together on a waterfront walk" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 35%",scale:"1.15"}}/>
        </div>
      </div>

      <section className="about-statement">
        <Reveal><div className="about-eyebrow">Who We Are</div></Reveal>
        <p className="about-statement-text about-serif">
          <Words>TheGirlsWalk Community was founded in April 2026 with a simple belief:</Words>{" "}
          <Mark delay={400}><em>women are stronger when they move together.</em></Mark>
        </p>
        <GrowBar color={C.dark} center/>
        <Reveal><p className="about-statement-body">What began with a vision to bring women together through intentional walks in parks across Toronto and the Greater Toronto Area (GTA) has grown into a thriving community of 3,000+ ambitious women, and growing.</p></Reveal>
        <div className="about-stats">
          {[
            {to:3000, suffix:"+", label:"Women in our community"},
            {to:20, suffix:"+", label:"Events & walks so far"},
          ].map((st, i) => (
            <Reveal key={st.label} delay={i*150}>
              <div className="about-stat-num about-serif"><CountUp to={st.to} suffix={st.suffix}/></div>
              <div className="about-stat-label">{st.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="about-intent">
        <AboutWaveDivider/>
        <div className="about-intent-grid">
          <div className="about-intent-head">
            <h2 className="about-intent-title about-serif"><Words>Built for women who move with <em>intention.</em></Words></h2>
            <GrowBar color={C.orange}/>
          </div>
          <div className="about-intent-copy">
            <Reveal><p>Our mission is to create safe, uplifting, and intentional spaces where women can connect through walks, curated events, and shared experiences that promote wellness, confidence, meaningful friendships, and genuine networking opportunities.</p></Reveal>
            <Reveal><p>Through movement and community-centred programming, we create opportunities for women to step outside their routines, explore new experiences, exchange ideas, and build relationships that extend beyond a single gathering. From intentional outdoor walks to thoughtfully curated events, every experience is designed to bring women together in ways that encourage personal growth, professional development, and a deeper sense of belonging.</p></Reveal>
            <Reveal><p>At TheGirlsWalk, we believe that the right community can inspire us to dream bigger, move with intention, and become better versions of ourselves. We are building more than a walking community; we are creating a space where ambitious women can show up authentically, feel supported, and grow alongside one another.</p></Reveal>
            <Reveal><p className="about-intent-vision">Our vision is to build a community where women connect, grow, and walk together, every step of the way.</p></Reveal>
          </div>
        </div>
        <div className="about-pillars-wrap">
          <h2 className="about-section-title about-serif" style={{color:C.cream}}><Words>What We <em>Do</em></Words></h2>
          <GrowBar color={C.orange} center/>
          <div className="about-pillars">
            {ABOUT_PILLARS.map(({icon,title,desc}, i) => (
              <Reveal fill key={title} delay={i*110}>
                <div className="about-pillar lift-card">
                  <LineIcon name={icon} size={56} className="icon-pop"/>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-events section-padding">
        <div style={{textAlign:"center",marginBottom:"3rem"}}>
          <h2 className="about-section-title about-serif"><Words>Our <em>Events</em></Words></h2>
          <GrowBar color={C.orange} center/>
          <p style={{fontSize:"1rem",color:C.dark,margin:"1.25rem 0 0"}}>The stories behind our gatherings so far.</p>
        </div>
        <div className="event-stories">
          {galleryEvents.map((ev, i) => <EventStory key={ev.slug} ev={ev} i={i} setPage={setPage}/>)}
        </div>
      </section>

      <div style={{background:C.cream,borderTop:BORDER,padding:"4.5rem 0 0"}}>
        <Reveal className="section-padding" style={{textAlign:"center",padding:"0 4rem",marginBottom:"2.25rem"}}>
          <h2 className="section-heading" style={{fontFamily:DISPLAY,fontSize:"3rem",color:C.dark,letterSpacing:"0.02em",margin:0}}><Words>OUR COMMUNITY</Words></h2>
          <GrowBar color={C.orange} center/>
          <p style={{fontSize:"0.95rem",color:C.dark,margin:"1rem 0 0"}}>Real moments from our walks and events. Drag or swipe to explore.</p>
        </Reveal>
        <PhotoStrip photos={COMMUNITY_STRIP} label="Photos from our community — scroll sideways to see more"/>
      </div>
      <PartnersSection/>
    </div>
  );
}

// ── GALLERY PAGE ──
// First event is the featured (largest) box. `slug` maps to src/assets/albums/<slug>/.
const galleryEvents = [
  { slug:"room",      src:galleryRoom,      title:"She’s the Room",        date:"09/24/26", album:"1LDG2X3GuL1hOwd-cAnbfLOIxYQFPLnnb" },
  { slug:"pilates",   src:galleryPilates,   title:"The Pilates Picnic",    date:"07/19/26", album:"1yOequ_B8dEz-Nm0fI79nOHBZr4YeSfb2" },
  { slug:"mayflower", src:galleryMayFlower, title:"May Flowers",           date:"05/09/26", album:"1Ek2C7T-Oe65PvQmZrXZ7WbD04hw9gehF" },
  { slug:"brunch",    src:galleryBrunch,    title:"Meet the Girls Brunch", date:"04/18/26", album:"1IQuG4fJZrYNIPRVvNqwuPpbYDAFBOfO2" },
  { slug:"walks",     src:galleryWalks,     title:"2026 Walk Dump",        date:"",         album:"1FF6P-zbOjjmi6Ic2yknDccQ3xypMVn3K" },
].map(e => ({ ...e, label: e.date ? `${e.title} - ${e.date}` : e.title }));

const POLAROID_TILT = [-4, 3, -2.5, 4, -3];

// Event tiles are tilted polaroids that drift gently; hovering straightens one and lifts it slightly.
function GalleryTile({ p, i, setPage }) {
  const [ref, seen] = useInView();
  return (
    <button ref={ref} type="button" className={`gallery-event reveal${seen ? " is-visible" : ""}`}
      onClick={()=>setPage(`Album_${p.slug}`)}
      aria-label={`View ${p.label} photo gallery`}
      style={{"--reveal-delay":`${i*90}ms`,"--rot":`${POLAROID_TILT[i % POLAROID_TILT.length]}deg`}}>
      <span className="polaroid-float" style={{"--float-dur":`${8 + (i % 3) * 1.6}s`,"--float-delay":`${-i * 2.3}s`}}>
        <span className="polaroid">
          <span className="polaroid-photo"><img src={p.src} alt="" loading="lazy"/></span>
          <span className="polaroid-caption gallery-event-label">{p.label}</span>
          <span className="polaroid-blurb">{EVENT_STORIES[p.slug].blurb}</span>
        </span>
      </span>
    </button>
  );
}

function EventGalleryGrid({ setPage }) {
  return (
    <div className="gallery-grid-page">
      {galleryEvents.map((p, i)=><GalleryTile key={p.slug} p={p} i={i} setPage={setPage}/>)}
    </div>
  );
}

function GalleryPage({ setPage }) {
  return (
    <div className="wave-page" style={{paddingTop:68,minHeight:"100vh",background:C.cream,position:"relative",isolation:"isolate",overflow:"hidden"}}>
      <WaveBands/>
      <div className="section-padding page-banner" style={{padding:"4rem 4rem 1.5rem"}}>
        <h1 className="page-heading" style={{fontFamily:DISPLAY,fontSize:"4rem",color:C.dark,letterSpacing:"0.02em",margin:0,lineHeight:1}}><Words>COMMUNITY <Mark>ARCHIVES</Mark></Words></h1>
        <p style={{fontSize:"1.2rem",color:C.orchid,marginTop:"0.75rem",maxWidth:640}}>A collection of walks, events, and moments that bring our community together.</p>
      </div>
      <div className="section-padding" style={{padding:"2rem 4rem 4.5rem"}}>
        <EventGalleryGrid setPage={setPage}/>
      </div>
    </div>
  );
}

// ── EVENT ALBUM PAGE ──
// Album photos sit still in a masonry grid and fade up gently as they scroll into view.
function AlbumPhoto({ src, i, total, label, onOpen }) {
  const [ref, seen] = useInView();
  return (
    <button ref={ref} type="button" className={`album-photo reveal${seen ? " is-visible" : ""}`}
      onClick={()=>onOpen(i)} aria-label={`Open photo ${i+1} of ${total}`}
      style={{"--reveal-delay":`${(i % 3) * 80}ms`}}>
      <img src={src} alt={`${label} — photo ${i+1}`} loading="lazy" decoding="async"/>
    </button>
  );
}

function AlbumPage({ slug, setPage }) {
  const event = galleryEvents.find(e=>e.slug===slug);
  const photos = ALBUM_PHOTOS[slug] || [];
  const [index, setIndex] = useState(null);
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex(i => (i + 1) % photos.length);
      if (e.key === "ArrowLeft") setIndex(i => (i - 1 + photos.length) % photos.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, photos.length]);

  if (!event) return <GalleryPage setPage={setPage}/>;
  const goToNewsletter = () => {
    setPage("Home");
    setTimeout(() => document.getElementById("newsletter")?.scrollIntoView({ behavior:"smooth" }), 60);
  };
  const lightboxBtn = {
    background:C.yellow,color:C.dark,border:`1px solid ${C.dark}`,borderRadius:99,cursor:"pointer",
    fontWeight:800,fontFamily:"inherit",fontSize:"1.1rem",width:48,height:48,
  };

  return (
    <div style={{paddingTop:68,minHeight:"100vh",background:C.cream}}>
      <div className="section-padding page-banner" style={{background:C.cream,padding:"2.5rem 4rem 2.5rem",borderBottom:BORDER,position:"relative",isolation:"isolate",overflow:"hidden"}}>
        <WaveBands left={false}/>
        <button className="lift" onClick={()=>setPage("Gallery")} style={{
          background:"none",border:BORDER,color:C.dark,cursor:"pointer",
          padding:"0.5rem 1.2rem",borderRadius:99,fontSize:"0.8rem",fontWeight:800,letterSpacing:"0.06em",
          textTransform:"uppercase",fontFamily:"inherit",marginBottom:"1.5rem",
        }}>← Back to Gallery</button>
        <h1 className="page-heading" style={{fontFamily:DISPLAY,fontSize:"4rem",color:C.dark,letterSpacing:"0.02em",margin:0,lineHeight:1}}><Words>{event.label}</Words></h1>
        <p style={{fontSize:"1.2rem",color:C.orchid,marginTop:"0.75rem"}}>Here’s all our highlights from the day</p>
      </div>
      <div className="section-padding" style={{padding:"3rem 4rem",background:C.peach}}>
        <div className="album-grid">
          {photos.map((src,i)=>(
            <AlbumPhoto key={src} src={src} i={i} total={photos.length} label={event.label} onOpen={setIndex}/>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:"3rem"}}>
          <p style={{fontFamily:DISPLAY,fontSize:"2rem",color:C.dark,letterSpacing:"0.03em",margin:"0 0 1rem"}}>When’s our next event or walk? Join our newsletter to stay updated!</p>
          <button type="button" className="lift" onClick={goToNewsletter} style={{
            display:"inline-block",background:C.yellow,color:C.dark,border:BORDER,borderRadius:99,cursor:"pointer",
            padding:"0.85rem 1.75rem",fontWeight:800,fontSize:"0.85rem",letterSpacing:"0.05em",
            textTransform:"uppercase",fontFamily:"inherit",
          }}>Join here →</button>
        </div>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={`${event.label} — photo ${index+1} of ${photos.length}`}
          className="lightbox" onClick={()=>setIndex(null)}
          style={{position:"fixed",inset:0,zIndex:300,background:`${C.peach}F2`,display:"flex",alignItems:"center",justifyContent:"center",padding:"4.5rem 1rem 1rem"}}>
          <img key={index} className="lightbox-img" src={photos[index]} alt={`${event.label} — photo ${index+1}`} onClick={e=>e.stopPropagation()}
            style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",borderRadius:12,border:`3px solid ${C.cream}`}}/>
          <button type="button" aria-label="Close" autoFocus onClick={()=>setIndex(null)} style={{...lightboxBtn,position:"absolute",top:"1rem",right:"1rem"}}>✕</button>
          <button type="button" aria-label="Previous photo" onClick={e=>{e.stopPropagation();setIndex((index-1+photos.length)%photos.length);}} style={{...lightboxBtn,position:"absolute",left:"1rem",top:"50%",transform:"translateY(-50%)"}}>←</button>
          <button type="button" aria-label="Next photo" onClick={e=>{e.stopPropagation();setIndex((index+1)%photos.length);}} style={{...lightboxBtn,position:"absolute",right:"1rem",top:"50%",transform:"translateY(-50%)"}}>→</button>
          <div style={{position:"absolute",top:"1.4rem",left:"1rem",color:C.dark,fontSize:"0.85rem",fontWeight:700}}>{index+1} / {photos.length}</div>
        </div>
      )}
    </div>
  );
}

// ── DONATE PAGE ──
// Zeffy donation form, embedded inline on the Donate page (Zeffy handles the
// amount, payment and receipts). DONATE_URL is the public form link used as a
// fallback for anyone whose browser blocks the embedded form.
const DONATE_URL = "https://www.zeffy.com/en-CA/donation-form/thegirlswalk-community-donations-campaign";
const DONATE_EMBED_URL = "https://www.zeffy.com/embed/donation-form/thegirlswalk-community-donations-campaign";

const DONATE_PILLARS = [
  { icon:"book", title:"Develop Resources", desc:"We create tools and resources that support women at every stage." },
  { icon:"door", title:"Expand Opportunities", desc:"We connect women to experiences, programming, and opportunities that open doors and build confidence." },
  { icon:"growth", title:"Grow Together", desc:"We strengthen our community so more women can thrive in their careers and lives." },
];

function DonatePage() {
  // Zeffy posts {type:"zeffy-embed:step-changed", step} as the donor moves
  // through the form; the payment step is much taller than the others.
  const [zeffyStep, setZeffyStep] = useState("amount");
  useEffect(() => {
    const onMessage = (e) => {
      if (!/^https:\/\/([a-z0-9-]+\.)*zeffy\.com$/.test(e.origin)) return;
      let data = e.data;
      if (typeof data === "string") { try { data = JSON.parse(data); } catch { return; } }
      if (data?.type === "zeffy-embed:step-changed" && typeof data.step === "string") setZeffyStep(data.step);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  return (
    <div style={{paddingTop:68,minHeight:"100vh",background:C.cream}}>
      <div className="section-padding split-grid donate-grid" style={{
        display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3.5rem",alignItems:"start",
        maxWidth:1200,margin:"0 auto",padding:"4.5rem 4rem",
      }}>
        {/* LEFT — headline + pillars */}
        <div className="donate-intro">
          <div style={{fontSize:"0.8rem",fontWeight:800,letterSpacing:"0.2em",color:C.pink,textTransform:"uppercase",marginBottom:"1rem"}}>Support the Community</div>
          <h1 className="page-heading" style={{fontFamily:DISPLAY,fontSize:"5rem",color:C.dark,letterSpacing:"0.01em",margin:"0 0 1.5rem",lineHeight:0.92}}><Words>Grow the<br/>Movement.</Words></h1>
          <p style={{fontSize:"1.05rem",color:C.dark,maxWidth:440,lineHeight:1.6,margin:"0 0 2.5rem"}}>Your support helps us develop resources, expand opportunities, and grow together. Every contribution helps create welcoming spaces where women feel seen, connected, and supported.</p>
          <div className="donate-pillars" style={{display:"grid",gap:"1.75rem"}}>
            {DONATE_PILLARS.map(p=>(
              <div key={p.title}>
                <LineIcon name={p.icon} size={44} className="icon-pop" style={{color:C.dark,marginBottom:"0.4rem"}}/>
                <h2 style={{fontFamily:DISPLAY,fontSize:"1.6rem",fontWeight:400,color:C.dark,letterSpacing:"0.05em",marginBottom:"0.4rem"}}>{p.title}</h2>
                <p style={{fontSize:"0.82rem",color:C.muted,lineHeight:1.55,margin:0}}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — embedded Zeffy donation form */}
        <div className="donation-card">
          <iframe className={`donate-embed${zeffyStep === "payment" ? " is-payment" : ""}`} title="Donation form powered by Zeffy" src={DONATE_EMBED_URL}
            allow="payment" allowpaymentrequest="true"/>
          <p style={{textAlign:"center",fontSize:"0.85rem",color:C.dark,lineHeight:1.5,margin:"1.25rem 1rem 0"}}>
            Thank you for helping our community grow, one contribution at a time.{" "}
            <a href={DONATE_URL} target="_blank" rel="noopener noreferrer" style={{color:C.dark,fontWeight:800,textDecoration:"underline",textDecorationColor:C.orange,textDecorationThickness:2,textUnderlineOffset:4}}>Form not loading? Open it here →</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── FOOTER ──
function Footer({ setPage, bg = C.cream }) {
  return (
    <footer className="footer section-padding" style={{background:bg,padding:"3rem 4rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem",borderTop:BORDER}}>
      <div>
        <div style={{fontSize:"0.72rem",color:C.dark,letterSpacing:"0.05em"}}>© 2026 TGW Community</div>
      </div>
      <div className="footer-links" style={{display:"flex",gap:"1.25rem"}}>
        {["Home","About","Events","Gallery","Donate"].map(p=>(
          <button key={p} onClick={()=>setPage(p)} style={{
            background:p==="Donate"?C.yellow:"none",border:p==="Donate"?`1px solid ${C.dark}`:"none",
            borderRadius:p==="Donate"?99:0,padding:p==="Donate"?"0.3rem 0.75rem":0,
            cursor:"pointer",fontSize:"0.75rem",fontWeight:p==="Donate"?800:600,color:C.dark,
            letterSpacing:"0.06em",textTransform:"uppercase",fontFamily:"inherit",transition:"color 0.2s",
          }}
          onMouseEnter={e=>e.target.style.color=p==="Donate"?C.dark:C.pink}
          onMouseLeave={e=>e.target.style.color=C.dark}>{p}</button>
        ))}
      </div>
      <div className="footer-social" style={{display:"flex",gap:"1rem"}}>
        <a href="https://instagram.com/thegirlswalk" target="_blank" rel="noopener noreferrer" style={{color:C.dark,fontSize:"0.82rem",textDecoration:"none",fontWeight:700}}>@thegirlswalk</a>
        <a href="https://instagram.com/thegirlswalkcommunity" target="_blank" rel="noopener noreferrer" style={{color:C.dark,fontSize:"0.82rem",textDecoration:"none",fontWeight:700}}>@thegirlswalkcommunity</a>
      </div>
    </footer>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("Home");

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  // Cards tilt in 3D toward the cursor (mouse/trackpad only, not with reduced motion).
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let current = null;
    const reset = el => { el.style.removeProperty("--rx"); el.style.removeProperty("--ry"); };
    const onMove = e => {
      const el = e.target.closest?.(".lift-card, .polaroid");
      if (el !== current) { if (current) reset(current); current = el; }
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
    };
    const onLeave = () => { if (current) reset(current); current = null; };
    document.addEventListener("pointermove", onMove, { passive:true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const eventDetailMatch = page.startsWith("EventDetail_");
  const eventId = eventDetailMatch ? parseInt(page.split("_")[1]) : null;
  // Sections alternate cream/peach at every divider line, so the footer takes
  // the opposite colour of the page's last section.
  const endsOnPeach = ["Home","Events"].includes(page) || page.startsWith("Album_");

  const renderPage = () => {
    if (eventDetailMatch) return <EventDetailPage eventId={eventId} setPage={setPage}/>;
    if (page.startsWith("Album_")) return <AlbumPage key={page} slug={page.slice(6)} setPage={setPage}/>;
    switch(page) {
      case "Home":    return <HomePage setPage={setPage}/>;
      case "About":   return <AboutPage setPage={setPage}/>;
      case "Events":  return <EventsPage setPage={setPage}/>;
      case "Gallery": return <GalleryPage setPage={setPage}/>;
      case "Donate":  return <DonatePage/>;
      default:        return <HomePage setPage={setPage}/>;
    }
  };

  return (
    <div style={{minHeight:"100vh",background:C.cream,color:C.dark,fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:ital,wght@1,800;1,900&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <NavBar page={page} setPage={setPage}/>
      <div key={page} className="page-enter">{renderPage()}</div>
      <Footer setPage={setPage} bg={endsOnPeach ? C.cream : C.peach}/>
    </div>
  );
}
