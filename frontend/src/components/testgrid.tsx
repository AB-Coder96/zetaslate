// src/pages/TestGrid.tsx
// A self‑contained page that fetches from dev & prod APIs and renders the
// items in a responsive Tailwind grid. No separate ItemsGrid component.

import { useEffect, useState } from "react";
import { devClient, prodClient, dedupe } from "@/api/client";

//---------------------------------------------------------------------------
// Item shape – adjust fields as needed to match your Django serializer output
//---------------------------------------------------------------------------
interface Item {
  id: number;
  title: string;
  image?: string;
  description?: string;
}

//---------------------------------------------------------------------------
// Main page component
//---------------------------------------------------------------------------
export default function TestGridPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [devRes, prodRes] = await Promise.allSettled([
          devClient.get<Item[]>("/items/"),
          prodClient.get<Item[]>("/items/"),
        ]);

        const merged: Item[] = [];

        if (devRes.status === "fulfilled") merged.push(...devRes.value.data);
        if (prodRes.status === "fulfilled") merged.push(...prodRes.value.data);

        if (!cancelled) setItems(dedupe(merged));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  //-----------------------------------------------------------------------
  // UI states
  //-----------------------------------------------------------------------
  if (loading) {
    return <p className="py-10 text-center">Loading…</p>;
  }

  if (error) {
    return (
      <p className="py-10 text-center text-red-600 font-medium">{error}</p>
    );
  }

  if (items.length === 0) {
    return <p className="py-10 text-center">No items to display.</p>;
  }

  //-----------------------------------------------------------------------
  // Grid render – responsive columns using Tailwind.
  //-----------------------------------------------------------------------
  return (
    <section className="grid gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-2xl shadow-sm transition hover:shadow-lg"
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              className="h-48 w-full object-cover"
              loading="lazy"
            />
          )}

          <div className="p-4">
            <h2 className="text-lg font-semibold text-stone-800">
              {item.title}
            </h2>
            {item.description && (
              <p className="mt-1 line-clamp-3 text-sm text-stone-600">
                {item.description}
              </p>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
