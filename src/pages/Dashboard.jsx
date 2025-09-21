import { useState } from "react";

import TopBar from "../components/dashboard/TopBar";
import BottomNav from "../components/dashboard/BottomNav";
import WorkoutCarousel from "../components/dashboard/WorkoutCarousel";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("workout");
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // --- Hardcoded workouts ---
  const fatBurner = [
    {
      name: "Fat Burner Beginner",
      img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80",
      description: "Full body fat burn program for beginners.",
      phases: "3 Phases • 12 Weeks",
      experience: "Beginner",
      equipment: "Dumbbells, Mat",
      coach: "Virat, ACSM Certified Coach",
    },
    {
      name: "Fat Burner Intermediate",
      img: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=1025&auto=format&fit=crop",
      description: "Challenging fat burn for intermediate level.",
      phases: "3 Phases • 12 Weeks",
      experience: "Intermediate",
      equipment: "Dumbbells, Mat",
      coach: "Virat, ACSM Certified Coach",
    },
    {
      name: "Fat Burner Advanced",
      img: "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&w=800&q=80",
      description: "High-intensity fat burn for advanced users.",
      phases: "3 Phases • 12 Weeks",
      experience: "Advanced",
      equipment: "Dumbbells, Mat, Cardio Equipment",
      coach: "Virat, ACSM Certified Coach",
    },
  ];

  const bodybuilding = [
    {
      name: "Bodybuilding Beginner",
      img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1169&auto=format&fit=crop",
      description: "Intro strength training program for beginners.",
      phases: "3 Phases • 12 Weeks",
      experience: "Beginner",
      equipment: "Dumbbells, Mat",
      coach: "Virat, ACSM Certified Coach",
    },
    {
      name: "Bodybuilding Intermediate",
      img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
      description: "Progressive overload plan for intermediate bodybuilders.",
      phases: "3 Phases • 12 Weeks",
      experience: "Intermediate",
      equipment: "Barbell, Dumbbells",
      coach: "Virat, ACSM Certified Coach",
    },
    {
      name: "Bodybuilding Advanced",
      img: "https://images.unsplash.com/photo-1627483298235-f3bac2567c1c?q=80&w=1170&auto=format&fit=crop",
      description: "Max strength & hypertrophy program for advanced users.",
      phases: "3 Phases • 12 Weeks",
      experience: "Advanced",
      equipment: "Barbell, Dumbbells, Machines",
      coach: "Virat, ACSM Certified Coach",
    },
  ];

  const rehab = [
    {
      name: "Shoulder Rehab",
      img: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80",
      description: "Mobility & strengthening program for shoulder rehab.",
      phases: "3 Phases • 12 Weeks",
      experience: "All Levels",
      equipment: "Resistance Bands, Mat",
      coach: "Virat, ACSM Certified Coach",
    },
    {
      name: "Knee Rehab",
      img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80",
      description: "Stability & recovery program for knee rehab.",
      phases: "3 Phases • 12 Weeks",
      experience: "All Levels",
      equipment: "Resistance Bands, Mat",
      coach: "Virat, ACSM Certified Coach",
    },
    {
      name: "Lower Back Rehab",
      img: "https://images.unsplash.com/photo-1584467735871-91f7d5e86f36?auto=format&fit=crop&w=800&q=80",
      description: "Pain relief & posture fix for lower back issues.",
      phases: "3 Phases • 12 Weeks",
      experience: "All Levels",
      equipment: "Mat, Resistance Bands",
      coach: "Virat, ACSM Certified Coach",
    },
  ];

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
      <div
        className={`flex-1 overflow-y-auto p-5 ${
          selectedWorkout ? "pb-40" : "pb-32"
        }`}
      >
        {/* Carousels */}
        {activeTab === "workout" && !selectedWorkout && (
          <>
            <WorkoutCarousel
              title="🔥 Fat Burner Workouts"
              programs={fatBurner}
              onClickCard={setSelectedWorkout}
            />
            <WorkoutCarousel
              title="💪 Bodybuilding Workouts"
              programs={bodybuilding}
              onClickCard={setSelectedWorkout}
            />
            <WorkoutCarousel
              title="🩺 Rehab Exercises"
              programs={rehab}
              onClickCard={setSelectedWorkout}
            />
          </>
        )}

        {/* Detailed Workout View */}
        {selectedWorkout && (
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <button
              className="text-cyan-600 font-medium mb-4"
              onClick={() => setSelectedWorkout(null)}
            >
              ← Back
            </button>
            <img
              src={selectedWorkout.img}
              alt={selectedWorkout.name}
              className="w-full h-60 object-cover rounded-2xl mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedWorkout.name}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              {selectedWorkout.phases}
            </p>
            <hr className="my-2" />
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-semibold">Experience Level:</span>{" "}
              {selectedWorkout.experience}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-semibold">Description:</span>{" "}
              {selectedWorkout.description}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-semibold">Equipment Needed:</span>{" "}
              {selectedWorkout.equipment}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              <span className="font-semibold">Coach:</span>{" "}
              {selectedWorkout.coach}
            </p>
            <button className="w-full py-3 bg-cyan-600 text-white font-bold rounded-2xl hover:bg-cyan-700 transition">
              Start Program
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
