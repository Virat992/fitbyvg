export default function WorkoutCarousel({ title, programs, onClickCard }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {programs.map((program, index) => (
          <div
            key={index}
            className="min-w-[220px] bg-white rounded-2xl shadow-lg cursor-pointer overflow-hidden group flex-shrink-0"
            onClick={() => onClickCard(program)}
          >
            <img
              src={program.img}
              alt={program.name}
              className="h-36 w-full object-cover transform group-hover:scale-105 transition duration-300"
            />
            <div className="p-3">
              <p className="font-semibold text-gray-800">{program.name}</p>
              <p className="text-sm text-gray-500">{program.phases}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
