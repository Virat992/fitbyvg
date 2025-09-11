import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { FaArrowLeft } from "react-icons/fa";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    if (password !== rePassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed up:", userCredential.user);
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert(error.message);
    }
  }

  return (
    <div className="w-full bg-white min-h-screen flex flex-col items-center">
      <div className="flex flex-col items-center w-full">
        {/* Header */}
        <div className="flex items-center justify-center relative px-4 w-full ">
          <FaArrowLeft
            size={34}
            onClick={() => navigate("/")}
            className="absolute left-1 cursor-pointer p-2 rounded-full 
              active:bg-gray-300 transition"
          />
          <p className="text-center text-[18px] font-medium">Sign Up</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSignup}
          className="bg-white p-8 rounded-3xl w-90 mt-6"
        >
          {/* Email Field */}
          <div className="relative w-full mb-4">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="peer border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-cyan-600 focus:outline-none placeholder-transparent"
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-3 text-gray-500 transition-all 
                 peer-placeholder-shown:top-3 
                 peer-placeholder-shown:text-gray-400 
                 peer-placeholder-shown:text-base 
                 peer-focus:-top-2 
                 peer-focus:text-sm 
                 peer-focus:text-cyan-600 bg-white px-1"
            >
              Enter Email
            </label>
          </div>

          {/* Password Field */}
          <div className="relative w-full mb-4">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="peer border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-cyan-600 focus:outline-none placeholder-transparent"
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-3 text-gray-500 transition-all 
                 peer-placeholder-shown:top-3 
                 peer-placeholder-shown:text-gray-400 
                 peer-placeholder-shown:text-base 
                 peer-focus:-top-2 
                 peer-focus:text-sm 
                 peer-focus:text-cyan-600 bg-white px-1"
            >
              Enter Password
            </label>
          </div>

          {/* Re-enter Password Field */}
          <div className="relative w-full mb-6">
            <input
              type="password"
              id="rePassword"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              placeholder="Re-enter Password"
              className="peer border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-cyan-600 focus:outline-none placeholder-transparent"
            />
            <label
              htmlFor="rePassword"
              className="absolute left-3 top-3 text-gray-500 transition-all 
                 peer-placeholder-shown:top-3 
                 peer-placeholder-shown:text-gray-400 
                 peer-placeholder-shown:text-base 
                 peer-focus:-top-2 
                 peer-focus:text-sm 
                 peer-focus:text-cyan-600 bg-white px-1"
            >
              Re-enter Password
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={!email || !password || !rePassword}
            className=" active:bg-cyan-700  w-full bg-cyan-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
