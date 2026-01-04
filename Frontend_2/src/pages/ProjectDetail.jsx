import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { API_BASE } from "../env";
import { SiGithub } from "react-icons/si";
import Markdown from "../Components/Markdown";

function joinUrl(base, path) {
  const b = (base || "").replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

export default function ProjectDetail() {
  const { id } = useParams();
  const { token } = useAuth();

  const [project, setProject] = useState(null);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setErr("");

      const headers = token ? { Authorization: `Token ${token}` } : undefined;

      try {
        const projUrl = joinUrl(API_BASE, `/api/core-project/${id}/`);
        const mdUrl = joinUrl(API_BASE, `/api/core-project/${id}/content/`);

        const [pRes, mRes] = await Promise.all([
          fetch(projUrl, { headers, signal: controller.signal }),
          fetch(mdUrl, { headers, signal: controller.signal }),
        ]);

        if (!pRes.ok) throw new Error(`Project request failed (${pRes.status})`);
        if (!mRes.ok) throw new Error(`Content request failed (${mRes.status})`);

        const p = await pRes.json();
        const m = await mRes.json();

        if (!alive) return;
        setProject(p);
        setMarkdown(m?.markdown || "");
      } catch (e) {
        if (!alive) return;
        if (e?.name === "AbortError") return;
        setErr(e?.message || "Failed to load project.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
      controller.abort();
    };
  }, [id, token]);

  if (loading) {
    return (
      <section className="pageCard">
        <div className="aboutCard">Loading…</div>
      </section>
    );
  }

  if (err) {
    return (
      <section className="pageCard">
        <div className="aboutCard">
          <h3 style={{ marginTop: 0 }}>Couldn’t load project</h3>
          <div className="muted">{err}</div>
          <div style={{ height: 12 }} />
          <Link to="/projects" className="pillBtn">← Back</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pageCard">
      <div className="rowBetween" style={{ gap: 12, alignItems: "center" }}>
        <div>
          <h1 style={{ marginBottom: 6 }}>{project?.title}</h1>
          {/*<div className="muted">{project?.summary}</div>*/}
        </div>
        <Link to="/projects" className="pillBtn">← Back</Link>
      </div>

      <div style={{ height: 14 }} />

      <div className="aboutCard">
{project?.thumbnail ? (
  <div style={{ marginBottom: 10 }}>
    <img
      src={
        project.thumbnail?.startsWith("http")
          ? project.thumbnail
          : joinUrl(API_BASE, project.thumbnail)
      }
      alt={`${project.title} thumbnail`}
      style={{
        width: "100%",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      loading="lazy"
    />
  </div>
) : null}
        {markdown?.trim() ? (
          <Markdown text={markdown} baseUrl={API_BASE} />
        ) : (
          <div className="muted">
            No README uploaded for this project yet. Upload a <span className="codeBadge">.md</span> in Django admin.
          </div>
        )}
        {p.github_url ? (
                          <a
                            className="pillBtn icon"
                            href={p.github_url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub"
                            title="GitHub"
                            onClick={stop}
                          >
                            <SiGithub size={18} />
                            More on Github
                          </a>
                        ) : null}
      </div>
    </section>
  );
}
