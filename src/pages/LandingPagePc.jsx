// src/pages/LandingPage.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import TestimonialSection from "../components/LandingPage/TestimonialSection";
import RealPhotosGrid from "../components/LandingPage/RealPhotosGrid";
import { useNavigate } from "react-router-dom";

import { faAppleAlt } from "@fortawesome/free-solid-svg-icons";

const carouselImages = [
  "https://images.unsplash.com/photo-1599058917213-3c2ef1b8f575",
  "https://images.unsplash.com/photo-1599058917213-3c2ef1b8f576",
  "https://images.unsplash.com/photo-1599058917213-3c2ef1b8f577",
];

export default function LandingPage() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/"); // 👈 adjust path to your route
  };

  const goHome = () => {
    navigate("/"); // navigates to home page
  };

  // Auto slide every 5s
  setTimeout(() => {
    setCurrent((prev) => (prev + 1) % carouselImages.length);
  }, 5000);

  return (
    <div className="font-sans h-screen overflow-x-hidden overflow-y-auto text-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-700 via-cyan-600 to-cyan-400 w-full flex justify-between items-center px-4 md:px-6 lg:px-[250px] py-4 z-20">
        <h1 className="text-2xl font-bold text-white">FITBYVG™</h1>
        <div
          onClick={goHome}
          className="w-7 h-7 md:w-7 md:h-7 rounded-full bg-white flex items-center justify-center text-cyan-600 shadow-md cursor-pointer"
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

            <button
              onClick={handleStartClick}
              className="mt-8 mb-5 md:mb-2 cursor-pointer px-8 py-3 bg-white text-cyan-600 font-semibold rounded-3xl hover:bg-gray-200 transition flex items-center justify-center gap-2 mx-auto lg:mx-0"
            >
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
              {/* For small screens */}
              <img
                src="/Images/hero-phone-small.png"
                alt="App Screenshot"
                className="w-full h-auto object-contain rounded-[40px] block md:hidden"
              />

              {/* For medium and larger screens */}
              <img
                src="/Images/hero-phone-large.png"
                alt="App Screenshot"
                className="w-full h-auto object-contain rounded-2xl hidden md:block"
              />
            </div>
            <div className="absolute -inset-4 rounded-3xl bg-white/10 blur-3xl -z-10"></div>
          </div>
        </div>
      </section>
      {/* Testimonial Section */}
      <TestimonialSection />
      {/* Hit Your Health Goals Section */}
      <section className="relative w-full bg-white py-20 overflow-visible">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl w-64 mx-auto lg:text-5xl font-semibold text-gray-900 text-center md:mb-10 mb-10 lg:mb-20 md:text-4xl md:mx-auto md:w-[45%]">
            Hit Your Health Goals in 1-2-3
          </h2>

          {/* Step 1 */}
          <div className="flex w-64 mx-auto flex-col lg:flex-row items-center gap-10 md:mb-10 mb-10 lg:mb-32">
            {/* Text Section */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 order-1">
              <span className="text-6xl lg:text-7xl md:text-6xl font-bold text-cyan-600 leading-none">
                1
              </span>
              <h3 className="text-2xl w-70 lg:text-4xl md:text-3xl font-semibold text-gray-900">
                Track Calories & Macros
              </h3>
              <p className="text-gray-600 md:text-1xl text-md lg:text-lg leading-relaxed max-w-md">
                Log your meals easily and keep track of calories, protein,
                carbs, and fats to see real progress over time.
              </p>
            </div>

            {/* Image Section */}
            <div className="w-full md:w-[100%] lg:w-1/2 relative order-2 lg:order-2">
              <img
                src="/Images/track-food-large.png"
                alt="Achieve Goals"
                className="w-full md:w-[450px] lg:w-[500px] h-auto rounded-3xl shadow-2xl mx-auto"
              />
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-cyan-100 rounded-full -z-10 blur-2xl lg:block hidden"></div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex w-64 mx-auto flex-col lg:flex-row-reverse items-center gap-10 md:mb-10 mb-10 lg:mb-32">
            {/* Text Section */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end text-center lg:text-right space-y-3 order-1 lg:order-1 lg:pr-16">
              <span className="text-6xl lg:text-7xl md:text-6xl font-bold text-cyan-600 leading-none">
                2
              </span>
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
                Log Workouts
              </h3>
              <p className="text-gray-600 text-md lg:text-lg md:text-1xl leading-relaxed max-w-md lg:w-[400px] text-center lg:text-right">
                Track your workouts, monitor progress, and stay consistent with
                your training routine to achieve measurable gains.
              </p>
            </div>

            {/* Image Section */}
            <div className="w-full lg:w-1/2 relative order-2 lg:order-2">
              <img
                src="/Images/learn-what-works-large.png"
                alt="Log Workouts"
                className="w-[90%] md:w-[450px] lg:w-[500px] h-auto rounded-3xl shadow-2xl mx-auto"
              />
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-cyan-100 rounded-full -z-10 blur-2xl lg:block hidden"></div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex w-64 mx-auto flex-col lg:flex-row items-center gap-10 mb-20 lg:mb-32">
            {/* Text Section */}
            <div className="w-full  lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 lg:pl-10 order-1 lg:order-1">
              <span className="text-6xl lg:text-7xl md:text-6xl font-bold text-cyan-600 leading-none">
                3
              </span>
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
                Achieve Your Goals
              </h3>
              <p className="text-gray-600 text-md lg:text-lg leading-relaxed max-w-md">
                Combine tracked nutrition and workout data to reach your health
                and fitness goals smarter and faster.
              </p>
            </div>

            {/* Image Section */}
            <div className="w-full lg:w-1/2 relative order-2 lg:order-2">
              <img
                src="/Images/meal-planning-large.png"
                alt="Achieve Goals"
                className="w-[90%] md:w-[450px] lg:w-[500px] h-auto rounded-3xl shadow-2xl mx-auto"
              />
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-cyan-100 rounded-full -z-10 blur-2xl lg:block hidden"></div>
            </div>
          </div>
        </div>
      </section>
      {/* Food Tracking Card */}
      <div className="max-w-5xl  mx-auto px-4 py-10 -mt-20 relative z-10">
        <div className="bg-gradient-to-r py-18  from-cyan-600 to-blue-500 rounded-3xl shadow-2xl p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 flex justify-center md:justify-end">
            <FontAwesomeIcon
              icon={faAppleAlt}
              size="4x" // 2x, 3x, 4x, 5x work well
              className="text-white"
            />
          </div>
          <div className="flex-1 text-center md:text-left space-y-4">
            <h2 className="text-5xl md:text-4xl font-semibold text-white">
              If it’s edible, it’s in here
            </h2>
            <p className="text-2xl md:text-xl text-white/90">
              Track over 20 million <br /> global foods
            </p>
          </div>
        </div>
      </div>

      <RealPhotosGrid />

      {/* Trainer Introduction Section */}
      <section className="w-full bg-white py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
          {/* Image Card */}
          <div className="w-full lg:w-1/2">
            <div className="relative mx-auto w-full h-[480px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/Images/trainer-landing.jpg" // your photo
                alt="Virat Gajjar - Trainer"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white px-6 py-4">
                <h3 className="text-xl font-semibold">Virat Gajjar</h3>
                <p className="text-sm opacity-90">Fitness Professional</p>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2 space-y-5 text-center lg:text-left">
            <h2 className="text-4xl font-semibold text-gray-900">
              Knowledge is Power
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our philosophy is built on empowering you with the knowledge to
              take charge of your health and fitness. Studies show that keeping
              a health diary and tracking your nutrition and exercise
              dramatically improves long-term success and consistency. With the
              right guidance and tools, every step you take brings you closer to
              your best self.
            </p>
            <div className="pt-4">
              <h4 className="text-xl font-semibold text-cyan-700">
                Virat Gajjar
              </h4>
              <p className="text-gray-600 text-sm">
                ACSM Certified Personal Trainer
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cyan-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 text-center md:text-left">
          {/* Left Column - Brand + Description */}
          <div>
            <h2 className="text-3xl font-bold mb-4">FITBYVG™</h2>
            <p className="text-white/80 leading-relaxed text-base mb-6">
              Our mission is to make fitness simple, science-based, and
              achievable for everyone. Whether you’re starting out or leveling
              up — we’re here to guide you every step of the way.
            </p>
            <p className="text-white/70 italic">
              "Because knowledge is power — and your journey starts with
              action."
            </p>
          </div>

          {/* Right Column - Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-white/80 mb-8">
              <li>
                <a href="#features" className="hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#training" className="hover:text-white">
                  Live Training
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/30 mt-12 pt-10 flex flex-col items-center text-center">
          {/* Small Heading Above Button */}
          <h4 className="text-lg font-medium text-white mb-4">
            Ready to take control of your health?
          </h4>

          {/* Start Today Button */}
          <button
            onClick={goHome}
            className="px-8 py-3 bg-white text-cyan-600 font-semibold rounded-3xl hover:bg-gray-200 transition mb-8"
          >
            Start Today
          </button>

          {/* Social Media Icons */}
          <div className="flex items-center gap-6 mb-6">
            <a
              href="https://instagram.com"
              target="_blank"
              className="hover:text-gray-200 text-2xl"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              className="hover:text-gray-200 text-2xl"
            >
              <i className="fab fa-youtube"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              className="hover:text-gray-200 text-2xl"
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              className="hover:text-gray-200 text-2xl"
            >
              <i className="fab fa-facebook"></i>
            </a>
          </div>

          {/* Copyright */}
          <p className="text-white/80 text-sm pb-10">
            © 2025 FITBYVG. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
