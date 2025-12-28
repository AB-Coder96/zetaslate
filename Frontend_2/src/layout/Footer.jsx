import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerInner">© Sustainability Portfolio {new Date().getFullYear()}</div>
    </footer>
  );
}
