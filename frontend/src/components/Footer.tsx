// src/components/Footer.tsx
export default function Footer() {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="bg-stone-900 text-stone-300 text-sm py-6 text-center">
        &copy; 2024{currentYear > 2024 ? `–${currentYear}` : ""} sample developer. All rights reserved.
      </footer>
    );
  }
  