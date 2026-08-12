import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--cream:#f5f0e8;--gold:#c9a84c;--gold-light:#e2c87a;--deep:#1a1208;--muted:#8a7f6e;--border:rgba(201,168,76,0.25)}
  .login-root{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--deep);font-family:'DM Sans',sans-serif;position:relative;overflow:hidden}
  .login-root::before{content:'';position:fixed;inset:-50%;width:200%;height:200%;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");opacity:0.4;pointer-events:none;animation:grain 0.8s steps(2) infinite;z-index:0}
  @keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-2%,-3%)}30%{transform:translate(3%,2%)}50%{transform:translate(-1%,4%)}70%{transform:translate(4%,-2%)}90%{transform:translate(-3%,1%)}}
  .glow{position:fixed;border-radius:50%;pointer-events:none;z-index:0;filter:blur(80px);opacity:0.18}
  .glow-1{width:600px;height:600px;background:radial-gradient(circle,#c9a84c,transparent 70%);top:-200px;left:-200px;animation:floatA 8s ease-in-out infinite}
  .glow-2{width:500px;height:500px;background:radial-gradient(circle,#b94a2c,transparent 70%);bottom:-150px;right:-150px;animation:floatB 10s ease-in-out infinite}
  @keyframes floatA{0%,100%{transform:translate(0,0)}50%{transform:translate(60px,40px)}}
  @keyframes floatB{0%,100%{transform:translate(0,0)}50%{transform:translate(-40px,-60px)}}
  .deco-lines{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
  .deco-line{position:absolute;background:linear-gradient(90deg,transparent,var(--gold),transparent);height:1px;opacity:0.12}
  .deco-line:nth-child(1){top:22%;width:100%;animation:slideLine 12s linear infinite}
  .deco-line:nth-child(2){top:58%;width:100%;animation:slideLine 16s linear infinite reverse}
  .deco-line:nth-child(3){top:80%;width:70%;left:15%;animation:slideLine 9s linear infinite}
  @keyframes slideLine{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
  .card{position:relative;z-index:1;width:440px;max-width:95vw;background:rgba(26,18,8,0.88);border:1px solid var(--border);border-radius:4px;padding:48px 42px 40px;backdrop-filter:blur(24px);box-shadow:0 0 0 1px rgba(201,168,76,0.08),0 32px 80px rgba(0,0,0,0.7),inset 0 1px 0 rgba(201,168,76,0.15);animation:cardIn 0.7s cubic-bezier(0.22,1,0.36,1) both}
  @keyframes cardIn{from{opacity:0;transform:translateY(32px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
  .card::before,.card::after{content:'';position:absolute;width:20px;height:20px;border-color:var(--gold);border-style:solid;opacity:0.5}
  .card::before{top:12px;left:12px;border-width:1px 0 0 1px}
  .card::after{bottom:12px;right:12px;border-width:0 1px 1px 0}
  .card-header{text-align:center;margin-bottom:24px}
  .logo-mark{display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;border:1px solid var(--gold);border-radius:50%;margin-bottom:14px;animation:rotateMark 20s linear infinite}
  .logo-mark svg{width:24px;height:24px;stroke:var(--gold);fill:none;stroke-width:1.5}
  @keyframes rotateMark{0%{box-shadow:0 0 0 0 rgba(201,168,76,0.3)}50%{box-shadow:0 0 20px 4px rgba(201,168,76,0.15)}100%{box-shadow:0 0 0 0 rgba(201,168,76,0.3)}}
  .card-title{font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:var(--cream)}
  .card-subtitle{margin-top:8px;font-size:13px;color:var(--muted);letter-spacing:0.08em;text-transform:uppercase}
  .divider{display:flex;align-items:center;gap:12px;margin:18px 0 22px}
  .divider-line{flex:1;height:1px;background:var(--border)}
  .divider-diamond{width:6px;height:6px;background:var(--gold);transform:rotate(45deg);opacity:0.6}
  .role-group{margin-bottom:20px}
  .role-label{display:block;font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold);margin-bottom:10px}
  .role-tabs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
  .role-btn{padding:11px 6px;background:rgba(255,250,240,0.04);border:1px solid rgba(201,168,76,0.18);border-radius:3px;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;transition:all 0.2s}
  .role-btn svg{fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
  .role-btn:hover{border-color:rgba(201,168,76,0.5);color:var(--gold-light);background:rgba(201,168,76,0.06)}
  .field{margin-bottom:18px}
  .field label{display:block;font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold);margin-bottom:8px}
  .input-wrap{position:relative;display:flex;align-items:center}
  .input-icon{position:absolute;left:14px;color:var(--muted);pointer-events:none;display:flex}
  .field input{width:100%;padding:13px 14px 13px 42px;background:rgba(255,250,240,0.04);border:1px solid rgba(201,168,76,0.2);border-radius:3px;color:var(--cream);font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:border-color 0.25s,background 0.25s,box-shadow 0.25s}
  .field input::placeholder{color:rgba(138,127,110,0.5)}
  .field input:focus{border-color:var(--gold);background:rgba(201,168,76,0.06);box-shadow:0 0 0 3px rgba(201,168,76,0.08)}
  .toggle-pwd{position:absolute;right:12px;background:none;border:none;cursor:pointer;color:var(--muted);padding:4px;display:flex;align-items:center;transition:color 0.2s}
  .toggle-pwd:hover{color:var(--gold)}
  .error-msg{margin-top:6px;font-size:12px;color:#e06b50;display:flex;align-items:center;gap:5px;animation:errIn 0.2s ease both}
  @keyframes errIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
  .alert{border-radius:3px;padding:12px 14px;font-size:13px;margin-bottom:18px;display:flex;align-items:flex-start;gap:10px;animation:errIn 0.3s ease both}
  .alert-error{background:rgba(185,74,44,0.12);border:1px solid rgba(185,74,44,0.3);color:#e8907a}
  .btn-login{width:100%;padding:14px;margin-top:8px;background:linear-gradient(135deg,var(--gold),#a87830);border:none;border-radius:3px;color:#1a1208;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;position:relative;overflow:hidden;transition:opacity 0.2s,transform 0.15s,box-shadow 0.2s;box-shadow:0 4px 24px rgba(201,168,76,0.2)}
  .btn-login::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.18),transparent 60%);opacity:0;transition:opacity 0.2s}
  .btn-login:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 32px rgba(201,168,76,0.35)}
  .btn-login:hover:not(:disabled)::before{opacity:1}
  .btn-login:active:not(:disabled){transform:translateY(0)}
  .btn-login:disabled{opacity:0.6;cursor:not-allowed}
  .btn-content{display:flex;align-items:center;justify-content:center;gap:10px}
  .spinner{width:16px;height:16px;border:2px solid rgba(26,18,8,0.3);border-top-color:#1a1208;border-radius:50%;animation:spin 0.7s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .card-footer{margin-top:22px;text-align:center}
  .card-footer a{color:var(--gold);text-decoration:none;font-size:13px;position:relative;padding-bottom:1px;transition:color 0.2s}
  .card-footer a::after{content:'';position:absolute;bottom:0;left:0;right:100%;height:1px;background:var(--gold);transition:right 0.25s ease}
  .card-footer a:hover::after{right:0}
  .card-footer a:hover{color:var(--gold-light)}
  .card-footer .sep{color:var(--muted);margin:0 12px;font-size:12px}
  .success-overlay{position:absolute;inset:0;background:rgba(26,18,8,0.93);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;border-radius:4px;z-index:10;animation:fadeIn 0.4s ease}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .success-icon{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;animation:popIn 0.5s cubic-bezier(0.22,1,0.36,1)}
  @keyframes popIn{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
  .success-title{font-family:'Playfair Display',serif;font-size:22px;color:var(--cream)}
  .success-role{font-size:12px;letter-spacing:0.14em;text-transform:uppercase;margin-top:2px}
  .success-redirect{font-size:12px;color:var(--muted);margin-top:4px}
`;

const ROLES = {
  student: {
    label: "Student",
    apiPath: "student",
    route: "/student/dashboard",
    color: "#6dbf6d",
    iconPath: (
      <>
        <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </>
    ),
  },
  faculty: {
    label: "Faculty",
    apiPath: "faculty",
    route: "/faculty/dashboard",
    color: "#7ab8e8",
    iconPath: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </>
    ),
  },
  admin: {
    label: "Admin",
    apiPath: "admin",
    route: "/admin/dashboard",
    color: "#e8c06d",
    iconPath: (
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    ),
  },
};

const ErrIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  useEffect(() => {
    const tag = document.createElement("style");
    tag.textContent = styles;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  const validate = () => {
    const errs = {};
    if (!role) errs.role = "Please select your login type";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Minimum 6 characters";
    return errs;
  };

  const handleSubmit = async () => {
    setApiError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const cfg = ROLES[role];

    try {
      const url = `http://localhost:8080/${cfg.apiPath}/login/${encodeURIComponent(email)}/${encodeURIComponent(password)}`;

      let res;
      try {
        res = await fetch(url, { method: "GET" });
      } catch {
        // Pure network failure — server down or CORS not configured
        setApiError("Cannot connect to server (port 8080). Is Spring Boot running?");
        setLoading(false);
        return;
      }

      // ── ROOT CAUSE FIX ──────────────────────────────────────────────
      // Your Spring Boot controller returns EXACTLY these strings:
      //   "Login successful"  → HTTP 200  → SUCCESS  ✅
      //   "not found"         → HTTP 200  → FAILURE  ❌  (user doesn't exist)
      //   "Invalid email..."  → HTTP 401  → FAILURE  ❌  (wrong password)
      //
      // Previous code only checked res.ok (HTTP 200), so "not found"
      // was treated as success. Fix: check the exact response body text.
      // ────────────────────────────────────────────────────────────────
      const body = (await res.text().catch(() => "")).trim();

      if (body === "Login successful") {
        // ✅ Only this exact string = real login success
        setSuccess(true);
        setTimeout(() => navigate(cfg.route, { state: { email, role } }), 1500);
      } else if (body === "not found") {
        setApiError(`No ${cfg.label} account found for this email.`);
      } else if (res.status === 401 || body === "Invalid email or password") {
        setApiError("Invalid email or password. Please try again.");
      } else {
        // Catch-all: show whatever the server said, or a generic message
        setApiError(body.length > 0 && body.length < 150
          ? body
          : "Login failed. Please check your credentials.");
      }

    } catch {
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };
  const cfg = ROLES[role];

  return (
    <div className="login-root">
      <div className="glow glow-1" /><div className="glow glow-2" />
      <div className="deco-lines">
        <div className="deco-line" /><div className="deco-line" /><div className="deco-line" />
      </div>

      <div className="card" style={{ position: "relative" }}>

        {success && cfg && (
          <div className="success-overlay">
            <div className="success-icon" style={{ border: `2px solid ${cfg.color}` }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
                stroke={cfg.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="success-title">Welcome back!</div>
            <div className="success-role" style={{ color: cfg.color }}>{cfg.label} Portal</div>
            <div className="success-redirect">Redirecting to dashboard…</div>
          </div>
        )}

        <div className="card-header">
          <div className="logo-mark">
            <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="card-title">Sign In</div>
          <div className="card-subtitle">Access your portal</div>
        </div>

        <div className="divider">
          <div className="divider-line" /><div className="divider-diamond" /><div className="divider-line" />
        </div>

        {apiError && (
          <div className="alert alert-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:1}}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {apiError}
          </div>
        )}

        <div className="role-group">
          <span className="role-label">Login As</span>
          <div className="role-tabs">
            {Object.entries(ROLES).map(([key, rc]) => (
              <button key={key} type="button" className="role-btn"
                style={role === key ? {
                  color: rc.color,
                  borderColor: rc.color,
                  background: `${rc.color}18`,
                  boxShadow: `0 0 14px ${rc.color}28, inset 0 1px 0 ${rc.color}30`
                } : {}}
                onClick={() => { setRole(key); setErrors(p => ({...p, role: ""})); }}>
                <svg width="20" height="20" viewBox="0 0 24 24">{rc.iconPath}</svg>
                {rc.label}
              </button>
            ))}
          </div>
          {errors.role && (
            <div className="error-msg" style={{marginTop:8}}><ErrIcon />{errors.role}</div>
          )}
        </div>

        <div className="field">
          <label htmlFor="login-email">Email Address</label>
          <div className="input-wrap">
            <span className="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <input id="login-email" type="email" placeholder="you@institution.edu"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email: ""})); }}
              onKeyDown={handleKey} autoComplete="email" aria-invalid={!!errors.email}
            />
          </div>
          {errors.email && <div className="error-msg"><ErrIcon />{errors.email}</div>}
        </div>

        <div className="field">
          <label htmlFor="login-password">Password</label>
          <div className="input-wrap">
            <span className="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input id="login-password" type={showPwd ? "text" : "password"} placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setErrors(p => ({...p, password: ""})); }}
              onKeyDown={handleKey} autoComplete="current-password" aria-invalid={!!errors.password}
            />
            <button className="toggle-pwd" type="button"
              onClick={() => setShowPwd(s => !s)}
              aria-label={showPwd ? "Hide password" : "Show password"}>
              {showPwd ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
          {errors.password && <div className="error-msg"><ErrIcon />{errors.password}</div>}
        </div>

        <button className="btn-login" type="button" onClick={handleSubmit} disabled={loading}>
          <span className="btn-content">
            {loading
              ? <><span className="spinner" />Authenticating…</>
              : <>{cfg ? `Sign In as ${cfg.label}` : "Sign In"}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
            }
          </span>
        </button>

        <div className="card-footer">
          <a href="/forgot-password">Forgot password?</a>
          <span className="sep">·</span>
          <a href="/register">Create account</a>
        </div>
      </div>
    </div>
  );
}
