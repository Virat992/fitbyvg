export default function MealsList({ meals }) {
  const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);

  return (
    <div className="bg-white rounded shadow p-4 mt-4">
      <h3 className="font-semibold mb-2">Meals Today</h3>
      {meals.length === 0 && (
        <p className="text-gray-500">No meals added yet.</p>
      )}
      <ul className="space-y-1">
        {meals.map((m, i) => (
          <li key={i} className="flex justify-between">
            <span>
              {m.name} ({m.quantity}g)
            </span>
            <span>{Math.round(m.calories)} kcal</span>
          </li>
        ))}
      </ul>
      {meals.length > 0 && (
        <div className="mt-2 font-semibold text-right">
          Total: {Math.round(totalCalories)} kcal
        </div>
      )}
    </div>
  );
}
