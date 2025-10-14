// src/components/dashboard/WeekSelector.jsx
export default function WeekSelector({
  weeks = [],
  getWeekStatus = () => "not-started",
  onSelectWeek = () => {},
  onBack = () => {},
  isProgramStarted = false, // receives state from parent
  goToDashboard, // optional callback to go to dashboard
}) {
  return (
    <div className="bg-white mt-5 rounded-2xl shadow-lg p-4 md:p-5">
      {/* Back Button */}
      <button
        onClick={() => {
          if (isProgramStarted) {
            if (typeof goToDashboard === "function") goToDashboard();
            else onBack();
          } else {
            onBack();
          }
        }}
        className="flex items-center gap-2 text-cyan-600 font-medium mb-4 text-sm md:text-base"
      >
        Back
      </button>

      {/* Title */}
      <h2 className="text-xl md:text-2xl flex justify-center font-bold mb-5">
        Select a Week
      </h2>

      {/* Weeks Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {weeks.map((week) => {
          const displayWeek = week.replace(/([a-zA-Z]+)(\d+)/, "$1 $2");
          const status = getWeekStatus(week);

          let bgClass = "bg-gray-100 hover:bg-cyan-100 text-gray-800"; // not-started
          if (status === "completed") bgClass = "bg-green-500 text-white";
          if (status === "ongoing") bgClass = "bg-blue-200 text-blue-800";

          return (
            <button
              key={week}
              onClick={() => onSelectWeek(week)}
              className={`p-3 md:p-4 rounded-xl text-center font-semibold text-sm md:text-base ${bgClass}`}
            >
              {displayWeek}
            </button>
          );
        })}
      </div>
    </div>
  );
}
