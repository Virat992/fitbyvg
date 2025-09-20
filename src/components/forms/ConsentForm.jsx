import { useState } from "react";
import BottomNavigation from "../BottomNavigation";

export default function ConsentForm({ onNext, onBack }) {
  const [consent, setConsent] = useState(false);

  const handleNext = () => {
    if (consent) {
      onNext({ consent: true }); // ✅ No e.preventDefault needed
    } else {
      alert("Please provide your consent to continue");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto h-dvh flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      {/* Header */}
      <div className="px-4 pt-6 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Consent Form</h1>
      </div>

      {/* Scrollable Section */}
      <div className="flex-1 px-4 overflow-y-auto space-y-6 pb-4 scrollbar-hide">
        <p className="text-gray-700 leading-relaxed">
          Please read and confirm the following:
        </p>

        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>
            I understand the nature and purpose of the fitness assessment and
            training program.
          </li>
          <li>
            I acknowledge that participation involves physical exertion and
            carries potential risks.
          </li>
          <li>
            I confirm that I will disclose any relevant medical conditions to
            the trainer.
          </li>
          <li>I voluntarily consent to participate in this program.</li>
        </ul>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="w-5 h-5"
          />
          <label htmlFor="consent" className="text-gray-700">
            I have read and understood the above and I consent.
          </label>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-4 py-6 pb-16">
        <BottomNavigation
          onBack={onBack}
          onNext={handleNext}
          nextDisabled={!consent}
        />
      </div>
    </div>
  );
}
