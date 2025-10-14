// src/components/BottomNav.jsx
import { Dumbbell, PieChart, Globe, MessageSquare } from "lucide-react";
import { UtensilsCrossed } from "lucide-react";

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "workout", label: "Workout", icon: Dumbbell },
    { id: "diet", label: "Diet", icon: UtensilsCrossed },
    { id: "progress", label: "Progress", icon: PieChart },
    { id: "explore", label: "Explore", icon: Globe },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center py-2 sm:py-3 md:py-3 shadow-xl md:shadow-2xl rounded-t-2xl z-60">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`flex flex-col items-center text-[10px] sm:text-sm md:text-base ${
            activeTab === id ? "text-cyan-600 font-semibold" : "text-gray-500"
          }`}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mb-0.5" />
          <span className="mt-0.5">{label}</span>
        </button>
      ))}
    </div>
  );
}
