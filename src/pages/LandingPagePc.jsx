// src/pages/LandingPage.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import TestimonialSection from "../components/LandingPage/TestimonialSection";

const carouselImages = [
  "https://images.unsplash.com/photo-1599058917213-3c2ef1b8f575",
  "https://images.unsplash.com/photo-1599058917213-3c2ef1b8f576",
  "https://images.unsplash.com/photo-1599058917213-3c2ef1b8f577",
];

export default function LandingPage() {
  const [current, setCurrent] = useState(0);

  // Auto slide every 5s
  setTimeout(() => {
    setCurrent((prev) => (prev + 1) % carouselImages.length);
  }, 5000);

  return (
    <div className="font-sans h-screen overflow-y-auto text-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-700 via-cyan-600 to-cyan-400 w-full flex justify-between items-center px-4 md:px-6 lg:px-[250px] py-4 z-20">
        <h1 className="text-2xl font-bold text-white">FITBYVG™</h1>
        <div className="w-7 h-7 md:w-7 md:h-7 rounded-full bg-white flex items-center justify-center text-cyan-600 shadow-md cursor-pointer">
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

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-cyan-700 via-cyan-600 to-cyan-400 py-16 md:px-16 lg:px-[255px]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between gap-12  mx-auto">
          {/* Left Text Content */}
          <div className="text-white w-65 lg:w-[100%] mx-auto md:w-90 text-center lg:text-left">
            <p className="text-lg font-semibold mb-6 opacity-90">
              #1 Nutrition tracking and workout app designed for India
            </p>
            <h1 className="text-5xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-4">
              <span className="bg-white px-2 text-cyan-600">Transform</span>{" "}
              Your Fitness Journey
            </h1>
            <p className="text-lg max-w-[450px] mx-auto lg:mx-0 opacity-90">
              Track your meals, log workouts, and connect with fitness
              coaches—all in one app.
            </p>

            <button className="mt-8 mb-5 md:mb-2 cursor-pointer px-8 py-3 bg-white text-cyan-600 font-semibold rounded-3xl hover:bg-gray-200 transition flex items-center justify-center gap-2 mx-auto lg:mx-0">
              <span className="text-[15px] font-bold tracking-wide">
                BEGIN YOUR JOURNEY
              </span>
              <span className="text-[16px] leading-none relative -top-[1px] animate-left-right">
                ❯
              </span>
            </button>
          </div>

          {/* Right Image (Phone Mockup) */}
          <div className="relative lg:mr-5 flex justify-center lg:justify-end w-full">
            <div className="w-64 sm:w-72 md:w-65 bg-white rounded-[40px] shadow-2xl flex justify-center">
              <img
                src="/Images/hero-phone-large.png"
                alt="App Screenshot"
                className="w-full h-auto object-contain rounded-2xl"
              />
            </div>
            <div className="absolute -inset-4 rounded-3xl bg-white/10 blur-3xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* Hit Your Health Goals Section */}
      <section className=" relative w-full bg-white py-20 overflow-visible pb-[400px]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl md:w-[45%] md:mx-auto md:text-4xl font-semibold text-gray-900 text-center mb-20">
            Hit Your Health Goals in 1-2-3
          </h2>

          {/* Step 1 */}
          <div className="flex absolute left-70 flex-col lg:flex-row items-center gap-10 mb-32">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 relative">
              <img
                src="/Images/track-food-large.png"
                alt="Track Calories"
                className="w-[90%] lg:w-[500px] h-auto rounded-3xl shadow-2xl mx-auto lg:ml-0"
              />
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-cyan-100 rounded-full -z-10 blur-2xl"></div>
            </div>

            {/* Text Section */}
            <div className="w-full ml-10 mb-5 lg:w-1/2 text-center lg:text-left">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3">
                {/* Step Number */}
                <span className="text-7xl font-bold text-cyan-600 leading-none">
                  1
                </span>

                {/* Step Title */}
                <h3 className="text-4xl font-semibold text-gray-900">
                  Track Calories & Macros
                </h3>

                {/* Step Description */}
                <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                  Log your meals easily and keep track of calories,
                  <br /> protein, carbs, and fats to see real progress over
                  time.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 (reversed layout) */}
          <div className="flex top-125 right-50 flex-col lg:flex-row-reverse items-center gap-0 mb-32 relative">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 relative">
              <img
                src="/Images/learn-what-works-large.png"
                alt="Log Workouts"
                className="w-[90%] lg:w-[500px] h-auto rounded-3xl shadow-2xl lg:mr-0"
              />
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-cyan-100 rounded-full -z-10 blur-2xl"></div>
            </div>

            {/* Text Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left ml-0 lg:ml-60">
              <div className="flex flex-col mr-15 items-center lg:items-end text-center lg:text-left space-y-3">
                {/* Step Number */}
                <span className="text-7xl font-bold text-cyan-600 leading-none">
                  2
                </span>

                {/* Step Title */}
                <h3 className="text-4xl font-semibold text-gray-900">
                  Log Workouts
                </h3>

                {/* Step Description */}
                <p className="text-gray-600 text-lg leading-relaxed max-w-md text-right lg:text-right">
                  Track your workouts, monitor progress, and stay consistent
                  with your training routine to achieve measurable gains.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex top-80 left-10 flex-col lg:flex-row items-center gap-10 relative">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 relative">
              <img
                src="/Images/meal-planning-large.png "
                alt="Achieve Goals"
                className="w-[90%] lg:w-[500px] h-auto rounded-3xl shadow-2xl mx-auto lg:ml-0"
              />
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-cyan-100 rounded-full -z-10 blur-2xl"></div>
            </div>

            {/* Text Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3">
                {/* Step Number */}
                <span className="text-7xl font-bold text-cyan-600 leading-none">
                  3
                </span>

                {/* Step Title */}
                <h3 className="text-4xl font-semibold text-gray-900">
                  Achieve Your Goals
                </h3>

                {/* Step Description */}
                <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                  Combine tracked nutrition and workout data to reach your
                  health and fitness goals smarter and faster.
                </p>
              </div>
            </div>
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
