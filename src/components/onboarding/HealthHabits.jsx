import { useState } from "react";
import BottomNavigation from "../BottomNavigation";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

const RECOMMENDED_HABITS = [
  "Eat more protein",
  "Plan more meals",
  "Meal prep and cook",
  "Eat more fiber",
  "Move more",
  "Workout more",
];

const MORE_HABITS = [
  "Track nutrients",
  "Track calories",
  "Track macros",
  "Eat mindfully",
  "Eat a balanced diet",
  "Eat whole foods",
  "Eat more vegetables",
  "Eat more fruit",
  "Drink more water",
  "Prioritize sleep",
  "Something else",
  "I'm not sure",
];

export default function HealthHabits({ firstName, onNext, onBack }) {
  const [selectedHabits, setSelectedHabits] = useState([]);
  const navigate = useNavigate();

  const toggleHabit = (habit) => {
    setSelectedHabits((prev) =>
      prev.includes(habit) ? prev.filter((h) => h !== habit) : [...prev, habit]
    );
  };

  const handleNext = () => {
    if (selectedHabits.length > 0) {
      onNext({ healthHabits: selectedHabits });
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

  const HabitButton = ({ habit, isRecommended = false }) => (
    <button
      onClick={() => toggleHabit(habit)}
      className={`px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-4 rounded-full cursor-pointer text-sm sm:text-base md:text-lg font-medium transition-all ${
        selectedHabits.includes(habit)
          ? "bg-cyan-600 text-white border-2 border-cyan-600"
          : isRecommended
          ? "bg-blue-100 text-black border-2 border-blue-200 hover:bg-blue-200"
          : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200"
      }`}
    >
      {habit}
    </button>
  );

  return (
    <div className="w-full max-w-md md:max-w-lg mx-auto h-dvh flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      {/* Header */}
      <div className="px-4 md:px-6 pt-6 md:pt-8 mb-8 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Health Habits
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm sm:text-base md:text-lg pr-2 font-semibold text-cyan-600 cursor-pointer hover:font-bold"
        >
          Logout
        </button>
      </div>

      {/* Main Content (scrollable) */}
      <div className="flex-1 px-4 md:px-6 overflow-y-auto scrollbar-hide">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Which health habits are most important to you?
        </h2>

        {/* Recommended Habits */}
        <div className="mb-6">
          <h3 className="text-gray-600 text-sm sm:text-base md:text-lg font-medium mb-4">
            Recommended for you
          </h3>
          <div className="flex flex-wrap gap-3">
            {RECOMMENDED_HABITS.map((habit) => (
              <HabitButton key={habit} habit={habit} isRecommended />
            ))}
          </div>
        </div>

        {/* More Habits */}
        <div className="mb-6 pb-4">
          <h3 className="text-gray-600 text-sm sm:text-base md:text-lg font-medium mb-4">
            More healthy habits
          </h3>
          <div className="flex flex-wrap gap-3">
            {MORE_HABITS.map((habit) => (
              <HabitButton key={habit} habit={habit} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-4 md:px-6 py-6 pb-16">
        <BottomNavigation
          onBack={onBack}
          onNext={handleNext}
          nextDisabled={selectedHabits.length === 0}
        />
      </div>
    </div>
  );
}
