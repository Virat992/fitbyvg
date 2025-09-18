import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateDoc, doc, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../services/firebase";

// Import onboarding step components
import OnboardingProgress from "../components/onboarding/OnboardingProgress";
import Welcome from "../components/onboarding/Welcome";
import Goals from "../components/onboarding/Goals";
import MotivationalMessage from "../components/onboarding/MotivationalMessage";
import HealthHabits from "../components/onboarding/HealthHabits";
import PhysicalInfo from "../components/onboarding/PhysicalInfo";
import MealPlanning from "../components/onboarding/MealPlanning";
import WeightLossBarriers from "../components/onboarding/WeightLossBarriers";

const STEPS = {
  WELCOME: 0,
  GOALS: 1,
  MOTIVATIONAL_MESSAGE: 2,
  HEALTH_HABITS: 3,
  PHYSICAL_INFO: 4,
  MEAL_PLANNING: 5,
  WEIGHT_LOSS_BARRIERS: 6,
};

const TOTAL_STEPS = Object.keys(STEPS).length;

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(STEPS.WELCOME);
  const [onboardingData, setOnboardingData] = useState({
    firstName: "",
    goals: [],
    healthHabits: [],
    physicalInfo: {},
    mealPlanningFrequency: "",
    weightLossBarriers: [],
  });

  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleNext = (data = {}) => {
    // Merge current state with new data
    const updatedData = { ...onboardingData, ...data };

    if (currentStep < TOTAL_STEPS - 1) {
      setOnboardingData(updatedData); // update state
      setCurrentStep(currentStep + 1); // move to next step
    } else {
      console.log("handlecomplete is about to be called");
      handleComplete(updatedData); // use merged data directly
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else navigate("/");
  };

  const handleComplete = async () => {
    if (!user) return;

    try {
      // Use setDoc with merge: true to create or update the document safely
      await setDoc(
        doc(db, "users", user.email),
        {
          onboarding: onboardingData,
          onboardingCompleted: true,
          onboardingCompletedAt: new Date(),
        },
        { merge: true } // Merge with existing data instead of overwriting
      );

      // Redirect to dashboard after successful onboarding
      navigate("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const renderCurrentStep = () => {
    const commonProps = {
      firstName: onboardingData.firstName,
      onNext: handleNext,
      onBack: handlePrevious,
    };

    switch (currentStep) {
      case STEPS.WELCOME:
        return <Welcome {...commonProps} />;
      case STEPS.GOALS:
        return <Goals {...commonProps} />;
      case STEPS.MOTIVATIONAL_MESSAGE:
        return (
          <MotivationalMessage {...commonProps} goals={onboardingData.goals} />
        );
      case STEPS.HEALTH_HABITS:
        return <HealthHabits {...commonProps} />;
      case STEPS.PHYSICAL_INFO:
        return <PhysicalInfo {...commonProps} />;
      case STEPS.MEAL_PLANNING:
        return <MealPlanning {...commonProps} />;
      case STEPS.WEIGHT_LOSS_BARRIERS:
        return <WeightLossBarriers {...commonProps} />;
      default:
        return null;
    }
  };

  const showProgressBar = ![
    STEPS.MOTIVATIONAL_MESSAGE,
    // STEADY_PLANNER step doesn't exist in current STEPS, remove if unnecessary
  ].includes(currentStep);

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
