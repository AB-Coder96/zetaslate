import React from "react";
import { useWeather, type Units } from "./api/weatherapi";

export type WeatherProps = {
  /** City name OR pass coordinates */
  location?: string;
  latitude?: number;
  longitude?: number;
  /** metric (default) or imperial */
  units?: Units;
  /** compact is great for headers */
  variant?: "compact" | "full";
  className?: string;
};

export default function Weather({ location, latitude, longitude, units = "metric", variant = "compact", className = "" }: WeatherProps) {
  const [unitState, setUnitState] = React.useState<Units>(units);
  const { data, error, loading, refetch } = useWeather({ location, latitude, longitude, units: unitState });

  const toggleUnits = () => setUnitState((u) => (u === "metric" ? "imperial" : "metric"));

  if (loading) {
    return (
      <div className={`flex items-center gap-2 rounded-2xl px-3 py-2 shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur animate-pulse ${className}`}>
        <div className="text-xl">🌡️</div>
        <div className="h-4 w-24 bg-black/10 dark:bg-white/10 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 rounded-2xl px-3 py-2 shadow-sm bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 ${className}`}>
        <span>⚠️</span>
        <span className="text-sm">{error.message}</span>
        <button onClick={refetch} className="ml-auto text-xs underline opacity-80 hover:opacity-100">Retry</button>
      </div>
    );
  }

  if (!data) return null;

  const temp = Math.round(data.temperature);
  const hi = data.dailyHigh != null ? Math.round(data.dailyHigh) : null;
  const lo = data.dailyLow != null ? Math.round(data.dailyLow) : null;

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 rounded-2xl px-3 py-2 shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur ${className}`}>
        <span className="text-xl leading-none">{data.icon}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-semibold">{temp}</span>
          <span className="text-xs -mt-1 opacity-80">{data.temperatureUnit}</span>
        </div>
        <span className="text-xs opacity-80">{data.description}</span>
        <span className="text-xs opacity-60">• {data.locationName}</span>
        <button onClick={toggleUnits} aria-label="Toggle units" className="ml-auto text-xs underline opacity-80 hover:opacity-100">
          {unitState === "metric" ? "°F" : "°C"}
        </button>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl p-4 shadow-sm bg-white/60 dark:bg-zinc-900/60 backdrop-blur ${className}`}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{data.icon}</span>
        <div>
          <div className="text-2xl font-semibold leading-none">
            {temp}
            <span className="text-base align-top opacity-80 ml-0.5">{data.temperatureUnit}</span>
          </div>
          <div className="text-sm opacity-80">{data.description}</div>
          <div className="text-xs opacity-60">{data.locationName}</div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm">
        {hi != null && (
          <div>
            <div className="opacity-60">High</div>
            <div className="font-medium">{hi}{data.temperatureUnit}</div>
          </div>
        )}
        {lo != null && (
          <div>
            <div className="opacity-60">Low</div>
            <div className="font-medium">{lo}{data.temperatureUnit}</div>
          </div>
        )}
        <div>
          <div className="opacity-60">Wind</div>
          <div className="font-medium">{Math.round(data.windSpeed)} {data.windUnit}</div>
        </div>
        <button onClick={toggleUnits} className="ml-auto text-xs underline opacity-80 hover:opacity-100 self-start">Switch to {unitState === "metric" ? "°F" : "°C"}</button>
      </div>
    </div>
  );
}