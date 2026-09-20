// src/App.jsx
import React, { useState, useEffect } from "react";
import "./App.css";

/* =========================
   Helpers and small chart components
   ========================= */

function smoothArray(arr, windowSize = 3) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    let start = Math.max(0, i - Math.floor(windowSize / 2));
    let end = Math.min(arr.length - 1, i + Math.floor(windowSize / 2));
    let sum = 0;
    let count = 0;
    for (let j = start; j <= end; j++) {
      sum += arr[j];
      count++;
    }
    out.push(sum / count);
  }
  return out;
}

function LineChart({ data = [], width = 720, height = 140 }) {
  const padding = 18;
  if (!data || data.length === 0) return null;

  const max = Math.max(...data) * 1.05;
  const min = Math.min(...data) * 0.95;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = padding + ((max - v) / (max - min || 1)) * (height - padding * 2);
    return [x, y];
  });

  let pathD = "";
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i];
    if (i === 0) pathD += `M ${x} ${y}`;
    else {
      const [px, py] = points[i - 1];
      const cx = (px + x) / 2;
      const cy = (py + y) / 2;
      pathD += ` Q ${px} ${py} ${cx} ${cy}`;
      if (i === points.length - 1) pathD += ` T ${x} ${y}`;
    }
  }

  const areaD =
    `M ${points[0][0]} ${height - padding} ` +
    points.map((p) => `L ${p[0]} ${p[1]}`).join(" ") +
    ` L ${points[points.length - 1][0]} ${height - padding} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} aria-hidden>
      <defs>
        <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#8FC7D4" stopOpacity="0.22" />
          <stop offset="1" stopColor="#8FC7D4" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      <path d={areaD} fill="url(#areaGrad)" stroke="none" />
      <path d={pathD} stroke="#2C5E62" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === points.length - 1 ? 4.5 : 2.5} fill={i === points.length - 1 ? "#E89D52" : "#2C5E62"} />
      ))}

      <text x={padding} y={height - 2} fontSize="10" fill="#58717A">-30d</text>
      <text x={width / 2 - 14} y={height - 2} fontSize="10" fill="#58717A">-15d</text>
      <text x={width - padding - 34} y={height - 2} fontSize="10" fill="#58717A">Today</text>
    </svg>
  );
}

/* =========================
   Welfare Officer Dashboard (inline)
   ========================= */

function WelfareOfficerDashboardInline({ sampleData }) {
  const personnelTotal = sampleData?.total || 248;
  const low = sampleData?.low || 181;
  const moderate = sampleData?.moderate || 49;
  const elevated = sampleData?.elevated || 18;

  const trend = sampleData?.trend || (() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      const base = 30 + Math.sin(i / 3) * 4 + i * 0.6;
      arr.push(Math.round(base * 10) / 10);
    }
    return arr;
  })();

  const priorityList = sampleData?.priority || [
    { id: "P1042", risk: "Moderate", reason: "Deployment duration" },
    { id: "P1087", risk: "Elevated", reason: "Night-duty frequency" },
    { id: "P1121", risk: "Elevated", reason: "Workload variation" },
    { id: "P1154", risk: "Moderate", reason: "Leave gap" },
  ];

  const explainable = sampleData?.factors || [
    { name: "Prolonged deployment", impact: "+18%" },
    { name: "Night-duty frequency", impact: "+14%" },
    { name: "Workload variation", impact: "+12%" },
  ];

  return (
    <div className="dashboard" style={{ paddingTop: 24 }}>
      <div className="dashboard-heading" style={{ alignItems: "flex-start", gap: 12 }}>
        <div>
          <h1>Welfare Intelligence Dashboard</h1>
          <p style={{ marginTop: 6, color: "var(--muted)" }}>
            Overview for Welfare Officers — monitor trends, prioritize human review, and act confidentially.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div className="status-badge" style={{ padding: "8px 12px" }}>
            <span /> Role: Welfare Officer
          </div>
        </div>
      </div>

      <div className="stats-grid" style={{ marginTop: 18 }}>
        <div className="stat-card">
          <span>Total Personnel</span>
          <strong>{personnelTotal}</strong>
          <small>Monitored profiles</small>
        </div>

        <div className="stat-card">
          <span>Low Risk</span>
          <strong>{low}</strong>
          <small>{Math.round((low / personnelTotal) * 100)}% of personnel</small>
        </div>

        <div className="stat-card">
          <span>Moderate Risk</span>
          <strong>{moderate}</strong>
          <small>Attention recommended</small>
        </div>

        <div className="stat-card high-risk">
          <span>Elevated Risk</span>
          <strong>{elevated}</strong>
          <small>Priority attention</small>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: 22 }}>
        <div className="dashboard-card" style={{ padding: 18 }}>
          <div className="card-header">
            <div>
              <small>RISK TREND</small>
              <h2>Risk Trend (Last 30 days)</h2>
            </div>
            <div className="card-label">Overview</div>
          </div>

          <div style={{ marginTop: 8 }}>
            <LineChart data={trend} width={560} height={140} />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 14, alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Risk Distribution (Current)</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div className="bar-info">
                    <div>Low</div>
                    <div><strong>{Math.round((low / personnelTotal) * 100)}%</strong></div>
                  </div>
                  <div className="bar"><div className="bar-fill low" style={{ width: `${Math.round((low / personnelTotal) * 100)}%` }} /></div>
                </div>

                <div style={{ flex: 1 }}>
                  <div className="bar-info">
                    <div>Moderate</div>
                    <div><strong>{Math.round((moderate / personnelTotal) * 100)}%</strong></div>
                  </div>
                  <div className="bar"><div className="bar-fill moderate" style={{ width: `${Math.round((moderate / personnelTotal) * 100)}%` }} /></div>
                </div>

                <div style={{ flex: 1 }}>
                  <div className="bar-info">
                    <div>Elevated</div>
                    <div><strong>{Math.round((elevated / personnelTotal) * 100)}%</strong></div>
                  </div>
                  <div className="bar"><div className="bar-fill elevated" style={{ width: `${Math.round((elevated / personnelTotal) * 100)}%` }} /></div>
                </div>
              </div>
            </div>

            <div style={{ width: 160 }}>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Quick actions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                <button className="primary-button">Schedule Check-in</button>
                <button className="secondary-button">Review Support Options</button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="dashboard-card" style={{ padding: 18 }}>
            <div className="card-header">
              <div>
                <small>PRIORITY ATTENTION</small>
                <h2>Human Review</h2>
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              {priorityList.map((p) => (
                <div key={p.id} className="person-row" style={{ padding: "10px 0" }}>
                  <div className="person-id">{p.id}</div>
                  <div style={{ color: "var(--muted)" }}>{p.reason}</div>
                  <div className={`risk ${p.risk.toLowerCase() === "elevated" ? "elevated" : "moderate"}`}>{p.risk}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card ai-card" style={{ padding: 18 }}>
            <div className="card-header">
              <div>
                <small>WHY IS RISK CHANGING</small>
                <h2>Explainable AI</h2>
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              {explainable.map((f, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(44,94,98,0.08)" }}>
                  <div style={{ color: "var(--muted)" }}>{f.name}</div>
                  <div style={{ fontWeight: 800, color: "var(--blue)" }}>{f.impact}</div>
                </div>
              ))}

              <div style={{ marginTop: 12 }}>
                <h3 style={{ margin: "8px 0" }}>Recommended Next Step</h3>
                <p style={{ color: "var(--muted)", marginTop: 6 }}>
                  Human-led welfare intervention. Prioritize elevated cases for confidential outreach and schedule follow-ups.
                </p>

                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button className="primary-button">Schedule Check-in</button>
                  <button className="secondary-button">Review Support Options</button>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card" style={{ padding: 14 }}>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              <strong>Privacy note</strong>
              <p style={{ marginTop: 8 }}>
                Data is anonymized and access is role-based. AI predictions are advisory and do not replace professional assessment or make punitive decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Login / Signup modal (dashboard-only)
   ========================= */

function LoginSignup({ onClose, onLogin }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const roles = [
    {
      id: "personnel",
      title: "Personnel",
      description: "Access your personal welfare and stress monitoring dashboard",
      icon: "👤",
    },
    {
      id: "welfare",
      title: "Welfare Officer",
      description: "Monitor personnel welfare and access risk intelligence",
      icon: "🛡️",
    },
    {
      id: "admin",
      title: "Administrator",
      description: "Manage the platform and access administrative controls",
      icon: "⚙️",
    },
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please enter your email and password.");
      return;
    }

    if (mode === "signup" && !form.name) {
      alert("Please enter your name.");
      return;
    }

    onLogin({
      name: form.name || form.email.split("@")[0],
      email: form.email,
      role: selectedRole,
    });

    onClose();
  };

  return (
    <div className="auth-page">
      <button className="auth-back-button" onClick={onClose}>
        ← Back to Dashboard
      </button>

      <div className="auth-container">
        <div className="auth-header">
          <img
            src="/ManRaksha_logo.png"
            alt="ManRaksha logo"
            className="auth-logo-image"
           />
          <h1>ManRaksha</h1>
          <p>Personnel Welfare & Risk Intelligence</p>
        </div>

        {!selectedRole ? (
          <>
            <div className="auth-title">
              <h2>Welcome Back</h2>
              <p>Select your account type to continue</p>
            </div>

            <div className="role-selection">
              {roles.map((role) => (
                <button
                  key={role.id}
                  className="auth-role-card"
                  onClick={() => setSelectedRole(role.id)}
                >
                  <span className="auth-role-icon">{role.icon}</span>

                  <div>
                    <h3>{role.title}</h3>
                    <p>{role.description}</p>
                  </div>

                  <span className="role-arrow">→</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              className="change-role-button"
              onClick={() => setSelectedRole(null)}
            >
              ← Change account type
            </button>

            <div className="auth-title">
              <h2>
                {mode === "login" ? "Login" : "Create Account"}
              </h2>
              <p>
                {roles.find((role) => role.id === selectedRole)?.title}
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className="auth-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="auth-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="auth-field">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="auth-submit-button">
                {mode === "login" ? "Login" : "Create Account"}
              </button>
            </form>

            <div className="auth-switch">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button onClick={() => setMode("signup")}>
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button onClick={() => setMode("login")}>
                    Login
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* =========================
   Main App
   ========================= */

export default function App() {
  const [showDashboard, setShowDashboard] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  
  // UI state: which dashboard tab to show
  // "overview" = general preview, "enter" = Enter Platform cards, "welfare" = welfare dashboard
  const [dashboardTab, setDashboardTab] = useState("overview");
  // When user clicks a role card inside Enter Platform, store selection
  const [platformSelection, setPlatformSelection] = useState(null);

  // AI prediction state
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState("");

  async function getPrediction(personnelData) {
    setPredictionLoading(true);
    setPredictionError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(personnelData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail
            ? JSON.stringify(errorData.detail)
            : "Prediction request failed"
        );
      }

      const result = await response.json();
      setPredictionResult(result);
      return result;
    } catch (error) {
      console.error("Prediction error:", error);
      setPredictionError(
        "Unable to connect to the ManRaksha AI prediction service."
      );
      return null;
    } finally {
      setPredictionLoading(false);
    }
  }

  // realistic 30-day projection (deterministic)
  const raw = (() => {
    const arr = [];
    const seed = 12345;
    let rnd = seed;
    function rand() {
      rnd = (rnd * 9301 + 49297) % 233280;
      return rnd / 233280;
    }
    for (let i = 0; i < 30; i++) {
      const weekly = Math.sin((i / 7) * Math.PI * 2) * 3;
      const trend = i * 0.45;
      const noise = (rand() - 0.5) * 4;
      const value = 45 + weekly + trend + noise;
      arr.push(Math.round(value * 10) / 10);
    }
    return arr;
  })();

  const projection = smoothArray(raw, 5).map((v) => Math.round(v * 10) / 10);

  const topFactors = [
    { name: "Prolonged deployment", impact: "+18%" },
    { name: "Sleep disruption", impact: "+12%" },
    { name: "Reduced social interaction", impact: "+9%" },
  ];

  // Demo priority/explainable lists used by WelfareOfficerDashboardInline
  window.priorityList = window.priorityList || [
    { id: "P1042", risk: "Moderate", reason: "Deployment duration" },
    { id: "P1087", risk: "Elevated", reason: "Night-duty frequency" },
    { id: "P1121", risk: "Elevated", reason: "Workload variation" },
    { id: "P1154", risk: "Moderate", reason: "Leave gap" },
  ];
  window.explainable = window.explainable || [
    { name: "Prolonged deployment", impact: "+18%" },
    { name: "Night-duty frequency", impact: "+14%" },
    { name: "Workload variation", impact: "+12%" },
  ];

  
  

  function handleLogin(user) {
    setAuthUser(user);
  }

  function handleLogout() {
    setAuthUser(null);
    // return to overview on logout
    setDashboardTab("overview");
    setPlatformSelection(null);
  }

  /* ---------- Dashboard view (Overview + Enter Platform + Welfare) ---------- */
  if (showDashboard) {
    return (
      <div className="app">
        <div className="dashboard-screen">
          <nav className="dashboard-nav">
            <div className="logo">
              <img src="/ManRaksha_logo.png" alt="ManRaksha logo" />
              <span>ManRaksha</span>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div className="dashboard-title">Risk Intelligence</div>

              <a
                className="secondary-button"
                href="https://manraksha-app.vercel.app/"
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none", display: "inline-block" }}
              >
                Explore Platform
              </a>

              {!authUser ? (
                 <button
    className="primary-button"
    onClick={() => {
      setDashboardTab("overview");
      setPlatformSelection(null);
    }}
  >
    Login / Sign up
  </button>
              ) : (
                <>
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>{authUser.name} ({authUser.role})</div>
                  <button className="secondary-button" onClick={handleLogout}>Logout</button>
                </>
              )}

              <button
                className="secondary-button"
                onClick={() => setShowDashboard(false)}
                aria-label="Back to landing"
              >
                Back
              </button>
            </div>
          </nav>

          {/* Tabs: Overview | Enter Platform */}
          <div style={{ width: "90%", maxWidth: 1200, margin: "18px auto 0", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className={dashboardTab === "overview" ? "primary-button" : "secondary-button"}
                onClick={() => { setDashboardTab("overview"); setPlatformSelection(null); }}
              >
                Overview
              </button>

              <button
                className={dashboardTab === "enter" ? "primary-button" : "secondary-button"}
                onClick={() => { setDashboardTab("enter"); setPlatformSelection(null); }}
              >
                Enter Platform
              </button>
            </div>

            <div style={{ marginLeft: "auto", color: "var(--muted)" }}>
  {dashboardTab === "overview"
    ? authUser
      ? "Personnel welfare dashboard"
      : "Login to access the platform"
    : "Choose a role to enter the platform"}
</div>
          </div>

          {/* Tab content */}
          <div style={{ marginTop: 12 }}>
            {dashboardTab === "enter" ? (
              // Enter Platform: show three role cards; clicking Welfare Officer opens welfare dashboard
              <div className="dashboard" style={{ paddingTop: 12 }}>
                <div style={{ width: "90%", maxWidth: 1200, margin: "0 auto 18px" }}>
                  <h1 style={{ margin: "8px 0 6px" }}>Enter Platform</h1>
                  <p style={{ margin: 0, color: "var(--muted)" }}>Select your role to continue into the platform</p>
                </div>

                <div style={{ width: "90%", maxWidth: 1200, margin: "18px auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
                  {/* Personnel card */}
                  <div className="role-card" style={{ padding: 22 }}>
                    <div className="role-icon" style={{ background: "#F3E8FF", color: "#6B2FA3" }}>👤</div>
                    <h2 style={{ marginTop: 12 }}>Personnel</h2>
                    <p style={{ color: "var(--muted)" }}>
                      Access personal wellness insights, self-assessments, support resources and wellbeing guidance.
                    </p>
                    <div style={{ marginTop: 12 }}>
                      <button
  className="primary-button"
  onClick={() => {
    setAuthUser({
      name: "Personnel",
      email: "personnel@manraksha.demo",
      role: "personnel",
    });
    setPlatformSelection("personnel");
    setDashboardTab("enter");
  }}
>
  Continue →
</button>
                    </div>
                  </div>

                  {/* Welfare Officer card */}
                  <div className="role-card" style={{ padding: 22 }}>
                    <div className="role-icon" style={{ background: "#E8F7FB", color: "#1E6B73" }}>🛡️</div>
                    <h2 style={{ marginTop: 12 }}>Welfare Officer</h2>
                    <p style={{ color: "var(--muted)" }}>
                      Monitor welfare indicators, understand risk factors and support early human-led intervention.
                    </p>
                    <div style={{ marginTop: 12 }}>
                      <button className="primary-button" onClick={() => { setPlatformSelection("welfare"); setDashboardTab("enter"); }}>
                        Continue →
                      </button>
                    </div>
                  </div>

                  {/* Administrator card */}
                  <div className="role-card" style={{ padding: 22 }}>
                    <div className="role-icon" style={{ background: "#FFF6E8", color: "#A85F2E" }}>📊</div>
                    <h2 style={{ marginTop: 12 }}>Administrator</h2>
                    <p style={{ color: "var(--muted)" }}>
                      View aggregate welfare trends, workload patterns and system-level analytics.
                    </p>
                    <div style={{ marginTop: 12 }}>
                      <button
  className="primary-button"
  onClick={() => {
    setPlatformSelection("admin");
    setDashboardTab("admin");
  }}
>
  Continue →
</button>
                    </div>
                  </div>
                </div>

                {/* Platform selection result area */}
                <div style={{ width: "90%", maxWidth: 1200, margin: "18px auto" }}>
                  {platformSelection === "welfare" ? (
                    // Show Welfare Officer dashboard inside Enter Platform flow
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <h2 style={{ margin: 0 }}>Welfare Officer — Workspace</h2>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="secondary-button" onClick={() => setPlatformSelection(null)}>Back to roles</button>
                        </div>
                      </div>

                      <WelfareOfficerDashboardInline />
                    </div>
                  ) : platformSelection === "personnel" ? (
                    <div className="dashboard-card" style={{ padding: 24 }}>
                      <div style={{ marginBottom: 24 }}>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "var(--accent)",
                            marginBottom: 6
                          }}
                        >
                          PERSONNEL WELLBEING
                        </div>

                        <h2 style={{ margin: "0 0 8px" }}>
                          Wellness Assessment
                        </h2>

                        <p style={{ color: "var(--muted)", margin: 0 }}>
                          Complete this voluntary assessment to receive an AI-assisted
                          wellbeing risk projection.
                        </p>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                          gap: 16,
                          marginBottom: 24
                        }}
                      >
                        <div>
                          <label htmlFor="AvegDuratEcerc">Average Exercise Duration (minutes)</label>
                          <input type="number" id="AvegDuratEcerc" defaultValue="30" min="0" max="300" style={{ width: "100%", marginTop: 6 }} />
                        </div>

                        <div>
                          <label htmlFor="Intensity">Duty / Work Intensity</label>
                          <input type="number" id="Intensity" defaultValue="3" min="1" max="5" style={{ width: "100%", marginTop: 6 }} />
                        </div>

                        <div>
                          <label htmlFor="LivinPlace">Living Place</label>
                          <select id="LivinPlace" defaultValue="Urban" style={{ width: "100%", marginTop: 6 }}>
                            <option value="Urban">Urban</option>
                            <option value="Rural">Rural</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="RelatshpStatus">Relationship Status</label>
                          <select id="RelatshpStatus" defaultValue="Married" style={{ width: "100%", marginTop: 6 }}>
                            <option value="Married">Married</option>
                            <option value="Single">Single</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ marginBottom: 24 }}>
                        <h3>Emotional Assessment</h3>
                        <p style={{ color: "var(--muted)" }}>Rate each statement from 1 to 5.</p>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: 12
                          }}
                        >
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={`EAI${n}`}>
                              <label htmlFor={`EAI${n}`}>EAI{n}</label>
                              <input type="number" id={`EAI${n}`} defaultValue="2" min="1" max="5" style={{ width: "100%", marginTop: 6 }} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginBottom: 24 }}>
                        <h3>Daily Stress & Wellbeing Assessment</h3>
                        <p style={{ color: "var(--muted)" }}>Rate each statement from 1 to 5.</p>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: 12
                          }}
                        >
                          {[
                            "EDS1", "EDS2", "EDS3", "EDS4", "EDS5", "EDS6", "EDS7",
                            "EDS8", "EDS9", "EDS10", "EDS11", "EDS12", "EDS13", "EDS14",
                            "ESD15", "EDS16", "EDS17", "EDS18", "EDS19", "EDS20", "EDS21"
                          ].map((field) => (
                            <div key={field}>
                              <label htmlFor={field}>{field}</label>
                              <input type="number" id={field} defaultValue="2" min="1" max="5" style={{ width: "100%", marginTop: 6 }} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <button
                          className="primary-button"
                          disabled={predictionLoading}
                          onClick={async () => {
                            const personnelData = {
                              AvegDuratEcerc: Number(document.getElementById("AvegDuratEcerc").value),
                              Intensity: Number(document.getElementById("Intensity").value),
                              LivinPlace: document.getElementById("LivinPlace").value,
                              RelatshpStatus: document.getElementById("RelatshpStatus").value,
                              EAI1: Number(document.getElementById("EAI1").value),
                              EAI2: Number(document.getElementById("EAI2").value),
                              EAI3: Number(document.getElementById("EAI3").value),
                              EAI4: Number(document.getElementById("EAI4").value),
                              EAI5: Number(document.getElementById("EAI5").value),
                              EAI6: Number(document.getElementById("EAI6").value),
                              EDS1: Number(document.getElementById("EDS1").value),
                              EDS2: Number(document.getElementById("EDS2").value),
                              EDS3: Number(document.getElementById("EDS3").value),
                              EDS4: Number(document.getElementById("EDS4").value),
                              EDS5: Number(document.getElementById("EDS5").value),
                              EDS6: Number(document.getElementById("EDS6").value),
                              EDS7: Number(document.getElementById("EDS7").value),
                              EDS8: Number(document.getElementById("EDS8").value),
                              EDS9: Number(document.getElementById("EDS9").value),
                              EDS10: Number(document.getElementById("EDS10").value),
                              EDS11: Number(document.getElementById("EDS11").value),
                              EDS12: Number(document.getElementById("EDS12").value),
                              EDS13: Number(document.getElementById("EDS13").value),
                              EDS14: Number(document.getElementById("EDS14").value),
                              ESD15: Number(document.getElementById("ESD15").value),
                              EDS16: Number(document.getElementById("EDS16").value),
                              EDS17: Number(document.getElementById("EDS17").value),
                              EDS18: Number(document.getElementById("EDS18").value),
                              EDS19: Number(document.getElementById("EDS19").value),
                              EDS20: Number(document.getElementById("EDS20").value),
                              EDS21: Number(document.getElementById("EDS21").value)
                            };

                            await getPrediction(personnelData);
                          }}
                        >
                          {predictionLoading ? "Analyzing..." : "Analyze Wellbeing →"}
                        </button>

                        {predictionError && (
                          <span style={{ color: "#b42318", fontSize: 14 }}>
                            {predictionError}
                          </span>
                        )}
                      </div>

                      {predictionResult && (
                        <div
                          style={{
                            marginTop: 28,
                            padding: 20,
                            borderRadius: 14,
                            border: "1px solid rgba(0,0,0,0.08)"
                          }}
                        >
                          <h3 style={{ marginTop: 0 }}>AI-Assisted Wellbeing Projection</h3>

                          <div style={{ marginBottom: 18 }}>
                            <strong>Risk Level:</strong> {predictionResult.risk_level}
                          </div>

                          <div style={{ marginBottom: 18 }}>
                            <strong>Risk probabilities</strong>
                            <div style={{ marginTop: 10 }}>
                              <div>Low: {(predictionResult.probabilities.low * 100).toFixed(1)}%</div>
                              <div>Moderate: {(predictionResult.probabilities.moderate * 100).toFixed(1)}%</div>
                              <div>High: {(predictionResult.probabilities.high * 100).toFixed(1)}%</div>
                            </div>
                          </div>

                          <div>
                            <strong>Key contributing factors</strong>
                            <ul>
                              {predictionResult.top_contributors?.map((item, index) => (
                                <li key={index} style={{ marginBottom: 6 }}>
                                  <strong>{item.feature}</strong> — {item.direction}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <p style={{ marginBottom: 0, color: "var(--muted)", fontSize: 13 }}>
                            This AI output is advisory and is intended to support human-led welfare intervention. It is not a clinical diagnosis or disciplinary decision.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : platformSelection === "admin" ? (
                    <div className="dashboard-card" style={{ padding: 18 }}>
                      <h3>Administrator portal</h3>
                      <p style={{ color: "var(--muted)" }}>System-level analytics and workload dashboards will appear here.</p>
                    </div>
                  ) : (
                    <div className="dashboard-card" style={{ padding: 18 }}>
                      <p style={{ color: "var(--muted)" }}>Choose a role card above to enter the platform.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : dashboardTab === "welfare" ? (
  // Direct Welfare Officer tab (full page)
  <div style={{ marginTop: 12 }}>
    <WelfareOfficerDashboardInline />
  </div>
) :  dashboardTab === "admin" ? (
  // Administrator Dashboard
  <div style={{ marginTop: 12 }}>

    {/* Header */}
    <div className="admin-welcome">
      <div>
        <div className="admin-eyebrow">ADMINISTRATOR PORTAL</div>
        <h2>System Overview</h2>
        <p>
          Monitor platform activity, manage access and oversee system health.
        </p>
      </div>

      <div className="admin-status-badge">
        <span>●</span> System Operational
      </div>
    </div>

    {/* Overview Cards */}
    <div className="admin-stats-grid">

      <div className="admin-stat-card">
        <div className="admin-stat-top">
          <div className="admin-stat-icon personnel-icon">👥</div>
          <span className="admin-stat-label">PERSONNEL</span>
        </div>
        <div className="admin-stat-value">248</div>
        <div className="admin-stat-description">
          Registered personnel
        </div>
      </div>

      <div className="admin-stat-card">
        <div className="admin-stat-top">
          <div className="admin-stat-icon officer-icon">🛡️</div>
          <span className="admin-stat-label">WELFARE OFFICERS</span>
        </div>
        <div className="admin-stat-value">18</div>
        <div className="admin-stat-description">
          Active officers
        </div>
      </div>

      <div className="admin-stat-card">
        <div className="admin-stat-top">
          <div className="admin-stat-icon active-icon">✓</div>
          <span className="admin-stat-label">ACTIVE USERS</span>
        </div>
        <div className="admin-stat-value">231</div>
        <div className="admin-stat-description">
          Currently active
        </div>
      </div>

      <div className="admin-stat-card">
        <div className="admin-stat-top">
          <div className="admin-stat-icon system-icon">◉</div>
          <span className="admin-stat-label">SYSTEM STATUS</span>
        </div>
        <div className="admin-stat-value status-text">Active</div>
        <div className="admin-stat-description">
          All services operational
        </div>
      </div>

    </div>

    {/* Main Admin Grid */}
    <div className="admin-main-grid">

      {/* User Management */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h3>User Management</h3>
            <p>Manage platform accounts and permissions.</p>
          </div>
          <div className="admin-panel-icon">👤</div>
        </div>

        <div className="admin-action-list">

          <button className="admin-action-item">
            <span className="action-icon">👥</span>
            <span>
              <strong>Manage Users</strong>
              <small>View and manage registered accounts</small>
            </span>
            <span className="action-arrow">→</span>
          </button>

          <button className="admin-action-item">
            <span className="action-icon">🛡️</span>
            <span>
              <strong>Welfare Officers</strong>
              <small>Manage officer accounts and access</small>
            </span>
            <span className="action-arrow">→</span>
          </button>

          <button className="admin-action-item">
            <span className="action-icon">🔐</span>
            <span>
              <strong>Access & Permissions</strong>
              <small>Control role-based platform access</small>
            </span>
            <span className="action-arrow">→</span>
          </button>

        </div>
      </div>

      {/* System Monitoring */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h3>System Monitoring</h3>
            <p>Current platform health and services.</p>
          </div>
          <div className="admin-panel-icon">📡</div>
        </div>

        <div className="system-monitor-list">

          <div className="monitor-item">
            <div>
              <strong>AI Risk Prediction Model</strong>
              <span>Prediction services</span>
            </div>
            <div className="monitor-status">
              <span>●</span> Operational
            </div>
          </div>

          <div className="monitor-item">
            <div>
              <strong>Data Synchronization</strong>
              <span>Platform data</span>
            </div>
            <div className="monitor-status">
              <span>●</span> Up to date
            </div>
          </div>

          <div className="monitor-item">
            <div>
              <strong>Platform Security</strong>
              <span>Security services</span>
            </div>
            <div className="monitor-status">
              <span>●</span> Protected
            </div>
          </div>

          <div className="monitor-item">
            <div>
              <strong>Last System Update</strong>
              <span>Platform maintenance</span>
            </div>
            <div className="monitor-time">
              Today
            </div>
          </div>

        </div>
      </div>

    </div>

    {/* Administrative Controls */}
    <div className="admin-panel admin-controls-panel">

      <div className="admin-panel-header">
        <div>
          <h3>Administrative Controls</h3>
          <p>Platform configuration and administrative tools.</p>
        </div>
        <div className="admin-panel-icon">⚙️</div>
      </div>

      <div className="admin-control-grid">

        <button className="admin-control-card">
          <span>⚙️</span>
          <strong>System Settings</strong>
          <small>Configure platform preferences</small>
        </button>

        <button className="admin-control-card">
          <span>📊</span>
          <strong>System Reports</strong>
          <small>View aggregate platform reports</small>
        </button>

        <button className="admin-control-card">
          <span>🔒</span>
          <strong>Security Controls</strong>
          <small>Review security configuration</small>
        </button>

      </div>

    </div>

  </div>
) : (
  // Overview tab
  !authUser ? (
    <LoginSignup
      onClose={() => setShowDashboard(false)}
      onLogin={handleLogin}
    />
  ) : authUser.role === "personnel" ? (
    <div className="dashboard" style={{ paddingTop: 12 }}>

      <div
        style={{
          width: "90%",
          maxWidth: 1200,
          margin: "0 auto 18px",
        }}
      >
        <h1 style={{ margin: "8px 0 6px" }}>
          Personnel Dashboard
        </h1>

        <p style={{ margin: 0, color: "var(--muted)" }}>
          Welcome, {authUser.name}. Monitor your welfare
          indicators and wellbeing insights.
        </p>
      </div>

      <div className="dashboard-heading" style={{ marginTop: 12 }}>
        <div>
          <h2
            style={{
              margin: 0,
              color: "var(--muted)",
              fontSize: 16,
            }}
          >
            Live risk projection and contributing factors
          </h2>
        </div>

        <div className="status-badge">
          <span /> Live Preview
        </div>
      </div>

      <div className="dashboard-grid">

        {/* Risk Projection */}
        <div className="dashboard-card" style={{ padding: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <small>30 DAY PROJECTION</small>

              <h2 style={{ marginTop: 6 }}>
                Risk Projection (30 days)
              </h2>

              <div
                style={{
                  marginTop: 6,
                  background: "rgba(255,255,255,0.9)",
                  padding: "8px 12px",
                  borderRadius: 10,
                  display: "inline-block",
                  border: "1px solid rgba(44,94,98,0.08)",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    fontSize: 14,
                  }}
                >
                  Current Risk
                </strong>

                <span
                  style={{
                    color: "var(--muted)",
                    fontSize: 13,
                  }}
                >
                  Aggregated risk score based on recent signals
                </span>
              </div>
            </div>

            <div
              className="risk-card"
              style={{
                alignItems: "center",
                padding: "10px 14px",
              }}
            >
              <div>
                <small>CURRENT PROJECTION</small>

                <strong style={{ fontSize: 28 }}>
                  {projection[projection.length - 1]}%
                </strong>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <LineChart data={projection} />
          </div>

          <div
            className="chart-labels"
            style={{ marginTop: 10 }}
          >
            <div
              style={{
                fontSize: 13,
                color: "var(--muted)",
              }}
            >
              Lower risk
            </div>

            <div
              style={{
                fontSize: 13,
                color: "var(--muted)",
              }}
            >
              Higher risk
            </div>
          </div>
        </div>

        {/* Top Factors + AI Insight */}
        <div
          className="dashboard-card ai-card"
          style={{ padding: 18 }}
        >
          <div className="card-header">
            <div>
              <small>TOP CONTRIBUTING FACTORS</small>

              <h2 style={{ marginTop: 6 }}>
                Top factors
              </h2>
            </div>
          </div>

          <div
            className="factors"
            style={{ marginTop: 8 }}
          >
            {topFactors.map((f, idx) => (
              <div
                key={idx}
                className="factor"
                style={{ padding: "8px 0" }}
              >
                <div style={{ fontWeight: 700 }}>
                  {f.name}
                </div>

                <div
                  style={{
                    color: "var(--blue)",
                    fontWeight: 800,
                  }}
                >
                  {f.impact}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <h3 style={{ margin: "8px 0" }}>
              AI Insight
            </h3>

            <p
              className="ai-description"
              style={{ marginTop: 6 }}
            >
              The model indicates a steady upward trend
              in aggregated risk driven primarily by
              prolonged deployments and sleep disruption
              signals. Recommend confidential outreach
              for flagged personnel and anonymized case
              review by authorized welfare officers.
            </p>

            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 10,
              }}
            >
              <button className="primary-button">
                Open recommended actions
              </button>

              <button className="secondary-button">
                Export anonymized summary
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Action */}
      <div style={{ marginTop: 22 }}>
        <div
          className="dashboard-card action-card"
          style={{
            padding: 18,
            alignItems: "flex-start",
            display: "flex",
            gap: 18,
          }}
        >
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: "0 0 8px 0" }}>
              Recommended action
            </h2>

            <p
              style={{
                marginTop: 0,
                color: "var(--muted)",
              }}
            >
              Prioritize confidential outreach to
              personnel with elevated risk. Use
              role-based access to view case details.
              Ensure all exports are anonymized.
            </p>

            <div
              style={{
                marginTop: 14,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >

              {/* Rest */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: 10,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(44,94,98,0.06)",
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 12,
                    background:
                      "linear-gradient(180deg,#FBE38E,#FFD66A)",
                    marginTop: 6,
                  }}
                />

                <div>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 15,
                    }}
                  >
                    Prioritize Rest & Sleep
                  </strong>

                  <div
                    style={{
                      color: "var(--muted)",
                      fontSize: 13,
                      marginTop: 4,
                    }}
                  >
                    Encourage rest plans and monitor
                    sleep disruption signals
                  </div>
                </div>
              </div>

              {/* Workload */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: 10,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(44,94,98,0.06)",
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 12,
                    background:
                      "linear-gradient(180deg,#DCEFF3,#8FC7D4)",
                    marginTop: 6,
                  }}
                />

                <div>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 15,
                    }}
                  >
                    Review Workload
                  </strong>

                  <div
                    style={{
                      color: "var(--muted)",
                      fontSize: 13,
                      marginTop: 4,
                    }}
                  >
                    Assess task distribution and reduce
                    acute workload spikes
                  </div>
                </div>
              </div>

              {/* Support */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: 10,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(44,94,98,0.06)",
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 12,
                    background:
                      "linear-gradient(180deg,#FFF6E8,#F7E0C2)",
                    marginTop: 6,
                  }}
                />

                <div>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 15,
                    }}
                  >
                    Explore Support Options
                  </strong>

                  <div
                    style={{
                      color: "var(--muted)",
                      fontSize: 13,
                      marginTop: 4,
                    }}
                  >
                    Share available counselling and
                    peer-support resources
                  </div>
                </div>
              </div>

              {/* Check-in */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: 10,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(44,94,98,0.06)",
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 12,
                    background:
                      "linear-gradient(180deg,#EAF3F4,#CFEFF2)",
                    marginTop: 6,
                  }}
                />

                <div>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 15,
                    }}
                  >
                    Complete a Wellbeing Check-in
                  </strong>

                  <div
                    style={{
                      color: "var(--muted)",
                      fontSize: 13,
                      marginTop: 4,
                    }}
                  >
                    Quick self-report to capture current
                    state and flags
                  </div>
                </div>
              </div>

              {/* Professional */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: 10,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(44,94,98,0.06)",
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 12,
                    background:
                      "linear-gradient(180deg,#FFEFE6,#FFD6B8)",
                    marginTop: 6,
                  }}
                />

                <div>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 15,
                    }}
                  >
                    Talk to a Support Professional
                  </strong>

                  <div
                    style={{
                      color: "var(--muted)",
                      fontSize: 13,
                      marginTop: 4,
                    }}
                  >
                    Offer confidential referral to
                    trained welfare staff
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div
            style={{
              marginLeft: 18,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <button className="primary-button">
              Create case
            </button>

            <button className="secondary-button">
              Anonymize & Export
            </button>
          </div>
        </div>
      </div>

      <footer style={{ marginTop: 28 }}>
        <div
          style={{
            color: "var(--muted)",
            fontSize: 13,
          }}
        >
          © ManRaksha — Risk intelligence for
          proactive welfare
        </div>

        <div>
          <a
            href="https://manraksha-app.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="secondary-button"
            style={{ textDecoration: "none" }}
          >
            Open live demo
          </a>
        </div>
      </footer>

    </div>
  ) : authUser.role === "welfare" ? (
    <WelfareOfficerDashboardInline />
  ) : authUser.role === "admin" ? (
    <div
      className="dashboard"
      style={{ paddingTop: 24 }}
    >
      <div
        className="dashboard-card"
        style={{
          width: "90%",
          maxWidth: 1200,
          margin: "20px auto",
          padding: 24,
        }}
      >
        <h1>Administrator Dashboard</h1>

        <p style={{ color: "var(--muted)" }}>
          System-level analytics, user management
          and administrative controls will appear
          here.
        </p>
      </div>
    </div>
  ) : null
)}
          </div>
        </div>
      </div>
    );
  }

  /* LANDING / PLATFORM SCREEN (no auth buttons here) */
  return (
    <div className="app">
      <div className="platform-screen">
        <nav className="navbar">
          <div className="logo">
            <img src="/ManRaksha_logo.png" alt="ManRaksha logo" />
            <span>ManRaksha</span>
          </div>

          <div className="nav-links">
            <a href="#how">How it works</a>
            <a href="#about">About</a>
            <a href="https://manraksha-app.vercel.app/" target="_blank" rel="noreferrer">Explore Platform</a>
          </div>

          <div>
            {authUser ? (
  <button className="nav-button" onClick={handleLogout}>
    Logout
  </button>
) : (
  <button className="nav-button" onClick={() => setShowDashboard(true)}>
    Login / Sign Up
  </button>
)}
          </div>
        </nav>

        <section className="hero">

  <div className="hero-content">

    <div className="hero-kicker">
      AI-POWERED PERSONNEL WELFARE
    </div>

    <h1>
      Supporting
      <br />
      <span>those who serve.</span>
    </h1>

    <p className="hero-description">
      ManRaksha uses predictive intelligence to recognize changing
      stress and welfare patterns in uniformed personnel, helping
      welfare teams respond earlier with timely, human-led support.
    </p>

    <p className="hero-description secondary-description">
      Built around privacy, dignity and early intervention, the
      platform helps organizations create meaningful opportunities
      for support before concerns become crises.
    </p>

    <div className="hero-accent-line">
      <span></span>
      <span></span>
      <span></span>
    </div>

  </div>


  <div className="hero-message">

    <div className="message-shape shape-green"></div>
    <div className="message-shape shape-yellow"></div>

    <div className="message-content">

      <div className="message-small">
        THE MANRAKSHA APPROACH
      </div>

      <div className="message-title">
        WELLBEING
        <br />
        <span>BEFORE</span>
        <br />
        CRISIS.
      </div>

      <p>
        Recognize the signs.
        <br />
        Create space for support.
      </p>

      <div className="message-line"></div>

      

    </div>

  </div>

</section>

        <section id="how" className="problem-section">

  <div className="section-kicker">
    HOW MANRAKSHA WORKS
  </div>

  <h2>
    Risk Intelligence <span>and Platform</span>
  </h2>

  <p className="section-intro">
    ManRaksha combines predictive analytics with welfare-focused
    intervention to help identify changing patterns in personnel
    wellbeing before they become more serious concerns.
  </p>

  <p className="section-intro">
    The platform brings together risk indicators, self-reported
    information and welfare insights to help authorized teams
    understand emerging patterns while preserving dignity,
    confidentiality and data protection.
  </p>

  <div className="section-points">

    <div>
      <strong>01 · Identify</strong>
      <span>Recognize changing stress and welfare patterns early.</span>
    </div>

    <div>
      <strong>02 · Understand</strong>
      <span>Turn patterns and risk factors into meaningful welfare insights.</span>
    </div>

    <div>
      <strong>03 · Support</strong>
      <span>Enable timely, human-led intervention when support is needed.</span>
    </div>

  </div>

</section>

        <section id="about" className="about-section">
          <h2>Preliminary Scope</h2>
          <p>
            Predictive analytics, mobile self-reporting, role-based dashboards,
            anonymized datasets, and secure integrations for HRMS and personnel systems.
          </p>
        </section>
      </div>
    </div>
  );
}