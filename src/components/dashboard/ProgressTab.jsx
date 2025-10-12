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

// ✅ Date formatter
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

  // ✅ Fetch calories data
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

  // ✅ Fetch weight logs
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

  // ✅ Add / update weight
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

  // ✅ Delete weight
  const handleDeleteWeight = async (dateId) => {
    try {
      const weightRef = doc(db, "users", userId, "progress_weightLogs", dateId);
      await deleteDoc(weightRef);
    } catch (err) {
      console.error("Error deleting weight:", err);
    }
  };

  // ✅ Filter data with cleanup (remove zeros, duplicates, sort)
  const getFilteredData = (data, type) => {
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

    // Clean and filter
    const cleaned = data
      .filter((d) => {
        const entryDate = new Date(d.date);
        if (isNaN(entryDate)) return false;
        if (entryDate < startDate) return false;

        if (type === "calories") {
          return (
            (d.consumedCalories && d.consumedCalories > 0) ||
            (d.targetCalories && d.targetCalories > 0)
          );
        } else if (type === "weight") {
          return d.weight && d.weight > 0;
        }
        return true;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Remove duplicate dates
    const uniqueByDate = cleaned.reduce((acc, curr) => {
      const key = new Date(curr.date).toDateString();
      acc[key] = curr;
      return acc;
    }, {});

    return Object.values(uniqueByDate);
  };

  const filteredCalories = getFilteredData(caloriesData, "calories").map(
    (d) => ({
      ...d,
      date: formatDate(d.date),
    })
  );
  const filteredWeightLogs = getFilteredData(weightLogs, "weight").map((d) => ({
    ...d,
    date: formatDate(d.date),
  }));

  const chartContainer =
    "bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300";
  const getChartWidth = (data) => Math.max(data.length * 60, 500);

  return (
    <div className="space-y-10 pt-5 pb-5 px-0">
      <h1 className="text-[18px] font-bold text-gray-800 mb-4 text-start">
        Progress Overview
      </h1>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6 justify-start">
        {["weekly", "monthly", "quarterly"].map((f) => (
          <button
            key={f}
            className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors duration-200 ${
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

      {/* Calories Chart */}
      <div className={chartContainer}>
        <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
          Calories Intake
        </h2>
        {filteredCalories.length > 0 ? (
          <div className="overflow-x-auto">
            <div style={{ width: `${getChartWidth(filteredCalories)}px` }}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={filteredCalories}>
                  <CartesianGrid vertical={false} stroke="none" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#374151" }}
                    tickLine={false}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#374151" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "none",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                    cursor={{ fill: "rgba(59,130,246,0.1)" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ marginTop: 15, paddingBottom: 10 }}
                  />
                  <defs>
                    <linearGradient
                      id="targetGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.8} />
                      <stop
                        offset="100%"
                        stopColor="#3b82f6"
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                    <linearGradient
                      id="consumedGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop
                        offset="100%"
                        stopColor="#1e40af"
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                  </defs>
                  <Bar
                    dataKey="targetCalories"
                    name="Target"
                    fill="url(#targetGradient)"
                    radius={[10, 10, 0, 0]}
                    stroke="none"
                  />
                  <Bar
                    dataKey="consumedCalories"
                    name="Consumed"
                    fill="url(#consumedGradient)"
                    radius={[10, 10, 0, 0]}
                    stroke="none"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No data for selected period.
          </p>
        )}
      </div>

      {/* Macros Chart */}
      <div className={chartContainer}>
        <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
          Macros (g)
        </h2>
        {filteredCalories.length > 0 ? (
          <div className="overflow-x-auto py-2">
            <div style={{ width: `${getChartWidth(filteredCalories)}px` }}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={filteredCalories}>
                  <CartesianGrid vertical={false} stroke="none" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#374151" }}
                    tickLine={false}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#374151" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "none",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                    cursor={{ fill: "rgba(59,130,246,0.1)" }}
                  />
                  <Bar
                    dataKey="carbs"
                    name="Carbs"
                    fill="#f87171"
                    radius={[10, 10, 0, 0]}
                    stroke="none"
                  />
                  <Bar
                    dataKey="protein"
                    name="Protein"
                    fill="#34d399"
                    radius={[10, 10, 0, 0]}
                    stroke="none"
                  />
                  <Bar
                    dataKey="fat"
                    name="Fat"
                    fill="#facc15"
                    radius={[10, 10, 0, 0]}
                    stroke="none"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No macro data for selected period.
          </p>
        )}
      </div>

      {/* Weight Chart */}
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
          <div className="overflow-x-auto">
            <div style={{ width: `${getChartWidth(filteredWeightLogs)}px` }}>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={filteredWeightLogs}>
                  <CartesianGrid vertical={false} stroke="none" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#374151" }}
                    tickLine={false}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#374151" }}
                    tickLine={false}
                    domain={[40, 150]}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "none",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                    cursor={{ stroke: "#3b82f6", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    name="Weight"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#2563eb", stroke: "none" }}
                    activeDot={{ r: 7, fill: "#1e40af", stroke: "none" }}
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
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No weight data for selected period.
          </p>
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
