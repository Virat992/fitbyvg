import { useState } from "react";

export default function FoodSearchInput({ foodList, addItem }) {
  const [query, setQuery] = useState("");
  const [quantity, setQuantity] = useState(100);

  const filtered = foodList.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleAdd = (food) => {
    addItem(food, quantity);
    setQuery("");
    setQuantity(100);
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Search food..."
        className="w-full p-2 border rounded"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <input
        type="number"
        min="1"
        className="w-full p-2 border rounded"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <div className="max-h-40 overflow-y-auto border rounded">
        {filtered.map((f) => (
          <div
            key={f.id}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleAdd(f)}
          >
            {f.name} - {f.caloriesPer100g} kcal / 100g
          </div>
        ))}
      </div>
    </div>
  );
}
