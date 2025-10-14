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

  const handleDeleteWeight = async (dateId) => {
    try {
      const weightRef = doc(db, "users", userId, "progress_weightLogs", dateId);
      await deleteDoc(weightRef);
    } catch (err) {
      console.error("Error deleting weight:", err);
    }
  };

  const getFilteredData = (data, type) => {
    const now = new Date();
    let startDate = new Date();

    if (filter === "weekly") startDate.setDate(now.getDate() - 7);
    else if (filter === "monthly") startDate.setMonth(now.getMonth() - 1);
    else if (filter === "quarterly") startDate.setMonth(now.getMonth() - 3);

    const cleaned = data
      .filter((d) => {
        const entryDate = new Date(d.date);
        if (isNaN(entryDate)) return false;
        if (entryDate < startDate) return false;
        if (type === "calories")
          return d.consumedCalories > 0 || d.targetCalories > 0;
        if (type === "weight") return d.weight > 0;
        return true;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const unique = Object.values(
      cleaned.reduce((acc, curr) => {
        acc[new Date(curr.date).toDateString()] = curr;
        return acc;
      }, {})
    );

    return unique;
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
    "bg-white shadow-lg rounded-2xl p-4 md:p-6 hover:shadow-xl transition-shadow duration-300";
  const getChartWidth = (data) => Math.max(data.length * 60, 500);

  return (
    <div className="px-3 md:px-6 pt-4 pb-6 space-y-8 overflow-y-auto h-full">
      {/* Title */}
      <h1 className="text-lg md:text-xl font-bold text-gray-800">
        Progress Overview
      </h1>

      {/* Filter Buttons */}
      <div className="flex gap-2 md:gap-3 mb-4">
        {["weekly", "monthly", "quarterly"].map((f) => (
          <button
            key={f}
            className={`px-3 md:px-4 py-1 md:py-2 rounded-lg text-[12px] md:text-[13px] font-medium transition-colors ${
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
        <h2 className="text-md md:text-lg font-semibold mb-3 text-gray-800 text-center">
          Calories Intake
        </h2>
        {filteredCalories.length > 0 ? (
          <div className="overflow-x-auto">
            <div style={{ width: `${getChartWidth(filteredCalories)}px` }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={filteredCalories} barSize={16}>
                  <CartesianGrid vertical={false} stroke="none" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    height={40}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend verticalAlign="bottom" align="center" />
                  <Bar dataKey="targetCalories" name="Target" fill="#93c5fd" />
                  <Bar
                    dataKey="consumedCalories"
                    name="Consumed"
                    fill="#2563eb"
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
        <h2 className="text-md md:text-lg font-semibold mb-3 text-gray-800 text-center">
          Macros (g)
        </h2>
        {filteredCalories.length > 0 ? (
          <div className="overflow-x-auto">
            <div style={{ width: `${getChartWidth(filteredCalories)}px` }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={filteredCalories} barSize={16}>
                  <CartesianGrid vertical={false} stroke="none" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} height={40} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="carbs" name="Carbs" fill="#f87171" />
                  <Bar dataKey="protein" name="Protein" fill="#34d399" />
                  <Bar dataKey="fat" name="Fat" fill="#facc15" />
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
        <div className="flex flex-wrap justify-between mb-3 gap-2 md:gap-3">
          <h2 className="text-md md:text-lg font-semibold text-gray-800">
            Weight Logs
          </h2>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="date"
              className="border rounded px-2 md:px-3 py-1 text-sm"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <input
              type="number"
              placeholder="kg"
              className="border rounded px-2 md:px-3 py-1 w-16 text-sm"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
            />
            <button
              onClick={handleAddWeight}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Add
            </button>
            <button
              onClick={() => setShowLogPanel(!showLogPanel)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm"
            >
              {showLogPanel ? "Close Log" : "Open Log"}
            </button>
          </div>
        </div>

        {filteredWeightLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <div style={{ width: `${getChartWidth(filteredWeightLogs)}px` }}>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={filteredWeightLogs}>
                  <CartesianGrid vertical={false} stroke="none" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} height={40} />
                  <YAxis tick={{ fontSize: 12 }} domain={[40, 150]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#2563eb" }}
                  >
                    <LabelList dataKey="weight" position="top" fontSize={12} />
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
          <div className="mt-3 border-t pt-2 flex flex-col gap-2 max-h-64 overflow-y-auto">
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
