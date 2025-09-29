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

    const multiplier = quantity; // assume "quantity" = number of units
    const itemWithQty = {
      ...selectedFood,
      quantity,
      unit: selectedFood.unit, // add this
      calories: selectedFood.caloriesPerUnit * multiplier,
      protein: selectedFood.protein * multiplier,
      carbs: selectedFood.carbs * multiplier,
      fat: selectedFood.fat * multiplier,
    };

    setMealItems([...mealItems, itemWithQty]);
    setSelectedFood(null);
    setQuantity(1);
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
      items: mealItems, // full array of foods in the meal
      calories: totalCalories,
    });

    setMealItems([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Add Meal</h3>

        {/* Search */}
        <input
          type="text"
          placeholder="Search food..."
          className="w-full p-3 border rounded-xl mb-4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Food list */}
        <div className="max-h-36 overflow-y-auto border rounded-xl mb-4">
          {foodItems
            .filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
            .map((f) => (
              <div
                key={f.id}
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  selectedFood?.id === f.id ? "bg-gray-200" : ""
                }`}
                onClick={() => setSelectedFood(f)}
              >
                {f.name} - {f.caloriesPerUnit} kcal ({f.unit})
              </div>
            ))}
        </div>

        {/* Quantity + Add */}
        {selectedFood && (
          <div className="mb-4">
            <label className="block font-bold text-gray-600 mb-1">
              Quantity ({selectedFood.unit})
            </label>
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-2 border rounded-lg"
            />
            <button
              onClick={addFoodToMeal}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg"
            >
              Add Item
            </button>
          </div>
        )}

        {/* Meal items */}
        <div className="bg-gray-100 rounded-lg p-3 mb-4">
          <h4 className="font-semibold mb-2">Meal Items</h4>
          {mealItems.length === 0 ? (
            <p className="text-sm text-gray-500">No items added yet</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {mealItems.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>
                    {item.name} ({item.quantity} {item.unit})
                  </span>
                  <span>{Math.round(item.calories)} kcal</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={saveMeal}
            className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600"
          >
            Save Meal
          </button>
        </div>
      </div>
    </div>
  );
}
