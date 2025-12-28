import React from "react";

export default function TopHeader({
  title,
  onToggleLeft,
  onToggleRight,
  leftOpen,
  rightOpen,
}) {
  return (
    <header className="topHeader">
      <div className="topHeaderInner">
        <button
          className="iconButton"
          onClick={onToggleLeft}
          aria-label={leftOpen ? "Collapse left navigation" : "Expand left navigation"}
          title="Menu"
        >
          <span className="hamburger" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <div className="brand">{title}</div>

        <button
          className="iconButton"
          onClick={onToggleRight}
          aria-label={rightOpen ? "Hide auth panel" : "Show auth panel"}
          title="Auth"
        >
          <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>
            🔒
          </span>
        </button>
      </div>
    </header>
  );
}
