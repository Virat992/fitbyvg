import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Button from "../Button";

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && isFormValid) {
      handleNext();
    }
  };

  const isFormValid = formData.height && formData.weight && formData.goalWeight;

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="w-full max-w-md mx-auto px-4 flex flex-col h-full">
        {/* Header */}
        <div className="pt-4 pb-6 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You</h1>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 flex flex-col">
          <div className="flex-shrink-0 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Just a few more questions
            </h2>
          </div>

          {/* Form Container - Scrollable */}
          <div className="flex-1 overflow-y-auto pb-28">
            <div className="space-y-6">
              {/* Height Input */}
              <div>
                <label className="block text-gray-600 text-base mb-3">
                  How tall are you?
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) =>
                      handleInputChange("height", e.target.value)
                    }
                    onKeyPress={handleKeyPress}
                    className="flex-1 max-w-[calc(100%-80px)] px-4 py-4 text-lg border-2 border-blue-500 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  <div className="w-20 text-center bg-blue-50 text-blue-600 py-4 rounded-xl font-semibold text-lg">
                    cm
                  </div>
                </div>
              </div>

              {/* Weight Input */}
              <div>
                <label className="block text-gray-600 text-base mb-3">
                  How much do you weigh?
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                    onKeyPress={handleKeyPress}
                    className="flex-1 max-w-[calc(100%-80px)] px-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
                  />
                  <div className="w-20 text-center bg-blue-50 text-blue-600 py-4 rounded-xl font-semibold text-lg">
                    kg
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  It's OK to estimate, you can update later.
                </p>
              </div>

              {/* Goal Weight Input */}
              <div>
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
                    onKeyPress={handleKeyPress}
                    className="flex-1 max-w-[calc(100%-80px)] px-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
                  />
                  <div className="w-20 text-center bg-gray-100 text-gray-500 py-4 rounded-xl font-semibold text-lg">
                    kg
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  Don't worry, you can always change it later.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Sticky at bottom like HealthHabits */}
        <div className="flex-shrink-0 sticky bottom-0 border-t border-gray-100 pt-4 pb-6 ">
          <div className="flex gap-2 items-center justify-between">
            <button
              onClick={onBack}
              className="w-16 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>

            <Button
              onClick={handleNext}
              disabled={!isFormValid}
              variant={isFormValid ? "primary" : "gray"}
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
