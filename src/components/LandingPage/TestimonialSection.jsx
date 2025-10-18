import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    quote:
      "This app completely transformed my fitness journey. I track meals, workouts, and progress all in one place. Highly recommended!",
    name: "— Priya S.",
  },
  {
    quote:
      "I finally achieved my fitness goals thanks to this amazing app. The tracking and coaching features are superb!",
    name: "— Rishi K.",
  },
  {
    quote:
      "The best app for staying motivated and consistent. My results speak for themselves!",
    name: "— Ananya M.",
  },
];

export default function TestimonialSection() {
  const [current, setCurrent] = useState(0);

  return (
    <section className="w-full  bg-gray-900/90 py-16">
      <div className="w-[80%] md:w-[50%] lg:w-[100%] mx-auto text-center px-4">
        {/* Big Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12">
          Results Not Promises
        </h2>

        {/* Testimonial Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-white text-lg md:text-xl italic"
            >
              “{testimonials[current].quote}”
            </motion.div>
          </AnimatePresence>

          {/* User Name */}
          <div className="text-white mt-4 font-semibold">
            {testimonials[current].name}
          </div>

          {/* Star Rating */}
          <div className="flex justify-center mt-6 space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-6 h-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.95c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.286-3.95a1 1 0 00-.364-1.118L2.035 9.377c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.95z" />
              </svg>
            ))}
          </div>

          {/* Clickable Dots */}
          <div className="flex justify-center mt-6 space-x-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i === current ? "bg-white" : "bg-gray-500/50"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
