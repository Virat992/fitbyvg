import { useState } from "react";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import Button from "../Button";

const barrierOptions = [
  "Lack of time",
  "The regimen was hard to follow",
  "Healthy diets lack variety",
  "Stress around food choices",
  "Holidays/Vacation/Social Events",
  "Food cravings",
  "Lack of progress",
];

export default function WeightLossBarriers({ onNext, onBack }) {
  const [selectedBarriers, setSelectedBarriers] = useState([
    "Lack of time",
    "The regimen was hard to follow",
    "Healthy diets lack variety",
  ]);

  const handleBarrierToggle = (barrier) => {
    setSelectedBarriers((prev) =>
      prev.includes(barrier)
        ? prev.filter((item) => item !== barrier)
        : [...prev, barrier]
    );
  };

  const handleNext = () => {
    onNext({
      weightLossBarriers: selectedBarriers,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
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
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-shrink-0 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
              In the past, what have been your barriers to losing weight?
            </h2>
            <p className="text-gray-500 text-sm">Select all that apply.</p>
          </div>

          {/* Barriers List - Scrollable Container */}
          <div className="flex-1 overflow-y-auto pb-28 -mr-4 pr-4">
            <div className="space-y-4">
              {barrierOptions.map((barrier) => (
                <button
                  key={barrier}
                  onClick={() => handleBarrierToggle(barrier)}
                  onKeyPress={handleKeyPress}
                  className={`w-full p-4 rounded-xl border-2 text-left font-medium text-lg transition-all ${
                    selectedBarriers.includes(barrier)
                      ? "border-blue-500 bg-gray-50"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 pr-4">{barrier}</span>
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedBarriers.includes(barrier)
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedBarriers.includes(barrier) && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation - Sticky at bottom with z-index */}
        <div
          className="sticky bottom-0 z-50 border-t border-gray-100 pt-6 pb-6 
             bg-gradient-to-b from-cyan-50  to-cyan-100"
        >
          <div className="max-w-md mx-auto px-1">
            <div className="flex  items-center justify-between">
              <button
                onClick={onBack}
                className="w-12 h-12 flex cursor-pointer items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>

              <button
                onClick={handleNext}
                className="flex-1 ml-4 py-3 px-9 rounded-full cursor-pointer font-semibold text-white transition-all bg-cyan-600 hover:bg-cyan-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
