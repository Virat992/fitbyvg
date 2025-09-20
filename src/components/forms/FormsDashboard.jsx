import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function FormsDashboard() {
  const [user] = useAuthState(auth);
  const [forms, setForms] = useState({
    parq: false,
    acsm: false,
    consent: false,
    preferences: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const snap = await getDoc(doc(db, "users", user.email));
      if (snap.exists()) {
        setForms({ ...(snap.data().forms || {}) });
      }
    };
    fetch();
  }, [user]);

  const formsList = [
    { key: "parq", label: "PAR-Q+ (Readiness)", route: "/forms/parq" },
    { key: "acsm", label: "ACSM Risk Stratification", route: "/forms/acsm" },
    { key: "consent", label: "Informed Consent", route: "/forms/consent" },
    {
      key: "preferences",
      label: "Workout Preferences",
      route: "/forms/preferences",
    },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Complete required forms</h1>
      <p className="text-sm text-gray-600 mb-6">
        Please complete these forms to unlock your full dashboard and
        personalized plans.
      </p>

      <ul className="space-y-3">
        {formsList.map(({ key, label, route }) => (
          <li
            key={key}
            className="p-4 bg-white rounded-xl shadow flex items-center justify-between"
          >
            <div>
              <div className="font-medium">{label}</div>
              <div className="text-sm text-gray-500">
                {forms[key] ? "Completed" : "Not completed"}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {forms[key] && <span className="text-sm text-green-600">✓</span>}
              <button
                onClick={() => navigate(route)}
                className="px-4 py-1 bg-cyan-600 text-white rounded-md"
              >
                {forms[key] ? "Edit" : "Fill"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
