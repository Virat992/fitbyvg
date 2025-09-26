// src/components/dashboard/ExercisesList.jsx
export default function ExercisesList({
  exercises,
  completedExercises,
  handleToggleExercise,
  handleToggleAll,
  allCompleted,
  noteInput,
  setNoteInput,
  notesHistory,
  setNotesHistory,
  savingNote,
  setSavingNote,
  handleSaveProgress,
  selectedWorkout,
  selectedWeek,
  selectedDay,
  completedDays,
  setSelectedDay,
  setSelectedWeek,
  setStarted,
  setSelectedWorkout,
}) {
  const lockKey = `${selectedWorkout.dbName}_${selectedWeek}_${selectedDay}`;
  const isLocked = completedDays[lockKey];

  const handleAddNote = () => {
    if (!noteInput) return;
    setNotesHistory((prev) => [
      ...prev,
      { note: noteInput, timestamp: Date.now() },
    ]);
    setNoteInput("");
  };

  // Back button
  const handleBack = () => {
    if (selectedDay) setSelectedDay(null);
    else if (selectedWeek) setSelectedWeek(null);
    else if (setStarted) setStarted(false);
    else if (setSelectedWorkout) setSelectedWorkout(null);
  };

  return (
    <div className="bg-white mt-5 rounded-2xl shadow-lg p-5">
      <button
        onClick={handleBack}
        className="flex cursor-pointer items-center gap-2 text-cyan-600 font-medium mb-4"
      >
        Back
      </button>

      <h2 className="text-xl font-bold mb-4 capitalize">
        {selectedWorkout.name} - {selectedWeek} - {selectedDay}
      </h2>

      <div className="space-y-4 mb-6">
        {exercises.map((ex) => (
          <div
            key={ex.id}
            className="border rounded-xl p-3 flex flex-col md:flex-row items-start gap-4"
          >
            {/* Exercise Image */}
            <div className="w-full md:w-40 h-40 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={ex.imgurl}
                alt={ex.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Exercise Details */}
            <div className="flex-1 flex flex-col">
              <h3 className="font-bold text-lg">{ex.name}</h3>
              <p className="text-sm text-gray-600">
                {ex.sets} sets × {ex.reps}
              </p>

              {/* Instructions */}
              {ex.instructions && (
                <div className="mt-2 max-h-24 overflow-y-auto p-2 border rounded-lg bg-gray-50 text-sm text-gray-700">
                  {ex.instructions.split("\n").map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              )}

              {/* Mark Done */}
              <label className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={completedExercises[ex.id] || false}
                  onChange={() => !isLocked && handleToggleExercise(ex.id)}
                  className="mr-2"
                  disabled={isLocked}
                />
                Mark Done
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="mb-4">
        {!isLocked ? (
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Write a note about today's workout..."
            className="w-full border rounded-lg p-3 text-sm"
            rows={3}
          />
        ) : notesHistory.length > 0 ? (
          <div className="p-3 border rounded-lg bg-gray-100 text-sm text-gray-700">
            {notesHistory.map((n, i) => (
              <p key={i}>
                {n.note} ({new Date(n.timestamp).toLocaleString()})
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">
            No notes were added for this workout.
          </p>
        )}
      </div>

      {/* Mark All Completed */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={allCompleted}
          onChange={handleToggleAll}
          disabled={isLocked}
        />
        <span className="font-semibold">Workout Completed</span>
      </div>

      {/* Save Progress */}
      <button
        onClick={() => {
          handleAddNote();
          handleSaveProgress();
        }}
        className={`w-full py-3 font-bold rounded-2xl transition ${
          isLocked
            ? "bg-green-500 text-white cursor-not-allowed"
            : "bg-cyan-600 text-white hover:bg-cyan-700"
        }`}
        disabled={isLocked || savingNote}
      >
        {isLocked
          ? "Workout Completed ✅"
          : savingNote
          ? "Saving..."
          : "Save Progress"}
      </button>
    </div>
  );
}
