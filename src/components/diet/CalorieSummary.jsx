// src/components/diet/CalorieSummary.jsx
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function CaloriesSummary({ consumed, limit }) {
  const remaining = Math.max(limit - consumed, 0);

  const data = {
    labels: ["Consumed", "Remaining"],
    datasets: [
      {
        data: [consumed, remaining],
        backgroundColor: ["#16a34a", "#e5e7eb"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="w-64 mx-auto">
      <Doughnut data={data} />
      <div className="flex justify-between mt-2 text-sm text-gray-700">
        <span>Consumed: {Math.round(consumed)} kcal</span>
        <span>Remaining: {Math.round(remaining)} kcal</span>
      </div>
    </div>
  );
}
