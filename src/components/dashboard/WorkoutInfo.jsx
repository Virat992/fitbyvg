// src/components/dashboard/WorkoutInfo.jsx
export default function WorkoutInfo({ workout, onBack, onStart }) {
  return (
    <div className="bg-white mt-5 rounded-2xl shadow-lg p-5">
      {/* Back button */}
      <button
        className="flex items-center gap-2 text-cyan-600 font-medium mb-4"
        onClick={onBack}
      >
        Back
      </button>

      {/* Workout Image */}
      <img
        src={workout.img}
        alt={workout.name}
        className="w-full h-60 object-cover rounded-2xl mb-4"
      />

      {/* Workout Info */}
      <h2 className="text-2xl font-bold text-gray-800 mb-1">{workout.name}</h2>
      <p className="text-sm text-gray-500 mb-1">{workout.phases}</p>
      <p className="text-sm text-gray-500 mb-4">{workout.shortDesc}</p>

      {/* Start Button */}
      <button
        className="w-full py-3 bg-cyan-600 text-white font-bold rounded-2xl hover:bg-cyan-700 transition"
        onClick={onStart}
      >
        Start Program
      </button>
    </div>
  );
}
