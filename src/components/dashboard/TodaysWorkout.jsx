import { useState } from "react";

export default function TodaysWorkout({ workout }) {
  const [showDetail, setShowDetail] = useState(false);

  // ✅ Use exercises from Firestore
  const exercises = workout?.exercises || [];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-md font-bold text-gray-800">
          Your Today's Workout
        </h2>
        <button className="text-sm text-cyan-600 font-medium hover:underline">
          View All
        </button>
      </div>

      {/* Card */}
      <div
        onClick={() => setShowDetail(true)}
        className="relative bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto overflow-hidden group cursor-pointer"
      >
        {workout?.img && (
          <img
            src={workout.img}
            alt={workout.title || workout.name}
            className="h-64 w-full object-cover transform group-hover:scale-105 transition duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-5 text-white">
          <p className="font-semibold text-xl">
            {workout.title || workout.name}
          </p>
          <p className="text-sm mt-1 opacity-90">{workout.description}</p>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full overflow-hidden">
            {workout?.img && (
              <img
                src={workout.img}
                alt={workout.title || workout.name}
                className="h-60 w-full object-cover"
              />
            )}
            <div className="p-5">
              <h2 className="text-xl font-bold mb-2 text-gray-800">
                {workout.title || workout.name} Workout
              </h2>
              <p className="text-gray-600 mb-4">
                Today’s workout is designed to help you reach your fitness goal.
              </p>
              <ul className="space-y-2">
                {exercises.map((ex, i) => (
                  <li
                    key={i}
                    className="flex justify-between p-3 bg-gray-100 rounded-lg"
                  >
                    <span>{ex.name}</span>
                    <span className="text-gray-600 text-sm">
                      {ex.sets} sets × {ex.reps} reps
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowDetail(false)}
                className="mt-5 w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
