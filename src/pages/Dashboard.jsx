import { useState, useEffect } from "react";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import TopBar from "../components/dashboard/TopBar";
import BottomNav from "../components/dashboard/BottomNav";
import { getAuth } from "firebase/auth";
import WorkoutCarousel from "../components/dashboard/WorkoutCarousel";
import { db } from "../services/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

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
  const [calendarExercises, setCalendarExercises] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);

  const auth = getAuth();
  const userId = auth.currentUser.uid;

  const bodybuilding = [
    {
      name: "Bodybuilding Beginner",
      dbName: "Bodybuilding-beginner",
      img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1169&auto=format&fit=crop",
      description: "Intro strength training program for beginners.",
      shortDesc: "Learn the basics of strength training & muscle building.",
      phases: "3 Phases • 4 Weeks",
      experience: "Beginner",
      equipment: "Dumbbells, Mat",
      coach: "Virat, ACSM Certified Coach",
    },
    {
      name: "Bodybuilding Intermediate",
      dbName: "Bodybuilding-intermediate",
      img: "https://images.unsplash.com/photo-1692369608021-c722c4fc7088?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d29ya291dCUyMGd5bXxlbnwwfHwwfHx8MA%3D%3Dhttps://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1169&auto=format&fit=crop",
      description: "Intro strength training program for beginners.",
      shortDesc: "Learn the basics of strength training & muscle building.",
      phases: "3 Phases • 4 Weeks",
      experience: "Beginner",
      equipment: "Dumbbells, Mat",
      coach: "Virat, ACSM Certified Coach",
    },
    {
      name: "Bodybuilding Advance",
      dbName: "Bodybuilding-advance",
      img: "https://plus.unsplash.com/premium_photo-1674059549221-e2943b475f62?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Zml0bmVzc3xlbnwwfHwwfHx8MA%3D%3Dhttps://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1169&auto=format&fit=crop",
      description: "Intro strength training program for beginners.",
      shortDesc: "Learn the basics of strength training & muscle building.",
      phases: "3 Phases • 4 Weeks",
      experience: "Beginner",
      equipment: "Dumbbells, Mat",
      coach: "Virat, ACSM Certified Coach",
    },
  ];

  const fatloss = [
    {
      name: "Fat Loss Beginner",
      dbName: "Fatloss-beginner",
      img: "https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1594737626072-90f5c7a3c8be?q=80&w=1170&auto=format&fit=crop",
      description: "Kickstart your fat loss journey with easy routines.",
      shortDesc: "Calorie burning beginner friendly plan.",
      phases: "1 Phase • 8 Weeks",
      experience: "Beginner",
      equipment: "Bodyweight, Light Dumbbells",
      coach: "Virat, ACSM Certified Coach",
    },
    {
      name: "Fat Loss Intermediate",
      dbName: "Fatloss-intermediate",
      img: "https://plus.unsplash.com/premium_photo-1664910806127-d52cb0e0d091?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1170&auto=format&fit=crop",
      description: "Push your fat loss journey with moderate intensity.",
      shortDesc: "Intermediate cardio & strength hybrid plan.",
      phases: "2 Phases • 10 Weeks",
      experience: "Intermediate",
      equipment: "Dumbbells, Resistance Bands",
      coach: "Virat, ACSM Certified Coach",
    },
    {
      name: "Fat Loss Advanced",
      dbName: "Fatloss-advanced",
      img: "https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1616279963381-9759b6ac290e?q=80&w=1170&auto=format&fit=crop",
      description: "High intensity fat loss training program.",
      shortDesc: "Burn maximum fat with HIIT & strength mix.",
      phases: "3 Phases • 12 Weeks",
      experience: "Advanced",
      equipment: "Full Gym Setup",
      coach: "Virat, ACSM Certified Coach",
    },
  ];

  const rehab = [
    {
      name: "Shoulder Rehab",
      dbName: "Shoulder-rehab",
      img: "https://images.unsplash.com/photo-1600677396360-9c4e8e46e7d4?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1599058917212-d750089bc07b?q=80&w=1170&auto=format&fit=crop",
      description: "Rehabilitation program for shoulder recovery.",
      shortDesc: "Gentle exercises to strengthen & recover shoulders.",
      phases: "1 Phase • 6 Weeks",
      experience: "All Levels",
      equipment: "Resistance Bands",
      coach: "Virat, Rehab Specialist",
    },
    {
      name: "Knee Rehab",
      dbName: "Knee-rehab",
      img: "https://images.unsplash.com/photo-1649751361457-01d3a696c7e6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1598970434795-0c54fe7c0648?q=80&w=1170&auto=format&fit=crop",
      description: "Rehabilitation program for knee recovery.",
      shortDesc: "Supportive movements for knees post-injury.",
      phases: "1 Phase • 6 Weeks",
      experience: "All Levels",
      equipment: "Bodyweight, Bands",
      coach: "Virat, Rehab Specialist",
    },
    {
      name: "Lower Back Rehab",
      dbName: "Lowerback-rehab",
      img: "https://images.unsplash.com/photo-1701826510604-933d4f755d35?q=80&w=1097&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1584466977773-270f5b8ca1c3?q=80&w=1170&auto=format&fit=crop",
      description: "Rehabilitation program for lower back pain.",
      shortDesc: "Improve posture, strengthen core & lower back.",
      phases: "1 Phase • 6 Weeks",
      experience: "All Levels",
      equipment: "Mat, Bands",
      coach: "Virat, Rehab Specialist",
    },
  ];

  // --- Fetch Weeks ---
  const fetchWeeks = async (workout) => {
    const weeksCol = collection(
      db,
      "workoutTemplates",
      workout.dbName,
      "weeks"
    );
    const snap = await getDocs(weeksCol);

    const sortedWeeks = snap.docs
      .map((d) => d.id)
      .sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, ""), 10);
        const numB = parseInt(b.replace(/\D/g, ""), 10);
        return numA - numB;
      });
    setWeeks(sortedWeeks);

    // Fetch all progress for user
    const progressCol = collection(db, "users", userId, "progress");
    const progressSnap = await getDocs(progressCol);
    const progressData = {};
    progressSnap.docs.forEach((d) => {
      if (d.data().completed) {
        progressData[d.id] = true;
      }
    });
    setCompletedDays(progressData);
  };

  // --- Fetch Days ---
  const fetchDays = async (workout, weekId) => {
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

    // Fetch user progress for all days
    const progressCol = collection(db, "users", userId, "progress");
    const progressSnap = await getDocs(progressCol);
    const progressData = {};
    progressSnap.docs.forEach((d) => {
      if (d.data().completed) {
        progressData[d.id] = true;
      }
    });

    setDays(sortedDays);
    setCompletedDays(progressData);
  };

  // --- Fetch Exercises ---
  const fetchExercises = async (workout, weekId, dayId) => {
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
  };

  // --- Save Progress ---
  const saveProgress = async () => {
    if (!selectedWorkout || !selectedWeek || !selectedDay) return;
    const today = new Date().toISOString().split("T")[0];
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
        date: today,
        completed: allCompleted, // mark completed if all exercises done
      },
      { merge: true }
    );

    if (allCompleted) {
      setCompletedDays((prev) => ({
        ...prev,
        [`${selectedWorkout.dbName}_${selectedWeek}_${selectedDay}`]: true,
      }));
    }

    alert("Progress saved ✅");
    fetchCalendarDates(); // refresh calendar
  };

  // --- Save Note ---
  const saveNote = async () => {
    if (!noteInput.trim()) return;
    setSavingNote(true);
    try {
      const progressRef = doc(
        db,
        "users",
        userId,
        "progress",
        `${selectedWorkout.dbName}_${selectedWeek}_${selectedDay}`
      );

      const newNote = { note: noteInput, timestamp: new Date().toISOString() };

      await setDoc(
        progressRef,
        { exercises: completedExercises, notes: [newNote], completed: false },
        { merge: true }
      );

      await updateDoc(progressRef, { notes: arrayUnion(newNote) });

      setNotesHistory((prev) => [...prev, newNote]);
      setNoteInput("");
      fetchCalendarDates();
    } catch (err) {
      console.error("Error saving note:", err);
    } finally {
      setSavingNote(false);
    }
  };

  // --- Calendar fetch ---
  const fetchCalendarDates = async () => {
    const progressCol = collection(db, "users", userId, "progress");
    const snap = await getDocs(progressCol);
    const dates = snap.docs.map((d) => d.data().date).filter(Boolean);
    setCalendarDates(dates);
  };

  // --- Calendar click ---
  const handleDateClick = async (date) => {
    setSelectedDate(date);
    const progressCol = collection(db, "users", userId, "progress");
    const snap = await getDocs(progressCol);
    let exercisesList = [];
    let notesList = [];
    snap.docs.forEach((d) => {
      const data = d.data();
      if (data.date === date) {
        exercisesList.push({ workout: d.id, exercises: data.exercises || {} });
        notesList.push(...(data.notes || []));
      }
    });
    setCalendarExercises(exercisesList);
    setNotesHistory(notesList);
  };

  useEffect(() => {
    const fetchCurrentProgram = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();
          if (data.currentProgram) {
            const allPrograms = [...bodybuilding, ...fatloss, ...rehab];
            const program = allPrograms.find(
              (p) => p.dbName === data.currentProgram
            );

            if (program) {
              setCurrentProgram(program); // show on top

              // Fetch weeks and user progress for this program
              const weeksCol = collection(
                db,
                "workoutTemplates",
                program.dbName,
                "weeks"
              );
              const snapWeeks = await getDocs(weeksCol);
              const sortedWeeks = snapWeeks.docs
                .map((d) => d.id)
                .sort((a, b) => {
                  const numA = parseInt(a.replace(/\D/g, ""), 10);
                  const numB = parseInt(b.replace(/\D/g, ""), 10);
                  return numA - numB;
                });
              setWeeks(sortedWeeks);

              // Fetch all progress for this user for this program
              const progressCol = collection(db, "users", userId, "progress");
              const progressSnap = await getDocs(progressCol);
              const progressData = {};
              progressSnap.docs.forEach((d) => {
                if (d.data().completed) {
                  progressData[d.id] = true;
                }
              });
              setCompletedDays(progressData);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching current program:", err);
      }
    };

    fetchCurrentProgram();
    fetchCalendarDates(); // refresh calendar
  }, []);

  const handleToggleExercise = (id) => {
    const lockKey = `${selectedWorkout.dbName}_${selectedWeek}_${selectedDay}`;
    if (completedDays[lockKey]) return; // prevent toggling if already completed
    setCompletedExercises((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allCompleted = Object.values(completedExercises).every((v) => v);
  const handleToggleAll = () => {
    const lockKey = `${selectedWorkout.dbName}_${selectedWeek}_${selectedDay}`;
    if (completedDays[lockKey]) return; // prevent toggling if already completed

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

    // Construct keys for all days of the week
    const dayKeys = dayOrder.map(
      (day) => `${selectedWorkout.dbName}_${week}_${day}`
    );

    // Check if each day is completed either from Firestore or local state
    const allDone = dayKeys.every((key) => completedDays[key] === true);
    const anyDone = dayKeys.some((key) => completedDays[key] === true);

    if (allDone) return "completed"; // ✅ green
    if (anyDone) return "ongoing"; // 🔹 blue
    return "not-started"; // gray
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-50 via-white to-gray-100 relative">
      <div className="sticky top-0 z-40 bg-cyan-600">
        <TopBar
          onCalendar={() => setCalendarView(!calendarView)}
          onNotifications={() => {}}
          onProfile={() => {}}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-40">
        {/* --- Calendar View --- */}
        {calendarView && (
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-5">
            <h2 className="text-xl font-bold mb-3">Workout Calendar</h2>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {Array.from({ length: 30 }).map((_, i) => {
                const date = new Date();
                date.setDate(i + 1);
                const formattedDate = date.toISOString().split("T")[0];
                const done = calendarDates.includes(formattedDate);
                return (
                  <button
                    key={formattedDate}
                    onClick={() => handleDateClick(formattedDate)}
                    className={`py-2 rounded-lg text-sm font-semibold ${
                      done ? "bg-cyan-600 text-white" : "bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <div>
                <h3 className="font-semibold mb-2">
                  Exercises on {selectedDate}
                </h3>
                {calendarExercises.length === 0 ? (
                  <p className="text-gray-500">No workout done on this date.</p>
                ) : (
                  calendarExercises.map((c, idx) => (
                    <div key={idx} className="mb-3">
                      <p className="font-semibold">{c.workout}</p>
                      {Object.keys(c.exercises).map((exId) => (
                        <p key={exId}>
                          {exId} - {c.exercises[exId] ? "Done" : "Not Done"}
                        </p>
                      ))}
                    </div>
                  ))
                )}
                {notesHistory.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-semibold mb-1">Notes</h4>
                    <ul className="space-y-1">
                      {notesHistory.map((n, idx) => (
                        <li key={idx} className="text-sm text-gray-700">
                          {n.note} ({new Date(n.timestamp).toLocaleString()})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentProgram && !selectedWorkout && (
          <WorkoutCarousel
            title="🔥 Current Workout"
            programs={[currentProgram]}
            cardHighlight={true} // enable highlight
            onClickCard={(program) => {
              setSelectedWorkout(program);
              setSelectedWeek(null);
              setSelectedDay(null);

              if (currentProgram && currentProgram.dbName === program.dbName) {
                fetchWeeks(program);
                setStarted(true);
              } else {
                setStarted(false);
              }
            }}
          />
        )}

        {!calendarView && activeTab === "workout" && !selectedWorkout && (
          <>
            <WorkoutCarousel
              title="💪 Bodybuilding Workouts"
              programs={bodybuilding}
              onClickCard={(program) => {
                setSelectedWorkout(program);
                setStarted(false); // Always new, so show Program Info
              }}
            />
            <WorkoutCarousel
              title="🔥 Fat Loss Programs"
              programs={fatloss}
              onClickCard={(program) => {
                setSelectedWorkout(program);
                setStarted(false);
              }}
            />

            <WorkoutCarousel
              title="🩺 Rehab Programs"
              programs={rehab}
              onClickCard={(program) => {
                setSelectedWorkout(program);
                setStarted(false);
              }}
            />
          </>
        )}

        {/* Workout info before start */}
        {!calendarView && selectedWorkout && !started && (
          <div className="bg-white rounded-2xl shadow-lg p-5">
            {/* Back button */}
            <button
              className="flex items-center gap-2 text-cyan-600 font-medium mb-4"
              onClick={() => setSelectedWorkout(null)}
            >
              <FaArrowLeft className="text-sm" />
              <span>Back</span>
            </button>

            {/* Program Info */}
            <img
              src={selectedWorkout.img}
              alt={selectedWorkout.name}
              className="w-full h-60 object-cover rounded-2xl mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedWorkout.name}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              {selectedWorkout.phases}
            </p>

            {/* Start Program Button */}
            <button
              className="w-full py-3 bg-cyan-600 text-white font-bold rounded-2xl hover:bg-cyan-700 transition"
              onClick={async () => {
                try {
                  // save program as current in Firestore
                  const userRef = doc(db, "users", userId);
                  await setDoc(
                    userRef,
                    { currentProgram: selectedWorkout.dbName },
                    { merge: true }
                  );

                  // set state for UI
                  setCurrentProgram(selectedWorkout); // show "Current Workout" at top
                  await fetchWeeks(selectedWorkout); // load weeks
                  setStarted(true);
                } catch (err) {
                  console.error("Error starting program:", err);
                }
              }}
            >
              Start Program
            </button>
          </div>
        )}
        {/* Weeks */}
        {!calendarView && selectedWorkout && started && !selectedWeek && (
          <div className="bg-white mt-5 rounded-2xl shadow-lg p-5">
            <button
              onClick={() => {
                if (
                  currentProgram &&
                  currentProgram.dbName === selectedWorkout.dbName
                ) {
                  // If it's current program → back to Dashboard
                  setSelectedWorkout(null);
                  setSelectedWeek(null);
                  setSelectedDay(null);
                  setStarted(false);
                } else {
                  // If it's a new program not started yet → back to program info
                  setStarted(false);
                  setSelectedWeek(null);
                  setSelectedDay(null);
                }
              }}
              className="flex items-center gap-2 text-cyan-600 font-medium mb-4"
            >
              <FaArrowLeft className="text-sm" />
              <span>Back</span>
            </button>
            <h2 className="text-xl font-bold mb-3">Select a Week</h2>
            <div className="grid  grid-cols-2 gap-3">
              {weeks.map((week) => {
                const displayWeek = week.replace(/([a-zA-Z]+)(\d+)/, "$1 $2");
                const status = getWeekStatus(week);

                let bgClass = "bg-gray-100 hover:bg-cyan-100 text-gray-800"; // not-started
                if (status === "completed") bgClass = "bg-green-500 text-white"; // ✅ fully done
                if (status === "ongoing") bgClass = "bg-blue-200 text-blue-800"; // 🔹 partially done

                return (
                  <button
                    key={week}
                    onClick={() =>
                      fetchDays(selectedWorkout, week).then(() =>
                        setSelectedWeek(week)
                      )
                    }
                    className={`p-4 rounded-xl text-center font-semibold ${bgClass}`}
                  >
                    {displayWeek}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {/* Days */}
        {!calendarView && selectedWeek && !selectedDay && (
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <button
              className="flex items-center gap-2 text-cyan-600 font-medium mb-4"
              onClick={() => setSelectedWeek(null)}
            >
              <FaArrowLeft className="text-sm" /> Back
            </button>
            <h2 className="text-xl font-bold mb-3">Select a Day</h2>
            <div className="grid grid-cols-2 gap-3">
              {days.map((day) => {
                const dayKey = `${selectedWorkout.dbName}_${selectedWeek}_${day}`;
                const isCompleted = completedDays[dayKey];
                return (
                  <button
                    key={day}
                    onClick={() =>
                      fetchExercises(selectedWorkout, selectedWeek, day).then(
                        () => setSelectedDay(day)
                      )
                    }
                    className={`p-4 rounded-xl text-center font-semibold ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 hover:bg-cyan-100"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {/* Exercises + Notes */}
        {!calendarView && selectedDay && (
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <button
              className="flex cursor-pointer items-center gap-2 text-cyan-600 font-medium mb-4"
              onClick={() => setSelectedDay(null)}
            >
              <FaArrowLeft className="text-sm cursor-pointer" /> Back
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
                  <div className="w-full md:w-40 h-40 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={ex.imgurl}
                      alt={ex.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{ex.name}</h3>
                    <p className="text-sm text-gray-600">
                      {ex.sets} sets × {ex.reps}
                    </p>
                    <label className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={completedExercises[ex.id] || false}
                        onChange={() =>
                          !completedDays[
                            `${selectedWorkout.dbName}_${selectedWeek}_${selectedDay}`
                          ] && handleToggleExercise(ex.id)
                        }
                        className="mr-2"
                        disabled={
                          completedDays[
                            `${selectedWorkout.dbName}_${selectedWeek}_${selectedDay}`
                          ]
                        } // lock if completed
                      />
                      Mark Done
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Write a note about today's workout..."
                className="w-full border rounded-lg p-3 text-sm"
                rows={3}
              />
              <button
                onClick={saveNote}
                disabled={savingNote}
                className={`mt-2 py-2 cursor-pointer px-4 rounded-lg transition ${
                  savingNote
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-cyan-600 text-white hover:bg-cyan-700"
                }`}
              >
                {savingNote ? "Saving..." : "Save Note"}
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Notes History</h3>
              {notesHistory.length === 0 ? (
                <p className="text-sm text-gray-500">No notes yet.</p>
              ) : (
                <ul className="space-y-2">
                  {notesHistory.map((n, idx) => (
                    <li
                      key={idx}
                      className="border rounded-lg p-3 bg-gray-50 text-sm"
                    >
                      <p className="text-gray-700">{n.note}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(n.timestamp).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={allCompleted}
                onChange={handleToggleAll}
                disabled={
                  completedDays[
                    `${selectedWorkout.dbName}_${selectedWeek}_${selectedDay}`
                  ]
                } // lock if completed
              />
              <span className="font-semibold">Workout Completed</span>
            </div>

            <button
              onClick={saveProgress}
              disabled={
                completedDays[
                  `${selectedWorkout.dbName}_${selectedWeek}_${selectedDay}`
                ]
              }
              className={`w-full py-3 font-bold rounded-2xl transition ${
                completedDays[
                  `${selectedWorkout.dbName}_${selectedWeek}_${selectedDay}`
                ]
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-cyan-600 text-white hover:bg-cyan-700"
              }`}
            >
              Save Progress
            </button>
          </div>
        )}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
