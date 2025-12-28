import React from "react";

/**
 * Replace this area with your Django auth buttons/links/components.
 * Update href endpoints as needed.
 */
function AuthArea() {
  return (
    <div className="authArea">
      <label className="fieldLabel" htmlFor="username">Username</label>
      <input id="username" className="input" placeholder="Username" />

      <label className="fieldLabel" htmlFor="password">Password</label>
      <input id="password" className="input" placeholder="Password" type="password" />

      <div className="authRow">
        <a className="link" href="/password-reset">Lost Password</a>
        <button className="btn" type="button">Login</button>
      </div>

      <div className="divider" />

      <div className="authButtons">
        <a className="btn btnGhost" href="/accounts/login/">Django Login</a>
        <a className="btn btnGhost" href="/accounts/signup/">Sign Up</a>
        <a className="btn btnDanger" href="/accounts/logout/">Logout</a>
      </div>
    </div>
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
