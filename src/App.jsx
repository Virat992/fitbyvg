import { useEffect, useState } from "react";
import "./App.css";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export default function App() {
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-4xl font-bold text-white">FitByVG 🚀</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded text-white"
      >
        Logout
      </button>
    </div>
  );
}
