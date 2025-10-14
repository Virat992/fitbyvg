import { useState } from "react";
import BottomNavigation from "../BottomNavigation"; // Using same BottomNavigation
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // redirect to landing/login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-full h-dvh flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      <div className="w-full max-w-md md:max-w-lg mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="px-4 md:px-6 pt-6 mb-8 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Past Hurdles
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm sm:text-base md:text-lg font-semibold text-cyan-600 cursor-pointer hover:font-bold"
          >
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 md:px-6 overflow-y-auto scrollbar-hide">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            In the past, what have been your barriers to losing weight?
          </h2>
          <p className="text-gray-500 text-sm md:text-base mb-4">
            Select all that apply.
          </p>

          {/* Barriers List */}
          <div className="space-y-4 pb-4">
            {barrierOptions.map((barrier) => (
              <button
                key={barrier}
                onClick={() => handleBarrierToggle(barrier)}
                className={`w-full p-4 md:p-5 rounded-xl border-2 text-left font-medium text-lg md:text-xl transition-all ${
                  selectedBarriers.includes(barrier)
                    ? "border-cyan-500 bg-gray-50"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">{barrier}</span>
                  <div
                    className={`w-6 h-6 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedBarriers.includes(barrier)
                        ? "border-cyan-500 bg-cyan-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedBarriers.includes(barrier) && (
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4 text-white"
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
        <div className="px-4 md:px-6 py-6 pb-16">
          <BottomNavigation
            onBack={onBack}
            onNext={handleNext}
            nextDisabled={selectedBarriers.length === 0}
          />
        </div>
      </div>
    </div>
  );
}
