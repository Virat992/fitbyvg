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
    <div className="bg-white mt-5 rounded-2xl shadow-lg p-5">
      <button
        className="flex items-center gap-2 text-cyan-600 font-medium mb-4"
        onClick={onBack}
      >
        Back
      </button>

      <h2 className="text-xl flex justify-center font-bold mb-5">
        Select a Day
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {days.map((day) => {
          const dayKey = `${selectedWorkout.dbName}_${selectedWeek}_${day}`;
          const isCompleted = completedDays[dayKey];
          return (
            <button
              key={day}
              className={`p-4 rounded-xl text-center font-semibold ${
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
