import { useState } from "react";

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
  body { font-family: var(--serif); background: var(--sand); color: var(--ink); overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--sand); }
  ::-webkit-scrollbar-thumb { background: var(--sand3); border-radius: 2px; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes ripple   { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.2);opacity:0} }
  @keyframes floatBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes slideTab { from{transform:translateX(var(--from))} to{transform:translateX(0)} }
  @keyframes panBg    { 0%{background-position:0% 40%} 100%{background-position:100% 60%} }
  @keyframes waveIn   { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
  @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.4} }

  .live-dot { width:7px; height:7px; border-radius:50%; background:#10b981; position:relative; flex-shrink:0; }
  .live-dot::after { content:''; position:absolute; inset:-3px; border-radius:50%; border:1.5px solid #10b981; animation:ripple 1.8s ease-out infinite; }

  .auth-input {
    width: 100%; padding: 14px 16px 14px 44px;
    font-family: var(--sans); font-size: 14px; color: var(--ink);
    background: var(--white); border: 1.5px solid var(--line);
    outline: none; transition: border-color .2s, box-shadow .2s;
    -webkit-appearance: none;
  }
  .auth-input:focus { border-color: var(--ocean); box-shadow: 0 0 0 3px rgba(3,105,161,.1); }
  .auth-input::placeholder { color: var(--faint); }
  .auth-input.error { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,.1); }

  .auth-input-wrap { position: relative; }
  .auth-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: var(--faint); font-size: 15px; pointer-events: none;
    transition: color .2s;
  }
  .auth-input-wrap:focus-within .auth-input-icon { color: var(--ocean); }

  .auth-input-eye {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    color: var(--faint); cursor: pointer; background: none; border: none;
    padding: 4px; font-size: 15px; transition: color .2s; line-height: 1;
  }
  .auth-input-eye:hover { color: var(--ink); }

  .btn-auth {
    width: 100%; padding: 15px 24px;
    font-family: var(--sans); font-size: 12px; font-weight: 700;
    letter-spacing: .14em; text-transform: uppercase;
    background: var(--ink); color: #fff; border: none; cursor: pointer;
    transition: background .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 2px 12px rgba(15,25,35,.2);
    position: relative; overflow: hidden;
  }
  .btn-auth::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent);
    transform: translateX(-100%); transition: transform .4s;
  }
  .btn-auth:hover { background: var(--ocean); transform: translateY(-1px); box-shadow: 0 6px 24px rgba(3,105,161,.35); }
  .btn-auth:hover::after { transform: translateX(100%); }
  .btn-auth:active { transform: translateY(0); }
  .btn-auth:disabled { background: var(--faint); cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-auth:disabled::after { display: none; }

  .tab-btn {
    flex: 1; padding: 13px 16px;
    font-family: var(--mono); font-size: 11px; font-weight: 500;
    letter-spacing: .12em; text-transform: uppercase;
    background: none; border: none; cursor: pointer;
    color: var(--faint); transition: color .25s;
    position: relative;
  }
  .tab-btn.active { color: var(--ink); }
  .tab-btn.active::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0;
    height: 2px; background: var(--ocean);
  }
  .tab-btn:not(.active):hover { color: var(--muted); }

  .strength-bar { height: 3px; border-radius: 2px; flex: 1; transition: background .3s; }

  .social-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 11px 16px; border: 1.5px solid var(--line); background: var(--white);
    font-family: var(--sans); font-size: 13px; font-weight: 500; color: var(--ink2);
    cursor: pointer; transition: border-color .2s, background .2s, transform .15s;
  }
  .social-btn:hover { border-color: var(--ink); background: var(--sand2); transform: translateY(-1px); }

  .auth-panel { animation: fadeUp .55s cubic-bezier(.4,0,.2,1) both; }

  .bg-panel {
    background-image: url('https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1400&q=90');
    background-size: cover; background-position: center 35%;
  }

  @media (max-width: 900px) {
    .auth-split-left { display: none !important; }
    .auth-split-right { min-height: 100vh; }
  }
`;

// ─── PASSWORD STRENGTH ────────────────────────────────────────────────────────
function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: "Très faible", color: "#ef4444" },
    { label: "Faible",      color: "#f97316" },
    { label: "Moyen",       color: "#eab308" },
    { label: "Fort",        color: "#22c55e" },
    { label: "Très fort",   color: "#10b981" },
  ];
  return { score: s, ...map[s] };
}

// ─── LEFT PANEL (visual) ─────────────────────────────────────────────────────
function LeftPanel() {
  return (
    <div className="auth-split-left" style={{
      position: "relative", overflow: "hidden", flex: "0 0 48%",
    }}>
      {/* BG image */}
      <div className="bg-panel" style={{ position: "absolute", inset: 0, filter: "brightness(.48) saturate(1.15)" }}/>
      {/* gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(3,105,161,.55) 0%, rgba(15,25,35,.75) 100%)" }}/>

      {/* Decorative ring */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 520, height: 520, borderRadius: "50%",
        border: "1px solid rgba(255,255,255,.07)",
        pointerEvents: "none",
      }}/>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 380, height: 380, borderRadius: "50%",
        border: "1px solid rgba(255,255,255,.05)",
        pointerEvents: "none",
      }}/>

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2, padding: "60px 52px",
        display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ width: 40, height: 40, borderRadius: 9, background: "rgba(255,255,255,.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🌊</div>
          <div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 18, fontWeight: 700, color: "#fff" }}>
              Surf<span style={{ color: "#38bdf8" }}>Morocco</span>
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "rgba(255,255,255,.4)", letterSpacing: ".16em", textTransform: "uppercase" }}>Est. 2019</div>
          </div>
        </div>

        {/* Main text */}
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#38bdf8", letterSpacing: ".22em", textTransform: "uppercase", marginBottom: 20 }}>— Votre espace personnel</div>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 52, fontWeight: 700, letterSpacing: "-.04em", lineHeight: .97, color: "#fff", marginBottom: 24 }}>
            Chaque vague<br/>
            <span style={{ fontStyle: "italic", fontWeight: 400, color: "#38bdf8" }}>commence</span><br/>
            par un profil.
          </h2>
          <p style={{ fontFamily: "var(--sans)", fontSize: 15.5, color: "rgba(220,240,250,.65)", lineHeight: 1.85, maxWidth: 360 }}>
            Gérez vos réservations, suivez vos sessions passées, et accédez aux meilleures conditions des spots marocains.
          </p>
        </div>

        {/* Features list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            ["📋", "Historique de toutes vos réservations"],
            ["🌊", "Alertes conditions personnalisées"],
            ["⚡", "Réservation prioritaire en haute saison"],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,.1)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{icon}</div>
              <span style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: "rgba(220,240,250,.7)", lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Live badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,.1)" }}>
          <div className="live-dot"/>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,.5)", letterSpacing: ".1em" }}>
            Taghazout · 2.4m · Conditions Excellentes
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN FORM ───────────────────────────────────────────────────────────────
function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email)                       e.email    = "Email requis";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email invalide";
    if (!form.password)                    e.password = "Mot de passe requis";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onSuccess({ email: form.email, name: form.email.split("@")[0] });
  };

  return (
    <div className="auth-panel" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Social */}
      <div style={{ display: "flex", gap: 10 }}>
        <button className="social-btn">
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </button>
        <button className="social-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook
        </button>
      </div>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }}/>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--faint)", letterSpacing: ".12em", textTransform: "uppercase" }}>ou par email</span>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }}/>
      </div>

      {/* Email */}
      <div>
        <label style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 8 }}>Email</label>
        <div className="auth-input-wrap">
          <span className="auth-input-icon">✉</span>
          <input
            className={`auth-input${errors.email ? " error" : ""}`}
            type="email" placeholder="karim@email.com"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && submit()}
          />
        </div>
        {errors.email && <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#ef4444", marginTop: 6 }}>⚠ {errors.email}</div>}
      </div>

      {/* Password */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <label style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--muted)" }}>Mot de passe</label>
          <button style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ocean)", background: "none", border: "none", cursor: "pointer", letterSpacing: ".08em" }}>
            Mot de passe oublié ?
          </button>
        </div>
        <div className="auth-input-wrap">
          <span className="auth-input-icon">🔒</span>
          <input
            className={`auth-input${errors.password ? " error" : ""}`}
            type={showPw ? "text" : "password"} placeholder="••••••••"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && submit()}
          />
          <button className="auth-input-eye" onClick={() => setShowPw(v => !v)} type="button">
            {showPw ? "🙈" : "👁"}
          </button>
        </div>
        {errors.password && <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#ef4444", marginTop: 6 }}>⚠ {errors.password}</div>}
      </div>

      {/* Remember */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input type="checkbox" id="remember" style={{ width: 15, height: 15, accentColor: "var(--ocean)", cursor: "pointer" }}/>
        <label htmlFor="remember" style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: "var(--muted)", cursor: "pointer" }}>Se souvenir de moi</label>
      </div>

      {/* Submit */}
      <button className="btn-auth" onClick={submit} disabled={loading}>
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spinSlow .7s linear infinite" }}/>
            Connexion en cours…
          </span>
        ) : "Se connecter →"}
      </button>

      {/* Trust */}
      <div style={{ display: "flex", justifyContent: "center", gap: 20, paddingTop: 4 }}>
        {["🔐 Connexion sécurisée", "✓ SSL"].map(t => (
          <span key={t} style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--faint)", letterSpacing: ".08em" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─── REGISTER FORM ────────────────────────────────────────────────────────────
function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const strength = getStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.prenom)  e.prenom  = "Prénom requis";
    if (!form.nom)     e.nom     = "Nom requis";
    if (!form.email)   e.email   = "Email requis";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email invalide";
    if (!form.password) e.password = "Mot de passe requis";
    else if (form.password.length < 8) e.password = "8 caractères minimum";
    if (form.password !== form.confirm) e.confirm = "Les mots de passe ne correspondent pas";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    onSuccess({ email: form.email, name: form.prenom });
  };

  const fieldProps = (name, type = "text", placeholder = "") => ({
    className: `auth-input${errors[name] ? " error" : ""}`,
    type,
    placeholder,
    value: form[name],
    onChange: e => setForm(f => ({ ...f, [name]: e.target.value })),
    onKeyDown: e => e.key === "Enter" && submit(),
  });

  return (
    <div className="auth-panel" style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Name row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 8 }}>Prénom *</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">👤</span>
            <input {...fieldProps("prenom", "text", "Karim")} />
          </div>
          {errors.prenom && <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#ef4444", marginTop: 5 }}>⚠ {errors.prenom}</div>}
        </div>
        <div>
          <label style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 8 }}>Nom *</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">👤</span>
            <input {...fieldProps("nom", "text", "Benali")} />
          </div>
          {errors.nom && <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#ef4444", marginTop: 5 }}>⚠ {errors.nom}</div>}
        </div>
      </div>

      {/* Email */}
      <div>
        <label style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 8 }}>Email *</label>
        <div className="auth-input-wrap">
          <span className="auth-input-icon">✉</span>
          <input {...fieldProps("email", "email", "karim@email.com")} />
        </div>
        {errors.email && <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#ef4444", marginTop: 5 }}>⚠ {errors.email}</div>}
      </div>

      {/* Password */}
      <div>
        <label style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 8 }}>Mot de passe *</label>
        <div className="auth-input-wrap">
          <span className="auth-input-icon">🔒</span>
          <input {...fieldProps("password", showPw ? "text" : "password", "8 caractères minimum")} />
          <button className="auth-input-eye" onClick={() => setShowPw(v => !v)} type="button">{showPw ? "🙈" : "👁"}</button>
        </div>
        {errors.password && <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#ef4444", marginTop: 5 }}>⚠ {errors.password}</div>}

        {/* Strength meter */}
        {form.password && (
          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
              {[1,2,3,4].map(i => (
                <div key={i} className="strength-bar" style={{ background: i <= strength.score ? strength.color : "var(--sand3)" }}/>
              ))}
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: strength.color, letterSpacing: ".1em" }}>
              {strength.label}
            </div>
          </div>
        )}
      </div>

      {/* Confirm */}
      <div>
        <label style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--muted)", display: "block", marginBottom: 8 }}>Confirmer le mot de passe *</label>
        <div className="auth-input-wrap">
          <span className="auth-input-icon">🔒</span>
          <input {...fieldProps("confirm", "password", "••••••••")} />
          {form.confirm && form.confirm === form.password && (
            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#10b981", fontSize: 16 }}>✓</span>
          )}
        </div>
        {errors.confirm && <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "#ef4444", marginTop: 5 }}>⚠ {errors.confirm}</div>}
      </div>

      {/* CGU */}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "var(--sand2)", padding: "14px 16px" }}>
        <input type="checkbox" id="cgu-reg"
          style={{ width: 15, height: 15, accentColor: "var(--ocean)", cursor: "pointer", marginTop: 2, flexShrink: 0 }}
          checked={form.cgu || false}
          onChange={e => setForm(f => ({ ...f, cgu: e.target.checked }))}
        />
        <label htmlFor="cgu-reg" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--muted)", lineHeight: 1.65, cursor: "pointer" }}>
          J'accepte les <span style={{ color: "var(--ocean)", textDecoration: "underline" }}>CGV</span> et la <span style={{ color: "var(--ocean)", textDecoration: "underline" }}>politique de confidentialité</span> de SurfMorocco.
        </label>
      </div>

      {/* Submit */}
      <button className="btn-auth" onClick={submit} disabled={loading || !form.cgu}>
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spinSlow .7s linear infinite" }}/>
            Création du compte…
          </span>
        ) : "Créer mon compte →"}
      </button>

      <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
        {["🔐 Données chiffrées", "✓ Aucune CB requise"].map(t => (
          <span key={t} style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--faint)", letterSpacing: ".08em" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─── SUCCESS SCREEN ───────────────────────────────────────────────────────────
function SuccessScreen({ user, mode, onContinue }) {
  return (
    <div style={{ textAlign: "center", animation: "fadeUp .6s ease both", padding: "20px 0" }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "linear-gradient(135deg, #10b981, #047857)",
        margin: "0 auto 24px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 36, boxShadow: "0 12px 32px rgba(4,120,87,.3)",
      }}>🌊</div>

      <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#047857", letterSpacing: ".2em", textTransform: "uppercase", marginBottom: 12 }}>
        {mode === "login" ? "Connexion réussie" : "Compte créé"}
      </div>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 38, fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", lineHeight: 1.05, marginBottom: 12 }}>
        Bienvenue{mode === "register" ? " à bord" : " de retour"},{" "}
        <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--ocean)" }}>{user.name} !</span>
      </h2>
      <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: "var(--muted)", lineHeight: 1.8, marginBottom: 36, maxWidth: 360, margin: "0 auto 36px" }}>
        {mode === "login"
          ? "Vous êtes connecté à votre espace SurfMorocco. Prêt à réserver votre prochaine session ?"
          : "Votre compte est actif. Complétez votre profil et réservez votre première session."}
      </p>

      <button className="btn-auth" style={{ maxWidth: 320, margin: "0 auto" }} onClick={onContinue}>
        Mon compte →
      </button>

      <div style={{ marginTop: 20, fontFamily: "var(--mono)", fontSize: 11, color: "var(--faint)", letterSpacing: ".1em" }}>
        Connecté en tant que {user.email}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Auth({ onAuthSuccess, onBack }) {
  const [tab, setTab] = useState("login");   // "login" | "register"
  const [user, setUser] = useState(null);

  const handleSuccess = (u) => {
    setUser({ ...u, mode: tab });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--serif)", background: "var(--sand)" }}>
      <style>{CSS}</style>

      {/* ── LEFT — visual panel ── */}
      <LeftPanel />

      {/* ── RIGHT — form panel ── */}
      <div className="auth-split-right" style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "60px 52px",
        background: "var(--sand)", overflowY: "auto",
      }}>
        {/* Back button */}
        <button
          onClick={onBack}
          style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 40, padding: 0, transition: "color .2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--ink)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
        >
          ← Retour au site
        </button>

        <div style={{ maxWidth: 440, width: "100%", margin: "0 auto" }}>

          {user ? (
            <SuccessScreen user={user} mode={user.mode} onContinue={() => onAuthSuccess(user)} />
          ) : (
            <>
              {/* Header */}
              <div style={{ marginBottom: 36 }}>
                <h1 style={{ fontFamily: "var(--serif)", fontSize: 40, fontWeight: 700, letterSpacing: "-.04em", color: "var(--ink)", lineHeight: 1.05, marginBottom: 10 }}>
                  {tab === "login" ? (
                    <>Bon retour<br/><span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--ocean)" }}>dans les vagues.</span></>
                  ) : (
                    <>Rejoignez<br/><span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--ocean)" }}>SurfMorocco.</span></>
                  )}
                </h1>
                <p style={{ fontFamily: "var(--sans)", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.75 }}>
                  {tab === "login"
                    ? "Connectez-vous pour accéder à votre espace de réservation."
                    : "Créez votre compte gratuit et réservez en quelques minutes."}
                </p>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1.5px solid var(--line)", marginBottom: 28 }}>
                <button className={`tab-btn${tab === "login" ? " active" : ""}`} onClick={() => setTab("login")}>Connexion</button>
                <button className={`tab-btn${tab === "register" ? " active" : ""}`} onClick={() => setTab("register")}>Créer un compte</button>
              </div>

              {/* Form */}
              <div key={tab}>
                {tab === "login"
                  ? <LoginForm onSuccess={handleSuccess} />
                  : <RegisterForm onSuccess={handleSuccess} />
                }
              </div>

              {/* Toggle */}
              <div style={{ textAlign: "center", marginTop: 28, fontFamily: "var(--sans)", fontSize: 13.5, color: "var(--muted)" }}>
                {tab === "login" ? (
                  <>Pas encore de compte ?{" "}
                    <button onClick={() => setTab("register")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 13.5, color: "var(--ocean)", fontWeight: 600, padding: 0 }}>
                      Créer un compte
                    </button>
                  </>
                ) : (
                  <>Déjà un compte ?{" "}
                    <button onClick={() => setTab("login")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 13.5, color: "var(--ocean)", fontWeight: 600, padding: 0 }}>
                      Se connecter
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}