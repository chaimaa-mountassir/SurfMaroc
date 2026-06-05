import { useState, useEffect, useRef } from "react";
import logo from "../assets/ChatGPT Image 28 mai 2026, 22_55_44.png";

// ─── SHARED DESIGN TOKENS & STYLES ───────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  :root {
    --ink: #0f1923; --ink2: #2c3e50; --muted: #64748b; --faint: #94a3b8;
    --line: rgba(15,25,35,.1); --line2: rgba(15,25,35,.06);
    --sand: #fafaf8; --sand2: #f4f1ec; --sand3: #ece8e0;
    --ocean: #0369a1; --ocean2: #0ea5e9; --white: #ffffff;
    --serif: 'Libre Baskerville', Georgia, serif;
    --sans: 'Outfit', system-ui, sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }
  body { font-family: var(--serif); background: var(--sand); color: var(--ink); overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--sand); }
  ::-webkit-scrollbar-thumb { background: var(--sand3); border-radius: 2px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
  @keyframes floatBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes ripple { 0% { transform:scale(1); opacity:.6 } 100% { transform:scale(2.2); opacity:0 } }
  @keyframes lineGrow { from{width:0} to{width:100%} }
  @keyframes shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }

  .nav-link {
    font-family: var(--sans); font-size: 12px; font-weight: 500;
    letter-spacing: .1em; text-transform: uppercase; color: var(--muted);
    text-decoration: none; position: relative; padding-bottom: 4px; transition: color .2s;
  }
  .nav-link::after {
    content:''; position:absolute; left:0; bottom:0; height:1px; width:0;
    background:var(--ocean); transition:width .3s ease;
  }
  .nav-link:hover { color:var(--ink); }
  .nav-link:hover::after { width:100%; }
  .nav-link.active { color:var(--ink); }
  .nav-link.active::after { width:100%; }

  .btn-primary {
    font-family:var(--sans); font-size:12px; font-weight:600;
    letter-spacing:.12em; text-transform:uppercase; background:var(--ink); color:var(--white);
    border:none; padding:14px 32px; cursor:pointer;
    transition:background .2s,transform .15s,box-shadow .2s;
    box-shadow:0 2px 12px rgba(15,25,35,.18);
  }
  .btn-primary:hover { background:var(--ocean); transform:translateY(-1px); box-shadow:0 6px 24px rgba(3,105,161,.3); }
  .btn-primary:active { transform:translateY(0); }

  .btn-secondary {
    font-family:var(--sans); font-size:12px; font-weight:500;
    letter-spacing:.1em; text-transform:uppercase; background:transparent;
    color:var(--ink2); border:1.5px solid var(--sand3); padding:13px 30px; cursor:pointer;
    transition:border-color .2s,color .2s,background .2s;
  }
  .btn-secondary:hover { border-color:var(--ink); color:var(--ink); background:var(--sand2); }

  .section-label {
    font-family:var(--mono); font-size:10px; font-weight:500;
    letter-spacing:.2em; text-transform:uppercase; color:var(--ocean);
    margin-bottom:16px; display:flex; align-items:center; gap:10px;
  }
  .section-label::before { content:''; display:inline-block; width:28px; height:1px; background:var(--ocean); }

  .live-dot { width:7px; height:7px; border-radius:50%; background:#10b981; position:relative; flex-shrink:0; }
  .live-dot::after { content:''; position:absolute; inset:-3px; border-radius:50%; border:1.5px solid #10b981; animation:ripple 1.8s ease-out infinite; }

  .spot-card { flex:0 0 300px; background:var(--white); border:1px solid var(--line); cursor:pointer; transition:transform .4s cubic-bezier(.4,0,.2,1),box-shadow .4s; overflow:hidden; }
  .spot-card:hover { transform:translateY(-8px); box-shadow:0 24px 56px rgba(15,25,35,.12); }
  .spot-card .cover { position:relative; overflow:hidden; }
  .spot-card .cover img { width:100%; height:220px; object-fit:cover; display:block; filter:saturate(1.05); transition:transform .7s cubic-bezier(.4,0,.2,1); }
  .spot-card:hover .cover img { transform:scale(1.06); }

  .gal-grid { display:grid; grid-template-columns:2fr 1fr 1fr; grid-template-rows:260px 260px; gap:4px; }
  .gal-grid .g-tall { grid-row:1/3; }
  .g-item { overflow:hidden; position:relative; background:var(--sand3); cursor:pointer; }
  .g-item img { width:100%; height:100%; object-fit:cover; display:block; filter:saturate(1.0) brightness(.95); transition:transform .6s cubic-bezier(.4,0,.2,1),filter .4s; }
  .g-item:hover img { transform:scale(1.04); filter:saturate(1.15) brightness(1.02); }
  .g-label { position:absolute; bottom:0; left:0; right:0; padding:20px 14px 12px; background:linear-gradient(to top, rgba(15,25,35,.55), transparent); font-family:var(--mono); font-size:10px; color:rgba(255,255,255,.85); letter-spacing:.07em; }

  .feat-card { background:var(--white); border:1px solid var(--line); padding:32px 26px; transition:border-color .25s,box-shadow .25s,transform .25s; }
  .feat-card:hover { border-color:var(--ocean2); box-shadow:0 8px 32px rgba(3,105,161,.08); transform:translateY(-4px); }

  .testi-card { background:var(--white); border:1px solid var(--line); padding:32px 26px; transition:box-shadow .25s; }
  .testi-card:hover { box-shadow:0 12px 40px rgba(15,25,35,.08); }

  .pull-quote { font-family:var(--serif); font-style:italic; font-size:28px; line-height:1.55; color:var(--ink2); border-left:3px solid var(--ocean); padding-left:28px; margin:0; }

  @media (max-width: 1024px) {
    .nav-links { display: none !important; }
    .hero-content { padding: 0 36px !important; padding-top: 96px !important; }
    .hero-title { font-size: 52px !important; }
    .float-widget { display: none !important; }
    .why-grid { grid-template-columns: 1fr !important; gap: 56px !important; }
    .feat-grid { grid-template-columns: 1fr 1fr !important; }
    .testi-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
    .gal-grid { grid-template-columns: 1fr 1fr !important; grid-template-rows: auto !important; }
    .gal-grid .g-tall { grid-row: auto; }
    .footer-cols { flex-direction: column !important; gap: 44px !important; }
    .intro-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
  }
  @media (max-width: 640px) {
    .hero-title { font-size: 38px !important; }
    .feat-grid { grid-template-columns: 1fr !important; }
    .gal-grid { grid-template-columns: 1fr !important; }
    .hero-stats { gap: 28px !important; }
  }
`;

// ─── DATA ────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Spots",    id: "spots",   page: "spots"},
  { label: "Guide",    id: "guide",   page: "guide"},
  { label: "Galerie",  id: "galerie", page: "galerie"},
  { label: "À propos", id: "apropos", page: "apropos"},
  { label: "Contact",  id: "contact", page: "contact"},
];

const HOME_SPOTS = [
  { name:"Taghazout", country:"Maroc · Souss-Massa", tag:"World Class", level:"Intermédiaire", wave:"2 – 4m", season:"Oct – Avr", desc:"Le joyau incontesté du surf marocain. Des point breaks cristallins, une lumière dorée et un village entièrement voué à la culture surf.", img:"https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=900&q=92", accent:"#0369a1", light:"#e0f2fe" },
  { name:"Safi",      country:"Maroc · Marrakech-Safi", tag:"Compétition", level:"Expert", wave:"4 – 8m", season:"Nov – Mar", desc:"L'une des vagues les plus redoutées d'Afrique. Un gauche de légende qui accueille les élites mondiales depuis des décennies.", img:"https://images.unsplash.com/photo-1455264745730-cb3b76250c77?w=900&q=92", accent:"#b45309", light:"#fef3c7" },
  { name:"Imsouane",  country:"Maroc · Agadir-Ida-Ou-Tanane", tag:"Tous niveaux", level:"Débutant → Pro", wave:"1 – 2m", season:"Toute l'année", desc:"La plus longue vague surfable d'Afrique. Cette baie enchanteresse accueille débutants et longboarders dans une atmosphère paisible.", img:"https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?w=900&q=92", accent:"#047857", light:"#d1fae5" },
  { name:"Essaouira", country:"Maroc · Marrakech-Safi", tag:"Wind & Waves", level:"Intermédiaire", wave:"2 – 3m", season:"Mai – Sep", desc:"Capitale africaine du vent. Cette médina millénaire offre des sessions kitesurf et surf dans un décor de carte postale inoubliable.", img:"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&q=92", accent:"#7c3aed", light:"#ede9fe" },
];

const HOME_GALLERY = [
  { src:"https://images.unsplash.com/photo-1455264745730-cb3b76250c77?w=1200&q=90", label:"Safi · Break de compétition", tall:true },
  { src:"https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=85", label:"Lever de soleil · Taghazout" },
  { src:"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=85", label:"Crépuscule · Essaouira" },
  { src:"https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?w=800&q=85", label:"Baie d'Imsouane" },
  { src:"https://images.unsplash.com/photo-1476673160081-cf065607f449?w=800&q=85", label:"Houle atlantique" },
];

const FEATURES = [
  { icon:"🗺️", title:"Conditions en direct", desc:"Prévisions de vagues, vent et marées pour chaque spot — mis à jour toutes les heures." },
  { icon:"🎓", title:"Coachs certifiés ISA", desc:"Des instructeurs professionnels adaptés précisément à votre niveau et vos ambitions." },
  { icon:"🏡", title:"Hébergements sélectionnés", desc:"Riads, camps de surf et éco-lodges triés sur le volet, à quelques pas de l'eau." },
  { icon:"📸", title:"Photo & Cinéma", desc:"Une équipe de photographes et vidéastes pour immortaliser chaque session." },
];

const TESTI = [
  { name:"Karim B.", loc:"Casablanca", text:"Safi était une expérience hors du commun. L'équipe connaît chaque nuance du break et m'a guidé avec une expertise rare.", stars:5 },
  { name:"Sophie M.", loc:"Lyon, France", text:"Imsouane m'a complètement conquise. Coaching patient, atmosphère magique. Je repars dans six mois.", stars:5 },
  { name:"Alex R.", loc:"Londres, UK", text:"Taghazout était exactement ce que les légendes promettaient. Déjà réservé pour la prochaine saison.", stars:5 },
];

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
// onReserver : prop transmise depuis App.js pour naviguer vers Reservation.jsx
// onNavigate : prop pour naviguer vers les autres pages
function Navbar({ onReserver, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // hauteur navbar
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 64);
      // Detect active section
      const ids = NAV_ITEMS.map(n => n.id);
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:300, height:68,
      display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 48px",
      background: scrolled ? "rgba(250,250,248,.96)" : "transparent",
      backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
      borderBottom: scrolled ? "1px solid var(--line)" : "none",
      transition:"background .35s, border .35s",
    }}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:11 }}>
        <div style={{ width:42, height:42, borderRadius:10, overflow:"hidden", border:"1px solid var(--line)", background:"#e0f2fe", flexShrink:0 }}>
          <img src={logo} alt="SurfMorocco" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
        </div>
        <div>
          <div style={{ fontFamily:"var(--sans)", fontSize:17, fontWeight:700, letterSpacing:"-.025em", lineHeight:1.1, color:"var(--ink)" }}>
            Surf<span style={{ color:"var(--ocean)" }}>Morocco</span>
          </div>
          <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--faint)", letterSpacing:".16em", textTransform:"uppercase" }}>Est. 2019</div>
        </div>
      </div>

      {/* Nav links */}
      <div className="nav-links" style={{ display:"flex", gap:40, alignItems:"center" }}>
        {NAV_ITEMS.map(({ label, id, page }) => (
          <a key={id} href={page ? `#${page}` : `#${id}`}
            className={`nav-link${!page && activeSection === id ? " active" : ""}`}
            onClick={e => {
              e.preventDefault();
              if (page && onNavigate) { onNavigate(page); }
              else { scrollToSection(id); }
            }}>{label}</a>
        ))}
      </div>

      {/* ── BOUTON RÉSERVER → navigue vers Reservation.jsx ── */}
      <button
        className="btn-primary"
        style={{ padding:"10px 24px", fontSize:11 }}
        onClick={onReserver}
      >
        Réserver une session
      </button>
    </nav>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer({ onReserver, id }) {
  return (
    <footer id={id} style={{ background:"var(--ink)", color:"rgba(255,255,255,.55)", padding:"60px 72px 36px" }}>
      <div style={{ maxWidth:1300, margin:"0 auto" }}>
        <div className="footer-cols" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:44, marginBottom:56 }}>
          {/* Brand */}
          <div style={{ maxWidth:260 }}>
            <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:16 }}>
              <div style={{ width:36, height:36, borderRadius:8, overflow:"hidden", border:"1px solid rgba(255,255,255,.15)", background:"rgba(255,255,255,.08)", flexShrink:0 }}>
                <img src={logo} alt="Logo" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              </div>
              <span style={{ fontFamily:"var(--sans)", fontSize:16, fontWeight:700, color:"#fff" }}>
                Surf<span style={{ color:"#38bdf8" }}>Morocco</span>
              </span>
            </div>
            <p style={{ fontFamily:"var(--sans)", fontSize:13, lineHeight:1.85, color:"rgba(255,255,255,.4)" }}>
              Connecter les wave riders aux expériences de surf les plus extraordinaires du Maroc depuis 2019.
            </p>
          </div>

          {/* Columns */}
          {[
            { title:"Destinations", links:["Taghazout","Safi","Imsouane","Essaouira"] },
            { title:"Services",     links:["Cours de surf","Planification","Photographie","Camps"] },
            { title:"Entreprise",   links:["À propos","Blog","Carrières","Contact"] },
          ].map(col => (
            <div key={col.title}>
              <h5 style={{ fontFamily:"var(--mono)", fontSize:10, fontWeight:500, letterSpacing:".18em", textTransform:"uppercase", color:"#38bdf8", marginBottom:20 }}>{col.title}</h5>
              {col.links.map(l => (
                <div key={l} style={{ marginBottom:12 }}>
                  <a href="#" style={{ fontFamily:"var(--sans)", color:"rgba(255,255,255,.42)", fontSize:13.5, textDecoration:"none", transition:"color .2s" }}
                    onMouseEnter={e => e.currentTarget.style.color="#fff"}
                    onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,.42)"}
                    onClick={e => e.preventDefault()}
                  >{l}</a>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* CTA Réservation dans le footer */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", paddingTop:32, marginBottom:32, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:20 }}>
          <div>
            <div style={{ fontFamily:"var(--serif)", fontSize:22, fontWeight:700, color:"#fff", marginBottom:6 }}>Prêt à surfer ?</div>
            <div style={{ fontFamily:"var(--sans)", fontSize:14, color:"rgba(255,255,255,.45)" }}>Réservez votre session en 5 minutes.</div>
          </div>
          {/* ── BOUTON RÉSERVER (footer) → navigue vers Reservation.jsx ── */}
          <button
            className="btn-primary"
            style={{ background:"#38bdf8", color:"var(--ink)", fontWeight:700 }}
            onClick={onReserver}
          >
            Réserver une session →
          </button>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <p style={{ fontFamily:"var(--mono)", fontSize:11.5, color:"rgba(255,255,255,.28)" }}>© 2026 SurfMorocco. Tous droits réservés.</p>
          <div style={{ display:"flex", gap:28 }}>
            {["Confidentialité","Conditions","Cookies"].map(l => (
              <a key={l} href="#" style={{ fontFamily:"var(--mono)", fontSize:11.5, color:"rgba(255,255,255,.28)", textDecoration:"none", transition:"color .2s" }}
                onMouseEnter={e => e.currentTarget.style.color="rgba(255,255,255,.7)"}
                onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,.28)"}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE HOME ────────────────────────────────────────────────────────────────
// Props : onReserver → callback vers App.js pour naviguer vers Reservation.jsx
export default function Home({ onReserver, onNavigate }) {
  const [loaded, setLoaded] = useState(false);
  const [activeSpot, setActiveSpot] = useState(0);

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);
  useEffect(() => { const t = setInterval(() => setActiveSpot(p => (p+1) % HOME_SPOTS.length), 6000); return () => clearInterval(t); }, []);

  return (
    <div style={{ fontFamily:"var(--serif)", background:"var(--sand)", color:"var(--ink)", overflowX:"hidden" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* NAVBAR — reçoit onReserver + onNavigate */}
      <Navbar onReserver={onReserver} onNavigate={onNavigate} />

      {/* ══════════ HERO ══════════ */}
      <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"url('https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1800&q=92')", backgroundSize:"cover", backgroundPosition:"center 35%", filter:"brightness(.55) saturate(1.1)", transform:"scale(1.03)" }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(108deg, rgba(250,250,248,.92) 34%, rgba(250,250,248,.55) 60%, rgba(250,250,248,.0) 85%)" }}/>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:200, background:"linear-gradient(to top, #fafaf8, transparent)" }}/>

        <div className="hero-content" style={{ position:"relative", zIndex:2, padding:"0 72px", paddingTop:80, maxWidth:800, opacity:loaded?1:0, transform:loaded?"none":"translateY(24px)", transition:"opacity .9s ease, transform .9s ease" }}>
          {/* Live badge */}
          <div style={{ marginBottom:28 }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:9, background:"rgba(255,255,255,.9)", border:"1px solid var(--line)", padding:"7px 18px 7px 12px", fontFamily:"var(--mono)", fontSize:11, color:"#047857", letterSpacing:".1em", textTransform:"uppercase" }}>
              <div className="live-dot"/>Live · Taghazout · 2.4m · Excellent
            </span>
          </div>

          {/* Titre */}
          <h1 className="hero-title" style={{ fontSize:80, fontWeight:700, lineHeight:.98, letterSpacing:"-.045em", marginBottom:28, color:"var(--ink)", animation:loaded?"fadeUp 1s .1s ease both":"none" }}>
            Ride the<br/>
            <span style={{ fontStyle:"italic", fontWeight:400, color:"var(--ocean)" }}>Atlantic</span><br/>
            <span style={{ color:"var(--ink)" }}>like never </span>
            <span style={{ fontStyle:"italic", fontWeight:400, color:"var(--muted)" }}>before</span>
          </h1>

          {/* Sous-titre */}
          <p style={{ fontFamily:"var(--sans)", fontSize:18, color:"var(--muted)", lineHeight:1.8, maxWidth:500, marginBottom:44, animation:loaded?"fadeUp 1s .25s ease both":"none" }}>
            De Taghazout à Safi, 2 400 km de côte atlantique marocaine abritent les plus belles vagues d'Afrique. On vous y amène.
          </p>

          {/* ── CTAs HERO ── */}
          <div style={{ display:"flex", gap:14, flexWrap:"wrap", animation:loaded?"fadeUp 1s .4s ease both":"none" }}>
            {/* ── BOUTON PRINCIPAL → Reservation.jsx ── */}
            <button
              className="btn-primary"
              onClick={onReserver}
            >
              Réserver une session
            </button>
            <button className="btn-secondary">
              Explorer les spots →
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats" style={{ display:"flex", gap:52, marginTop:60, paddingTop:40, borderTop:"1px solid var(--line)", flexWrap:"wrap", animation:loaded?"fadeUp 1s .55s ease both":"none" }}>
            {[["12+","Spots de surf"],["2 400 km","Côte atlantique"],["300+","Jours de vagues / an"]].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontFamily:"var(--serif)", fontSize:36, fontWeight:700, color:"var(--ocean)", lineHeight:1 }}>{n}</div>
                <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--faint)", marginTop:5, letterSpacing:".1em", textTransform:"uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget flottant */}
        <div className="float-widget" style={{ position:"absolute", right:64, top:"50%", transform:"translateY(-50%)", background:"rgba(255,255,255,.94)", backdropFilter:"blur(16px)", border:"1px solid var(--line)", padding:"22px 26px", minWidth:190, animation:"floatBob 7s ease-in-out infinite", boxShadow:"0 12px 40px rgba(15,25,35,.1)" }}>
          <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--faint)", letterSpacing:".16em", textTransform:"uppercase", marginBottom:10 }}>Conditions live</div>
          <div style={{ fontFamily:"var(--serif)", fontSize:40, fontWeight:700, color:"var(--ocean)", lineHeight:1 }}>2.4m</div>
          <div style={{ fontFamily:"var(--sans)", fontSize:13, color:"#047857", marginTop:4, fontWeight:500 }}>● Excellent</div>
          <div style={{ height:1, background:"var(--line)", margin:"14px 0" }}/>
          <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"var(--mono)", fontSize:11, color:"var(--muted)" }}>
            <span>Vent 15kn SO</span><span>12s</span>
          </div>
          {/* ── BOUTON DANS LE WIDGET → Reservation.jsx ── */}
          <button
            className="btn-primary"
            style={{ width:"100%", marginTop:14, padding:"10px", fontSize:10 }}
            onClick={onReserver}
          >
            Réserver →
          </button>
        </div>

        {/* Scroll hint */}
        <div style={{ position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:6, fontFamily:"var(--mono)", fontSize:10, color:"var(--muted)", letterSpacing:".12em", textTransform:"uppercase", opacity:loaded?1:0, transition:"opacity 1s 1s" }}>
          <span>Défiler</span>
          <div style={{ width:1, height:32, background:"var(--ocean)", opacity:.4, animation:"lineGrow 2s ease infinite" }}/>
        </div>
      </section>

      {/* ══════════ INTRO ÉDITORIALE ══════════ */}
      <section style={{ background:"var(--sand2)", padding:"80px 72px" }}>
        <div className="intro-grid" style={{ maxWidth:1300, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 2fr", gap:80, alignItems:"center" }}>
          <div style={{ fontFamily:"var(--serif)", fontSize:56, fontWeight:700, lineHeight:1, color:"var(--ink)" }}>Le Maroc,<br/>autrement.</div>
          <blockquote className="pull-quote">
            "Il n'existe pas d'expérience plus pure que de glisser sur une vague atlantique au lever du soleil, quand le Maroc s'éveille encore dans le silence."
          </blockquote>
        </div>
      </section>

      

      

      {/* ══════════ WHY US ══════════ */}
      <section style={{ padding:"100px 72px", background:"var(--sand2)" }}>
        <div style={{ maxWidth:1300, margin:"0 auto" }}>
          <div className="why-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:88, alignItems:"center" }}>
            <div>
              <div className="section-label">Pourquoi nous</div>
              <h2 style={{ fontFamily:"var(--serif)", fontSize:46, fontWeight:700, letterSpacing:"-.04em", lineHeight:1.05, marginBottom:20, color:"var(--ink)" }}>
                Plus qu'un guide.<br/><span style={{ fontStyle:"italic", fontWeight:400, color:"var(--ocean)" }}>Un art de vivre.</span>
              </h2>
              <p style={{ fontFamily:"var(--sans)", color:"var(--muted)", fontSize:16, lineHeight:1.9, marginBottom:44, maxWidth:440 }}>
                Nous connectons les surfers passionnés aux vagues les plus extraordinaires du Maroc. De la planification au coaching expert, nous sommes à vos côtés à chaque instant.
              </p>
              <div style={{ display:"flex", gap:44, marginBottom:44, flexWrap:"wrap", paddingBottom:44, borderBottom:"1px solid var(--line)" }}>
                {[["98%","Satisfaction"],["6+","Ans d'expérience"],["3 000+","Sessions"]].map(([n,l]) => (
                  <div key={l}>
                    <div style={{ fontFamily:"var(--serif)", fontSize:48, fontWeight:700, color:"var(--ocean)", lineHeight:1 }}>{n}</div>
                    <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--faint)", marginTop:5, letterSpacing:".1em", textTransform:"uppercase" }}>{l}</div>
                  </div>
                ))}
              </div>
              {/* ── BOUTON WHY US → Reservation.jsx ── */}
              <button className="btn-primary" onClick={onReserver}>
                Commencer l'aventure
              </button>
            </div>

            <div className="feat-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {FEATURES.map(f => (
                <div key={f.title} className="feat-card">
                  <div style={{ fontSize:28, marginBottom:16 }}>{f.icon}</div>
                  <h4 style={{ fontFamily:"var(--sans)", fontSize:15, fontWeight:600, marginBottom:8, color:"var(--ink)", letterSpacing:"-.02em" }}>{f.title}</h4>
                  <p style={{ fontFamily:"var(--sans)", fontSize:13, color:"var(--muted)", lineHeight:1.75 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ TÉMOIGNAGES ══════════ */}
      <section style={{ padding:"100px 72px", background:"var(--sand)" }}>
        <div style={{ maxWidth:1300, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div className="section-label" style={{ justifyContent:"center" }}>Témoignages</div>
            <h2 style={{ fontFamily:"var(--serif)", fontSize:42, fontWeight:700, letterSpacing:"-.04em", color:"var(--ink)" }}>
              Ce que les surfers <span style={{ fontStyle:"italic", fontWeight:400, color:"var(--ocean)" }}>disent</span>
            </h2>
          </div>
          <div className="testi-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }}>
            {TESTI.map(r => (
              <div key={r.name} className="testi-card">
                <div style={{ color:"#f59e0b", fontSize:14, marginBottom:18, letterSpacing:3 }}>{"★".repeat(r.stars)}</div>
                <p style={{ fontFamily:"var(--serif)", fontStyle:"italic", fontSize:15, color:"var(--ink2)", lineHeight:1.85, marginBottom:24, opacity:.88 }}>"{r.text}"</p>
                <div style={{ display:"flex", alignItems:"center", gap:12, paddingTop:18, borderTop:"1px solid var(--line)" }}>
                  <div style={{ width:38, height:38, background:"var(--sand2)", border:"1px solid var(--line)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--sans)", fontSize:15, fontWeight:700, color:"var(--ocean)" }}>{r.name[0]}</div>
                  <div>
                    <div style={{ fontFamily:"var(--sans)", fontSize:13.5, fontWeight:600, color:"var(--ink)" }}>{r.name}</div>
                    <div style={{ fontFamily:"var(--mono)", fontSize:10.5, color:"var(--faint)" }}>{r.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA BANNER ══════════ */}
      <section style={{ position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"url('https://images.unsplash.com/photo-1476673160081-cf065607f449?w=1800&q=90')", backgroundSize:"cover", backgroundPosition:"center", filter:"brightness(.45) saturate(1.1)" }}/>
        <div style={{ position:"absolute", inset:0, background:"rgba(15,25,35,.6)" }}/>
        <div style={{ position:"relative", zIndex:2, padding:"90px 72px", textAlign:"center" }}>
          <div className="section-label" style={{ justifyContent:"center", color:"#38bdf8" }}>Prêt à surfer ?</div>
          <h2 style={{ fontFamily:"var(--serif)", fontSize:52, fontWeight:700, letterSpacing:"-.04em", marginBottom:16, color:"#fff", lineHeight:1.1 }}>
            Votre prochaine vague<br/><span style={{ fontStyle:"italic", fontWeight:400, color:"#38bdf8" }}>vous attend.</span>
          </h2>
          <p style={{ fontFamily:"var(--sans)", color:"rgba(220,238,247,.75)", fontSize:17, maxWidth:440, margin:"0 auto 44px", lineHeight:1.85 }}>
            Rejoignez des milliers de surfers qui ont découvert la magie brute de l'Atlantique marocain.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            {/* ── BOUTON CTA BANNER → Reservation.jsx ── */}
            <button
              className="btn-primary"
              style={{ background:"#fff", color:"var(--ocean)", boxShadow:"0 4px 24px rgba(0,0,0,.35)" }}
              onClick={onReserver}
            >
              Réserver ma session
            </button>
            <button className="btn-secondary" style={{ borderColor:"rgba(255,255,255,.35)", color:"#fff" }}>
              Voir tous les spots
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER — reçoit onReserver */}
      <Footer onReserver={onReserver} />
    </div>
  );
}