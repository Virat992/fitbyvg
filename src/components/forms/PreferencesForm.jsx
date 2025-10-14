import { useState } from "react";
import BottomNavigation from "../BottomNavigation";

export default function PreferencesForm({ onNext, onBack }) {
  const [preferences, setPreferences] = useState({
    workoutTime: "",
    trainingType: "",
    communication: "",
    exerciseExperience: "",
  });

  const handleChange = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    onNext({ preferences });
  };

  const isValid =
    preferences.workoutTime &&
    preferences.trainingType &&
    preferences.communication &&
    preferences.exerciseExperience;

  return (
    <div className="w-full h-dvh flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      <div className="w-full max-w-md md:max-w-lg mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="px-4 md:px-6 pt-6 mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Preferences
          </h1>
        </div>

        {/* Scrollable Section */}
        <div className="flex-1 px-4 md:px-6 overflow-y-auto space-y-6 pb-4 scrollbar-hide">
          {/* Workout Time */}
          <div>
            <label className="block font-medium text-gray-700 mb-2 md:text-base">
              Preferred Workout Time
            </label>
            <select
              value={preferences.workoutTime}
              onChange={(e) => handleChange("workoutTime", e.target.value)}
              className="w-full border rounded-lg px-3 py-3 md:py-4"
            >
              <option value="">Select a time</option>
              <option value="morning">Morning (6–9 AM)</option>
              <option value="afternoon">Afternoon (12–3 PM)</option>
              <option value="evening">Evening (6–9 PM)</option>
            </select>
          </div>

          {/* Training Type */}
          <div>
            <label className="block font-medium text-gray-700 mb-2 md:text-base">
              Preferred Training Type
            </label>
            <select
              value={preferences.trainingType}
              onChange={(e) => handleChange("trainingType", e.target.value)}
              className="w-full border rounded-lg px-3 py-3 md:py-4"
            >
              <option value="">Select type</option>
              <option value="strength">Strength Training</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibility / Yoga</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          {/* Communication Preference */}
          <div>
            <label className="block font-medium text-gray-700 mb-2 md:text-base">
              Preferred Communication
            </label>
            <select
              value={preferences.communication}
              onChange={(e) => handleChange("communication", e.target.value)}
              className="w-full border rounded-lg px-3 py-3 md:py-4"
            >
              <option value="">Select preference</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="in-app">In-App Notifications</option>
            </select>
          </div>

          {/* Prior Exercise Experience */}
          <div>
            <label className="block font-medium text-gray-700 mb-2 md:text-base">
              Prior Exercise Experience
            </label>
            <select
              value={preferences.exerciseExperience}
              onChange={(e) =>
                handleChange("exerciseExperience", e.target.value)
              }
              className="w-full border rounded-lg px-3 py-3 md:py-4"
            >
              <option value="">Select experience level</option>
              <option value="none">None</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="px-4 md:px-6 py-6 pb-16">
          <BottomNavigation
            onBack={onBack}
            onNext={handleNext}
            nextDisabled={!isValid}
            nextLabel="Finish"
          />
        </div>
      </div>
    </div>
  );
}
