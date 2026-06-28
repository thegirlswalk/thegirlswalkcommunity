import { useState } from "react";
import tgwLogo from "./assets/tgw-logo-yellow.png";
import "./App.css";

// ── IMAGES ─── Change these to update photos on the site ───
// Hero (front page main photo)
import heroCollage from "./assets/hero-collage.png";
// Gallery & section photos
import photoParkEvent from "./assets/photo-park-event.jpg";
import photoBrunchArch from "./assets/photo-brunch-arch.jpg";
import photoBrunchPerson from "./assets/photo-brunch-person.jpg";
import photoTgwCards from "./assets/photo-tgw-cards.jpg";

// ── COLOUR PALETTE ─────────────────────────────────────────────
const C = {
  pink:    "#E8186D",
  hotpink: "#D90F62",
  orange:  "#FF6B35",
  yellow:  "#F5A623",
  blush:   "#F2B5CB",
  cream:   "#FFF8F4",
  white:   "#FFFFFF",
  dark:    "#1A0A10",
  mid:     "#4A1A2C",
  muted:   "#9B6080",
};

const events = [
  {
    id: 1,
    type: "Weekly Walk",
    title: "Evening Walk — High Park",
    date: "Tuesday, May 27 · 7:00 PM – 8:30 PM",
    location: "5 High Park Ave, Toronto, ON",
    desc: "Our signature weekly walk through one of Toronto's most beautiful parks. All paces welcome — this is about connection, fresh air, and showing up for yourself and each other.",
    rsvp: false,
    color: C.pink,
    img: "park",
    tag: "Free · No RSVP needed",
  },
  {
    id: 2,
    type: "MTG Brunch",
    title: "Meet The Girls Brunch",
    date: "Saturday, May 9 · 11:00 AM",
    location: "The Good Sweets, 1362 Queen St W, Toronto",
    desc: "Our monthly brunch is THE event. Great food, great energy, and women who will inspire you. Each brunch features vendor partners, a vibe, and memories you won't forget.",
    rsvp: true,
    color: C.orange,
    img: "brunch_arch",
    tag: "Ticketed · RSVP Required",
  },
  {
    id: 3,
    type: "May Flowers",
    title: "May Flowers Walk & Picnic",
    date: "Sundays in May · Various Parks",
    location: "Toronto & GTA",
    desc: "Spring walks with flower picking, picnic vibes, and community. Come out and celebrate the season with women who get it.",
    rsvp: false,
    color: C.yellow,
    img: "brunch_person",
    tag: "Free · Drop-in Welcome",
  },
];

// ── NAVIGATION BAR ──
function NavBar({ page, setPage }) {
  const links = ["Home","About","Events","Gallery","Shop","Donate"];
  const [open, setOpen] = useState(false);
  return (
    <nav className="navbar" style={{
      position:"fixed", top:0, left:0, right:0, zIndex:200,
      background:"rgba(255,255,255,0.96)", backdropFilter:"blur(16px)",
      borderBottom:`3px solid ${C.pink}`,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 2rem", height:64,
    }}>
      <button className="navbar-brand" onClick={()=>{setPage("Home"); setOpen(false);}} style={{
        background:"none", border:"none", cursor:"pointer",
        display:"flex", alignItems:"center", gap:"0.6rem",
      }}>
        <img src={tgwLogo} alt="TGW" style={{height:36}} />
      </button>
      <button
        className="mobile-menu-toggle"
        onClick={()=>setOpen(v=>!v)}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        style={{
          display:"none", background:"white", border:`1px solid ${C.blush}`, cursor:"pointer",
          width:40, height:40, borderRadius:"50%", color:C.dark, fontSize:"1.2rem",
          alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        {open ? "✕" : "☰"}
      </button>
      <div className={`nav-links ${open ? "nav-links-open" : ""}`} style={{display:"flex", gap:"0.25rem", alignItems:"center"}}>
        {links.map(l => (
          <button className="nav-link-button" key={l} onClick={()=>{setPage(l); setOpen(false);}} style={{
            background: page===l ? C.pink : "transparent",
            color: page===l ? "white" : C.dark,
            border:"none", cursor:"pointer",
            padding:"0.45rem 0.85rem", borderRadius:99,
            fontWeight:600, fontSize:"0.78rem", letterSpacing:"0.04em",
            transition:"all 0.15s", textTransform:"uppercase",
            fontFamily:"inherit",
          }}>{l}</button>
        ))}
        <button className="nav-cta-button" onClick={()=>{setPage("Events"); setOpen(false);}} style={{
          marginLeft:"0.5rem",
          background:C.pink, color:"white", border:"none", cursor:"pointer",
          padding:"0.5rem 1.2rem", borderRadius:99,
          fontWeight:700, fontSize:"0.8rem", letterSpacing:"0.05em",
          boxShadow:`0 4px 12px ${C.pink}55`, textTransform:"uppercase",
          fontFamily:"inherit",
        }}>Join Us →</button>
      </div>
    </nav>
  );
}

function MarqueeBar() {
  const items = ["A MOVEMENT. LITERALLY.","FOR AMBITIOUS WOMEN","BY AMBITIOUS WOMEN","TORONTO & GTA","WEEKLY WALKS","MTG BRUNCH","MAY FLOWERS","#THEGIRLSWALK"];
  const doubled = [...items, ...items];
  return (
    <div style={{background:C.pink, overflow:"hidden", padding:"0.6rem 0", borderTop:`2px solid ${C.hotpink}`}}>
      <div style={{
        display:"flex", gap:"2.5rem", width:"max-content",
        animation:"marquee 18s linear infinite",
      }}>
        {doubled.map((t,i)=>(
          <span key={i} style={{
            color:"white", fontWeight:900,
            letterSpacing:"0.15em", whiteSpace:"nowrap",
            fontFamily:"'Bebas Neue','Impact',sans-serif", fontSize:"1rem",
            display:"flex", alignItems:"center", gap:"1.5rem",
          }}>
            {t}
            <span style={{color:"rgba(255,255,255,0.4)", fontSize:"0.5rem"}}>✦</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
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
            background:`${C.pink}15`, border:`1px solid ${C.pink}40`,
            borderRadius:99, padding:"0.35rem 1rem", marginBottom:"1.5rem",
            width:"fit-content",
          }}>
            <span style={{width:6,height:6,borderRadius:"50%",background:C.pink,display:"inline-block"}}></span>
            <span style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.15em",color:C.pink,textTransform:"uppercase"}}>Toronto & GTA · Est. April 2026</span>
          </div>
          <h1 className="hero-heading" style={{
            fontFamily:"'Bebas Neue','Impact',sans-serif",
            fontSize:"clamp(3.5rem,6vw,6.5rem)", lineHeight:0.95,
            color:C.dark, margin:"0 0 1.5rem",
            letterSpacing:"0.02em",
          }}>
            A<br/>
            <span style={{color:C.pink}}>Movement.</span><br/>
            Literally.
          </h1>
          <p style={{
            fontSize:"1.05rem", color:C.muted, lineHeight:1.7,
            maxWidth:420, marginBottom:"2rem", fontWeight:400,
          }}>
            For ambitious women, by ambitious women. Walk with us every week across Toronto and the GTA — and join a community of 500+ women who show up for themselves and each other.
          </p>
          <div style={{display:"flex", gap:"1rem", flexWrap:"wrap", marginBottom:"2.5rem"}}>
            <button onClick={()=>setPage("Events")} style={{
              background:C.pink, color:"white", border:"none", cursor:"pointer",
              padding:"0.9rem 2rem", borderRadius:99,
              fontWeight:700, fontSize:"0.9rem", letterSpacing:"0.05em",
              boxShadow:`0 8px 24px ${C.pink}44`, textTransform:"uppercase",
              fontFamily:"inherit", transition:"transform 0.2s",
            }}>Sign Up for an Event →</button>
            <button onClick={()=>setPage("About")} style={{
              background:"transparent", color:C.dark, border:`2px solid ${C.dark}`,
              cursor:"pointer", padding:"0.9rem 1.75rem", borderRadius:99,
              fontWeight:700, fontSize:"0.9rem", letterSpacing:"0.05em",
              textTransform:"uppercase", fontFamily:"inherit",
            }}>Our Story</button>
          </div>
          <div className="hero-stats" style={{display:"flex", gap:"2.5rem", borderTop:`1px solid ${C.pink}20`, paddingTop:"1.5rem"}}>
            {[["500+","Community Members"],["Weekly","Walks & Events"],["April 2026","Founded in Toronto"]].map(([n,l])=>(
              <div key={l}>
                <div style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"2rem",color:C.dark,lineHeight:1}}>{n}</div>
                <div style={{fontSize:"0.7rem",color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:"0.2rem"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Right — photo collage */}
        <div className="hero-media" style={{position:"relative", overflow:"hidden", background:C.dark}}>
          <img src={heroCollage} alt="The Girls Walk Community" style={{
            width:"100%", height:"100%", objectFit:"cover", opacity:0.85,
          }}/>
          <div style={{
            position:"absolute", inset:0,
            background:`linear-gradient(135deg, ${C.pink}33, ${C.orange}22, transparent 60%)`,
          }}/>
          <div className="hero-overlay-card" style={{
            position:"absolute", bottom:"2rem", left:"2rem", right:"2rem",
            background:"rgba(255,255,255,0.12)", backdropFilter:"blur(12px)",
            borderRadius:16, padding:"1.25rem 1.5rem",
            border:"1px solid rgba(255,255,255,0.2)",
          }}>
            <div style={{fontWeight:800,fontSize:"1rem",color:"white",marginBottom:"0.25rem",fontFamily:"'Bebas Neue','Impact',sans-serif",letterSpacing:"0.05em"}}>NEXT EVENT: HIGH PARK WALK</div>
            <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.8)"}}>Tuesday May 27 · 7:00 PM · Free to join</div>
          </div>
        </div>
      </div>

      <MarqueeBar/>

      {/* ── UPCOMING EVENTS SECTION ── */}
      <div className="section-padding" style={{padding:"5rem 4rem", background:"white"}}>
        <div className="section-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"2.5rem"}}>
          <div>
            <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.2em",color:C.pink,textTransform:"uppercase",marginBottom:"0.5rem"}}>What's On</div>
            <h2 className="section-heading" style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"3rem",color:C.dark,letterSpacing:"0.02em",margin:0}}>Upcoming Events</h2>
          </div>
          <button onClick={()=>setPage("Events")} style={{
            background:"transparent",border:`2px solid ${C.pink}`,color:C.pink,
            cursor:"pointer",padding:"0.6rem 1.4rem",borderRadius:99,
            fontWeight:700,fontSize:"0.78rem",letterSpacing:"0.06em",
            textTransform:"uppercase",fontFamily:"inherit",
          }}>View All →</button>
        </div>
        <div className="cards-grid-3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.25rem"}}>
          {events.map(e=>(
            <EventCard key={e.id} event={e} setPage={setPage}/>
          ))}
        </div>
      </div>

      {/* ── PHOTO GALLERY SECTION ── */}
      <div className="section-padding" style={{padding:"4rem",background:C.cream}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.2em",color:C.pink,textTransform:"uppercase",marginBottom:"0.5rem"}}>Community Moments</div>
          <h2 className="section-heading" style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"3rem",color:C.dark,letterSpacing:"0.02em",margin:0}}>Life in the Walk</h2>
        </div>
        <div className="gallery-grid-home" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gridTemplateRows:"200px 200px",gap:"1rem"}}>
          <div style={{gridColumn:"span 2",gridRow:"span 2",borderRadius:20,overflow:"hidden"}}>
            <img src={photoBrunchArch} alt="Brunch" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          </div>
          <div style={{borderRadius:16,overflow:"hidden"}}>
            <img src={photoBrunchPerson} alt="Community" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          </div>
          <div style={{borderRadius:16,overflow:"hidden"}}>
            <img src={photoTgwCards} alt="TGW" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          </div>
          <div style={{borderRadius:16,overflow:"hidden"}}>
            <img src={photoParkEvent} alt="Park event" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          </div>
          <div style={{borderRadius:16,overflow:"hidden",background:`linear-gradient(135deg,${C.pink},${C.orange})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{textAlign:"center",color:"white",padding:"1rem"}}>
              <div style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"2.5rem",letterSpacing:"0.1em"}}>TGW</div>
              <div style={{fontSize:"0.7rem",letterSpacing:"0.15em",textTransform:"uppercase",opacity:0.85}}>@thegirlswalk</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CALL TO ACTION (Join the Walk) ── */}
      <div className="section-padding cta-section" style={{
        background:`linear-gradient(135deg,${C.hotpink},${C.orange})`,
        padding:"5rem 4rem",textAlign:"center",position:"relative",overflow:"hidden",
      }}>
        <div style={{position:"relative",zIndex:2}}>
          <div style={{fontSize:"0.78rem",fontWeight:700,letterSpacing:"0.2em",color:"rgba(255,255,255,0.7)",textTransform:"uppercase",marginBottom:"1rem"}}>Join the Movement</div>
          <h2 style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"clamp(2.5rem,5vw,5rem)",color:"white",letterSpacing:"0.02em",margin:"0 0 1rem",lineHeight:0.95}}>YOUR NEXT CHAPTER<br/>STARTS WITH A WALK.</h2>
          <p style={{fontSize:"1rem",color:"rgba(255,255,255,0.85)",maxWidth:480,margin:"0 auto 2rem",lineHeight:1.7}}>
            Sign up for our next event and become part of a community of women who show up, walk boldly, and rise together.
          </p>
          <div className="email-row" style={{display:"flex",gap:"0.75rem",maxWidth:420,margin:"0 auto 2rem",justifyContent:"center"}}>
            <input placeholder="Your email address" style={{
              flex:1,background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.4)",
              borderRadius:99,padding:"0.85rem 1.5rem",color:"white",
              fontSize:"0.88rem",outline:"none",fontFamily:"inherit",
              "::placeholder":{color:"rgba(255,255,255,0.6)"},
            }}/>
            <button style={{
              background:"white",color:C.pink,border:"none",cursor:"pointer",
              borderRadius:99,padding:"0.85rem 1.75rem",
              fontWeight:800,fontSize:"0.85rem",letterSpacing:"0.05em",
              textTransform:"uppercase",fontFamily:"inherit",whiteSpace:"nowrap",
            }}>Join →</button>
          </div>
          <div className="social-row" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"1rem"}}>
            <span style={{fontSize:"0.75rem",color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:"0.1em"}}>Follow us</span>
            <a href="https://instagram.com/thegirlswalk" target="_blank" style={{color:"white",fontSize:"0.85rem",fontWeight:700,textDecoration:"none"}}>@thegirlswalk</a>
            <span style={{color:"rgba(255,255,255,0.3)"}}>·</span>
            <a href="https://instagram.com/thegirlswalkcommunity" target="_blank" style={{color:"white",fontSize:"0.85rem",fontWeight:700,textDecoration:"none"}}>@thegirlswalkcommunity</a>
          </div>
        </div>
      </div>

      {/* ── NEWSLETTER SIGNUP ── */}
      <div className="section-padding" style={{padding:"5rem 4rem",background:"white",textAlign:"center"}}>
        <div style={{maxWidth:560,margin:"0 auto"}}>
          <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.2em",color:C.pink,textTransform:"uppercase",marginBottom:"0.75rem"}}>STAY CONNECTED</div>
          <h2 style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"2.5rem",color:C.dark,letterSpacing:"0.02em",margin:"0 0 0.75rem"}}>JOIN OUR NEWSLETTER</h2>
          <p style={{fontSize:"0.95rem",color:C.muted,lineHeight:1.7,marginBottom:"2rem"}}>
            Get updates on upcoming walks, events, community stories, and merch drops — straight to your inbox.
          </p>
          <div className="email-row" style={{display:"flex",gap:"0.75rem",maxWidth:440,margin:"0 auto"}}>
            <input placeholder="Enter your email" style={{
              flex:1,border:`2px solid ${C.blush}`,borderRadius:99,
              padding:"0.85rem 1.25rem",fontSize:"0.9rem",outline:"none",
              fontFamily:"inherit",color:C.dark,
            }}/>
            <button style={{
              background:`linear-gradient(135deg,${C.pink},${C.orange})`,
              color:"white",border:"none",borderRadius:99,
              padding:"0.85rem 1.75rem",cursor:"pointer",fontWeight:700,
              fontSize:"0.85rem",letterSpacing:"0.05em",textTransform:"uppercase",
              fontFamily:"inherit",whiteSpace:"nowrap",
              boxShadow:`0 4px 16px ${C.pink}44`,
            }}>Subscribe</button>
          </div>
          <p style={{fontSize:"0.72rem",color:C.muted,marginTop:"1rem"}}>No spam, ever. Unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event, setPage }) {
  return (
    <div onClick={()=>setPage("EventDetail_"+event.id)} style={{
      background:"white",borderRadius:20,overflow:"hidden",cursor:"pointer",
      border:`1px solid ${C.blush}`,transition:"all 0.25s",
      boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
    }}
    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 16px 32px ${event.color}33`}}
    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.06)"}}>
      <div style={{height:180,position:"relative",overflow:"hidden"}}>
        <img src={event.img} alt={event.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        <div style={{position:"absolute",inset:0,background:`linear-gradient(to top,${event.color}88,transparent 60%)`}}/>
        <span style={{
          position:"absolute",top:"0.75rem",left:"0.75rem",
          background:"rgba(255,255,255,0.9)",color:event.color,
          padding:"0.25rem 0.75rem",borderRadius:99,fontSize:"0.68rem",
          fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",
        }}>{event.type}</span>
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
      <div className="event-detail-banner" style={{height:400,position:"relative",overflow:"hidden"}}>
        <img src={event.img} alt={event.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        <div style={{position:"absolute",inset:0,background:`linear-gradient(to top,${C.dark}CC,transparent 40%)`}}/>
        <button onClick={()=>setPage("Events")} style={{
          position:"absolute",top:"1.5rem",left:"1.5rem",
          background:"rgba(255,255,255,0.15)",backdropFilter:"blur(8px)",
          border:"1px solid rgba(255,255,255,0.3)",color:"white",cursor:"pointer",
          padding:"0.5rem 1rem",borderRadius:99,fontSize:"0.8rem",fontWeight:700,fontFamily:"inherit",
        }}>← Back to Events</button>
        <div className="event-detail-banner-copy" style={{position:"absolute",bottom:"2rem",left:"3rem",right:"3rem"}}>
          <span style={{background:event.color,color:"white",padding:"0.3rem 0.9rem",borderRadius:99,fontSize:"0.72rem",fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase"}}>{event.type}</span>
          <h1 className="page-heading" style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"3.5rem",color:"white",letterSpacing:"0.02em",margin:"0.75rem 0 0",lineHeight:1}}>{event.title}</h1>
        </div>
      </div>
      <div style={{maxWidth:800,margin:"0 auto",padding:"3rem 2rem"}}>
        <div className="detail-info-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"2rem"}}>
          {[["📅",event.date],["📍",event.location],["🎟",event.tag],["💬","Join our WhatsApp for updates"]].map(([icon,text])=>(
            <div key={text} style={{background:"white",borderRadius:12,padding:"1rem 1.25rem",display:"flex",alignItems:"flex-start",gap:"0.75rem",border:`1px solid ${C.blush}`}}>
              <span style={{fontSize:"1.2rem"}}>{icon}</span>
              <span style={{fontSize:"0.88rem",color:C.dark,lineHeight:1.5,fontWeight:500}}>{text}</span>
            </div>
          ))}
        </div>
        <h3 style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"1.6rem",color:C.dark,letterSpacing:"0.02em",marginBottom:"0.75rem"}}>About This Event</h3>
        <p style={{fontSize:"0.95rem",color:C.muted,lineHeight:1.8,marginBottom:"2rem"}}>{event.desc}</p>
        <button style={{
          background:event.color,color:"white",border:"none",cursor:"pointer",
          padding:"1rem 2.5rem",borderRadius:99,fontWeight:800,fontSize:"1rem",
          letterSpacing:"0.05em",textTransform:"uppercase",fontFamily:"inherit",
          boxShadow:`0 8px 24px ${event.color}44`,
        }}>{event.rsvp ? "Reserve My Spot →" : "Join the Walk →"}</button>
      </div>
    </div>
  );
}

// ── EVENTS PAGE ──
function EventsPage({ setPage }) {
  return (
    <div style={{paddingTop:64,minHeight:"100vh",background:C.cream}}>
      <div className="section-padding page-banner" style={{background:`linear-gradient(135deg,${C.pink},${C.orange})`,padding:"4rem 4rem 3rem"}}>
        <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.2em",color:"rgba(255,255,255,0.7)",textTransform:"uppercase",marginBottom:"0.75rem"}}>Community Events</div>
        <h1 className="page-heading" style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"4rem",color:"white",letterSpacing:"0.02em",margin:0,lineHeight:1}}>UPCOMING EVENTS</h1>
        <p style={{fontSize:"1rem",color:"rgba(255,255,255,0.85)",marginTop:"0.75rem",maxWidth:500}}>From weekly walks to monthly brunches — there's always something to show up to.</p>
      </div>
      <MarqueeBar/>
      <div className="section-padding" style={{padding:"3rem 4rem"}}>
        <div className="cards-grid-3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.5rem"}}>
          {events.map(e=><EventCard key={e.id} event={e} setPage={setPage}/>)}
        </div>
      </div>
    </div>
  );
}

// ── ABOUT PAGE ──
function AboutPage() {
  return (
    <div style={{paddingTop:64,minHeight:"100vh",background:C.cream}}>
      <div className="split-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:480}}>
        <div style={{overflow:"hidden"}}>
          <img src={photoParkEvent} alt="Community" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        </div>
        <div className="section-padding split-content" style={{background:C.pink,padding:"5rem 4rem",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.2em",color:"rgba(255,255,255,0.7)",textTransform:"uppercase",marginBottom:"1rem"}}>Who We Are</div>
          <h1 className="page-heading" style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"3.5rem",color:"white",letterSpacing:"0.02em",margin:"0 0 1.5rem",lineHeight:1}}>BUILT FOR WOMEN WHO MOVE WITH INTENTION.</h1>
          <p style={{fontSize:"0.95rem",color:"rgba(255,255,255,0.9)",lineHeight:1.8,marginBottom:"1.5rem"}}>
            The Girls Walk Community was founded in April 2026 with a simple belief: women are stronger when they move together. What started as walks through Toronto's neighbourhoods has grown into a thriving community of 500+ ambitious women.
          </p>
          <p style={{fontSize:"0.95rem",color:"rgba(255,255,255,0.9)",lineHeight:1.8}}>
            To build a safe, uplifting community where women connect through walks, events, and shared experiences that promote wellness, confidence, community, and genuine networking opportunities.
          </p>
        </div>
      </div>
      <div className="section-padding" style={{padding:"5rem 4rem",background:"white"}}>
        <div style={{textAlign:"center",marginBottom:"3rem"}}>
          <h2 className="section-heading" style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"3rem",color:C.dark,letterSpacing:"0.02em"}}>WHAT WE DO</h2>
        </div>
        <div className="cards-grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1.5rem"}}>
          {[
            {emoji:"🚶🏾‍♀️",title:"Weekly Walks",desc:"Every week across Toronto & GTA parks. All paces, all vibes."},
            {emoji:"🥂",title:"MTG Brunch",desc:"Monthly brunch events with vendors, vibes, and community."},
            {emoji:"☕",title:"Coffee & Tea",desc:"Casual bi-weekly meetups to connect and recharge."},
            {emoji:"🌸",title:"Seasonal Events",desc:"Flower picking, picnics, workshops and more."},
          ].map(({emoji,title,desc})=>(
            <div key={title} style={{background:C.cream,borderRadius:20,padding:"2rem 1.5rem",textAlign:"center",border:`1px solid ${C.blush}`}}>
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
function GalleryPage() {
  const photos = [
    {src:photoBrunchArch,label:"Meet The Girls Brunch — April 2026",span:"col"},
    {src:photoBrunchPerson,label:"MTG Brunch — May 2026"},
    {src:photoTgwCards,label:"TGW Merch & Branding"},
    {src:photoParkEvent,label:"May Flowers Park Event"},
    {src:heroCollage,label:"@thegirlswalk on Instagram"},
  ];
  return (
    <div style={{paddingTop:64,minHeight:"100vh",background:C.cream}}>
      <div className="section-padding page-banner" style={{background:C.dark,padding:"4rem 4rem 3rem"}}>
        <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.2em",color:C.pink,textTransform:"uppercase",marginBottom:"0.75rem"}}>Moments</div>
        <h1 className="page-heading" style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"4rem",color:"white",letterSpacing:"0.02em",margin:0,lineHeight:1}}>LIFE IN THE COMMUNITY</h1>
        <p style={{fontSize:"1rem",color:"rgba(255,255,255,0.6)",marginTop:"0.75rem"}}>Real women. Real moments. Real community.</p>
      </div>
      <div className="section-padding" style={{padding:"3rem 4rem"}}>
        <div className="gallery-grid-page" style={{
          display:"grid",
          gridTemplateColumns:"repeat(4,1fr)",
          gridTemplateRows:"280px 280px",
          gap:"1rem",
        }}>
          {photos.map((p,i)=>(
            <div key={p.src} style={{
              gridColumn: i===0 ? "span 2" : "",
              gridRow: i===0 ? "span 2" : "",
              borderRadius:20,overflow:"hidden",position:"relative",cursor:"pointer",
            }}
            onMouseEnter={e=>{e.currentTarget.querySelector("img").style.transform="scale(1.05)"}}
            onMouseLeave={e=>{e.currentTarget.querySelector("img").style.transform="scale(1)"}}>
              <img src={p.src} alt={p.label} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.4s"}}/>
              <div style={{
                position:"absolute",inset:0,
                background:"linear-gradient(to top,rgba(0,0,0,0.6),transparent 50%)",
                display:"flex",alignItems:"flex-end",padding:"1.25rem",
              }}>
                <span style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"0.95rem",color:"white",letterSpacing:"0.05em"}}>{p.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SHOP PAGE ──
function ShopPage() {
  return (
    <div style={{paddingTop:64,minHeight:"100vh",background:C.cream}}>
      <div className="section-padding page-banner" style={{background:`linear-gradient(135deg,${C.yellow},${C.orange})`,padding:"4rem 4rem 3rem"}}>
        <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.2em",color:"rgba(255,255,255,0.7)",textTransform:"uppercase",marginBottom:"0.75rem"}}>TGW Shop</div>
        <h1 className="page-heading" style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"4rem",color:"white",letterSpacing:"0.02em",margin:0,lineHeight:1}}>WEAR THE MOVEMENT.</h1>
      </div>
      <div className="section-padding" style={{padding:"5rem 4rem",textAlign:"center"}}>
        <div style={{maxWidth:500,margin:"0 auto"}}>
          <div style={{fontSize:"4rem",marginBottom:"1.5rem"}}>👟</div>
          <h2 style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"2.5rem",color:C.dark,letterSpacing:"0.02em",margin:"0 0 1rem"}}>MERCHANDISE DROPPING SOON</h2>
          <p style={{fontSize:"1rem",color:C.muted,lineHeight:1.7,marginBottom:"2rem"}}>
            We're working on something special. Sign up below to be the first to know when our merch goes live.
          </p>
          <div style={{display:"flex",gap:"0.75rem",maxWidth:400,margin:"0 auto"}}>
            <input placeholder="Your email" style={{
              flex:1,border:`2px solid ${C.blush}`,borderRadius:99,
              padding:"0.85rem 1.25rem",fontSize:"0.9rem",outline:"none",
              fontFamily:"inherit",color:C.dark,
            }}/>
            <button style={{
              background:C.pink,color:"white",border:"none",borderRadius:99,
              padding:"0.85rem 1.75rem",cursor:"pointer",fontWeight:700,
              fontSize:"0.85rem",letterSpacing:"0.05em",textTransform:"uppercase",
              fontFamily:"inherit",whiteSpace:"nowrap",
            }}>Notify Me</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DONATE PAGE ──
function DonatePage() {
  const [selected, setSelected] = useState(25);
  const amounts = [10,25,50,100];
  return (
    <div style={{paddingTop:64,minHeight:"100vh",background:C.cream}}>
      <div className="section-padding page-banner" style={{background:`linear-gradient(135deg,${C.hotpink},${C.pink})`,padding:"4rem 4rem 3rem",textAlign:"center"}}>
        <div style={{fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.2em",color:"rgba(255,255,255,0.7)",textTransform:"uppercase",marginBottom:"0.75rem"}}>Support the Community</div>
        <h1 className="page-heading" style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"4rem",color:"white",letterSpacing:"0.02em",margin:"0 0 1rem",lineHeight:1}}>FUEL THE MOVEMENT.</h1>
        <p style={{fontSize:"1rem",color:"rgba(255,255,255,0.9)",maxWidth:480,margin:"0 auto"}}>Your donation helps us keep events free, accessible, and life-changing for women across Toronto & GTA.</p>
      </div>
      <div style={{maxWidth:600,margin:"3rem auto",padding:"0 2rem"}}>
        <div style={{background:"white",borderRadius:24,padding:"2.5rem",boxShadow:"0 8px 32px rgba(0,0,0,0.08)"}}>
          <h3 style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"1.5rem",color:C.dark,letterSpacing:"0.05em",marginBottom:"1.5rem"}}>CHOOSE AN AMOUNT</h3>
          <div className="amount-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.75rem",marginBottom:"1.5rem"}}>
            {amounts.map(a=>(
              <button key={a} onClick={()=>setSelected(a)} style={{
                padding:"1rem",borderRadius:12,cursor:"pointer",fontWeight:800,fontSize:"1.1rem",
                border:`2px solid ${selected===a?C.pink:C.blush}`,
                background:selected===a?C.pink:"white",
                color:selected===a?"white":C.dark,fontFamily:"'Bebas Neue','Impact',sans-serif",
                letterSpacing:"0.05em",transition:"all 0.15s",
              }}>${a}</button>
            ))}
          </div>
          <input placeholder="Or enter custom amount" style={{
            width:"100%",border:`2px solid ${C.blush}`,borderRadius:12,
            padding:"0.85rem 1rem",fontSize:"0.95rem",outline:"none",
            fontFamily:"inherit",color:C.dark,marginBottom:"1.5rem",boxSizing:"border-box",
          }}/>
          <button style={{
            width:"100%",background:`linear-gradient(135deg,${C.pink},${C.orange})`,
            color:"white",border:"none",borderRadius:99,padding:"1.1rem",
            fontWeight:800,fontSize:"1rem",letterSpacing:"0.05em",cursor:"pointer",
            textTransform:"uppercase",fontFamily:"inherit",
            boxShadow:`0 8px 24px ${C.pink}44`,
          }}>Donate ${selected} →</button>
          <p style={{textAlign:"center",fontSize:"0.78rem",color:C.muted,marginTop:"1rem"}}>
            The Girls Walk Community is a registered nonprofit. Donations may be tax-deductible.
          </p>
        </div>
        <div style={{marginTop:"2rem",textAlign:"center"}}>
          <div style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"1.2rem",color:C.dark,letterSpacing:"0.05em",marginBottom:"0.5rem"}}>YOUR IMPACT</div>
          <div className="cards-grid-3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1rem",marginTop:"1rem"}}>
            {[["$10","Covers walk supplies for one event"],["$25","Sponsors one woman's brunch ticket"],["$50","Funds a full community workshop"]].map(([amt,desc])=>(
              <div key={amt} style={{background:"white",borderRadius:16,padding:"1.25rem",textAlign:"center",border:`1px solid ${C.blush}`}}>
                <div style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"1.8rem",color:C.pink,marginBottom:"0.25rem"}}>{amt}</div>
                <p style={{fontSize:"0.78rem",color:C.muted,lineHeight:1.5}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FOOTER ──
function Footer({ setPage }) {
  return (
    <footer className="footer section-padding" style={{background:C.dark,padding:"3rem 4rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
      <div>
        <div style={{fontFamily:"'Bebas Neue','Impact',sans-serif",fontSize:"1.2rem",color:"white",letterSpacing:"0.05em",marginBottom:"0.25rem"}}>TGW <span style={{color:C.pink}}>COMMUNITY</span></div>
        <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.4)",letterSpacing:"0.05em"}}>© 2026 · Toronto, ON · A movement. literally.</div>
      </div>
      <div className="footer-links" style={{display:"flex",gap:"1.25rem"}}>
        {["Home","About","Events","Gallery","Donate"].map(p=>(
          <button key={p} onClick={()=>setPage(p)} style={{background:"none",border:"none",cursor:"pointer",fontSize:"0.75rem",color:"rgba(255,255,255,0.4)",letterSpacing:"0.06em",textTransform:"uppercase",fontFamily:"inherit",transition:"color 0.2s"}}
          onMouseEnter={e=>e.target.style.color=C.pink}
          onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.4)"}>{p}</button>
        ))}
      </div>
      <div className="footer-social" style={{display:"flex",gap:"1rem"}}>
        <a href="https://instagram.com/thegirlswalk" target="_blank" style={{color:"rgba(255,255,255,0.5)",fontSize:"0.82rem",textDecoration:"none",fontWeight:600}}>@thegirlswalk</a>
        <a href="https://instagram.com/thegirlswalkcommunity" target="_blank" style={{color:"rgba(255,255,255,0.5)",fontSize:"0.82rem",textDecoration:"none",fontWeight:600}}>@thegirlswalkcommunity</a>
      </div>
    </footer>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("Home");

  const eventDetailMatch = page.startsWith("EventDetail_");
  const eventId = eventDetailMatch ? parseInt(page.split("_")[1]) : null;

  const renderPage = () => {
    if (eventDetailMatch) return <EventDetailPage eventId={eventId} setPage={setPage}/>;
    switch(page) {
      case "Home":    return <HomePage setPage={setPage}/>;
      case "About":   return <AboutPage/>;
      case "Events":  return <EventsPage setPage={setPage}/>;
      case "Gallery": return <GalleryPage/>;
      case "Shop":    return <ShopPage/>;
      case "Donate":  return <DonatePage/>;
      default:        return <HomePage setPage={setPage}/>;
    }
  };

  return (
    <div style={{minHeight:"100vh",fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <NavBar page={page} setPage={setPage}/>
      {renderPage()}
      <Footer setPage={setPage}/>
    </div>
  );
}
