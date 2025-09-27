import { useState } from "react";
import BottomNavigation from "../BottomNavigation";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

export default function PhysicalInfo({ onNext, onBack }) {
  const [formData, setFormData] = useState({
    gender: "",
    physicalActivity: "",
    age: "",
    height: "",
    weight: "",
    goalWeight: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    const { gender, physicalActivity, age, height, weight, goalWeight } =
      formData;
    if (gender && physicalActivity && age && height && weight && goalWeight) {
      onNext({
        physicalInfo: {
          gender,
          physicalActivity,
          age: parseInt(age, 10),
          height: parseFloat(height),
          weight: parseFloat(weight),
          goalWeight: parseFloat(goalWeight),
        },
      });
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

  const isFormValid =
    formData.gender &&
    formData.physicalActivity &&
    formData.age &&
    formData.height &&
    formData.weight &&
    formData.goalWeight;

  return (
    <div className="w-full h-dvh flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      <div className="w-full max-w-md mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="px-4 pt-6 pb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Your Physical Stats
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-cyan-600 cursor-pointer hover:font-bold"
          >
            Logout
          </button>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Getting to Know You
          </h2>

          {/* Gender Selection */}
          <div className="mb-6">
            <label className="block text-gray-600 text-base mb-3">
              Select your gender
            </label>
            <div className="flex gap-4">
              {["male", "female", "other"].map((option) => (
                <label
                  key={option}
                  className={`flex-1 text-center p-3 rounded-xl border-2 cursor-pointer transition ${
                    formData.gender === option
                      ? "border-cyan-500 bg-cyan-500"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={formData.gender === option}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    className="hidden"
                  />
                  <span
                    className={`capitalize ${
                      formData.gender === option
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Physical Activity Selection */}
          <div className="mb-6">
            <label className="block text-gray-600 text-base mb-3">
              Physical Activity Level
            </label>
            <select
              value={formData.physicalActivity}
              onChange={(e) =>
                handleInputChange("physicalActivity", e.target.value)
              }
              className="w-full px-2 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-600 text-gray-900"
            >
              <option value="">Select activity level</option>
              <option value="sedentary">
                Sedentary (little or no exercise)
              </option>
              <option value="light">Light (1–3 days/week)</option>
              <option value="moderate">Moderate (3–5 days/week)</option>
              <option value="active">Active (6–7 days/week)</option>
              <option value="very-active">
                Very Active (hard exercise daily)
              </option>
            </select>
          </div>

          {/* Age Input */}
          <div className="mb-6 px-0">
            <label className="block text-gray-600 text-base mb-3">
              How old are you?
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                className="flex-1 px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-600"
              />
              <div className="w-20 text-center bg-cyan-50 text-cyan-600 py-3 rounded-xl font-semibold text-lg">
                yrs
              </div>
            </div>
          </div>

          {/* Height Input */}
          <div className="mb-6 px-0">
            <label className="block text-gray-600 text-base mb-3">
              How tall are you?
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                className="flex-1 px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-600"
              />
              <div className="w-20 text-center bg-cyan-50 text-cyan-600 py-3 rounded-xl font-semibold text-lg">
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
                className="flex-1 px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-600"
              />
              <div className="w-20 text-center bg-cyan-50 text-cyan-600 py-3 rounded-xl font-semibold text-lg">
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
                className="flex-1 px-4 py-3 text-gray-900 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-600"
              />
              <div className="w-20 text-center bg-gray-100 text-gray-500 py-3 rounded-xl font-semibold text-lg">
                kg
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="px-4 py-6 pb-16">
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
