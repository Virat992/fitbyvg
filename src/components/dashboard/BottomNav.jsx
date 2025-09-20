// src/components/BottomNav.jsx
import { Dumbbell, PieChart, Globe, MessageSquare } from "lucide-react";
import { UtensilsCrossed } from "lucide-react";

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "workout", label: "Workout", icon: Dumbbell },
    { id: "diet", label: "Diet", icon: UtensilsCrossed },
    { id: "progress", label: "Progress", icon: PieChart },
    { id: "explore", label: "Explore", icon: Globe },
    { id: "chat", label: "Chat", icon: MessageSquare },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center py-3 shadow-xl rounded-t-2xl">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`flex flex-col items-center text-sm ${
            activeTab === id ? "text-cyan-600 font-bold" : "text-gray-500"
          }`}
        >
          <Icon className="w-6 h-6 mb-1" />
          {label}
        </button>
      ))}
    </div>
  );
}
