import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

/**
 * Marks a single form as completed and checks if all forms are done.
 * If all are done, marks onboardingCompleted = true
 * @param {string} userEmail
 * @param {string} formKey  // "parq" | "acsm" | "consent" | "preferences"
 */
export async function markFormCompletedAndCheck(userEmail, formKey) {
  const userRef = doc(db, "users", userEmail);

  // Mark the single form as true
  await updateDoc(userRef, { [`forms.${formKey}`]: true });

  // Re-read the user doc to check all forms
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const data = snap.data();
  const forms = data.forms || {};

  const allDone = ["parq", "acsm", "consent", "preferences"].every(
    (k) => forms[k]
  );

  if (allDone && !data.onboardingCompleted) {
    await updateDoc(userRef, {
      formsCompleted: true,
      onboardingCompleted: true,
      formsCompletedAt: new Date(),
    });
  }
}
