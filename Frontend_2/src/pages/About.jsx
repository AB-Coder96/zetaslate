import React from "react";

export default function About() {
  return (
    <section className="pageCard">
      <h1>About this site</h1>

      <p className="aboutLead">
        This portfolio is a full-stack web application built as a modern React single-page
        app backed by a Django API. It’s deployed on AWS with a production setup designed
        for reliability, scalability, and clean delivery automation.
      </p>

      <div className="aboutBadges" aria-label="Technology stack">
        <span className="codeBadge">React (SPA)</span>
        <span className="codeBadge">Django (API)</span>
        <span className="codeBadge">Nginx</span>
        <span className="codeBadge">Docker on EC2</span>
        <span className="codeBadge">RDS</span>
        <span className="codeBadge">S3 (static/media)</span>
        <span className="codeBadge">Amazon SES (email)</span>
        <span className="codeBadge">CI/CD → Linux production</span>
      </div>

      <div className="aboutGrid">
        <div className="aboutCard">
          <h2>Application architecture</h2>
          <ul className="aboutList">
            <li>
              <strong>React</strong> handles the UI as a SPA (fast navigation, component-based layout).
            </li>
            <li>
              <strong>Django</strong> provides the backend API, authentication, and business logic.
            </li>
            <li>
              <strong>Nginx</strong> serves the built frontend and reverse-proxies API requests to Django.
            </li>
          </ul>
          <p className="aboutMeta">
            Result: one cohesive app experience with a clear separation between UI and backend services.
          </p>
        </div>

        <div className="aboutCard">
          <h2>AWS infrastructure</h2>
          <ul className="aboutList">
            <li>
              <strong>EC2</strong> runs the production containers (Django + Nginx) on Linux.
            </li>
            <li>
              <strong>RDS</strong> hosts the relational database for durable, managed persistence.
            </li>
            <li>
              <strong>S3</strong> stores static and uploaded media assets for efficient delivery.
            </li>
            <li>
              <strong>SES</strong> is used for transactional email (e.g., password resets).
            </li>
          </ul>
          <p className="aboutMeta">
            This setup keeps compute, storage, email, and database concerns cleanly separated.
          </p>
        </div>

        <div className="aboutCard">
          <h2>Deployment & operations</h2>
          <ul className="aboutList">
            <li>
              <strong>Dockerized services</strong> ensure consistent behavior from development to production.
            </li>
            <li>
              <strong>CI/CD pipeline</strong> automates building and shipping updates from a Windows dev workflow
              to the EC2 Linux environment.
            </li>
            <li>
              <strong>Environment configuration</strong> (secrets/keys/connection strings) is handled via server
              settings rather than hard-coded values.
            </li>
          </ul>
          <p className="aboutMeta">
            Result: repeatable deployments and fewer “works on my machine” issues.
          </p>
        </div>

        <div className="aboutCard">
          <h2>Security & reliability</h2>
          <ul className="aboutList">
            <li>
              Authentication is handled between the React client and Django backend via API endpoints.
            </li>
            <li>
              Password reset flows are email-driven through SES and verified by Django tokens.
            </li>
            <li>
              Static/media delivery is offloaded to S3 to reduce load on the application server.
            </li>
          </ul>
          <p className="aboutMeta">
            Designed to keep sensitive logic on the backend while providing a smooth frontend experience.
          </p>
        </div>
      </div>

      <p className="aboutFooter">
        Want to learn more or collaborate? Use the Contact page — I’m happy to share details about the build,
        the deployment pipeline, and the AWS setup.
      </p>
    </section>
  );
}
