export default function OnboardingProgress({ currentStep, totalSteps }) {
  return (
    <div className="w-full max-w-md mx-auto px-4 mb-6">
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`flex-1 h-2 rounded-full ${
              index < currentStep
                ? "bg-cyan-600"
                : index === currentStep - 1
                ? "bg-cyan-600"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
