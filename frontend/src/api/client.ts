/// <reference types="vite/client" />
// src/api/clients.ts
// Two axios instances: one for dev and one for prod. Designed to compile even
// if @types/node is NOT installed (e.g. a default Vite project).  If you do
// have @types/node, nothing breaks.

import axios, { AxiosInstance } from "axios";

// ---------------------------------------------------------------------------
// 0.  Provide a minimal, safe declaration for `process.env` so TypeScript
//     doesn’t complain when @types/node isn’t present.  This is ignored when
//     those types are installed.
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
declare const process: {
  env: Record<string, string | undefined>;
} | undefined;

// ---------------------------------------------------------------------------
// 1. Helper to read env vars from either Vite (import.meta.env) or process.env
// ---------------------------------------------------------------------------
function env(key: string): string | undefined {
  // Vite-style env vars (always strings)
  // @ts-ignore – vite/client types cover import.meta.env but not index access
  if (typeof import.meta !== "undefined" && (import.meta as any).env) {
    const val = (import.meta as any).env[key];
    if (val !== undefined) return val;
  }
  // CRA / Node fallback, guarded so browsers without `process` are safe
  if (typeof process !== "undefined" && process.env) {
    return process.env[key];
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// 2. Resolve base URLs with sensible defaults
// ---------------------------------------------------------------------------
export const DEV_API_BASE_URL: string =
  env("VITE_DEV_API_BASE_URL") ||
  env("REACT_APP_DEV_API_BASE_URL") ||
  "http://localhost:8000/api/";

export const PROD_API_BASE_URL: string =
  env("VITE_PROD_API_BASE_URL") ||
  env("REACT_APP_PROD_API_BASE_URL") ||
  "https://api.example.com/api/";

// ---------------------------------------------------------------------------
// 3. Axios clients
// ---------------------------------------------------------------------------
export const devClient: AxiosInstance = axios.create({
  baseURL: DEV_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const prodClient: AxiosInstance = axios.create({
  baseURL: PROD_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ---------------------------------------------------------------------------
// 4. Dedupe helper
// ---------------------------------------------------------------------------
export interface Identifiable {
  id: number;
  [key: string]: unknown;
}

export function dedupe<T extends Identifiable>(arr: T[]): T[] {
  const seen = new Map<number, T>();
  arr.forEach((el) => {
    if (!seen.has(el.id)) seen.set(el.id, el);
  });
  return Array.from(seen.values());
}
