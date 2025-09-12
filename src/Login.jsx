import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase"; // db = Firestore instance
import { doc, getDoc } from "firebase/firestore";
import { FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaSignInAlt } from "react-icons/fa";
import { FaRunning } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", reset: "" });
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle login
  async function handleLogin(e) {
    e.preventDefault();
    setErrors({ email: "", password: "", reset: "" });
    setShowResetSuccess(false);

    if (!email) {
      setErrors({ email: "Email is required", password: "", reset: "" });
      return;
    }
    if (!password) {
      setErrors({ email: "", password: "Password is required", reset: "" });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in:", userCredential.user);
      navigate("/dashboard");
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          setErrors({
            email: "Email is not registered",
            password: "",
            reset: "",
          });
          break;
        case "auth/wrong-password":
          setErrors({ email: "", password: "Incorrect password", reset: "" });
          setPassword(""); // clear password field
          break;
        case "auth/invalid-email":
          setErrors({ email: "Invalid email format", password: "", reset: "" });
          break;
        default:
          setErrors({
            email: "",
            password: "Email or Password is invalid.",
            reset: "",
          });
      }
    }
  }

  // Handle forgot password
  const handleForgotPassword = async () => {
    setErrors({ email: "", password: "", reset: "" });
    setShowResetSuccess(false);

    if (!email) {
      setErrors((prev) => ({
        ...prev,
        reset: "Please enter your registered email",
      }));
      return;
    }

    try {
      // Check if email exists in Firestore
      const docRef = doc(db, "users", email);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setErrors({ ...errors, reset: "Email is not registered" });
        return;
      }

      // Email exists, send password reset
      await sendPasswordResetEmail(auth, email);
      setShowResetSuccess(true);
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        setErrors({ ...errors, reset: "Invalid email format" });
      } else {
        setErrors({
          ...errors,
          reset: "Failed to send reset email. Try again.",
        });
      }
    }
  };
  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-4 bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      <div className="flex flex-col items-center w-full max-w-md mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-center relative px-4 w-full mb-4">
          <FaArrowLeft
            size={34}
            onClick={() => navigate(-1)}
            className="absolute left-1 cursor-pointer p-2 rounded-full hover:bg-gray-200 transition"
          />
          <p className="flex items-center gap-2 text-[20px] font-bold text-gray-800">
            Login
            <FaRunning className="text-cyan-600" />
          </p>
        </div>

        {/* Overlay message above email */}
        <div className="relative w-full max-w-md">
          {(errors.reset || showResetSuccess) && (
            <div className="absolute top-4 left-0 w-full text-center z-10">
              {errors.reset && (
                <p className="text-red-500 text-sm">{errors.reset}</p>
              )}
              {showResetSuccess && (
                <p className="text-green-600 text-sm">
                  Password reset email sent! Check your inbox.
                </p>
              )}
            </div>
          )}

          {/* Card Form */}
          <form
            onSubmit={handleLogin}
            className="bg-white shadow-md p-8 rounded-3xl w-full mt-3 space-y-7 relative"
          >
            {/* Email Field */}
            <div className="relative w-full">
              <label
                htmlFor="email"
                className="absolute -top-2 left-3 bg-white px-1 text-[12px] text-gray-500"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() =>
                  setErrors((prev) => ({ ...prev, email: "", reset: "" }))
                }
                placeholder="Your registered email"
                className={`border p-3 w-full rounded-xl focus:ring-2 focus:outline-none placeholder:text-sm ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-cyan-600"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative w-full">
              <label
                htmlFor="password"
                className="absolute -top-2 left-3 bg-white px-1 text-[12px] text-gray-500"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setErrors((prev) => ({ ...prev, password: "" }))}
                placeholder="Enter your password"
                className={`border placeholder:text-sm p-3 w-full rounded-xl focus:ring-2 focus:outline-none ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-cyan-600"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-cyan-600 text-white font-bold py-3 rounded-xl hover:bg-cyan-700 active:scale-95 transition"
            >
              Log In
            </button>

            {/* Forgot Password */}
            <p
              className="text-cyan-600 font-bold text-sm mt-2 cursor-pointer hover:underline text-center"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </p>
          </form>
        </div>

        {/* Social & Info in Card */}
        <div className="bg-white shadow-md rounded-3xl w-full mt-6 p-6 flex flex-col items-center">
          <p className="font-semibold text-gray-600 text-[16px]">OR</p>
          <button className="mt-4 flex items-center justify-center gap-2 w-full border border-gray-200 rounded-xl py-3 px-6 shadow-sm hover:shadow-md transition">
            <FcGoogle size={20} />
            <span className="font-medium">Continue with Google</span>
          </button>
          <button className="mt-4 flex items-center justify-center gap-2 w-full border border-gray-200 rounded-xl py-3 px-6 shadow-sm hover:shadow-md transition text-blue-600">
            <FaFacebook size={20} />
            <span className="font-medium">Continue with Facebook</span>
          </button>

          <p className="mt-4 text-[14px] text-gray-700">
            Don’t have an account?{" "}
            <span
              className="text-cyan-600 cursor-pointer font-semibold"
              onClick={() => navigate("/signup")}
            >
              SIGN UP
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
