import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
} from "date-fns";

export default function Calendar({ completedDays, onSelectDate, onClose }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Preprocess completedDays into dates (yyyy-MM-dd) for easy lookup
  const completedDates = Object.keys(completedDays).map((key) => {
    // Here you need a mapping: if you store completedDays as keys like "workoutDb_week_day"
    // You need to also store which date it corresponds to.
    // For now, let's assume completedDays is already in format { '2025-09-25': true }
    return key;
  });

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg mt-5">
      <div className="flex justify-between items-center mb-2">
        <button onClick={onClose} className="text-cyan-600 font-medium">
          Back
        </button>
      </div>

      <p className="text-gray-600 mb-4 font-medium text-center">
        Workout Calendar
      </p>

      <div className="grid grid-cols-7 gap-2">
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
