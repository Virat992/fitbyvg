import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import FoodSearchInput from "./FoodSearchInput";

export default function AddMealModal({ db, userId, setMeals, closeModal }) {
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const snap = await getDocs(collection(db, "foodItems"));
        setFoodItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching food items:", err);
      }
    };
    fetchFoodItems();
  }, [db]);

  const addItem = async (food, quantity) => {
    const calories = (food.caloriesPer100g / 100) * quantity;
    const dateStr = new Date().toISOString().split("T")[0];

    try {
      await addDoc(collection(db, "users", userId, "dietLogs"), {
        foodId: food.id,
        name: food.name,
        quantity,
        calories,
        date: dateStr,
        createdAt: serverTimestamp(),
      });

      setMeals((prev) => [
        ...prev,
        { ...food, quantity, calories, date: dateStr },
      ]);
    } catch (err) {
      console.error("Error adding meal:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-md space-y-4">
        <h3 className="font-semibold text-lg">Add Meal</h3>
        <FoodSearchInput foodList={foodItems} addItem={addItem} />
        <button
          onClick={closeModal}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}
