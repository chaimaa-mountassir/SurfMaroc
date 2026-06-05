import { useState } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0f1923; --ink2: #2c3e50; --muted: #64748b; --faint: #94a3b8;
    --line: rgba(15,25,35,.1); --line2: rgba(15,25,35,.06);
    --sand: #fafaf8; --sand2: #f4f1ec; --sand3: #ece8e0;
    --ocean: #0369a1; --ocean2: #0ea5e9; --white: #ffffff;
    --red: #ef4444;
    --serif: 'Libre Baskerville', Georgia, serif;
    --sans: 'Outfit', system-ui, sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }
  body { font-family: var(--serif); background: var(--sand); color: var(--ink); overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--sand); }
  ::-webkit-scrollbar-thumb { background: var(--sand3); border-radius: 2px; }

  @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes ripple  { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.2);opacity:0} }
  @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
  @keyframes pop     { 0%{transform:scale(.8);opacity:0} 70%{transform:scale(1.07)} 100%{transform:scale(1);opacity:1} }
  @keyframes shake   { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }

  .live-dot { width:7px; height:7px; border-radius:50%; background:#10b981; position:relative; flex-shrink:0; }
  .live-dot::after { content:''; position:absolute; inset:-3px; border-radius:50%; border:1.5px solid #10b981; animation:ripple 1.8s ease-out infinite; }

  .nav-link {
    font-family: var(--sans); font-size: 12px; font-weight: 500;
    letter-spacing: .1em; text-transform: uppercase; color: var(--muted);
    text-decoration: none; position: relative; padding-bottom: 3px;
    transition: color .2s; background: none; border: none; cursor: pointer;
  }
  .nav-link::after { content:''; position:absolute; left:0; bottom:0; height:1px; width:0; background:var(--ocean); transition:width .3s; }
  .nav-link:hover { color:var(--ink); }
  .nav-link:hover::after { width:100%; }

  /* SIDEBAR TABS */
  .side-tab {
    display: flex; align-items: center; gap: 12px;
    padding: 13px 18px; border: none; background: none;
    font-family: var(--sans); font-size: 13.5px; font-weight: 500; color: var(--muted);
    cursor: pointer; text-align: left; width: 100%;
    border-left: 2px solid transparent; transition: all .2s;
  }
  .side-tab:hover { color: var(--ink); background: var(--sand2); }
  .side-tab.active { color: var(--ink); border-left-color: var(--ocean); background: var(--sand2); font-weight: 600; }

  /* CARDS */
  .res-card {
    background: var(--white); border: 1px solid var(--line);
    padding: 24px 28px; transition: box-shadow .2s;
    animation: fadeUp .4s ease both;
  }
  .res-card:hover { box-shadow: 0 4px 24px rgba(15,25,35,.07); }

  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 99px;
    font-family: var(--mono); font-size: 10px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase;
  }
  .badge-green  { background: #d1fae5; color: #065f46; }
  .badge-orange { background: #fef3c7; color: #92400e; }
  .badge-red    { background: #fee2e2; color: #991b1b; }
  .badge-blue   { background: #dbeafe; color: #1e40af; }

  /* INPUT */
  .mc-input {
    width: 100%; padding: 12px 14px;
    font-family: var(--sans); font-size: 14px; color: var(--ink);
    background: var(--white); border: 1.5px solid var(--line);
    outline: none; transition: border-color .2s, box-shadow .2s;
  }
  .mc-input:focus { border-color: var(--ocean); box-shadow: 0 0 0 3px rgba(3,105,161,.1); }
  .mc-input:disabled { background: var(--sand2); color: var(--muted); cursor: not-allowed; }

  /* BUTTONS */
  .btn-primary {
    font-family: var(--sans); font-size: 11px; font-weight: 700;
    letter-spacing: .14em; text-transform: uppercase;
    background: var(--ink); color: #fff; border: none;
    padding: 12px 28px; cursor: pointer;
    transition: background .2s, transform .15s;
  }
  .btn-primary:hover { background: var(--ocean); transform: translateY(-1px); }

  .btn-ghost {
    font-family: var(--sans); font-size: 11px; font-weight: 600;
    letter-spacing: .12em; text-transform: uppercase;
    background: transparent; color: var(--muted);
    border: 1.5px solid var(--sand3); padding: 11px 24px; cursor: pointer;
    transition: border-color .2s, color .2s;
  }
  .btn-ghost:hover { border-color: var(--ink); color: var(--ink); }

  .btn-danger {
    font-family: var(--sans); font-size: 11px; font-weight: 600;
    letter-spacing: .12em; text-transform: uppercase;
    background: transparent; color: var(--red);
    border: 1.5px solid rgba(239,68,68,.3); padding: 9px 18px; cursor: pointer;
    transition: all .2s;
  }
  .btn-danger:hover { background: #fee2e2; border-color: var(--red); }

  /* MODAL OVERLAY */
  .modal-bg {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(10,16,24,.55); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn .2s ease;
  }
  .modal-box {
    background: var(--white); padding: 36px 40px; max-width: 420px; width: 90%;
    animation: pop .3s cubic-bezier(.4,0,.2,1) both;
    border-top: 3px solid var(--red);
  }

  /* AVATAR */
  .avatar {
    width: 72px; height: 72px; border-radius: 50%;
    background: linear-gradient(135deg, var(--ocean), #0ea5e9);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--serif); font-size: 28px; font-weight: 700; color: #fff;
    flex-shrink: 0; box-shadow: 0 4px 20px rgba(3,105,161,.3);
  }

  /* STAT BOX */
  .stat-box {
    background: var(--white); border: 1px solid var(--line);
    padding: 20px 24px; text-align: center;
  }
  .stat-num { font-family: var(--serif); font-size: 36px; font-weight: 700; color: var(--ink); letter-spacing: -.04em; }
  .stat-lbl { font-family: var(--mono); font-size: 10px; color: var(--faint); letter-spacing: .15em; text-transform: uppercase; margin-top: 4px; }

  /* EMPTY STATE */
  .empty-state { text-align: center; padding: 64px 24px; }
  .empty-icon { font-size: 52px; margin-bottom: 16px; }
  .empty-title { font-family: var(--serif); font-size: 26px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
  .empty-sub { font-family: var(--sans); font-size: 14.5px; color: var(--muted); line-height: 1.75; }
`;

// ─── helpers ─────────────────────────────────────────────────────────────────
function fmt(d) {
  if (!d) return "–";
  return new Date(d).toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" });
}
function initials(name, email) {
  if (name) return name.slice(0,2).toUpperCase();
  return (email || "?").slice(0,2).toUpperCase();
}
function statusBadge(date) {
  if (!date) return ["À venir", "badge-blue"];
  const d = new Date(date);
  const now = new Date();
  if (d < now) return ["Passée", "badge-green"];
  const diff = (d - now) / (1000*60*60*24);
  if (diff <= 7) return ["Cette semaine", "badge-orange"];
  return ["À venir", "badge-blue"];
}

// ─── CONFIRM MODAL ────────────────────────────────────────────────────────────
function ConfirmModal({ res, onConfirm, onCancel }) {
  return (
    <div className="modal-bg" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{fontSize:36,marginBottom:16,textAlign:"center"}}>🗑️</div>
        <h3 style={{fontFamily:"var(--serif)",fontSize:22,fontWeight:700,color:"var(--ink)",marginBottom:10,textAlign:"center"}}>
          Supprimer cette réservation ?
        </h3>
        <p style={{fontFamily:"var(--sans)",fontSize:14,color:"var(--muted)",lineHeight:1.75,textAlign:"center",marginBottom:28}}>
          La réservation <strong style={{color:"var(--ink)",fontFamily:"var(--mono)"}}>{res.ref}</strong> — {res.spot} sera définitivement supprimée. Cette action est irréversible.
        </p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button className="btn-ghost" onClick={onCancel}>Annuler</button>
          <button
            style={{fontFamily:"var(--sans)",fontSize:11,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",background:"var(--red)",color:"#fff",border:"none",padding:"12px 28px",cursor:"pointer",transition:"background .2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="#dc2626"}
            onMouseLeave={e=>e.currentTarget.style.background="var(--red)"}
            onClick={onConfirm}
          >
            Oui, supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: RESERVATIONS ───────────────────────────────────────────────────────
function TabReservations({ reservations, onDelete, onNewReservation }) {
  const [toDelete, setToDelete] = useState(null);

  const handleConfirmDelete = () => {
    onDelete(toDelete.ref);
    setToDelete(null);
  };

  if (reservations.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🌊</div>
        <div className="empty-title">Aucune réservation</div>
        <div className="empty-sub" style={{marginBottom:28}}>
          Vous n'avez pas encore de session réservée.<br/>
          Commencez par choisir un spot et un forfait.
        </div>
        <button className="btn-primary" onClick={onNewReservation}>
          Réserver une session →
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div>
          <h2 style={{fontFamily:"var(--serif)",fontSize:28,fontWeight:700,color:"var(--ink)",letterSpacing:"-.03em"}}>
            Mes réservations
          </h2>
          <p style={{fontFamily:"var(--sans)",fontSize:13.5,color:"var(--muted)",marginTop:4}}>
            {reservations.length} session{reservations.length>1?"s":""} au total
          </p>
        </div>
        <button className="btn-primary" onClick={onNewReservation}>
          + Nouvelle session
        </button>
      </div>

      {/* List */}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {reservations.map((res, i) => {
          const [statusLabel, statusClass] = statusBadge(res.date);
          return (
            <div key={res.ref} className="res-card" style={{animationDelay:`${i*.06}s`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>

                {/* Left info */}
                <div style={{flex:1,minWidth:220}}>
                  {/* Ref + badge */}
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <span style={{fontFamily:"var(--mono)",fontSize:13,fontWeight:700,color:"var(--ocean)"}}>{res.ref}</span>
                    <span className={`badge ${statusClass}`}>{statusLabel}</span>
                  </div>

                  {/* Details grid */}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 20px"}}>
                    {[
                      ["📍 Spot", res.spot],
                      ["🏄 Forfait", res.forfait],
                      ["📅 Date", fmt(res.date) + (res.heure ? ` · ${res.heure}` : "")],
                      ["👥 Surfers", `${res.surfers || 1} personne${(res.surfers||1)>1?"s":""}`],
                      ...(res.extras?.length ? [["✨ Extras", res.extras.join(", ")]] : []),
                      ...(res.niveau ? [["⭐ Niveau", res.niveau]] : []),
                    ].map(([lbl, val]) => (
                      <div key={lbl}>
                        <div style={{fontFamily:"var(--mono)",fontSize:9.5,color:"var(--faint)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:2}}>{lbl}</div>
                        <div style={{fontFamily:"var(--sans)",fontSize:13.5,color:"var(--ink)",fontWeight:500}}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: total + action */}
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",justifyContent:"space-between",gap:16,minWidth:120}}>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"var(--mono)",fontSize:9.5,color:"var(--faint)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:2}}>Total</div>
                    <div style={{fontFamily:"var(--serif)",fontSize:26,fontWeight:700,color:"var(--ink)",letterSpacing:"-.03em"}}>{res.total}€</div>
                  </div>
                  <button className="btn-danger" onClick={() => setToDelete(res)}>
                    🗑 Supprimer
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm modal */}
      {toDelete && (
        <ConfirmModal
          res={toDelete}
          onConfirm={handleConfirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}

// ─── TAB: PROFIL ─────────────────────────────────────────────────────────────
function TabProfil({ user, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    prenom: user.prenom || user.name || "",
    nom: user.nom || "",
    email: user.email || "",
    tel: user.tel || "",
    ville: user.ville || "",
    niveau: user.niveau || "Intermédiaire",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdate(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
        <div>
          <h2 style={{fontFamily:"var(--serif)",fontSize:28,fontWeight:700,color:"var(--ink)",letterSpacing:"-.03em"}}>Mon profil</h2>
          <p style={{fontFamily:"var(--sans)",fontSize:13.5,color:"var(--muted)",marginTop:4}}>Vos informations personnelles</p>
        </div>
        {!editing && (
          <button className="btn-ghost" onClick={() => setEditing(true)}>✏️ Modifier</button>
        )}
      </div>

      {/* Success toast */}
      {saved && (
        <div style={{background:"#d1fae5",border:"1px solid #6ee7b7",padding:"12px 18px",marginBottom:20,fontFamily:"var(--sans)",fontSize:14,color:"#065f46",display:"flex",alignItems:"center",gap:8,animation:"slideIn .3s ease"}}>
          ✓ Profil mis à jour avec succès
        </div>
      )}

      {/* Fields */}
      <div style={{background:"var(--white)",border:"1px solid var(--line)",padding:"28px 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px 24px",marginBottom:24}}>
          {[
            ["Prénom *", "prenom", "text"],
            ["Nom", "nom", "text"],
            ["Email *", "email", "email"],
            ["Téléphone", "tel", "tel"],
            ["Ville / Pays", "ville", "text"],
          ].map(([label, key, type]) => (
            <div key={key}>
              <label style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".15em",textTransform:"uppercase",color:"var(--muted)",display:"block",marginBottom:8}}>{label}</label>
              <input
                className="mc-input"
                type={type}
                disabled={!editing}
                value={form[key]}
                onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
              />
            </div>
          ))}

          {/* Niveau surf */}
          <div>
            <label style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:".15em",textTransform:"uppercase",color:"var(--muted)",display:"block",marginBottom:8}}>Niveau surf</label>
            <select
              className="mc-input"
              disabled={!editing}
              value={form.niveau}
              onChange={e => setForm(f => ({...f, niveau: e.target.value}))}
              style={{cursor: editing ? "pointer" : "not-allowed"}}
            >
              {["Débutant", "Intermédiaire", "Avancé", "Expert"].map(n => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {editing && (
          <div style={{display:"flex",gap:10,paddingTop:20,borderTop:"1px solid var(--line)"}}>
            <button className="btn-primary" onClick={handleSave}>Enregistrer les modifications</button>
            <button className="btn-ghost" onClick={() => setEditing(false)}>Annuler</button>
          </div>
        )}
      </div>

      {/* Infos compte */}
      <div style={{marginTop:20,background:"var(--sand2)",border:"1px solid var(--line)",padding:"20px 28px"}}>
        <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--ocean)",letterSpacing:".18em",textTransform:"uppercase",marginBottom:14}}>Informations du compte</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[
            ["Membre depuis", "Juin 2026"],
            ["Statut", "Compte actif ✓"],
            ["Type", "Surfer Standard"],
          ].map(([k,v]) => (
            <div key={k} style={{display:"flex",justifyContent:"space-between",paddingBottom:8,borderBottom:"1px solid var(--line2)"}}>
              <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--muted)"}}>{k}</span>
              <span style={{fontFamily:"var(--sans)",fontSize:13.5,fontWeight:500,color:"var(--ink)"}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function Moncompte({ user, reservations, onBack, onNewReservation, onDeleteReservation, onUpdateUser }) {
  console.log("Reservations dans MonCompte :", reservations);
  const [tab, setTab] = useState("reservations");
  const [localUser, setLocalUser] = useState(user);

  const displayName = localUser.prenom || localUser.name || "Surfer";
  const totalSpent = reservations.reduce((a, r) => a + (r.total || 0), 0);
  const upcoming   = reservations.filter(r => r.date && new Date(r.date) >= new Date()).length;

  const handleUpdateUser = (data) => {
    setLocalUser(u => ({ ...u, ...data }));
    onUpdateUser && onUpdateUser(data);
  };

  const TABS = [
    { id: "reservations", icon: "📋", label: "Mes réservations" },
    { id: "profil",       icon: "👤", label: "Mon profil" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--sand)" }}>
      <style>{CSS}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(250,250,248,.95)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--line)",
        padding: "0 64px", height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={onBack}>
          <div style={{ width:36, height:36, borderRadius:9, background:"var(--ink)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🌊</div>
          <div style={{ fontFamily:"var(--sans)", fontSize:17, fontWeight:700, color:"var(--ink)" }}>
            Surf<span style={{ color:"var(--ocean)" }}>Morocco</span>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:28 }}>
          <button className="nav-link" onClick={onBack}>← Accueil</button>
          <button className="nav-link" onClick={onNewReservation}>Réserver</button>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div className="live-dot"/>
            <span style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--faint)", letterSpacing:".1em" }}>Taghazout · Excellent</span>
          </div>
        </div>
      </nav>

      {/* ── HERO BAND ── */}
      <div style={{
        background: "var(--ink)",
        padding: "40px 64px 44px",
        borderBottom: "1px solid rgba(255,255,255,.05)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:28 }}>
            <div className="avatar">{initials(displayName, localUser.email)}</div>
            <div>
              <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"rgba(255,255,255,.35)", letterSpacing:".2em", textTransform:"uppercase", marginBottom:6 }}>Mon espace</div>
              <h1 style={{ fontFamily:"var(--serif)", fontSize:36, fontWeight:700, letterSpacing:"-.04em", color:"#fff", lineHeight:1 }}>
                Bonjour, <span style={{ fontStyle:"italic", fontWeight:400, color:"#38bdf8" }}>{displayName} !</span>
              </h1>
              <div style={{ fontFamily:"var(--sans)", fontSize:13.5, color:"rgba(255,255,255,.4)", marginTop:5 }}>{localUser.email}</div>
            </div>
          </div>

          {/* Stats rapides */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12, maxWidth:520 }}>
            {[
              [reservations.length, "Réservations"],
              [upcoming, "À venir"],
              [totalSpent + "€", "Total dépensé"],
            ].map(([n, l]) => (
              <div key={l} className="stat-box" style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.08)", textAlign:"center", padding:"16px 12px" }}>
                <div style={{ fontFamily:"var(--serif)", fontSize:28, fontWeight:700, color:"#fff", letterSpacing:"-.03em" }}>{n}</div>
                <div style={{ fontFamily:"var(--mono)", fontSize:9.5, color:"rgba(255,255,255,.35)", letterSpacing:".14em", textTransform:"uppercase", marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 64px 80px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 32, alignItems: "start" }}>

        {/* SIDEBAR */}
        <div style={{ background:"var(--white)", border:"1px solid var(--line)", padding:"8px 0", position:"sticky", top:88 }}>
          {TABS.map(t => (
            <button key={t.id} className={`side-tab${tab===t.id?" active":""}`} onClick={() => setTab(t.id)}>
              <span style={{ fontSize:16 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}

          <div style={{ height:1, background:"var(--line)", margin:"8px 0" }}/>

          <button
            className="side-tab"
            style={{ color:"var(--red)" }}
            onClick={onBack}
          >
            <span style={{ fontSize:16 }}>🚪</span>
            Se déconnecter
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div key={tab} style={{ animation:"slideIn .3s ease" }}>
          {tab === "reservations" && (
            <TabReservations
              reservations={reservations}
              onDelete={onDeleteReservation}
              onNewReservation={onNewReservation}
            />
          )}
          {tab === "profil" && (
            <TabProfil user={localUser} onUpdate={handleUpdateUser} />
          )}
        </div>
      </div>
    </div>
  );
}