import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import {API_BASE} from "../env"
import { Github } from "lucide-react";

function joinUrl(base, path) {
  const b = (base || "").replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

function normalizeLinks(links) {
  if (!links) return [];
  if (Array.isArray(links)) {
    return links
      .map((x) => {
        if (!x) return null;
        if (typeof x === "string") return { label: "Link", url: x };
        const label = x.label || x.name || x.title || "Link";
        const url = x.url || x.href || x.link;
        if (!url) return null;
        return { label, url };
      })
      .filter(Boolean);
  }
  if (typeof links === "object") {
    return Object.entries(links)
      .map(([label, url]) => (url ? { label, url } : null))
      .filter(Boolean);
  }
  return [];
}

export default function Projects() {
  const { token } = useAuth();

 
  const PROJECTS_URL = joinUrl(API_BASE, "/api/core-project/");
  const TAGS_URL = joinUrl(API_BASE, "/api/core-projecttag/");

  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);

  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const headers = token ? { Authorization: `Token ${token}` } : undefined;

        const [projRes, tagRes] = await Promise.all([
          fetch(PROJECTS_URL, { headers, signal: controller.signal }),
          fetch(TAGS_URL, { headers, signal: controller.signal }),
        ]);

        if (!projRes.ok) throw new Error(`Projects request failed (${projRes.status})`);
        if (!tagRes.ok) throw new Error(`Tags request failed (${tagRes.status})`);

        const projData = await projRes.json();
        const tagData = await tagRes.json();

        if (!alive) return;

        setProjects(Array.isArray(projData) ? projData : projData?.results || []);
        setTags(Array.isArray(tagData) ? tagData : tagData?.results || []);
      } catch (e) {
        if (!alive) return;
        if (e?.name === "AbortError") return;
        setError(e?.message || "Failed to load projects.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
      controller.abort();
    };
  }, [PROJECTS_URL, TAGS_URL, token]);

  const tagOptions = useMemo(() => {
    const base = [{ slug: "all", name: "All" }];
    const unique = [];
    const seen = new Set();

    for (const t of tags || []) {
      if (!t?.slug) continue;
      if (seen.has(t.slug)) continue;
      seen.add(t.slug);
      unique.push({ slug: t.slug, name: t.name || t.slug });
    }
    return [...base, ...unique];
  }, [tags]);

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();

    return (projects || []).filter((p) => {
      const matchesQuery =
        !q ||
        (p.title || "").toLowerCase().includes(q) ||
        (p.summary || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.tags || []).some((t) => (t?.name || "").toLowerCase().includes(q));

      const matchesTag =
        activeTag === "all" || (p.tags || []).some((t) => t?.slug === activeTag);

      return matchesQuery && matchesTag;
    });
  }, [projects, query, activeTag]);

  return (
    <div className="pageCard">
      <div className="rowBetween" style={{ marginBottom: 14 }}>
        <div>
          <h1 style={{ margin: 0 }}>Projects</h1>
          <div className="muted" style={{ marginTop: 6 }}>
            Search + filter by tags.
          </div>
        </div>

        {loading ? (
          <div className="rowBetween" style={{ gap: 10 }}>
            <div className="spinner" aria-label="Loading" />
            <div className="muted">Loading…</div>
          </div>
        ) : null}
      </div>

      <div className="aboutCard" style={{ marginBottom: 14 }}>
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects…"
          aria-label="Search projects"
        />

        <div style={{ height: 12 }} />

        <div className="pillRow">
          {tagOptions.map((t) => (
            <button
              key={t.slug}
              className={`pillBtn ${activeTag === t.slug ? "active" : ""}`}
              onClick={() => setActiveTag(t.slug)}
              type="button"
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="aboutCard">
          <h3 style={{ marginTop: 0 }}>Couldn’t load projects</h3>
          <div className="muted">{error}</div>
          <div style={{ height: 10 }} />
          <div className="muted">
            Check Django is running and set <span className="codeBadge">VITE_API_BASE</span> if
            frontend/backend aren’t same origin.
          </div>
        </div>
      ) : null}

      {!error && !loading && filteredProjects.length === 0 ? (
        <div className="aboutCard">
          <h3 style={{ marginTop: 0 }}>No projects found</h3>
          <div className="muted">Try another tag or clear search.</div>
        </div>
      ) : null}

      {!error && filteredProjects.length > 0 ? (
        <div className="aboutGrid">
          {filteredProjects.map((p) => {
            const extraLinks = normalizeLinks(p.links);
            const tagList = (p.tags || []).filter(Boolean);

            return (
              <div key={p.id || p.slug || p.title} className="aboutCard">
                <div className="rowBetween" style={{ marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{p.title}</div>
                    {p.summary ? (
                      <div className="muted" style={{ marginTop: 6 }}>
                        {p.summary}
                      </div>
                    ) : null}
                  </div>

                  {p.status ? <span className="codeBadge">{p.status}</span> : null}
                </div>

                {p.thumbnail ? (
                  <div style={{ marginBottom: 10 }}>
                    <img
                      src={p.thumbnail?.startsWith("http") ? p.thumbnail : joinUrl(API_BASE, p.thumbnail)}
                      alt={`${p.title} thumbnail`}
                      style={{
                        width: "100%",
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                      loading="lazy"
                    />
                  </div>
                ) : null}

                {p.description ? <div style={{ marginBottom: 10 }}>{p.description}</div> : null}

                {tagList.length > 0 ? (
                  <div className="pillRow" style={{ marginBottom: 10 }}>
                    {tagList.map((t) => (
                      <span key={t.slug || t.name} className="codeBadge">
                        {t.name || t.slug}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="pillRow">
                  {p.live_url ? (
                    <a className="pillBtn" href={p.live_url} target="_blank" rel="noreferrer">
                      Live
                    </a>
                  ) : null}

                  {p.github_url ? (
                    <a
                      className="pillBtn"
                      href={p.github_url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                      title="GitHub"
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Github size={18} />
                    </a>
                  ) : null}

                  {p.case_study_url ? (
                    <a className="pillBtn" href={p.case_study_url} target="_blank" rel="noreferrer">
                      Case Study
                    </a>
                  ) : null}

                  {extraLinks.map((l, idx) => (
                    <a
                      key={`${l.url}-${idx}`}
                      className="pillBtn"
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
                {/* 
                <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>
                  GitHub iframe embeds usually fail (security headers). Best is to link out. Gists embed fine.
                </div> */}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
