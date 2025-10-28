// src/components/dashboard/WorkoutInfo.jsx
export default function WorkoutInfo({ workout, onBack, onStart }) {
  return (
    <div className="bg-white text-center lg:mb-5 lg:mt-5  mt-5 rounded-2xl shadow-lg p-4 md:p-6">
      {/* Back button */}
      <button
        className="flex items-center gap-2 text-cyan-600 font-medium mb-4 text-sm md:text-base"
        onClick={onBack}
      >
        Back
      </button>

      {/* Workout Image */}
      <img
        src={workout.img}
        alt={workout.name}
        className="w-full h-60 md:h-72 object-cover rounded-2xl mb-4"
      />

      {/* Workout Info */}
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
        {workout.name}
      </h2>
      <p className="text-sm md:text-base text-gray-500 mb-1">
        {workout.phases}
      </p>
      <p className="text-sm md:text-base text-gray-500 mb-4">
        {workout.shortDesc}
      </p>

      {/* Start Button */}
      <button
        className="w-full lg:text-lg lg:w-[50%] lg:mx-auto py-3 md:py-4 bg-cyan-600 text-white font-bold rounded-2xl hover:bg-cyan-700 transition text-sm md:text-base"
        onClick={onStart}
      >
        Start Program
      </button>
    </div>
  );
}
