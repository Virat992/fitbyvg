import { useState, useEffect } from "react";
import { db } from "../services/firebase"; // adjust path if needed
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";

export default function FoodBuilder() {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [category, setCategory] = useState("General");
  const [unit, setUnit] = useState("100g");
  const [notes, setNotes] = useState("");
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [foodList, setFoodList] = useState([]);

  // Listen to food items in Firestore
  useEffect(() => {
    const foodsCol = collection(db, "foodItems");
    const unsub = onSnapshot(foodsCol, (snap) => {
      setFoodList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const resetForm = () => {
    setFoodName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setCategory("General");
    setUnit("100g");
    setNotes("");
    setEditingFoodId(null);
  };

  const handleAddOrUpdateFood = async (e) => {
    e.preventDefault();
    if (!foodName || !calories)
      return alert("Food name and calories are required");

    const foodId = foodName.toLowerCase().replace(/\s+/g, "-");

    try {
      const foodRef = doc(db, "foodItems", foodId);
      await setDoc(foodRef, {
        name: foodName,
        caloriesPerUnit: parseFloat(calories),
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
        category,
        unit,
        notes,
      });

      resetForm();
    } catch (err) {
      console.error(err);
      alert("Error saving food item: " + err.message);
    }
  };

  const handleEdit = (food) => {
    setFoodName(food.name);
    setCalories(food.caloriesPerUnit);
    setProtein(food.protein);
    setCarbs(food.carbs);
    setFat(food.fat);
    setCategory(food.category || "General");
    setUnit(food.unit || "100g");
    setNotes(food.notes || "");
    setEditingFoodId(food.id);
  };

  const handleDelete = async (foodId) => {
    if (!confirm("Are you sure you want to delete this food item?")) return;
    try {
      await deleteDoc(doc(db, "foodItems", foodId));
    } catch (err) {
      console.error(err);
      alert("Error deleting food item: " + err.message);
    }
  };

  return (
    <div className="w-full h-screen p-6 bg-gradient-to-b from-green-50 to-white flex gap-6 ">
      <div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">Food Builder</h1>
      </div>

      {/* Add / Edit Food Form */}
      <div className="bg-white p-4 rounded-lg shadow space-y-3 max-w-md">
        <h2 className="text-xl font-semibold">
          {editingFoodId ? "Edit Food" : "Add New Food"}
        </h2>
        <form onSubmit={handleAddOrUpdateFood} className="space-y-2">
          <input
            type="text"
            placeholder="Food Name"
            className="w-full border p-2 rounded"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Calories per Unit"
            className="w-full border p-2 rounded"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
          <input
            type="number"
            placeholder="Protein (g)"
            className="w-full border p-2 rounded"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
          <input
            type="number"
            placeholder="Carbs (g)"
            className="w-full border p-2 rounded"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
          />
          <input
            type="number"
            placeholder="Fat (g)"
            className="w-full border p-2 rounded"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
          />
          <input
            type="text"
            placeholder="Category (Breakfast, Lunch, Snack, etc.)"
            className="w-full border p-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="text"
            placeholder="Unit (e.g., 100g, 1 serving)"
            className="w-full border p-2 rounded"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
          <textarea
            placeholder="Optional Notes"
            className="w-full border p-2 rounded"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded"
          >
            {editingFoodId ? "Update Food" : "Add Food"}
          </button>
        </form>
      </div>

      {/* Food Items List */}
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2">Existing Foods</h2>
        {foodList.length === 0 ? (
          <p className="text-gray-500">No food items added yet.</p>
        ) : (
          <ul className="space-y-2">
            {foodList.map((food) => (
              <li
                key={food.id}
                className="flex justify-between items-center border p-2 rounded bg-white"
              >
                <div>
                  <p className="font-semibold">{food.name}</p>
                  <p className="text-sm text-gray-600">
                    {food.caloriesPerUnit} kcal / {food.unit} | P:{food.protein}
                    g C:{food.carbs}g F:{food.fat}g | {food.category}
                  </p>
                  {food.notes && (
                    <p className="text-xs text-gray-400">{food.notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-yellow-400 px-2 py-1 rounded text-white text-sm"
                    onClick={() => handleEdit(food)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 px-2 py-1 rounded text-white text-sm"
                    onClick={() => handleDelete(food.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
