import { useState, useEffect } from "react";
import { db } from "../services/firebase"; // update path if needed
import {
  doc,
  setDoc,
  collection,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";

export default function WorkoutBuilder() {
  const [programName, setProgramName] = useState("");
  const [weeksCount, setWeeksCount] = useState(4);
  const [selectedWeek, setSelectedWeek] = useState("week1"); // for adding exercises
  const [day, setDay] = useState("monday");

  const [exercise, setExercise] = useState({
    name: "",
    sets: "",
    reps: "",
    tempo: "",
    imgurl: "",
    instructions: "",
  });

  const [exercisesList, setExercisesList] = useState([]);
  const [editingExerciseId, setEditingExerciseId] = useState(null);

  // Listen to exercises for currently selected program/week/day
  useEffect(() => {
    if (!programName) return;

    const exercisesCol = collection(
      db,
      "workoutTemplates",
      programName,
      "weeks",
      selectedWeek,
      "days",
      day,
      "exercises"
    );

    const unsub = onSnapshot(exercisesCol, (snap) => {
      setExercisesList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [programName, selectedWeek, day]);

  // Create program with weeks
  const handleCreateProgram = async () => {
    if (!programName) return alert("Enter program name");

    try {
      const programRef = doc(db, "workoutTemplates", programName);
      await setDoc(programRef, { name: programName });

      // Create weeks & days structure
      for (let i = 1; i <= weeksCount; i++) {
        const weekRef = doc(
          db,
          "workoutTemplates",
          programName,
          "weeks",
          `week${i}`
        );
        await setDoc(weekRef, { title: `Week ${i}` });

        const days = [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];
        for (const d of days) {
          const dayRef = doc(
            db,
            "workoutTemplates",
            programName,
            "weeks",
            `week${i}`,
            "days",
            d
          );
          await setDoc(dayRef, { title: d });
        }
      }

      alert(`✅ Program '${programName}' created with ${weeksCount} weeks`);
      setSelectedWeek("week1"); // reset to first week after creation
    } catch (err) {
      console.error(err);
      alert("Error creating program: " + err.message);
    }
  };

  // Add or update exercise
  const handleAddExercise = async (e) => {
    e.preventDefault();
    if (!programName || !exercise.name) return;

    const exerciseId = exercise.name.toLowerCase().replace(/\s+/g, "-");

    try {
      const exerciseRef = doc(
        db,
        "workoutTemplates",
        programName,
        "weeks",
        selectedWeek,
        "days",
        day,
        "exercises",
        exerciseId
      );

      await setDoc(exerciseRef, {
        ...exercise,
        sets: parseInt(exercise.sets),
        reps: exercise.reps,
        createdAt: new Date(),
      });

      setExercise({
        name: "",
        sets: "",
        reps: "",
        tempo: "",
        imgurl: "",
        instructions: "",
      });
      setEditingExerciseId(null);
    } catch (err) {
      console.error(err);
      alert("Error adding exercise: " + err.message);
    }
  };

  // Load exercise into form for editing
  const handleEdit = (ex) => {
    setExercise({
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      tempo: ex.tempo,
      imgurl: ex.imgurl,
      instructions: ex.instructions,
    });
    setEditingExerciseId(ex.id);
  };

  // Delete exercise
  const handleDelete = async (exerciseId) => {
    if (!programName) return;
    if (!confirm("Are you sure you want to delete this exercise?")) return;

    try {
      await deleteDoc(
        doc(
          db,
          "workoutTemplates",
          programName,
          "weeks",
          selectedWeek,
          "days",
          day,
          "exercises",
          exerciseId
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error deleting exercise: " + err.message);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b bg-cyan-50 via-white to-cyan-100 flex gap-6 mx-auto p-6 space-y-8">
      <div className="flex flex-col">
        <p
          className="text-[40px] font-bold text-cyan-600"
          style={{ fontFamily: "'Roboto', cursive" }}
        >
          FITBYVG<span className="align-super text-[20px]">™</span>
        </p>
        <h1 className="text-2xl font-bold">Workout Builder</h1>
      </div>

      <div className="flex flex-col gap-4">
        {/* STEP 1: Create Program */}
        <div className="p-4 h-[32%] min-w-[20%] border rounded space-y-3 bg-gray-50">
          <h2 className="text-xl font-semibold">1️⃣ Create Program</h2>
          <input
            type="text"
            placeholder="Program Name (e.g. fatloss-beginner)"
            className="w-full border p-2 rounded"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Number of Weeks"
            className="w-full border p-2 rounded"
            value={weeksCount}
            onChange={(e) => setWeeksCount(e.target.value)}
          />
          <button
            onClick={handleCreateProgram}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Create Program
          </button>
        </div>

        {/* STEP 2: Add Exercises */}
        {programName && (
          <div className="px-4 py-4 min-w-[20%] h-[72%] border rounded space-y-3 bg-gray-50">
            <h2 className="text-xl font-semibold">2️⃣ Add Exercises</h2>

            {/* Week Selector */}
            <label>
              Select Week:
              <select
                className="ml-2 mb-3 border p-1 rounded"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
              >
                {Array.from({ length: weeksCount }, (_, i) => (
                  <option key={i} value={`week${i + 1}`}>
                    Week {i + 1}
                  </option>
                ))}
              </select>
            </label>

            <label className="ml-3">
              Select Day:
              <select
                className="ml-2 mb-3 border p-1 rounded"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              >
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
              </select>
            </label>

            <form onSubmit={handleAddExercise} className="space-y-2">
              <input
                type="text"
                placeholder="Exercise Name"
                className="w-full border p-2 rounded"
                value={exercise.name}
                onChange={(e) =>
                  setExercise({ ...exercise, name: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Sets"
                className="w-full border p-2 rounded"
                value={exercise.sets}
                onChange={(e) =>
                  setExercise({ ...exercise, sets: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Reps"
                className="w-full border p-2 rounded"
                value={exercise.reps}
                onChange={(e) =>
                  setExercise({ ...exercise, reps: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Tempo"
                className="w-full border p-2 rounded"
                value={exercise.tempo}
                onChange={(e) =>
                  setExercise({ ...exercise, tempo: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Image URL"
                className="w-full border p-2 rounded"
                value={exercise.imgurl}
                onChange={(e) =>
                  setExercise({ ...exercise, imgurl: e.target.value })
                }
              />
              <textarea
                placeholder="Instructions"
                className="w-full border p-2 rounded"
                value={exercise.instructions}
                onChange={(e) =>
                  setExercise({ ...exercise, instructions: e.target.value })
                }
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                {editingExerciseId ? "✏️ Update Exercise" : "➕ Add Exercise"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* STEP 3: Preview */}
      {programName && (
        <div className="flex-1 min-w-[50%]">
          <h2 className="text-xl font-semibold mb-2">3️⃣ Exercises Preview</h2>
          <div className="h-[500px] overflow-y-auto border rounded p-2">
            {exercisesList.length === 0 ? (
              <p className="text-gray-500">No exercises yet.</p>
            ) : (
              <ul className="space-y-2 overflow-auto">
                {exercisesList.map((ex) => (
                  <li
                    key={ex.id}
                    className="border p-2 rounded flex items-center gap-4 justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {ex.imgurl && (
                        <img
                          src={ex.imgurl}
                          alt={ex.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex flex-col">
                        <p className="font-bold">{ex.name}</p>
                        <p className="text-sm text-gray-700">
                          {ex.sets} × {ex.reps} ({ex.tempo})
                        </p>
                        {ex.instructions && (
                          <p className="text-xs text-gray-500">
                            {ex.instructions}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="bg-yellow-400 px-2 py-1 rounded text-white text-sm"
                        onClick={() => handleEdit(ex)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 px-2 py-1 rounded text-white text-sm"
                        onClick={() => handleDelete(ex.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
