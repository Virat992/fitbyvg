import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../BottomNavigation";

export default function Welcome({ onNext, onBack }) {
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // redirect to landing/login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto h-dvh flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      {/* Header */}
      <div className="px-4 pt-6 mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Welcome</h1>
        <button
          onClick={handleLogout}
          className="text-sm  font-semibold text-cyan-600 cursor-pointer hover:font-bold"
        >
          Logout
        </button>
      </div>

      {/* Main Content (scrollable if needed) */}
      <div className="flex-1 px-4 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          First, what can we call you?
        </h2>
        <p className="text-gray-600 text-base flex items-center gap-1 mb-6">
          We'd like to get to know you. <span>🙂</span>
        </p>

        {/* Input Section */}
        <div>
          <label className="block text-gray-600 text-sm mb-3">
            Preferred first name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 bg-gray-50"
            autoFocus
          />
        </div>
      </div>

      {/* ✅ Fixed Bottom Navigation */}
      <div className="px-4 py-6 pb-16">
        <BottomNavigation
          onBack={onBack}
          onNext={handleNext}
          nextDisabled={!firstName.trim()}
        />
      </div>
    </div>
  );
}
