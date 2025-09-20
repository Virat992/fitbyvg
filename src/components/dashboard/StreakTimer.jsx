// src/components/StreakTimer.jsx
import { useEffect, useState } from "react";

export default function StreakTimer() {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hr countdown example

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex gap-4 justify-around my-4">
      {/* Streak */}
      <div className="bg-white rounded-xl shadow-md px-6 py-4 flex flex-col items-center">
        <p className="text-lg font-bold text-cyan-600">🔥 5 Days</p>
        <p className="text-sm text-gray-600">Current Streak</p>
      </div>

      {/* Timer */}
      <div className="bg-white rounded-xl shadow-md px-6 py-4 flex flex-col items-center">
        <p className="text-lg font-bold text-cyan-600">
          {formatTime(timeLeft)}
        </p>
        <p className="text-sm text-gray-600">Next Workout</p>
      </div>
    </div>
  );
}
