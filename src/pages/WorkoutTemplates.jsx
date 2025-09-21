import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export default function WorkoutTemplates() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const workoutCollection = collection(db, "workoutTemplates");
        const snapshot = await getDocs(workoutCollection);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWorkouts(data);
      } catch (err) {
        console.error("Error fetching workouts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading workouts...</p>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Workout Templates</h1>
      {workouts.length === 0 ? (
        <p>No workouts found.</p>
      ) : (
        workouts.map((workout) => (
          <div
            key={workout.id}
            className="mb-5 p-4 border rounded-lg bg-white shadow-sm"
          >
            <h2 className="font-semibold text-lg">
              {workout.title || workout.id}
            </h2>
            <p className="text-gray-600 mb-2">{workout.description}</p>
            <ul className="list-disc list-inside">
              {workout.exercises?.map((ex, i) => (
                <li key={i}>
                  {ex.name} - {ex.sets} sets × {ex.reps} reps (Rest: {ex.rest})
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
