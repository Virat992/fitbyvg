import { auth, db } from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

export default function OnboardingRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user && user.email) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.email));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setOnboardingStatus(userData.onboardingCompleted || false);
          } else {
            // User document doesn't exist, onboarding is needed
            setOnboardingStatus(false);
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
          // On error, allow onboarding
          setOnboardingStatus(false);
        }
      }
      setCheckingOnboarding(false);
    };

    if (user) {
      checkOnboardingStatus();
    } else {
      setCheckingOnboarding(false);
    }
  }, [user]);

  if (loading || checkingOnboarding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  // If user has already completed onboarding, redirect to dashboard
  if (onboardingStatus === true) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}