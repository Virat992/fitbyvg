// src/components/BottomNavigation.jsx
import { FaArrowLeft } from "react-icons/fa";
import Button from "./Button"; // your custom button

export default function BottomNavigation({
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = "Next",
}) {
  return (
    <div className="flex items-center justify-between mr-1 px-1 pt-2">
      {/* Back button */}
      <button
        type="button"
        onClick={() => onBack && onBack()} // ✅ wrapped
        className="w-12 cursor-pointer h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <FaArrowLeft className="text-gray-600" />
      </button>

      {/* Next button */}
      <div className="flex-1 ml-4">
        <Button
          onClick={() => onNext && onNext()} // ✅ wrapped
          disabled={nextDisabled}
          variant={nextDisabled ? "gray" : "primary"}
          size="md"
          className="px-6 py-3"
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
