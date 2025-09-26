export default function MealItem({ meal }) {
  const totalCalories = meal.items.reduce((sum, i) => sum + i.calories, 0);

  return (
    <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
      <h4 className="font-semibold mb-2">
        {meal.name} - {totalCalories} kcal
      </h4>
      <ul className="list-disc list-inside text-sm">
        {meal.items.map((item, idx) => (
          <li key={idx}>
            {item.name} - {item.quantity}g - {item.calories} kcal
          </li>
        ))}
      </ul>
    </div>
  );
}
