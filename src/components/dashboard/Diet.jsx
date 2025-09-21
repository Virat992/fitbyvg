// src/components/dashboard/Diet.jsx
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function Diet() {
  const [meals, setMeals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMealItems, setCurrentMealItems] = useState([]);
  const [mealName, setMealName] = useState("");

  const [foodName, setFoodName] = useState("");
  const [foodQuantity, setFoodQuantity] = useState("");
  const [foodCalories, setFoodCalories] = useState("");

  const targetCalories = 2000; // default target
  const totalConsumed = meals.reduce(
    (acc, meal) =>
      acc + meal.items.reduce((sum, item) => sum + item.calories, 0),
    0
  );
  const remainingCalories = Math.max(targetCalories - totalConsumed, 0);

  const COLORS = ["#00C49F", "#FF8042"];
  const pieData = [
    { name: "Consumed", value: totalConsumed },
    { name: "Remaining", value: remainingCalories },
  ];

  // Add food item to current meal
  const addFoodItem = () => {
    if (!foodName || !foodCalories) return;
    setCurrentMealItems([
      ...currentMealItems,
      {
        name: foodName,
        quantity: foodQuantity || "1",
        calories: parseInt(foodCalories, 10),
      },
    ]);
    setFoodName("");
    setFoodQuantity("");
    setFoodCalories("");
  };

  // Save current meal to meals array
  const saveMeal = () => {
    if (!mealName || currentMealItems.length === 0) return;
    setMeals([...meals, { name: mealName, items: currentMealItems }]);
    setMealName("");
    setCurrentMealItems([]);
    setShowModal(false);
  };

  return (
    <div className="flex-1 flex flex-col p-4 gap-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Diet Tracker
      </h2>

      {/* Donut Chart */}
      <div className="relative w-full flex justify-center mb-4">
        <PieChart width={200} height={200}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            label
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-center">
          <p className="text-xs text-gray-500">Remaining</p>
          <p className="font-bold text-sm">{remainingCalories} kcal</p>
        </div>
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-center">
          <p className="text-xs text-gray-500">Consumed</p>
          <p className="font-bold text-sm">{totalConsumed} kcal</p>
        </div>
      </div>

      {/* Add Meal Button */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full py-3 bg-cyan-600 text-white font-medium rounded-lg shadow-md hover:bg-cyan-700 transition"
      >
        Add Meal
      </button>

      {/* Meals List */}
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {meals.map((meal, idx) => {
          const mealTotal = meal.items.reduce(
            (acc, item) => acc + item.calories,
            0
          );
          return (
            <div
              key={idx}
              className="flex justify-between px-3 py-2 border rounded-lg bg-gray-50"
            >
              <span>{meal.name}</span>
              <span>{mealTotal} kcal</span>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white w-full max-w-md rounded-xl p-5 max-h-[90vh] overflow-y-auto flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Add Meal</h3>

            <input
              type="text"
              placeholder="Meal Name"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-200"
            />

            {/* List of food items */}
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
              {currentMealItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between px-2 py-1 bg-gray-100 rounded"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{item.calories} kcal</span>
                </div>
              ))}
            </div>

            {/* Add Food Item */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Food Name"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="flex-1 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
              <input
                type="text"
                placeholder="Qty (g/no)"
                value={foodQuantity}
                onChange={(e) => setFoodQuantity(e.target.value)}
                className="w-20 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
              <input
                type="number"
                placeholder="Calories"
                value={foodCalories}
                onChange={(e) => setFoodCalories(e.target.value)}
                className="w-20 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
              <button
                onClick={addFoodItem}
                className="px-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
              >
                +
              </button>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveMeal}
                className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition"
              >
                Save Meal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
