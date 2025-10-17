// src/pages/LandingPage.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

// Example images (replace with your own)
const carouselImages = [
  "https://images.unsplash.com/photo-1599058917213-3c2ef1b8f575",
  "https://images.unsplash.com/photo-1599058917213-3c2ef1b8f576",
  "https://images.unsplash.com/photo-1599058917213-3c2ef1b8f577",
];

const features = [
  {
    title: "Log Workouts",
    desc: "Keep track of all exercises and workouts you complete.",
  },
  {
    title: "Track Diet & Meals",
    desc: "Log your meals, calories, and track macros effectively.",
  },
  {
    title: "Monitor Progress",
    desc: "Visualize your fitness journey with detailed charts.",
  },
  {
    title: "Chat With Coach",
    desc: "Get guidance and support from fitness professionals anytime.",
  },
];

export default function LandingPage() {
  const [current, setCurrent] = useState(0);

  // Auto slide every 5s
  setTimeout(() => {
    setCurrent((prev) => (prev + 1) % carouselImages.length);
  }, 5000);

  return (
    <div className="font-sans overflow-auto text-gray-900">
      {/* Header */}
      <header className=" bg-gradient-to-r from-cyan-600 to-blue-500 w-full flex justify-between items-center px-[250px] py-4 z-20">
        <h1 className="text-2xl font-bold text-white">FITBYVG™</h1>
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-cyan-600 shadow-md cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="w-6 h-6"
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

      {/* Hero Section */}
      <section className=" h-screen px-[192px] mb-14 bg-gradient-to-r from-cyan-600 to-blue-500 flex flex-col justify-center">
        <div className="max-w-full flex flex-col md:flex-row items-center justify-between mb-24 md:px-16">
          {/* Left Text Content */}
          <div className="text-white max-w-[700px] mb-12 md:mb-0">
            <p className="text-lg mb-8 opacity-90">
              Nutrition tracking and workout app designed for India
            </p>
            <h1 className="text-5xl max-w-[700px] md:text-6xl font-semibold leading-tight mb-4">
              <span className="bg-white px-2 text-cyan-600">Transform</span>{" "}
              Your Fitness Journey
            </h1>
            <p className="text-lg max-w-[450px] opacity-90">
              Track your meals, log workouts, and connect with fitness
              coaches—all in one app.
            </p>

            <button className="mt-8 cursor-pointer px-8 py-3 bg-white text-cyan-600 font-semibold rounded-3xl hover:bg-gray-200 transition flex items-center justify-center gap-2">
              <span className="text-[15px] tracking-wide">
                BEGIN YOUR JOURNEY
              </span>
              <span className="text-[16px] leading-none relative -top-[1px]">
                ❯
              </span>
            </button>
          </div>

          {/* Right Image (Phone Mockup) */}
          <div className="relative">
            <div className="w-64 mr-8  bg-white rounded-[40px] shadow-2xl p-0">
              <img
                src="/Images/hero-phone-large.png"
                alt="App Screenshot"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="absolute inset-0 rounded-3xl bg-white/10 blur-2xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-cyan-600 text-white text-center">
        <p>© 2025 FITBYVG. All rights reserved.</p>
      </footer>
    </div>
  );
}
