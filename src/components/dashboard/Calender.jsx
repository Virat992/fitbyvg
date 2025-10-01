import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";

export default function Calendar({
  completedDays = {},
  onSelectDate,
  onClose,
  showNavigation = true,
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const completedDates = Object.keys(completedDays);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg mt-5">
      {/* Back button on its own line */}
      <div className="flex justify-start mb-2">
        <button onClick={onClose} className="text-cyan-600 font-medium">
          Back
        </button>
      </div>

      {/* Month navigation row */}
      <div className="flex items-center justify-center mb-4 gap-4">
        {showNavigation && (
          <button
            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            ‹
          </button>
        )}

        <h2 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        {showNavigation && (
          <button
            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            ›
          </button>
        )}
      </div>

      {/* Grid of days */}
      <div className="grid grid-cols-7 gap-2 mt-4">
        {days.map((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const done = completedDates.includes(dateStr);

          return (
            <div
              key={dateStr}
              className={`cursor-pointer p-2 rounded-lg text-center ${
                isToday(date)
                  ? "bg-yellow-200"
                  : done
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-100"
              }`}
              onClick={() => onSelectDate(dateStr)}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
