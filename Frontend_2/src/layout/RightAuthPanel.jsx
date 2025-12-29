import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function ModeTabs({ mode, setMode }) {
  const items = useMemo(
    () => [
      { k: "login", label: "Login" },
      { k: "signup", label: "Sign up" },
      { k: "reset", label: "Reset" },
    ],
    []
  );

  return (
    <div className="modeTabs" role="tablist" aria-label="Authentication options">
      {items.map((it) => (
        <button
          key={it.k}
          type="button"
          className={`modeTab ${mode === it.k ? "active" : ""}`}
          onClick={() => setMode(it.k)}
          role="tab"
          aria-selected={mode === it.k}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

function AuthArea() {
  const navigate = useNavigate();
  const { user, loading, login, logout, register, requestPasswordReset } = useAuth();

  const [mode, setMode] = useState("login");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function withBusy(fn) {
    setErr("");
    setMsg("");
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      setErr(e?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function onLogin(e) {
    e.preventDefault();
    await withBusy(async () => {
      await login(username, password);
      setPassword("");
      setPassword2("");
    });
  }

  async function onSignup(e) {
    e.preventDefault();
    if (password !== password2) {
      setErr("Passwords do not match.");
      return;
    }

    await withBusy(async () => {
      const data = await register({ username, password, email: email || undefined });

      // If backend didn't auto-login, guide user to login.
      if (!data?.token) {
        setMsg("Account created. Please log in.");
        setMode("login");
        setPassword("");
        setPassword2("");
      }
    });
  }

  async function onReset(e) {
    e.preventDefault();
    await withBusy(async () => {
      await requestPasswordReset({ email });
      setMsg("If that email exists, a reset link has been sent.");
    });
  }

  if (loading) {
    return <div className="authArea">Checking session…</div>;
  }

  // ✅ Logged in: Profile + Logout only
  if (user) {
    return (
      <div className="authArea">
        <div style={{ marginBottom: 12 }}>
          <div className="fieldLabel">Signed in as</div>
          <div style={{ fontWeight: 700 }}>{user.username}</div>
        </div>

        <div className="authButtons" aria-label="Account actions">
          <button
            className="btn btnGhost"
            type="button"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>
          <button className="btn btnDanger" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  // ✅ Not logged in: Login / Sign up / Reset tabs
  return (
    <div className="authArea">
      <ModeTabs mode={mode} setMode={setMode} />

      {mode === "login" && (
        <form onSubmit={onLogin} style={{ marginTop: 12 }}>
          <label className="fieldLabel" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className="input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          <label className="fieldLabel" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {!!msg && (
            <div className="notice" style={{ marginTop: 10 }}>
              {msg}
            </div>
          )}
          {!!err && (
            <div className="error" style={{ marginTop: 10 }}>
              {err}
            </div>
          )}

          <div className="authRow" style={{ marginTop: 12 }}>
            <button className="btn" type="submit" disabled={busy || !username || !password}>
              {busy ? "Signing in…" : "Login"}
            </button>
          </div>
        </form>
      )}

      {mode === "signup" && (
        <form onSubmit={onSignup} style={{ marginTop: 12 }}>
          <label className="fieldLabel" htmlFor="su-username">
            Username
          </label>
          <input
            id="su-username"
            className="input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          <label className="fieldLabel" htmlFor="su-email">
            Email (optional)
          </label>
          <input
            id="su-email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <label className="fieldLabel" htmlFor="su-password">
            Password
          </label>
          <input
            id="su-password"
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          <label className="fieldLabel" htmlFor="su-password2">
            Confirm password
          </label>
          <input
            id="su-password2"
            className="input"
            placeholder="Confirm password"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            autoComplete="new-password"
          />

          {!!msg && (
            <div className="notice" style={{ marginTop: 10 }}>
              {msg}
            </div>
          )}
          {!!err && (
            <div className="error" style={{ marginTop: 10 }}>
              {err}
            </div>
          )}

          <div className="authRow" style={{ marginTop: 12 }}>
            <button
              className="btn"
              type="submit"
              disabled={busy || !username || !password || !password2}
            >
              {busy ? "Creating…" : "Create account"}
            </button>
          </div>
        </form>
      )}

      {mode === "reset" && (
        <form onSubmit={onReset} style={{ marginTop: 12 }}>
          <label className="fieldLabel" htmlFor="rp-email">
            Email
          </label>
          <input
            id="rp-email"
            className="input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          {!!msg && (
            <div className="notice" style={{ marginTop: 10 }}>
              {msg}
            </div>
          )}
          {!!err && (
            <div className="error" style={{ marginTop: 10 }}>
              {err}
            </div>
          )}

          <div className="authRow" style={{ marginTop: 12 }}>
            <button className="btn" type="submit" disabled={busy || !email}>
              {busy ? "Sending…" : "Send reset link"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function RightAuthPanel({ open, onToggle }) {
  return (
    <aside className={`rightPanel ${open ? "open" : "closed"}`} aria-label="Auth panel">
      <div className="rightPanelTop">
        {/* Toggle FIRST so it sits on the inner edge (left) */}
        <button className="miniBtn" onClick={onToggle} aria-label="Toggle auth panel">
          {open ? "⟩" : "⟨"}
        </button>

        <div className="rightPanelTitle">
          <span aria-hidden="true">🔒</span> {open ? "User Login" : ""}
        </div>
      </div>

      {open && <AuthArea />}
    </aside>
  );
}
