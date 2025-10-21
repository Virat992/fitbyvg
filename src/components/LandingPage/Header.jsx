import { useEffect, useState } from "react";

export default function Header({ goHome }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full flex justify-between items-center px-4 md:px-6 lg:px-[265px] py-4 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md"
          : "bg-gradient-to-r from-cyan-700 via-cyan-600 to-cyan-400"
      }`}
    >
      {/* Logo */}
      <h1
        className={`text-2xl font-bold transition-colors duration-300 ${
          scrolled ? "text-cyan-600" : "text-white"
        }`}
      >
        FITBYVG™
      </h1>

      {/* Icon Button */}
      <div
        onClick={goHome}
        className={`w-7 h-7 md:w-7 md:h-7 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all duration-300 ${
          scrolled ? "bg-cyan-600 text-white" : "bg-white text-cyan-600"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
          className="w-5 h-5 md:w-5 md:h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 
              20.25a8.25 8.25 0 0115 0M12 14.25v.008h.008V14.25H12z"
          />
        </svg>
      </div>
    </header>
  );
}
