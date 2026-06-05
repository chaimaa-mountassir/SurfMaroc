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

  .team-card {
    background: var(--white); border: 1px solid var(--line);
    overflow: hidden; transition: transform .35s, box-shadow .35s;
  }
  .team-card:hover { transform: translateY(-8px); box-shadow: 0 24px 56px rgba(15,25,35,.12); }
  .team-card img { width: 100%; height: 260px; object-fit: cover; object-position: top; filter: saturate(.9); transition: filter .4s; }
  .team-card:hover img { filter: saturate(1.1); }

  .value-item { padding: 36px 0; border-bottom: 1px solid var(--line); display: flex; gap: 40px; align-items: flex-start; }
  .value-item:last-child { border-bottom: none; }
  .value-num { font-family: var(--mono); font-size: 11px; color: var(--ocean); letter-spacing: .15em; flex-shrink: 0; margin-top: 4px; }

  .milestone { display: flex; gap: 24px; align-items: flex-start; padding: 24px 0; border-bottom: 1px solid var(--line); }
  .milestone:last-child { border-bottom: none; }
  .milestone-year { font-family: var(--mono); font-size: 12px; color: var(--ocean); letter-spacing: .1em; flex-shrink: 0; width: 48px; margin-top: 3px; }

  @media (max-width: 1024px) {
    .nav-links { display: none !important; }
    .team-grid { grid-template-columns: 1fr 1fr !important; }
    .about-split { grid-template-columns: 1fr !important; gap: 40px !important; }
  }
  @media (max-width: 640px) {
    .team-grid { grid-template-columns: 1fr !important; }
  }
`;

const TEAM = [
  {
    name: "Youssef El Amrani", role: "Fondateur & Head Coach",
    bio: "Surfeur professionnel depuis 2005. Champion du Maroc 3 fois. ISA Level 2. A formé plus de 1 200 surfeurs.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=85",
    tag: "Taghazout · Safi",
  },
  {
    name: "Amina Tazi", role: "Coach Senior & Opérations",
    bio: "Ex-compétitrice nationale, spécialisée dans l'enseignement féminin et le longboard. ISA Level 1.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=85",
    tag: "Imsouane · Essaouira",
  },
  {
    name: "Karim Benali", role: "Photographe & Vidéaste",
    bio: "10 ans de surf photography. Son travail a été publié dans Surfer Magazine et Surf Europe.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=85",
    tag: "Tous les spots",
  },
  {
    name: "Sofia Marchal", role: "Coach & Guide Francophone",
    bio: "Franco-marocaine, spécialisée dans l'accompagnement des voyageurs européens. Parle 4 langues.",
    img: "https://images.unsplash.com/photo-1494790108755-2616b612b898?w=600&q=85",
    tag: "Taghazout · Agadir",
  },
];

const VALUES = [
  { n: "01", title: "Authenticité", desc: "Nous refusons le tourisme de masse. Chaque session est personnalisée, chaque spot choisi avec soin. Nous vous emmenons là où les locaux surfent." },
  { n: "02", title: "Sécurité d'abord", desc: "Tous nos coachs sont certifiés ISA et premiers secours. Nous ne sortons jamais dans des conditions dépassant le niveau du groupe." },
  { n: "03", title: "Respect de l'océan", desc: "Nous participons activement au nettoyage des plages marocaines et sensibilisons chaque visiteur à la préservation des écosystèmes côtiers." },
  { n: "04", title: "Progression garantie", desc: "Notre programme 5 jours est conçu pour un saut de niveau mesurable. Vidéo d'analyse incluse, suivi post-session possible." },
];

const MILESTONES = [
  { year: "2019", text: "Fondation à Taghazout par Youssef El Amrani. 3 coachs, 80 sessions la première année." },
  { year: "2021", text: "Expansion vers Safi et Imsouane. Lancement du programme photographique." },
  { year: "2023", text: "1 000ème surfeur accompagné. Partenariat avec la Fédération Royale Marocaine de Surf." },
  { year: "2025", text: "Équipe de 12 personnes. 3 000+ sessions. Note moyenne 4.9/5 sur 600+ avis." },
];

export default function Apropos({ onBack, onReserver, currentPage }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 64);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const NAV_PAGES = [
    { label: "Spots", page: "home", anchor: "spots" },
    { label: "Guide", page: "guide" },
    { label: "Galerie", page: "home", anchor: "galerie" },
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
        background: "rgba(250,250,248,.97)", backdropFilter: "blur(16px) saturate(180%)",
        borderBottom: "1px solid var(--line)", transition: "background .35s",
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
      <section style={{ paddingTop: 68 }}>
        <div style={{
          background: "var(--ink)", padding: "90px 72px 80px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 400, height: 400, borderRadius: "50%", background: "rgba(3,105,161,.08)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -80, left: "30%", width: 300, height: 300, borderRadius: "50%", background: "rgba(14,165,233,.05)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1300, margin: "0 auto", animation: "fadeUp .8s ease both" }}>
            <div className="section-label" style={{ color: "#38bdf8" }}>
              <span style={{ display: "inline-block", width: 28, height: 1, background: "#38bdf8" }} />
              Notre histoire
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: 72, fontWeight: 700, letterSpacing: "-.04em", lineHeight: .95, color: "#fff", marginBottom: 32 }}>
              Nés de<br />
              <span style={{ fontStyle: "italic", fontWeight: 400, color: "#38bdf8" }}>la passion.</span>
            </h1>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "end" }} className="about-split">
              <p style={{ fontFamily: "var(--sans)", color: "rgba(220,238,247,.7)", fontSize: 18, lineHeight: 1.9 }}>
                SurfMorocco est né d'une conviction simple : les vagues marocaines méritent d'être partagées avec le monde entier, dans le respect de leur âme sauvage.
              </p>
              <div style={{ display: "flex", gap: 40, justifyContent: "flex-end", flexWrap: "wrap" }}>
                {[["3 000+", "Surfeurs accompagnés"], ["6", "Ans d'expérience"], ["4.9/5", "Note moyenne"], ["12", "Coachs certifiés"]].map(([n, l]) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 38, fontWeight: 700, color: "#38bdf8", lineHeight: 1 }}>{n}</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "rgba(255,255,255,.35)", marginTop: 6, letterSpacing: ".1em", textTransform: "uppercase", maxWidth: 80 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section style={{ padding: "100px 72px", background: "var(--sand)" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start" }} className="about-split">
            <div style={{ position: "sticky", top: 100 }}>
              <div className="section-label">Nos valeurs</div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 700, letterSpacing: "-.04em", lineHeight: 1.05, color: "var(--ink)" }}>
                Ce en quoi<br /><span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--ocean)" }}>nous croyons.</span>
              </h2>
            </div>
            <div>
              {VALUES.map(v => (
                <div key={v.n} className="value-item">
                  <div className="value-num">{v.n}</div>
                  <div>
                    <h3 style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 700, marginBottom: 10, color: "var(--ink)" }}>{v.title}</h3>
                    <p style={{ fontFamily: "var(--sans)", color: "var(--muted)", fontSize: 15, lineHeight: 1.85 }}>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ÉQUIPE */}
      <section style={{ padding: "100px 72px", background: "var(--sand2)" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <div style={{ marginBottom: 56, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
            <div>
              <div className="section-label">L'équipe</div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 48, fontWeight: 700, letterSpacing: "-.04em", lineHeight: 1.0, color: "var(--ink)" }}>
                Des visages<br /><span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--ocean)" }}>derrière les vagues.</span>
              </h2>
            </div>
            <p style={{ fontFamily: "var(--sans)", color: "var(--muted)", fontSize: 15, maxWidth: 340, lineHeight: 1.85 }}>
              Chaque membre de notre équipe est d'abord un surfeur passionné avant d'être un professionnel.
            </p>
          </div>
          <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {TEAM.map(m => (
              <div key={m.name} className="team-card">
                <img src={m.img} alt={m.name} />
                <div style={{ padding: "24px 20px" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ocean)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 8 }}>{m.tag}</div>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: 17, fontWeight: 700, marginBottom: 4, color: "var(--ink)" }}>{m.name}</h3>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--ocean)", fontWeight: 500, marginBottom: 12, letterSpacing: ".02em" }}>{m.role}</div>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--muted)", lineHeight: 1.75 }}>{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HISTOIRE / TIMELINE */}
      <section style={{ padding: "100px 72px", background: "var(--sand)" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="about-split">
            <div>
              <div className="section-label">Chronologie</div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 700, letterSpacing: "-.04em", lineHeight: 1.05, marginBottom: 20, color: "var(--ink)" }}>
                Notre<br /><span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--ocean)" }}>parcours.</span>
              </h2>
              <p style={{ fontFamily: "var(--sans)", color: "var(--muted)", fontSize: 15, lineHeight: 1.9 }}>
                De 3 coachs à Taghazout à une équipe de 12 personnes couvrant toute la côte atlantique marocaine.
              </p>
            </div>
            <div>
              {MILESTONES.map(m => (
                <div key={m.year} className="milestone">
                  <div className="milestone-year">{m.year}</div>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: "var(--ink2)", lineHeight: 1.8 }}>{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--sand2)", padding: "80px 72px", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 40 }}>
          <div>
            <div className="section-label">Rejoignez-nous</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 700, letterSpacing: "-.04em", lineHeight: 1.05, color: "var(--ink)" }}>
              Faites partie<br /><span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--ocean)" }}>de l'aventure.</span>
            </h2>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={onReserver}>Réserver une session</button>
            <button onClick={() => onBack("contact")} style={{
              fontFamily: "var(--sans)", fontSize: 12, fontWeight: 500, letterSpacing: ".1em",
              textTransform: "uppercase", background: "transparent", color: "var(--ink2)",
              border: "1.5px solid var(--sand3)", padding: "13px 30px", cursor: "pointer",
              transition: "border-color .2s, color .2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--ink)"; e.currentTarget.style.color = "var(--ink)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--sand3)"; e.currentTarget.style.color = "var(--ink2)"; }}
            >
              Nous contacter
            </button>
          </div>
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