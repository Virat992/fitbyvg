import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../services/firebase";

// Import onboarding step components
import OnboardingProgress from "../components/onboarding/OnboardingProgress";
import Welcome from "../components/onboarding/Welcome";
import Goals from "../components/onboarding/Goals";
import MotivationalMessage from "../components/onboarding/MotivationalMessage";
import HealthHabits from "../components/onboarding/HealthHabits";
import PhysicalInfo from "../components/onboarding/PhysicalInfo";
import WeightLossBarriers from "../components/onboarding/WeightLossBarriers";

// Forms
import PARQForm from "../components/forms/PARQForm";
import ACSMForm from "../components/forms/ACSMForm";
import ConsentForm from "../components/forms/ConsentForm";
import PreferencesForm from "../components/forms/PreferencesForm";

// Steps enum
const STEPS = {
  WELCOME: 0,
  GOALS: 1,
  MOTIVATIONAL_MESSAGE: 2,
  HEALTH_HABITS: 3,
  PHYSICAL_INFO: 4,
  WEIGHT_LOSS_BARRIERS: 5,
  PARQ_FORM: 6,
  ACSM_FORM: 7,
  CONSENT_FORM: 8,
  PREFERENCES_FORM: 9,
};

const TOTAL_STEPS = Object.keys(STEPS).length;

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(STEPS.WELCOME);
  const [onboardingData, setOnboardingData] = useState({
    firstName: "",
    goals: [],
    healthHabits: [],
    physicalInfo: {},
    parq: null,
    acsm: null,
    consent: false,
    preferences: {},
    weightLossBarriers: [],
  });

  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleNext = (data = {}) => {
    const updatedData = { ...onboardingData, ...data };
    setOnboardingData(updatedData);

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete(updatedData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else navigate("/");
  };

  const handleComplete = async (data) => {
    if (!user) return;

    try {
      await setDoc(
        doc(db, "users", user.email),
        {
          onboarding: data,
          onboardingCompleted: true,
          onboardingCompletedAt: new Date(),
          formsCompleted: true,
        },
        { merge: true }
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const renderCurrentStep = () => {
    const commonProps = { onNext: handleNext, onBack: handlePrevious };

    switch (currentStep) {
      case STEPS.WELCOME:
        return (
          <Welcome {...commonProps} firstName={onboardingData.firstName} />
        );
      case STEPS.GOALS:
        return <Goals {...commonProps} goals={onboardingData.goals} />;
      case STEPS.MOTIVATIONAL_MESSAGE:
        return (
          <MotivationalMessage {...commonProps} goals={onboardingData.goals} />
        );
      case STEPS.HEALTH_HABITS:
        return <HealthHabits {...commonProps} />;
      case STEPS.PHYSICAL_INFO:
        return <PhysicalInfo {...commonProps} />;
      case STEPS.PARQ_FORM:
        return <PARQForm {...commonProps} />;
      case STEPS.ACSM_FORM:
        return <ACSMForm {...commonProps} />;
      case STEPS.CONSENT_FORM:
        return <ConsentForm {...commonProps} />;
      case STEPS.PREFERENCES_FORM:
        return <PreferencesForm {...commonProps} />;
      case STEPS.WEIGHT_LOSS_BARRIERS:
        return <WeightLossBarriers {...commonProps} />;
      default:
        return null;
    }
  };

  const showProgressBar = ![STEPS.MOTIVATIONAL_MESSAGE].includes(currentStep);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      {showProgressBar && (
        <div className="pt-4">
          <OnboardingProgress
            currentStep={currentStep + 1}
            totalSteps={TOTAL_STEPS}
          />
        </div>
      )}

      <div className="w-full">{renderCurrentStep()}</div>
    </div>
  );
}
