import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FaUtensils, FaFire, FaHourglassHalf } from "react-icons/fa";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { getAuth } from "firebase/auth";
import { FaSlidersH } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import AddMealModal from "./AddMealModal";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DietDashboard() {
  // ---------- Hooks (top level only) ----------
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState([]);
  const [adjustingInfo, setAdjustingInfo] = useState(false);
  const [query, setQuery] = useState("");
  const [expandedMeals, setExpandedMeals] = useState({});
  const [mealToEdit, setMealToEdit] = useState(null);
  const [editInfo, setEditInfo] = useState({
    age: 25,
    height: 170,
    weight: 70,
    gender: "male",
    physicalActivity: "moderate",
  });
  const [selectedGoal, setSelectedGoal] = useState("");
  const [dailyLimit, setDailyLimit] = useState(0);
  const [macros, setMacros] = useState({
    protein: 100,
    carbs: 150,
    fat: 50,
  });
  const [adjustingMacros, setAdjustingMacros] = useState(false);
  const [tempMacros, setTempMacros] = useState({ ...macros });
  const [foodItems, setFoodItems] = useState([]);
  const [addingMeal, setAddingMeal] = useState(false);
  const [currentFood, setCurrentFood] = useState(null);
  const [currentQty, setCurrentQty] = useState(100);
  const [mealItems, setMealItems] = useState([]);
  const [activeSegment, setActiveSegment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [initialLoad, setInitialLoad] = useState(true);
  const [mealsFetched, setMealsFetched] = useState(false);
  const [limitMacros, setLimitMacros] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [firstName, setFirstName] = useState("");

  const mockFoodList = [
    { id: "1", name: "Chicken Breast", caloriesPer100g: 165 },
    { id: "2", name: "Rice", caloriesPer100g: 130 },
    { id: "3", name: "Broccoli", caloriesPer100g: 34 },
    { id: "4", name: "Egg", caloriesPer100g: 155 },
  ];

  const consumedCalories = meals.reduce((sum, m) => sum + m.calories, 0);

  // Calculate consumed macros from meals
  const consumedMacros = meals.reduce(
    (acc, meal) => {
      meal.items.forEach((item) => {
        acc.protein += item.protein || 0;
        acc.carbs += item.carbs || 0;
        acc.fat += item.fat || 0;
      });
      return acc;
    },
    { protein: 0, carbs: 0, fat: 0 }
  );

  // ---------- Save meals when they change ----------
  useEffect(() => {
    const saveMeals = async () => {
      if (!user || !selectedDate || !mealsFetched) return; // skip first load

      try {
        const dateKey = selectedDate.toISOString().split("T")[0];
        const mealRef = doc(db, "users", user.email, "meals", dateKey);

        await setDoc(
          mealRef,
          {
            date: dateKey,
            meals,
            consumedCalories,
            consumedMacros,
            dailyLimit,
          },
          { merge: true }
        );
      } catch (err) {
        console.error("Failed to save meals:", err);
      }
    };

    saveMeals();
  }, [meals, user, selectedDate, consumedCalories, consumedMacros, dailyLimit]);

  // After meals are first fetched from Firebase
  useEffect(() => {
    if (meals.length) setInitialLoad(false);
  }, [meals]);

  // ---------- Fetch meal ----------
  useEffect(() => {
    if (!user || !selectedDate) return;

    const fetchMeals = async () => {
      try {
        const dateKey = selectedDate.toISOString().split("T")[0];
        const mealRef = doc(db, "users", user.email, "meals", dateKey);
        const mealSnap = await getDoc(mealRef);

        if (mealSnap.exists()) {
          const data = mealSnap.data();
          setMeals(data.meals || []);
          setDailyLimit(data.dailyLimit || 0);
          setLimitMacros(data.limitMacros || { protein: 0, carbs: 0, fat: 0 });
        } else {
          setMeals([]);
          setDailyLimit(0);
          setLimitMacros({ protein: 0, carbs: 0, fat: 0 });
        }
        setMealsFetched(true);
      } catch (err) {
        console.error("Failed to fetch meals:", err);
      }
    };

    fetchMeals();
  }, [user, selectedDate]);

  // ---------- Fetch user ----------
  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "users", currentUser.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setUser({ ...data, email: currentUser.email }); // keep email for saving

          // ✅ load global calorie goal & macros if available
          if (data.dailyLimit) {
            setDailyLimit(data.dailyLimit);
          } else {
            // fallback: calculate from physical info if no saved value
            const maintenance = calculateMaintenance(
              data.onboarding?.physicalInfo
            );
            setDailyLimit(maintenance);
          }

          if (data.limitMacros) {
            setMacros(data.limitMacros);
          }

          // meals are still daily, safe to keep here if you’re storing them
          setMeals(data.meals || []);

          // onboarding info
          setEditInfo({
            age: data.onboarding?.physicalInfo?.age || 25,
            height: data.onboarding?.physicalInfo?.height || 170,
            weight: data.onboarding?.physicalInfo?.weight || 70,
            gender: data.onboarding?.physicalInfo?.gender || "male",
            physicalActivity:
              data.onboarding?.physicalInfo?.physicalActivity || "moderate",
          });

          // goals
          setSelectedGoal(data.onboarding?.goals?.[0]?.id || "");

          // ✅ grab firstName from onboarding
          setFirstName(data.onboarding?.firstName || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const foodCol = collection(db, "foodItems"); // your Firestore collection name
        const foodSnapshot = await getDocs(foodCol);
        const foods = foodSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFoodItems(foods);
      } catch (error) {
        console.error("Failed to fetch food items:", error);
      }
    };

    fetchFoodItems();
  }, []);

  // ---------- Maintenance calculation ----------
  const calculateMaintenance = ({
    weight,
    height,
    age,
    gender,
    physicalActivity,
  }) => {
    const safeWeight = Number(weight) || 0;
    const safeHeight = Number(height) || 0;
    const safeAge = Number(age) || 0;

    const bmr =
      gender === "male"
        ? 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge + 5
        : 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge - 161;

    const activityFactorMap = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      "very-active": 1.9,
    };
    const activityFactor = activityFactorMap[physicalActivity] || 1.55;
    return Math.round(bmr * activityFactor);
  };

  // ---------- Calculate dailyLimit whenever info or goal changes ----------
  useEffect(() => {
    const maintenance = calculateMaintenance(editInfo);
    let limit = maintenance;

    if (selectedGoal === "lose-fat") limit -= 300;
    else if (selectedGoal === "gain-muscle") limit += 300;

    setDailyLimit(limit);
  }, [editInfo, selectedGoal]);

  const maintenance = calculateMaintenance(editInfo);

  const remainingCalories = Math.max(dailyLimit - consumedCalories, 0);

  const filteredFood = mockFoodList.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  const saveMealHandler = () => {
    if (mealItems.length === 0) return; // nothing to save

    // Calculate total calories for the meal
    const totalCalories = mealItems.reduce(
      (sum, item) => sum + item.calories,
      0
    );

    // Add all items as a single meal entry
    setMeals([
      ...meals,
      {
        id: Date.now(), // unique id
        name: mealItems.map((i) => i.name).join(", "),
        calories: totalCalories,
        items: mealItems,
      },
    ]);

    // Reset modal state
    setMealItems([]);
    setCurrentFood(null);
    setCurrentQty(100);
    setAddingMeal(false);
  };

  const toggleExpanded = (idx) => {
    setExpandedMeals((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Calculate remaining macros
  const remainingMacros = {
    protein: Math.max(macros.protein - consumedMacros.protein, 0),
    carbs: Math.max(macros.carbs - consumedMacros.carbs, 0),
    fat: Math.max(macros.fat - consumedMacros.fat, 0),
  };

  //Delete meal handler
  const handleDeleteMeal = async (mealId) => {
    if (!user || !selectedDate) return;

    try {
      // Remove the meal locally
      const updatedMeals = meals.filter((m) => m.id !== mealId);
      setMeals(updatedMeals);

      // Recalculate calories & macros
      const updatedCalories = updatedMeals.reduce(
        (sum, m) => sum + m.calories,
        0
      );
      const updatedMacros = updatedMeals.reduce(
        (acc, m) => {
          m.items.forEach((item) => {
            acc.protein += item.protein || 0;
            acc.carbs += item.carbs || 0;
            acc.fat += item.fat || 0;
          });
          return acc;
        },
        { protein: 0, carbs: 0, fat: 0 }
      );

      // Update Firestore
      const dateKey = selectedDate.toISOString().split("T")[0];
      const mealRef = doc(db, "users", user.email, "meals", dateKey);

      await setDoc(
        mealRef,
        {
          date: dateKey,
          meals: updatedMeals,
          consumedCalories: updatedCalories,
          consumedMacros: updatedMacros,
          dailyLimit,
        },
        { merge: true }
      );

      console.log("Meal deleted successfully!", updatedMeals);
    } catch (err) {
      console.error("Failed to delete meal:", err);
    }
  };

  const cards = [
    {
      id: "calories",
      content: (
        <div className="flex flex-col w-full h-full space-y-1 p-3">
          {/* Header */}
          <div className="w-full flex justify-between items-center mb-3">
            <h3 className="text-[18px] font-semibold text-white">Calories</h3>
            <button
              onClick={() => setAdjustingInfo(true)}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
            >
              <FaSlidersH className="text-cyan-600 w-3 h-3" />
            </button>
          </div>

          {/* Doughnut + Info */}
          <div className="flex items-center justify-around space-x-4">
            <div className="relative w-24 h-24 flex-shrink-0">
              {/* Calculate surplus */}
              {(() => {
                const remaining = dailyLimit - consumedCalories;
                const isSurplus = remaining < 0;
                const displayCalories = Math.abs(remaining);
                const chartLabels = isSurplus
                  ? ["Consumed", "Surplus"]
                  : ["Consumed", "Remaining"];
                const chartColors = isSurplus
                  ? ["#dbeafe", "#ef4444"]
                  : ["#dbeafe", "#3b82f6"];
                const chartData = isSurplus
                  ? [dailyLimit, consumedCalories - dailyLimit]
                  : [consumedCalories, remaining];

                return (
                  <>
                    <Doughnut
                      data={{
                        labels: chartLabels,
                        datasets: [
                          {
                            data: chartData,
                            backgroundColor: ["#34D399", "#D1FAE5"],
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        cutout: "70%",
                        plugins: {
                          legend: { display: false },
                          tooltip: { enabled: false },
                        },
                        onHover: (event, chartElements) => {
                          if (chartElements.length > 0) {
                            setActiveSegment(chartElements[0].index); // 0 = consumed, 1 = remaining
                          } else {
                            setActiveSegment(null);
                          }
                        },
                      }}
                      className="w-full h-full"
                    />

                    <div className="absolute inset-0 grid place-items-center pointer-events-none text-center">
                      <span className="text-sm mt-8 font-bold text-white">
                        {activeSegment === 0
                          ? chartData[0]
                          : activeSegment === 1
                          ? chartData[1]
                          : displayCalories}
                      </span>
                      <span className="text-[8px] mt-0 mb-9 ml-1 text-white">
                        {activeSegment === 0
                          ? "Consumed"
                          : activeSegment === 1
                          ? isSurplus
                            ? "Surplus"
                            : "Remaining"
                          : isSurplus
                          ? "Surplus"
                          : "Remaining"}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Info panel */}
            <div className="flex flex-col space-y-1 text-xs text-white">
              <div className="flex items-center space-x-1">
                <FaUtensils className="text-white text-sm" />
                <span>
                  Meals: <span className="font-semibold">0</span>
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <FaFire className="text-white text-sm" />
                <span>
                  Consumed:{" "}
                  <span className="font-semibold">{consumedCalories} kcal</span>
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <FaHourglassHalf className="text-white text-sm" />
                <span>
                  Daily Limit:{" "}
                  <span className="font-semibold">{dailyLimit} kcal</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
      bg: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg rounded-2xl",
    },

    {
      id: "macros",
      content: (
        <div className="flex flex-col w-full h-full space-y-3 p-3">
          {/* Header */}
          <div className="w-full flex justify-between items-center mb-0">
            <h3 className="text-[18px] font-semibold text-white">Macros</h3>
            <button
              onClick={() => setAdjustingMacros(true)}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
            >
              <FaSlidersH className="text-purple-700 w-3 h-3" />
            </button>
          </div>

          {/* Doughnuts */}
          <div className="flex justify-around items-center pb-6 py-4 space-x-3">
            {["protein", "carbs", "fat"].map((macro) => {
              const consumed = consumedMacros[macro];
              const remaining = remainingMacros[macro];
              const chartColors =
                macro === "protein"
                  ? ["#34D399", "#D1FAE5"]
                  : macro === "carbs"
                  ? ["#3B82F6", "#BFDBFE"]
                  : ["#FACC15", "#FEF3C7"];

              return (
                <div key={macro} className="relative w-20 h-20 flex-shrink-0">
                  <Doughnut
                    data={{
                      labels: ["Consumed", "Remaining"],
                      datasets: [
                        {
                          data: [consumed, remaining],
                          backgroundColor: chartColors,
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      cutout: "70%",
                      plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                      },
                      onHover: (event, chartElements) => {
                        if (chartElements.length > 0) {
                          setActiveSegment(chartElements[0].index);
                        } else {
                          setActiveSegment(null);
                        }
                      },
                    }}
                    className="w-full h-full"
                  />

                  {/* Center Text */}
                  <div className="absolute inset-0 grid place-items-center text-center pointer-events-none">
                    <div className="text-xs mt-7 font-bold text-white">
                      {activeSegment === 0
                        ? consumed
                        : activeSegment === 1
                        ? remaining
                        : remaining}
                      g
                    </div>
                    <div className="text-[8px] text-white mb-10">
                      {activeSegment === 0
                        ? "Consumed"
                        : activeSegment === 1
                        ? "Remaining"
                        : "Remaining"}
                    </div>
                  </div>

                  {/* Macro Label */}
                  <div className="absolute bottom-[-1.25rem] w-full text-center text-white text-[10px]">
                    {macro.charAt(0).toUpperCase() + macro.slice(1)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ),
      bg: "bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg rounded-2xl",
    },
  ];

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="py-4 max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[22px] font-bold text-gray-800">Today</h2>
      </div>

      {/* Cards */}
      <div className="flex overflow-x-auto snap-x snap-mandatory space-x-4 scrollbar-hide pb-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`${card.bg} snap-start flex-shrink-0 w-[100%]  rounded-2xl shadow-lg p-1 flex flex-col items-center`}
          >
            <h3 className="text-lg font-semibold mb-4">{card.title}</h3>
            {card.content}
          </div>
        ))}
      </div>

      {/* Add Meal Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setAddingMeal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition"
        >
          Add Meal
        </button>
      </div>

      {/* Meals List */}

      <div className="space-y-3 mt-4 max-h-50 overflow-y-auto">
        {meals.length === 0 ? (
          <div className="text-center text-gray-400 py-6">
            Log your first meal 🍽️
          </div>
        ) : (
          meals.map((meal, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-4 border"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800 text-md">
                  Meal {idx + 1} - {Math.round(meal.calories)} kcal
                </h4>
                <button
                  onClick={() => toggleExpanded(idx)}
                  className="text-sm text-cyan-600 hover:underline"
                >
                  {expandedMeals[idx] ? "Collapse" : "Expand"}
                </button>
              </div>
              {expandedMeals[idx] && (
                <div className="mt-2 text-gray-500 text-sm space-y-1">
                  {meal.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="truncate max-w-[70%]">
                        {item.quantity} × {item.name}
                      </span>
                      <span className="ml-2 flex-shrink-0">
                        {item.calories} kcal
                      </span>
                    </div>
                  ))}

                  {/* Action buttons */}
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => {
                        setMealToEdit(meal);
                        setAddingMeal(true);
                      }}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Adjust Info Modal */}
      {adjustingInfo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg w-full max-w-md max-h-[70vh] flex flex-col">
            {/* Sticky Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-xl font-semibold text-gray-700">
                Adjust Info
              </h3>
            </div>

            {/* Scrollable Inputs */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={editInfo.age}
                  onChange={(e) =>
                    setEditInfo({ ...editInfo, age: e.target.value })
                  }
                  placeholder="Age"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={editInfo.height}
                  onChange={(e) =>
                    setEditInfo({ ...editInfo, height: e.target.value })
                  }
                  placeholder="Height"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={editInfo.weight}
                  onChange={(e) =>
                    setEditInfo({ ...editInfo, weight: e.target.value })
                  }
                  placeholder="Weight"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  Gender
                </label>
                <select
                  value={editInfo.gender || ""}
                  onChange={(e) =>
                    setEditInfo({ ...editInfo, gender: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">-- Gender --</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  Activity Level
                </label>
                <select
                  value={editInfo.physicalActivity || ""}
                  onChange={(e) =>
                    setEditInfo({
                      ...editInfo,
                      physicalActivity: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">-- Activity Level --</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="very-active">Very Active</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  Goal
                </label>
                <select
                  value={selectedGoal || ""}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">-- Select Goal --</option>
                  {user?.onboarding?.goals?.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">
                  Set Daily Calories
                </label>
                <input
                  type="number"
                  value={dailyLimit === 0 ? "" : dailyLimit}
                  onChange={(e) =>
                    setDailyLimit(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="Daily Calories"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Maintenance & Adjusted Calories (Sticky above footer) */}
            <div className="p-4 border-t border-gray-200 flex flex-col space-y-1 flex-shrink-0">
              <p>
                Maintenance Calories:{" "}
                <span className="font-semibold">{maintenance}</span>
              </p>
              <p>
                Adjusted Daily Calories:{" "}
                <span className="font-semibold">{dailyLimit}</span>
              </p>
            </div>

            {/* Sticky Footer Buttons */}
            <div className="p-4 border-t border-gray-200 flex justify-between flex-shrink-0">
              <button
                onClick={async () => {
                  if (!user || !selectedDate) return;

                  const dateKey = selectedDate.toISOString().split("T")[0];
                  const mealRef = doc(
                    db,
                    "users",
                    user.email,
                    "meals",
                    dateKey
                  );

                  try {
                    // Save current dailyLimit and macros for this date
                    await setDoc(
                      doc(db, "users", user.email),
                      {
                        dailyLimit,
                        limitMacros: { ...macros },
                        updatedAt: new Date(),
                      },
                      { merge: true }
                    );
                    setAdjustingInfo(false);
                  } catch (err) {
                    console.error("Failed to save daily limit & macros:", err);
                  }
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>

              <button
                onClick={() => setAdjustingInfo(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Macros Modal */}
      {adjustingMacros && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg w-full max-w-md max-h-[70vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-xl font-semibold text-gray-700">
                Adjust Macros
              </h3>
            </div>

            {/* Inputs */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {["protein", "carbs", "fat"].map((macro) => (
                <div key={macro}>
                  <label className="block font-bold text-gray-600 mb-1">
                    {macro.charAt(0).toUpperCase() + macro.slice(1)} (g)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={tempMacros[macro]}
                    onChange={(e) => {
                      const value = Number(e.target.value) || 0;
                      const newMacros = { ...tempMacros, [macro]: value };
                      const totalCalories =
                        newMacros.protein * 4 +
                        newMacros.carbs * 4 +
                        newMacros.fat * 9;

                      // Only update if total calories <= dailyLimit
                      if (totalCalories <= dailyLimit) {
                        setTempMacros(newMacros);
                      } else {
                        // Optional: show a warning or just prevent exceeding
                        alert("Total calories exceed daily limit!");
                      }
                    }}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              ))}

              {/* Info */}
              <p className="text-sm text-gray-700 mt-2">
                Total calories from macros:{" "}
                {tempMacros.protein * 4 +
                  tempMacros.carbs * 4 +
                  tempMacros.fat * 9}{" "}
                kcal
              </p>
              <p className="text-xs text-gray-500">
                Cannot exceed Daily Calories: {dailyLimit} kcal
              </p>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 flex justify-between flex-shrink-0">
              <button
                onClick={async () => {
                  setMacros({ ...tempMacros });
                  setAdjustingMacros(false);

                  if (!user || !selectedDate) return;

                  const dateKey = selectedDate.toISOString().split("T")[0];
                  const mealRef = doc(
                    db,
                    "users",
                    user.email,
                    "meals",
                    dateKey
                  );

                  try {
                    await setDoc(
                      mealRef,
                      {
                        limitMacros: { ...tempMacros },
                        updatedAt: new Date(),
                      },
                      { merge: true }
                    );
                  } catch (err) {
                    console.error("Failed to save macros limit:", err);
                  }
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setTempMacros({ ...macros });
                  setAdjustingMacros(false);
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Meal Modal */}
      {addingMeal && (
        <AddMealModal
          mealToEdit={mealToEdit} // pass meal to modal (optional for prefilling)
          onClose={() => {
            setAddingMeal(false);
            setMealToEdit(null); // reset after closing
          }}
          onSave={(meal) => {
            if (mealToEdit) {
              // EDIT: replace the existing meal
              setMeals(
                meals.map((m) =>
                  m.id === mealToEdit.id ? { ...mealToEdit, ...meal } : m
                )
              );
            } else {
              // ADD: new meal
              setMeals([...meals, { ...meal, id: Date.now() }]);
            }
            setAddingMeal(false);
            setMealToEdit(null);
          }}
        />
      )}
    </div>
  );
}
