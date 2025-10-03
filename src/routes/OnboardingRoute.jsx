import { auth, db } from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

export default function OnboardingRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  const [onboardingStatus, setOnboardingStatus] = useState(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setOnboardingStatus(data.onboardingCompleted ?? false);
        } else {
          setOnboardingStatus(false);
        }
      } catch (err) {
        console.error("Error checking onboarding status:", err);
        setOnboardingStatus(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  // ✅ Show loading until auth and onboarding status are ready
  if (loading || onboardingStatus === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-center">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  if (onboardingStatus === true) return <Navigate to="/dashboard" replace />;

  return children;
}
