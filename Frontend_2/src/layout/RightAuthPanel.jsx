import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";

function AuthArea() {
  const { user, loading, login, logout } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login(username, password);
      setPassword("");
    } catch (e2) {
      setErr(e2?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div className="authArea">Checking session…</div>;
  }

  if (user) {
    return (
      <div className="authArea">
        <div style={{ marginBottom: 10 }}>
          <div className="fieldLabel">Signed in as</div>
          <div style={{ fontWeight: 700 }}>{user.username}</div>
        </div>

        <button className="btn" onClick={logout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <form className="authArea" onSubmit={onSubmit}>
      <label className="fieldLabel" htmlFor="username">Username</label>
      <input
        id="username"
        className="input"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
      />

      <label className="fieldLabel" htmlFor="password">Password</label>
      <input
        id="password"
        className="input"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />

      {err && <div style={{ marginTop: 10, color: "crimson" }}>{err}</div>}

      <div className="authRow" style={{ marginTop: 12 }}>
        <button className="btn" type="submit" disabled={busy || !username || !password}>
          {busy ? "Signing in…" : "Login"}
        </button>
      </div>
    </form>
  );
}

export default function RightAuthPanel({ open, onToggle }) {
  return (
    <aside className={`rightPanel ${open ? "open" : "closed"}`} aria-label="Auth panel">
      <div className="rightPanelTop">
        <div className="rightPanelTitle">
          <span aria-hidden="true">🔒</span> {open ? "User Login" : ""}
        </div>
        <button className="miniBtn" onClick={onToggle} aria-label="Toggle auth panel">
          {open ? "⟩" : "⟨"}
        </button>
      </div>

      {open && <AuthArea />}
    </aside>
  );
}
