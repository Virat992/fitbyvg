// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { addDays, parseISO, format } from "date-fns";
import { getAuth } from "firebase/auth";
import { db } from "../services/firebase";
import { collection, doc, getDocs, getDoc, setDoc } from "firebase/firestore";

import Calendar from "../components/dashboard/Calender";
import TopBar from "../components/dashboard/TopBar";
import BottomNav from "../components/dashboard/BottomNav";
import WorkoutCarousel from "../components/dashboard/WorkoutCarousel";
import WorkoutInfo from "../components/dashboard/WorkoutInfo";
import WeekSelector from "../components/dashboard/WeekSelector";
import DaySelector from "../components/dashboard/DaySelector";
import ExercisesList from "../components/dashboard/ExerciseList";

import { bodybuilding, fatloss, rehab } from "../data/programs";
import DietDashboard from "../components/diet/DietDashboard";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("workout");
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [started, setStarted] = useState(false);
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [completedExercises, setCompletedExercises] = useState({});
  const [noteInput, setNoteInput] = useState("");
  const [notesHistory, setNotesHistory] = useState([]);
  const [completedDays, setCompletedDays] = useState({});
  const [calendarView, setCalendarView] = useState(false);
  const [calendarDates, setCalendarDates] = useState([]);
  const [calendarDetails, setCalendarDetails] = useState(null);
  const [savingNote, setSavingNote] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [programStartDate, setProgramStartDate] = useState(null);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const allPrograms = [...bodybuilding, ...fatloss, ...rehab];

  // Helper: convert programStartDate + week + day => yyyy-MM-dd
  const getDateFromWeekDay = (startDateStr, week, day) => {
    try {
      const startDate = parseISO(startDateStr);
      const dayOrder = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      const weekNumber = parseInt(week.replace(/\D/g, ""), 10) - 1 || 0;
      const dayIndex = dayOrder.indexOf(day.toLowerCase());
      return format(
        addDays(startDate, weekNumber * 7 + (dayIndex >= 0 ? dayIndex : 0)),
        "yyyy-MM-dd"
      );
    } catch {
      return format(new Date(), "yyyy-MM-dd");
    }
  };

  // ------------------- Fetch helpers -------------------
  const fetchCalendarDates = async () => {
    if (!userId) return;
    try {
      const snap = await getDocs(collection(db, "users", userId, "progress"));
      const datesSet = new Set();
      snap.docs.forEach((d) => {
        if (d.data()?.date) datesSet.add(d.data().date);
      });
      setCalendarDates(Array.from(datesSet).sort());
    } catch (err) {
      console.error("fetchCalendarDates error:", err);
    }
  };

  const fetchWeeks = async (workout) => {
    if (!userId) return;
    try {
      const weeksCol = collection(
        db,
        "workoutTemplates",
        workout.dbName,
        "weeks"
      );
      const snap = await getDocs(weeksCol);
      const sortedWeeks = snap.docs
        .map((d) => d.id)
        .sort(
          (a, b) =>
            parseInt(a.replace(/\D/g, "")) - parseInt(b.replace(/\D/g, ""))
        );
      setWeeks(sortedWeeks);

      const progressSnap = await getDocs(
        collection(db, "users", userId, "progress")
      );
      const progressData = {};
      progressSnap.docs.forEach((d) => {
        if (d.data()?.completed) progressData[d.id] = true;
      });
      setCompletedDays(progressData);
    } catch (err) {
      console.error("fetchWeeks error:", err);
    }
  };

  const fetchDays = async (workout, weekId) => {
    if (!userId) return;
    try {
      const daysCol = collection(
        db,
        "workoutTemplates",
        workout.dbName,
        "weeks",
        weekId,
        "days"
      );
      const snap = await getDocs(daysCol);
      const dayOrder = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      const sortedDays = snap.docs
        .map((d) => d.id.toLowerCase())
        .sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

      const progressSnap = await getDocs(
        collection(db, "users", userId, "progress")
      );
      const progressData = {};
      progressSnap.docs.forEach((d) => {
        if (d.data()?.completed) progressData[d.id] = true;
      });

      setDays(sortedDays);
      setCompletedDays(progressData);
    } catch (err) {
      console.error("fetchDays error:", err);
    }
  };

  const fetchExercises = async (workout, weekId, dayId) => {
    if (!userId) return;
    try {
      const exercisesCol = collection(
        db,
        "workoutTemplates",
        workout.dbName,
        "weeks",
        weekId,
        "days",
        dayId,
        "exercises"
      );
      const snap = await getDocs(exercisesCol);
      const exs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setExercises(exs);

      const progressRef = doc(
        db,
        "users",
        userId,
        "progress",
        `${workout.dbName}_${weekId}_${dayId}`
      );
      const progressSnap = await getDoc(progressRef);

      if (progressSnap.exists()) {
        const data = progressSnap.data();
        setCompletedExercises(data.exercises || {});
        setNotesHistory(data.notes || []);
      } else {
        const initialCompleted = {};
        exs.forEach((ex) => (initialCompleted[ex.id] = false));
        setCompletedExercises(initialCompleted);
        setNotesHistory([]);
      }
    } catch (err) {
      console.error("fetchExercises error:", err);
    }
  };

  const allCompleted = Object.values(completedExercises).every((v) => v);

  // ------------------- Initial effect -------------------
  useEffect(() => {
    const fetchCurrentProgram = async () => {
      if (!userId) return;
      try {
        const userRef = doc(db, "users", userId);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.currentProgram) {
            const program = allPrograms.find(
              (p) => p.dbName === data.currentProgram
            );
            if (program) {
              setCurrentProgram(program);
              const start =
                data.programStartDate ?? format(new Date(), "yyyy-MM-dd");
              setProgramStartDate(start);
              await fetchWeeks(program);
            }
          }
        }
      } catch (err) {
        console.error("fetchCurrentProgram error:", err);
      }
    };
    fetchCurrentProgram();
    fetchCalendarDates();
  }, [userId]);

  // ------------------- Handlers -------------------
  const handleToggleExercise = (id) => {
    const lockKey = `${selectedWorkout?.dbName}_${selectedWeek}_${selectedDay}`;
    if (completedDays[lockKey]) return;
    setCompletedExercises((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleAll = () => {
    const lockKey = `${selectedWorkout?.dbName}_${selectedWeek}_${selectedDay}`;
    if (completedDays[lockKey]) return;
    const newState = {};
    exercises.forEach((ex) => (newState[ex.id] = !allCompleted));
    setCompletedExercises(newState);
  };

  const getWeekStatus = (week) => {
    if (!selectedWorkout) return "not-started";
    const dayOrder = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const dayKeys = dayOrder.map(
      (day) => `${selectedWorkout.dbName}_${week}_${day}`
    );
    const allDone = dayKeys.every((key) => completedDays[key] === true);
    const anyDone = dayKeys.some((key) => completedDays[key] === true);
    if (allDone) return "completed";
    if (anyDone) return "ongoing";
    return "not-started";
  };

  const handleSaveProgress = async () => {
    if (!userId || !selectedWorkout || !selectedWeek || !selectedDay) return;
    setSavingNote(true);
    try {
      const dateStr = format(new Date(), "yyyy-MM-dd");
      const progressRef = doc(
        db,
        "users",
        userId,
        "progress",
        `${selectedWorkout.dbName}_${selectedWeek}_${selectedDay}`
      );
      await setDoc(
        progressRef,
        {
          exercises: completedExercises,
          notes: notesHistory,
          completed: Object.values(completedExercises).every((v) => v),
          date: dateStr,
        },
        { merge: true }
      );

      setCompletedDays((prev) => ({
        ...prev,
        [`${selectedWorkout.dbName}_${selectedWeek}_${selectedDay}`]:
          Object.values(completedExercises).every((v) => v),
      }));
      await fetchCalendarDates();
    } catch (err) {
      console.error("handleSaveProgress error:", err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleCalendarDateSelect = async (dateStr) => {
    if (!userId) return;
    try {
      const snap = await getDocs(collection(db, "users", userId, "progress"));
      const matched = snap.docs.filter((d) => d.data()?.date === dateStr);

      if (matched.length === 0) {
        setCalendarDetails({ date: dateStr, items: [] });
        setCalendarView(false);
        return;
      }

      const items = [];
      for (const docItem of matched) {
        const progressId = docItem.id;
        const [workoutDb, week, day] = progressId.split("_");
        const progData = docItem.data();
        const workout = allPrograms.find((p) => p.dbName === workoutDb) || {
          name: workoutDb,
          dbName: workoutDb,
        };

        let exDocs = [];
        try {
          const exSnap = await getDocs(
            collection(
              db,
              "workoutTemplates",
              workoutDb,
              "weeks",
              week,
              "days",
              day,
              "exercises"
            )
          );
          exDocs = exSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        } catch {}

        const savedExercises = progData.exercises || {};
        const exerciseList =
          exDocs.length > 0
            ? exDocs.map((ex) => ({
                id: ex.id,
                name: ex.name || ex.id,
                done: !!savedExercises[ex.id],
              }))
            : Object.keys(savedExercises).map((id) => ({
                id,
                name: id,
                done: !!savedExercises[id],
              }));

        items.push({
          workoutName: workout.name,
          workoutDb,
          week,
          day,
          exercises: exerciseList,
          notes: progData.notes || [],
        });
      }
      setCalendarDetails({ date: dateStr, items });
      setCalendarView(false);
    } catch (err) {
      console.error("handleCalendarDateSelect error:", err);
    }
  };

  const openCalendarItem = async (item) => {
    const workout = allPrograms.find((p) => p.dbName === item.workoutDb);
    if (!workout) return;
    setSelectedWorkout(workout);
    setSelectedWeek(item.week);
    setSelectedDay(item.day);
    setStarted(true);
    setNotesHistory(item.notes || []);
    setCompletedExercises(
      Object.fromEntries((item.exercises || []).map((e) => [e.id, !!e.done]))
    );
    await fetchExercises(workout, item.week, item.day);
    setCalendarDetails(null);
  };

  // ------------------- Render -------------------
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-50 via-white to-gray-100 relative">
      <div className="sticky top-0 z-40">
        <TopBar
          onCalendar={() => setCalendarView(true)}
          onNotifications={() => {}}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-35">
        {/* Workout Tab */}
        {activeTab === "workout" && (
          <>
            {/* Calendar View */}
            {calendarView && (
              <Calendar
                completedDays={calendarDates.reduce((acc, d) => {
                  acc[d] = true;
                  return acc;
                }, {})}
                onClose={() => setCalendarView(false)}
                onSelectDate={handleCalendarDateSelect}
              />
            )}

            {/* Calendar Details */}
            {calendarDetails && (
              <div className="bg-white rounded-2xl p-5 mt-5 shadow-lg">
                <div className="flex justify-start mb-2">
                  <button
                    onClick={() => {
                      setCalendarDetails(null);
                      setCalendarView(true);
                    }}
                    className="text-cyan-600 font-medium"
                  >
                    Back to Calendar
                  </button>
                </div>
                <div className="text-sm text-gray-600 font-medium mb-3">
                  Workout details — {calendarDetails.date}
                </div>

                {calendarDetails.items.length === 0 ? (
                  <p className="text-gray-500">
                    No workouts done on this date.
                  </p>
                ) : (
                  calendarDetails.items.map((item, idx) => (
                    <div
                      key={`${item.workoutDb}_${item.week}_${item.day}_${idx}`}
                      className="mb-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{item.workoutName}</h4>
                        <button
                          onClick={() => openCalendarItem(item)}
                          className="text-sm text-cyan-600 hover:underline"
                        >
                          Open workout
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        Week: {item.week}, Day: {item.day}
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-800">
                        {item.exercises.map((ex) => (
                          <li key={ex.id} className="mb-1">
                            {ex.name}
                            {ex.done ? (
                              <span className="ml-2 text-green-600">✓</span>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                      <div className="bg-gray-50 border rounded-lg p-3 text-sm text-gray-700 mt-2">
                        <strong>Notes</strong>
                        {item.notes.length === 0 ? (
                          <p className="text-gray-500 mt-1">No notes.</p>
                        ) : (
                          item.notes.map((n, i) => (
                            <p key={i} className="mt-1">
                              {n.note}{" "}
                              <span className="text-xs text-gray-400">
                                ({new Date(n.timestamp).toLocaleString()})
                              </span>
                            </p>
                          ))
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Main Dashboard / Workouts */}
            {!calendarView && !calendarDetails && (
              <>
                {/* Current Program Carousel */}
                {currentProgram && !selectedWorkout && (
                  <WorkoutCarousel
                    title="🔥 Ongoing Workout"
                    programs={[currentProgram]}
                    cardHighlight
                    onClickCard={(program) => {
                      setSelectedWorkout(program);
                      setSelectedWeek(null);
                      setSelectedDay(null);
                      fetchWeeks(program);
                      setStarted(true);
                    }}
                  />
                )}

                {/* Workout selection */}
                {!selectedWorkout && (
                  <>
                    <WorkoutCarousel
                      title="💪 Bodybuilding Workouts"
                      programs={bodybuilding}
                      onClickCard={(p) => setSelectedWorkout(p)}
                    />
                    <WorkoutCarousel
                      title="🔥 Fat Loss Programs"
                      programs={fatloss}
                      onClickCard={(p) => setSelectedWorkout(p)}
                    />
                    <WorkoutCarousel
                      title="🩺 Rehab Programs"
                      programs={rehab}
                      onClickCard={(p) => setSelectedWorkout(p)}
                    />
                  </>
                )}

                {/* Workout Info / Start */}
                {selectedWorkout && !started && (
                  <WorkoutInfo
                    workout={selectedWorkout}
                    onBack={() => setSelectedWorkout(null)}
                    onStart={async () => {
                      if (!userId) return;
                      try {
                        const today = format(new Date(), "yyyy-MM-dd");
                        await setDoc(
                          doc(db, "users", userId),
                          {
                            currentProgram: selectedWorkout.dbName,
                            programStartDate: programStartDate || today,
                          },
                          { merge: true }
                        );
                        setCurrentProgram(selectedWorkout);
                        setProgramStartDate(programStartDate || today);
                        await fetchWeeks(selectedWorkout);
                        setStarted(true);
                      } catch (err) {
                        console.error("onStart error:", err);
                      }
                    }}
                  />
                )}

                {/* Week Selector */}
                {selectedWorkout && started && !selectedWeek && (
                  <WeekSelector
                    weeks={weeks}
                    getWeekStatus={getWeekStatus}
                    onSelectWeek={(w) =>
                      fetchDays(selectedWorkout, w).then(() =>
                        setSelectedWeek(w)
                      )
                    }
                    onBack={() => {
                      setStarted(false);
                      setSelectedWeek(null);
                    }}
                    isProgramStarted={
                      !!(
                        currentProgram &&
                        selectedWorkout &&
                        currentProgram.dbName === selectedWorkout.dbName
                      )
                    }
                    goToDashboard={() => {
                      setSelectedWorkout(null);
                      setSelectedWeek(null);
                      setSelectedDay(null);
                      setStarted(false);
                    }}
                  />
                )}

                {/* Day Selector */}
                {selectedWeek && !selectedDay && (
                  <DaySelector
                    days={days}
                    completedDays={completedDays}
                    selectedWorkout={selectedWorkout}
                    selectedWeek={selectedWeek}
                    onSelectDay={(d) =>
                      fetchExercises(selectedWorkout, selectedWeek, d).then(
                        () => setSelectedDay(d)
                      )
                    }
                    onBack={() => setSelectedWeek(null)}
                  />
                )}

                {/* Exercises List */}
                {selectedDay && (
                  <ExercisesList
                    exercises={exercises}
                    completedExercises={completedExercises}
                    handleToggleExercise={handleToggleExercise}
                    handleToggleAll={handleToggleAll}
                    allCompleted={allCompleted}
                    noteInput={noteInput}
                    setNoteInput={setNoteInput}
                    notesHistory={notesHistory}
                    setNotesHistory={setNotesHistory}
                    savingNote={savingNote}
                    setSavingNote={setSavingNote}
                    handleSaveProgress={handleSaveProgress}
                    selectedWorkout={selectedWorkout}
                    selectedWeek={selectedWeek}
                    selectedDay={selectedDay}
                    completedDays={completedDays}
                    userId={userId}
                    db={db}
                    setSelectedDay={setSelectedDay}
                    setSelectedWeek={setSelectedWeek}
                    setStarted={setStarted}
                    setSelectedWorkout={setSelectedWorkout}
                  />
                )}
              </>
            )}
          </>
        )}

        {/* Diet Tab */}
        {activeTab === "diet" && <DietDashboard />}

        {/* Other Tabs */}
        {activeTab === "progress" && (
          <div className="text-center text-gray-500 mt-10">Progress Tab</div>
        )}
        {activeTab === "explore" && (
          <div className="text-center text-gray-500 mt-10">Explore Tab</div>
        )}
        {activeTab === "chat" && (
          <div className="text-center text-gray-500 mt-10">Chat Tab</div>
        )}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
