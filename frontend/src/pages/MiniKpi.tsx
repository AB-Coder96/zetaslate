// src/pages/MiniKpi.tsx
import * as React from "react";

export type MiniKpiProps = {
  label: string;
  value: React.ReactNode;

  /** Optional helper text under the value */
  sublabel?: string;

  /** Alias used in your Profile.tsx */
  note?: string;

  /**
   * Change indicator.
   * Example: delta={12.3} deltaLabel="%"
   */
  delta?: number;
  deltaLabel?: string;

  /** Optional icon (pass <Icon className="h-5 w-5" /> etc) */
  icon?: React.ReactNode;

  /** Optional click behavior */
  onClick?: () => void;

  className?: string;
};

function formatDelta(delta: number, label?: string) {
  const sign = delta > 0 ? "+" : "";
  const abs = Math.abs(delta);
  const pretty = Number.isInteger(abs) ? abs.toString() : abs.toFixed(1);
  return `${sign}${pretty}${label ?? ""}`;
}

export function MiniKpi({
  label,
  value,
  sublabel,
  note,
  delta,
  deltaLabel,
  icon,
  onClick,
  className,
}: MiniKpiProps) {
  const helperText = note ?? sublabel;

  const hasDelta = typeof delta === "number" && Number.isFinite(delta);
  const tone =
    !hasDelta ? "neutral" : delta > 0 ? "positive" : delta < 0 ? "negative" : "neutral";

  const deltaStyles =
    tone === "positive"
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : tone === "negative"
      ? "text-rose-700 bg-rose-50 border-rose-200"
      : "text-slate-600 bg-slate-50 border-slate-200";

  const Wrapper: React.ElementType = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={[
        "w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
        onClick ? "text-left hover:bg-slate-50 active:bg-slate-100 transition" : "",
        className ?? "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-medium text-slate-700">{label}</div>

            {hasDelta && (
              <span
                className={[
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
                  deltaStyles,
                ].join(" ")}
                aria-label={`Change ${formatDelta(delta!, deltaLabel)}`}
                title={formatDelta(delta!, deltaLabel)}
              >
                {formatDelta(delta!, deltaLabel)}
              </span>
            )}
          </div>

          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {value}
          </div>

          {helperText && (
            <div className="mt-1 text-xs text-slate-500 truncate">{helperText}</div>
          )}
        </div>

        {icon && (
          <div className="shrink-0 rounded-xl bg-slate-50 p-2 text-slate-700 border border-slate-200">
            {icon}
          </div>
        )}
      </div>
    </Wrapper>
  );
}
