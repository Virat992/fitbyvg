import { FaArrowLeft } from "react-icons/fa";

export default function MotivationalBusyLifestyle({
  firstName,
  onNext,
  onBack,
}) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-600 via-blue-700 to-purple-600 text-white">
      <div className="w-full max-w-md mx-auto px-4 min-h-screen flex flex-col">
        {/* Header */}
        <div className="py-4 mb-8">
          <h1 className="text-xl font-medium text-white">Goals</h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 leading-tight">
              We get it, {firstName}. A busy lifestyle can easily get in the way
              of reaching your goals.
            </h2>
            <p className="text-white/90 text-lg leading-relaxed">
              Luckily we know all about managing potential pitfalls along the
              way because we've helped millions of people reach their goals.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between py-6">
          <button
            onClick={onBack}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            <FaArrowLeft className="text-white" />
          </button>

          <button
            onClick={onNext}
            className="flex-1 ml-4 py-4 px-8 rounded-xl font-semibold bg-white text-blue-600 hover:bg-gray-100 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
