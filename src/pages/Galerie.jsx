import { useState, useEffect, useRef } from "react";
import logo from "../assets/ChatGPT Image 28 mai 2026, 22_55_44.png";

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  :root {
    --ink: #0f1923; --ink2: #2c3e50; --muted: #64748b; --faint: #94a3b8;
    --line: rgba(15,25,35,.1);
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
  @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes ripple { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.2);opacity:0} }

  .nav-link {
    font-family: var(--sans); font-size: 12px; font-weight: 500;
    letter-spacing: .1em; text-transform: uppercase; color: var(--muted);
    text-decoration: none; position: relative; padding-bottom: 4px; transition: color .2s;
  }
  .nav-link::after { content:''; position:absolute; left:0; bottom:0; height:1px; width:0; background:var(--ocean); transition:width .3s; }
  .nav-link:hover { color:var(--ink); }
  .nav-link:hover::after, .nav-link.active::after { width:100%; }
  .nav-link.active { color:var(--ink); }

  .btn-primary {
    font-family:var(--sans); font-size:12px; font-weight:600;
    letter-spacing:.12em; text-transform:uppercase; background:var(--ink); color:#fff;
    border:none; padding:14px 32px; cursor:pointer;
    transition:background .2s,transform .15s,box-shadow .2s;
    box-shadow:0 2px 12px rgba(15,25,35,.18);
  }
  .btn-primary:hover { background:var(--ocean); transform:translateY(-1px); box-shadow:0 6px 24px rgba(3,105,161,.3); }

  .section-label {
    font-family:var(--mono); font-size:10px; font-weight:500;
    letter-spacing:.2em; text-transform:uppercase; color:var(--ocean);
    margin-bottom:16px; display:flex; align-items:center; gap:10px;
  }
  .section-label::before { content:''; display:inline-block; width:28px; height:1px; background:var(--ocean); }

  .filter-btn {
    font-family: var(--mono); font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
    padding: 9px 18px; border: 1.5px solid var(--sand3); background: transparent;
    color: var(--muted); cursor: pointer; transition: all .2s;
  }
  .filter-btn:hover { border-color: var(--ocean); color: var(--ocean); }
  .filter-btn.active { background: var(--ink); border-color: var(--ink); color: #fff; }

  /* ── Photo card (style spot-hero) ── */
  .photo-card {
    position: relative; overflow: hidden; cursor: pointer;
    transition: transform .5s cubic-bezier(.4,0,.2,1);
  }
  .photo-card img {
    width: 100%; height: 100%; object-fit: cover;
    filter: saturate(1.05) brightness(.88);
    transition: transform .8s cubic-bezier(.4,0,.2,1), filter .4s;
    display: block;
  }
  .photo-card:hover img { transform: scale(1.05); filter: saturate(1.15) brightness(.92); }
  .photo-card .overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(15,25,35,.82) 35%, rgba(15,25,35,.1) 100%);
  }
  .photo-card .content { position: absolute; bottom: 0; left: 0; right: 0; padding: 24px; }

  .detail-chip {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2);
    padding: 5px 12px; font-family: var(--mono); font-size: 10px;
    color: rgba(255,255,255,.8); letter-spacing: .08em;
    backdrop-filter: blur(4px);
  }

  /* ── Lightbox ── */
  .lb { position:fixed; inset:0; background:rgba(4,8,14,.97); z-index:900; display:flex; align-items:center; justify-content:center; animation:fadeIn .2s; }
  .lb img { max-width:88vw; max-height:87vh; object-fit:contain; }
  .lb-x { position:fixed; top:18px; right:22px; width:42px; height:42px; border-radius:50%; border:1px solid rgba(255,255,255,.2); background:rgba(255,255,255,.08); color:#fff; font-size:17px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .2s; }
  .lb-x:hover { background:rgba(255,255,255,.2); }
  .lb-arr { position:fixed; top:50%; transform:translateY(-50%); width:52px; height:52px; border:1px solid rgba(255,255,255,.15); background:rgba(255,255,255,.07); color:#fff; font-size:24px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .2s; }
  .lb-arr:hover { background:rgba(255,255,255,.18); }
  .lb-prev { left:16px; }
  .lb-next { right:16px; }
  .lb-cap { position:fixed; bottom:22px; left:50%; transform:translateX(-50%); font-family:var(--mono); font-size:11px; color:rgba(255,255,255,.4); letter-spacing:.12em; text-transform:uppercase; white-space:nowrap; }

  @media (max-width: 1024px) {
    .nav-links { display: none !important; }
    .gal-grid { grid-template-columns: 1fr 1fr !important; }
    .footer-cols { flex-direction: column !important; gap: 44px !important; }
  }
  @media (max-width: 640px) {
    .gal-grid { grid-template-columns: 1fr !important; }
  }
`;

const NAV_PAGES = [
  { label: "Spots",    page: "spots"   },
  { label: "Guide",    page: "guide"   },
  { label: "Galerie",  page: "galerie" },
  { label: "À propos", page: "apropos" },
  { label: "Contact",  page: "contact" },
];

const PHOTOS = [
  { src:"https://images.unsplash.com/photo-1455264745730-cb3b76250c77?w=1200&q=90", label:"Safi", sublabel:"Break de compétition", cat:"Vagues",   size:"large" },
  { src:"https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=900&q=88",  label:"Taghazout", sublabel:"Point break", cat:"Vagues",   size:"medium" },
  { src:"https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=900&q=88",  label:"Taghazout", sublabel:"Lever de soleil", cat:"Paysage", size:"medium" },
  { src:"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&q=88",  label:"Essaouira", sublabel:"Crépuscule", cat:"Paysage",  size:"medium" },
  { src:"https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?w=900&q=88",  label:"Imsouane",  sublabel:"Baie enchanteresse", cat:"Paysage",  size:"large"  },
  { src:"https://images.unsplash.com/photo-1476673160081-cf065607f449?w=900&q=88",  label:"Atlantique",sublabel:"Houle atlantique", cat:"Vagues",   size:"medium" },
  { src:"https://images.unsplash.com/photo-1531722569936-825d4ebd5e57?w=900&q=88",  label:"Session",   sublabel:"Session matinale", cat:"Action",   size:"medium" },
  { src:"https://images.unsplash.com/photo-1544551763-92ab472cad5d?w=900&q=88",     label:"Action",    sublabel:"Vague parfaite", cat:"Action",   size:"medium" },
  { src:"https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=900&q=88",  label:"Imsouane",  sublabel:"Coucher de soleil", cat:"Paysage",  size:"medium" },
  { src:"https://images.unsplash.com/photo-1520962880247-cfaf541c8724?w=900&q=88",  label:"Safi",      sublabel:"Vague lourde", cat:"Vagues",   size:"medium" },
 
];

const CATS = ["Tous", "Vagues", "Action", "Paysage"];

// ── NAVBAR ────────────────────────────────────────────────────────────────────
function Navbar({ onReserver, onNavigate, currentPage }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 64);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:300, height:68,
      display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 48px",
      background: scrolled ? "rgba(250,250,248,.96)" : "rgba(250,250,248,.96)",
      backdropFilter:"blur(16px) saturate(180%)",
      borderBottom:"1px solid var(--line)",
    }}>
      <div style={{display:"flex",alignItems:"center",gap:11,cursor:"pointer"}} onClick={()=>onNavigate&&onNavigate("home")}>
        <div style={{width:42,height:42,borderRadius:10,overflow:"hidden",border:"1px solid var(--line)",background:"#e0f2fe",flexShrink:0}}>
          <img src={logo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        </div>
        <div>
          <div style={{fontFamily:"var(--sans)",fontSize:17,fontWeight:700,letterSpacing:"-.025em",lineHeight:1.1,color:"var(--ink)"}}>
            Surf<span style={{color:"var(--ocean)"}}>Morocco</span>
          </div>
          <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--faint)",letterSpacing:".16em",textTransform:"uppercase"}}>Est. 2019</div>
        </div>
      </div>

      <div className="nav-links" style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {NAV_PAGES.map(({ label, page, anchor }) => (
            <a key={label} href="#" className={`nav-link${currentPage === page ? " active" : ""}`}
              onClick={e => { e.preventDefault(); onNavigate && onNavigate(page, anchor); }}>
              {label}
            </a>
          ))}
        </div>

      <button className="btn-primary" style={{padding:"10px 24px",fontSize:11}} onClick={onReserver}>
        Réserver une session
      </button>
    </nav>
  );
}

// ── LIGHTBOX ──────────────────────────────────────────────────────────────────
function Lightbox({ photos, idx, close, prev, next }) {
  useEffect(() => {
    const fn = e => {
      if (e.key==="Escape") close();
      if (e.key==="ArrowLeft") prev();
      if (e.key==="ArrowRight") next();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [close, prev, next]);
  if (idx === null || idx === undefined) return null;
  const p = photos[idx];
  return (
    <div className="lb" onClick={close}>
      <button className="lb-arr lb-prev" onClick={e=>{e.stopPropagation();prev();}}>‹</button>
      <img src={p.src} alt={p.label} onClick={e=>e.stopPropagation()}/>
      <button className="lb-arr lb-next" onClick={e=>{e.stopPropagation();next();}}>›</button>
      <button className="lb-x" onClick={close}>✕</button>
      <div className="lb-cap">{p.label} · {p.sublabel} · {idx+1} / {photos.length}</div>
    </div>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer({ onReserver, onNavigate }) {
  const cols = [
    {title:"Destinations",links:[{l:"Taghazout",p:"spots"},{l:"Safi",p:"spots"},{l:"Imsouane",p:"spots"},{l:"Essaouira",p:"spots"}]},
    {title:"Services",    links:[{l:"Cours de surf",p:"guide"},{l:"Planification",p:"guide"},{l:"Photographie",p:"galerie"},{l:"Camps",p:"guide"}]},
    {title:"Entreprise",  links:[{l:"À propos",p:"apropos"},{l:"Blog",p:"apropos"},{l:"Carrières",p:"contact"},{l:"Contact",p:"contact"}]},
  ];
  return (
    <footer style={{background:"var(--ink)",color:"rgba(255,255,255,.55)",padding:"60px 72px 36px"}}>
      <div style={{maxWidth:1300,margin:"0 auto"}}>
        <div className="footer-cols" style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:44,marginBottom:56}}>
          <div style={{maxWidth:260}}>
            <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:16,cursor:"pointer"}} onClick={()=>onNavigate&&onNavigate("home")}>
              <div style={{width:36,height:36,borderRadius:8,overflow:"hidden",border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.08)",flexShrink:0}}>
                <img src={logo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
              <span style={{fontFamily:"var(--sans)",fontSize:16,fontWeight:700,color:"#fff"}}>Surf<span style={{color:"#38bdf8"}}>Morocco</span></span>
            </div>
            <p style={{fontFamily:"var(--sans)",fontSize:13,lineHeight:1.85,color:"rgba(255,255,255,.4)"}}>Connecter les wave riders aux expériences de surf les plus extraordinaires du Maroc depuis 2019.</p>
          </div>
          {cols.map(col=>(
            <div key={col.title}>
              <h5 style={{fontFamily:"var(--mono)",fontSize:10,fontWeight:500,letterSpacing:".18em",textTransform:"uppercase",color:"#38bdf8",marginBottom:20}}>{col.title}</h5>
              {col.links.map(({l,p})=>(
                <div key={l} style={{marginBottom:12}}>
                  <a href={`#${p}`} style={{fontFamily:"var(--sans)",color:"rgba(255,255,255,.42)",fontSize:13.5,textDecoration:"none",transition:"color .2s"}}
                    onMouseEnter={e=>e.currentTarget.style.color="#fff"}
                    onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.42)"}
                    onClick={e=>{e.preventDefault();onNavigate&&onNavigate(p);}}
                  >{l}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.08)",paddingTop:32,marginBottom:32,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
          <div>
            <div style={{fontFamily:"var(--serif)",fontSize:22,fontWeight:700,color:"#fff",marginBottom:6}}>Prêt à surfer ?</div>
            <div style={{fontFamily:"var(--sans)",fontSize:14,color:"rgba(255,255,255,.45)"}}>Réservez votre session en 5 minutes.</div>
          </div>
          <button className="btn-primary" style={{background:"#38bdf8",color:"var(--ink)",fontWeight:700}} onClick={onReserver}>Réserver une session →</button>
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.08)",paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <p style={{fontFamily:"var(--mono)",fontSize:11.5,color:"rgba(255,255,255,.28)"}}>© 2026 SurfMorocco. Tous droits réservés.</p>
          <div style={{display:"flex",gap:28}}>
            {["Confidentialité","Conditions","Cookies"].map(l=>(
              <a key={l} href="#" style={{fontFamily:"var(--mono)",fontSize:11.5,color:"rgba(255,255,255,.28)",textDecoration:"none",transition:"color .2s"}}
                onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,.7)"}
                onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.28)"}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── PAGE GALERIE ──────────────────────────────────────────────────────────────
export default function Galerie({ onReserver, onNavigate }) {
  const [loaded, setLoaded] = useState(false);
  const [cat,    setCat]    = useState("Tous");
  const [lbIdx,  setLbIdx]  = useState(null);

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);

  const filtered = cat === "Tous" ? PHOTOS : PHOTOS.filter(p => p.cat === cat);

  const close = () => setLbIdx(null);
  const prev  = () => setLbIdx(i => (i - 1 + filtered.length) % filtered.length);
  const next  = () => setLbIdx(i => (i + 1) % filtered.length);

  return (
    <div style={{fontFamily:"var(--serif)",background:"var(--sand)",color:"var(--ink)",overflowX:"hidden"}}>
      <style>{GLOBAL_STYLES}</style>
      <Navbar onReserver={onReserver} onNavigate={onNavigate}/>

      {/* ══ PAGE HEADER ══ */}
<section style={{ paddingTop: 68, position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "url('https://images.unsplash.com/photo-1476673160081-cf065607f449?w=1800&q=90')",
              backgroundSize: "cover", backgroundPosition: "center 35%",
              filter: "brightness(.35) saturate(1.15)",
            }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,25,35,.2), rgba(15,25,35,.65))" }} />
            <div style={{ position: "relative", zIndex: 2, padding: "90px 72px 80px", maxWidth: 1300, margin: "0 auto", animation: "fadeUp .8s ease both" }}>
              <div className="section-label" style={{ color: "#38bdf8" }}>
                <span style={{ display: "inline-block", width: 28, height: 1, background: "#38bdf8" }} />
                Photographie
              </div>
              <h1 style={{ fontFamily: "var(--serif)", fontSize: 72, fontWeight: 700, letterSpacing: "-.04em", lineHeight: .95, color: "#fff", marginBottom: 24 }}>
                La galerie <br />
                <span style={{ fontStyle: "italic", fontWeight: 400, color: "#38bdf8" }}>atlantique</span>
              </h1>
              <p style={{ fontFamily: "var(--sans)", color: "rgba(220,238,247,.72)", fontSize: 18, maxWidth: 500, lineHeight: 1.85 }}>
                Des moments capturés sur les spots les plus beaux du Maroc 
                entre lumière, sel et vitesse.
              </p>
            </div>
          </section>

{/* ═════════ FILTRES ═════════ */}
<section
  style={{
    background: "#fff",
    borderBottom: "1px solid var(--line)",
    padding: "20px 72px",
  }}
>
  <div
    style={{
      maxWidth: "1300px",
      margin: "0 auto",
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
    }}
  >
    {CATS.map((c) => (
      <button
        key={c}
        className={`filter-btn${cat === c ? " active" : ""}`}
        onClick={() => setCat(c)}
      >
        {c}
      </button>
    ))}
  </div>
</section>

      {/* ══ GRILLE MASONRY STYLE ══ */}
      <section style={{padding:"56px 72px 96px"}}>
        <div style={{maxWidth:1300,margin:"0 auto"}}>

          {filtered.length === 0 && (
            <div style={{textAlign:"center",padding:"80px 0",fontFamily:"var(--sans)",color:"var(--faint)",fontSize:15}}>
              Aucune photo dans cette catégorie.
            </div>
          )}

          {/* Grille 3 colonnes avec hauteurs variées */}
          <div className="gal-grid" style={{
            display:"grid",
            gridTemplateColumns:"repeat(3,1fr)",
            gap:6,
            gridAutoRows:"auto",
          }}>
            {filtered.map((photo, i) => {
              // Alterne les hauteurs pour effet masonry
              const tall = photo.size === "large" || i % 5 === 0;
              return (
                <div key={i}
                  className="photo-card"
                  style={{height: tall ? 440 : 300}}
                  onClick={() => setLbIdx(i)}
                >
                  <img src={photo.src} alt={photo.label}/>
                  <div className="overlay"/>
                  <div className="content">
                    {/* Chip catégorie */}
                    <div style={{marginBottom:10}}>
                      <span className="detail-chip">{photo.cat}</span>
                    </div>
                    {/* Lieu */}
                    <div style={{fontFamily:"var(--serif)",fontSize:22,fontWeight:700,color:"#fff",letterSpacing:"-.02em",lineHeight:1.1,marginBottom:4}}>
                      {photo.label}
                    </div>
                    {/* Description */}
                    <div style={{fontFamily:"var(--mono)",fontSize:10,color:"rgba(255,255,255,.6)",letterSpacing:".08em",textTransform:"uppercase"}}>
                      {photo.sublabel}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA bas */}
          <div style={{marginTop:72,paddingTop:48,borderTop:"1px solid var(--line)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:24}}>
            <div>
              <div className="section-label">Votre session</div>
              <p style={{fontFamily:"var(--serif)",fontSize:30,fontWeight:700,letterSpacing:"-.03em",color:"var(--ink)",lineHeight:1.1}}>
                Immortalisez<br/>votre vague.
              </p>
            </div>
            <button className="btn-primary" onClick={onReserver}>Réserver avec photo & vidéo →</button>
          </div>
        </div>
      </section>

      <Lightbox photos={filtered} idx={lbIdx} close={close} prev={prev} next={next}/>
      <Footer onReserver={onReserver} onNavigate={onNavigate}/>
    </div>
  );
}