import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
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
import SteadyPlanner from "../components/onboarding/SteadyPlanner";
import WeightLossBarriers from "../components/onboarding/WeightLossBarriers";

const STEPS = {
  WELCOME: 0,
  GOALS: 1,
  MOTIVATIONAL_MESSAGE: 2,
  HEALTH_HABITS: 3,
  PHYSICAL_INFO: 4,
  MEAL_PLANNING: 5,
  STEADY_PLANNER: 6,
  WEIGHT_LOSS_BARRIERS: 7,
};

const TOTAL_STEPS = Object.keys(STEPS).length;

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(STEPS.WELCOME);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // State for collecting onboarding data
  const [onboardingData, setOnboardingData] = useState({
    firstName: "",
    goals: [],
    healthHabits: [],
    physicalInfo: {},
    mealPlanningFrequency: "",
    weightLossBarriers: [],
  });

  const updateOnboardingData = (newData) => {
    setOnboardingData((prev) => ({ ...prev, ...newData }));
  };

  const handleNext = (data = {}) => {
    updateOnboardingData(data);

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/");
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Save onboarding data to Firebase
      await updateDoc(doc(db, "users", user.email), {
        onboarding: onboardingData,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date(),
      });

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      // Handle error - maybe show an alert
    } finally {
      setLoading(false);
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
        return <MotivationalMessage {...commonProps} goals={onboardingData.goals} />;
      case STEPS.HEALTH_HABITS:
        return <HealthHabits {...commonProps} />;
      case STEPS.PHYSICAL_INFO:
        return <PhysicalInfo {...commonProps} />;
      case STEPS.MEAL_PLANNING:
        return <MealPlanning {...commonProps} />;
      case STEPS.STEADY_PLANNER:
        return <SteadyPlanner {...commonProps} />;
      case STEPS.WEIGHT_LOSS_BARRIERS:
        return <WeightLossBarriers {...commonProps} />;
      default:
        return null;
    }
  };

  // Don't show progress bar for motivational screens (dark gradient screens)
  const showProgressBar = ![
    STEPS.MOTIVATIONAL_MESSAGE,
    STEPS.STEADY_PLANNER,
  ].includes(currentStep);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      {/* Progress Indicator - only show on non-motivational screens */}
      {showProgressBar && (
        <div className="pt-4">
          <OnboardingProgress
            currentStep={currentStep + 1}
            totalSteps={TOTAL_STEPS}
          />
        </div>
      )}

      {/* Current Step Content */}
      <div className="w-full">{renderCurrentStep()}</div>
    </div>
  );
}
