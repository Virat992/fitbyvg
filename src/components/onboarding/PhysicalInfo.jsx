import { useState } from "react";
import BottomNavigation from "../BottomNavigation";

export default function PhysicalInfo({ onNext, onBack }) {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    goalWeight: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (formData.height && formData.weight && formData.goalWeight) {
      onNext({
        physicalInfo: {
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          goalWeight: parseFloat(formData.goalWeight),
        },
      });
    }
  };

  const isFormValid = formData.height && formData.weight && formData.goalWeight;

  return (
    <div className="w-full h-dvh flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      <div className="w-full max-w-md mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Physical Stats
          </h1>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Just a few more questions
          </h2>

          {/* Height Input */}
          <div className="mb-6">
            <label className="block text-gray-600 text-base mb-3">
              How tall are you?
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                className="flex-1 max-w-[calc(100%-80px)] px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-600"
              />
              <div className="w-20 text-center bg-cyan-50 text-cyan-600 py-4 rounded-xl font-semibold text-lg">
                cm
              </div>
            </div>
          </div>

          {/* Weight Input */}
          <div className="mb-6">
            <label className="block text-gray-600 text-base mb-3">
              How much do you weigh?
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className="flex-1 max-w-[calc(100%-80px)] px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-600"
              />
              <div className="w-20 text-center bg-cyan-50 text-cyan-600 py-4 rounded-xl font-semibold text-lg">
                kg
              </div>
            </div>
          </div>

          {/* Goal Weight Input */}
          <div className="mb-6">
            <label className="block text-gray-600 text-base mb-3">
              What's your goal weight?
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.goalWeight}
                onChange={(e) =>
                  handleInputChange("goalWeight", e.target.value)
                }
                className="flex-1 max-w-[calc(100%-80px)] px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-600"
              />
              <div className="w-20 text-center bg-gray-100 text-gray-500 py-4 rounded-xl font-semibold text-lg">
                kg
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Fixed Bottom Navigation like Goals & HealthHabits */}
        <div className="px-4 py-6 pb-16 ">
          <BottomNavigation
            onBack={onBack}
            onNext={handleNext}
            nextDisabled={!isFormValid}
          />
        </div>
      </div>
    </div>
  );
}
