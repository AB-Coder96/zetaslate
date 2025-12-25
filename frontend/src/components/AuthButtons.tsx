import React from "react";

type AuthButtonsProps = {
  /**
   * Optional override for where the user should be redirected after login/logout.
   * Defaults to current site origin (e.g. https://zetaslate.com/).
   */
  returnToUrl?: string;
};

/**
 * Simple “safe” auth links: credentials are entered on the Django domain,
 * not in your React app.
 */
export default function AuthButtons({ returnToUrl }: AuthButtonsProps) {
  // Use env var if present; fall back to your production auth host.
  // Vite: import.meta.env.VITE_AUTH_HOST
  // CRA:  process.env.REACT_APP_AUTH_HOST
  const AUTH_HOST =
    (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_AUTH_HOST) ||
    (typeof process !== "undefined" && (process as any).env?.REACT_APP_AUTH_HOST) ||
    "https://api.core.zetaslate.com";

  const returnTo = returnToUrl ?? `${window.location.origin}/`;

  const loginUrl = `${AUTH_HOST}/accounts/login/?next=${encodeURIComponent(returnTo)}`;
  const logoutUrl = `${AUTH_HOST}/accounts/logout/?next=${encodeURIComponent(returnTo)}`;
  const resetUrl = `${AUTH_HOST}/accounts/password_reset/`;

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <a href={loginUrl}>Login</a>
      <a href={logoutUrl}>Logout</a>
      <a href={resetUrl}>Forgot password?</a>
    </div>
  );
}
