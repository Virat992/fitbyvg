import { useState } from "react";
import BottomNavigation from "../BottomNavigation";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const toggleGoal = (goal) => {
    setSelectedGoals((prev) => {
      const alreadySelected = prev.some((g) => g.id === goal.id);
      if (alreadySelected) return prev.filter((g) => g.id !== goal.id);
      if (prev.length >= 3) return prev;
      return [...prev, goal];
    });
  };

  const handleNext = () => {
    if (selectedGoals.length > 0) {
      onNext({ goals: selectedGoals });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // redirect to landing/login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto h-dvh flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      {/* Header */}
      <div className="px-4 pt-6 mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Goals</h1>
        <button
          onClick={handleLogout}
          className="text-sm font-semibold text-cyan-600 cursor-pointer hover:font-bold"
        >
          Logout
        </button>
      </div>

      {/* Main Content (scrollable if needed) */}
      <div className="flex-1 px-4 overflow-y-auto scrollbar-hide">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Hey, {firstName}. <span>👋</span> Let's start with your goals.
        </h2>
        <p className="text-gray-600 text-base mb-6">
          Select up to 3 that are important to you.
        </p>

        {/* Goals List */}
        <div className="space-y-3 pr-2 pb-4">
          {GOAL_OPTIONS.map((goal) => {
            const isSelected = selectedGoals.find((g) => g.id === goal.id);
            return (
              <div
                key={goal.id}
                onClick={() => toggleGoal(goal)}
                className={`flex items-start p-4 rounded-xl cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-blue-50 border-2 border-cyan-600"
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
                      ? "border-cyan-600 bg-cyan-600"
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

      {/* ✅ Fixed Bottom Navigation */}
      <div className="px-4 py-6 pb-16">
        <BottomNavigation
          onBack={onBack}
          onNext={handleNext}
          nextDisabled={selectedGoals.length === 0}
        />
      </div>
    </div>
  );
}
