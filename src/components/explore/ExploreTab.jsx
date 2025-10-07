// src/components/dashboard/Explore.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const articlesData = [
  {
    id: 1,
    title: "The Science of Muscle Growth",
    category: "Exercise",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    description:
      "Learn how resistance training stimulates muscle fibers, how recovery helps them grow, and how to structure your workouts effectively.",
    link: "#",
  },
  {
    id: 2,
    title: "Nutrition for Fat Loss",
    category: "Nutrition",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c1e",
    description:
      "Understand calorie deficits, macronutrient ratios, and how to sustain fat loss without compromising muscle mass or health.",
    link: "#",
  },
  {
    id: 3,
    title: "Optimizing Recovery and Sleep",
    category: "Recovery",
    image: "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8",
    description:
      "Discover how proper rest, sleep quality, and recovery protocols can dramatically improve your training results.",
    link: "#",
  },
  {
    id: 4,
    title: "Anti-Aging Through Fitness",
    category: "Longevity",
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca",
    description:
      "Explore how exercise, nutrition, and lifestyle habits influence your biological age and overall vitality.",
    link: "#",
  },
  {
    id: 5,
    title: "Gut Health and Immunity",
    category: "Health",
    image: "https://images.unsplash.com/photo-1585238342028-4bbc4a474273",
    description:
      "A healthy gut means a strong immune system. Learn about probiotics, prebiotics, and how to nourish your microbiome.",
    link: "#",
  },
];

export default function ExploreTab() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    setArticles(articlesData);
  }, []);

  return (
    <div className="py-4 px-3 sm:px-4 md:px-6">
      {/* Header */}
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
        🧭 Explore Health & Fitness
      </h1>
      <p className="text-gray-600 text-sm sm:text-base mb-5">
        Articles about training, nutrition, recovery, and longevity — all in one
        place.
      </p>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-44 sm:h-48 md:h-52 object-cover"
              loading="lazy"
            />

            <div className="p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-blue-500 font-semibold mb-1">
                {article.category}
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {article.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-3">
                {article.description}
              </p>
              <a
                href={article.link}
                className="text-cyan-600 text-xs sm:text-sm font-medium hover:underline"
              >
                Read More →
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
