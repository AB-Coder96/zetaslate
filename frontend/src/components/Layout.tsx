// src/components/Layout.tsx
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center bg-no-repeat overflow-x-hidden"
      style={{
        backgroundImage: "url('/bg.jpg')",
        filter: "grayscale(60%) brightness(115%) sepia(20%)",
        backgroundAttachment: "fixed", // Optional: makes background stick while scrolling
      }}
    >
      {/* Transparent Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto px-6 py-20">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
