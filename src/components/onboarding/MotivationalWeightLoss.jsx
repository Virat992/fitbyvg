import { FaArrowLeft } from "react-icons/fa";

export default function MotivationalWeightLoss({ firstName, onNext, onBack }) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-600 via-blue-700 to-purple-600 text-white">
      <div className="w-full max-w-md mx-auto px-4 min-h-screen flex flex-col">
        {/* Header */}
        <div className="py-4 mb-8">
          <h1 className="text-xl font-medium text-white">Goals</h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-8">
            <p className="text-white/80 text-lg mb-4">OK, real talk:</p>
            <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
              Losing weight isn't always easy.
            </h2>
            <p className="text-white/90 text-lg leading-relaxed mb-8">
              But we'll motivate you through the ups and downs—so you can hit
              that goal!
            </p>
          </div>

          {/* Weight Journey Visualization */}
          <div className="bg-blue-500/30 rounded-2xl p-6 mb-8 backdrop-blur-sm">
            <div className="relative h-32 mb-4">
              {/* SVG Wave Chart */}
              <svg
                viewBox="0 0 300 100"
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                {/* Background grid lines */}
                <defs>
                  <pattern
                    id="grid"
                    width="30"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 30 0 L 0 0 0 20"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Weight loss curve */}
                <path
                  d="M0,20 Q50,30 75,25 Q125,15 150,20 Q200,25 225,15 Q275,10 300,12"
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Trend line */}
                <path
                  d="M0,35 Q75,30 150,25 Q225,20 300,15"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                />

                {/* Start point */}
                <circle cx="15" cy="25" r="4" fill="white" />
              </svg>
            </div>

            <div className="flex justify-between text-white/80 text-sm">
              <span>Today</span>
              <span>6 months</span>
            </div>
          </div>

          <p className="text-white/80 text-lg italic">
            P.S. You've already done the hardest part: getting started{" "}
            <span>😊</span>
          </p>
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
