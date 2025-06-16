/// <reference types="vite/client" />
// ---------------------------------------------------------------------------
//  src/api/client.ts
// ---------------------------------------------------------------------------

import axios, { AxiosInstance } from "axios";
import projectConfig from "../project-config.json";   // copied into src

/* ──────────────────────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────────────────────── */
declare const process: { env: Record<string, string | undefined> } | undefined;

function env(key: string): string | undefined {
  // Vite
  // @ts-ignore
  if (typeof import.meta !== "undefined" && (import.meta as any).env) {
    const v = (import.meta as any).env[key];
    if (v !== undefined) return v;
  }
  // CRA / Node fallback
  if (typeof process !== "undefined" && process.env) {
    return process.env[key];
  }
  return undefined;
}

/* ──────────────────────────────────────────────────────────────────────────
   Config
   ────────────────────────────────────────────────────────────────────────── */
interface ProjectConfig {
  websiteHost?: string;
}

const WEBSITE_HOST =
  (projectConfig as ProjectConfig).websiteHost || "api.example.com";

export const DEV_API_BASE_URL =
  env("VITE_DEV_API_BASE_URL") ||
  env("REACT_APP_DEV_API_BASE_URL") ||
  "http://localhost:8000/api/";

export const PROD_API_BASE_URL =
  env("VITE_PROD_API_BASE_URL") ||
  env("REACT_APP_PROD_API_BASE_URL") ||
  `https://${WEBSITE_HOST}/api/`;

/* ──────────────────────────────────────────────────────────────────────────
   Axios clients
   ────────────────────────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────────────────────────
   Types & utils
   ────────────────────────────────────────────────────────────────────────── */
export interface Identifiable {
  id: number;                       // 👈️ the only requirement
}

export function dedupe<T extends Identifiable>(arr: T[]): T[] {
  const seen = new Map<number, T>();
  arr.forEach((el) => {
    if (!seen.has(el.id)) seen.set(el.id, el);
  });
  return Array.from(seen.values());
}
