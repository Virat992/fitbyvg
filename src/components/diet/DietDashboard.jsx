import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FaUtensils, FaFire, FaHourglassHalf } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { getAuth } from "firebase/auth";
import { FaSlidersH } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DietDashboard() {
  // ---------- Hooks (top level only) ----------
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState([]);
  const [addingMeal, setAddingMeal] = useState(false);
  const [adjustingInfo, setAdjustingInfo] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [query, setQuery] = useState("");
  const [expandedMeals, setExpandedMeals] = useState({});
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

  const mockFoodList = [
    { id: "1", name: "Chicken Breast", caloriesPer100g: 165 },
    { id: "2", name: "Rice", caloriesPer100g: 130 },
    { id: "3", name: "Broccoli", caloriesPer100g: 34 },
    { id: "4", name: "Egg", caloriesPer100g: 155 },
  ];

  // ---------- Fetch user ----------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setLoading(false);
          return;
        }

        const docRef = doc(db, "users", currentUser.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser(data);

          setEditInfo({
            age: data.onboarding?.physicalInfo?.age || 25,
            height: data.onboarding?.physicalInfo?.height || 170,
            weight: data.onboarding?.physicalInfo?.weight || 70,
            gender: data.onboarding?.physicalInfo?.gender || "male",
            physicalActivity:
              data.onboarding?.physicalInfo?.physicalActivity || "moderate",
          });

          setSelectedGoal(data.onboarding?.goals?.[0]?.id || "");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
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
  const consumedCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const remainingCalories = Math.max(dailyLimit - consumedCalories, 0);

  const filteredFood = mockFoodList.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  const addMealHandler = () => {
    if (!selectedFood) return;
    const calories = (selectedFood.caloriesPer100g * quantity) / 100;
    setMeals([...meals, { ...selectedFood, quantity, calories }]);
    setAddingMeal(false);
    setSelectedFood(null);
    setQuantity(100);
    setQuery("");
  };

  const toggleExpanded = (idx) => {
    setExpandedMeals((prev) => ({ ...prev, [idx]: !prev[idx] }));
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
              <Doughnut
                data={{
                  labels: ["Consumed", "Remaining"],
                  datasets: [
                    {
                      data: [consumedCalories, remainingCalories],
                      backgroundColor: ["#dbeafe", "#3b82f6"],
                      borderColor: ["#dbeafe", "#3b82f6"],
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  cutout: "70%",
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                  },
                }}
                className="w-full h-full"
              />
              <div className="absolute inset-0 grid place-items-center pointer-events-none text-center">
                <span className="text-sm mt-8 font-bold text-white">
                  {remainingCalories}
                </span>
                <span className="text-[8px] mt-0 mb-9 ml-1 text-white">
                  Remaining
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-1 text-xs text-white">
              <div className="flex items-center space-x-1">
                <FaUtensils className="text-white text-sm" />
                <span>
                  Meals: <span className="font-semibold">{meals.length}</span>
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
            {/* Protein */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <Doughnut
                data={{
                  labels: ["Consumed", "Remaining"],
                  datasets: [
                    {
                      data: [macros.protein, Math.max(200 - macros.protein, 0)],
                      backgroundColor: ["#34D399", "#D1FAE5"],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  cutout: "70%",
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                  },
                }}
                className="w-full h-full"
              />
              <div className="absolute inset-0 grid place-items-center text-xs font-bold text-white">
                {macros.protein}g
              </div>
              <div className="absolute bottom-[-1.25rem] w-full text-center text-white text-[10px]">
                Protein
              </div>
            </div>

            {/* Carbs */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <Doughnut
                data={{
                  labels: ["Consumed", "Remaining"],
                  datasets: [
                    {
                      data: [macros.carbs, Math.max(300 - macros.carbs, 0)],
                      backgroundColor: ["#3B82F6", "#BFDBFE"],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  cutout: "70%",
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                  },
                }}
                className="w-full h-full"
              />
              <div className="absolute inset-0 grid place-items-center text-xs font-bold text-white">
                {macros.carbs}g
              </div>
              <div className="absolute bottom-[-1.25rem] w-full text-center text-white text-[10px]">
                Carbs
              </div>
            </div>

            {/* Fat */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <Doughnut
                data={{
                  labels: ["Consumed", "Remaining"],
                  datasets: [
                    {
                      data: [macros.fat, Math.max(100 - macros.fat, 0)],
                      backgroundColor: ["#FACC15", "#FEF3C7"],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  cutout: "70%",
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                  },
                }}
                className="w-full h-full"
              />
              <div className="absolute inset-0 grid place-items-center text-xs font-bold text-white">
                {macros.fat}g
              </div>
              <div className="absolute bottom-[-1.25rem] w-full text-center text-white text-[10px]">
                Fat
              </div>
            </div>
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
      <div className="space-y-3 mt-4">
        {meals.map((meal, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-md p-4 border">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-800 text-lg">
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
                <p>Food: {meal.name}</p>
                <p>Quantity: {meal.quantity} g</p>
                <p>Calories/100g: {meal.caloriesPer100g} kcal</p>
              </div>
            )}
          </div>
        ))}
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
                onClick={() => setAdjustingInfo(false)}
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
            {/* Sticky Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-xl font-semibold text-gray-700">
                Adjust Macros
              </h3>
            </div>

            {/* Scrollable Inputs */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {["protein", "carbs", "fat"].map((macro) => (
                <div key={macro}>
                  <label className="block font-bold text-gray-600 mb-1 capitalize">
                    {macro} (grams)
                  </label>
                  <input
                    type="number"
                    value={tempMacros[macro]}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      const newMacros = { ...tempMacros, [macro]: val };

                      // Calculate total calories
                      const totalKcal =
                        newMacros.protein * 4 +
                        newMacros.carbs * 4 +
                        newMacros.fat * 9;

                      if (totalKcal <= dailyLimit) setTempMacros(newMacros);
                    }}
                    className="w-full p-2 border rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {macros[macro]}g
                  </p>
                </div>
              ))}

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

            {/* Sticky Footer Buttons */}
            <div className="p-4 border-t border-gray-200 flex justify-between flex-shrink-0">
              <button
                onClick={() => {
                  setMacros({ ...tempMacros });
                  setAdjustingMacros(false);
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 w-full max-w-md space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Add Meal
            </h3>

            <div>
              <label className="block font-bold text-gray-600 mb-1">
                Search Food
              </label>
              <input
                type="text"
                placeholder="Search food..."
                className="w-full p-3 border rounded-xl mb-4"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-bold text-gray-600 mb-1">
                Quantity (grams)
              </label>
              <input
                type="number"
                placeholder="Quantity in grams"
                className="w-full p-3 border rounded-xl mb-4"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <div className="max-h-36 overflow-y-auto border rounded-xl mb-4">
              {filteredFood.map((f) => (
                <div
                  key={f.id}
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                    selectedFood?.id === f.id ? "bg-gray-200" : ""
                  }`}
                  onClick={() => setSelectedFood(f)}
                >
                  {f.name} - {f.caloriesPer100g} kcal /100g
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={addMealHandler}
                className="bg-green-500 text-white px-4 py-2 rounded-xl"
              >
                Add
              </button>
              <button
                onClick={() => setAddingMeal(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
