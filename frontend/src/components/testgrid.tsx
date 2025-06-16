import { useEffect, useState } from "react";
import { devClient, prodClient, dedupe, Identifiable } from "@/api/client";

/* ──────────────────────────────────────────────────────────────────────────
   Types
   ────────────────────────────────────────────────────────────────────────── */
interface Item extends Identifiable {
  title: string;
  // add any additional Item-specific fields here
}

/* ──────────────────────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────────────────────── */
export default function TestGridPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        /* ---------- fetch from both APIs in parallel ---------- */
        const [devRes, prodRes] = await Promise.allSettled([
          devClient.get<Item[]>("/items"),
          prodClient.get<Item[]>("/items"),
        ]);

        /* ---------- merge whichever responses succeeded ---------- */
        const merged: Item[] = [];
        if (devRes.status === "fulfilled") merged.push(...devRes.value.data);
        if (prodRes.status === "fulfilled") merged.push(...prodRes.value.data);

        /* ---------- dedupe by id & commit to state ---------- */
        if (!cancelled) setItems(dedupe(merged));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- render ---------- */
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.id} className="rounded border p-4 shadow">
          <h3 className="font-semibold">{item.title}</h3>
          {/* render other fields here */}
        </div>
      ))}
    </div>
  );
}
