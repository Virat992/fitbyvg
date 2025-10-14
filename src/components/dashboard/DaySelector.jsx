// src/components/dashboard/DaySelector.jsx
export default function DaySelector({
  days,
  completedDays,
  selectedWorkout,
  selectedWeek,
  onSelectDay,
  onBack,
}) {
  return (
    <div className="bg-white mt-5 rounded-2xl shadow-lg p-4 md:p-5">
      {/* Back Button */}
      <button
        className="flex items-center gap-2 text-cyan-600 font-medium mb-4 text-sm md:text-base"
        onClick={onBack}
      >
        Back
      </button>

      {/* Title */}
      <h2 className="text-xl md:text-2xl flex justify-center font-bold mb-5">
        Select a Day
      </h2>

      {/* Days Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {days.map((day) => {
          const dayKey = `${selectedWorkout.dbName}_${selectedWeek}_${day}`;
          const isCompleted = completedDays[dayKey];
          return (
            <button
              key={day}
              className={`p-3 md:p-4 rounded-xl text-center font-semibold text-sm md:text-base ${
                isCompleted
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 hover:bg-cyan-100"
              }`}
              onClick={() => onSelectDay(day)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
