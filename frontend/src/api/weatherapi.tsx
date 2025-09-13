import React from "react";

export type Units = "metric" | "imperial";

export type WeatherSummary = {
  locationName: string;
  latitude: number;
  longitude: number;
  temperature: number; // current
  temperatureUnit: "°C" | "°F";
  weatherCode: number;
  description: string;
  isDay: boolean;
  windSpeed: number;
  windUnit: "km/h" | "mph";
  dailyHigh?: number;
  dailyLow?: number;
  icon: string; // simple emoji/icon text
};

export type WeatherAPIOptions = {
  /** City name like "New York" OR leave undefined if passing coordinates */
  location?: string;
  /** Coordinates take precedence over location name when provided */
  latitude?: number;
  longitude?: number;
  /** metric = Celsius/kmh, imperial = Fahrenheit/mph */
  units?: Units;
  /** Optional abort signal */
  signal?: AbortSignal;
};

const TTL_MS = 5 * 60 * 1000; // 5 minutes caching
const cache = new Map<string, { t: number; data: WeatherSummary }>();

function unitsToQuery(units: Units | undefined) {
  if (units === "imperial") {
    return { temp: "fahrenheit", wind: "mph", symbol: "°F" as const };
  }
  return { temp: "celsius", wind: "kmh", symbol: "°C" as const };
}

function codeToDescription(code: number): string {
  // Open-Meteo weather codes
  const map: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Light rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm w/ slight hail",
    99: "Thunderstorm w/ heavy hail",
  };
  return map[code] ?? "Unknown";
}

function codeToIcon(code: number, isDay: boolean): string {
  // Minimal emoji icon set
  if (code === 0) return isDay ? "☀️" : "🌙";
  if (code === 1) return isDay ? "🌤️" : "🌙";
  if (code === 2) return "⛅";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([66, 67].includes(code)) return "🌧️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌡️";
}

async function geocode(location: string, signal?: AbortSignal) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", location);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
  const json = await res.json();
  const first = json?.results?.[0];
  if (!first) throw new Error("No results for location");
  const locName = [first.name, first.admin1, first.country_code].filter(Boolean).join(", ");
  return { latitude: first.latitude as number, longitude: first.longitude as number, locationName: locName };
}

export async function fetchWeather(opts: WeatherAPIOptions): Promise<WeatherSummary> {
  const { units = "metric", signal } = opts;
  let lat = opts.latitude;
  let lon = opts.longitude;
  let locationName = "";

  if ((lat == null || lon == null) && opts.location) {
    const g = await geocode(opts.location, signal);
    lat = g.latitude;
    lon = g.longitude;
    locationName = g.locationName;
  }

  if (lat == null || lon == null) {
    throw new Error("Provide either a location name or latitude/longitude");
  }

  const key = `${lat.toFixed(3)},${lon.toFixed(3)},${units}`;
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && now - hit.t < TTL_MS) return hit.data;

  const uq = unitsToQuery(units);
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "temperature_2m,is_day,weather_code,wind_speed_10m");
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min");
  url.searchParams.set("temperature_unit", uq.temp);
  url.searchParams.set("wind_speed_unit", uq.wind);
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error(`Weather fetch failed (${res.status})`);
  const json = await res.json();

  const current = json.current ?? {};
  const daily = json.daily ?? {};

  const code = Number(current.weather_code ?? 0);
  const isDay = Boolean(current.is_day ?? 1);
  const desc = codeToDescription(code);
  const icon = codeToIcon(code, isDay);

  const data: WeatherSummary = {
    locationName: locationName || `${Number(json.latitude).toFixed(2)}, ${Number(json.longitude).toFixed(2)}`,
    latitude: Number(json.latitude),
    longitude: Number(json.longitude),
    temperature: Number(current.temperature_2m),
    temperatureUnit: uq.symbol,
    weatherCode: code,
    description: desc,
    isDay,
    windSpeed: Number(current.wind_speed_10m ?? 0),
    windUnit: uq.wind === "mph" ? "mph" : "km/h",
    dailyHigh: Array.isArray(daily.temperature_2m_max) ? Number(daily.temperature_2m_max[0]) : undefined,
    dailyLow: Array.isArray(daily.temperature_2m_min) ? Number(daily.temperature_2m_min[0]) : undefined,
    icon,
  };

  cache.set(key, { t: now, data });
  return data;
}

export function clearWeatherCache() {
  cache.clear();
}

export function useWeather(opts: WeatherAPIOptions) {
  const [data, setData] = React.useState<WeatherSummary | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const controllerRef = React.useRef<AbortController | null>(null);

  const fetchNow = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    try {
      const result = await fetchWeather({ ...opts, signal: controller.signal });
      setData(result);
    } catch (e: any) {
      if (e?.name !== "AbortError") setError(e);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify({
    location: opts.location,
    latitude: opts.latitude,
    longitude: opts.longitude,
    units: opts.units,
  })]);

  React.useEffect(() => {
    fetchNow();
    return () => controllerRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchNow]);

  return { data, error, loading, refetch: fetchNow } as const;
}

