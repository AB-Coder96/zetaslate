// ---------------------------------------------------------------------------
// src/api/weatherDriver.ts
// A minimal "driver" for a weather API (Open‑Meteo) that normalizes output to
// a standard shape usable across Zetaslate.
// ---------------------------------------------------------------------------

export type StandardWeather = {
  /** Celsius */
  tempC: number;
  /** Fahrenheit */
  tempF: number;
  /** WMO weather code (Open‑Meteo) */
  conditionCode: number | null;
  /** Human readable description for the condition code */
  condition: string;
  /** Approximate wind speed, km/h */
  windKph: number | null;
  /** Relative humidity % */
  humidity: number | null;
  /** Optional location label used by the UI */
  locationLabel: string;
  /** ISO timestamp (from the API) */
  updatedAt: string | null;
  /** The driver name/source identifier */
  source: "open-meteo";
};

// Basic WMO code → description mapping (subset; add as needed)
const WMO: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Moderate showers",
  82: "Violent showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with heavy hail",
};

function cToF(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

/**
 * Fetch current weather from Open‑Meteo and normalize.
 * No API key required.
 *
 * @param lat latitude
 * @param lon longitude
 * @param locationLabel Friendly label to display (defaults to "Your location")
 */
export async function fetchWeatherStandard(
  lat: number,
  lon: number,
  locationLabel = "Your location"
): Promise<StandardWeather> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m");

  const res = await fetch(url.toString(), { headers: { "Accept": "application/json" } });
  if (!res.ok) {
    throw new Error(`Open‑Meteo error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();

  const current = data?.current ?? {};
  const tempC = Number(current.temperature_2m ?? NaN);
  const humidity = current.relative_humidity_2m ?? null;
  const conditionCode = current.weather_code ?? null;
  const windKph = current.wind_speed_10m ?? null;
  const updatedAt = current.time ?? null;

  const normalized: StandardWeather = {
    tempC,
    tempF: Number.isFinite(tempC) ? cToF(tempC) : NaN,
    conditionCode,
    condition: typeof conditionCode === "number" && WMO[conditionCode] ? WMO[conditionCode] : "—",
    windKph,
    humidity,
    updatedAt,
    locationLabel,
    source: "open-meteo",
  };

  return normalized;
}
