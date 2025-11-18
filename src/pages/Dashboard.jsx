// src/pages/Dashboard.jsx
import { useState, useEffect, useRef } from "react";
import { addDays, parseISO, format } from "date-fns";
import { getAuth } from "firebase/auth";
import { db } from "../services/firebase";
import { collection, doc, getDocs, getDoc, setDoc } from "firebase/firestore";
import ChatWindow from "../components/dashboard/ChatWindow";
import AdminInbox from "../admin/AdminInbox";
import UserInbox from "../components/dashboard/UserInbox";
import ExploreTab from "../components/explore/ExploreTab";
import { MessagesSquare } from "lucide-react";

import Calendar from "../components/dashboard/Calender";
import TopBar from "../components/dashboard/TopBar";
import BottomNav from "../components/dashboard/BottomNav";
import WorkoutCarousel from "../components/dashboard/WorkoutCarousel";
import WorkoutInfo from "../components/dashboard/WorkoutInfo";
import WeekSelector from "../components/dashboard/WeekSelector";
import DaySelector from "../components/dashboard/DaySelector";
import ExercisesList from "../components/dashboard/ExerciseList";
import { useSearchParams } from "react-router-dom";

import { bodybuilding, fatloss, rehab } from "../data/programs";
import DietDashboard from "../components/diet/DietDashboard";
import EditProfile from "../components/dashboard/EditProfile";
import ProgressTab from "../components/dashboard/ProgressTab";
import useDraggable from "../hooks/useDraggable";

export default function Dashboard() {
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
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "workout";
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    // Check if this is a new user
    const savedTab = localStorage.getItem("dashboardActiveTab");
    const isNewUser = !savedTab; // no saved tab means new user

    // Always default new users to "workout"
    if (isNewUser) return "workout";

    // For existing users, use saved tab but never start on "chat"
    return savedTab === "chat" ? "workout" : savedTab;
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [dailySummary, setDailySummary] = useState(null);
  const [userName, setFirstName] = useState("");
  // State to control chat window visibility
  const [isChatOpen, setIsChatOpen] = useState(false);
  const summaryInnerRef = useRef(null);

  const dragHandleRef = useRef(null);
  const [chatRef, pos] = useDraggable(
    { x: window.innerWidth - 100, y: window.innerHeight - 150 },
    dragHandleRef
  );

  useEffect(() => {
    localStorage.setItem("dashboardActiveTab", activeTab);
  }, [activeTab]);

  const auth = getAuth();
  const user = auth.currentUser;
  const userId = auth.currentUser?.uid; // current logged-in user
  const COACH_EMAIL = "coachvirat@gmail.com";
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

  // whenever activeTab changes
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  // ------------------- Fetch helpers -------------------
  const fetchCalendarDates = async () => {
    if (!userId) return;
    try {
      const progSnap = await getDocs(
        collection(db, "users", userId, "progress")
      );
      const mealSnap = await getDocs(collection(db, "users", userId, "meals"));

      const datesSet = new Set();

      // workouts (two ways: id prefix + stored date)
      progSnap.forEach((doc) => {
        datesSet.add(doc.id.split("_")[0]);
        if (doc.data()?.date) datesSet.add(doc.data().date);
      });

      // meals (doc.id is yyyy-mm-dd)
      mealSnap.forEach((doc) => {
        datesSet.add(doc.id); // doc.id is yyyy-MM-dd
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

  //Start workout
  const startWorkout = async (workout) => {
    if (!userId) return;
    try {
      const today = format(new Date(), "yyyy-MM-dd");

      // Save current program & start date under user's document
      await setDoc(
        doc(db, "users", userId),
        {
          currentProgram: workout.dbName,
          programStartDate: programStartDate || today,
        },
        { merge: true }
      );

      setCurrentProgram(workout);
      setProgramStartDate(programStartDate || today);
      await fetchWeeks(workout);
      setStarted(true);
    } catch (err) {
      console.error("startWorkout error:", err);
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

  const fetchDaySummary = async (dateKey) => {
    if (!userId) return;

    try {
      // --- Workout data ---
      const progRef = doc(db, "users", userId, "progress", dateKey);
      const progSnap = await getDoc(progRef);

      // --- Meal data ---
      const mealRef = doc(db, "users", userId, "meals", dateKey);
      const mealSnap = await getDoc(mealRef);

      setDailySummary({
        workouts: progSnap.exists() ? progSnap.data() : null,
        meals: mealSnap.exists() ? mealSnap.data() : null,
      });
    } catch (err) {
      console.error("Failed to fetch summary:", err);
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
          // Save firstName from onboarding
          setFirstName(data.onboarding?.firstName || "");
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

  // ----------------- fetch Username --------------

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

      // Use a fixed doc ID based on workout + week + day
      const progressDocId = `${selectedWorkout.dbName}_${selectedWeek}_${selectedDay}`;

      const emailKey = auth.currentUser?.email;
      const progressRef = doc(
        db,
        "users",
        userId, // ✅ uid
        "progress",
        progressDocId
      );

      await setDoc(
        progressRef,
        {
          exercises: completedExercises,
          notes: notesHistory,
          completed: Object.values(completedExercises).every((v) => v),
          date: dateStr,
        },
        { merge: true } // merge ensures we don't overwrite accidentally
      );

      setCompletedDays((prev) => ({
        ...prev,
        [progressDocId]: Object.values(completedExercises).every((v) => v),
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
      const items = [];

      // --- 1. Fetch workouts for the date ---
      const progSnap = await getDocs(
        collection(db, "users", userId, "progress")
      );
      const matchedWorkouts = progSnap.docs.filter(
        (d) => d.data()?.date === dateStr
      );

      for (const docItem of matchedWorkouts) {
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
          type: "workout",
          workoutName: workout.name,
          workoutDb,
          week,
          day,
          exercises: exerciseList,
          notes: progData.notes || [],
        });
      }

      // --- 2. Fetch meals for the date ---
      const userKey = auth.currentUser?.email;
      const mealRef = doc(db, "users", userId, "meals", dateStr);
      const mealSnap = await getDoc(mealRef);
      console.log("mealSnap exists?", mealSnap.exists());
      if (mealSnap.exists()) {
        const data = mealSnap.data();
        console.log("meal data:", data);
      }

      let meals = null;
      if (mealSnap.exists()) {
        const data = mealSnap.data();
        meals = {
          type: "diet",
          calories: data.consumedCalories || 0,
          macros: data.consumedMacros || { protein: "Not logged", carbs: "Not logged", fat: "Not logged" },
          dailyLimit: data.dailyLimit || 0,
          list: data.meals || [],
        };
      }

      // --- 3. Save combined details ---
      setCalendarDetails({ date: dateStr, workouts: items, meals });
      setCalendarView(false); // close calendar, open summary
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
    <div className="h-screen flex flex-col bg-gray-50 relative">
      <div className="sticky top-0 z-40">
        <TopBar
          onCalendar={() => setCalendarView(true)}
          onNotifications={() => {}}
          onProfileClick={() => setShowEditProfile(true)}
        />

        {showEditProfile && (
          <EditProfile
            db={db}
            userId={userId}
            onClose={() => setShowEditProfile(false)}
          />
        )}

        <div
          className="
    bg-white 
    text-[14px] md:text-[16px] 
    text-center 
    py-1.5 md:py-2 
    text-gray-700 
    font-semibold 
    shadow-sm 
    tracking-wide
  "
        >
          Welcome,&nbsp;
          <span className="text-cyan-700">
            {userName ||
              auth.currentUser?.displayName ||
              auth.currentUser?.email}
          </span>
        </div>
      </div>

      <div className="flex-1 lg:w-screen lg:h-screen max-h-[80vh] px-5 pb-15 py-0 relative overflow-auto">
        {!calendarView && !selectedDate && !calendarDetails && (
          <>
            {/* Workout Tab */}
            {activeTab === "workout" && (
              <div className="absolute lg:pb-[calc(env(safe-area-inset-bottom)+65px)] inset-0 overflow-y-auto lg:px-10 lg:py-0 px-5 md:px-0 pt-0 md:pb-[calc(env(safe-area-inset-bottom)+0px)] pb-[calc(env(safe-area-inset-bottom)+74px)]">
                <>
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
                            fetchExercises(
                              selectedWorkout,
                              selectedWeek,
                              d
                            ).then(() => setSelectedDay(d))
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
              </div>
            )}

            {/* Diet Tab */}
            {activeTab === "diet" && userId && (
              <div className="absolute inset-0 overflow-y-auto px-5 pt-1 pb-[calc(env(safe-area-inset-bottom)+60px)]">
                <DietDashboard userId={userId} />
              </div>
            )}

            {activeTab === "progress" && (
              <div className="absolute inset-0 overflow-y-auto px-5 pt-0 md:pb-[calc(env(safe-area-inset-bottom)+35px)] pb-[calc(env(safe-area-inset-bottom)+55px)]">
                <ProgressTab userId={userId} />
              </div>
            )}

            {activeTab === "explore" && (
              <div className="absolute inset-0 overflow-y-auto px-5 pt-0 md:pb-[calc(env(safe-area-inset-bottom)+60px)] pb-[calc(env(safe-area-inset-bottom)+74px)]">
                <ExploreTab />
              </div>
            )}
          </>
        )}
      </div>

      {calendarView && (
        <div className="fixed inset-0 z-60 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="relative p-5 w-full max-w-md max-h-[90vh] overflow-auto">
            <Calendar
              highlightedDates={calendarDates}
              onDateClick={(date) => {
                const dateKey = format(date, "yyyy-MM-dd");
                setSelectedDate(dateKey);
                fetchDaySummary(dateKey);
              }}
              completedDays={calendarDates.reduce((acc, d) => {
                acc[d] = true;
                return acc;
              }, {})}
              onClose={() => setCalendarView(false)}
              onSelectDate={handleCalendarDateSelect}
            />
          </div>
        </div>
      )}

      {selectedDate && dailySummary && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto my-8 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <h2 className="text-xl font-bold">Summary for {selectedDate}</h2>

              {/* Workout Section */}
              {dailySummary.workouts ? (
                <div>
                  <h3 className="font-semibold">Workout</h3>
                  <p>{dailySummary.workouts.name || "Workout logged"}</p>
                </div>
              ) : (
                <p className="text-gray-500">No workout logged</p>
              )}

              {/* Meals Section */}
              {dailySummary.meals ? (
                <div>
                  <h3 className="font-semibold">Meals</h3>
                  <p>
                    Calories: {dailySummary.meals.consumedCalories || 0} /{" "}
                    {dailySummary.meals.dailyLimit || 0}
                  </p>
                  <ul className="list-disc list-inside">
                    {dailySummary.meals.meals?.map((meal, idx) => (
                      <li key={idx}>
                        {meal.name} ({meal.unit}) - {meal.calories} cal
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500">No meals logged</p>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setSelectedDate(null)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Details */}
      {calendarDetails && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/30 backdrop-blur-sm p-4 md:p-8">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg mx-auto my-8 flex flex-col max-h-[75vh] overflow-hidden">
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 md:px-8 py-4 md:py-6 space-y-4">
              {/* Back button */}
              <div className="flex justify-start mb-2">
                <button
                  onClick={() => {
                    setCalendarDetails(null);
                    setCalendarView(true);
                  }}
                  className="text-cyan-600 font-medium text-sm md:text-base"
                >
                  Back to Calendar
                </button>
              </div>

              <div className="text-sm md:text-base text-gray-600 font-medium mb-3">
                Summary — {calendarDetails.date}
              </div>

              {/* Workouts */}
              {calendarDetails.workouts?.length > 0 ? (
                calendarDetails.workouts.map((item, idx) => (
                  <div
                    key={`${item.workoutDb}_${item.week}_${item.day}_${idx}`}
                    className="mb-4"
                  >
                    <h4 className="font-semibold text-base md:text-lg mb-1">
                      {item.workoutName}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-500 mb-1">
                      Week: {item.week}, Day: {item.day}
                    </p>
                    <ul className="list-disc list-inside text-sm md:text-base text-gray-800">
                      {item.exercises.map((ex) => (
                        <li key={ex.id} className="mb-1">
                          {ex.name}
                          {ex.done && (
                            <span className="ml-2 text-green-600">✓</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm md:text-base">
                  No workouts logged.
                </p>
              )}

              {/* Meals */}
              {calendarDetails.meals ? (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-4">
                  <h4 className="font-semibold text-lg md:text-xl mb-2">
                    🍽 Meals
                  </h4>

                  {/* Summary */}
                  <div className="p-3 bg-white rounded-lg shadow-sm space-y-1 text-sm md:text-base">
                    <p className="text-gray-700">
                      Daily Calories:{" "}
                      <span
                        className={
                          calendarDetails.meals.calories <=
                          (calendarDetails.meals.dailyLimit || 0)
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {Number(calendarDetails.meals.calories).toFixed(1)} /{" "}
          {Number(calendarDetails.meals.dailyLimit || 0).toFixed(1)} kcal
                      </span>
                    </p>
                    <p>
                      Protein: {Number(calendarDetails.meals.macros.protein || 0).toFixed(1)} g
                    </p>
                    <p>Carbs: {Number(calendarDetails.meals.macros.carbs || 0).toFixed(1)} g</p>
                    <p>Fats: {Number(calendarDetails.meals.macros.fat || 0).toFixed(1)} g</p>
                  </div>

                  {/* Meals List */}
                  {calendarDetails.meals.list.map((meal, i) => (
                    <div
                      key={i}
                      className="p-3 bg-white rounded-lg shadow-sm space-y-1 text-sm md:text-base"
                    >
                      <h5 className="font-medium text-gray-800">
                        Meal {i + 1} — {meal.calories} kcal
                      </h5>
                      {meal.items?.length > 0 ? (
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {meal.items.map((item, idx) => (
                            <li key={idx}>
                              {item.name} - {item.calories} cal (
                              {item.protein || 0}P/{item.carbs || 0}C/
                              {item.fat || 0}F) | {item.quantity} x {item.unit}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No items logged</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mt-4 text-sm md:text-base">
                  No meals logged.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 flex justify-end">
              <button
                onClick={() => {
                  setCalendarDetails(null);
                  setCalendarView(true);
                }}
                className="px-4 py-2 md:px-5 md:py-3 bg-blue-500 text-white rounded-lg text-sm md:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Floating Chat ---------- */}
      <div
        ref={chatRef}
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          zIndex: 50,
          touchAction: "none", // prevent page scrolling while dragging
        }}
      >
        {isChatOpen && (
          <div
  className={`${
    user?.email === COACH_EMAIL
      ? "w-[32rem] md:w-[40rem]" // 👈 Wider window for admin
      : "w-[20rem] md:w-[22rem]" // 👈 Normal width for user
  } h-96 md:h-[26rem] bg-white rounded-xl shadow-lg flex flex-col overflow-hidden mb-2 transition-all duration-300`}
>
            {/* DRAG HANDLE */}
            <div
              ref={dragHandleRef}
              className="bg-cyan-600 text-white px-4 md:px-6 py-2 md:py-3 flex justify-between items-center cursor-grab"
              onMouseDown={(e) => e.stopPropagation()} // stop drag from affecting inner scroll
            >
              <span className="text-sm md:text-lg font-medium">
                Ask the Coach
              </span>
              <button
                onClick={() => setIsChatOpen(false)}
                className="font-bold text-lg md:text-xl"
              >
                &times;
              </button>
            </div>

            {/* Chat content */}
            <div className="flex-1 overflow-y-auto">
              {!selectedChatUser ? (
                user?.email === COACH_EMAIL ? (
                  <AdminInbox
                    db={db}
                    coachId={user.email}
                    onSelectUser={setSelectedChatUser}
                  />
                ) : (
                  <UserInbox
                    db={db}
                    userId={user?.uid}
                    coachId={COACH_EMAIL}
                    onSelectUser={setSelectedChatUser}
                  />
                )
              ) : (
                <AdminChatWindow
                  db={db}
                  chatId={selectedChatUser.chatId}
                  senderId={user.uid}
                  user={selectedChatUser}
                  onBack={() => setSelectedChatUser(null)}
                />
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full 
             bg-gradient-to-r from-cyan-500 to-blue-500 
             text-white shadow-lg shadow-cyan-500/30 
             backdrop-blur-md hover:shadow-xl hover:scale-105 
             active:scale-95 transition-all duration-300 flex items-center justify-center"
        >
          <MessagesSquare className="w-6 h-6" />
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white shadow-md">
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
