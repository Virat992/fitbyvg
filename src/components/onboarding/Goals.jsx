import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Button from "../Button";

const GOAL_OPTIONS = [
  {
    id: "lose-fat",
    title: "Lose Body Fat",
    description: "Reduce body fat percentage and lose weight",
  },
  {
    id: "gain-muscle",
    title: "Build Muscle",
    description: "Increase muscle mass and strength",
  },
  {
    id: "improve-stamina",
    title: "Improve Stamina",
    description: "Enhance cardiovascular endurance and energy",
  },
  {
    id: "get-stronger",
    title: "Get Stronger",
    description: "Increase overall strength and power",
  },
  {
    id: "improve-nutrition",
    title: "Improve Nutrition",
    description: "Develop healthy eating habits and meal planning",
  },
  {
    id: "injury-recovery",
    title: "Recover from Injury",
    description: "Rehabilitation and safe return to activity",
  },
  {
    id: "maintain-fitness",
    title: "Maintain Current Fitness",
    description: "Stay active and maintain current health level",
  },
  {
    id: "improve-flexibility",
    title: "Improve Flexibility",
    description: "Enhance mobility, posture and reduce stiffness",
  },
  {
    id: "sports-performance",
    title: "Athletic Performance",
    description: "Sport-specific training and competition prep",
  },
  {
    id: "lifestyle-change",
    title: "Healthy Lifestyle",
    description: "Build consistent fitness habits and routines",
  },
];

export default function Goals({ firstName, onNext, onBack }) {
  const [selectedGoals, setSelectedGoals] = useState([]);

  const toggleGoal = (goal) => {
    setSelectedGoals((prev) => {
      const goalId = goal.id;
      if (prev.find((g) => g.id === goalId)) {
        return prev.filter((g) => g.id !== goalId);
      } else if (prev.length < 3) {
        return [...prev, goal];
      }
      return prev;
    });
  };

  const handleNext = () => {
    if (selectedGoals.length > 0) {
      onNext({ goals: selectedGoals });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Goals</h1>
      </div>

      {/* Main Content with Fixed Height */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Hey, {firstName}. <span>👋</span> Let's start with your goals.
        </h2>
        <p className="text-gray-600 text-base mb-6">
          Select up to 3 that are important to you.
        </p>

        {/* Goals List - Scrollable with max height to avoid navigation */}
        <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
          {GOAL_OPTIONS.map((goal) => {
            const isSelected = selectedGoals.find((g) => g.id === goal.id);
            return (
              <div
                key={goal.id}
                onClick={() => toggleGoal(goal)}
                className={`flex items-start p-4 rounded-xl cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-blue-50 border-2 border-blue-500"
                    : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                }`}
              >
                <div className="flex-1 mr-3">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                </div>
                <div
                  className={`w-5 h-5 border-2 rounded mt-1 ${
                    isSelected
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  } flex items-center justify-center flex-shrink-0`}
                >
                  {isSelected && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation - Fixed at bottom like Welcome */}
      <div className="flex items-center mt-0 justify-between pt-0">
        <button
          onClick={onBack}
          className="w-12 h-12 cursor-pointer flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>

        <div className="flex-1 ml-4">
          <Button
            onClick={handleNext}
            disabled={selectedGoals.length === 0}
            variant={selectedGoals.length > 0 ? "primary" : "gray"}
            size="md"
            className="px-6 py-3"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
