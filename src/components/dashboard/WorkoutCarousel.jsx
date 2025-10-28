export default function WorkoutCarousel({
  title,
  programs,
  onClickCard,
  cardHighlight,
}) {
  return (
    <div className="mb-0 pt-5 pb-0 w-full max-w-md md:max-w-2xl mx-auto overflow-visible
    /* Full-width flowing on large screens */
  lg:w-full lg:max-w-none lg:px-10
    ">
      <h3 className="text-[16px] w-full  lg:mb-2 md:text-[18px] font-bold text-gray-800 mb-2 md:mb-3 px-2 md:px-0">
        {title}
      </h3>

      <div
        className="flex gap-4 md:gap-6 
    pl-0 md:pl-2 px-0 
    -mb-4 
    overflow-x-auto overflow-y-hidden 
    pb-0 
    scrollbar-hide 
    scroll-smooth 
    snap-x snap-mandatory"
      >
        {programs.map((program, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 min-w-[220px] max-w-[220px] md:min-w-[260px] md:max-w-[260px] pb-4"
          >
            {/* Actual Card */}
            <div
              className={`relative rounded-2xl overflow-hidden cursor-pointer group
                ${
                  cardHighlight
                    ? "bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200"
                    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
                }
              `}
              onClick={() => onClickCard(program)}
            >
              <img
                src={program.img}
                alt={program.name}
                className="h-36 md:h-44 w-full object-cover transform group-hover:scale-105 transition duration-300"
              />
              <div className="p-3 md:p-4">
                <p className="font-semibold text-gray-800 text-sm md:text-base mb-1">
                  {program.name}
                </p>
                <p className="text-xs md:text-sm text-gray-500 mb-1">
                  {program.phases}
                </p>
                <p className="text-xs md:text-sm text-gray-500 line-clamp-2">
                  {program.shortDesc || program.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
