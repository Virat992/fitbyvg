import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function ProgressTab({ userId }) {
  const [caloriesData, setCaloriesData] = useState([]);
  const [weightLogs, setWeightLogs] = useState([]);
  const [filter, setFilter] = useState("weekly"); // weekly, monthly, quarterly

  // ---------------- Debug userId ----------------
  useEffect(() => {
    console.log("🚀 userId:", userId);
  }, [userId]);

  // ---------------- Fetch Meals / Calories ----------------
  useEffect(() => {
    if (!userId) return;

    const mealsRef = collection(db, "users", userId, "meals");
    const unsub = onSnapshot(mealsRef, (snapshot) => {
      const allData = snapshot.docs.map((doc) => {
        const d = doc.data();
        let dateStr = "";
        if (d.date?.toDate)
          dateStr = d.date.toDate().toISOString().split("T")[0];
        else if (typeof d.date === "string") dateStr = d.date;
        return {
          date: dateStr,
          targetCalories: d.dailyLimit || 0,
          consumedCalories: d.consumedCalories || 0,
          carbs: d.consumedMacros?.carbs || 0,
          protein: d.consumedMacros?.protein || 0,
          fat: d.consumedMacros?.fat || 0,
        };
      });

      setCaloriesData(allData);
    });

    return () => unsub();
  }, [userId]);

  // ---------------- Weight Logs ----------------
  useEffect(() => {
    if (!userId) return;
    const ref = collection(db, "users", userId, "progress_weightLogs");
    const q = query(ref, orderBy("date", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => {
        const docData = d.data();
        let dateStr = "";
        if (docData.date?.toDate)
          dateStr = docData.date.toDate().toISOString().split("T")[0];
        else if (typeof docData.date === "string") dateStr = docData.date;
        return { id: d.id, ...docData, date: dateStr };
      });
      setWeightLogs(data);
    });
    return () => unsub();
  }, [userId]);

  // ---------------- Data Aggregation ----------------
  const getFilteredData = (data) => {
    const now = new Date();
    let startDate;

    switch (filter) {
      case "weekly":
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
        break;
      case "monthly":
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "quarterly":
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 3);
        break;
      default:
        startDate = new Date();
    }

    return data.filter((d) => new Date(d.date) >= startDate);
  };

  const filteredCalories = getFilteredData(caloriesData);
  const filteredWeightLogs = getFilteredData(weightLogs);

  return (
    <div className="space-y-10 p-6">
      {/* ---------------- Filter Buttons ---------------- */}
      <div className="flex space-x-4 mb-4">
        {["weekly", "monthly", "quarterly"].map((f) => (
          <button
            key={f}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === f
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* -------- Calories Chart -------- */}
      <div className="bg-white shadow rounded-2xl p-5">
        <h2 className="text-xl font-semibold mb-3">Calories Intake</h2>
        {filteredCalories.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={filteredCalories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="targetCalories"
                fill="#93c5fd"
                name="Target Calories"
              />
              <Bar
                dataKey="consumedCalories"
                fill="#3b82f6"
                name="Consumed Calories"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No data for selected period.</p>
        )}
      </div>

      {/* -------- Macros Chart -------- */}
      <div className="bg-white shadow rounded-2xl p-5">
        <h2 className="text-xl font-semibold mb-3">Macros (g)</h2>
        {filteredCalories.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={filteredCalories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="carbs" fill="#f87171" name="Carbs" />
              <Bar dataKey="protein" fill="#34d399" name="Protein" />
              <Bar dataKey="fat" fill="#facc15" name="Fat" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No macro data for selected period.</p>
        )}
      </div>

      {/* -------- Weight Chart -------- */}
      <div className="bg-white shadow rounded-2xl p-5">
        <h2 className="text-xl font-semibold mb-3">Weight Logs</h2>
        {filteredWeightLogs.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={filteredWeightLogs}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#3b82f6"
                name="Weight"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No weight data for selected period.</p>
        )}
      </div>
    </div>
  );
}
