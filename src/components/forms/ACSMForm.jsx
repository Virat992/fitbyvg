import { useState } from "react";
import BottomNavigation from "../BottomNavigation";

export default function ACSMForm({ onNext, onBack }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const questions = [
    {
      id: "age",
      text: "Are you a man ≥45 years old or a woman ≥55 years old?",
    },
    {
      id: "familyHistory",
      text: "Family history of heart disease (before 55 in father/brother or 65 in mother/sister)?",
    },
    {
      id: "smoking",
      text: "Do you currently smoke or quit within the last 6 months?",
    },
    {
      id: "hypertension",
      text: "High blood pressure (≥140/90 mmHg or on medication)?",
    },
    {
      id: "cholesterol",
      text: "High cholesterol (LDL ≥130 mg/dL, HDL <40 mg/dL, or on medication)?",
    },
    {
      id: "bloodSugar",
      text: "Impaired fasting glucose (≥100 mg/dL or on medication)?",
    },
    {
      id: "obesity",
      text: "BMI ≥30 or waist >102 cm (men) or >88 cm (women)?",
    },
    {
      id: "sedentary",
      text: "Less than 30 min of moderate exercise on 3 days/week for 3 months?",
    },
    {
      id: "signsSymptoms",
      text: "Chest pain, dizziness, ankle swelling, palpitations, or known heart disease?",
    },
  ];

  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    const positives = Object.values(answers).filter(
      (val) => val === "yes"
    ).length;
    let riskLevel = "Low Risk";
    if (answers.signsSymptoms === "yes") riskLevel = "High Risk";
    else if (positives >= 2) riskLevel = "Moderate Risk";

    setResult(riskLevel);
    localStorage.setItem("acsmRisk", riskLevel);

    setTimeout(() => onNext({ acsm: riskLevel }), 1500);
  };

  return (
    <div className="w-full h-dvh flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      <div className="w-full max-w-md md:max-w-lg mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="px-4 md:px-6 pt-6 mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            ACSM Risk Stratification
          </h1>
        </div>

        {/* Scrollable Section */}
        {!result ? (
          <form className="flex-1 px-4 md:px-6 overflow-y-auto space-y-6 pb-4 scrollbar-hide">
            {questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <p className="font-medium text-gray-700 md:text-lg">{q.text}</p>
                <div className="flex gap-6 md:gap-8">
                  {["yes", "no"].map((val) => (
                    <label
                      key={val}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={val}
                        onChange={() => handleChange(q.id, val)}
                        required
                        className="w-4 h-4 md:w-5 md:h-5"
                      />
                      <span className="capitalize md:text-base">{val}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </form>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center px-4 md:px-6">
            <p className="text-lg md:text-xl font-semibold text-gray-700">
              Your Risk Level:
            </p>
            <p className="text-2xl md:text-3xl font-bold text-cyan-600 mt-2">
              {result}
            </p>
            <p className="text-gray-500 mt-2 md:text-base">
              Redirecting to next step...
            </p>
          </div>
        )}

        {/* Bottom Navigation */}
        {!result && (
          <div className="px-4 md:px-6 py-6 pb-16">
            <BottomNavigation
              onBack={onBack}
              onNext={handleNext}
              nextDisabled={Object.keys(answers).length !== questions.length}
            />
          </div>
        )}
      </div>
    </div>
  );
}
