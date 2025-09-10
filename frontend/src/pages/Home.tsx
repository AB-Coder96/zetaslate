// src/pages/Home.tsx
import WeatherWidget from "../components/WeatherWidget";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl p-4">
      <h2 className="mb-4 text-xl font-semibold">Dashboard</h2>

      {/* Simple responsive grid. Weather goes at (1,1). */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* (1,1) */}
        <WeatherWidget />

        {/* Other grid cells can host other API drivers later… */}
        <div className="rounded-2xl border border-dashed border-stone-300 p-6 text-stone-400">
          (1,2) — Connect another API
        </div>
        <div className="rounded-2xl border border-dashed border-stone-300 p-6 text-stone-400">
          (2,1) — Connect another API
        </div>
        <div className="rounded-2xl border border-dashed border-stone-300 p-6 text-stone-400">
          (2,2) — Connect another API
        </div>
      </div>
    </div>
  );
}
