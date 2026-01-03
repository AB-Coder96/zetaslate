// src/auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "authToken";

// ✅ Hardcoded production API base (per your request)
const API_BASE = "https://api.core.zetaslate.com";

/**
 * Low-level API helper.
 * - Uses JSON requests/responses
 * - Attaches Authorization header if token provided
 * - Throws a helpful Error on non-2xx responses
 */
async function apiRequest(path, { token, method = "GET", body } = {}) {
  const url = `${API_BASE}${path}`;

  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Token ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Try to parse JSON; if not JSON, fall back to text
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!res.ok) {
    // Common DRF error shape: { detail: "..." }
    const msg =
      (data && typeof data === "object" && data.detail) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load "me" if token exists
  useEffect(() => {
    let alive = true;

    async function loadMe() {
      if (!token) {
        if (alive) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const me = await apiRequest("/api/auth/me/", { token });
        if (alive) setUser(me);
      } catch (err) {
        // Token invalid/expired/revoked -> clear it
        localStorage.removeItem(TOKEN_KEY);
        if (alive) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    setLoading(true);
    loadMe();

    return () => {
      alive = false;
    };
  }, [token]);

  const value = useMemo(() => {
    return {
      token,
      user,
      loading,

      /**
       * Login via token API.
       * POST /api/auth/login/ -> { token, user }
       */
      async login(username, password) {
        const data = await apiRequest("/api/auth/login/", {
          method: "POST",
          body: { username, password },
        });

        if (!data || !data.token) {
          throw new Error("Login succeeded but no token was returned.");
        }

        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);

        // backend returns user in response; if not, we can fetch /me
        if (data.user) setUser(data.user);
        else {
          const me = await apiRequest("/api/auth/me/", { token: data.token });
          setUser(me);
        }

        return data;
      },

      /**
       * Register via token API.
       * POST /api/auth/register/ -> { token, user }
       */
      async register({ username, password, email }) {
        const data = await apiRequest("/api/auth/register/", {
          method: "POST",
          body: { username, password, email },
        });

        // If backend returns a token, treat it like auto-login
        if (data?.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
          setToken(data.token);

          if (data.user) setUser(data.user);
          else {
            const me = await apiRequest("/api/auth/me/", { token: data.token });
            setUser(me);
          }
        }

        return data;
      },

      /**
       * Start password reset (email link).
       * POST /api/auth/password-reset/ -> { ok: true }
       */
      async requestPasswordReset({ email }) {
        return apiRequest("/api/auth/password-reset/", {
          method: "POST",
          body: { email },
        });
      },

      /**
       * Finish password reset (uid/token from email + new password).
       * POST /api/auth/password-reset-confirm/ -> { ok: true }
       */
      async confirmPasswordReset({ uid, token, newPassword }) {
        return apiRequest("/api/auth/password-reset-confirm/", {
          method: "POST",
          body: { uid, token, new_password: newPassword },
        });
      },

      /**
       * Logout by deleting token on server, then clearing local storage.
       * POST /api/auth/logout/
       */
      async logout() {
        try {
          if (token) {
            await apiRequest("/api/auth/logout/", { token, method: "POST" });
          }
        } finally {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      },

      /**
       * Helper for authenticated API calls.
       * Example:
       *   const data = await authFetch("/api/some/endpoint/", { method:"GET" })
       */
      async authFetch(path, options = {}) {
        if (!token) throw new Error("Not authenticated.");
        return apiRequest(path, { token, ...options });
      },

      /**
       * Expose API base in case components want it (optional).
       */
      apiBase: API_BASE,
    };
  }, [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>.");
  }
  return ctx;
}
