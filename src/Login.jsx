import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in:", userCredential.user);
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error.message);
      alert(error.message);
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
      <form className="bg-white p-8 rounded-3xl shadow-2xl w-80">
        <h2 className="text-4xl font-sporty text-gray-900 mb-6 text-center">
          FitByVG 💪
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 p-3 mb-3 w-full rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-3 mb-4 w-full rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none"
        />
        <button className="w-full bg-gradient-to-r from-teal-400 to-orange-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition">
          Login
        </button>
      </form>
    </div>
  );
}
