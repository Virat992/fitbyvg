// src/components/WorkoutCarousel.jsx
export default function WorkoutCarousel({ programs }) {
  return (
    <>
      <div className="flex items-center justify-between mt-6 mb-3">
        <h2 className="text-md font-bold text-gray-800">ReadyMade Workouts</h2>
        <button className="text-sm text-cyan-600 font-medium hover:underline">
          View All
        </button>
      </div>
      <div className="flex mb-10 gap-5 overflow-x-auto pb-2 scrollbar-hide">
        {programs.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 bg-white rounded-2xl  w-64 overflow-hidden hover:scale-105 transition"
          >
            <img
              src={item.img}
              alt={item.name}
              className="h-36 w-full object-cover"
            />
            <div className="p-4">
              <p className="font-semibold text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-600 mt-1">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
