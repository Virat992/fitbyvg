// components/dashboard/DietCard.jsx
import { useState } from "react";
import { Doughnut } from "react-chartjs-2";

export default function DietCard({
  meals = [],
  dailyLimit = 0,
  macros = {},
  consumedMacros = {},
}) {
  const [expanded, setExpanded] = useState(false);

  const consumedCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const remainingCalories = dailyLimit - consumedCalories;

  const remainingMacros = {
    protein: Math.max(macros.protein - (consumedMacros.protein || 0), 0),
    carbs: Math.max(macros.carbs - (consumedMacros.carbs || 0), 0),
    fat: Math.max(macros.fat - (consumedMacros.fat || 0), 0),
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl shadow-lg p-4">
      {/* Header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-semibold text-lg">Diet</h3>
        <span>{expanded ? "Collapse" : "Expand"}</span>
      </div>

      {/* Summary */}
      <div className="flex justify-between mt-2">
        <div>Daily Limit</div>
        <div>{dailyLimit} kcal</div>
      </div>
      <div className="flex justify-between mt-1">
        <div>Consumed</div>
        <div>{consumedCalories} kcal</div>
      </div>
      <div className="flex justify-between mt-1">
        <div>Remaining / Surplus</div>
        <div>
          {remainingCalories >= 0
            ? remainingCalories
            : `-${Math.abs(remainingCalories)}`}{" "}
          kcal
        </div>
      </div>

      {/* Expanded Meals & Macros */}
      {expanded && (
        <div className="mt-4 space-y-3">
          {/* Meals */}
          {meals.length === 0 ? (
            <p className="text-white/70">No meals logged for this date.</p>
          ) : (
            meals.map((meal) => (
              <div key={meal.id} className="bg-white/20 p-2 rounded-lg">
                <div className="flex justify-between">
                  <span>{meal.name}</span>
                  <span>{meal.calories} kcal</span>
                </div>
                <div className="text-xs mt-1 space-y-1">
                  {meal.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>
                        {item.quantity} × {item.name}
                      </span>
                      <span>{item.calories} kcal</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Macros */}
          <div className="flex justify-around mt-3">
            {["protein", "carbs", "fat"].map((macro) => {
              const consumed = consumedMacros[macro] || 0;
              const remaining = remainingMacros[macro] || 0;
              const chartColors =
                macro === "protein"
                  ? ["#34D399", "#D1FAE5"]
                  : macro === "carbs"
                  ? ["#3B82F6", "#BFDBFE"]
                  : ["#FACC15", "#FEF3C7"];

              return (
                <div key={macro} className="relative w-20 h-20 flex-shrink-0">
                  <Doughnut
                    data={{
                      labels: ["Consumed", "Remaining"],
                      datasets: [
                        {
                          data: [consumed, remaining],
                          backgroundColor: chartColors,
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      cutout: "70%",
                      plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                      },
                    }}
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 grid place-items-center text-center pointer-events-none">
                    <div className="text-xs mt-7 font-bold">{consumed}g</div>
                    <div className="text-[8px] mb-10">Consumed</div>
                  </div>
                  <div className="absolute bottom-[-1.25rem] w-full text-center text-white text-[10px]">
                    {macro.charAt(0).toUpperCase() + macro.slice(1)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
