import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FaUtensils, FaFire, FaHourglassHalf } from "react-icons/fa";
import { doc, getDoc, collection, query, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import { getAuth } from "firebase/auth";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DietDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [meals, setMeals] = useState([]);
  const [addingMeal, setAddingMeal] = useState(false);
  const [adjustingInfo, setAdjustingInfo] = useState(false);

  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [query, setQuery] = useState("");
  const [expandedMeals, setExpandedMeals] = useState({});

  // Modal info state
  const [editInfo, setEditInfo] = useState({
    age: 25,
    height: 170,
    weight: 70,
    gender: "male",
    physicalActivity: "moderate",
  });
  const [selectedGoal, setSelectedGoal] = useState("");

  const mockFoodList = [
    { id: "1", name: "Chicken Breast", caloriesPer100g: 165 },
    { id: "2", name: "Rice", caloriesPer100g: 130 },
    { id: "3", name: "Broccoli", caloriesPer100g: 34 },
    { id: "4", name: "Egg", caloriesPer100g: 155 },
  ];

  // Fetch user from Firestore
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        console.log("Logged in user:", currentUser);

        if (!currentUser) {
          console.warn("No user is logged in");
          setLoading(false);
          return;
        }

        const uid = currentUser.uid;
        console.log("Fetching Firestore document for UID:", uid);

        const docRef = doc(db, "users", currentUser.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // Optional: log specific fields

          setUser(data);

          // Set info into modal state
          setEditInfo({
            age: data.onboarding?.physicalInfo?.age || 25,
            height: data.onboarding?.physicalInfo?.height || 170,
            weight: data.onboarding?.physicalInfo?.weight || 70,
            gender: data.onboarding?.physicalInfo?.gender || "male",
            physicalActivity:
              data.onboarding?.physicalInfo?.physicalActivity || "moderate",
          });

          setSelectedGoal(data.onboarding?.goals?.[0]?.id || "");
        } else {
          console.warn("User document does not exist in Firestore");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  // Maintenance calories calc
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

  // Adjust based on goal
  const maintenance = calculateMaintenance(editInfo);
  let dailyLimit = maintenance;
  if (selectedGoal === "lose-fat") {
    dailyLimit = maintenance - 300;
  } else if (selectedGoal === "gain-muscle") {
    dailyLimit = maintenance + 300;
  }

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
    setExpandedMeals((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const cards = [
    {
      id: "calories",
      title: "Calories",
      content: (
        <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
          <div className="flex items-center space-x-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <Doughnut
                data={{
                  labels: ["Consumed", "Remaining"],
                  datasets: [
                    {
                      data: [consumedCalories, remainingCalories],
                      backgroundColor: ["#e0f2fe", "#06b6d4"],
                      borderColor: ["#e0f2fe", "#06b6d4"],
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
                <span className="text-md mt-12 font-bold text-gray-800">
                  {remainingCalories} kcal
                </span>
                <span className="text-[10px] mb-12 text-gray-500 mt-1">
                  Remaining
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-1 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <FaUtensils className="text-gray-400 text-sm" />
                <span>
                  Meals: <span className="font-semibold">{meals.length}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FaFire className="text-gray-400 text-sm" />
                <span>
                  Consumed:{" "}
                  <span className="font-semibold">{consumedCalories} kcal</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FaHourglassHalf className="text-gray-400 text-sm" />
                <span>
                  Daily Limit:{" "}
                  <span className="font-semibold">{dailyLimit} kcal</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
      bg: "bg-white shadow-lg",
    },
  ];

  return (
    <div className="py-4 max-w-xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[22px] font-bold text-gray-800">Today</h2>
        <button
          onClick={() => setAdjustingInfo(true)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-3 py-1.5 rounded-xl shadow-lg text-sm"
        >
          Adjust Info
        </button>
      </div>

      {/* Cards */}
      <div className="flex overflow-x-auto snap-x snap-mandatory space-x-4 scrollbar-hide pb-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`${card.bg} snap-start flex-shrink-0 w-[85%] rounded-2xl shadow-lg p-5 flex flex-col items-center`}
          >
            <h3 className="text-lg font-semibold mb-4">{card.title}</h3>
            {card.content}
          </div>
        ))}
      </div>

      {/* Add Meal */}
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-96 space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Adjust Info
            </h3>
            <div className="space-y-3">
              <input
                type="number"
                value={editInfo.age}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, age: e.target.value })
                }
                placeholder="Age"
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                value={editInfo.height}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, height: e.target.value })
                }
                placeholder="Height (cm)"
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                value={editInfo.weight}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, weight: e.target.value })
                }
                placeholder="Weight (kg)"
                className="w-full p-2 border rounded-lg"
              />
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
              <select
                value={editInfo.physicalActivity || ""}
                onChange={(e) =>
                  setEditInfo({ ...editInfo, physicalActivity: e.target.value })
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

            <div className="mt-4 text-gray-700 text-sm">
              <p>
                Maintenance Calories:{" "}
                <span className="font-semibold">{maintenance}</span>
              </p>
              <p>
                Adjusted Daily Calories:{" "}
                <span className="font-semibold">{dailyLimit}</span>
              </p>
            </div>

            <div className="flex justify-between mt-4">
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

      {/* Add Meal Modal */}
      {addingMeal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Add Meal
            </h3>
            <input
              type="text"
              placeholder="Search food..."
              className="w-full p-3 border rounded-xl mb-4"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity in grams"
              className="w-full p-3 border rounded-xl mb-4"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
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
