import { FaArrowLeft } from "react-icons/fa";

export default function SteadyPlanner({ onNext, onBack }) {
  const handleNext = () => {
    onNext({});
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex flex-col text-white relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-6 left-4 right-4 z-20">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((step, index) => (
            <div
              key={step}
              className={`h-1 flex-1 rounded-full ${
                index < 1 ? "bg-green-400" : "bg-white bg-opacity-30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="pt-16 px-4 flex-shrink-0 z-10">
        <h1 className="text-lg font-medium">Goals</h1>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 flex flex-col overflow-y-auto px-4 py-8 z-0">
        {/* Calendar Illustration */}
        <div className="mb-8 relative">
          {/* Calendar Grid */}
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <div
                  key={index}
                  className="w-6 h-6 flex items-center justify-center text-xs text-white opacity-80"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }, (_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs ${
                    i === 10 || i === 11 || i === 12
                      ? "bg-green-400"
                      : "bg-white bg-opacity-40"
                  }`}
                >
                  {i >= 6 && i <= 26 ? i - 5 : ""}
                </div>
              ))}
            </div>
          </div>

          {/* Floating Note */}
          <div className="absolute -right-2 -bottom-2 bg-purple-300 bg-opacity-80 rounded px-2 py-1">
            <div className="w-8 h-1 bg-purple-600 rounded mb-1"></div>
            <div className="w-6 h-1 bg-purple-600 rounded"></div>
          </div>

          {/* Stars */}
          <div className="absolute -top-4 -right-2 text-yellow-300 text-lg">
            ⭐
          </div>
          <div className="absolute -left-3 top-6 text-yellow-300 text-sm">
            ⭐
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center max-w-sm mx-auto">
          <h2 className="text-base font-semibold text-white mb-4 opacity-90">
            Nice work!
          </h2>

          <h3 className="text-3xl font-bold text-white mb-6 leading-tight">
            You're a steady planner.
          </h3>

          <p className="text-white text-base opacity-90 leading-relaxed">
            We can help simplify your meal planning routine. We'll add
            flexibility and variety, and won't skimp on taste.
          </p>
        </div>

        {/* Add extra bottom padding so scroll doesn't hide navigation */}
        <div className="h-32"></div>
      </div>

      {/* Navigation - Sticky at bottom with z-index */}
      <div className="sticky bottom-0 z-50 flex items-center justify-between px-4 py-6 bg-gradient-to-t from-blue-700/80 via-blue-600/80 to-transparent backdrop-blur-sm">
        <button
          onClick={onBack}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all backdrop-blur-sm"
        >
          <FaArrowLeft className="text-white" />
        </button>

        <button
          onClick={handleNext}
          className="flex-1 ml-4 py-4 px-8 rounded-full font-semibold bg-white text-blue-600 hover:bg-opacity-90 transition-all"
        >
          Next
        </button>
      </div>

      {/* Bottom indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white bg-opacity-40 rounded-full"></div>
    </div>
  );
}
