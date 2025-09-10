// ---------------------------------------------------------------------------
// src/components/WeatherWidget.tsx
// A simple card that uses the weather driver and renders in a grid cell.
// ---------------------------------------------------------------------------
import { useEffect, useState } from "react";
import { fetchWeatherStandard, StandardWeather } from "../api/weatherDriver";

type Props = {
  /** Optional override for coordinates */
  lat?: number;
  lon?: number;
  /** Optional title shown at the top of the card */
  title?: string;
};

export default function WeatherWidget({ lat, lon, title = "Weather" }: Props) {
  const [data, setData] = useState<StandardWeather | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);
      setError(null);

      // Attempt geolocation if no coords provided
      const getCoords = (): Promise<{ lat: number; lon: number; label: string }> =>
        new Promise((resolve) => {
          if (typeof lat === "number" && typeof lon === "number") {
            resolve({ lat, lon, label: "Selected location" });
            return;
          }
          if (!navigator.geolocation) {
            // NYC fallback
            resolve({ lat: 40.7128, lon: -74.0060, label: "New York, NY" });
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              resolve({
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
                label: "Your location",
              });
            },
            () => {
              resolve({ lat: 40.7128, lon: -74.0060, label: "New York, NY" });
            },
            { enableHighAccuracy: false, maximumAge: 60000, timeout: 5000 }
          );
        });

      try {
        const { lat: useLat, lon: useLon, label } = await getCoords();
        const w = await fetchWeatherStandard(useLat, useLon, label);
        if (mounted) setData(w);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load weather");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [lat, lon]);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-xs text-stone-500">{data?.source ?? "open-meteo"}</span>
      </div>

      {loading && <p className="mt-2 text-sm text-stone-500">Loading current weather…</p>}
      {error && <p className="mt-2 text-sm text-red-600">Error: {error}</p>}

      {!loading && !error && data && (
        <div className="mt-3">
          <div className="text-4xl font-bold">
            {Number.isFinite(data.tempC) ? `${Math.round(data.tempC)}°C` : "—"}
            <span className="ml-3 text-base text-stone-500">
              {Number.isFinite(data.tempF) ? `(${Math.round(data.tempF)}°F)` : ""}
            </span>
          </div>
          <div className="mt-1 text-stone-700">{data.condition}</div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-xl bg-stone-50 p-2 text-center">
              <div className="text-xs text-stone-500">Wind</div>
              <div className="font-medium">{data.windKph != null ? `${Math.round(data.windKph)} km/h` : "—"}</div>
            </div>
            <div className="rounded-xl bg-stone-50 p-2 text-center">
              <div className="text-xs text-stone-500">Humidity</div>
              <div className="font-medium">{data.humidity != null ? `${Math.round(data.humidity)}%` : "—"}</div>
            </div>
            <div className="rounded-xl bg-stone-50 p-2 text-center">
              <div className="text-xs text-stone-500">Updated</div>
              <div className="font-medium">{data.updatedAt ? new Date(data.updatedAt).toLocaleTimeString() : "—"}</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-stone-500">{data.locationLabel}</div>
        </div>
      )}
    </div>
  );
}
