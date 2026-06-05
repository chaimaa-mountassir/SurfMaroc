import { useState, useEffect } from "react";
import logo from "../assets/ChatGPT Image 28 mai 2026, 22_55_44.png";

const CSS = `
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

  .spot-hero {
    position: relative; overflow: hidden; cursor: pointer;
    transition: transform .5s cubic-bezier(.4,0,.2,1);
  }
  .spot-hero img {
    width: 100%; height: 100%; object-fit: cover;
    filter: saturate(1.05) brightness(.88);
    transition: transform .8s cubic-bezier(.4,0,.2,1), filter .4s;
  }
  .spot-hero:hover img { transform: scale(1.05); filter: saturate(1.15) brightness(.92); }
  .spot-hero .overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(15,25,35,.82) 35%, rgba(15,25,35,.1) 100%);
  }
  .spot-hero .content { position: absolute; bottom: 0; left: 0; right: 0; padding: 28px; }

  .detail-chip {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2);
    padding: 5px 12px; font-family: var(--mono); font-size: 10px;
    color: rgba(255,255,255,.8); letter-spacing: .08em;
    backdrop-filter: blur(4px);
  }

  .info-row {
    display: flex; gap: 0; border: 1px solid var(--line); overflow: hidden;
  }
  .info-cell {
    flex: 1; padding: 18px 16px; border-right: 1px solid var(--line);
    text-align: center; background: var(--white);
  }
  .info-cell:last-child { border-right: none; }

  .wave-bar-wrap { display: flex; align-items: flex-end; gap: 3px; height: 40px; }
  .wave-bar { flex: 1; border-radius: 2px 2px 0 0; transition: opacity .2s; opacity: .7; }
  .wave-bar:hover { opacity: 1; }

  .spot-tab-btn {
    font-family: var(--mono); font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
    padding: 10px 20px; border: none; background: transparent; cursor: pointer;
    color: var(--muted); border-bottom: 2px solid transparent; transition: all .2s;
  }
  .spot-tab-btn.active { color: var(--ocean); border-bottom-color: var(--ocean); }
  .spot-tab-btn:hover { color: var(--ink); }

  @media (max-width: 1024px) {
    .nav-links { display: none !important; }
    .spots-grid { grid-template-columns: 1fr !important; }
    .spot-detail-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
  }
  @media (max-width: 768px) {
    .spots-masonry { grid-template-columns: 1fr !important; }
  }
`;

const SPOTS = [
  {
    name: "Taghazout", country: "Maroc · Souss-Massa", tag: "World Class",
    level: "Intermédiaire", wave: "2 – 4m", season: "Oct – Avr",
    temp: "18–22°C", wind: "Offshore matin",
    desc: "Le joyau incontesté du surf marocain. Des point breaks cristallins, une lumière dorée et un village entièrement voué à la culture surf.",
    longDesc: "Taghazout est sans doute le spot le plus célèbre d'Afrique. Ce petit village de pêcheurs au nord d'Agadir s'est transformé en mecque du surf grâce à ses point breaks réguliers et sa houle atlantique constante. Anchor Point, Hash Point et Killers sont les trois breaks principaux, chacun avec son propre caractère.",
    img: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&q=92",
    accent: "#0369a1", light: "#e0f2fe",
    breaks: ["Anchor Point", "Hash Point", "Killers", "La Source"],
    monthData: [80,85,70,45,30,25,30,35,50,72,82,85],
    bestMonths: "Nov → Mar",
    travelTips: ["Vol direct Agadir depuis Paris (3h30)", "Nombreux riads de surf en bord de plage", "Eau douce à 20°C en hiver"],
    levelTag: "Intermédiaire",
  },
  {
    name: "Safi", country: "Maroc · Marrakech-Safi", tag: "Compétition",
    level: "Expert", wave: "4 – 8m", season: "Nov – Mar",
    temp: "16–20°C", wind: "Variable",
    desc: "L'une des vagues les plus redoutées d'Afrique. Un gauche de légende qui accueille les élites mondiales depuis des décennies.",
    longDesc: "La Cathédrale de Safi est une vague de classe mondiale. Ce gauche puissant qui casse sur un fond rocheux génère des tubes impressionnants par swell de nord-ouest. Accueillant régulièrement des compétitions WQS, Safi est réservé aux surfeurs expérimentés capables de gérer des vagues de 4 à 8 mètres.",
    img: "https://images.unsplash.com/photo-1455264745730-cb3b76250c77?w=1200&q=92",
    accent: "#b45309", light: "#fef3c7",
    breaks: ["La Cathédrale", "Boilers", "Point Central", "La Droite"],
    monthData: [88,85,60,30,20,18,22,25,40,65,90,92],
    bestMonths: "Déc → Fév",
    travelTips: ["Train Casablanca – Safi (3h)", "Hôtels dans la médina", "Leash 8mm obligatoire"],
    levelTag: "Expert",
  },
  {
    name: "Imsouane", country: "Maroc · Agadir-Ida-Ou-Tanane", tag: "Tous niveaux",
    level: "Débutant → Pro", wave: "1 – 2m", season: "Toute l'année",
    temp: "19–23°C", wind: "Légère brise",
    desc: "La plus longue vague surfable d'Afrique. Cette baie enchanteresse accueille débutants et longboarders dans une atmosphère paisible.",
    longDesc: "Imsouane abrite la plus longue vague d'Afrique, surfable sur plus de 800 mètres dans la Cathedral Bay. Ce droit lent et régulier est le paradis des longboarders et des débutants. La baie protégée offre des conditions idéales toute l'année, avec une eau chaude et des vagues régulières.",
    img: "https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?w=1200&q=92",
    accent: "#047857", light: "#d1fae5",
    breaks: ["Cathedral Bay", "La Baie", "Le Cap", "Outside"],
    monthData: [65,65,70,72,75,70,68,68,72,74,70,65],
    bestMonths: "Toute l'année",
    travelTips: ["1h30 d'Agadir en taxi", "Village tranquille, peu de tourisme de masse", "Idéal pour séjours longue durée"],
    levelTag: "Débutant",
  },
  {
    name: "Essaouira", country: "Maroc · Marrakech-Safi", tag: "Wind & Waves",
    level: "Intermédiaire", wave: "2 – 3m", season: "Mai – Sep",
    temp: "20–24°C", wind: "Vent fort (kite)",
    desc: "Capitale africaine du vent. Cette médina millénaire offre des sessions kitesurf et surf dans un décor de carte postale inoubliable.",
    longDesc: "Essaouira, surnommée « la ville du vent », est une destination unique au Maroc. Le vent Alizé souffle fort et régulièrement de mai à septembre, créant des conditions parfaites pour le kitesurf et le windsurf. Les surfeurs traditionnels y trouvent aussi leur compte en début et fin de saison, avec des vagues propres avant l'arrivée du vent.",
    img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=92",
    accent: "#7c3aed", light: "#ede9fe",
    breaks: ["Plage Moulay Bouzerktoun", "Diabat", "Sidi Kaouki", "Downtown Beach"],
    monthData: [40,42,48,55,75,85,90,88,70,55,45,40],
    bestMonths: "Jun → Aoû",
    travelTips: ["Bus CTM depuis Marrakech (3h)", "Médina classée UNESCO", "Combinaison légère 3/2 suffisante"],
    levelTag: "Intermédiaire",
  },
];

const FILTERS = ["Tous", "Débutant", "Intermédiaire", "Expert"];
const MONTHS = ["J","F","M","A","M","J","J","A","S","O","N","D"];

const NAV_PAGES = [
  { label: "Spots",    page: "spots"   },
  { label: "Guide",    page: "guide"   },
  { label: "Galerie",  page: "galerie" },
  { label: "À propos", page: "apropos" },
  { label: "Contact",  page: "contact" },
];

export default function Spots({ onBack, onReserver, currentPage }) {
  const [scrolled, setScrolled]   = useState(false);
  const [filter, setFilter]       = useState("Tous");
  const [selected, setSelected]   = useState(null);  // spot en détail
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 64);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const filtered = filter === "Tous"
    ? SPOTS
    : SPOTS.filter(s => s.levelTag === filter);

  const openSpot = (spot) => {
    setSelected(spot);
    setActiveTab("info");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--sand)" }}>
      <style>{CSS}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 300, height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px",
        background: scrolled || selected ? "rgba(250,250,248,.97)" : "rgba(250,250,248,.97)",
        backdropFilter: "blur(16px) saturate(180%)",
        borderBottom: "1px solid var(--line)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }} onClick={() => onBack("home")}>
          <div style={{ width: 42, height: 42, borderRadius: 10, overflow: "hidden", border: "1px solid var(--line)", background: "#e0f2fe", flexShrink: 0 }}>
            <img src={logo} alt="SurfMorocco" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 17, fontWeight: 700, letterSpacing: "-.025em", lineHeight: 1.1, color: "var(--ink)" }}>
              Surf<span style={{ color: "var(--ocean)" }}>Morocco</span>
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--faint)", letterSpacing: ".16em", textTransform: "uppercase" }}>Est. 2019</div>
          </div>
        </div>

        <div className="nav-links" style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {NAV_PAGES.map(({ label, page }) => (
            <a key={page} href="#" className={`nav-link${currentPage === page ? " active" : ""}`}
              onClick={e => { e.preventDefault(); onBack(page); }}>{label}</a>
          ))}
        </div>

        <button className="btn-primary" style={{ padding: "10px 24px", fontSize: 11 }} onClick={onReserver}>
          Réserver une session
        </button>
      </nav>

      {/* ══════════ VUE DÉTAIL SPOT ══════════ */}
      {selected ? (
        <div style={{ paddingTop: 68 }}>
          {/* Hero image */}
          <div style={{ position: "relative", height: "55vh", overflow: "hidden" }}>
            <img src={selected.img} alt={selected.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.75) saturate(1.1)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,25,35,.85) 30%, rgba(15,25,35,.1))" }} />

            {/* Bouton retour */}
            <button onClick={() => setSelected(null)} style={{
              position: "absolute", top: 28, left: 48, display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.25)",
              color: "#fff", padding: "9px 18px", cursor: "pointer", backdropFilter: "blur(8px)",
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase",
              transition: "background .2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.1)"}
            >← Tous les spots</button>

            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 72px 36px" }}>
              <span style={{ background: "rgba(255,255,255,.92)", color: selected.accent, padding: "4px 12px", fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 500 }}>
                {selected.tag}
              </span>
              <h1 style={{ fontFamily: "var(--serif)", fontSize: 64, fontWeight: 700, letterSpacing: "-.04em", color: "#fff", lineHeight: .95, marginTop: 12, marginBottom: 10 }}>{selected.name}</h1>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,.55)", letterSpacing: ".08em", marginBottom: 20 }}>{selected.country}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[`🌊 ${selected.wave}`, `📅 ${selected.season}`, `🌡️ ${selected.temp}`, `💨 ${selected.wind}`].map(c => (
                  <span key={c} className="detail-chip">{c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: "1px solid var(--line)", background: "var(--white)", padding: "0 72px", display: "flex", gap: 0 }}>
            {["info", "conditions", "voyager"].map(tab => (
              <button key={tab} className={`spot-tab-btn${activeTab === tab ? " active" : ""}`}
                onClick={() => setActiveTab(tab)}>
                {{ info: "Présentation", conditions: "Conditions", voyager: "Pratique" }[tab]}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ maxWidth: 1300, margin: "0 auto", padding: "60px 72px" }}>
            {activeTab === "info" && (
              <div className="spot-detail-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 64, alignItems: "start" }}>
                <div>
                  <div className="section-label">À propos</div>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 17, color: "var(--ink2)", lineHeight: 2, marginBottom: 40 }}>{selected.longDesc}</p>
                  <div className="section-label">Breaks</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {selected.breaks.map(b => (
                      <div key={b} style={{ padding: "16px 18px", border: "1px solid var(--line)", background: "var(--white)", display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: selected.accent, flexShrink: 0 }} />
                        <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink2)", fontWeight: 500 }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ padding: "32px 28px", background: "var(--white)", border: "1px solid var(--line)", marginBottom: 16 }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ocean)", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 20 }}>Infos clés</div>
                    {[
                      ["Niveau requis", selected.level],
                      ["Hauteur vagues", selected.wave],
                      ["Meilleure saison", selected.bestMonths],
                      ["Température eau", selected.temp],
                      ["Vent", selected.wind],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                        <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--muted)" }}>{k}</span>
                        <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink)", fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <button className="btn-primary" style={{ width: "100%" }} onClick={onReserver}>
                    Réserver à {selected.name} →
                  </button>
                </div>
              </div>
            )}

            {activeTab === "conditions" && (
              <div>
                <div className="section-label">Saisonnalité des vagues</div>
                <div style={{ background: "var(--white)", border: "1px solid var(--line)", padding: "36px 32px", marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, marginBottom: 12 }}>
                    {selected.monthData.map((h, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <div style={{ width: "100%", height: h * 1.1, background: selected.accent, borderRadius: "3px 3px 0 0", opacity: .8, transition: "opacity .2s", cursor: "default" }}
                          onMouseEnter={e => e.currentTarget.style.opacity = 1}
                          onMouseLeave={e => e.currentTarget.style.opacity = .8}
                        />
                        <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--faint)" }}>{MONTHS[i]}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: "1px solid var(--line)", paddingTop: 20, marginTop: 8 }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ocean)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 6 }}>Meilleure période</div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>{selected.bestMonths}</div>
                  </div>
                </div>
                <div className="info-row">
                  {[["🌡️", "Eau", selected.temp], ["💨", "Vent", selected.wind], ["🌊", "Vagues", selected.wave], ["📅", "Saison", selected.season]].map(([icon, label, val]) => (
                    <div key={label} className="info-cell">
                      <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--faint)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "voyager" && (
              <div className="spot-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
                <div>
                  <div className="section-label">Conseils pratiques</div>
                  {selected.travelTips.map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: 16, padding: "20px 0", borderBottom: "1px solid var(--line)" }}>
                      <div style={{ width: 32, height: 32, background: selected.light, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: 12, color: selected.accent, fontWeight: 700, flexShrink: 0 }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: "var(--ink2)", lineHeight: 1.75 }}>{tip}</p>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "32px 28px", background: "var(--ink)", color: "#fff" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#38bdf8", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 16 }}>Réserver ce spot</div>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>
                    Prêt à surfer<br /><span style={{ fontStyle: "italic", color: "#38bdf8" }}>{selected.name} ?</span>
                  </h3>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "rgba(255,255,255,.55)", lineHeight: 1.8, marginBottom: 28 }}>
                    Coach certifié ISA, matériel inclus, photos de session disponibles.
                  </p>
                  <button className="btn-primary" style={{ background: "#38bdf8", color: "var(--ink)", width: "100%", fontWeight: 700 }} onClick={onReserver}>
                    Réserver →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      ) : (

        /* ══════════ VUE LISTE SPOTS ══════════ */
        <>
          {/* Hero */}
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
                Destinations
              </div>
              <h1 style={{ fontFamily: "var(--serif)", fontSize: 72, fontWeight: 700, letterSpacing: "-.04em", lineHeight: .95, color: "#fff", marginBottom: 24 }}>
                Quatre spots,<br />
                <span style={{ fontStyle: "italic", fontWeight: 400, color: "#38bdf8" }}>une seule côte.</span>
              </h1>
              <p style={{ fontFamily: "var(--sans)", color: "rgba(220,238,247,.72)", fontSize: 18, maxWidth: 500, lineHeight: 1.85 }}>
                2 400 km de côte atlantique, quatre destinations d'exception. Chaque spot a sa propre âme, son propre rythme.
              </p>
            </div>
          </section>

          {/* Filtres */}
          <section style={{ background: "var(--white)", borderBottom: "1px solid var(--line)", padding: "0 72px" }}>
            <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "center", gap: 0, height: 56 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--faint)", letterSpacing: ".14em", textTransform: "uppercase", marginRight: 20 }}>Filtrer par niveau :</span>
              {FILTERS.map(f => (
                <button key={f} className={`filter-btn${filter === f ? " active" : ""}`}
                  onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
          </section>

          {/* Grille spots */}
          <section style={{ padding: "72px 72px 100px" }}>
            <div style={{ maxWidth: 1300, margin: "0 auto" }}>
              <div className="spots-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 3 }}>
                {filtered.map((spot, i) => (
                  <div key={spot.name} onClick={() => openSpot(spot)}
                    className="spot-hero"
                    style={{ height: i === 0 ? 540 : 380 }}>
                    <img src={spot.img} alt={spot.name} />
                    <div className="overlay" />
                    <div className="content">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                          <span style={{ background: "rgba(255,255,255,.9)", color: spot.accent, padding: "3px 10px", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 500, display: "inline-block", marginBottom: 10 }}>
                            {spot.tag}
                          </span>
                          <h2 style={{ fontFamily: "var(--serif)", fontSize: i === 0 ? 48 : 36, fontWeight: 700, letterSpacing: "-.03em", color: "#fff", lineHeight: .95, marginBottom: 6 }}>{spot.name}</h2>
                          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,.5)", letterSpacing: ".07em" }}>{spot.country}</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                          <span className="detail-chip">🌊 {spot.wave}</span>
                          <span className="detail-chip">⚡ {spot.level}</span>
                        </div>
                      </div>
                      <div style={{ marginTop: 14, fontFamily: "var(--sans)", fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.7, maxWidth: 480 }}>{spot.desc}</div>
                      <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,.6)", letterSpacing: ".1em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,.3)", paddingBottom: 2 }}>
                        Voir le spot →
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section style={{ background: "var(--sand2)", padding: "80px 72px", borderTop: "1px solid var(--line)" }}>
            <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 40 }}>
              <div>
                <div className="section-label">Prêt à rider ?</div>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: 40, fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)" }}>
                  Choisissez votre spot,<br /><span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--ocean)" }}>on s'occupe du reste.</span>
                </h2>
              </div>
              <button className="btn-primary" onClick={onReserver}>Réserver une session →</button>
            </div>
          </section>

          {/* Footer */}
          <footer style={{ background: "var(--ink)", padding: "48px 72px 32px" }}>
            <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }} onClick={() => onBack("home")}>
                <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,.15)", flexShrink: 0 }}>
                  <img src={logo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <span style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: "#fff" }}>
                  Surf<span style={{ color: "#38bdf8" }}>Morocco</span>
                </span>
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,.28)" }}>© 2026 SurfMorocco. Tous droits réservés.</div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}