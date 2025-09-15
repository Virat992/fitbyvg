import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Button from "../Button";

export default function Welcome({ onNext, onBack }) {
  const [firstName, setFirstName] = useState("");

  const handleNext = () => {
    if (firstName.trim()) {
      onNext({ firstName: firstName.trim() });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && firstName.trim()) {
      handleNext();
    }
  };

  return (
    <div className="w-full flex flex-col max-w-md mx-auto px-4 py-6 bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome</h1>
      </div>

      {/* Main Content */}
      <div className="mb-66">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          First, what can we call you?
        </h2>
        <p className="text-gray-600 text-base flex items-center gap-1 mb-6">
          We'd like to get to know you. <span>🙂</span>
        </p>

        {/* Input Section */}
        <div className="">
          <label className="block text-gray-600 text-sm mb-3">
            Preferred first name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Virat"
            className="w-full px-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
            autoFocus
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="w-12 h-12 flex cursor-pointer items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>

        <div className="flex-1 ml-4">
          <Button
            onClick={handleNext}
            disabled={!firstName.trim()}
            variant={firstName.trim() ? "primary" : "gray"}
            size="md"
            className="px-6 py-3"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
