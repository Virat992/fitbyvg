import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
  deleteDoc,
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
  LabelList,
} from "recharts";

// 🔹 Date formatter
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "short" });
  const year = d.getFullYear().toString().slice(-2);
  return `${day} ${month} ${year}`;
};

export default function ProgressTab({ userId }) {
  const [caloriesData, setCaloriesData] = useState([]);
  const [weightLogs, setWeightLogs] = useState([]);
  const [filter, setFilter] = useState("weekly");
  const [newWeight, setNewWeight] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showLogPanel, setShowLogPanel] = useState(false);

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

  // ---------------- Add / Update Weight ----------------
  const handleAddWeight = async () => {
    if (!newWeight || isNaN(newWeight)) return;
    try {
      const weightRef = doc(
        db,
        "users",
        userId,
        "progress_weightLogs",
        selectedDate
      );
      await setDoc(
        weightRef,
        { weight: Number(newWeight), date: selectedDate },
        { merge: true }
      );
      setNewWeight("");
    } catch (err) {
      console.error("Error adding weight:", err);
    }
  };

  // ---------------- Delete Weight ----------------
  const handleDeleteWeight = async (dateId) => {
    try {
      const weightRef = doc(db, "users", userId, "progress_weightLogs", dateId);
      await deleteDoc(weightRef);
    } catch (err) {
      console.error("Error deleting weight:", err);
    }
  };

  // ---------------- Data Filtering ----------------
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

  const filteredCalories = getFilteredData(caloriesData).map((d) => ({
    ...d,
    date: formatDate(d.date),
  }));
  const filteredWeightLogs = getFilteredData(weightLogs).map((d) => ({
    ...d,
    date: formatDate(d.date),
  }));

  const chartContainer =
    "bg-white shadow rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300";

  return (
    <div className="space-y-10 p-6">
      {/* ----------- PAGE TITLE ----------- */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Progress Overview
      </h1>

      {/* ---------------- Filter Buttons ---------------- */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        {["weekly", "monthly", "quarterly"].map((f) => (
          <button
            key={f}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              filter === f
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* -------- Calories Chart -------- */}
      <div className={chartContainer}>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Calories Intake
        </h2>
        {filteredCalories.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={filteredCalories}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#374151" }} />
              <YAxis tick={{ fontSize: 12, fill: "#374151" }} />
              <Tooltip cursor={{ fill: "#f3f4f6" }} />
              <Legend />
              <Bar
                dataKey="targetCalories"
                fill="#93c5fd"
                name="Target"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="consumedCalories"
                fill="#3b82f6"
                name="Consumed"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No data for selected period.</p>
        )}
      </div>

      {/* -------- Macros Chart -------- */}
      <div className={chartContainer}>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Macros (g)</h2>
        {filteredCalories.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={filteredCalories}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#374151" }} />
              <YAxis tick={{ fontSize: 12, fill: "#374151" }} />
              <Tooltip cursor={{ fill: "#f3f4f6" }} />
              <Legend />
              <Bar
                dataKey="carbs"
                fill="#f87171"
                name="Carbs"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="protein"
                fill="#34d399"
                name="Protein"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="fat"
                fill="#facc15"
                name="Fat"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No macro data for selected period.</p>
        )}
      </div>

      {/* -------- Weight Chart + Logging -------- */}
      <div className={chartContainer}>
        <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Weight Logs</h2>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="date"
              className="border rounded px-3 py-1 text-sm"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <input
              type="number"
              placeholder="kg"
              className="border rounded px-3 py-1 w-20 text-sm"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
            />
            <button
              onClick={handleAddWeight}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
            >
              Add
            </button>
            <button
              onClick={() => setShowLogPanel(!showLogPanel)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm"
            >
              {showLogPanel ? "Close Log" : "Open Log"}
            </button>
          </div>
        </div>

        {filteredWeightLogs.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={filteredWeightLogs}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#374151" }} />
              <YAxis
                tick={{ fontSize: 12, fill: "#374151" }}
                domain={[40, 150]} // fixed range
              />
              <Tooltip cursor={{ fill: "#f3f4f6" }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 5, fill: "#2563eb" }}
                activeDot={{ r: 6, fill: "#1e40af" }}
                name="Weight"
              >
                <LabelList
                  dataKey="weight"
                  position="top"
                  fontSize={12}
                  fill="#2563eb"
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No weight data for selected period.</p>
        )}

        {showLogPanel && (
          <div className="mt-4 border-t pt-3 flex flex-col gap-2 max-h-64 overflow-y-auto">
            {weightLogs
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((w) => (
                <div
                  key={w.id}
                  className="flex justify-between items-center bg-gray-50 px-3 py-1 rounded"
                >
                  <span className="text-gray-700 text-sm">
                    {formatDate(w.date)}: {w.weight}kg
                  </span>
                  <button
                    onClick={() => handleDeleteWeight(w.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
