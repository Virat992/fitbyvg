import { useState } from "react";
import BottomNavigation from "../BottomNavigation";

export default function PARQForm({ onNext, onBack }) {
  const [answers, setAnswers] = useState({
    chestPain: "",
    dizziness: "",
    jointIssues: "",
    medication: "",
    other: "",
  });

  const handleChange = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    onNext({ parq: answers });
  };

  const isNextDisabled =
    !answers.chestPain ||
    !answers.dizziness ||
    !answers.jointIssues ||
    !answers.medication;

  return (
    <div className="w-full h-dvh flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      <div className="w-full max-w-md md:max-w-lg mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="px-4 md:px-6 pt-6 mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            PAR-Q+ Form
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            Please answer honestly. This helps us ensure your safety during
            training.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 px-4 md:px-6 overflow-y-auto space-y-6 pb-4 scrollbar-hide">
          {/* Q1 */}
          <div>
            <label className="font-medium block mb-2 text-gray-900 md:text-lg">
              1. Do you experience chest pain during physical activity?
            </label>
            <select
              className="w-full p-3 md:p-4 border rounded-xl text-gray-900"
              value={answers.chestPain}
              onChange={(e) => handleChange("chestPain", e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Q2 */}
          <div>
            <label className="font-medium block mb-2 text-gray-900 md:text-lg">
              2. Do you feel dizzy or lose balance during activity?
            </label>
            <select
              className="w-full p-3 md:p-4 border rounded-xl text-gray-900"
              value={answers.dizziness}
              onChange={(e) => handleChange("dizziness", e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Q3 */}
          <div>
            <label className="font-medium block mb-2 text-gray-900 md:text-lg">
              3. Do you have joint problems that could worsen with exercise?
            </label>
            <select
              className="w-full p-3 md:p-4 border rounded-xl text-gray-900"
              value={answers.jointIssues}
              onChange={(e) => handleChange("jointIssues", e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Q4 */}
          <div>
            <label className="font-medium block mb-2 text-gray-900 md:text-lg">
              4. Are you currently taking any prescribed medication?
            </label>
            <select
              className="w-full p-3 md:p-4 border rounded-xl text-gray-900"
              value={answers.medication}
              onChange={(e) => handleChange("medication", e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Q5 */}
          <div>
            <label className="font-medium block mb-2 text-gray-900 md:text-lg">
              5. Any other reason you should not do physical activity?
            </label>
            <textarea
              className="w-full p-3 md:p-4 border rounded-xl text-gray-900"
              rows="2"
              placeholder="Type here..."
              value={answers.other}
              onChange={(e) => handleChange("other", e.target.value)}
            />
          </div>
        </div>

        {/* Fixed Bottom Navigation */}
        <div className="px-4 md:px-6 py-6 pb-16">
          <BottomNavigation
            onBack={onBack}
            onNext={handleNext}
            nextDisabled={isNextDisabled}
          />
        </div>
      </div>
    </div>
  );
}
