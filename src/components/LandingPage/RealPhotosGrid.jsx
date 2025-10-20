// src/components/LandingPage/RealPhotosGrid.jsx
import { useState } from "react";

const photos = [
  "https://images.unsplash.com/photo-1689897790033-12f7ec202b57?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=627",
  "https://images.unsplash.com/photo-1571388072750-31a921b3d900?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1025",
  "https://images.unsplash.com/photo-1659350776365-da58737786cb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
  "https://cdn.pixabay.com/photo/2014/09/23/02/03/athlete-457064_1280.jpg",
  "https://cdn.pixabay.com/photo/2016/08/31/02/58/bodybuilding-1632548_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/07/05/10/55/gym-8108014_1280.jpg",
];

const testimonials = [
  {
    text: "This app completely transformed my fitness journey! I never felt so motivated.",
    author: "Ravi K.",
  },
  {
    text: "Tracking my meals and workouts became so easy and efficient. Highly recommend it!",
    author: "Neha S.",
  },
  {
    text: "I achieved my fitness goals faster than I expected. Amazing app! & Support from the coaches",
    author: "Vikram P.",
  },
  {
    text: "This app completely changed my fitness routine. I finally feel confident and consistent!",
    author: "Arjun M.",
  },
  {
    text: "Tracking my meals and workouts is effortless now. It keeps me motivated every single day!",
    author: "Priya T.",
  },
  {
    text: "I hit my fitness goals faster than I thought possible. Truly a game-changer!",
    author: "Karan S.",
  },
];

export default function RealPhotosGrid() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full bg-white py-15">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 text-center mb-12">
          Real Transformations
        </h2>

        {/* 2x3 Grid */}
        <div className="grid grid-cols-3 gap-2 mb-12">
          {photos.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Transformation ${index + 1}`}
              className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-md"
            />
          ))}
        </div>

        {/* Testimonial Text */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <p className="text-gray-700 text-lg italic mb-3">
            "{testimonials[activeIndex].text}"
          </p>
          <span className="text-gray-900 font-semibold">
            - {testimonials[activeIndex].author}
          </span>
        </div>

        {/* Scroll Dots */}
        <div className="flex justify-center gap-3">
          {testimonials.map((_, index) => (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full cursor-pointer transition ${
                activeIndex === index ? "bg-cyan-600" : "bg-gray-400"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}
