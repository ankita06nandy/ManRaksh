// src/App.jsx
import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://manraksha.onrender.com";

const DASHBOARD_DATA = {
  personnel_count: 277,
  welfare_officer_count: 18,
  active_user_count: 231,
  total: 277,
  low: 150,
  moderate: 75,
  elevated: 52,
  trend: [
    29, 31, 30, 34, 33, 35, 36, 34, 37, 39,
    38, 40, 41, 39, 42, 44, 43, 45, 46, 44,
    47, 48, 46, 49, 50, 48, 51, 52, 50, 52,
  ],
  priority: [
    { id: "P1042", risk: "Moderate", reason: "Dataset Group 2 record" },
    { id: "P1087", risk: "Elevated", reason: "Dataset Group 3 record" },
    { id: "P1121", risk: "Elevated", reason: "Dataset Group 3 record" },
    { id: "P1154", risk: "Moderate", reason: "Dataset Group 2 record" },
  ],
  factors: [
    { name: "Stress indicators", impact: "" },
    { name: "Resilience indicators", impact: "" },
    { name: "Health indicators", impact: "" },
  ],
};

const DAILY_GOALS = [
  {
    id: "rest",
    title: "Protect your rest window",
    description: "Set aside time for uninterrupted rest and recovery today.",
  },
  {
    id: "movement",
    title: "Take a movement break",
    description: "Complete a short walk, stretch, or exercise break.",
  },
  {
    id: "check-in",
    title: "Check in with yourself",
    description: "Notice how you are feeling and record anything you need support with.",
  },
];

/* =========================
   Helpers and small chart components
   ========================= */

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

function WelfareOfficerDashboardInline({ sampleData, error }) {
  const data = sampleData || DASHBOARD_DATA;
  const personnelTotal = data.personnel_count ?? data.total;
  const low = data.low;
  const moderate = data.moderate;
  const elevated = data.elevated;

  const trend = data.trend;

  const priorityList = data.priority;

  const explainable = data.factors;

  return (
    <div className="dashboard" style={{ paddingTop: 24 }}>
      {error && (
        <div style={{ color: "#b42318", marginBottom: 12 }}>
          {error}
        </div>
      )}
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

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    alert("Please enter your email and password.");
    return;
  }

  if (mode === "signup" && !form.name) {
    alert("Please enter your name.");
    return;
  }

  try {
    const endpoint =
      mode === "login"
        ? `${API_BASE_URL}/login`
        : `${API_BASE_URL}/register`;

    const response = await fetch(
      `${endpoint}?email=${encodeURIComponent(form.email)}&password=${encodeURIComponent(form.password)}`,
      {
        method: "POST",
        headers: {
          "X-Account-Role": selectedRole || "personnel",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Authentication failed");
    }

    if (mode === "login") {
      localStorage.setItem("token", data.access_token);

      onLogin({
        name: data.user?.email?.split("@")[0] || form.email.split("@")[0],
        email: data.user?.email || form.email,
        role: selectedRole || data.user?.role || "personnel",
      });
    } else {
      alert("Account created successfully. Please login.");
      setMode("login");
    }
  } catch (error) {
    console.error("Authentication error:", error);
    alert(error.message);
  }
};
  return (
    <div className="auth-page">
      <button className="auth-back-button" onClick={onClose}>
        ← Back to Dashboard
      </button>

      <div className="auth-container">
        <div className="auth-header">
          <img
            src="/ManRaksh_logo.png"
            alt="ManRaksh logo"
            className="auth-logo-image"
           />
          <h1>ManRaksh</h1>
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

function PersonnelSupportAndGoals() {
  const [completedGoals, setCompletedGoals] = useState(() => {
    const storedGoals = localStorage.getItem("dailyGoals");
    if (!storedGoals) return {};
    try {
      return JSON.parse(storedGoals);
    } catch {
      localStorage.removeItem("dailyGoals");
      return {};
    }
  });

  const toggleGoal = (goalId) => {
    setCompletedGoals((current) => {
      const next = { ...current, [goalId]: !current[goalId] };
      localStorage.setItem("dailyGoals", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, marginTop: 22 }}>
      <section className="dashboard-card" style={{ padding: 20 }}>
        <small>SELF-CARE PLAN</small>
        <h2 style={{ margin: "6px 0 8px" }}>Daily goals</h2>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>Small, practical steps to support your wellbeing today.</p>
        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          {DAILY_GOALS.map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() => toggleGoal(goal.id)}
              aria-pressed={Boolean(completedGoals[goal.id])}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                textAlign: "left",
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(44,94,98,0.12)",
                background: completedGoals[goal.id] ? "rgba(207,239,242,0.55)" : "rgba(255,255,255,0.9)",
                cursor: "pointer",
              }}
            >
              <span aria-hidden="true" style={{ minWidth: 20, height: 20, borderRadius: "50%", border: "2px solid var(--accent)", background: completedGoals[goal.id] ? "var(--accent)" : "transparent", color: "white", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700 }}>
                {completedGoals[goal.id] ? "✓" : ""}
              </span>
              <span>
                <strong style={{ display: "block" }}>{goal.title}</strong>
                <span style={{ display: "block", color: "var(--muted)", fontSize: 13, marginTop: 3 }}>{goal.description}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="dashboard-card" style={{ padding: 20 }}>
        <small>CONFIDENTIAL SUPPORT</small>
        <h2 style={{ margin: "6px 0 8px" }}>Support</h2>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>You do not have to manage difficult moments alone.</p>
        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          <div style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.9)", border: "1px solid rgba(44,94,98,0.08)" }}>
            <strong>Talk to a welfare officer</strong>
            <p style={{ color: "var(--muted)", fontSize: 13, margin: "5px 0 0" }}>Request a confidential conversation about your wellbeing or workload.</p>
          </div>
          <div style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.9)", border: "1px solid rgba(44,94,98,0.08)" }}>
            <strong>Use peer support</strong>
            <p style={{ color: "var(--muted)", fontSize: 13, margin: "5px 0 0" }}>Reach out to a trusted colleague, friend, or family member.</p>
          </div>
          <div style={{ padding: 12, borderRadius: 12, background: "rgba(255,246,232,0.75)", border: "1px solid rgba(168,95,46,0.14)" }}>
            <strong>Need immediate help?</strong>
            <p style={{ color: "var(--muted)", fontSize: 13, margin: "5px 0 0" }}>Contact local emergency services or an on-duty welfare professional if you are in immediate danger.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================
   Main App
   ========================= */

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [authUser, setAuthUser] = useState(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("authUser");

    if (!token || !storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("authUser");
      return null;
    }
  });
  
  // UI state: which dashboard tab to show
  // "overview" = home/authenticated personnel view, "welfare" = welfare dashboard
  const [dashboardTab, setDashboardTab] = useState("overview");
  // Tracks the selected authenticated platform role
  const [platformSelection, setPlatformSelection] = useState(null);

  // AI prediction state
  const [predictionResult, setPredictionResult] = useState(() => {
    const cachedResult = localStorage.getItem("latestAssessment");
    if (!cachedResult) {
      return null;
    }

    try {
      return JSON.parse(cachedResult);
    } catch {
      localStorage.removeItem("latestAssessment");
      return null;
    }
  });
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState("");
  const [completedGoals, setCompletedGoals] = useState(() => {
    const storedGoals = localStorage.getItem("dailyGoals");
    if (!storedGoals) {
      return {};
    }

    try {
      return JSON.parse(storedGoals);
    } catch {
      localStorage.removeItem("dailyGoals");
      return {};
    }
  });

  function toggleDailyGoal(goalId) {
    setCompletedGoals((currentGoals) => {
      const nextGoals = {
        ...currentGoals,
        [goalId]: !currentGoals[goalId],
      };
      localStorage.setItem("dailyGoals", JSON.stringify(nextGoals));
      return nextGoals;
    });
  }

  useEffect(() => {
    if (!authUser || authUser.role !== "personnel") {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    fetch(`${API_BASE_URL}/personnel/latest-assessment`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (response.status === 404) {
          return null;
        }
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.detail || "Unable to load your latest assessment");
        }
        return data;
      })
      .then((data) => {
        if (data) {
          setPredictionResult(data);
          localStorage.setItem("latestAssessment", JSON.stringify(data));
        }
      })
      .catch((error) => {
        console.error("Latest assessment error:", error);
      });
  }, [authUser]);

  async function getPrediction(personnelData) {
    setPredictionLoading(true);
    setPredictionError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login before using the AI prediction service.");
      }

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(personnelData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail
            ? JSON.stringify(errorData.detail)
            : "Prediction request failed"
        );
      }

      const result = await response.json();
      setPredictionResult(result);
      localStorage.setItem("latestAssessment", JSON.stringify(result));
      return result;
    } catch (error) {
      console.error("Prediction error:", error);
      setPredictionError(
        error.message || "Unable to connect to the ManRaksh AI prediction service."
      );
      return null;
    } finally {
      setPredictionLoading(false);
    }
  }

  const probabilities = predictionResult?.probabilities;
  const riskScore = probabilities
    ? Math.round((probabilities.group_1 * 25 + probabilities.group_2 * 60 + probabilities.group_3 * 90) * 10) / 10
    : null;
  const projection = riskScore === null ? [] : Array(30).fill(riskScore);
  const topFactors = predictionResult?.top_contributors?.slice(0, 3).map((item) => ({
    name: item.feature,
    impact: item.direction,
  })) || [];

  function handleLogin(user) {
    localStorage.setItem("authUser", JSON.stringify(user));
    setAuthUser(user);
    setPlatformSelection(user.role);
    setDashboardTab(
      user.role === "personnel"
        ? "enter"
        : user.role === "admin"
          ? "admin"
          : "welfare"
    );
    setShowDashboard(true);
  }
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
    localStorage.removeItem("latestAssessment");
    setAuthUser(null);
    // return to overview on logout
    setDashboardTab("overview");
    setPlatformSelection(null);
  }

  /* ---------- Dashboard view ---------- */
  if (showDashboard) {
    return (
      <div className="app">
        <div className="dashboard-screen">
          <nav className="dashboard-nav">
            <div className="logo">
              <img src="/ManRaksh_logo.png" alt="ManRaksh logo" />
              <span>ManRaksh</span>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div className="dashboard-title">Risk Intelligence</div>

              <a
                className="secondary-button"
                href="https://manraksh.vercel.app/"
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

          {/* Tab content */}
          <div style={{ marginTop: 12 }}>
            {dashboardTab === "enter" ? (
              // Personnel assessment view
              <div className="dashboard" style={{ paddingTop: 12 }}>
                <div style={{ width: "90%", maxWidth: 1200, margin: "0 auto 18px" }}>
                  <h1 style={{ margin: "8px 0 6px" }}>Personnel Assessment</h1>
                </div>

                <div style={{ display: "none" }}>
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
    if (!localStorage.getItem("token")) {
      setDashboardTab("overview");
      setShowDashboard(false);
      return;
    }

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

                {/* Role dashboard content */}
                <div style={{ width: "90%", maxWidth: 1200, margin: "18px auto" }}>
                  {platformSelection === "welfare" ? (
                    // Welfare Officer dashboard content
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
                          <label htmlFor="Age">Age</label>
                          <input type="number" id="Age" defaultValue="25" min="18" max="80" style={{ width: "100%", marginTop: 6 }} />
                        </div>

                        <div>
                          <label htmlFor="Gender">Gender (dataset code)</label>
                          <input type="number" id="Gender" defaultValue="1" min="0" max="10" style={{ width: "100%", marginTop: 6 }} />
                        </div>

                        <div>
                          <label htmlFor="AvegWklyFreqWExerc">Weekly Exercise Frequency</label>
                          <input type="number" id="AvegWklyFreqWExerc" defaultValue="4" min="0" max="20" style={{ width: "100%", marginTop: 6 }} />
                        </div>

                        <div>
                          <label htmlFor="AvegDuratEcerc">Average Exercise Duration (minutes)</label>
                          <input type="number" id="AvegDuratEcerc" defaultValue="60" min="0" max="300" style={{ width: "100%", marginTop: 6 }} />
                        </div>

                        <div>
                          <label htmlFor="Intensity">Duty / Work Intensity</label>
                          <input type="number" id="Intensity" defaultValue="15" min="0" max="100" style={{ width: "100%", marginTop: 6 }} />
                        </div>

                        <div>
                          <label htmlFor="LivinPlace">Living Place (dataset code)</label>
                          <input type="number" id="LivinPlace" defaultValue="1" min="0" max="10" style={{ width: "100%", marginTop: 6 }} />
                        </div>

                        <div>
                          <label htmlFor="RelatshpStatus">Relationship Status (dataset code)</label>
                          <input type="number" id="RelatshpStatus" defaultValue="1" min="0" max="10" style={{ width: "100%", marginTop: 6 }} />
                        </div>
                      </div>

                      <div style={{ marginBottom: 24 }}>
                        <h3>Psychological & Resilience Assessment</h3>
                        <p style={{ color: "var(--muted)" }}>Rate each indicator from 1 to 5.</p>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: 12
                          }}
                        >
                          {[
                            ["Self_Regulation", "Self Regulation"],
                            ["Anxiety_Worry_Control", "Anxiety / Worry Control"],
                            ["Relationship_Stability", "Relationship Stability"],
                            ["Adaptibility_to_Environment", "Adaptibility to Environment"],
                            ["Task_Persistent", "Task Persistent"],
                            ["Stress_Recovery", "Stress Recovery"],
                            ["Unexpected_Stress", "Unexpected Stress"],
                            ["Lack_of_Control", "Lack of Control"],
                            ["Anxiety", "Anxiety"],
                            ["Overwhelmed", "Overwhelmed"],
                            ["Irritability", "Irritability"],
                            ["Confidence", "Confidence"],
                            ["Efficiency", "Efficiency"],
                            ["Situation_Mastery", "Situation Mastery"],
                            ["Operation_Control", "Operation Control"],
                            ["Accumulated_Pressure", "Accumulated Pressure"]
                          ].map(([id, label]) => (
                            <div key={id}>
                              <label htmlFor={id}>{label}</label>
                              <input type="number" id={id} defaultValue="3" min="1" max="5" style={{ width: "100%", marginTop: 6 }} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginBottom: 24 }}>
                        <h3>Health & Welfare Indicators</h3>
                        <p style={{ color: "var(--muted)" }}>Enter 0 for No and 1 for Yes.</p>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: 12
                          }}
                        >
                          {[
                            ["High_BP", "High BP"],
                            ["Blood_Sugar", "Blood Sugar"],
                            ["Hyperlipidimia", "Hyperlipidimia"],
                            ["Heart_Disease", "Heart Disease"],
                            ["Sleep_Disorder", "Sleep Disorder"],
                            ["Chronic_Bronchitis", "Chronic Bronchitis"],
                            ["Migraine", "Migraine"],
                            ["High_BMI", "High BMI"],
                            ["Atherosclerosis", "Atherosclerosis"],
                            ["Pneumonia", "Pneumonia"]
                          ].map(([id, label]) => (
                            <div key={id}>
                              <label htmlFor={id}>{label}</label>
                              <input type="number" id={id} defaultValue="0" min="0" max="1" style={{ width: "100%", marginTop: 6 }} />
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
                              Age: Number(document.getElementById("Age").value),
                              Gender: Number(document.getElementById("Gender").value),
                              AvegWklyFreqWExerc: Number(document.getElementById("AvegWklyFreqWExerc").value),
                              AvegDuratEcerc: Number(document.getElementById("AvegDuratEcerc").value),
                              Intensity: Number(document.getElementById("Intensity").value),
                              LivinPlace: Number(document.getElementById("LivinPlace").value),
                              RelatshpStatus: Number(document.getElementById("RelatshpStatus").value),
                              Self_Regulation: Number(document.getElementById("Self_Regulation").value),
                              Anxiety_Worry_Control: Number(document.getElementById("Anxiety_Worry_Control").value),
                              Relationship_Stability: Number(document.getElementById("Relationship_Stability").value),
                              Adaptibility_to_Environment: Number(document.getElementById("Adaptibility_to_Environment").value),
                              Task_Persistent: Number(document.getElementById("Task_Persistent").value),
                              Stress_Recovery: Number(document.getElementById("Stress_Recovery").value),
                              Unexpected_Stress: Number(document.getElementById("Unexpected_Stress").value),
                              Lack_of_Control: Number(document.getElementById("Lack_of_Control").value),
                              Anxiety: Number(document.getElementById("Anxiety").value),
                              Overwhelmed: Number(document.getElementById("Overwhelmed").value),
                              Irritability: Number(document.getElementById("Irritability").value),
                              Confidence: Number(document.getElementById("Confidence").value),
                              Efficiency: Number(document.getElementById("Efficiency").value),
                              Situation_Mastery: Number(document.getElementById("Situation_Mastery").value),
                              Operation_Control: Number(document.getElementById("Operation_Control").value),
                              Accumulated_Pressure: Number(document.getElementById("Accumulated_Pressure").value),
                              High_BP: Number(document.getElementById("High_BP").value),
                              Blood_Sugar: Number(document.getElementById("Blood_Sugar").value),
                              Hyperlipidimia: Number(document.getElementById("Hyperlipidimia").value),
                              Heart_Disease: Number(document.getElementById("Heart_Disease").value),
                              Sleep_Disorder: Number(document.getElementById("Sleep_Disorder").value),
                              Chronic_Bronchitis: Number(document.getElementById("Chronic_Bronchitis").value),
                              Migraine: Number(document.getElementById("Migraine").value),
                              High_BMI: Number(document.getElementById("High_BMI").value),
                              Atherosclerosis: Number(document.getElementById("Atherosclerosis").value),
                              Pneumonia: Number(document.getElementById("Pneumonia").value)
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
                            <strong>Predicted Group:</strong> {predictionResult.group}
                          </div>

                          <div style={{ marginBottom: 18 }}>
                            <strong>Prediction probabilities</strong>
                            <div style={{ marginTop: 10 }}>
                              <div>Group 1: {(predictionResult.probabilities.group_1 * 100).toFixed(1)}%</div>
                              <div>Group 2: {(predictionResult.probabilities.group_2 * 100).toFixed(1)}%</div>
                              <div>Group 3: {(predictionResult.probabilities.group_3 * 100).toFixed(1)}%</div>
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
                {platformSelection === "personnel" && <PersonnelSupportAndGoals />}
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
        <div className="admin-stat-value">{DASHBOARD_DATA.personnel_count}</div>
        <div className="admin-stat-description">
          Registered personnel
        </div>
      </div>

      <div className="admin-stat-card">
        <div className="admin-stat-top">
          <div className="admin-stat-icon officer-icon">🛡️</div>
          <span className="admin-stat-label">WELFARE OFFICERS</span>
        </div>
        <div className="admin-stat-value">{DASHBOARD_DATA.welfare_officer_count}</div>
        <div className="admin-stat-description">
          Active officers
        </div>
      </div>

      <div className="admin-stat-card">
        <div className="admin-stat-top">
          <div className="admin-stat-icon active-icon">✓</div>
          <span className="admin-stat-label">ACTIVE USERS</span>
        </div>
        <div className="admin-stat-value">{DASHBOARD_DATA.active_user_count}</div>
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
                  {riskScore === null ? "—" : `${riskScore}%`}
                </strong>
              </div>
            </div>
          </div>

          {predictionResult ? (
            <div style={{ marginTop: 8 }}>
              <LineChart data={projection} />
            </div>
          ) : (
            <p style={{ marginTop: 18, color: "var(--muted)" }}>
              Submit the wellbeing assessment to load your backend risk projection.
            </p>
          )}

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
            {topFactors.length > 0 ? topFactors.map((f, idx) => (
              <div
                key={idx}
                className="factor"
                style={{ padding: "8px 0" }}
              >
                <div style={{ fontWeight: 700 }}>
                  {f.name}
                </div>

                {f.impact && (
                  <div
                    style={{
                      color: "var(--blue)",
                      fontWeight: 800,
                    }}
                  >
                    {f.impact}
                  </div>
                )}
              </div>
            )) : (
              <p style={{ color: "var(--muted)" }}>
                Your backend assessment factors will appear here after analysis.
              </p>
            )}
          </div>

          <div style={{ marginTop: 12 }}>
            <h3 style={{ margin: "8px 0" }}>
              AI Insight
            </h3>

            <p
              className="ai-description"
              style={{ marginTop: 6 }}
            >
              {predictionResult
                ? `The backend model classified your latest assessment as ${predictionResult.group}. Review the contributing factors above and use this result as advisory support for a human-led welfare conversation.`
                : "Your backend model result and advisory insight will appear here after you submit the wellbeing assessment."}
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 18,
          marginTop: 22,
        }}
      >
        <section className="dashboard-card" style={{ padding: 20 }}>
          <small>SELF-CARE PLAN</small>
          <h2 style={{ margin: "6px 0 8px" }}>Daily goals</h2>
          <p style={{ color: "var(--muted)", marginTop: 0 }}>
            Small, practical steps to support your wellbeing today.
          </p>

          <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
            {DAILY_GOALS.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => toggleDailyGoal(goal.id)}
                aria-pressed={Boolean(completedGoals[goal.id])}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  textAlign: "left",
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid rgba(44,94,98,0.12)",
                  background: completedGoals[goal.id] ? "rgba(207,239,242,0.55)" : "rgba(255,255,255,0.9)",
                  cursor: "pointer",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    minWidth: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: "2px solid var(--accent)",
                    background: completedGoals[goal.id] ? "var(--accent)" : "transparent",
                    color: "white",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {completedGoals[goal.id] ? "✓" : ""}
                </span>
                <span>
                  <strong style={{ display: "block" }}>{goal.title}</strong>
                  <span style={{ display: "block", color: "var(--muted)", fontSize: 13, marginTop: 3 }}>
                    {goal.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="dashboard-card" style={{ padding: 20 }}>
          <small>CONFIDENTIAL SUPPORT</small>
          <h2 style={{ margin: "6px 0 8px" }}>Support</h2>
          <p style={{ color: "var(--muted)", marginTop: 0 }}>
            You do not have to manage difficult moments alone. Choose the option that feels comfortable.
          </p>

          <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
            <div style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.9)", border: "1px solid rgba(44,94,98,0.08)" }}>
              <strong>Talk to a welfare officer</strong>
              <p style={{ color: "var(--muted)", fontSize: 13, margin: "5px 0 0" }}>
                Request a confidential conversation about your wellbeing or workload.
              </p>
            </div>
            <div style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.9)", border: "1px solid rgba(44,94,98,0.08)" }}>
              <strong>Use peer support</strong>
              <p style={{ color: "var(--muted)", fontSize: 13, margin: "5px 0 0" }}>
                Reach out to a trusted colleague, friend, or family member.
              </p>
            </div>
            <div style={{ padding: 12, borderRadius: 12, background: "rgba(255,246,232,0.75)", border: "1px solid rgba(168,95,46,0.14)" }}>
              <strong>Need immediate help?</strong>
              <p style={{ color: "var(--muted)", fontSize: 13, margin: "5px 0 0" }}>
                Contact your local emergency service or an on-duty welfare professional if you are in immediate danger.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer style={{ marginTop: 28 }}>
        <div
          style={{
            color: "var(--muted)",
            fontSize: 13,
          }}
        >
          © ManRaksh — Risk intelligence for
          proactive welfare
        </div>

        <div>
          <a
            href="https://manraksh.vercel.app/"
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
            <img src="/ManRaksh_logo.png" alt="ManRaksh logo" />
            <span>ManRaksh</span>
          </div>

          <div className="nav-links">
            <a href="#how">How it works</a>
            <a href="#about">About</a>
            <a href="https://manraksh.vercel.app/" target="_blank" rel="noreferrer">Explore Platform</a>
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
      ManRaksh uses predictive intelligence to recognize changing
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
        THE MANRAKSH APPROACH
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
    HOW MANRAKSH WORKS
  </div>

  <h2>
    Risk Intelligence <span>and Platform</span>
  </h2>

  <p className="section-intro">
    ManRaksh combines predictive analytics with welfare-focused
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