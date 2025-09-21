import {
  doc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

// Example default workout
export const getDefaultWorkout = () => ({
  title: "Fat Burner Beginner",
  description: "Full body workout to burn fat",
  exercises: [
    { name: "Jumping Jacks", reps: "10-12", sets: "3" },
    { name: "Bodyweight Squats", reps: "10-12", sets: "3" },
    { name: "Plank", reps: "10-12", sets: "3" },
  ],
  goal: "lose-fat",
  experience: "beginner",
});

// Fetch workouts based on goal and experience
export const fetchWorkoutByGoalAndExperience = async (goal, experience) => {
  if (!goal || !experience) return [];

  try {
    const q = query(
      collection(db, "workoutTemplates"),
      where("goal", "==", goal),
      where("experience", "==", experience)
    );

    const querySnapshot = await getDocs(q);
    const workouts = [];
    querySnapshot.forEach((doc) => {
      workouts.push(doc.data());
    });

    // If none found, return default workout
    return workouts.length > 0 ? workouts : [getDefaultWorkout()];
  } catch (err) {
    console.error("Error fetching workouts by goal and experience:", err);
    return [getDefaultWorkout()];
  }
};

// Assign workout to user if none exists
export const assignWorkoutToUser = async (userEmail, goal, experience) => {
  if (!userEmail) return;

  const userRef = doc(db, "users", userEmail);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    if (!data.assignedWorkouts || data.assignedWorkouts.length === 0) {
      // Fetch workout based on goal + experience
      const workouts = await fetchWorkoutByGoalAndExperience(goal, experience);
      await updateDoc(userRef, {
        assignedWorkouts: workouts,
      });
    }
  }
};
