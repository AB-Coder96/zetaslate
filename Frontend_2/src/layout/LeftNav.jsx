import React from "react";
import { NavLink } from "react-router-dom";

export default function LeftNav({ open, onToggle }) {
  return (
    <aside className={`leftNav ${open ? "open" : "closed"}`} aria-label="Left navigation">
      <div className="leftNavTop">
        <div className="leftNavTitle">{open ? "Navigation" : "Nav"}</div>
        <button className="miniBtn" onClick={onToggle} aria-label="Toggle left nav">
          {open ? "⟨" : "⟩"}
        </button>
      </div>

      <nav className="leftNavLinks">
        <NavLink
          to="/projects"
          className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
        >
          {open ? "Projects" : "🗂️"}
       </NavLink>
        {/* <NavLink to="/" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
          {open ? "Home" : "🏠"}
        </NavLink>*/}
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
        >
          {open ? "About" : "ℹ️"}
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
        >
          {open ? "Profile" : "👤"}
        </NavLink>
      </nav>
    </aside>
  );
}
