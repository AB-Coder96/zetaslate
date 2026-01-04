import React from "react";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { MdEmail } from "react-icons/md";

const GITHUB_URL = "https://github.com/AB-Coder96";
const LINKEDIN_URL = "https://www.linkedin.com/in/araz-karimi-0b2600290/";
const EMAIL = "arazbagherzadeh@gmail.com";

export default function About() {
  return (
    <section className="pageCard">
      <h1>About</h1>

      <p className="aboutLead">
        <strong>ZetaSlate</strong> is my personal platform and portfolio hub—built
        to showcase my work in a clean, consistent way while giving me room to
        iterate and grow what I ship over time. Full project details are in the{" "}
        <strong>Projects</strong> tab.
      </p>

      <p className="aboutLead">
        I’m a <strong>software engineer with 5+ years</strong> of experience
        building production systems across backend services, APIs, automation,
        and modern web applications. I enjoy owning problems end-to-end—turning
        requirements into reliable, maintainable software.
      </p>

      <p className="aboutLead">
        My core strengths include <strong>Python</strong>, <strong>C++</strong>,{" "}
        <strong>networking</strong>, and <strong>cloud development</strong>, with
        a focus on performance, clarity, low-latency systems, and shipping
        practical solutions.
      </p>

      <p className="aboutLead">
        Interested in collaborating or need professional help? Reach out via
        LinkedIn, GitHub, or email—I’m happy to connect.
      </p>

      <div className="divider" />

      <div className="authButtons" aria-label="Social links">
        <a
          className="pillBtn icon"
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          title="LinkedIn"
        >
          <SiLinkedin size={18} />
          <span>LinkedIn</span>
        </a>

        <a
          className="pillBtn icon"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <SiGithub size={18} />
          <span>GitHub</span>
        </a>

        <a
          className="pillBtn icon"
          href={`mailto:${EMAIL}`}
          aria-label="Email"
          title="Email"
        >
          <MdEmail size={18} />
          <span>Email</span>
        </a>
      </div>
    </section>
  );
}
