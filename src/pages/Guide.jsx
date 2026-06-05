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

  @keyframes fadeUp { from { opacity:0; transform:translateY(32px) } to { opacity:1; transform:translateY(0) } }
  @keyframes ripple { 0% { transform:scale(1); opacity:.6 } 100% { transform:scale(2.2); opacity:0 } }

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

  .guide-card {
    background: var(--white); border: 1px solid var(--line);
    padding: 36px 32px; transition: transform .3s, box-shadow .3s, border-color .3s;
    position: relative; overflow: hidden;
  }
  .guide-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--ocean), var(--ocean2));
    transform: scaleX(0); transform-origin: left; transition: transform .35s;
  }
  .guide-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(15,25,35,.1); border-color: rgba(3,105,161,.2); }
  .guide-card:hover::before { transform: scaleX(1); }

  .level-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase;
    padding: 5px 12px; border-radius: 2px;
  }

  .timeline-item { display: flex; gap: 32px; padding: 32px 0; border-bottom: 1px solid var(--line); }
  .timeline-item:last-child { border-bottom: none; }
  .timeline-num {
    font-family: var(--serif); font-size: 64px; font-weight: 700; color: var(--sand3);
    line-height: 1; flex-shrink: 0; width: 72px; transition: color .3s;
  }
  .timeline-item:hover .timeline-num { color: var(--ocean); }

  .stat-box { text-align: center; padding: 32px 24px; border: 1px solid var(--line); background: var(--white); }

  @media (max-width: 1024px) {
    .nav-links { display: none !important; }
    .guide-grid { grid-template-columns: 1fr !important; }
    .hero-cols { flex-direction: column !important; gap: 32px !important; }
  }
  @media (max-width: 640px) {
    .guide-grid { grid-template-columns: 1fr !important; }
    .stats-row { grid-template-columns: 1fr 1fr !important; }
  }
`;

const LEVELS = [
  {
    icon: "🌊", title: "Débutant", badge: "0 – 6 mois", color: "#047857", bg: "#d1fae5",
    desc: "Vous découvrez le surf pour la première fois. Nos coachs ISA vous guident de la mousse jusqu'aux premières vagues vertes.",
    spots: ["Imsouane — Baie", "Taghazout — Hash Point"],
    tips: ["Sessions de 2h max", "Planche longue 9'0\"", "Mousse d'abord, vague ensuite"],
  },
  {
    icon: "🏄", title: "Intermédiaire", badge: "6 mois – 3 ans", color: "#0369a1", bg: "#e0f2fe",
    desc: "Vous prenez vos premières vagues vertes et voulez progresser. Travail du take-off, duck-dive et lecture de la houle.",
    spots: ["Taghazout — Anchor Point", "Essaouira — Océan"],
    tips: ["Shortboard 7'0\" – 7'6\"", "Lire les sets", "Travailler le bottom turn"],
  },
  {
    icon: "⚡", title: "Avancé", badge: "3 ans +", color: "#b45309", bg: "#fef3c7",
    desc: "Vous surfez régulièrement et cherchez des challenges. Tubes, airs et vagues de puissance — le Maroc a ce qu'il vous faut.",
    spots: ["Safi — La Cathédrale", "Boilers — Taghazout"],
    tips: ["Shortboard 6'0\" – 6'4\"", "Sessions à l'aube", "Filmer pour analyser"],
  },
  {
    icon: "🎯", title: "Expert / Compétition", badge: "Elite", color: "#7c3aed", bg: "#ede9fe",
    desc: "Vous surfez des vagues de 4m+. Safi et ses gauches légendaires représentent le sommet du surf marocain.",
    spots: ["Safi — La Cathédrale", "Killer Point"],
    tips: ["Leash 8mm obligatoire", "Session avec guide local", "Conditions : Nov – Fév"],
  },
];

const SEASONS = [
  { month: "Jan", height: 85, quality: "Excellent", color: "#0369a1" },
  { month: "Fév", height: 80, quality: "Excellent", color: "#0369a1" },
  { month: "Mar", height: 65, quality: "Bon", color: "#0ea5e9" },
  { month: "Avr", height: 50, quality: "Moyen", color: "#64748b" },
  { month: "Mai", height: 35, quality: "Calme", color: "#94a3b8" },
  { month: "Jun", height: 30, quality: "Calme", color: "#94a3b8" },
  { month: "Jul", height: 40, quality: "Vent", color: "#f59e0b" },
  { month: "Aoû", height: 45, quality: "Vent", color: "#f59e0b" },
  { month: "Sep", height: 55, quality: "Moyen", color: "#64748b" },
  { month: "Oct", height: 72, quality: "Bon", color: "#0ea5e9" },
  { month: "Nov", height: 88, quality: "Excellent", color: "#0369a1" },
  { month: "Déc", height: 90, quality: "Excellent", color: "#0369a1" },
];

const STEPS = [
  { n: "01", title: "Choisir son spot", desc: "Selon votre niveau et la saison, notre équipe vous recommande le spot idéal. Imsouane pour les débutants, Safi pour les experts." },
  { n: "02", title: "Réserver le coaching", desc: "Session privée ou groupe de 4 max. Nos coachs ISA parlent français, anglais et arabe. Matériel inclus." },
  { n: "03", title: "Arriver & s'acclimater", desc: "Première journée : découverte du spot, lecture des conditions, échauffement à terre. Pas de précipitation." },
  { n: "04", title: "Progresser en 5 jours", desc: "Notre programme intensif de 5 jours est conçu pour un saut de niveau garanti. Vidéo d'analyse incluse." },
];

export default function Guide({ onBack, onReserver, currentPage }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 64);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const NAV_PAGES = [
    { label: "Spots", page: "spots" },
    { label: "Guide", page: "guide" },
    { label: "Galerie", page: "galerie", },
    { label: "À propos", page: "apropos" },
    { label: "Contact", page: "contact" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--sand)" }}>
      <style>{CSS}</style>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 300, height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px",
        background: scrolled ? "rgba(250,250,248,.96)" : "rgba(250,250,248,.98)",
        backdropFilter: "blur(16px) saturate(180%)",
        borderBottom: "1px solid var(--line)",
        transition: "background .35s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }} onClick={onBack}>
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
          {NAV_PAGES.map(({ label, page, anchor }) => (
            <a key={label} href="#" className={`nav-link${currentPage === page ? " active" : ""}`}
              onClick={e => { e.preventDefault(); onBack(page, anchor); }}>
              {label}
            </a>
          ))}
        </div>

        <button className="btn-primary" style={{ padding: "10px 24px", fontSize: 11 }} onClick={onReserver}>
          Réserver une session
        </button>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 68, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=90')",
          backgroundSize: "cover", backgroundPosition: "center 40%",
          filter: "brightness(.38) saturate(1.1)",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,25,35,.3) 0%, rgba(15,25,35,.7) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, padding: "100px 72px 90px", maxWidth: 1300, margin: "0 auto" }}>
          <div style={{ animation: "fadeUp .8s ease both" }}>
            <div className="section-label" style={{ color: "#38bdf8" }}>
              <span style={{ display: "inline-block", width: 28, height: 1, background: "#38bdf8" }} />
              Guide du Surfeur
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: 72, fontWeight: 700, letterSpacing: "-.04em", lineHeight: .95, color: "#fff", marginBottom: 24 }}>
              Tout savoir<br />
              <span style={{ fontStyle: "italic", fontWeight: 400, color: "#38bdf8" }}>avant de rider.</span>
            </h1>
            <p style={{ fontFamily: "var(--sans)", color: "rgba(220,238,247,.75)", fontSize: 18, maxWidth: 520, lineHeight: 1.85, marginBottom: 44 }}>
              Niveaux, saisons, spots, équipement — notre guide complet pour préparer votre aventure sur les vagues marocaines.
            </p>
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              {[["4", "Niveaux couverts"], ["12", "Mois analysés"], ["6+", "Ans d'expertise"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 700, color: "#38bdf8", lineHeight: 1 }}>{n}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,.45)", marginTop: 4, letterSpacing: ".12em", textTransform: "uppercase" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NIVEAUX */}
      <section style={{ padding: "100px 72px", background: "var(--sand)" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div className="section-label">Niveaux</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 48, fontWeight: 700, letterSpacing: "-.04em", lineHeight: 1.0, color: "var(--ink)" }}>
              Où en<br /><span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--ocean)" }}>êtes-vous ?</span>
            </h2>
          </div>
          <div className="guide-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {LEVELS.map(lv => (
              <div key={lv.title} className="guide-card">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ fontSize: 36 }}>{lv.icon}</div>
                  <span className="level-badge" style={{ background: lv.bg, color: lv.color }}>
                    {lv.badge}
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 700, marginBottom: 12, color: "var(--ink)" }}>{lv.title}</h3>
                <p style={{ fontFamily: "var(--sans)", color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>{lv.desc}</p>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--faint)", marginBottom: 10 }}>Spots recommandés</div>
                  {lv.spots.map(s => (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink2)" }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: lv.color, flexShrink: 0 }} />
                      {s}
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--faint)", marginBottom: 10 }}>Conseils clés</div>
                  {lv.tips.map(t => (
                    <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6, fontFamily: "var(--sans)", fontSize: 13, color: "var(--muted)" }}>
                      <span style={{ marginTop: 4, width: 14, height: 14, background: lv.bg, color: lv.color, borderRadius: 2, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700 }}>✓</span>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAISONNALITÉ */}
      <section style={{ padding: "100px 72px", background: "var(--sand2)" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start" }}>
            <div>
              <div className="section-label">Saisonnalité</div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 700, letterSpacing: "-.04em", lineHeight: 1.05, marginBottom: 20, color: "var(--ink)" }}>
                La bonne<br /><span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--ocean)" }}>saison.</span>
              </h2>
              <p style={{ fontFamily: "var(--sans)", color: "var(--muted)", fontSize: 15, lineHeight: 1.9, marginBottom: 32 }}>
                Le Maroc est surfable toute l'année, mais les conditions varient fortement. Octobre à mars représente la haute saison avec des houles atlantiques puissantes.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Excellent", color: "#0369a1", months: "Oct → Mar" },
                  { label: "Bon", color: "#0ea5e9", months: "Sep, Avr" },
                  { label: "Vent / Kite", color: "#f59e0b", months: "Jul – Aoû" },
                  { label: "Calme", color: "#94a3b8", months: "Mai – Jun" },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink2)", fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--faint)", marginLeft: "auto" }}>{item.months}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar chart */}
            <div>
              <div style={{ display: "flex", align: "flex-end", gap: 8, alignItems: "flex-end", height: 180 }}>
                {SEASONS.map(s => (
                  <div key={s.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ width: "100%", height: s.height * 1.6, background: s.color, borderRadius: "3px 3px 0 0", opacity: .85, transition: "opacity .2s" }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = 1; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = .85; }}
                    />
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--faint)", letterSpacing: ".08em" }}>{s.month}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24, padding: "20px 24px", background: "var(--white)", border: "1px solid var(--line)" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ocean)", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 8 }}>Meilleure période</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>Novembre → Février</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--muted)", marginTop: 6 }}>Houle atlantique 3-8m · Vent offshore · Température eau 18-20°C</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÉTAPES */}
      <section style={{ padding: "100px 72px", background: "var(--sand)" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start" }}>
            <div style={{ position: "sticky", top: 100 }}>
              <div className="section-label">Process</div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 700, letterSpacing: "-.04em", lineHeight: 1.05, marginBottom: 20, color: "var(--ink)" }}>
                Comment<br /><span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--ocean)" }}>ça marche ?</span>
              </h2>
              <p style={{ fontFamily: "var(--sans)", color: "var(--muted)", fontSize: 15, lineHeight: 1.9, marginBottom: 32 }}>
                De la réservation à la session, un processus simple et accompagné pour que vous n'ayez qu'à surfer.
              </p>
              <button className="btn-primary" onClick={onReserver}>Commencer maintenant</button>
            </div>
            <div>
              {STEPS.map((step, i) => (
                <div key={step.n} className="timeline-item" style={{ paddingTop: i === 0 ? 0 : 32 }}>
                  <div className="timeline-num">{step.n}</div>
                  <div style={{ paddingTop: 8 }}>
                    <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 700, marginBottom: 12, color: "var(--ink)" }}>{step.title}</h3>
                    <p style={{ fontFamily: "var(--sans)", color: "var(--muted)", fontSize: 15, lineHeight: 1.85 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1800&q=90')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(.4) saturate(1.1)" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(15,25,35,.55)" }} />
        <div style={{ position: "relative", zIndex: 2, padding: "90px 72px", textAlign: "center" }}>
          <div className="section-label" style={{ justifyContent: "center", color: "#38bdf8" }}>Prêt ?</div>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 52, fontWeight: 700, letterSpacing: "-.04em", marginBottom: 16, color: "#fff", lineHeight: 1.1 }}>
            Votre guide en main,<br /><span style={{ fontStyle: "italic", fontWeight: 400, color: "#38bdf8" }}>à l'eau.</span>
          </h2>
          <p style={{ fontFamily: "var(--sans)", color: "rgba(220,238,247,.75)", fontSize: 17, maxWidth: 440, margin: "0 auto 44px", lineHeight: 1.85 }}>
            Nos coachs ont accompagné plus de 3 000 surfers. C'est votre tour.
          </p>
          <button className="btn-primary" style={{ background: "#fff", color: "var(--ocean)", fontWeight: 700 }} onClick={onReserver}>
            Réserver ma session →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--ink)", color: "rgba(255,255,255,.55)", padding: "48px 72px 32px" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }} onClick={onBack}>
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
    </div>
  );
}