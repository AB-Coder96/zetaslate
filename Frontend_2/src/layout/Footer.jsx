import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerInner">
        © ZetaSlate 2025-{new Date().getFullYear()} • Created by{" "}
        <a
          href="https://github.com/AB-Coder96"
          target="_blank"
          rel="noopener noreferrer"
        >
          AB-Coder96
        </a>
      </div>
    </footer>
  );
}
