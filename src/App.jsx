import { useEffect, useState } from "react";
import "./App.css";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export default function App() {
  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    }
    fetchData();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-4xl font-bold text-white">FitByVG 🚀</h1>
    </div>
  );
}
