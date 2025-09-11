import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import LandingPage from "./LandingPage";

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
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error.message);
      alert(error.message);
    }
  }

  return (
    <div className="w-full bg-white min-h-screen flex flex-col items-center ">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center relative px-4 w-full">
          <FaArrowLeft
            size={34}
            onClick={() => navigate(-1)}
            className="absolute left-8 cursor-pointer p-2 rounded-full 
             active:bg-gray-300 transition"
          />
          <p className="text-center text-[18px]">Log In</p>
        </div>
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-3xl  w-90 mt-6"
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
                 peer-focus:text-cyan-600
                 bg-white px-1"
            >
              Email
            </label>
          </div>

          {/* Password Field */}
          <div className="relative w-full mb-6">
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
                 peer-focus:text-cyan-600 
                 bg-white px-1"
            >
              Password
            </label>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={!email || !password}
            className=" active:bg-cyan-700  w-full bg-cyan-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition"
          >
            Log In
          </button>
        </form>
        <div className="flex flex-col mt-4 w-full items-center">
          <a className="font-bold text-cyan-600 text-[16px]" href="">
            Forgot password?
          </a>
          <p className="font-bold mt-7 text-[18px]">OR</p>
          <button className="mt-4 flex items-center justify-center gap-2 w-[80%] border border-transparent rounded-2xl py-2 px-6 shadow-[0_0_10px_rgba(0,0,0,0.20)] hover:shadow-lg transition">
            <FcGoogle size={20} />
            <span className="font-medium">Continue with Google</span>
          </button>

          {/* Facebook Button */}
          <button className="mt-4 flex items-center justify-center gap-2 w-[80%] border border-transparent rounded-2xl py-2 px-6 shadow-[0_0_10px_rgba(0,0,0,0.20)] hover:shadow-lg transition text-blue-600">
            <FaFacebook size={20} />
            <span className="font-medium">Continue with Facebook</span>
          </button>
          <p className="mt-4 text-[14px] font-bold text-gray-600">
            We will never post anything without your <br /> permission
          </p>
        </div>
      </div>
    </div>
  );
}
