import React from "react";

const GITHUB_URL = "https://github.com/AB-Coder96";
const LINKEDIN_URL = "https://www.linkedin.com/in/araz-karimi-0b2600290/"; // <-- replace with your LinkedIn
const EMAIL = "arazbagherzadeh@gmail.com";

export default function About() {
  return (
    <section className="pageCard">
      <h1>About</h1>

      <p className="aboutLead">
        <strong>ZetaSlate</strong> is my personal platform and portfolio hub—built to present my work
        in a clean, consistent way while giving me room to iterate and grow what I ship over time.
        The projects themselves are listed in detail in the <strong>Projects</strong> tab.
      </p>

      <p className="aboutLead">
        I’m a <strong>software engineer with 4+ years</strong> of experience building production
        software across backend systems, APIs, automation, and modern web applications. I enjoy
        owning problems end-to-end—turning requirements into reliable, maintainable systems.
      </p>

      <p className="aboutLead">
        My core strengths include <strong>Python</strong>, <strong>C++</strong>, <strong>SQL</strong>,
        and cloud-based development, with a focus on performance, clarity, and shipping practical
        solutions.
      </p>

      <div className="divider" />

      <div className="authButtons" aria-label="Social links">
        <a
          className="btn btnGhost"
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>

        <a
          className="btn btnGhost"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>

        <a className="btn btnGhost" href={`mailto:${EMAIL}`}>
          Email me
        </a>
      </div>
    </section>
  );
}
