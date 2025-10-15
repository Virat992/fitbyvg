// src/pages/LandingPage.jsx
import { useState } from "react";
import { motion } from "framer-motion";

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
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-r from-cyan-600 to-blue-500 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          {carouselImages.map((img, index) => (
            <motion.img
              key={index}
              src={img}
              alt={`Slide ${index}`}
              className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === current ? 1 : 0 }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">FITBYVG</h1>
          <p className="text-xl max-w-xl mx-auto">
            Workouts designed for your fitness goals by experienced fitness
            professionals.
          </p>
          <button className="mt-6 px-8 py-3 bg-white text-cyan-600 font-semibold rounded-lg hover:bg-gray-200 transition">
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12 text-cyan-600">
          Features
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer text-center"
            >
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Progress & Charts Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Track Your Progress</h2>
          <p className="mb-12 text-lg">
            Visualize your growth and stay motivated with detailed charts and
            insights.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1554284126-3e3e0f2f1599"
                alt="Progress Chart"
                className="rounded-lg mb-4"
              />
              <p className="font-semibold text-center">Workout Progress</p>
            </div>
            <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1554284126-3e3e0f2f1598"
                alt="Diet Chart"
                className="rounded-lg mb-4"
              />
              <p className="font-semibold text-center">Diet & Macros</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chat With Coach Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 px-4">
          <img
            src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1"
            alt="Chat with coach"
            className="rounded-2xl shadow-lg w-full md:w-1/2"
          />
          <div>
            <h2 className="text-4xl font-bold text-cyan-600 mb-6">
              Chat With Your Coach Anytime
            </h2>
            <p className="text-gray-700 mb-6">
              Get real-time guidance and motivation from certified fitness
              professionals to help you achieve your goals faster.
            </p>
            <button className="px-8 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition">
              Start Chatting
            </button>
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
