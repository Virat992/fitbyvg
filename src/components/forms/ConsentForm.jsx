import { useState } from "react";
import BottomNavigation from "../BottomNavigation";

export default function ConsentForm({ onNext, onBack }) {
  const [consent, setConsent] = useState(false);

  const handleNext = () => {
    if (consent) {
      onNext({ consent: true });
    } else {
      alert("Please provide your consent to continue");
    }
  };

  return (
    <div className="w-full h-dvh flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      <div className="w-full max-w-md md:max-w-lg mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="px-4 md:px-6 pt-6 mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Consent Form
          </h1>
        </div>

        {/* Scrollable Section */}
        <div className="flex-1 px-4 md:px-6 overflow-y-auto space-y-6 pb-4 scrollbar-hide">
          <p className="text-gray-700 leading-relaxed md:text-lg">
            Please read and confirm the following:
          </p>

          <ul className="list-disc list-inside text-gray-600 space-y-2 md:text-base">
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

          <div className="flex items-center gap-3 mt-4">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="w-5 h-5 md:w-6 md:h-6"
            />
            <label htmlFor="consent" className="text-gray-700 md:text-base">
              I have read and understood the above and I consent.
            </label>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="px-4 md:px-6 py-6 pb-16">
          <BottomNavigation
            onBack={onBack}
            onNext={handleNext}
            nextDisabled={!consent}
          />
        </div>
      </div>
    </div>
  );
}
