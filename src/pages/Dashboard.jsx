// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import TopBar from "../components/dashboard/TopBar";
import BottomNav from "../components/dashboard/BottomNav";
import TodaysWorkout from "../components/dashboard/TodaysWorkout";
import WorkoutCarousel from "../components/dashboard/WorkoutCarousel";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("workout");
  const [workoutTime, setWorkoutTime] = useState(""); // user's chosen workout time
  const [editingTime, setEditingTime] = useState(true); // initially allow setting
  const [countdown, setCountdown] = useState("");
  const [streak, setStreak] = useState(0); // placeholder streak

  const workoutPrograms = [
    {
      name: "Fat Loss & Lean Muscle",
      text: "High intensity training for fat burning and conditioning.",
      img: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=1025&auto=format&fit=crop",
    },
    {
      name: "Build Muscle",
      text: "Progressive overload and hypertrophy techniques.",
      img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1169&auto=format&fit=crop",
    },
    {
      name: "Flexibility & Mobility",
      text: "Improve movement quality and reduce injuries.",
      img: "https://images.unsplash.com/photo-1591258370814-01609b341790?q=80&w=687&auto=format&fit=crop",
    },
  ];

  // Load saved workout time from localStorage
  useEffect(() => {
    const savedTime = localStorage.getItem("workoutTime");
    if (savedTime) {
      setWorkoutTime(savedTime);
      setEditingTime(false);
    }
  }, []);

  // Persist workoutTime in localStorage whenever it changes
  useEffect(() => {
    if (workoutTime) {
      localStorage.setItem("workoutTime", workoutTime);
    }
  }, [workoutTime]);

  // Countdown effect
  useEffect(() => {
    if (!workoutTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date();
      const [hours, minutes] = workoutTime.split(":");
      target.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      let diff = target - now;

      if (diff < 0) diff = 0;

      const h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
      const m = String(
        Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      ).padStart(2, "0");
      const s = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(
        2,
        "0"
      );

      setCountdown(`${h}:${m}:${s}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [workoutTime]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-50 via-white to-gray-100 relative">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-cyan-600">
        <TopBar
          onCalendar={() => {}}
          onNotifications={() => {}}
          onProfile={() => {}}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 pb-28">
        {activeTab === "workout" && (
          <>
            {/* Streak Card */}
            <div className="bg-white rounded-2xl shadow-md p-5 mb-5 text-center">
              <p className="text-sm text-gray-500">Your Current Streak</p>
              <span className="text-3xl font-bold text-cyan-600">{streak}</span>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>

            {/* Workout Timer Card */}
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-2xl shadow-md p-5 mb-5 relative">
              {/* Edit Button */}
              {workoutTime && !editingTime && (
                <button
                  className="absolute top-3 right-3 bg-white text-cyan-600 px-3 py-1 rounded-full text-sm hover:bg-gray-100"
                  onClick={() => setEditingTime(true)}
                >
                  Edit
                </button>
              )}

              {editingTime ? (
                <div className="text-center">
                  <p className="text-lg font-semibold mb-2">
                    Set your today’s workout time
                  </p>
                  <input
                    type="time"
                    className="px-4 py-2 rounded-lg text-center text-gray-700 border border-gray-300
                               focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200 outline-none transition duration-200"
                    value={workoutTime}
                    onChange={(e) => setWorkoutTime(e.target.value)}
                    onBlur={() => setEditingTime(false)}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-lg font-semibold">Countdown to Workout</p>
                  <p className="text-3xl font-bold mt-2">{countdown}</p>
                </div>
              )}
            </div>

            <TodaysWorkout workout={workoutPrograms[0]} />
            <WorkoutCarousel programs={workoutPrograms} />
          </>
        )}

        {activeTab === "diet" && <p>🍎 Diet Section</p>}
        {activeTab === "progress" && <p>📊 Progress Section</p>}
        {activeTab === "explore" && <p>🌍 Explore Section</p>}
        {activeTab === "chat" && <p>💬 Chat Section</p>}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
