export default function WorkoutCarousel({ title, programs, onClickCard }) {
  return (
    <div className="mb-0 pt-5 pb-2">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {programs.map((program, index) => (
          <div
            key={index}
            className="min-w-[220px] max-w-[220px] bg-white rounded-2xl shadow-lg cursor-pointer overflow-hidden group flex-shrink-0"
            onClick={() => onClickCard(program)}
          >
            <img
              src={program.img}
              alt={program.name}
              className="h-36 w-full object-cover transform group-hover:scale-105 transition duration-300"
            />
            <div className="p-3">
              <p className="font-semibold text-gray-800 text-sm mb-1">
                {program.name}
              </p>
              <p className="text-xs text-gray-500 mb-1">{program.phases}</p>
              <p className="text-xs text-gray-500 line-clamp-2">
                {program.shortDesc || program.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
