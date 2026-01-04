import React from "react";

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
        software across backend systems, APIs, automation, and modern web applications. I work
        comfortably across the stack, but I’m especially drawn to roles where I can take ownership
        of a problem end-to-end—turning ambiguous requirements into reliable, maintainable systems.
      </p>

      <p className="aboutLead">
        My core strengths include <strong>Python</strong>, <strong>C++</strong>, <strong>SQL</strong>,
        and cloud-based development, with a focus on performance, clarity, and shipping practical
        solutions. I enjoy building tools that make workflows faster, products more dependable, and
        systems easier to operate.
      </p>

      <p className="aboutFooter">
        Want to connect or collaborate? Head to the Contact page—I’m always open to talking about
        engineering work, new opportunities, and interesting problems.
      </p>
    </section>
  );
}
