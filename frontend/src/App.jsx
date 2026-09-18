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
    let end = Math.min(
      arr.length - 1,
      i + Math.floor(windowSize / 2)
    );

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
    const x =
      padding +
      (i / (data.length - 1)) * (width - padding * 2);

    const y =
      padding +
      ((max - v) / (max - min || 1)) *
        (height - padding * 2);

    return [x, y];
  });

  let pathD = "";

  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i];

    if (i === 0) {
      pathD += `M ${x} ${y}`;
    } else {
      const [px, py] = points[i - 1];
      const cx = (px + x) / 2;
      const cy = (py + y) / 2;

      pathD += ` Q ${px} ${py} ${cx} ${cy}`;

      if (i === points.length - 1) {
        pathD += ` T ${x} ${y}`;
      }
    }
  }

  const areaD =
    `M ${points[0][0]} ${height - padding} ` +
    points
      .map((p) => `L ${p[0]} ${p[1]}`)
      .join(" ") +
    ` L ${points[points.length - 1][0]} ${
      height - padding
    } Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      aria-hidden
    >
      <defs>
        <linearGradient
          id="areaGrad"
          x1="0"
          x2="0"
          y1="0"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="#8FC7D4"
            stopOpacity="0.22"
          />
          <stop
            offset="1"
            stopColor="#8FC7D4"
            stopOpacity="0.04"
          />
        </linearGradient>
      </defs>

      <path
        d={areaD}
        fill="url(#areaGrad)"
        stroke="none"
      />

      <path
        d={pathD}
        stroke="#2C5E62"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r={i === points.length - 1 ? 4.5 : 2.5}
          fill={
            i === points.length - 1
              ? "#E89D52"
              : "#2C5E62"
          }
        />
      ))}

      <text
        x={padding}
        y={height - 2}
        fontSize="10"
        fill="#58717A"
      >
        -30d
      </text>

      <text
        x={width / 2 - 14}
        y={height - 2}
        fontSize="10"
        fill="#58717A"
      >
        -15d
      </text>

      <text
        x={width - padding - 34}
        y={height - 2}
        fontSize="10"
        fill="#58717A"
      >
        Today
      </text>
    </svg>
  );
}

/* =========================
   Welfare Officer Dashboard
   ========================= */

function WelfareOfficerDashboardInline({ sampleData }) {
  const personnelTotal = sampleData?.total || 248;
  const low = sampleData?.low || 181;
  const moderate = sampleData?.moderate || 49;
  const elevated = sampleData?.elevated || 18;

  const trend =
    sampleData?.trend ||
    (() => {
      const arr = [];

      for (let i = 0; i < 30; i++) {
        const base =
          30 +
          Math.sin(i / 3) * 4 +
          i * 0.6;

        arr.push(Math.round(base * 10) / 10);
      }

      return arr;
    })();

  const priorityList = sampleData?.priority || [
    {
      id: "P1042",
      risk: "Moderate",
      reason: "Deployment duration",
    },
    {
      id: "P1087",
      risk: "Elevated",
      reason: "Night-duty frequency",
    },
    {
      id: "P1121",
      risk: "Elevated",
      reason: "Workload variation",
    },
    {
      id: "P1154",
      risk: "Moderate",
      reason: "Leave gap",
    },
  ];

  const explainable = sampleData?.factors || [
    {
      name: "Prolonged deployment",
      impact: "+18%",
    },
    {
      name: "Night-duty frequency",
      impact: "+14%",
    },
    {
      name: "Workload variation",
      impact: "+12%",
    },
  ];

  return (
    <div
      className="dashboard"
      style={{ paddingTop: 24 }}
    >
      <div
        className="dashboard-heading"
        style={{
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div>
          <h1>Welfare Intelligence Dashboard</h1>

          <p
            style={{
              marginTop: 6,
              color: "var(--muted)",
            }}
          >
            Overview for Welfare Officers — monitor
            trends, prioritize human review, and act
            confidentially.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div
            className="status-badge"
            style={{ padding: "8px 12px" }}
          >
            <span />
            Role: Welfare Officer
          </div>
        </div>
      </div>

      <div
        className="stats-grid"
        style={{ marginTop: 18 }}
      >
        <div className="stat-card">
          <span>Total Personnel</span>
          <strong>{personnelTotal}</strong>
          <small>Monitored profiles</small>
        </div>

        <div className="stat-card">
          <span>Low Risk</span>
          <strong>{low}</strong>
          <small>
            {Math.round(
              (low / personnelTotal) * 100
            )}
            % of personnel
          </small>
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

      <div
        className="dashboard-grid"
        style={{ marginTop: 22 }}
      >
        <div
          className="dashboard-card"
          style={{ padding: 18 }}
        >
          <div className="card-header">
            <div>
              <small>RISK TREND</small>
              <h2>Risk Trend (Last 30 days)</h2>
            </div>

            <div className="card-label">
              Overview
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <LineChart
              data={trend}
              width={560}
              height={140}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 14,
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--muted)",
                }}
              >
                Risk Distribution (Current)
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 8,
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div className="bar-info">
                    <div>Low</div>

                    <div>
                      <strong>
                        {Math.round(
                          (low / personnelTotal) * 100
                        )}
                        %
                      </strong>
                    </div>
                  </div>

                  <div className="bar">
                    <div
                      className="bar-fill low"
                      style={{
                        width: `${Math.round(
                          (low / personnelTotal) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div className="bar-info">
                    <div>Moderate</div>

                    <div>
                      <strong>
                        {Math.round(
                          (moderate / personnelTotal) * 100
                        )}
                        %
                      </strong>
                    </div>
                  </div>

                  <div className="bar">
                    <div
                      className="bar-fill moderate"
                      style={{
                        width: `${Math.round(
                          (moderate / personnelTotal) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div className="bar-info">
                    <div>Elevated</div>

                    <div>
                      <strong>
                        {Math.round(
                          (elevated / personnelTotal) * 100
                        )}
                        %
                      </strong>
                    </div>
                  </div>

                  <div className="bar">
                    <div
                      className="bar-fill elevated"
                      style={{
                        width: `${Math.round(
                          (elevated / personnelTotal) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ width: 160 }}>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--muted)",
                }}
              >
                Quick actions
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <button className="primary-button">
                  Schedule Check-in
                </button>

                <button className="secondary-button">
                  Review Support Options
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            className="dashboard-card"
            style={{ padding: 18 }}
          >
            <div className="card-header">
              <div>
                <small>PRIORITY ATTENTION</small>
                <h2>Human Review</h2>
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              {priorityList.map((p) => (
                <div
                  key={p.id}
                  className="person-row"
                  style={{ padding: "10px 0" }}
                >
                  <div className="person-id">
                    {p.id}
                  </div>

                  <div
                    style={{
                      color: "var(--muted)",
                    }}
                  >
                    {p.reason}
                  </div>

                  <div
                    className={`risk ${
                      p.risk.toLowerCase() ===
                      "elevated"
                        ? "elevated"
                        : "moderate"
                    }`}
                  >
                    {p.risk}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="dashboard-card ai-card"
            style={{ padding: 18 }}
          >
            <div className="card-header">
              <div>
                <small>
                  WHY IS RISK CHANGING
                </small>

                <h2>Explainable AI</h2>
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              {explainable.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    padding: "10px 0",
                    borderBottom:
                      "1px solid rgba(44,94,98,0.08)",
                  }}
                >
                  <div
                    style={{
                      color: "var(--muted)",
                    }}
                  >
                    {f.name}
                  </div>

                  <div
                    style={{
                      fontWeight: 800,
                      color: "var(--blue)",
                    }}
                  >
                    {f.impact}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 12 }}>
                <h3 style={{ margin: "8px 0" }}>
                  Recommended Next Step
                </h3>

                <p
                  style={{
                    color: "var(--muted)",
                    marginTop: 6,
                  }}
                >
                  Human-led welfare intervention.
                  Prioritize elevated cases for
                  confidential outreach and schedule
                  follow-ups.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 10,
                  }}
                >
                  <button className="primary-button">
                    Schedule Check-in
                  </button>

                  <button className="secondary-button">
                    Review Support Options
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="dashboard-card"
            style={{ padding: 14 }}
          >
            <div
              style={{
                fontSize: 12,
                color: "var(--muted)",
              }}
            >
              <strong>Privacy note</strong>

              <p style={{ marginTop: 8 }}>
                Data is anonymized and access is
                role-based. AI predictions are advisory
                and do not replace professional assessment
                or make punitive decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   LOGIN / SIGNUP
   ========================================================= */

function LoginSignup({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((s) => ({
      ...s,
      [name]: value,
    }));

    setError("");
  }

  function handleBlur(e) {
    const { name } = e.target;

    setTouched((t) => ({
      ...t,
      [name]: true,
    }));
  }

  function validate() {
    if (
      !form.email ||
      !/\S+@\S+\.\S+/.test(form.email)
    ) {
      return "Enter a valid email";
    }

    if (
      !form.password ||
      form.password.length < 6
    ) {
      return "Password must be at least 6 characters";
    }

    if (mode === "signup" && !form.name) {
      return "Please enter your name";
    }

    return "";
  }

  function doLogin(e) {
    e.preventDefault();

    const v = validate();

    if (v) {
      setError(v);
      return;
    }

    const role = form.email.includes("officer")
      ? "officer"
      : form.email.includes("commander")
      ? "commander"
      : form.role || "user";

    onLogin({
      name:
        form.name ||
        form.email.split("@")[0],
      email: form.email,
      role,
    });

    onClose();
  }

  function doSignup(e) {
    e.preventDefault();

    const v = validate();

    if (v) {
      setError(v);
      return;
    }

    onLogin({
      name: form.name,
      email: form.email,
      role: form.role || "user",
    });

    onClose();
  }

  function switchMode(newMode) {
    setMode(newMode);
    setError("");
    setTouched({});
  }

  return (
    <div
      className="auth-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <div className="auth-split-card">

        {/* LEFT DIAGONAL PANEL */}

        <div className="auth-welcome-panel">

          <button
            className="auth-close-button"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>

          <div className="auth-welcome-content">

            {mode === "login" ? (
              <>
                <h1>Welcome!</h1>

                <p>
                  Create your account.
                  <br />
                  For Free!
                </p>

                <button
                  type="button"
                  className="auth-outline-button"
                  onClick={() =>
                    switchMode("signup")
                  }
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <h1>Welcome Back!</h1>

                <p>
                  Already have an
                  <br />
                  account?
                </p>

                <button
                  type="button"
                  className="auth-outline-button"
                  onClick={() =>
                    switchMode("login")
                  }
                >
                  Sign In
                </button>
              </>
            )}

          </div>
        </div>


        {/* RIGHT FORM PANEL */}

        <div className="auth-form-panel">

          <div className="auth-form-container">

            <h2 id="auth-title">
              {mode === "login"
                ? "Login"
                : "Create Account"}
            </h2>

            <p className="auth-subtitle">
              {mode === "login"
                ? "Sign in to continue"
                : "Create your account to get started"}
            </p>


            <form
              className="auth-clean-form"
              onSubmit={
                mode === "login"
                  ? doLogin
                  : doSignup
              }
              noValidate
            >

              {/* NAME */}

              {mode === "signup" && (
                <label className="auth-field">

                  <span>Full Name</span>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your full name"
                  />

                  {touched.name &&
                    !form.name && (
                      <small className="auth-field-error">
                        Name is required
                      </small>
                    )}

                </label>
              )}


              {/* EMAIL */}

              <label className="auth-field">

                <span>
                  Email Address <b>*</b>
                </span>

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                />

                {touched.email &&
                  !/\S+@\S+\.\S+/.test(
                    form.email
                  ) && (
                    <small className="auth-field-error">
                      Enter a valid email
                    </small>
                  )}

              </label>


              {/* PASSWORD */}

              <label className="auth-field">

                <span>
                  Password <b>*</b>
                </span>

                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your password"
                />

                {touched.password &&
                  form.password.length < 6 && (
                    <small className="auth-field-error">
                      Password must be at least 6 characters
                    </small>
                  )}

              </label>


              {/* ROLE */}

              {mode === "signup" && (
                <label className="auth-field">

                  <span>Role</span>

                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="user">
                      Personnel
                    </option>

                    <option value="officer">
                      Welfare Officer
                    </option>

                    <option value="commander">
                      Commander
                    </option>
                  </select>

                </label>
              )}


              {/* ERROR */}

              {error && (
                <div
                  className="auth-form-error"
                  role="alert"
                >
                  {error}
                </div>
              )}


              {/* SUBMIT */}

              <button
                className="auth-submit-button"
                type="submit"
              >
                {mode === "login"
                  ? "Sign In"
                  : "Create Account"}
              </button>


              {/* FORGOT PASSWORD */}

              {mode === "login" && (
                <button
                  type="button"
                  className="auth-forgot-button"
                  onClick={() => {}}
                >
                  Forgot password?
                </button>
              )}

            </form>


            <div className="auth-terms">
              By continuing, you agree to our{" "}
              <a href="#terms">Terms</a> and{" "}
              <a href="#privacy">Privacy</a>.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}


/* =========================================================
   MAIN APP
   ========================================================= */

export default function App() {

  const [showDashboard, setShowDashboard] =
    useState(true);

  const [authUser, setAuthUser] =
    useState(null);

  const [showAuth, setShowAuth] =
    useState(false);

  const [dashboardTab, setDashboardTab] =
    useState("overview");

  const [platformSelection, setPlatformSelection] =
    useState(null);


  /* =====================================================
     30 DAY PROJECTION
     ===================================================== */

  const raw = (() => {
    const arr = [];
    const seed = 12345;
    let rnd = seed;

    function rand() {
      rnd =
        (rnd * 9301 + 49297) % 233280;

      return rnd / 233280;
    }

    for (let i = 0; i < 30; i++) {

      const weekly =
        Math.sin(
          (i / 7) * Math.PI * 2
        ) * 3;

      const trend = i * 0.45;

      const noise =
        (rand() - 0.5) * 4;

      const value =
        45 + weekly + trend + noise;

      arr.push(
        Math.round(value * 10) / 10
      );
    }

    return arr;
  })();


  const projection = smoothArray(
    raw,
    5
  ).map(
    (v) =>
      Math.round(v * 10) / 10
  );


  const topFactors = [
    {
      name: "Prolonged deployment",
      impact: "+18%",
    },
    {
      name: "Sleep disruption",
      impact: "+12%",
    },
    {
      name: "Reduced social interaction",
      impact: "+9%",
    },
  ];


  /* =====================================================
     DEMO DATA
     ===================================================== */

  window.priorityList =
    window.priorityList || [
      {
        id: "P1042",
        risk: "Moderate",
        reason: "Deployment duration",
      },
      {
        id: "P1087",
        risk: "Elevated",
        reason: "Night-duty frequency",
      },
      {
        id: "P1121",
        risk: "Elevated",
        reason: "Workload variation",
      },
      {
        id: "P1154",
        risk: "Moderate",
        reason: "Leave gap",
      },
    ];


  window.explainable =
    window.explainable || [
      {
        name: "Prolonged deployment",
        impact: "+18%",
      },
      {
        name: "Night-duty frequency",
        impact: "+14%",
      },
      {
        name: "Workload variation",
        impact: "+12%",
      },
    ];


  /* =====================================================
     AUTH EFFECT
     ===================================================== */

  useEffect(() => {

    if (
      authUser &&
      authUser.role === "officer"
    ) {
      setDashboardTab("welfare");
      setPlatformSelection(null);
    }

  }, [authUser]);


  function handleLogin(user) {
    setAuthUser(user);
  }


  function handleLogout() {

    setAuthUser(null);

    setDashboardTab("overview");

    setPlatformSelection(null);
  }


  /* =====================================================
     DASHBOARD
     ===================================================== */

  if (showDashboard) {

    return (
      <div className="app">

        <div className="dashboard-screen">

          {/* NAVBAR */}

          <nav className="dashboard-nav">

            <div className="logo">

              <img
                src="/ManRaksha_logo.png"
                alt="ManRaksha logo"
              />

              <span>ManRaksha</span>

            </div>


            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >

              <div className="dashboard-title">
                Risk Intelligence
              </div>


              <a
                className="secondary-button"
                href="https://manraksha-app.vercel.app/"
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Explore Platform
              </a>


              {!authUser ? (

                <button
                  className="primary-button"
                  onClick={() =>
                    setShowAuth(true)
                  }
                >
                  Login / Sign up
                </button>

              ) : (

                <>
                  <div
                    style={{
                      color: "var(--muted)",
                      fontSize: 13,
                    }}
                  >
                    {authUser.name} (
                    {authUser.role})
                  </div>

                  <button
                    className="secondary-button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>

              )}


              <button
                className="secondary-button"
                onClick={() =>
                  setShowDashboard(false)
                }
                aria-label="Back to landing"
              >
                Back
              </button>

            </div>

          </nav>


          {/* DASHBOARD TABS */}

          <div
            style={{
              width: "90%",
              maxWidth: 1200,
              margin: "18px auto 0",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >

            <div
              style={{
                display: "flex",
                gap: 8,
              }}
            >

              <button
                className={
                  dashboardTab === "overview"
                    ? "primary-button"
                    : "secondary-button"
                }
                onClick={() => {
                  setDashboardTab("overview");
                  setPlatformSelection(null);
                }}
              >
                Overview
              </button>


              <button
                className={
                  dashboardTab === "enter"
                    ? "primary-button"
                    : "secondary-button"
                }
                onClick={() => {
                  setDashboardTab("enter");
                  setPlatformSelection(null);
                }}
              >
                Enter Platform
              </button>

            </div>


            <div
              style={{
                marginLeft: "auto",
                color: "var(--muted)",
              }}
            >
              {dashboardTab === "overview"
                ? "General risk overview"
                : "Choose a role to enter the platform"}
            </div>

          </div>


          {/* TAB CONTENT */}

          <div style={{ marginTop: 12 }}>

            {dashboardTab === "enter" ? (

              /* =================================================
                 ENTER PLATFORM
                 ================================================= */

              <div
                className="dashboard"
                style={{ paddingTop: 12 }}
              >

                <div
                  style={{
                    width: "90%",
                    maxWidth: 1200,
                    margin: "0 auto 18px",
                  }}
                >

                  <h1
                    style={{
                      margin: "8px 0 6px",
                    }}
                  >
                    Enter Platform
                  </h1>

                  <p
                    style={{
                      margin: 0,
                      color: "var(--muted)",
                    }}
                  >
                    Select your role to continue
                    into the platform
                  </p>

                </div>


                {/* ROLE CARDS */}

                <div
                  style={{
                    width: "90%",
                    maxWidth: 1200,
                    margin: "18px auto",
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(3, 1fr)",
                    gap: 18,
                  }}
                >

                  {/* PERSONNEL */}

                  <div
                    className="role-card"
                    style={{ padding: 22 }}
                  >

                    <div
                      className="role-icon"
                      style={{
                        background: "#F3E8FF",
                        color: "#6B2FA3",
                      }}
                    >
                      👤
                    </div>

                    <h2
                      style={{
                        marginTop: 12,
                      }}
                    >
                      Personnel
                    </h2>

                    <p
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      Access personal wellness
                      insights, self-assessments,
                      support resources and
                      wellbeing guidance.
                    </p>

                    <div
                      style={{ marginTop: 12 }}
                    >
                      <button
                        className="primary-button"
                        onClick={() =>
                          setPlatformSelection(
                            "personnel"
                          )
                        }
                      >
                        Continue →
                      </button>
                    </div>

                  </div>


                  {/* WELFARE OFFICER */}

                  <div
                    className="role-card"
                    style={{ padding: 22 }}
                  >

                    <div
                      className="role-icon"
                      style={{
                        background: "#E8F7FB",
                        color: "#1E6B73",
                      }}
                    >
                      🛡️
                    </div>

                    <h2
                      style={{
                        marginTop: 12,
                      }}
                    >
                      Welfare Officer
                    </h2>

                    <p
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      Monitor welfare indicators,
                      understand risk factors and
                      support early human-led
                      intervention.
                    </p>

                    <div
                      style={{ marginTop: 12 }}
                    >
                      <button
                        className="primary-button"
                        onClick={() => {
                          setPlatformSelection(
                            "welfare"
                          );

                          setDashboardTab(
                            "enter"
                          );
                        }}
                      >
                        Continue →
                      </button>
                    </div>

                  </div>


                  {/* ADMINISTRATOR */}

                  <div
                    className="role-card"
                    style={{ padding: 22 }}
                  >

                    <div
                      className="role-icon"
                      style={{
                        background: "#FFF6E8",
                        color: "#A85F2E",
                      }}
                    >
                      📊
                    </div>

                    <h2
                      style={{
                        marginTop: 12,
                      }}
                    >
                      Administrator
                    </h2>

                    <p
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      View aggregate welfare trends,
                      workload patterns and
                      system-level analytics.
                    </p>

                    <div
                      style={{ marginTop: 12 }}
                    >
                      <button
                        className="primary-button"
                        onClick={() =>
                          setPlatformSelection(
                            "admin"
                          )
                        }
                      >
                        Continue →
                      </button>
                    </div>

                  </div>

                </div>


                {/* PLATFORM SELECTION RESULT */}

                <div
                  style={{
                    width: "90%",
                    maxWidth: 1200,
                    margin: "18px auto",
                  }}
                >

                  {platformSelection ===
                  "welfare" ? (

                    <div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          marginBottom: 12,
                        }}
                      >

                        <h2
                          style={{ margin: 0 }}
                        >
                          Welfare Officer —
                          Workspace
                        </h2>

                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                          }}
                        >
                          <button
                            className="secondary-button"
                            onClick={() =>
                              setPlatformSelection(
                                null
                              )
                            }
                          >
                            Back to roles
                          </button>
                        </div>

                      </div>

                      <WelfareOfficerDashboardInline />

                    </div>

                  ) : platformSelection ===
                    "personnel" ? (

                    <div
                      className="dashboard-card"
                      style={{ padding: 18 }}
                    >
                      <h3>
                        Personnel portal
                      </h3>

                      <p
                        style={{
                          color:
                            "var(--muted)",
                        }}
                      >
                        Personal wellness
                        insights and self-reporting
                        tools will appear here.
                      </p>
                    </div>

                  ) : platformSelection ===
                    "admin" ? (

                    <div
                      className="dashboard-card"
                      style={{ padding: 18 }}
                    >
                      <h3>
                        Administrator portal
                      </h3>

                      <p
                        style={{
                          color:
                            "var(--muted)",
                        }}
                      >
                        System-level analytics
                        and workload dashboards
                        will appear here.
                      </p>
                    </div>

                  ) : (

                    <div
                      className="dashboard-card"
                      style={{ padding: 18 }}
                    >
                      <p
                        style={{
                          color:
                            "var(--muted)",
                        }}
                      >
                        Choose a role card above
                        to enter the platform.
                      </p>
                    </div>

                  )}

                </div>

              </div>

            ) : dashboardTab ===
              "welfare" ? (

              /* =================================================
                 WELFARE TAB
                 ================================================= */

              <div style={{ marginTop: 12 }}>
                <WelfareOfficerDashboardInline />
              </div>

            ) : (

              /* =================================================
                 OVERVIEW
                 ================================================= */

              <div
                className="dashboard"
                style={{ paddingTop: 12 }}
              >

                <div
                  style={{
                    width: "90%",
                    maxWidth: 1200,
                    margin: "0 auto 18px",
                  }}
                >

                  <h1
                    style={{
                      margin: "8px 0 6px",
                    }}
                  >
                    Welcome to ManRaksha
                  </h1>

                  <p
                    style={{
                      margin: 0,
                      color: "var(--muted)",
                    }}
                  >
                    AI-driven welfare intelligence
                    for proactive, confidential
                    support
                  </p>

                </div>


                <div
                  className="dashboard-heading"
                  style={{ marginTop: 12 }}
                >

                  <div>

                    <h2
                      style={{
                        margin: 0,
                        color: "var(--muted)",
                        fontSize: 16,
                      }}
                    >
                      Live risk projection and
                      contributing factors
                    </h2>

                  </div>


                  <div className="status-badge">
                    <span />
                    Live Preview
                  </div>

                </div>


                {/* PROJECTION + AI */}

                <div className="dashboard-grid">

                  <div
                    className="dashboard-card"
                    style={{ padding: 18 }}
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                      }}
                    >

                      <div>

                        <small>
                          30 DAY PROJECTION
                        </small>

                        <h2
                          style={{
                            marginTop: 6,
                          }}
                        >
                          Risk Projection
                          (30 days)
                        </h2>

                        <div
                          style={{
                            marginTop: 6,
                            background:
                              "rgba(255,255,255,0.9)",
                            padding:
                              "8px 12px",
                            borderRadius: 10,
                            display:
                              "inline-block",
                            border:
                              "1px solid rgba(44,94,98,0.08)",
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
                              color:
                                "var(--muted)",
                              fontSize: 13,
                            }}
                          >
                            Aggregated risk score
                            based on recent
                            signals
                          </span>

                        </div>

                      </div>


                      <div
                        className="risk-card"
                        style={{
                          alignItems:
                            "center",
                          padding:
                            "10px 14px",
                        }}
                      >

                        <div>

                          <small>
                            CURRENT PROJECTION
                          </small>

                          <strong
                            style={{
                              fontSize: 28,
                            }}
                          >
                            {
                              projection[
                                projection.length -
                                  1
                              ]
                            }
                            %
                          </strong>

                        </div>

                      </div>

                    </div>


                    <div
                      style={{ marginTop: 8 }}
                    >
                      <LineChart
                        data={projection}
                      />
                    </div>


                    <div
                      className="chart-labels"
                      style={{
                        marginTop: 10,
                      }}
                    >

                      <div
                        style={{
                          fontSize: 13,
                          color:
                            "var(--muted)",
                        }}
                      >
                        Lower risk
                      </div>

                      <div
                        style={{
                          fontSize: 13,
                          color:
                            "var(--muted)",
                        }}
                      >
                        Higher risk
                      </div>

                    </div>

                  </div>


                  {/* AI CARD */}

                  <div
                    className="dashboard-card ai-card"
                    style={{ padding: 18 }}
                  >

                    <div className="card-header">

                      <div>

                        <small>
                          TOP CONTRIBUTING
                          FACTORS
                        </small>

                        <h2
                          style={{
                            marginTop: 6,
                          }}
                        >
                          Top factors
                        </h2>

                      </div>

                    </div>


                    <div
                      className="factors"
                      style={{ marginTop: 8 }}
                    >

                      {topFactors.map(
                        (f, idx) => (

                          <div
                            key={idx}
                            className="factor"
                            style={{
                              padding:
                                "8px 0",
                            }}
                          >

                            <div
                              style={{
                                fontWeight: 700,
                              }}
                            >
                              {f.name}
                            </div>

                            <div
                              style={{
                                color:
                                  "var(--blue)",
                                fontWeight: 800,
                              }}
                            >
                              {f.impact}
                            </div>

                          </div>

                        )
                      )}

                    </div>


                    <div
                      style={{ marginTop: 12 }}
                    >

                      <h3
                        style={{
                          margin:
                            "8px 0",
                        }}
                      >
                        AI Insight
                      </h3>

                      <p
                        className="ai-description"
                        style={{
                          marginTop: 6,
                        }}
                      >
                        The model indicates a
                        steady upward trend in
                        aggregated risk driven
                        primarily by prolonged
                        deployments and sleep
                        disruption signals.
                        Recommend confidential
                        outreach for flagged
                        personnel and anonymized
                        case review by authorized
                        welfare officers.
                      </p>


                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          marginTop: 10,
                        }}
                      >

                        <button className="primary-button">
                          Open recommended
                          actions
                        </button>

                        <button className="secondary-button">
                          Export anonymized
                          summary
                        </button>

                      </div>

                    </div>

                  </div>

                </div>


                {/* RECOMMENDED ACTION */}

                <div style={{ marginTop: 22 }}>

                  <div
                    className="dashboard-card action-card"
                    style={{
                      padding: 18,
                      alignItems:
                        "flex-start",
                      display: "flex",
                      gap: 18,
                    }}
                  >

                    <div style={{ flex: 1 }}>

                      <h2
                        style={{
                          margin:
                            "0 0 8px 0",
                        }}
                      >
                        Recommended action
                      </h2>

                      <p
                        style={{
                          marginTop: 0,
                          color:
                            "var(--muted)",
                        }}
                      >
                        Prioritize confidential
                        outreach to personnel
                        with elevated risk. Use
                        role-based access to view
                        case details. Ensure all
                        exports are anonymized.
                      </p>


                      <div
                        style={{
                          marginTop: 14,
                          display: "flex",
                          flexDirection:
                            "column",
                          gap: 10,
                        }}
                      >

                        {/* ITEM 1 */}

                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems:
                              "flex-start",
                            padding: 10,
                            borderRadius: 12,
                            background:
                              "rgba(255,255,255,0.9)",
                            border:
                              "1px solid rgba(44,94,98,0.06)",
                          }}
                        >

                          <div
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 12,
                              background:
                                "linear-gradient(180deg,#FBE38E,#FFD66A)",
                              boxShadow:
                                "0 4px 12px rgba(44,94,98,0.06)",
                              marginTop: 6,
                            }}
                          />

                          <div>

                            <strong
                              style={{
                                color:
                                  "var(--text)",
                                display:
                                  "block",
                                fontSize: 15,
                              }}
                            >
                              Prioritize Rest &
                              Sleep
                            </strong>

                            <div
                              style={{
                                color:
                                  "var(--muted)",
                                fontSize: 13,
                                marginTop: 4,
                              }}
                            >
                              Encourage rest plans
                              and monitor sleep
                              disruption signals
                            </div>

                          </div>

                        </div>


                        {/* ITEM 2 */}

                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems:
                              "flex-start",
                            padding: 10,
                            borderRadius: 12,
                            background:
                              "rgba(255,255,255,0.9)",
                            border:
                              "1px solid rgba(44,94,98,0.06)",
                          }}
                        >

                          <div
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 12,
                              background:
                                "linear-gradient(180deg,#DCEFF3,#8FC7D4)",
                              boxShadow:
                                "0 4px 12px rgba(44,94,98,0.06)",
                              marginTop: 6,
                            }}
                          />

                          <div>

                            <strong
                              style={{
                                color:
                                  "var(--text)",
                                display:
                                  "block",
                                fontSize: 15,
                              }}
                            >
                              Review Workload
                            </strong>

                            <div
                              style={{
                                color:
                                  "var(--muted)",
                                fontSize: 13,
                                marginTop: 4,
                              }}
                            >
                              Assess task
                              distribution and
                              reduce acute
                              workload spikes
                            </div>

                          </div>

                        </div>


                        {/* ITEM 3 */}

                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems:
                              "flex-start",
                            padding: 10,
                            borderRadius: 12,
                            background:
                              "rgba(255,255,255,0.9)",
                            border:
                              "1px solid rgba(44,94,98,0.06)",
                          }}
                        >

                          <div
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 12,
                              background:
                                "linear-gradient(180deg,#FFF6E8,#F7E0C2)",
                              boxShadow:
                                "0 4px 12px rgba(44,94,98,0.06)",
                              marginTop: 6,
                            }}
                          />

                          <div>

                            <strong
                              style={{
                                color:
                                  "var(--text)",
                                display:
                                  "block",
                                fontSize: 15,
                              }}
                            >
                              Explore Support
                              Options
                            </strong>

                            <div
                              style={{
                                color:
                                  "var(--muted)",
                                fontSize: 13,
                                marginTop: 4,
                              }}
                            >
                              Share available
                              counselling and
                              peer-support
                              resources
                            </div>

                          </div>

                        </div>


                        {/* ITEM 4 */}

                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems:
                              "flex-start",
                            padding: 10,
                            borderRadius: 12,
                            background:
                              "rgba(255,255,255,0.9)",
                            border:
                              "1px solid rgba(44,94,98,0.06)",
                          }}
                        >

                          <div
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 12,
                              background:
                                "linear-gradient(180deg,#EAF3F4,#CFEFF2)",
                              boxShadow:
                                "0 4px 12px rgba(44,94,98,0.06)",
                              marginTop: 6,
                            }}
                          />

                          <div>

                            <strong
                              style={{
                                color:
                                  "var(--text)",
                                display:
                                  "block",
                                fontSize: 15,
                              }}
                            >
                              Complete a
                              Wellbeing
                              Check-in
                            </strong>

                            <div
                              style={{
                                color:
                                  "var(--muted)",
                                fontSize: 13,
                                marginTop: 4,
                              }}
                            >
                              Quick self-report to
                              capture current
                              state and flags
                            </div>

                          </div>

                        </div>


                        {/* ITEM 5 */}

                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems:
                              "flex-start",
                            padding: 10,
                            borderRadius: 12,
                            background:
                              "rgba(255,255,255,0.9)",
                            border:
                              "1px solid rgba(44,94,98,0.06)",
                          }}
                        >

                          <div
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 12,
                              background:
                                "linear-gradient(180deg,#FFEFE6,#FFD6B8)",
                              boxShadow:
                                "0 4px 12px rgba(44,94,98,0.06)",
                              marginTop: 6,
                            }}
                          />

                          <div>

                            <strong
                              style={{
                                color:
                                  "var(--text)",
                                display:
                                  "block",
                                fontSize: 15,
                              }}
                            >
                              Talk to a Support
                              Professional
                            </strong>

                            <div
                              style={{
                                color:
                                  "var(--muted)",
                                fontSize: 13,
                                marginTop: 4,
                              }}
                            >
                              Offer confidential
                              referral to trained
                              welfare staff
                            </div>

                          </div>

                        </div>

                      </div>

                    </div>


                    <div
                      style={{
                        marginLeft: 18,
                        display: "flex",
                        flexDirection:
                          "column",
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


                {/* FOOTER */}

                <footer
                  style={{ marginTop: 28 }}
                >

                  <div
                    style={{
                      color:
                        "var(--muted)",
                      fontSize: 13,
                    }}
                  >
                    © ManRaksha — Risk
                    intelligence for proactive
                    welfare
                  </div>

                  <div>

                    <a
                      href="https://manraksha-app.vercel.app/"
                      target="_blank"
                      rel="noreferrer"
                      className="secondary-button"
                      style={{
                        textDecoration:
                          "none",
                      }}
                    >
                      Open live demo
                    </a>

                  </div>

                </footer>

              </div>
            )}

          </div>


          {/* =================================================
             LOGIN / SIGNUP MODAL
             
             IMPORTANT:
             This is OUTSIDE the tab content so the modal
             works from the whole dashboard.
             ================================================= */}

          {showAuth && (
            <LoginSignup
              onClose={() =>
                setShowAuth(false)
              }
              onLogin={handleLogin}
            />
          )}

        </div>

      </div>
    );
  }


  /* =========================================================
     LANDING / PLATFORM SCREEN
     ========================================================= */

  return (
    <div className="app">

      <div className="platform-screen">

        {/* NAVBAR */}

        <nav className="navbar">

          <div className="logo">

            <img
              src="/ManRaksha_logo.png"
              alt="ManRaksha logo"
            />

            <span>ManRaksha</span>

          </div>


          <div className="nav-links">

            <a href="#how">
              How it works
            </a>

            <a href="#about">
              About
            </a>

            <a
              href="https://manraksha-app.vercel.app/"
              target="_blank"
              rel="noreferrer"
            >
              Explore Platform
            </a>

          </div>


          <div>

            <button
              className="nav-button"
              onClick={() =>
                setShowDashboard(true)
              }
            >
              Open Dashboard
            </button>

          </div>

        </nav>


        {/* HERO */}

        <section className="hero">

          <div
            className="hero-content"
            style={{
              padding: "80px 6%",
            }}
          >

            <h1>
              AI-POWERED{" "}
              <span>
                Detect. Support Privately.
                Protect Always.
              </span>
            </h1>


            <p>
              ManRaksha uses predictive AI to
              identify changing welfare patterns
              and support early, human-led
              intervention for uniformed
              personnel.
            </p>


            <div className="hero-buttons">

              <button
                className="primary-button"
                onClick={() =>
                  setShowDashboard(true)
                }
              >
                Try Dashboard
              </button>


              <a
                href="https://manraksha-app.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="secondary-button"
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Explore Platform
              </a>

            </div>


            <div className="trust-line">
              Trusted by organizations focused on
              personnel welfare
            </div>

          </div>

        </section>


        {/* HOW IT WORKS */}

        <section
          id="how"
          className="problem-section"
        >

          <h2>
            Risk Intelligence{" "}
            <span>and Platform</span>
          </h2>

          <p>
            The platform identifies trends and
            risk factors while preserving dignity,
            confidentiality, and data protection.
            For a live reference, open the deployed
            demo via the Explore Platform link.
          </p>

        </section>


        {/* ABOUT */}

        <section
          id="about"
          className="about-section"
        >

          <h2>Preliminary Scope</h2>

          <p>
            Predictive analytics, mobile
            self-reporting, role-based dashboards,
            anonymized datasets, and secure
            integrations for HRMS and personnel
            systems.
          </p>

        </section>

      </div>

    </div>
  );
}
