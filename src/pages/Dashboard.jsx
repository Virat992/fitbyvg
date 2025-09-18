import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-cyan-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-cyan-700">Welcome, Anshde 👋</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {/* Calorie Tracking */}
      <section className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Calorie Tracking
        </h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-4xl font-bold text-cyan-600">1,450</p>
            <p className="text-gray-500">Calories Consumed</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-green-600">2,000</p>
            <p className="text-gray-500">Daily Goal</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 h-4 rounded-full mt-4">
          <div className="bg-cyan-600 h-4 rounded-full w-[70%]"></div>
        </div>
      </section>

      {/* Today's Exercise */}
      <section className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Today’s Exercise
        </h2>
        <ul className="space-y-3">
          <li className="flex justify-between">
            <span>🏃 Running</span>
            <span className="font-medium text-gray-600">30 mins</span>
          </li>
          <li className="flex justify-between">
            <span>🧘 Yoga</span>
            <span className="font-medium text-gray-600">20 mins</span>
          </li>
          <li className="flex justify-between">
            <span>🏋️ Strength Training</span>
            <span className="font-medium text-gray-600">40 mins</span>
          </li>
        </ul>
      </section>

      {/* Progress Overview */}
      <section className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Progress Overview
        </h2>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-cyan-600">68 kg</p>
            <p className="text-gray-500">Current Weight</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">65 kg</p>
            <p className="text-gray-500">Target Weight</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">80%</p>
            <p className="text-gray-500">Plan Completed</p>
          </div>
        </div>
      </section>
    </div>
  );
}
