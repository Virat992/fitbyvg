import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";

export default function AddMealModal({ onClose, onSave }) {
  const [foodItems, setFoodItems] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mealItems, setMealItems] = useState([]);

  // Fetch food items from Firestore
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "foodItems"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFoodItems(items);
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };
    fetchFoodItems();
  }, []);

  // Add selected food to meal
  const addFoodToMeal = () => {
    if (!selectedFood || quantity <= 0) return;

    const multiplier = quantity;
    const itemWithQty = {
      ...selectedFood,
      quantity,
      unit: selectedFood.unit,
      calories: selectedFood.caloriesPerUnit * multiplier,
      protein: selectedFood.protein * multiplier,
      carbs: selectedFood.carbs * multiplier,
      fat: selectedFood.fat * multiplier,
    };

    setMealItems((prev) => [...prev, itemWithQty]);
    setSelectedFood(null);
    setQuantity(1);
  };

  // Allow Enter key to add food
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && selectedFood) {
      e.preventDefault();
      addFoodToMeal();
    }
  };

  // Save meal with totals
  const saveMeal = () => {
    if (mealItems.length === 0) return;

    const totalCalories = mealItems.reduce((sum, i) => sum + i.calories, 0);
    const totalProtein = mealItems.reduce((sum, i) => sum + i.protein, 0);
    const totalCarbs = mealItems.reduce((sum, i) => sum + i.carbs, 0);
    const totalFat = mealItems.reduce((sum, i) => sum + i.fat, 0);

    const meal = {
      items: mealItems,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
    };

    onSave({
      id: Date.now(),
      ...meal,
    });

    setMealItems([]);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 overflow-y-auto max-h-[90vh]"
        onKeyDown={handleKeyDown}
      >
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">
          Add Meal
        </h3>

        {/* Search */}
        <input
          type="text"
          placeholder="Search food..."
          className="w-full p-3 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          tabIndex={0}
        />

        {/* Food list */}
        <div className="max-h-40 sm:max-h-48 p-2 overflow-y-auto border rounded-xl mb-4">
          {foodItems
            .filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
            .map((f) => (
              <div
                key={f.id}
                tabIndex={0}
                className={`p-2 rounded-lg cursor-pointer transition-all duration-150 outline-none ${
                  selectedFood?.id === f.id
                    ? "bg-blue-100 border border-blue-400"
                    : "hover:bg-gray-100 focus:ring-2 focus:ring-blue-300"
                }`}
                onClick={() => setSelectedFood(f)}
                onKeyDown={(e) => e.key === "Enter" && setSelectedFood(f)}
              >
                {f.name} - {f.caloriesPerUnit} kcal ({f.unit})
              </div>
            ))}
        </div>

        {/* Quantity + Add */}
        {selectedFood && (
          <div className="mb-4">
            <label className="block font-bold text-gray-700 mb-1">
              Quantity ({selectedFood.unit})
            </label>
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              tabIndex={0}
            />
            <button
              onClick={addFoodToMeal}
              className="mt-3 w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
              tabIndex={0}
            >
              Add Item
            </button>
          </div>
        )}

        {/* Meal items */}
        <div className="bg-gray-50 rounded-xl p-3 mb-4">
          <h4 className="font-semibold mb-2 text-gray-700">Meal Items</h4>
          {mealItems.length === 0 ? (
            <p className="text-sm text-gray-500">No items added yet</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {mealItems.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center border-b border-gray-200 pb-1"
                >
                  <span>
                    {item.name} ({item.quantity} {item.unit})
                  </span>
                  <span className="font-medium text-gray-700">
                    {Math.round(item.calories)} kcal
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 focus:ring-2 focus:ring-gray-400 w-full sm:w-auto"
            tabIndex={0}
          >
            Cancel
          </button>
          <button
            onClick={saveMeal}
            className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-400 w-full sm:w-auto"
            tabIndex={0}
          >
            Save Meal
          </button>
        </div>
      </div>
    </div>
  );
}
