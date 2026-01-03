import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();

  const {
    user,
    loading,
    login,
    logout,
    register,
    requestPasswordReset,
    confirmPasswordReset,
  } = useAuth();

  const [mode, setMode] = useState("login");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // Reset step-2 state (when coming from email link)
  const [resetUid, setResetUid] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

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

  // If the URL contains uid+token, switch reset tab into "set new password" mode
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const uid = params.get("uid");
    const token = params.get("token");

    if (uid && token) {
      setMode("reset");
      setResetUid(uid);
      setResetToken(token);
      setMsg("Set your new password below.");
      setErr("");
    } else {
      // Clear confirm-reset state if query params are removed
      setResetUid("");
      setResetToken("");
      setNewPassword("");
      setNewPassword2("");
    }
  }, [location.search]);

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

    // STEP 2: we have uid+token -> set new password
    if (resetUid && resetToken) {
      if (!newPassword || !newPassword2) {
        setErr("Please enter and confirm your new password.");
        return;
      }
      if (newPassword !== newPassword2) {
        setErr("Passwords do not match.");
        return;
      }

      await withBusy(async () => {
        await confirmPasswordReset({
          uid: resetUid,
          token: resetToken,
          newPassword,
        });

        setMsg("Password updated. You can now log in.");
        setMode("login");

        // Remove query params so refresh doesn't keep reset mode
        navigate(location.pathname, { replace: true });

        setResetUid("");
        setResetToken("");
        setNewPassword("");
        setNewPassword2("");
        setPassword("");
        setPassword2("");
      });

      return;
    }

    // STEP 1: no uid/token -> request reset email
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
          <button className="btn btnGhost" type="button" onClick={() => navigate("/profile")}>
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
            <button className="btn" type="submit" disabled={busy || !username || !password || !password2}>
              {busy ? "Creating…" : "Create account"}
            </button>
          </div>
        </form>
      )}

      {mode === "reset" && (
        <form onSubmit={onReset} style={{ marginTop: 12 }}>
          {resetUid && resetToken ? (
            <>
              <label className="fieldLabel" htmlFor="rp-new1">
                New password
              </label>
              <input
                id="rp-new1"
                className="input"
                placeholder="New password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />

              <label className="fieldLabel" htmlFor="rp-new2">
                Confirm new password
              </label>
              <input
                id="rp-new2"
                className="input"
                placeholder="Confirm new password"
                type="password"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                autoComplete="new-password"
              />
            </>
          ) : (
            <>
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
            </>
          )}

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
              disabled={
                busy ||
                (resetUid && resetToken
                  ? !newPassword || !newPassword2
                  : !email)
              }
            >
              {busy
                ? resetUid && resetToken
                  ? "Updating…"
                  : "Sending…"
                : resetUid && resetToken
                ? "Set new password"
                : "Send reset link"}
            </button>
          </div>
        </form>
      )}
            {mode === "reset" && (
        <form onSubmit={onReset} style={{ marginTop: 12 }}>
          ...
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

      {open && (
        <>
          <AuthArea />

          <div className="rightPanelBottom">
            <a
              className="btn btnGhost"
              href="https://admin.core.zetaslate.com"
              target="_blank"
              rel="noreferrer"
            >
              Admin Login
            </a>
          </div>
        </>
      )}
    </aside>
  );
}
