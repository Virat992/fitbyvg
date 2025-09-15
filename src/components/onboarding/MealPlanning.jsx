import { useState } from "react";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import Button from "../Button"; // optional if you want to use your Button component

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && selectedOption) {
      handleNext();
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="w-full max-w-md mx-auto px-4 flex flex-col h-full">
        {/* Header */}
        <div className="pt-4 pb-6 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Goals</h1>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 flex flex-col">
          <div className="flex-shrink-0 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              How often do you plan your meals in advance?
            </h2>
          </div>

          {/* Options - Scrollable Container */}
          <div className="flex-1 overflow-y-auto pb-28">
            <div className="space-y-4">
              {mealPlanningOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedOption(option)}
                  onKeyPress={handleKeyPress}
                  className={`w-full p-4 rounded-xl border-2 text-left font-medium text-lg transition-all ${
                    selectedOption === option
                      ? "border-blue-500 bg-gray-50"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">{option}</span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedOption === option
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedOption === option && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation - Sticky at bottom */}
        <div className="flex-shrink-0 sticky bottom-0 border-t border-gray-100 pt-4 pb-6 ">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={onBack}
              className="w-16 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>

            <Button
              onClick={handleNext}
              disabled={!selectedOption}
              variant={selectedOption ? "primary" : "gray"}
              size="md"
              className="px-6 py-3"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
