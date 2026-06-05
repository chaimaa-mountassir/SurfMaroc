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
  @keyframes fadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
  @keyframes checkPop { 0%{transform:scale(0);opacity:0} 70%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }

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
    border:none; padding:14px 32px; cursor:pointer; width:100%;
    transition:background .2s,transform .15s,box-shadow .2s;
    box-shadow:0 2px 12px rgba(15,25,35,.18);
  }
  .btn-primary:hover { background:var(--ocean); transform:translateY(-1px); box-shadow:0 6px 24px rgba(3,105,161,.3); }
  .btn-primary:disabled { background:var(--faint); cursor:not-allowed; transform:none; box-shadow:none; }

  .section-label {
    font-family:var(--mono); font-size:10px; font-weight:500;
    letter-spacing:.2em; text-transform:uppercase; color:var(--ocean);
    margin-bottom:16px; display:flex; align-items:center; gap:10px;
  }
  .section-label::before { content:''; display:inline-block; width:28px; height:1px; background:var(--ocean); }

  .field-wrap { margin-bottom: 20px; }
  .field-label { font-family:var(--mono); font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:var(--muted); margin-bottom:8px; display:block; }
  .field-input {
    width: 100%; padding: 14px 16px; border: 1.5px solid var(--sand3);
    background: var(--white); font-family: var(--sans); font-size: 15px; color: var(--ink);
    outline: none; transition: border-color .2s, box-shadow .2s; resize: none;
  }
  .field-input:focus { border-color: var(--ocean); box-shadow: 0 0 0 3px rgba(3,105,161,.1); }
  .field-input::placeholder { color: var(--faint); }

  .info-card {
    padding: 28px 24px; border: 1px solid var(--line); background: var(--white);
    display: flex; gap: 16px; align-items: flex-start;
    transition: border-color .25s, box-shadow .25s;
  }
  .info-card:hover { border-color: rgba(3,105,161,.25); box-shadow: 0 8px 28px rgba(3,105,161,.07); }

  .faq-item { border-bottom: 1px solid var(--line); }
  .faq-question {
    width: 100%; background: none; border: none; cursor: pointer;
    padding: 22px 0; display: flex; justify-content: space-between; align-items: center;
    font-family: var(--serif); font-size: 17px; font-weight: 700; color: var(--ink);
    text-align: left; transition: color .2s;
  }
  .faq-question:hover { color: var(--ocean); }
  .faq-answer { overflow: hidden; transition: max-height .35s ease, opacity .3s; }

  .success-check { animation: checkPop .5s cubic-bezier(.4,0,.2,1) both; }

  @media (max-width: 1024px) {
    .nav-links { display: none !important; }
    .contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
    .info-grid { grid-template-columns: 1fr !important; }
  }
`;

const FAQS = [
  { q: "Faut-il savoir nager pour apprendre le surf ?", a: "Oui, un minimum de confort dans l'eau est nécessaire. Savoir nager 50m sans aide est le seuil minimal que nous recommandons avant toute session." },
  { q: "Quel équipement dois-je apporter ?", a: "Rien. Planches, combinaisons, leash et lycras sont fournis pour toutes nos sessions. Apportez juste de la crème solaire waterproof et une bonne dose d'enthousiasme." },
  { q: "Quelle est la meilleure période pour venir ?", a: "Octobre à mars pour les vagues les plus puissantes. Toute l'année pour les débutants, Imsouane offrant une baie protégée idéale quelque soit la saison." },
  { q: "Y a-t-il un âge minimum ou maximum ?", a: "Nous accueillons des surfeurs dès 8 ans (avec autorisation parentale) et n'avons pas de limite supérieure. Notre coach le plus âgé a 57 ans et surfe mieux que jamais." },
  { q: "Proposez-vous des sessions pour groupes ?", a: "Oui, jusqu'à 8 personnes pour les groupes amicaux et familiaux. Pour les groupes d'entreprise (team building), nous pouvons organiser des sessions pour 20+ personnes." },
];

export default function Contact({ onBack, onReserver, currentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 64);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleSubmit = () => {
    if (!form.nom || !form.email || !form.message) return;
    setSent(true);
  };

  const NAV_PAGES = [
    { label: "Spots", page: "spots" },
    { label: "Guide", page: "guide" },
    { label: "Galerie", page: "galerie"},
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
        borderBottom: "1px solid var(--line)",
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
        <button className="btn-primary" style={{ padding: "10px 24px", fontSize: 11, width: "auto" }} onClick={onReserver}>
          Réserver une session
        </button>
      </nav>

      {/* HERO STRIP */}
      <section style={{ paddingTop: 68, background: "var(--ink)" }}>
        <div style={{ padding: "72px 72px 64px", maxWidth: 1300, margin: "0 auto", animation: "fadeUp .8s ease both" }}>
          <div className="section-label" style={{ color: "#38bdf8" }}>
            <span style={{ display: "inline-block", width: 28, height: 1, background: "#38bdf8" }} />
            Contactez-nous
          </div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 68, fontWeight: 700, letterSpacing: "-.04em", lineHeight: .95, color: "#fff" }}>
            On est là,<br />
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "#38bdf8" }}>écrivez-nous.</span>
          </h1>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section style={{ padding: "80px 72px 100px", background: "var(--sand)" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 72, alignItems: "start" }}>

            {/* LEFT — infos */}
            <div>
              <div style={{ marginBottom: 40 }}>
                <div className="section-label">Coordonnées</div>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 700, letterSpacing: "-.03em", marginBottom: 16, color: "var(--ink)" }}>
                  Plusieurs façons<br />de nous joindre.
                </h2>
                <p style={{ fontFamily: "var(--sans)", color: "var(--muted)", fontSize: 15, lineHeight: 1.9 }}>
                  Réponse garantie sous 24h. Pour les urgences de réservation, privilégiez WhatsApp.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 48 }}>
                {[
                  { icon: "📍", title: "Adresse", val: "Rue des Vagues, Taghazout\nAgadir 80250, Maroc" },
                  { icon: "📞", title: "Téléphone & WhatsApp", val: "+212 6 12 34 56 78" },
                  { icon: "✉️", title: "Email", val: "contact@surfmorocco.ma" },
                  { icon: "🕐", title: "Horaires", val: "Lun – Sam · 8h00 → 19h00\nDimanche sur RDV" },
                ].map(item => (
                  <div key={item.title} className="info-card">
                    <div style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--ocean)", marginBottom: 6 }}>{item.title}</div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink2)", lineHeight: 1.7, whiteSpace: "pre-line" }}>{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social links */}
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--faint)", marginBottom: 14 }}>Réseaux sociaux</div>
                <div style={{ display: "flex", gap: 10 }}>
                  {[["Instagram", "#e1306c"], ["Facebook", "#1877f2"], ["YouTube", "#ff0000"], ["TikTok", "#0f1923"]].map(([name, color]) => (
                    <div key={name} style={{
                      padding: "8px 14px", border: "1px solid var(--line)", background: "var(--white)",
                      fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600, color: "var(--ink2)",
                      cursor: "pointer", transition: "border-color .2s, color .2s",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.color = "var(--ink2)"; }}
                    >{name}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — form */}
            <div>
              {sent ? (
                <div style={{ padding: "72px 48px", background: "var(--white)", border: "1px solid var(--line)", textAlign: "center" }}>
                  <div className="success-check" style={{ fontSize: 56, marginBottom: 24 }}>✅</div>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 700, marginBottom: 12, color: "var(--ink)" }}>Message envoyé !</h3>
                  <p style={{ fontFamily: "var(--sans)", color: "var(--muted)", fontSize: 16, lineHeight: 1.8, maxWidth: 340, margin: "0 auto 32px" }}>
                    Merci <strong>{form.nom}</strong>. Notre équipe vous répondra dans les 24 heures.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ nom: "", email: "", sujet: "", message: "" }); }}
                    style={{
                      fontFamily: "var(--sans)", fontSize: 12, fontWeight: 500, letterSpacing: ".1em",
                      textTransform: "uppercase", background: "transparent", color: "var(--ocean)",
                      border: "1.5px solid var(--ocean)", padding: "12px 28px", cursor: "pointer",
                    }}
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <div style={{ background: "var(--white)", border: "1px solid var(--line)", padding: "44px 40px" }}>
                  <h3 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 700, marginBottom: 8, color: "var(--ink)" }}>Envoyez-nous un message</h3>
                  <p style={{ fontFamily: "var(--sans)", color: "var(--muted)", fontSize: 14, marginBottom: 36, lineHeight: 1.7 }}>
                    Pour les réservations, utilisez directement le bouton "Réserver une session".
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div className="field-wrap">
                      <label className="field-label">Nom complet *</label>
                      <input className="field-input" placeholder="Votre nom" value={form.nom}
                        onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
                    </div>
                    <div className="field-wrap">
                      <label className="field-label">Email *</label>
                      <input className="field-input" type="email" placeholder="votre@email.com" value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                  </div>

                  <div className="field-wrap">
                    <label className="field-label">Sujet</label>
                    <select className="field-input" value={form.sujet}
                      onChange={e => setForm(f => ({ ...f, sujet: e.target.value }))}>
                      <option value="">Choisir un sujet</option>
                      <option>Renseignements sur les sessions</option>
                      <option>Partenariat / Presse</option>
                      <option>Hébergement & logistique</option>
                      <option>Feedback après session</option>
                      <option>Autre</option>
                    </select>
                  </div>

                  <div className="field-wrap" style={{ marginBottom: 32 }}>
                    <label className="field-label">Message *</label>
                    <textarea className="field-input" rows={6} placeholder="Décrivez votre demande..." value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                  </div>

                  <button className="btn-primary"
                    disabled={!form.nom || !form.email || !form.message}
                    onClick={handleSubmit}>
                    Envoyer le message →
                  </button>
                  <p style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--faint)", marginTop: 14, textAlign: "center", letterSpacing: ".08em" }}>
                    * Champs obligatoires · Réponse sous 24h
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 72px 100px", background: "var(--sand2)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-label" style={{ justifyContent: "center" }}>FAQ</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: 42, fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)" }}>
              Questions <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--ocean)" }}>fréquentes.</span>
            </h2>
          </div>
          <div>
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 18, color: "var(--ocean)", transition: "transform .3s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
                </button>
                <div className="faq-answer" style={{ maxHeight: openFaq === i ? 200 : 0, opacity: openFaq === i ? 1 : 0 }}>
                  <p style={{ fontFamily: "var(--sans)", color: "var(--muted)", fontSize: 15, lineHeight: 1.85, paddingBottom: 24 }}>{faq.a}</p>
                </div>
              </div>
            ))}
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