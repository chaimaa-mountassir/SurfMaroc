import { useState } from "react";
import logo from "../assets/ChatGPT Image 28 mai 2026, 22_55_44.png";

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
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
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--sand); }
  ::-webkit-scrollbar-thumb { background: var(--sand3); border-radius: 2px; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes ripple { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.2);opacity:0} }
  @keyframes floatBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes checkPop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
  @keyframes progressFill { from{width:0%} to{width:var(--target-width)} }

  .btn-primary {
    font-family: var(--sans); font-size: 12px; font-weight: 600;
    letter-spacing: .12em; text-transform: uppercase; background: var(--ink); color: #fff;
    border: none; padding: 14px 32px; cursor: pointer;
    transition: background .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 2px 12px rgba(15,25,35,.18);
  }
  .btn-primary:hover { background: var(--ocean); transform: translateY(-1px); box-shadow: 0 6px 24px rgba(3,105,161,.3); }
  .btn-primary:disabled { background: var(--faint); cursor: not-allowed; transform: none; box-shadow: none; }

  .btn-secondary {
    font-family: var(--sans); font-size: 12px; font-weight: 500;
    letter-spacing: .1em; text-transform: uppercase; background: transparent;
    color: var(--ink2); border: 1.5px solid var(--sand3); padding: 13px 30px; cursor: pointer;
    transition: border-color .2s, color .2s, background .2s;
  }
  .btn-secondary:hover { border-color: var(--ink); color: var(--ink); background: var(--sand2); }

  .section-label {
    font-family: var(--mono); font-size: 10px; font-weight: 500;
    letter-spacing: .2em; text-transform: uppercase; color: var(--ocean);
    margin-bottom: 16px; display: flex; align-items: center; gap: 10px;
  }
  .section-label::before { content:''; display:inline-block; width:28px; height:1px; background:var(--ocean); }

  .live-dot { width:7px; height:7px; border-radius:50%; background:#10b981; position:relative; flex-shrink:0; }
  .live-dot::after { content:''; position:absolute; inset:-3px; border-radius:50%; border:1.5px solid #10b981; animation:ripple 1.8s ease-out infinite; }

  /* STEP INDICATOR */
  .step-dot {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); font-size: 13px; font-weight: 500;
    transition: all .35s cubic-bezier(.4,0,.2,1);
    position: relative; z-index: 1;
  }
  .step-dot.done { background: var(--ocean); color: #fff; }
  .step-dot.active { background: var(--ink); color: #fff; box-shadow: 0 0 0 4px rgba(3,105,161,.2); }
  .step-dot.pending { background: var(--sand3); color: var(--faint); }

  /* OPTION CARDS */
  .option-card {
    border: 1.5px solid var(--line); background: var(--white); cursor: pointer;
    transition: border-color .25s, box-shadow .25s, transform .25s;
    position: relative; overflow: hidden;
  }
  .option-card:hover { border-color: var(--ocean2); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(3,105,161,.1); }
  .option-card.selected { border-color: var(--ocean); box-shadow: 0 0 0 3px rgba(3,105,161,.15); }
  .option-card .check {
    position: absolute; top: 12px; right: 12px;
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--ocean); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; opacity: 0; transform: scale(0);
    transition: all .2s cubic-bezier(.4,0,.2,1);
  }
  .option-card.selected .check { opacity: 1; transform: scale(1); animation: checkPop .3s ease both; }

  /* DATE PICKER */
  .cal-day {
    aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); font-size: 12px; border-radius: 50%; cursor: pointer;
    transition: background .15s, color .15s;
  }
  .cal-day:hover:not(.disabled):not(.selected) { background: var(--sand2); }
  .cal-day.selected { background: var(--ocean); color: #fff; }
  .cal-day.today { font-weight: 700; color: var(--ocean); }
  .cal-day.disabled { color: var(--faint); cursor: not-allowed; opacity: .4; }
  .cal-day.in-range { background: rgba(3,105,161,.1); border-radius: 0; }

  /* SUMMARY CARD */
  .summary-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 14px 0; border-bottom: 1px solid var(--line2); }
  .summary-row:last-child { border-bottom: none; }

  /* FORM INPUT */
  .field-input {
    width: 100%; padding: 13px 16px; font-family: var(--sans); font-size: 14px;
    color: var(--ink); background: var(--white); outline: none;
    transition: border-color .2s; border: 1.5px solid var(--line);
  }
  .field-input:focus { border-color: var(--ocean); }
  .field-label { font-family: var(--mono); font-size: 10px; letter-spacing: .15em; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 8px; }

  /* RESPONSIVE */
  @media(max-width: 1024px) {
    .reservation-layout { grid-template-columns: 1fr !important; }
    .sidebar-sticky { position: static !important; top: auto !important; }
    .spots-options { grid-template-columns: 1fr 1fr !important; }
    .forfait-options { grid-template-columns: 1fr !important; }
    .page-hero { padding: 80px 28px 56px !important; }
  }
  @media(max-width: 640px) {
    .spots-options { grid-template-columns: 1fr !important; }
    .step-labels { display: none !important; }
    .page-hero h1 { font-size: 48px !important; }
    .form-duo { grid-template-columns: 1fr !important; }
    .extras-grid { grid-template-columns: 1fr !important; }
  }
`;

// ─── DATA ────────────────────────────────────────────────────────────────────
const SPOTS = [
  { id:"taghazout", name:"Taghazout", tag:"World Class", level:"Intermédiaire", wave:"2–4m", season:"Oct–Avr", img:"https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=700&q=85", accent:"#0369a1", light:"#e0f2fe" },
  { id:"safi",      name:"Safi",      tag:"Compétition", level:"Expert",        wave:"4–8m", season:"Nov–Mar", img:"https://images.unsplash.com/photo-1455264745730-cb3b76250c77?w=700&q=85", accent:"#b45309", light:"#fef3c7" },
  { id:"imsouane",  name:"Imsouane",  tag:"Tous niveaux",level:"Débutant→Pro",  wave:"1–2m", season:"Année",   img:"https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?w=700&q=85", accent:"#047857", light:"#d1fae5" },
  { id:"essaouira", name:"Essaouira", tag:"Wind & Waves", level:"Intermédiaire",wave:"2–3m", season:"Mai–Sep", img:"https://images.unsplash.com/photo-1519046904884-53103b34b206?w=700&q=85", accent:"#7c3aed", light:"#ede9fe" },
  { id:"agadir",    name:"Agadir",    tag:"Beach Break",  level:"Débutant",     wave:"1–2.5m",season:"Année",  img:"https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=700&q=85", accent:"#dc2626", light:"#fee2e2" },
  { id:"dakhla",    name:"Dakhla",    tag:"Lagon",         level:"Tous niveaux",wave:"1–3m", season:"Nov–Avr", img:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=85", accent:"#0891b2", light:"#cffafe" },
];

const FORFAITS = [
  { id:"decouverte", name:"Découverte", duration:"2h", price:45, desc:"Session d'initiation encadrée par un coach certifié ISA. Idéale pour les débutants et les premières fois.", includes:["Coach ISA dédié","Planche & combinaison","Photos incluses"], popular:false },
  { id:"progression", name:"Progression", duration:"Demi-journée", price:85, desc:"4h d'immersion complète. Analyse vidéo de votre surf, corrections techniques personnalisées.", includes:["Coach ISA dédié","Planche & combinaison","Analyse vidéo","Transfert spot inclus"], popular:true },
  { id:"intensif", name:"Intensif", duration:"Journée", price:160, desc:"La journée surf parfaite. Deux sessions, déjeuner local inclus, coaching premium toute la journée.", includes:["Coach premium","Planche & combinaison","Analyse vidéo","Déjeuner riad","Transfert aller-retour","Photos & vidéo HD"], popular:false },
  { id:"camp", name:"Camp 7 jours", duration:"1 semaine", price:890, desc:"L'expérience complète SurfMorocco. Hébergement, repas, coaching, photo, et découverte des meilleurs spots.", includes:["Hébergement surf camp","Tous repas inclus","Coach dédié","Analyse vidéo quotidienne","Visite 3 spots","Photos & vidéo HD","Kit souvenir"], popular:false },
];

const EXTRAS = [
  { id:"photo", icon:"📸", name:"Pack Photo HD", desc:"Séance photo professionnelle pendant votre session. 50+ photos retouchées livrées sous 48h.", price:35 },
  { id:"video", icon:"🎬", name:"Film de session", desc:"Montage vidéo cinématique de 2–3 minutes de votre session. Musique, ralentis, POV.", price:55 },
  { id:"materiel", icon:"🏄", name:"Planche premium", desc:"Planche performance sélectionnée selon vos conditions et votre niveau. Marques : Lost, Channel Islands.", price:20 },
  { id:"transfert", icon:"🚐", name:"Transfert hôtel", desc:"Prise en charge depuis votre hôtel ou riad jusqu'au spot et retour.", price:15 },
];

const STEPS = ["Spot", "Forfait", "Date & Surfers", "Extras", "Vos infos", "Confirmation"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS_SHORT = ["Lu","Ma","Me","Je","Ve","Sa","Di"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  let d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday first
}
function fmt(date) {
  if (!date) return "—";
  return `${String(date.getDate()).padStart(2,"0")}/${String(date.getMonth()+1).padStart(2,"0")}/${date.getFullYear()}`;
}

// ─── MINI CALENDAR ───────────────────────────────────────────────────────────
function Calendar({ value, onChange }) {
  const today = new Date();
  const [vYear, setVYear] = useState(today.getFullYear());
  const [vMonth, setVMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(vYear, vMonth);
  const firstDay = getFirstDayOfMonth(vYear, vMonth);

  const prev = () => { if (vMonth === 0) { setVYear(y => y-1); setVMonth(11); } else setVMonth(m => m-1); };
  const next = () => { if (vMonth === 11) { setVYear(y => y+1); setVMonth(0); } else setVMonth(m => m+1); };

  const isSelected = (d) => value && value.getDate()===d && value.getMonth()===vMonth && value.getFullYear()===vYear;
  const isToday = (d) => today.getDate()===d && today.getMonth()===vMonth && today.getFullYear()===vYear;
  const isPast = (d) => {
    const dt = new Date(vYear, vMonth, d);
    dt.setHours(0,0,0,0);
    const t = new Date(); t.setHours(0,0,0,0);
    return dt < t;
  };

  return (
    <div style={{ background:"var(--white)", border:"1px solid var(--line)", padding:"24px 20px", userSelect:"none" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <button onClick={prev} style={{ background:"none", border:"1px solid var(--line)", width:32, height:32, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--muted)", transition:"all .15s" }}
          onMouseEnter={e => e.currentTarget.style.background="var(--sand2)"}
          onMouseLeave={e => e.currentTarget.style.background="none"}
        >‹</button>
        <div style={{ fontFamily:"var(--serif)", fontSize:16, fontWeight:700, color:"var(--ink)", letterSpacing:"-.02em" }}>
          {MONTHS[vMonth]} {vYear}
        </div>
        <button onClick={next} style={{ background:"none", border:"1px solid var(--line)", width:32, height:32, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--muted)", transition:"all .15s" }}
          onMouseEnter={e => e.currentTarget.style.background="var(--sand2)"}
          onMouseLeave={e => e.currentTarget.style.background="none"}
        >›</button>
      </div>
      {/* Day labels */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:2, marginBottom:6 }}>
        {DAYS_SHORT.map(d => (
          <div key={d} style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--faint)", textAlign:"center", padding:"4px 0", letterSpacing:".05em" }}>{d}</div>
        ))}
      </div>
      {/* Days */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:2 }}>
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`}/>)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1;
          const past = isPast(d);
          const sel = isSelected(d);
          const tod = isToday(d);
          return (
            <div key={d} className={`cal-day${sel?" selected":""}${tod&&!sel?" today":""}${past?" disabled":""}`}
              style={{ fontSize:12 }}
              onClick={() => !past && onChange(new Date(vYear, vMonth, d))}
            >{d}</div>
          );
        })}
      </div>
      {value && (
        <div style={{ marginTop:16, paddingTop:14, borderTop:"1px solid var(--line2)", fontFamily:"var(--mono)", fontSize:11, color:"var(--ocean)", textAlign:"center", letterSpacing:".08em" }}>
          ✓ Date sélectionnée : {fmt(value)}
        </div>
      )}
    </div>
  );
}

// ─── PROGRESS BAR ────────────────────────────────────────────────────────────
function ProgressBar({ step }) {
  const pct = Math.round(((step) / (STEPS.length - 1)) * 100);
  return (
    <div style={{ background:"var(--sand3)", height:3, borderRadius:2, overflow:"hidden" }}>
      <div style={{ height:"100%", background:"var(--ocean)", width:`${pct}%`, transition:"width .5s cubic-bezier(.4,0,.2,1)", borderRadius:2 }}/>
    </div>
  );
}

// ─── STEP INDICATOR ──────────────────────────────────────────────────────────
function StepIndicator({ step }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:40 }}>
      {STEPS.map((label, i) => (
        <div key={label} style={{ display:"flex", alignItems:"center", flex: i < STEPS.length-1 ? 1 : "none" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            <div className={`step-dot ${i < step ? "done" : i === step ? "active" : "pending"}`}>
              {i < step ? "✓" : i + 1}
            </div>
            <div className="step-labels" style={{ fontFamily:"var(--mono)", fontSize:9.5, letterSpacing:".1em", textTransform:"uppercase", color: i===step?"var(--ink)": i<step?"var(--ocean)":"var(--faint)", whiteSpace:"nowrap", transition:"color .3s" }}>{label}</div>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex:1, height:1, background: i < step ? "var(--ocean)" : "var(--line)", margin:"0 8px", marginBottom:24, transition:"background .35s" }}/>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── SUMMARY SIDEBAR ─────────────────────────────────────────────────────────
function Summary({ booking }) {
  const spot = SPOTS.find(s => s.id === booking.spot);
  const forfait = FORFAITS.find(f => f.id === booking.forfait);
  const extras = EXTRAS.filter(e => booking.extras.includes(e.id));
  const subtotal = (forfait?.price || 0) * (booking.surfers || 1);
  const extrasTotal = extras.reduce((a, e) => a + e.price, 0) * (booking.surfers || 1);
  const total = subtotal + extrasTotal;

  return (
    <div style={{ background:"var(--white)", border:"1px solid var(--line)", overflow:"hidden" }}>
      {/* Header image */}
      {spot ? (
        <div style={{ position:"relative", height:160, overflow:"hidden" }}>
          <img src={spot.img} alt={spot.name} style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(.7) saturate(1.1)" }}/>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(15,25,35,.8) 40%, transparent)" }}/>
          <div style={{ position:"absolute", bottom:16, left:16 }}>
            <div style={{ fontFamily:"var(--serif)", fontSize:24, fontWeight:700, color:"#fff" }}>{spot.name}</div>
            <span style={{ background:spot.light, color:spot.accent, padding:"2px 8px", fontFamily:"var(--mono)", fontSize:9, letterSpacing:".12em", textTransform:"uppercase" }}>{spot.tag}</span>
          </div>
        </div>
      ) : (
        <div style={{ height:120, background:"var(--sand3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--faint)", letterSpacing:".15em", textTransform:"uppercase" }}>Sélectionnez un spot</div>
        </div>
      )}

      <div style={{ padding:"20px 20px 24px" }}>
        <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--ocean)", letterSpacing:".15em", textTransform:"uppercase", marginBottom:16 }}>Récapitulatif</div>

        <div className="summary-row">
          <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--faint)", letterSpacing:".1em", textTransform:"uppercase" }}>Spot</div>
          <div style={{ fontFamily:"var(--sans)", fontSize:13, fontWeight:600, color:"var(--ink)" }}>{spot?.name || "—"}</div>
        </div>
        <div className="summary-row">
          <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--faint)", letterSpacing:".1em", textTransform:"uppercase" }}>Forfait</div>
          <div style={{ fontFamily:"var(--sans)", fontSize:13, fontWeight:600, color:"var(--ink)" }}>{forfait?.name || "—"}</div>
        </div>
        <div className="summary-row">
          <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--faint)", letterSpacing:".1em", textTransform:"uppercase" }}>Date</div>
          <div style={{ fontFamily:"var(--sans)", fontSize:13, fontWeight:600, color:"var(--ink)" }}>{fmt(booking.date)}</div>
        </div>
        <div className="summary-row">
          <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--faint)", letterSpacing:".1em", textTransform:"uppercase" }}>Surfers</div>
          <div style={{ fontFamily:"var(--sans)", fontSize:13, fontWeight:600, color:"var(--ink)" }}>{booking.surfers || 1}</div>
        </div>
        {extras.length > 0 && (
          <div className="summary-row" style={{ flexDirection:"column", gap:6 }}>
            <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--faint)", letterSpacing:".1em", textTransform:"uppercase" }}>Extras</div>
            {extras.map(e => (
              <div key={e.id} style={{ display:"flex", justifyContent:"space-between" }}>
                <div style={{ fontFamily:"var(--sans)", fontSize:12.5, color:"var(--muted)" }}>{e.name}</div>
                <div style={{ fontFamily:"var(--mono)", fontSize:12, color:"var(--ink)" }}>+{e.price}€/pers.</div>
              </div>
            ))}
          </div>
        )}

        {/* Pricing */}
        {forfait && (
          <div style={{ marginTop:16, paddingTop:16, borderTop:"2px solid var(--ink)" }}>
            {subtotal > 0 && (
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <div style={{ fontFamily:"var(--sans)", fontSize:13, color:"var(--muted)" }}>
                  {forfait.name} × {booking.surfers || 1}
                </div>
                <div style={{ fontFamily:"var(--mono)", fontSize:13, color:"var(--ink)" }}>{subtotal}€</div>
              </div>
            )}
            {extrasTotal > 0 && (
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <div style={{ fontFamily:"var(--sans)", fontSize:13, color:"var(--muted)" }}>Extras</div>
                <div style={{ fontFamily:"var(--mono)", fontSize:13, color:"var(--ink)" }}>{extrasTotal}€</div>
              </div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:12, paddingTop:12, borderTop:"1px solid var(--line)" }}>
              <div style={{ fontFamily:"var(--serif)", fontSize:18, fontWeight:700, color:"var(--ink)" }}>Total</div>
              <div style={{ fontFamily:"var(--serif)", fontSize:22, fontWeight:700, color:"var(--ocean)" }}>{total}€</div>
            </div>
            <div style={{ fontFamily:"var(--mono)", fontSize:9.5, color:"var(--faint)", textAlign:"right", marginTop:4, letterSpacing:".07em" }}>Paiement sur place · Annulation 48h</div>
          </div>
        )}

        {/* Trust */}
        <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid var(--line2)" }}>
          {[["✓ Coachs ISA certifiés"],["✓ Matériel inclus"],["✓ Annulation gratuite 48h"],["✓ Réponse sous 2h"]].map(([t]) => (
            <div key={t} style={{ fontFamily:"var(--sans)", fontSize:12.5, color:"var(--muted)", marginBottom:6 }}>{t}</div>
          ))}
        </div>

        {/* Live badge */}
        <div style={{ marginTop:16, background:"var(--sand2)", padding:"10px 14px", display:"flex", alignItems:"center", gap:8 }}>
          <div className="live-dot"/>
          <div>
            <div style={{ fontFamily:"var(--mono)", fontSize:9.5, color:"#047857", letterSpacing:".1em" }}>TAGHAZOUT LIVE · 2.4m</div>
            <div style={{ fontFamily:"var(--sans)", fontSize:11.5, color:"var(--muted)", marginTop:1 }}>Conditions Excellentes aujourd'hui</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ÉTAPE 1 : SPOT ──────────────────────────────────────────────────────────
function StepSpot({ booking, setBooking }) {
  return (
    <div style={{ animation:"fadeUp .5s ease both" }}>
      <div style={{ marginBottom:36 }}>
        <div className="section-label">Étape 1</div>
        <h2 style={{ fontFamily:"var(--serif)", fontSize:42, fontWeight:700, letterSpacing:"-.04em", color:"var(--ink)", lineHeight:1.05 }}>
          Choisissez votre<br/><span style={{ fontStyle:"italic", fontWeight:400, color:"var(--ocean)" }}>destination</span>
        </h2>
        <p style={{ fontFamily:"var(--sans)", color:"var(--muted)", fontSize:15, lineHeight:1.8, marginTop:12 }}>
          Sélectionnez le spot qui correspond à votre niveau et à vos envies.
        </p>
      </div>
      <div className="spots-options" style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16 }}>
        {SPOTS.map((s, i) => (
          <div key={s.id} className={`option-card${booking.spot===s.id?" selected":""}`}
            style={{ animation:`fadeUp .5s ${i*.07}s ease both` }}
            onClick={() => setBooking(b => ({ ...b, spot: s.id }))}
          >
            <div className="check">✓</div>
            <div style={{ position:"relative", overflow:"hidden" }}>
              <img src={s.img} alt={s.name} style={{ width:"100%", height:140, objectFit:"cover", display:"block", transition:"transform .5s" }}
                onMouseEnter={e => e.currentTarget.style.transform="scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform="none"}
              />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(15,25,35,.7) 30%, transparent)" }}/>
              <span style={{ position:"absolute", top:10, left:10, background:"rgba(255,255,255,.92)", color:s.accent, padding:"2px 8px", fontFamily:"var(--mono)", fontSize:9, letterSpacing:".1em", textTransform:"uppercase" }}>{s.tag}</span>
              <div style={{ position:"absolute", bottom:10, left:12 }}>
                <div style={{ fontFamily:"var(--serif)", fontSize:20, fontWeight:700, color:"#fff" }}>{s.name}</div>
              </div>
            </div>
            <div style={{ padding:"14px 14px 16px" }}>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {[`🌊 ${s.wave}`, `⚡ ${s.level}`].map(tag => (
                  <span key={tag} style={{ background:"var(--sand2)", padding:"3px 8px", fontFamily:"var(--mono)", fontSize:10, color:"var(--muted)" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ÉTAPE 2 : FORFAIT ───────────────────────────────────────────────────────
function StepForfait({ booking, setBooking }) {
  return (
    <div style={{ animation:"fadeUp .5s ease both" }}>
      <div style={{ marginBottom:36 }}>
        <div className="section-label">Étape 2</div>
        <h2 style={{ fontFamily:"var(--serif)", fontSize:42, fontWeight:700, letterSpacing:"-.04em", color:"var(--ink)", lineHeight:1.05 }}>
          Votre forfait<br/><span style={{ fontStyle:"italic", fontWeight:400, color:"var(--ocean)" }}>idéal</span>
        </h2>
        <p style={{ fontFamily:"var(--sans)", color:"var(--muted)", fontSize:15, lineHeight:1.8, marginTop:12 }}>
          Du cours découverte au camp immersif d'une semaine.
        </p>
      </div>
      <div className="forfait-options" style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:16 }}>
        {FORFAITS.map((f, i) => (
          <div key={f.id} className={`option-card${booking.forfait===f.id?" selected":""}`}
            style={{ padding:"24px 22px", position:"relative", animation:`fadeUp .5s ${i*.08}s ease both` }}
            onClick={() => setBooking(b => ({ ...b, forfait: f.id }))}
          >
            <div className="check">✓</div>
            {f.popular && (
              <div style={{ position:"absolute", top:-1, left:24, background:"var(--ocean)", color:"#fff", padding:"3px 12px", fontFamily:"var(--mono)", fontSize:9, letterSpacing:".14em", textTransform:"uppercase" }}>
                ★ Populaire
              </div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, marginTop: f.popular ? 12 : 0 }}>
              <h3 style={{ fontFamily:"var(--serif)", fontSize:22, fontWeight:700, color:"var(--ink)" }}>{f.name}</h3>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"var(--serif)", fontSize:28, fontWeight:700, color:"var(--ocean)", lineHeight:1 }}>{f.price}€</div>
                <div style={{ fontFamily:"var(--mono)", fontSize:9.5, color:"var(--faint)", letterSpacing:".08em" }}>par personne</div>
              </div>
            </div>
            <div style={{ fontFamily:"var(--mono)", fontSize:10.5, color:"var(--ocean)", letterSpacing:".1em", marginBottom:10 }}>⏱ {f.duration}</div>
            <p style={{ fontFamily:"var(--sans)", fontSize:13.5, color:"var(--muted)", lineHeight:1.8, marginBottom:16 }}>{f.desc}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {f.includes.map(inc => (
                <div key={inc} style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <div style={{ width:16, height:16, borderRadius:"50%", background:"#d1fae5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#047857", flexShrink:0 }}>✓</div>
                  <span style={{ fontFamily:"var(--sans)", fontSize:13, color:"var(--muted)" }}>{inc}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ÉTAPE 3 : DATE & SURFERS ────────────────────────────────────────────────
function StepDate({ booking, setBooking }) {
  return (
    <div style={{ animation:"fadeUp .5s ease both" }}>
      <div style={{ marginBottom:36 }}>
        <div className="section-label">Étape 3</div>
        <h2 style={{ fontFamily:"var(--serif)", fontSize:42, fontWeight:700, letterSpacing:"-.04em", color:"var(--ink)", lineHeight:1.05 }}>
          Date &<br/><span style={{ fontStyle:"italic", fontWeight:400, color:"var(--ocean)" }}>participants</span>
        </h2>
        <p style={{ fontFamily:"var(--sans)", color:"var(--muted)", fontSize:15, lineHeight:1.8, marginTop:12 }}>
          Choisissez votre date de session et le nombre de surfeurs.
        </p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
        {/* Calendar */}
        <div>
          <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--muted)", letterSpacing:".15em", textTransform:"uppercase", marginBottom:12 }}>Date de session *</div>
          <Calendar value={booking.date} onChange={d => setBooking(b => ({ ...b, date: d }))} />
        </div>

        {/* Surfers + Niveau + Heure */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {/* Nombre de surfers */}
          <div style={{ background:"var(--white)", border:"1px solid var(--line)", padding:"24px 20px" }}>
            <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--muted)", letterSpacing:".15em", textTransform:"uppercase", marginBottom:16 }}>Nombre de surfeurs</div>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <button onClick={() => setBooking(b => ({ ...b, surfers: Math.max(1, (b.surfers||1) - 1) }))} style={{ width:40, height:40, border:"1.5px solid var(--line)", background:"transparent", cursor:"pointer", fontFamily:"var(--mono)", fontSize:20, color:"var(--ink)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.background="var(--sand2)"; e.currentTarget.style.borderColor="var(--ink)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="var(--line)"; }}
              >−</button>
              <div style={{ fontFamily:"var(--serif)", fontSize:44, fontWeight:700, color:"var(--ocean)", lineHeight:1, minWidth:60, textAlign:"center" }}>{booking.surfers || 1}</div>
              <button onClick={() => setBooking(b => ({ ...b, surfers: Math.min(8, (b.surfers||1) + 1) }))} style={{ width:40, height:40, border:"1.5px solid var(--line)", background:"transparent", cursor:"pointer", fontFamily:"var(--mono)", fontSize:20, color:"var(--ink)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.background="var(--sand2)"; e.currentTarget.style.borderColor="var(--ink)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="var(--line)"; }}
              >+</button>
              <div style={{ fontFamily:"var(--sans)", fontSize:13, color:"var(--muted)", lineHeight:1.5 }}>surfer{(booking.surfers||1)>1?"s":""}<br/><span style={{ fontSize:11, color:"var(--faint)" }}>max. 8 / session</span></div>
            </div>
          </div>

          {/* Niveau */}
          <div style={{ background:"var(--white)", border:"1px solid var(--line)", padding:"24px 20px" }}>
            <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--muted)", letterSpacing:".15em", textTransform:"uppercase", marginBottom:14 }}>Niveau général du groupe</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[["debutant","🟢 Débutant"],["intermediaire","🟡 Intermédiaire"],["avance","🟠 Avancé"],["expert","🔴 Expert"]].map(([val, label]) => (
                <button key={val} onClick={() => setBooking(b => ({ ...b, niveau: val }))} style={{
                  padding:"10px 12px", fontFamily:"var(--sans)", fontSize:13, fontWeight:500,
                  cursor:"pointer", border:"1.5px solid var(--line)", textAlign:"left",
                  background: booking.niveau===val ? "var(--ink)" : "transparent",
                  color: booking.niveau===val ? "#fff" : "var(--ink2)",
                  transition:"all .2s",
                }}>{label}</button>
              ))}
            </div>
          </div>

          {/* Heure préférée */}
          <div style={{ background:"var(--white)", border:"1px solid var(--line)", padding:"24px 20px" }}>
            <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--muted)", letterSpacing:".15em", textTransform:"uppercase", marginBottom:14 }}>Heure préférée</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["7h00","9h00","11h00","14h00","16h00"].map(h => (
                <button key={h} onClick={() => setBooking(b => ({ ...b, heure: h }))} style={{
                  padding:"8px 16px", fontFamily:"var(--mono)", fontSize:12, cursor:"pointer",
                  border:"1.5px solid var(--line)",
                  background: booking.heure===h ? "var(--ocean)" : "transparent",
                  color: booking.heure===h ? "#fff" : "var(--muted)",
                  transition:"all .2s",
                }}>{h}</button>
              ))}
            </div>
            <div style={{ fontFamily:"var(--sans)", fontSize:12, color:"var(--faint)", marginTop:10 }}>
              💡 Les sessions tôt le matin offrent les meilleures conditions sur la plupart des spots.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ÉTAPE 4 : EXTRAS ────────────────────────────────────────────────────────
function StepExtras({ booking, setBooking }) {
  const toggle = (id) => {
    setBooking(b => ({
      ...b,
      extras: b.extras.includes(id) ? b.extras.filter(e => e !== id) : [...b.extras, id]
    }));
  };
  return (
    <div style={{ animation:"fadeUp .5s ease both" }}>
      <div style={{ marginBottom:36 }}>
        <div className="section-label">Étape 4</div>
        <h2 style={{ fontFamily:"var(--serif)", fontSize:42, fontWeight:700, letterSpacing:"-.04em", color:"var(--ink)", lineHeight:1.05 }}>
          Enrichissez<br/><span style={{ fontStyle:"italic", fontWeight:400, color:"var(--ocean)" }}>votre session</span>
        </h2>
        <p style={{ fontFamily:"var(--sans)", color:"var(--muted)", fontSize:15, lineHeight:1.8, marginTop:12 }}>
          Options facultatives pour une expérience encore plus complète.
        </p>
      </div>
      <div className="extras-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:16 }}>
        {EXTRAS.map((e, i) => {
          const selected = booking.extras.includes(e.id);
          return (
            <div key={e.id} className={`option-card${selected?" selected":""}`}
              style={{ padding:"24px 22px", display:"flex", gap:18, animation:`fadeUp .5s ${i*.08}s ease both` }}
              onClick={() => toggle(e.id)}
            >
              <div className="check">✓</div>
              <div style={{ width:52, height:52, background:"var(--sand2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{e.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                  <h3 style={{ fontFamily:"var(--sans)", fontSize:16, fontWeight:700, color:"var(--ink)" }}>{e.name}</h3>
                  <div style={{ fontFamily:"var(--serif)", fontSize:18, fontWeight:700, color:"var(--ocean)", lineHeight:1 }}>+{e.price}€</div>
                </div>
                <p style={{ fontFamily:"var(--sans)", fontSize:13, color:"var(--muted)", lineHeight:1.75 }}>{e.desc}</p>
                <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--faint)", marginTop:6 }}>Par personne</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop:24, background:"var(--sand2)", padding:"18px 20px", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ fontSize:20 }}>💡</div>
        <p style={{ fontFamily:"var(--sans)", fontSize:13.5, color:"var(--muted)", lineHeight:1.7 }}>
          Ces options peuvent être ajoutées ou retirées jusqu'à 48h avant votre session sans frais.
        </p>
      </div>
    </div>
  );
}

// ─── ÉTAPE 5 : VOS INFOS ─────────────────────────────────────────────────────
function StepInfos({ booking, setBooking }) {
  const f = booking.infos || {};
  const set = (k, v) => setBooking(b => ({ ...b, infos: { ...b.infos, [k]: v } }));
  const [focused, setFocused] = useState(null);
  const inputStyle = (name) => ({
    width:"100%", padding:"13px 16px", fontFamily:"var(--sans)", fontSize:14, color:"var(--ink)",
    background:"var(--white)", outline:"none", border:`1.5px solid ${focused===name?"var(--ocean)":"var(--line)"}`,
    transition:"border-color .2s",
  });

  return (
    <div style={{ animation:"fadeUp .5s ease both" }}>
      <div style={{ marginBottom:36 }}>
        <div className="section-label">Étape 5</div>
        <h2 style={{ fontFamily:"var(--serif)", fontSize:42, fontWeight:700, letterSpacing:"-.04em", color:"var(--ink)", lineHeight:1.05 }}>
          Vos<br/><span style={{ fontStyle:"italic", fontWeight:400, color:"var(--ocean)" }}>coordonnées</span>
        </h2>
        <p style={{ fontFamily:"var(--sans)", color:"var(--muted)", fontSize:15, lineHeight:1.8, marginTop:12 }}>
          Pour confirmer votre réservation et vous envoyer toutes les infos pratiques.
        </p>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
        <div className="form-duo" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div>
            <label style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".15em", textTransform:"uppercase", color:"var(--muted)", display:"block", marginBottom:8 }}>Prénom *</label>
            <input style={inputStyle("prenom")} placeholder="Karim" value={f.prenom||""} onChange={e => set("prenom",e.target.value)} onFocus={() => setFocused("prenom")} onBlur={() => setFocused(null)} required/>
          </div>
          <div>
            <label style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".15em", textTransform:"uppercase", color:"var(--muted)", display:"block", marginBottom:8 }}>Nom *</label>
            <input style={inputStyle("nom")} placeholder="Benali" value={f.nom||""} onChange={e => set("nom",e.target.value)} onFocus={() => setFocused("nom")} onBlur={() => setFocused(null)} required/>
          </div>
        </div>
        <div className="form-duo" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div>
            <label style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".15em", textTransform:"uppercase", color:"var(--muted)", display:"block", marginBottom:8 }}>Email *</label>
            <input type="email" style={inputStyle("email")} placeholder="karim@email.com" value={f.email||""} onChange={e => set("email",e.target.value)} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} required/>
          </div>
          <div>
            <label style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".15em", textTransform:"uppercase", color:"var(--muted)", display:"block", marginBottom:8 }}>Téléphone *</label>
            <input style={inputStyle("tel")} placeholder="+212 600 000 000" value={f.tel||""} onChange={e => set("tel",e.target.value)} onFocus={() => setFocused("tel")} onBlur={() => setFocused(null)} required/>
          </div>
        </div>
        <div>
          <label style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".15em", textTransform:"uppercase", color:"var(--muted)", display:"block", marginBottom:8 }}>Pays de résidence</label>
          <select style={{ ...inputStyle("pays"), cursor:"pointer" }} value={f.pays||""} onChange={e => set("pays",e.target.value)} onFocus={() => setFocused("pays")} onBlur={() => setFocused(null)}>
            <option value="">Sélectionner votre pays</option>
            {["Maroc","France","Belgique","Suisse","Espagne","Portugal","Royaume-Uni","Allemagne","Autre"].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontFamily:"var(--mono)", fontSize:10, letterSpacing:".15em", textTransform:"uppercase", color:"var(--muted)", display:"block", marginBottom:8 }}>Informations complémentaires</label>
          <textarea style={{ ...inputStyle("notes"), minHeight:100, resize:"vertical" }} placeholder="Blessures, contraintes médicales, demandes spéciales..." value={f.notes||""} onChange={e => set("notes",e.target.value)} onFocus={() => setFocused("notes")} onBlur={() => setFocused(null)}/>
        </div>

        {/* Conditions */}
        <div style={{ background:"var(--sand2)", padding:"20px", display:"flex", gap:14, alignItems:"flex-start" }}>
          <input type="checkbox" id="cgu" checked={booking.cgu||false} onChange={e => setBooking(b => ({...b, cgu: e.target.checked}))} style={{ marginTop:2, width:16, height:16, cursor:"pointer", accentColor:"var(--ocean)" }}/>
          <label htmlFor="cgu" style={{ fontFamily:"var(--sans)", fontSize:13.5, color:"var(--muted)", lineHeight:1.7, cursor:"pointer" }}>
            J'accepte les <span style={{ color:"var(--ocean)", textDecoration:"underline" }}>conditions générales de vente</span> et la <span style={{ color:"var(--ocean)", textDecoration:"underline" }}>politique de confidentialité</span> de SurfMorocco.
          </label>
        </div>
      </div>
    </div>
  );
}

// ─── CONFIRMATION ─────────────────────────────────────────────────────────────
function StepConfirmation({ booking, onGoToCompte }) {
  const spot = SPOTS.find(s => s.id === booking.spot);
  const forfait = FORFAITS.find(f => f.id === booking.forfait);
  const extras = EXTRAS.filter(e => booking.extras.includes(e.id));
  const total = ((forfait?.price || 0) + extras.reduce((a,e) => a+e.price, 0)) * (booking.surfers || 1);
  const ref = `SM-${Math.random().toString(36).substr(2,6).toUpperCase()}`;

  return (
    <div style={{ animation:"fadeIn .6s ease both", textAlign:"center", padding:"20px 0 40px" }}>
      {/* Success icon */}
      <div style={{ width:96, height:96, borderRadius:"50%", background:"linear-gradient(135deg, #10b981, #047857)", margin:"0 auto 28px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, boxShadow:"0 12px 40px rgba(4,120,87,.3)", animation:"checkPop .5s ease both" }}>
        ✓
      </div>

      <div style={{ fontFamily:"var(--mono)", fontSize:11, color:"#047857", letterSpacing:".2em", textTransform:"uppercase", marginBottom:12 }}>Réservation confirmée</div>
      <h2 style={{ fontFamily:"var(--serif)", fontSize:52, fontWeight:700, letterSpacing:"-.045em", color:"var(--ink)", lineHeight:1, marginBottom:16 }}>
        À très bientôt<br/><span style={{ fontStyle:"italic", fontWeight:400, color:"var(--ocean)" }}>dans les vagues !</span>
      </h2>
      <p style={{ fontFamily:"var(--sans)", fontSize:16, color:"var(--muted)", lineHeight:1.8, maxWidth:480, margin:"0 auto 40px" }}>
        Un email de confirmation a été envoyé à <strong>{booking.infos?.email}</strong>. Notre équipe vous contactera sous 2h pour finaliser les détails.
      </p>

      {/* Recap card */}
      <div style={{ background:"var(--white)", border:"1px solid var(--line)", maxWidth:520, margin:"0 auto 32px", padding:"28px 32px", textAlign:"left" }}>
        {/* Ref */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, paddingBottom:20, borderBottom:"2px solid var(--ink)" }}>
          <div>
            <div style={{ fontFamily:"var(--mono)", fontSize:9.5, color:"var(--faint)", letterSpacing:".15em", textTransform:"uppercase", marginBottom:4 }}>Référence</div>
            <div style={{ fontFamily:"var(--mono)", fontSize:18, fontWeight:700, color:"var(--ocean)" }}>{ref}</div>
          </div>
          <div style={{ width:48, height:48, background:"var(--sand2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🌊</div>
        </div>

        {[
          ["📍 Spot", spot?.name],
          ["🏄 Forfait", forfait?.name],
          ["📅 Date", fmt(booking.date) + (booking.heure ? ` · ${booking.heure}` : "")],
          ["👥 Surfers", `${booking.surfers || 1} personne${(booking.surfers||1)>1?"s":""}`],
          ...(extras.length > 0 ? [["✨ Extras", extras.map(e => e.name).join(", ")]] : []),
        ].map(([label, val]) => (
          <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid var(--line2)" }}>
            <div style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--muted)" }}>{label}</div>
            <div style={{ fontFamily:"var(--sans)", fontSize:13.5, fontWeight:600, color:"var(--ink)", textAlign:"right", maxWidth:"55%" }}>{val}</div>
          </div>
        ))}

        <div style={{ display:"flex", justifyContent:"space-between", marginTop:20, paddingTop:16, borderTop:"2px solid var(--ink)" }}>
          <div style={{ fontFamily:"var(--serif)", fontSize:18, fontWeight:700, color:"var(--ink)" }}>Total à régler</div>
          <div style={{ fontFamily:"var(--serif)", fontSize:24, fontWeight:700, color:"var(--ocean)" }}>{total}€</div>
        </div>
        <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--faint)", textAlign:"right", marginTop:4 }}>Paiement sur place · Pas de prépaiement requis</div>
      </div>

      {/* What's next */}
      <div style={{ maxWidth:520, margin:"0 auto", background:"var(--sand2)", padding:"24px 28px", textAlign:"left" }}>
        <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--ocean)", letterSpacing:".15em", textTransform:"uppercase", marginBottom:16 }}>Prochaines étapes</div>
        {[
          ["📧","Vérifiez votre email","Un récapitulatif complet vous a été envoyé avec toutes les infos pratiques."],
          ["📞","Confirmez par téléphone","Notre équipe vous appellera sous 2h pour confirmer les détails et répondre à vos questions."],
          ["🗺️","Préparez-vous","Consultez notre guide de voyage sur l'espace préparation pour arriver prêt à surfer."],
        ].map(([icon, title, desc]) => (
          <div key={title} style={{ display:"flex", gap:14, marginBottom:16 }}>
            <div style={{ fontSize:20, flexShrink:0, marginTop:2 }}>{icon}</div>
            <div>
              <div style={{ fontFamily:"var(--sans)", fontSize:14, fontWeight:600, color:"var(--ink)", marginBottom:3 }}>{title}</div>
              <div style={{ fontFamily:"var(--sans)", fontSize:13, color:"var(--muted)", lineHeight:1.7 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{
  display: "flex",
  justifyContent: "center",
  gap: 12,
  marginTop: 32
}}>
  <button
    className="btn-primary"
    onClick={() => onGoToCompte()}
  >
    Mon compte →
  </button>
</div>
    </div>
  );
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
export default function PageReservation({ onBack, onReservationSuccess, onGoToCompte }) {
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState({
    spot: null, forfait: null, date: null, surfers: 1,
    niveau: null, heure: null, extras: [], infos: {}, cgu: false,
  });

  const canNext = () => {
    if (step === 0) return !!booking.spot;
    if (step === 1) return !!booking.forfait;
    if (step === 2) return !!booking.date;
    if (step === 3) return true;
    if (step === 4) return !!(booking.infos?.prenom && booking.infos?.email && booking.infos?.tel && booking.cgu);
    return false;
  };

  const next = () => {
  if (!canNext()) return;

  if (step === 4) {
    const spot = SPOTS.find(s => s.id === booking.spot);
    const forfait = FORFAITS.find(f => f.id === booking.forfait);
    const extras = EXTRAS.filter(e => booking.extras.includes(e.id));

    const total =
      ((forfait?.price || 0) +
      extras.reduce((a, e) => a + e.price, 0)) *
      (booking.surfers || 1);

    const reservation = {
      ref: `SM-${Math.random().toString(36).substr(2,6).toUpperCase()}`,
      spot: spot?.name,
      forfait: forfait?.name,
      date: booking.date,
      heure: booking.heure,
      surfers: booking.surfers,
      niveau: booking.niveau,
      extras: extras.map(e => e.name),
      total,
    };

    console.log("SENDING TO APP:", reservation);

    onReservationSuccess(reservation);
  }

  if (step < 5) {
    setStep(step + 1);
  }
};
  const prev = () => { if (step > 0) setStep(s => s - 1); };

  const renderStep = () => {
    switch (step) {
      case 0: return <StepSpot booking={booking} setBooking={setBooking} />;
      case 1: return <StepForfait booking={booking} setBooking={setBooking} />;
      case 2: return <StepDate booking={booking} setBooking={setBooking} />;
      case 3: return <StepExtras booking={booking} setBooking={setBooking} />;
      case 4: return <StepInfos booking={booking} setBooking={setBooking} />;
      case 5: return (<StepConfirmation booking={booking} onGoToCompte={onGoToCompte}/>);
      default: return null;
    }
  };

  return (
    <div style={{ fontFamily:"var(--serif)", background:"var(--sand)", color:"var(--ink)", overflowX:"hidden", minHeight:"100vh" }}>
      <style>{CSS}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:300, height:68, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 48px", background:"rgba(250,250,248,.96)", backdropFilter:"blur(16px)", borderBottom:"1px solid var(--line)" }}>
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
        <div style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--muted)", letterSpacing:".12em", textTransform:"uppercase" }}>
          {step < 5 ? `Étape ${step + 1} sur ${STEPS.length - 1}` : "✓ Confirmé"}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div className="live-dot"/>
          <span style={{ fontFamily:"var(--mono)", fontSize:10, color:"#047857", letterSpacing:".08em" }}>Taghazout · 2.4m · Excellent</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      {step === 0 && (
        <div style={{ position:"relative", height:380, overflow:"hidden", marginTop:68 }}>
          <img src="https://images.unsplash.com/photo-1476673160081-cf065607f449?w=1800&q=90" alt="Surf" style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(.45) saturate(1.1)" }}/>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 30%, #fafaf8 100%)" }}/>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", padding:"0 72px" }}>
            <div style={{ animation:"fadeUp .9s ease both" }}>
              <div style={{ fontFamily:"var(--mono)", fontSize:11, color:"#38bdf8", letterSpacing:".2em", textTransform:"uppercase", marginBottom:14 }}>— Réservation</div>
              <h1 style={{ fontFamily:"var(--serif)", fontSize:64, fontWeight:700, letterSpacing:"-.045em", lineHeight:.95, color:"#fff", marginBottom:12 }}>
                Réservez votre<br/><span style={{ fontStyle:"italic", fontWeight:400, color:"#38bdf8" }}>session</span>
              </h1>
              <p style={{ fontFamily:"var(--sans)", fontSize:17, color:"rgba(220,238,247,.7)", maxWidth:440, lineHeight:1.8 }}>
                En 5 étapes simples, planifiez la session de surf de vos rêves sur la côte atlantique marocaine.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN LAYOUT ── */}
      <div style={{ maxWidth:1300, margin:"0 auto", padding: step===0 ? "48px 72px 80px" : "100px 72px 80px" }}>

        {/* Progress bar */}
        {step < 5 && (
          <div style={{ marginBottom:36 }}>
            <ProgressBar step={step} />
          </div>
        )}

        {/* Step indicator */}
        {step < 5 && <StepIndicator step={step} />}

        {/* Content layout */}
        <div className="reservation-layout" style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:40, alignItems:"start" }}>
          {/* Left: Step content */}
          <div>
            {renderStep()}

            {/* Navigation buttons */}
            {step < 5 && (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:48, paddingTop:32, borderTop:"1px solid var(--line)" }}>
                {step > 0 ? (
                  <button className="btn-secondary" onClick={prev}>← Précédent</button>
                ) : <div/>}
                <button className="btn-primary" onClick={next} disabled={!canNext()} style={{ opacity: canNext() ? 1 : .5 }}>
                  {step === 4 ? "Confirmer ma réservation →" : "Étape suivante →"}
                </button>
              </div>
            )}
          </div>

          {/* Right: Summary */}
          <div className="sidebar-sticky" style={{ position:"sticky", top:96 }}>
            <Summary booking={booking} />
          </div>
        </div>
      </div>
    </div>
  );
}