import { useEffect, useState } from "react";
import tgwLogo from "./assets/tgw-logo-burgundy.png";
import { isShopifyConfigured, createCheckout, DONATION_VARIANTS } from "./shopify";
import "./App.css";

// ── IMAGES ─── Change these to update photos on the site ───
// Hero (front page main photo)
import heroWalkGroup from "./assets/hero-walk-group.jpg";
import heroPilatesGroup from "./assets/hero-pilates-group.jpg";
import heroRoomPanel from "./assets/hero-room-panel.jpg";
// Gallery cover photos
import galleryBrunch from "./assets/gallery-meet-the-girls-brunch.jpg";
import galleryMayFlower from "./assets/gallery-may-flower.jpg";
import galleryPilates from "./assets/gallery-pilates-picnic.jpg";
import galleryRoom from "./assets/gallery-shes-the-room.jpg";
import galleryWalks from "./assets/gallery-2026-walk-dump.jpg"; // also used for About

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
const WHATSAPP_URL = "https://chat.whatsapp.com/BrJxnx5G7VBAzNtP01eQ6v?mode=gi_t";

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
};

// ── BOLD EDITORIAL DESIGN TOKENS (ISWIS-inspired) ──────────────
const DISPLAY = "'Bebas Neue','Impact',sans-serif";
const HARD     = `6px 6px 0 ${C.dark}`;
const HARD_SM  = `4px 4px 0 ${C.dark}`;
const HARD_YELLOW = `6px 6px 0 ${C.yellow}`;
const BORDER   = `3px solid ${C.dark}`;

// ── SCROLLING MARQUEE BAND ──
function Marquee({ items, bg = C.dark, color = C.yellow, border }) {
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
            {t} <span style={{color: C.pink}}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const events = [
  {
    id: 1,
    type: "Weekly Walk",
    title: "Morning Walk — Saturday",
    date: "Saturday · 11:00 AM",
    location: "Toronto & GTA",
    desc: "Our signature weekly walk. All paces welcome — this is about connection, fresh air, and showing up for yourself and each other. Join our WhatsApp group for location updates each week.",
    rsvp: false,
    color: C.pink,
    tag: "Free · No RSVP needed",
    joinUrl: WHATSAPP_URL,
  },
];

// Info cards shown alongside upcoming events (not clickable event detail pages)
function InfoCard({ eyebrow, title, desc, cta, onClick, href, bg }) {
  const linkProps = href ? { href, target:"_blank", rel:"noopener noreferrer" } : {};
  const Tag = href ? "a" : "button";
  return (
    <div style={{background:C.cream,borderRadius:18,overflow:"hidden",border:BORDER,boxShadow:HARD,display:"flex",flexDirection:"column"}}>
      <div style={{minHeight:180,background:bg,borderBottom:BORDER,padding:"1.25rem",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
        <span style={{width:"fit-content",background:C.cream,color:C.dark,padding:"0.25rem 0.75rem",borderRadius:99,fontSize:"0.68rem",fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase"}}>{eyebrow}</span>
        <div style={{fontFamily:DISPLAY,fontSize:"2rem",color:C.dark,letterSpacing:"0.03em",lineHeight:1}}>{title}</div>
      </div>
      <div style={{padding:"1.25rem",display:"flex",flexDirection:"column",flex:1}}>
        <p style={{fontSize:"0.85rem",color:C.dark,lineHeight:1.6,margin:"0 0 1.25rem",flex:1}}>{desc}</p>
        <Tag {...linkProps} onClick={onClick} style={{
          alignSelf:"flex-start",background:C.yellow,color:C.dark,border:`2px solid ${C.dark}`,borderRadius:99,
          padding:"0.5rem 1.1rem",fontWeight:800,fontSize:"0.75rem",letterSpacing:"0.06em",textTransform:"uppercase",
          fontFamily:"inherit",textDecoration:"none",cursor:"pointer",boxShadow:HARD_SM,
        }}>{cta}</Tag>
      </div>
    </div>
  );
}

const NextEventCard = () => (
  <InfoCard eyebrow="Next Event" title="Something New Is Coming" bg={`linear-gradient(135deg, ${C.yellow}, ${C.orange})`}
    desc="Our next event is in the works. Join our WhatsApp group or follow @thegirlswalk to hear first — and bring a friend!"
    cta="Get Updates →" href={WHATSAPP_URL}/>
);

// ── NAVIGATION BAR ──
function NavBar({ page, setPage }) {
  const links = ["Home","About","Events","Gallery","Donate"];
  const [open, setOpen] = useState(false);
  const active = page.startsWith("Album_") ? "Gallery" : page.startsWith("EventDetail_") ? "Events" : page;
  return (
    <nav className="navbar" style={{
      position:"fixed", top:0, left:0, right:0, zIndex:200,
      background:C.cream,
      borderBottom:BORDER,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 2rem", height:68,
    }}>
      <button className="navbar-brand" onClick={()=>{setPage("Home"); setOpen(false);}} style={{
        background:"none", border:"none", cursor:"pointer",
        display:"flex", alignItems:"center", gap:"0.6rem",
      }}>
        <img src={tgwLogo} alt="TGW Community" style={{height:46}} />
      </button>
      <button
        className="mobile-menu-toggle"
        onClick={()=>setOpen(v=>!v)}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        style={{
          display:"none", background:"transparent", border:`2px solid ${C.dark}`, cursor:"pointer",
          width:40, height:40, borderRadius:"50%", color:C.dark, fontSize:"1.2rem",
          alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        {open ? "✕" : "☰"}
      </button>
      <div className={`nav-links ${open ? "nav-links-open" : ""}`} style={{display:"flex", gap:"0.25rem", alignItems:"center"}}>
        {links.map(l => (
          <button className="nav-link-button" key={l} aria-current={active===l ? "page" : undefined} onClick={()=>{setPage(l); setOpen(false);}} style={{
            background: l==="Donate" ? C.yellow : active===l ? C.dark : "transparent",
            color: l==="Donate" ? C.dark : active===l ? C.cream : C.dark,
            border: `2px solid ${l==="Donate" || active===l ? C.dark : "transparent"}`,
            boxShadow: l==="Donate" && active===l ? `0 0 0 2px ${C.dark}` : "none",
            cursor:"pointer",
            padding:"0.4rem 0.85rem", borderRadius:99,
            fontWeight:700, fontSize:"0.78rem", letterSpacing:"0.04em",
            transition:"all 0.15s", textTransform:"uppercase",
            fontFamily:"inherit",
          }}>{l}</button>
        ))}
        <a className="nav-cta-button" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{
          marginLeft:"0.5rem",
          background:C.dark, color:C.cream, border:`2px solid ${C.dark}`, cursor:"pointer",
          padding:"0.5rem 1.2rem", borderRadius:99,
          fontWeight:800, fontSize:"0.8rem", letterSpacing:"0.05em",
          textTransform:"uppercase",
          fontFamily:"inherit", textDecoration:"none",
        }}>Join Us →</a>
      </div>
    </nav>
  );
}

// ── HOME PAGE ──
function HomePage({ setPage }) {
  return (
    <div style={{paddingTop:64}}>
      {/* ── HERO SECTION (front page top) ── */}
      <div className="hero-grid" style={{
        minHeight:"92vh", background:C.cream,
        display:"grid", gridTemplateColumns:"1fr 1fr",
        position:"relative", overflow:"hidden",
      }}>
        {/* Left */}
        <div className="section-padding hero-content" style={{
          display:"flex", flexDirection:"column", justifyContent:"center",
          padding:"4rem 3rem 4rem 4rem", position:"relative", zIndex:2,
        }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:"0.5rem",
            background:C.dark, border:`2px solid ${C.dark}`,
            borderRadius:99, padding:"0.4rem 1.1rem", marginBottom:"1.5rem",
            width:"fit-content", boxShadow:`4px 4px 0 ${C.yellow}`,
          }}>
            <span style={{width:6,height:6,borderRadius:"50%",background:C.yellow,display:"inline-block"}}></span>
            <span style={{fontSize:"0.72rem",fontWeight:800,letterSpacing:"0.15em",color:C.cream,textTransform:"uppercase"}}>Toronto & GTA</span>
          </div>
          <h1 className="hero-heading" style={{
            fontFamily:DISPLAY,
            fontSize:"clamp(3.5rem,6vw,6.5rem)", lineHeight:0.92,
            color:C.dark, margin:"0 0 1.5rem",
            letterSpacing:"0.02em",
          }}>
            A<br/>
            <span style={{color:C.pink}}>Movement.</span><br/>
            <span style={{fontFamily:DISPLAY, fontWeight:700, color:C.dark, letterSpacing:0, fontSize:"0.85em"}}>literally.</span>
          </h1>
          <p style={{
            fontSize:"1.05rem", color:C.muted, lineHeight:1.7,
            maxWidth:420, marginBottom:"2rem", fontWeight:400,
          }}>
            For ambitious women, by ambitious women. Walk with us every week across Toronto and the GTA — and join a community of 500+ women who show up for themselves and each other.
          </p>
          <div style={{display:"flex", gap:"1rem", flexWrap:"wrap", marginBottom:"2.5rem"}}>
            <button onClick={()=>setPage("Events")} style={{
              background:C.dark, color:C.cream, border:BORDER, cursor:"pointer",
              padding:"0.9rem 2rem", borderRadius:99,
              fontWeight:800, fontSize:"0.9rem", letterSpacing:"0.05em",
              boxShadow:HARD_YELLOW, textTransform:"uppercase",
              fontFamily:"inherit", transition:"transform 0.1s",
            }}>Sign Up for an Event →</button>
            <button onClick={()=>setPage("About")} style={{
              background:C.cream, color:C.dark, border:BORDER,
              cursor:"pointer", padding:"0.9rem 1.75rem", borderRadius:99,
              fontWeight:800, fontSize:"0.9rem", letterSpacing:"0.05em",
              boxShadow:HARD_SM, textTransform:"uppercase", fontFamily:"inherit",
            }}>Our Story</button>
          </div>
          <div className="hero-stats" style={{display:"flex", gap:"2.5rem", borderTop:`3px solid ${C.dark}`, paddingTop:"1.5rem"}}>
            {[["500+","Community Members"],["Weekly","Walks & Events"]].map(([n,l])=>(
              <div key={l}>
                <div style={{fontFamily:DISPLAY,fontSize:"2rem",color:C.dark,lineHeight:1}}>{n}</div>
                <div style={{fontSize:"0.7rem",color:C.dark,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:"0.2rem"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Right — photo collage (group/community moments only) */}
        <div className="hero-media hero-collage">
          <img className="hero-collage-main" src={heroWalkGroup} alt="The Girls Walk Community members together after a walk"/>
          <img src={heroPilatesGroup} alt="Friends at The Pilates Picnic" style={{objectPosition:"center 35%"}}/>
          <img src={heroRoomPanel} alt="The community gathered at She’s the Room"/>
        </div>
      </div>

      <Marquee items={["The Girls Walk","Move With Intention","Community","Wellness","Sisterhood","Toronto & GTA"]} />

      {/* ── UPCOMING EVENTS SECTION ── */}
      <div className="section-padding" style={{padding:"5rem 4rem", background:C.cream}}>
        <div className="section-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"2.5rem"}}>
          <div>
            <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.2em",color:C.pink,textTransform:"uppercase",marginBottom:"0.5rem"}}>What's On</div>
            <h2 className="section-heading" style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"3rem",color:C.dark,letterSpacing:"0.02em",margin:0}}>Events</h2>
          </div>
          <button onClick={()=>setPage("Events")} style={{
            background:C.yellow,border:BORDER,color:C.dark,
            cursor:"pointer",padding:"0.6rem 1.4rem",borderRadius:99,
            fontWeight:800,fontSize:"0.78rem",letterSpacing:"0.06em",
            textTransform:"uppercase",fontFamily:"inherit",boxShadow:HARD_SM,
          }}>View All →</button>
        </div>
        <div className="cards-grid-3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.25rem"}}>
          {events.map(e=>(
            <EventCard key={e.id} event={e} setPage={setPage}/>
          ))}
          <NextEventCard/>
          <InfoCard eyebrow="Missed One?" title="Relive Past Events" bg={C.blush}
            desc="From She’s the Room to the Pilates Picnic — see the photos from our community events and walks."
            cta="See the Photos →" onClick={()=>setPage("Gallery")}/>
        </div>
      </div>

      {/* ── PHOTO GALLERY SECTION ── */}
      <div className="section-padding" style={{padding:"4rem",background:C.peach,borderTop:BORDER,borderBottom:BORDER}}>
        <div className="section-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"2rem"}}>
          <div>
            <div style={{fontSize:"0.72rem",fontWeight:800,letterSpacing:"0.2em",color:C.dark,textTransform:"uppercase",marginBottom:"0.5rem"}}>From Previous Events</div>
            <h2 className="section-heading" style={{fontFamily:DISPLAY,fontSize:"3rem",color:C.dark,letterSpacing:"0.02em",margin:0}}>Past Events</h2>
          </div>
          <button onClick={()=>setPage("Gallery")} style={{
            background:C.dark,border:BORDER,color:C.cream,
            cursor:"pointer",padding:"0.6rem 1.4rem",borderRadius:99,
            fontWeight:800,fontSize:"0.78rem",letterSpacing:"0.06em",
            textTransform:"uppercase",fontFamily:"inherit",boxShadow:HARD_SM,
          }}>View Gallery →</button>
        </div>
        <EventGalleryGrid setPage={setPage}/>
      </div>

      {/* ── NEWSLETTER SIGNUP ── */}
      <div id="newsletter" className="section-padding" style={{padding:"5rem 4rem",background:C.cream,textAlign:"center",scrollMarginTop:72}}>
        <div style={{maxWidth:560,margin:"0 auto"}}>
          <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.2em",color:C.pink,textTransform:"uppercase",marginBottom:"0.75rem"}}>STAY CONNECTED</div>
          <h2 style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"2.5rem",color:C.dark,letterSpacing:"0.02em",margin:"0 0 0.75rem"}}>JOIN OUR NEWSLETTER</h2>
          <p style={{fontSize:"0.95rem",color:C.muted,lineHeight:1.7,marginBottom:"2rem"}}>
            Get updates on upcoming walks, events, and community stories — straight to your inbox.
          </p>
          <div className="email-row" style={{display:"flex",gap:"0.75rem",maxWidth:440,margin:"0 auto"}}>
            <input type="email" aria-label="Email address" placeholder="Enter your email" style={{
              flex:1,border:BORDER,borderRadius:99,
              padding:"0.85rem 1.25rem",fontSize:"0.9rem",outline:"none",
              fontFamily:"inherit",color:C.dark,
            }}/>
            <button style={{
              background:C.dark,
              color:C.cream,border:BORDER,borderRadius:99,
              padding:"0.85rem 1.75rem",cursor:"pointer",fontWeight:800,
              fontSize:"0.85rem",letterSpacing:"0.05em",textTransform:"uppercase",
              fontFamily:"inherit",whiteSpace:"nowrap",
              boxShadow:HARD_SM,
            }}>Subscribe</button>
          </div>
          <p style={{fontSize:"0.85rem",color:C.muted,marginTop:"1.5rem"}}>
            Or join our WhatsApp group for live updates:{" "}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{color:C.dark,fontWeight:800,textDecoration:"underline",textDecorationColor:C.pink,textUnderlineOffset:3}}>
              Join WhatsApp →
            </a>
          </p>
          <p style={{fontSize:"0.72rem",color:C.muted,marginTop:"1rem"}}>No spam, ever. Unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, setPage }) {
  return (
    <div onClick={()=>setPage("EventDetail_"+event.id)} style={{
      background:C.cream,borderRadius:18,overflow:"hidden",cursor:"pointer",
      border:BORDER,transition:"all 0.15s",
      boxShadow:HARD,
    }}
    onMouseEnter={e=>{e.currentTarget.style.transform="translate(-3px,-3px)";e.currentTarget.style.boxShadow=`9px 9px 0 ${C.yellow}`}}
    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=HARD}}>
      <div style={{
        minHeight:180,
        position:"relative",
        overflow:"hidden",
        background:C.dark,
        borderBottom:BORDER,
        padding:"1.25rem",
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-between",
      }}>
        <span style={{
          width:"fit-content",
          background:C.cream,color:C.dark,
          padding:"0.25rem 0.75rem",borderRadius:99,fontSize:"0.68rem",
          fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",
        }}>{event.type}</span>
        <div style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"2rem",color:C.cream,letterSpacing:"0.03em",lineHeight:1}}>{event.location}</div>
      </div>
      <div style={{padding:"1.25rem"}}>
        <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.1em",color:event.color,textTransform:"uppercase",marginBottom:"0.35rem"}}>{event.date}</div>
        <div style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"1.4rem",color:C.dark,letterSpacing:"0.02em",marginBottom:"0.5rem"}}>{event.title}</div>
        <p style={{fontSize:"0.82rem",color:C.muted,lineHeight:1.6,marginBottom:"1rem"}}>{event.desc.slice(0,100)}...</p>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:"0.72rem",fontWeight:700,color:event.color,background:`${event.color}15`,padding:"0.25rem 0.6rem",borderRadius:99}}>{event.tag}</span>
          <span style={{fontSize:"0.78rem",fontWeight:700,color:C.dark}}>Details →</span>
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
          <h1 className="page-heading" style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"3.5rem",color:C.cream,letterSpacing:"0.02em",margin:"0.75rem 0 0",lineHeight:1}}>{event.title}</h1>
        </div>
      </div>
      <div style={{maxWidth:800,margin:"0 auto",padding:"3rem 2rem"}}>
        <div className="detail-info-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"2rem"}}>
          {[["📅",event.date],["📍",event.location],["🎟",event.tag],["💬","Join our WhatsApp for updates"]].map(([icon,text])=>(
            <div key={text} style={{background:C.cream,borderRadius:12,padding:"1rem 1.25rem",display:"flex",alignItems:"flex-start",gap:"0.75rem",border:BORDER,boxShadow:HARD_SM}}>
              <span style={{fontSize:"1.2rem"}}>{icon}</span>
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
            boxShadow:HARD,
          }}>{event.ticketUrl ? "Get Tickets on Eventbrite →" : "Join the Walk →"}</a>
        ) : (
          <button style={{
            background:C.yellow,color:C.dark,border:BORDER,cursor:"pointer",
            padding:"1rem 2.5rem",borderRadius:99,fontWeight:800,fontSize:"1rem",
            letterSpacing:"0.05em",textTransform:"uppercase",fontFamily:"inherit",
            boxShadow:HARD,
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
      <div className="section-padding page-banner" style={{background:C.cream,padding:"4rem 4rem 3rem"}}>
        <div style={{fontSize:"0.72rem",fontWeight:800,letterSpacing:"0.2em",color:C.dark,textTransform:"uppercase",marginBottom:"0.75rem"}}>Community Events</div>
        <h1 className="page-heading" style={{fontFamily:DISPLAY,fontSize:"4rem",color:C.dark,letterSpacing:"0.02em",margin:0,lineHeight:1}}>UPCOMING EVENTS</h1>
        <p style={{fontSize:"1rem",color:C.dark,marginTop:"0.75rem",maxWidth:500}}>From weekly walks to monthly brunches — there's always something to show up to.</p>
      </div>
      <div className="section-padding" style={{padding:"3rem 4rem"}}>
        <div className="cards-grid-3" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"1.5rem"}}>
          {events.map(e=><EventCard key={e.id} event={e} setPage={setPage}/>)}
          <NextEventCard/>
        </div>
      </div>
      <div className="section-padding" style={{padding:"4rem",background:C.peach,borderTop:BORDER}}>
        <div style={{fontSize:"0.72rem",fontWeight:800,letterSpacing:"0.2em",color:C.dark,textTransform:"uppercase",marginBottom:"0.5rem"}}>Missed One?</div>
        <h2 className="section-heading" style={{fontFamily:DISPLAY,fontSize:"3rem",color:C.dark,letterSpacing:"0.02em",margin:"0 0 2rem"}}>Past Events</h2>
        <EventGalleryGrid setPage={setPage}/>
      </div>
    </div>
  );
}

// ── ABOUT PAGE ──
function AboutPage() {
  return (
    <div style={{paddingTop:64,minHeight:"100vh",background:C.cream}}>
      <div className="split-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:480}}>
        <div className="about-photo" style={{overflow:"hidden",position:"relative"}}>
          <img src={galleryWalks} alt="The Girls Walk Community members together on a waterfront walk" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 58%"}}/>
        </div>
        <div className="section-padding split-content" style={{background:C.cream,padding:"5rem 4rem",display:"flex",flexDirection:"column",justifyContent:"center",borderLeft:BORDER}}>
          <div style={{width:"fit-content",background:C.yellow,color:C.dark,border:`2px solid ${C.dark}`,borderRadius:99,padding:"0.3rem 0.9rem",fontSize:"0.72rem",fontWeight:800,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:"1.25rem"}}>Who We Are</div>
          <h1 className="page-heading" style={{fontFamily:DISPLAY,fontSize:"3.5rem",color:C.dark,letterSpacing:"0.02em",margin:"0 0 1.5rem",lineHeight:1}}>BUILT FOR WOMEN WHO MOVE WITH <span style={{background:C.yellow,padding:"0 0.2em",boxDecorationBreak:"clone",WebkitBoxDecorationBreak:"clone"}}>intention.</span></h1>
          <p style={{fontSize:"0.95rem",color:C.dark,lineHeight:1.8,marginBottom:"1.5rem"}}>
            The Girls Walk Community was founded in April 2026 with a simple belief: women are stronger when they move together. What started as walks through Toronto's neighbourhoods has grown into a thriving community of 500+ ambitious women.
          </p>
          <p style={{fontSize:"0.95rem",color:C.dark,lineHeight:1.8}}>
            To build a safe, uplifting community where women connect through walks, events, and shared experiences that promote wellness, confidence, community, and genuine networking opportunities.
          </p>
        </div>
      </div>
      <div className="section-padding" style={{padding:"5rem 4rem",background:C.cream}}>
        <div style={{textAlign:"center",marginBottom:"3rem"}}>
          <h2 className="section-heading" style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"3rem",color:C.dark,letterSpacing:"0.02em"}}>WHAT WE DO</h2>
        </div>
        <div className="cards-grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1.5rem"}}>
          {[
            {emoji:"🤝🏾",title:"Community & Connection",desc:"Building genuine friendships and meaningful relationships with women navigating similar seasons of life."},
            {emoji:"🧘🏾‍♀️",title:"Wellness & Movement",desc:"Creating opportunities to move our bodies, care for our minds, and make wellness part of everyday life."},
            {emoji:"🌱",title:"Personal & Professional Growth",desc:"Making room for networking, learning, accountability, and conversations that inspire women to grow."},
            {emoji:"🥂",title:"Experiences & Shared Moments",desc:"Bringing women together through thoughtfully curated events, workshops, social gatherings, and seasonal experiences."},
          ].map(({emoji,title,desc})=>(
            <div key={title} style={{background:C.cream,borderRadius:18,padding:"2rem 1.5rem",textAlign:"center",border:BORDER,boxShadow:`4px 4px 0 ${C.yellow}`}}>
              <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>{emoji}</div>
              <div style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"1.3rem",color:C.dark,letterSpacing:"0.05em",marginBottom:"0.5rem"}}>{title}</div>
              <p style={{fontSize:"0.85rem",color:C.muted,lineHeight:1.6}}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── GALLERY PAGE ──
// First event is the featured (largest) box. `slug` maps to src/assets/albums/<slug>/.
const galleryEvents = [
  { slug:"room",      src:galleryRoom,      label:"She’s the Room - 09/25/26",        album:"1LDG2X3GuL1hOwd-cAnbfLOIxYQFPLnnb" },
  { slug:"pilates",   src:galleryPilates,   label:"The Pilates Picnic - 07/19/26",    album:"1yOequ_B8dEz-Nm0fI79nOHBZr4YeSfb2" },
  { slug:"mayflower", src:galleryMayFlower, label:"May Flower - 05/09/26",            album:"1Ek2C7T-Oe65PvQmZrXZ7WbD04hw9gehF" },
  { slug:"brunch",    src:galleryBrunch,    label:"Meet the Girls Brunch - 04/18/26", album:"1IQuG4fJZrYNIPRVvNqwuPpbYDAFBOfO2" },
  { slug:"walks",     src:galleryWalks,     label:"2026 Walk Dump",                   album:"1FF6P-zbOjjmi6Ic2yknDccQ3xypMVn3K" },
];

function EventGalleryGrid({ setPage }) {
  return (
    <div className="gallery-grid-page">
      {galleryEvents.map(p=>(
        <button type="button" className="gallery-event" key={p.slug}
        onClick={()=>setPage(`Album_${p.slug}`)}
        aria-label={`View ${p.label} photo gallery`}
        style={{borderRadius:16,overflow:"hidden",position:"relative",border:BORDER,boxShadow:HARD_SM}}>
          <img src={p.src} alt="" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.4s"}}/>
          <div style={{
            position:"absolute",inset:0,
            background:`linear-gradient(to top,${C.dark}8C,transparent 45%)`,
            display:"flex",alignItems:"flex-end",padding:"0.9rem",
          }}>
            <span className="gallery-event-label" style={{fontFamily:DISPLAY,color:C.dark,background:C.cream,border:`2px solid ${C.dark}`,borderRadius:10,padding:"0.3rem 0.75rem",letterSpacing:"0.05em",lineHeight:1.1,textAlign:"left"}}>{p.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function GalleryPage({ setPage }) {
  return (
    <div style={{paddingTop:68,minHeight:"100vh",background:C.peach}}>
      <div className="section-padding page-banner" style={{background:C.cream,padding:"4rem 4rem 3rem",borderBottom:BORDER}}>
        <h1 className="page-heading" style={{fontFamily:DISPLAY,fontSize:"4rem",color:C.dark,letterSpacing:"0.02em",margin:0,lineHeight:1}}>COMMUNITY LIFE ON CAMERA</h1>
        <p style={{fontSize:"1.2rem",color:C.orchid,marginTop:"0.75rem"}}>Explore the gallery of photos for each of our events and walk.</p>
      </div>
      <div className="section-padding" style={{padding:"3rem 4rem"}}>
        <EventGalleryGrid setPage={setPage}/>
      </div>
    </div>
  );
}

// ── EVENT ALBUM PAGE ──
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
    background:C.yellow,color:C.dark,border:`2px solid ${C.dark}`,borderRadius:99,cursor:"pointer",
    fontWeight:800,fontFamily:"inherit",fontSize:"1.1rem",width:48,height:48,
  };

  return (
    <div style={{paddingTop:68,minHeight:"100vh",background:C.cream}}>
      <div className="section-padding page-banner" style={{background:C.cream,padding:"2.5rem 4rem 2.5rem",borderBottom:BORDER}}>
        <button onClick={()=>setPage("Gallery")} style={{
          background:"none",border:BORDER,color:C.dark,cursor:"pointer",
          padding:"0.5rem 1.2rem",borderRadius:99,fontSize:"0.8rem",fontWeight:800,letterSpacing:"0.06em",
          textTransform:"uppercase",fontFamily:"inherit",marginBottom:"1.5rem",
        }}>← Back to Gallery</button>
        <h1 className="page-heading" style={{fontFamily:DISPLAY,fontSize:"4rem",color:C.dark,letterSpacing:"0.02em",margin:0,lineHeight:1}}>{event.label}</h1>
        <p style={{fontSize:"1.2rem",color:C.orchid,marginTop:"0.75rem"}}>Here’s all our highlights from the day</p>
      </div>
      <div className="section-padding" style={{padding:"3rem 4rem"}}>
        <div className="album-grid">
          {photos.map((src,i)=>(
            <button type="button" key={src} className="album-photo" onClick={()=>setIndex(i)}
              aria-label={`Open photo ${i+1} of ${photos.length}`}>
              <img src={src} alt={`${event.label} — photo ${i+1}`} loading="lazy"/>
            </button>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:"3rem"}}>
          <p style={{fontFamily:DISPLAY,fontSize:"2rem",color:C.dark,letterSpacing:"0.03em",margin:"0 0 1rem"}}>When’s our next event or walk? Join our newsletter to stay updated!</p>
          <button type="button" onClick={goToNewsletter} style={{
            display:"inline-block",background:C.yellow,color:C.dark,border:BORDER,borderRadius:99,cursor:"pointer",
            padding:"0.85rem 1.75rem",fontWeight:800,fontSize:"0.85rem",letterSpacing:"0.05em",
            textTransform:"uppercase",fontFamily:"inherit",boxShadow:HARD_SM,
          }}>Join here →</button>
        </div>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={`${event.label} — photo ${index+1} of ${photos.length}`}
          onClick={()=>setIndex(null)}
          style={{position:"fixed",inset:0,zIndex:300,background:`${C.dark}F2`,display:"flex",alignItems:"center",justifyContent:"center",padding:"4.5rem 1rem 1rem"}}>
          <img src={photos[index]} alt={`${event.label} — photo ${index+1}`} onClick={e=>e.stopPropagation()}
            style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain",borderRadius:12,border:`3px solid ${C.cream}`}}/>
          <button type="button" aria-label="Close" autoFocus onClick={()=>setIndex(null)} style={{...lightboxBtn,position:"absolute",top:"1rem",right:"1rem"}}>✕</button>
          <button type="button" aria-label="Previous photo" onClick={e=>{e.stopPropagation();setIndex((index-1+photos.length)%photos.length);}} style={{...lightboxBtn,position:"absolute",left:"1rem",top:"50%",transform:"translateY(-50%)"}}>←</button>
          <button type="button" aria-label="Next photo" onClick={e=>{e.stopPropagation();setIndex((index+1)%photos.length);}} style={{...lightboxBtn,position:"absolute",right:"1rem",top:"50%",transform:"translateY(-50%)"}}>→</button>
          <div style={{position:"absolute",top:"1.4rem",left:"1rem",color:C.cream,fontSize:"0.85rem",fontWeight:700}}>{index+1} / {photos.length}</div>
        </div>
      )}
    </div>
  );
}

// ── DONATE PAGE ──
// To accept live payments: set DONATE_URL to your Stripe Payment Link / Donorbox
// URL. When set, the Donate button opens it (passing ?amount=). Leave "" to disable.
const DONATE_URL = "";

const DONATE_PILLARS = [
  { title:"Develop Resources", desc:"We create tools and resources that support women at every stage.",
  },
  { title:"Expand Opportunities", desc:"We connect women to experiences, programming, and opportunities that open doors and build confidence.",
  },
  { title:"Grow Together", desc:"We strengthen our community so more women can thrive in their careers and lives.",
  },
];

function DonatePage() {
  const [selected, setSelected] = useState(25);
  const [custom, setCustom] = useState("");
  const amounts = [10,25,50,100];
  const amount = custom ? Number(custom) : selected;
  const handleDonate = async () => {
    // Preferred: headless Shopify checkout for the selected preset amount.
    const variantId = DONATION_VARIANTS[amount];
    if (isShopifyConfigured() && variantId) {
      try {
        const url = await createCheckout([{ merchandiseId: variantId, quantity: 1 }]);
        window.location.href = url;
        return;
      } catch (err) {
        console.error("Shopify checkout failed:", err);
      }
    }
    // Fallback: external donate link (Donorbox/Stripe) if one is configured.
    if (!DONATE_URL) return;
    const sep = DONATE_URL.includes("?") ? "&" : "?";
    window.open(`${DONATE_URL}${amount ? `${sep}amount=${amount}` : ""}`, "_blank", "noopener,noreferrer");
  };
  return (
    <div style={{paddingTop:68,minHeight:"100vh",background:C.cream}}>
      <div className="section-padding split-grid" style={{
        display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3.5rem",alignItems:"center",
        maxWidth:1200,margin:"0 auto",padding:"4.5rem 4rem",
      }}>
        {/* LEFT — headline + pillars */}
        <div>
          <div style={{fontSize:"0.8rem",fontWeight:800,letterSpacing:"0.2em",color:C.pink,textTransform:"uppercase",marginBottom:"1rem"}}>Support the Community</div>
          <h1 className="page-heading" style={{fontFamily:DISPLAY,fontSize:"5rem",color:C.dark,letterSpacing:"0.01em",margin:"0 0 1.5rem",lineHeight:0.92}}>Grow the<br/>Movement.</h1>
          <p style={{fontSize:"1.05rem",color:C.dark,maxWidth:440,lineHeight:1.6,margin:"0 0 2.5rem"}}>Your support helps us develop resources, expand opportunities, and grow together. Every contribution helps create welcoming spaces where women feel seen, connected, and supported.</p>
          <div style={{display:"grid",gap:"1.75rem"}}>
            {DONATE_PILLARS.map(p=>(
              <div key={p.title}>
                <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={C.dark} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{background:C.yellow,borderRadius:"50%",padding:4,marginBottom:"0.5rem"}}><path d="M7 17L17 7M9 7h8v8"/></svg>
                <h2 style={{fontFamily:DISPLAY,fontSize:"1.6rem",fontWeight:400,color:C.dark,letterSpacing:"0.05em",marginBottom:"0.4rem"}}>{p.title}</h2>
                <p style={{fontSize:"0.82rem",color:C.muted,lineHeight:1.55,margin:0}}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — donation card */}
        <div className="donation-card" style={{background:C.cream,borderRadius:24,padding:"2.75rem",border:BORDER,boxShadow:HARD}}>
          <h3 style={{fontFamily:DISPLAY,fontSize:"1.9rem",color:C.dark,letterSpacing:"0.04em",margin:"0 0 1.75rem"}}>CHOOSE AN AMOUNT</h3>
          <div className="amount-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"0.9rem",marginBottom:"0.9rem"}}>
            {amounts.map(a=>{
              const active = !custom && selected===a;
              return (
                <button key={a} aria-pressed={active} onClick={()=>{setSelected(a);setCustom("");}} style={{
                  padding:"1.15rem",borderRadius:14,cursor:"pointer",fontWeight:800,fontSize:"1.25rem",
                  border:BORDER,
                  background:active?C.yellow:C.cream,
                  boxShadow:active?HARD_SM:"none",
                  color:C.dark,fontFamily:DISPLAY,letterSpacing:"0.05em",transition:"all 0.15s",
                }}>${a}</button>
              );
            })}
          </div>
          <input type="number" min="1" inputMode="numeric" aria-label="Custom donation amount"
            value={custom} onChange={e=>setCustom(e.target.value)} placeholder="Or enter custom amount" style={{
            width:"100%",background:C.cream,border:BORDER,borderRadius:14,
            padding:"1.05rem 1.1rem",fontSize:"1rem",outline:"none",
            fontFamily:"inherit",color:C.dark,marginBottom:"1.5rem",boxSizing:"border-box",
          }}/>
          <button onClick={handleDonate} style={{
            width:"100%",background:C.yellow,
            color:C.dark,border:BORDER,borderRadius:99,padding:"1.15rem",
            fontWeight:800,fontSize:"1.1rem",letterSpacing:"0.05em",cursor:"pointer",
            textTransform:"uppercase",fontFamily:DISPLAY,
            boxShadow:HARD,
          }}>Donate ${amount||0} →</button>
          <p style={{textAlign:"center",fontSize:"0.85rem",color:C.dark,lineHeight:1.5,marginTop:"1.5rem"}}>Thank you for helping our community grow, one contribution at a time.</p>
          <p style={{textAlign:"center",fontSize:"0.85rem",color:C.mid,lineHeight:1.5,marginTop:"1.5rem",marginBottom:0}}>
            The TGW Community is a registered nonprofit. Donations may be tax-deductible.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── FOOTER ──
function Footer({ setPage }) {
  return (
    <footer className="footer section-padding" style={{background:C.dark,padding:"3rem 4rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem",borderTop:`3px solid ${C.yellow}`}}>
      <div>
        <div style={{fontFamily:DISPLAY,fontSize:"1.4rem",color:C.cream,letterSpacing:"0.05em",marginBottom:"0.25rem"}}>TGW <span style={{color:C.yellow}}>COMMUNITY</span></div>
        <div style={{fontSize:"0.72rem",color:C.cream,letterSpacing:"0.05em"}}>© 2026 · Toronto, ON · A movement. literally.</div>
      </div>
      <div className="footer-links" style={{display:"flex",gap:"1.25rem"}}>
        {["Home","About","Events","Gallery","Donate"].map(p=>(
          <button key={p} onClick={()=>setPage(p)} style={{
            background:p==="Donate"?C.yellow:"none",border:p==="Donate"?`2px solid ${C.dark}`:"none",
            borderRadius:p==="Donate"?99:0,padding:p==="Donate"?"0.3rem 0.75rem":0,
            cursor:"pointer",fontSize:"0.75rem",color:p==="Donate"?C.dark:C.cream,
            letterSpacing:"0.06em",textTransform:"uppercase",fontFamily:"inherit",transition:"color 0.2s",
          }}
          onMouseEnter={e=>e.target.style.color=p==="Donate"?C.dark:C.yellow}
          onMouseLeave={e=>e.target.style.color=p==="Donate"?C.dark:C.cream}>{p}</button>
        ))}
      </div>
      <div className="footer-social" style={{display:"flex",gap:"1rem"}}>
        <a href="https://instagram.com/thegirlswalk" target="_blank" rel="noopener noreferrer" style={{color:C.cream,fontSize:"0.82rem",textDecoration:"none",fontWeight:600}}>@thegirlswalk</a>
        <a href="https://instagram.com/thegirlswalkcommunity" target="_blank" rel="noopener noreferrer" style={{color:C.cream,fontSize:"0.82rem",textDecoration:"none",fontWeight:600}}>@thegirlswalkcommunity</a>
      </div>
    </footer>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("Home");

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const eventDetailMatch = page.startsWith("EventDetail_");
  const eventId = eventDetailMatch ? parseInt(page.split("_")[1]) : null;

  const renderPage = () => {
    if (eventDetailMatch) return <EventDetailPage eventId={eventId} setPage={setPage}/>;
    if (page.startsWith("Album_")) return <AlbumPage key={page} slug={page.slice(6)} setPage={setPage}/>;
    switch(page) {
      case "Home":    return <HomePage setPage={setPage}/>;
      case "About":   return <AboutPage/>;
      case "Events":  return <EventsPage setPage={setPage}/>;
      case "Gallery": return <GalleryPage setPage={setPage}/>;
      case "Donate":  return <DonatePage/>;
      default:        return <HomePage setPage={setPage}/>;
    }
  };

  return (
    <div style={{minHeight:"100vh",background:C.cream,color:C.dark,fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <NavBar page={page} setPage={setPage}/>
      {renderPage()}
      <Footer setPage={setPage}/>
    </div>
  );
}
