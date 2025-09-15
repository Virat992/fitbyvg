import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Button from "../Button";

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

  const toggleHabit = (habit) => {
    setSelectedHabits((prev) => {
      if (prev.includes(habit)) {
        return prev.filter((h) => h !== habit);
      } else {
        return [...prev, habit];
      }
    });
  };

  const handleNext = () => {
    if (selectedHabits.length > 0) {
      onNext({ healthHabits: selectedHabits });
    }
  };

  const HabitButton = ({ habit, isRecommended = false }) => (
    <button
      onClick={() => toggleHabit(habit)}
      className={`px-4 py-3 rounded-full text-sm font-medium transition-all ${
        selectedHabits.includes(habit)
          ? isRecommended
            ? "bg-blue-600 text-white border-2 border-blue-600"
            : "bg-gray-800 text-white border-2 border-gray-800"
          : isRecommended
          ? "bg-blue-100 text-blue-600 border-2 border-blue-200 hover:bg-blue-200"
          : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200"
      }`}
    >
      {habit}
    </button>
  );

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 bg-gradient-to-b from-cyan-50 via-white to-cyan-100 h-screen flex flex-col">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Health Habits</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
          Which health habits are most important to you?
        </h2>

        {/* Scrollable Habits List */}
        <div className="flex-1 overflow-y-auto pr-2 pb-50 space-y-6 scrollbar-hide">
          {/* Recommended Habits */}
          <div>
            <h3 className="text-gray-600 text-sm font-medium mb-4">
              Recommended for you
            </h3>
            <div className="flex flex-wrap gap-3">
              {RECOMMENDED_HABITS.map((habit) => (
                <HabitButton key={habit} habit={habit} isRecommended={true} />
              ))}
            </div>
          </div>

          {/* More Habits */}
          <div>
            <h3 className="text-gray-600 text-sm font-medium mb-4">
              More healthy habits
            </h3>
            <div className="flex flex-wrap gap-3">
              {MORE_HABITS.map((habit) => (
                <HabitButton key={habit} habit={habit} isRecommended={false} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Sticky */}
      <div
        className="sticky bottom-0 z-50 border-t border-gray-100 pt-4 pb-6 
             bg-gradient-to-b from-cyan-50  to-cyan-100"
      >
        <div className="flex w-full items-center justify-between">
          <button
            onClick={onBack}
            className="w-12 cursor-pointer h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>

          <div className="flex-1 ml-4">
            <Button
              onClick={handleNext}
              disabled={selectedHabits.length === 0}
              variant={selectedHabits.length > 0 ? "primary" : "gray"}
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
