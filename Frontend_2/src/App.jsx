import React from "react";
import { AuthProvider } from "./auth/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TopHeader from "./layout/TopHeader";
import LeftNav from "./layout/LeftNav";
import RightAuthPanel from "./layout/RightAuthPanel";
import Footer from "./layout/Footer";
import ProjectDetail from "./pages/ProjectDetail";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import P404 from "./pages/P404"

import "./styles/appShell.css";

const BG_IMAGE_URL =
  "https://images.wallpaperscraft.com/image/single/mountains_starry_sky_night_161021_3840x2160.jpg";

export default function App() {
  const [isMobile, setIsMobile] = React.useState(false);

  const [leftOpen, setLeftOpen] = React.useState(false);
  const [rightOpen, setRightOpen] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");

    const apply = (matches) => {
      setIsMobile(matches);
      if (matches) {
        setLeftOpen(false);
        setRightOpen(false);
      } else {
        setLeftOpen(false);
        setRightOpen(false);
      }
    };

    apply(mq.matches);

    const onChange = (e) => apply(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const showBackdrop = isMobile && (leftOpen || rightOpen);

  const closeDrawers = () => {
    setLeftOpen(false);
    setRightOpen(false);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
      <div className="appShell"
      style={{
        "--leftCol": leftOpen ? "var(--leftW)" : "var(--leftWClosed)",
        "--rightCol": rightOpen ? "var(--rightW)" : "var(--rightWClosed)",
      }}      
      >
        <div
          className="bg"
          style={{ backgroundImage: `url(${BG_IMAGE_URL})` }}
          aria-hidden="true"
        />
        <div className="overlay" aria-hidden="true" />

        <TopHeader
          title="ZetaSlate"
          onToggleLeft={() => setLeftOpen((v) => !v)}
          onToggleRight={() => setRightOpen((v) => !v)}
          leftOpen={leftOpen}
          rightOpen={rightOpen}
        />

        <div
          className={`drawerBackdrop ${showBackdrop ? "show" : ""}`}
          onClick={closeDrawers}
          aria-hidden={!showBackdrop}
        />

        <LeftNav open={leftOpen} onToggle={() => setLeftOpen((v) => !v)} />
        <RightAuthPanel open={rightOpen} onToggle={() => setRightOpen((v) => !v)} />

        <main className="center">
          <Routes>
            <Route path="*" element={<P404 />} />
            <Route path="/" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile1" element={<Profile />} />
            <Route path="/profile2" element={<Profile />} />
            <Route path="/profile3" element={<Profile />} />
            <Route path="/profile4" element={<Profile />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
    </AuthProvider>
  );
}
