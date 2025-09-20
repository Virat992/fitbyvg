// src/routes/PrivateRoute.jsx
import { auth, db } from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

export default function PrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  const [onboardingStatus, setOnboardingStatus] = useState(null); // null = not checked
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user?.email) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.email));
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
      }
      setCheckingOnboarding(false);
    };

    if (user) {
      checkOnboardingStatus();
    } else {
      setCheckingOnboarding(false);
    }
  }, [user]);

  // 1️⃣ Wait until auth + Firestore status is known
  if (loading || checkingOnboarding || onboardingStatus === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-center">Loading...</p>
      </div>
    );
  }

  // 2️⃣ Not logged in → go to login
  if (!user) {
    return <Navigate to="/" />;
  }

  // 3️⃣ Logged in but onboarding not complete → go to onboarding/forms
  if (onboardingStatus === false) {
    return <Navigate to="/onboarding" />;
  }

  // 4️⃣ Logged in and onboarding complete → render the protected page
  return children;
}
