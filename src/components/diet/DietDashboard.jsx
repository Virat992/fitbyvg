// src/components/diet/DietDashboard.jsx
import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FaUtensils, FaFire, FaHourglassHalf } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

const mockFoodList = [
  { id: "1", name: "Chicken Breast", caloriesPer100g: 165 },
  { id: "2", name: "Rice", caloriesPer100g: 130 },
  { id: "3", name: "Broccoli", caloriesPer100g: 34 },
  { id: "4", name: "Egg", caloriesPer100g: 155 },
];

export default function DietDashboard() {
  const user = {
    physicalInfo: {
      weight: 70,
      height: 178,
      age: 25,
      gender: "male",
      activity: "moderate",
    },
  };

  const calculateDailyCalories = ({ weight, height, age, gender }) => {
    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
    const activityFactor = 1.55;
    return Math.round(bmr * activityFactor);
  };

  const dailyLimit = calculateDailyCalories(user.physicalInfo);

  const [meals, setMeals] = useState([]);
  const [addingMeal, setAddingMeal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [query, setQuery] = useState("");
  const [expandedMeals, setExpandedMeals] = useState({}); // ✅ store expanded state

  const toggleExpanded = (idx) => {
    setExpandedMeals((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

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

  const calorieData = {
    labels: ["Consumed", "Remaining"],
    datasets: [
      {
        data: [consumedCalories, remainingCalories],
        backgroundColor: ["#22c55e", "#d1d5db"],
        borderWidth: 0,
      },
    ],
  };

  // Cards data
  const cards = [
    {
      id: "calories",
      title: "Calories",
      content: (
        <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
          {/* Donut + Info stacked center */}
          <div className="flex items-center space-x-6">
            {/* Donut Chart */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <Doughnut
                data={{
                  labels: ["Consumed", "Remaining"],
                  datasets: [
                    {
                      data: [consumedCalories, remainingCalories],
                      backgroundColor: ["#e0f2fe", "#06b6d4"], // light cyan & cyan-600
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

              {/* Centered remaining calories */}
              <div className="absolute inset-0 grid place-items-center pointer-events-none text-center">
                <span className="text-md mt-12 font-bold text-gray-800">
                  {remainingCalories} kcal
                </span>
                <span className="text-[10px] mb-12 text-gray-500 mt-1">
                  Remaining
                </span>
              </div>
            </div>

            {/* Info panel */}
            <div className="flex flex-col space-y-1 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <FaUtensils className="text-gray-400" />
                <span>Meals: {meals.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaFire className="text-gray-400" />
                <span>Consumed: {consumedCalories} kcal</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaHourglassHalf className="text-gray-400" />
                <span>Daily Limit: {dailyLimit} kcal</span>
              </div>
            </div>
          </div>
        </div>
      ),
      bg: "bg-white shadow-lg", // add shadow to card
      style: { flexShrink: 0, width: "80%" }, // make next card partially visible
    },
    {
      id: "macros",
      title: "Macros",
      content: (
        <div className="w-full space-y-3 mt-2">
          {[
            { name: "Carbs", value: 150, color: "bg-yellow-400" },
            { name: "Protein", value: 100, color: "bg-red-400" },
            { name: "Fat", value: 50, color: "bg-blue-400" },
          ].map((macro) => (
            <div key={macro.name} className="space-y-1">
              <div className="flex justify-between text-white text-sm font-medium">
                <span>{macro.name}</span>
                <span>{macro.value} g</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/30">
                <div
                  className={`${macro.color} h-2 rounded-full shadow-md transition-all duration-500`}
                  style={{ width: `${(macro.value / 200) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ),
      bg: "bg-gradient-to-br from-purple-400 to-purple-600",
    },
  ];

  return (
    <div className="p-5 max-w-xl mx-auto space-y-6">
      {/* Top: Today + Adjust Info */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-gray-800">Today</h2>
        <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-3 py-1.5 rounded-xl shadow-lg text-sm">
          Adjust Info
        </button>
      </div>

      {/* Cards Carousel */}
      <div className="flex overflow-x-auto snap-x snap-mandatory space-x-4 scrollbar-hide">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`${card.bg} snap-start flex-shrink-0 w-full rounded-2xl shadow-lg p-5 flex flex-col items-center hover:scale-105 transform transition`}
          >
            <h3 className="text-white text-lg font-semibold mb-2">
              {card.title}
            </h3>
            {card.content}
          </div>
        ))}
      </div>

      {/* Add Meal Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setAddingMeal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition transform hover:scale-105"
        >
          Add Meal
        </button>
      </div>

      {/* Add Meal Modal */}
      {addingMeal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Add Meal
            </h3>
            <input
              type="text"
              placeholder="Search food..."
              className="w-full p-3 border border-gray-200 rounded-xl mb-4"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity in grams"
              className="w-full p-3 border border-gray-200 rounded-xl mb-4"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <div className="max-h-36 overflow-y-auto border border-gray-200 rounded-xl mb-4">
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
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-xl"
              >
                Add
              </button>
              <button
                onClick={() => setAddingMeal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meals List */}
      <div className="space-y-3 mt-4">
        {meals.map((meal, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md p-4 border border-gray-100"
          >
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
    </div>
  );
}
