import { Link } from "react-router-dom";
import Sidebar from "./Sidebar"; // Sidebar stays outside

export default function Header() {
  return (
    <header className="relative w-full py-6 bg-transparent">
      
      {/* Sidebar (absolute/fixed so it doesn't move other content) */}
      <div className="absolute top-6 left-6">
        <Sidebar />
      </div>

      {/* Main Title + Subtitle */}
      <div className="flex flex-col items-center">
        {/* Big Title */}
        <h1 className="text-4xl md:text-5xl font-serif font-extrabold tracking-widest uppercase text-white drop-shadow-lg mb-2">
  <Link
    to="/"
    className="shimmer-hover text-white hover:text-gray-300 no-underline transition-colors duration-300"
  >
    First Name Last Name
  </Link>
</h1>

        {/* Small Subtitle */}
        <h2 className="text-lg font-sans tracking-wide text-stone-300">
          Personal Website
        </h2>
      </div>

    </header>
  );
}
