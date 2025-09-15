import { FaArrowLeft } from "react-icons/fa";
import {
  FaDumbbell,
  FaHeartbeat,
  FaRunning,
  FaAppleAlt,
  FaMedkit,
  FaBalanceScale,
  FaExpandArrowsAlt,
  FaTrophy,
  FaLeaf,
  FaChild,
} from "react-icons/fa";

// Goal-specific motivational content
const MOTIVATIONAL_CONTENT = {
  "lose-fat": {
    icon: FaBalanceScale,
    title: "Your Fat Loss Journey Starts Now!",
    subtitle: "Real talk:",
    message: "Losing fat isn't always linear, but every step forward counts.",
    description:
      "We'll help you navigate the ups and downs, celebrate the victories, and keep you motivated when progress feels slow. Your consistency today creates the transformation tomorrow.",
    visualization: "progress-chart",
    encouragement: "P.S. You've already taken the hardest step: starting! 💪",
  },
  "gain-muscle": {
    icon: FaDumbbell,
    title: "Time to Build That Strength!",
    subtitle: "Here's the truth:",
    message:
      "Building muscle takes patience, but the results are life-changing.",
    description:
      "Every rep, every set, every protein-packed meal is an investment in a stronger, more confident you. We'll guide you through proven strategies that actually work.",
    visualization: "strength-progression",
    encouragement: "Remember: Champions are built one workout at a time! 🔥",
  },
  "improve-stamina": {
    icon: FaHeartbeat,
    title: "Let's Boost That Endurance!",
    subtitle: "Ready for this?",
    message: "Your cardiovascular transformation is about to begin.",
    description:
      "From climbing stairs without getting winded to crushing that 5K, we'll gradually build your endurance in a way that feels challenging but achievable.",
    visualization: "cardio-improvement",
    encouragement:
      "Your future self will thank you for every step you take today! ❤️",
  },
  "get-stronger": {
    icon: FaDumbbell,
    title: "Strength Is Your Superpower!",
    subtitle: "Listen up:",
    message:
      "Getting stronger changes everything - not just your body, but your mindset.",
    description:
      "We'll progressively challenge you with workouts designed to build real, functional strength that carries over into every aspect of your life.",
    visualization: "strength-progression",
    encouragement:
      "Strong people are harder to kill and more useful in general! 💪",
  },
  "improve-nutrition": {
    icon: FaAppleAlt,
    title: "Fuel Your Success!",
    subtitle: "Nutrition truth:",
    message: "Great results happen in the kitchen as much as in the gym.",
    description:
      "We'll help you develop sustainable eating habits that support your goals without feeling restrictive. No crash diets, just smart nutrition that works for your lifestyle.",
    visualization: "nutrition-balance",
    encouragement:
      "You're not just changing what you eat, you're changing how you live! 🥗",
  },
  "injury-recovery": {
    icon: FaMedkit,
    title: "Recovery Is Your Priority!",
    subtitle: "Important reminder:",
    message: "Healing takes time, but smart training accelerates recovery.",
    description:
      "Our approach focuses on safe, progressive exercises that strengthen your body while respecting your recovery process. Every movement is chosen with your wellbeing in mind.",
    visualization: "recovery-timeline",
    encouragement: "Comeback stories are always the best stories! 🩺",
  },
  "maintain-fitness": {
    icon: FaLeaf,
    title: "Consistency Is Your Secret Weapon!",
    subtitle: "Smart choice:",
    message: "Maintaining fitness is about sustainable habits, not perfection.",
    description:
      "We'll help you create a routine that fits your life and keeps you feeling strong, energetic, and confident for years to come.",
    visualization: "consistency-tracker",
    encouragement:
      "The best workout is the one you actually do consistently! 🌱",
  },
  "improve-flexibility": {
    icon: FaChild,
    title: "Mobility Is Freedom!",
    subtitle: "Here's why this matters:",
    message:
      "Better flexibility means better movement, less pain, more confidence.",
    description:
      "We'll guide you through targeted mobility work that improves your posture, reduces stiffness, and helps you move with ease throughout your day.",
    visualization: "flexibility-progress",
    encouragement:
      "Every stretch is a step towards feeling younger and moving better! 🤸",
  },
  "sports-performance": {
    icon: FaTrophy,
    title: "Unleash Your Athletic Potential!",
    subtitle: "Game time:",
    message: "Elite performance requires elite preparation.",
    description:
      "Our sport-specific training will enhance your speed, agility, power, and endurance to give you the competitive edge you're looking for.",
    visualization: "performance-metrics",
    encouragement: "Champions train when they don't feel like it! 🏆",
  },
  "lifestyle-change": {
    icon: FaRunning,
    title: "Transform Your Entire Lifestyle!",
    subtitle: "Big picture thinking:",
    message:
      "This isn't just about fitness - it's about becoming your best self.",
    description:
      "We'll help you build habits that create lasting change: consistent workouts, better sleep, stress management, and a mindset that supports your goals.",
    visualization: "lifestyle-transformation",
    encouragement:
      "You're not just changing your body, you're upgrading your entire life! ✨",
  },
};

// Default content if no specific goals match
const DEFAULT_CONTENT = {
  icon: FaHeartbeat,
  title: "Your Fitness Journey Begins!",
  subtitle: "Ready to start?",
  message:
    "Every fitness journey is unique, but they all start with one decision.",
  description:
    "We'll be with you every step of the way, providing guidance, motivation, and the tools you need to reach your goals.",
  visualization: "general-progress",
  encouragement:
    "The best time to start was yesterday. The second best time is now! 🚀",
};

export default function MotivationalMessage({
  firstName,
  goals = [],
  onNext,
  onBack,
}) {
  // Determine which motivational content to show based on primary goal
  const primaryGoal = goals.length > 0 ? goals[0] : null;
  const content = primaryGoal
    ? MOTIVATIONAL_CONTENT[primaryGoal.id] || DEFAULT_CONTENT
    : DEFAULT_CONTENT;
  const IconComponent = content.icon;

  const renderVisualization = () => {
    if (content.visualization === "progress-chart") {
      return (
        <div className="bg-gray-800/50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 backdrop-blur-sm border border-gray-700">
          <div className="relative h-24 sm:h-32 mb-3 sm:mb-4">
            <svg
              viewBox="0 0 300 100"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              {/* Grid background */}
              <defs>
                <pattern
                  id="grid"
                  width="30"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 30 0 L 0 0 0 20"
                    fill="none"
                    stroke="rgba(99,102,241,0.2)"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Progress curve */}
              <path
                d="M0,70 Q50,65 75,60 Q125,55 150,50 Q200,45 225,40 Q275,35 300,30"
                stroke="#6366f1"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />

              {/* Start point */}
              <circle cx="15" cy="65" r="4" fill="#6366f1" />
              {/* Goal point */}
              <circle cx="285" cy="32" r="4" fill="#10b981" />
            </svg>
          </div>
          <div className="flex justify-between text-gray-400 text-xs sm:text-sm">
            <span>Today</span>
            <span>Your Goal</span>
          </div>
        </div>
      );
    }

    // Default visualization for other goal types
    return (
      <div className="bg-gray-800/50 rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 backdrop-blur-sm border border-gray-700 flex flex-col items-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
          <IconComponent className="text-white text-xl sm:text-2xl" />
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-white mb-2">
            {primaryGoal?.title || "Your Goal"}
          </div>
          <div className="text-gray-300 text-xs sm:text-sm">
            {primaryGoal?.description || "Let's make it happen!"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="w-full max-w-full sm:max-w-md mx-auto px-3 sm:px-4 min-h-screen flex flex-col pb-6 sm:pb-4">
        {/* Header */}
        <div className="py-3 sm:py-4 mb-0 sm:mb-8">
          <h1 className="text-lg sm:text-xl font-medium text-gray-300">
            Motivation
          </h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-2 sm:mb-8">
            <p className="text-gray-400 text-base sm:text-lg mb-3 sm:mb-4">
              {content.subtitle}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              {content.title}
            </h2>
            <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
              {content.message}
            </p>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
              {content.description}
            </p>
          </div>

          {/* Visualization */}
          {renderVisualization()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between py-4 sm:py-6 mt-4 sm:mt-6 sticky bottom-0 bg-gray-900/80 backdrop-blur-md rounded-t-xl px-2 sm:px-4">
          <button
            onClick={onBack}
            className="w-10 h-10 cursor-pointer sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors backdrop-blur-sm border border-gray-600"
          >
            <FaArrowLeft className="text-white text-sm sm:text-base" />
          </button>

          <button
            onClick={onNext}
            className="flex-1 cursor-pointer ml-3 sm:ml-4 py-3 sm:py-4 px-4 sm:px-8 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700  text-white shadow-lg text-sm sm:text-base"
          >
            Continue Journey
          </button>
        </div>
      </div>
    </div>
  );
}
