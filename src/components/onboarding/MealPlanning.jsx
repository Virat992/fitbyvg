import { useState } from "react";
import BottomNavigation from "../BottomNavigation"; // Using same BottomNavigation for consistency

const mealPlanningOptions = [
  "Never",
  "Rarely",
  "Occasionally",
  "Frequently",
  "Always",
];

export default function MealPlanning({ onNext, onBack }) {
  const [selectedOption, setSelectedOption] = useState("Occasionally"); // Default

  const handleNext = () => {
    onNext({
      mealPlanningFrequency: selectedOption,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto h-dvh flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      {/* Header */}
      <div className="px-4 pt-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Meal Planning Habits
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 overflow-y-auto scrollbar-hide">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          How often do you plan your meals in advance?
        </h2>

        {/* Options */}
        <div className="space-y-4 pb-4">
          {mealPlanningOptions.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedOption(option)}
              className={`w-full p-4 rounded-xl border-2 text-left font-medium text-lg transition-all ${
                selectedOption === option
                  ? "border-cyan-500 bg-gray-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{option}</span>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedOption === option
                      ? "border-cyan-500 bg-cyan-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedOption === option && (
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
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-4 py-6 pb-16">
        <BottomNavigation
          onBack={onBack}
          onNext={handleNext}
          nextDisabled={!selectedOption}
        />
      </div>
    </div>
  );
}
