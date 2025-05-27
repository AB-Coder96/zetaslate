// src/components/Sidebar.tsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-6 left-6 z-30 text-3xl text-white drop-shadow-lg cursor-pointer hover:text-gray-300 transition duration-300"
        aria-label="Open menu"
      >
        &#9776; {/* ☰ */}
      </button>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white/80 backdrop-blur-sm z-40 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-lg`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-3xl text-stone-800 cursor-pointer hover:text-stone-600 transition duration-300"
          aria-label="Close menu"
        >
          &times; {/* ✕ */}
        </button>

        {/* Olive Wreath Icon */}
        <div className="flex justify-center mt-16 mb-8">
          <img
            src="/favicon.png"
            alt="Olive Wreath"
            className="h-16 w-16 opacity-70"
          />
        </div>

        {/* Sidebar Links */}
        <nav className="flex flex-col items-center space-y-6">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-lg font-serif text-stone-800 hover:underline cursor-pointer transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="text-lg font-serif text-stone-800 hover:underline cursor-pointer transition duration-300"
          >
            About
          </Link>
          <Link
            to="/posts"
            onClick={() => setIsOpen(false)}
            className="text-lg font-serif text-stone-800 hover:underline cursor-pointer transition duration-300"
          >
            Posts
          </Link>
          <Link
            to="/academy"
            onClick={() => setIsOpen(false)}
            className="text-lg font-serif text-stone-800 hover:underline cursor-pointer transition duration-300"
          >
            Academy
          </Link>
        </nav>
      </div>
    </>
  );
}
