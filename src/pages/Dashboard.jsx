import { useState } from "react";

import TopBar from "../components/dashboard/TopBar";
import BottomNav from "../components/dashboard/BottomNav";
import WorkoutCarousel from "../components/dashboard/WorkoutCarousel";
import { FaArrowLeft } from "react-icons/fa";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("workout");
  const [selectedWorkout, setSelectedWorkout] = useState(null); // clicked workout

  // --- Hardcoded workouts ---
  const fatBurner = [
    {
      name: "Fat Burner Beginner",
      img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80",
      description: "Full body fat burn program for beginners.",
      shortDesc: "Kickstart your journey with easy fat-burning workouts.",
      phases: "3 Phases • 12 Weeks",
      experience: "Beginner",
      equipment: "Dumbbells, Mat",
      coach: "Virat, ACSM Certified Coach",
    },
    {
      name: "Fat Burner Intermediate",
      img: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=1025&auto=format&fit=crop&fit=crop",
      description: "Challenging fat burn for intermediate level.",
      shortDesc: "Push your limits with progressive calorie-burning sessions.",
      phases: "3 Phases • 12 Weeks",
      experience: "Intermediate",
      equipment: "Dumbbells, Mat",
      coach: "Virat, ACSM Certified Coach",
    },
    {
      name: "Fat Burner Advanced",
      img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop",
      description: "High intensity program for advanced fat burning.",
      shortDesc: "High-intensity training designed for maximum fat loss.",
      phases: "3 Phases • 12 Weeks",
      experience: "Advanced",
      equipment: "Dumbbells, Resistance Bands, Mat",
      coach: "Virat, ACSM Certified Coach",
    },
  ];

  const bodybuilding = [
    {
      name: "Bodybuilding Beginner",
      img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1169&auto=format&fit=crop",
      description: "Intro strength training program for beginners.",
      shortDesc: "Learn the basics of strength training & muscle building.",
      phases: "3 Phases • 12 Weeks",
      experience: "Beginner",
      equipment: "Dumbbells, Mat",
      coach: "Virat, ACSM Certified Coach",
    },
    {
      name: "Bodybuilding Intermediate",
      img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
      description: "Progressive hypertrophy program for intermediate lifters.",
      shortDesc: "Build size & strength with structured hypertrophy routines.",
      phases: "3 Phases • 12 Weeks",
      experience: "Intermediate",
      equipment: "Barbell, Dumbbells, Bench",
      coach: "Virat, ACSM Certified Coach",
    },
    {
      name: "Bodybuilding Advanced",
      img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
      description: "Advanced bodybuilding for serious muscle growth.",
      shortDesc: "Push your physique to the next level with pro techniques.",
      phases: "3 Phases • 12 Weeks",
      experience: "Advanced",
      equipment: "Full Gym Setup",
      coach: "Virat, ACSM Certified Coach",
    },
  ];

  const rehab = [
    {
      name: "Shoulder Rehab",
      img: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80",
      description: "Mobility & strengthening program for shoulder rehab.",
      shortDesc: "Recover strength & mobility in your shoulders safely.",
      phases: "3 Phases • 12 Weeks",
      experience: "All Levels",
      equipment: "Resistance Bands, Mat",
      coach: "Virat, ACSM Certified Coach",
    },
    {
      name: "Knee Rehab",
      img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80",
      description: "Stability & recovery program for knee rehab.",
      shortDesc: "Strengthen your knees with safe recovery movements.",
      phases: "3 Phases • 12 Weeks",
      experience: "All Levels",
      equipment: "Resistance Bands, Mat",
      coach: "Virat, ACSM Certified Coach",
    },
    {
      name: "Lower Back Rehab",
      img: "https://plus.unsplash.com/premium_photo-1663076228265-031803c7c354?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YmFjayUyMGV4dGVuc2lvbnxlbnwwfHwwfHx8MA%3D%3D",
      description: "Pain relief & posture fix for lower back issues.",
      shortDesc: "Relieve pain & improve posture with back rehab routines.",
      phases: "3 Phases • 12 Weeks",
      experience: "All Levels",
      equipment: "Mat, Resistance Bands",
      coach: "Virat, ACSM Certified Coach",
    },
  ];

  // --- Render ---
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

      <div
        className={`flex-1 overflow-y-auto px-5 ${
          selectedWorkout ? "pb-36" : "pb-40"
        }`}
      >
        {/* Show Carousels if no workout is selected */}
        {activeTab === "workout" && !selectedWorkout && (
          <>
            <WorkoutCarousel
              title="🔥 Fat Burner Workouts"
              programs={fatBurner}
              onClickCard={(program) => setSelectedWorkout(program)}
            />
            <WorkoutCarousel
              title="💪 Bodybuilding Workouts"
              programs={bodybuilding}
              onClickCard={(program) => setSelectedWorkout(program)}
            />
            <WorkoutCarousel
              title="🩺 Rehab Workouts"
              programs={rehab}
              onClickCard={(program) => setSelectedWorkout(program)}
            />
          </>
        )}

        {/* Show Detailed Workout View when a card is touched */}
        {selectedWorkout && (
          <div className="bg-white rounded-2xl shadow-lg p-5">
            {/* Back Button */}
            <button
              className="flex items-center gap-2 text-cyan-600 font-medium mb-4"
              onClick={() => setSelectedWorkout(null)}
            >
              <FaArrowLeft className="text-sm" />
              <span>Back</span>
            </button>

            {/* Workout Image */}
            <img
              src={selectedWorkout.img}
              alt={selectedWorkout.name}
              className="w-full h-60 object-cover rounded-2xl mb-4"
            />

            {/* Workout Details */}
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

            {/* Start Program Button */}
            <button className="w-full py-3 bg-cyan-600 text-white font-bold rounded-2xl hover:bg-cyan-700 transition">
              Start Program
            </button>
          </div>
        )}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
