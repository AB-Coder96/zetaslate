/* ---------------------- file: src/api/types.ts ---------------------- */
export type ISODate = string; // YYYY-MM-DD
export type ISODateTime = string; // 2025-09-10T12:34:56Z


export type Result<T> = { ok: true; data: T } | { ok: false; error: string };


export interface TimeseriesPoint {
t: ISODateTime;
v: number;
}