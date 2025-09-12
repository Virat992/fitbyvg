import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { FaArrowLeft } from "react-icons/fa";
import { FaDumbbell } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { setDoc, doc } from "firebase/firestore";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    rePassword: "",
    terms: "",
  });
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [typingPasswordTimeout, setTypingPasswordTimeout] = useState(null);

  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Debounced password validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (typingPasswordTimeout) clearTimeout(typingPasswordTimeout);

    setTypingPasswordTimeout(
      setTimeout(() => {
        setErrors((prev) => ({
          ...prev,
          password:
            value.length > 0 && value.length < 6
              ? "Password must be at least 6 characters"
              : "", // clear error if valid or empty
        }));
      }, 500) // 500ms after user stops typing
    );
  };

  // Debounced rePassword validation
  const handleRePasswordChange = (e) => {
    const value = e.target.value;
    setRePassword(value);

    if (typingTimeout) clearTimeout(typingTimeout);

    setTypingTimeout(
      setTimeout(() => {
        setErrors((prev) => ({
          ...prev,
          rePassword:
            value === ""
              ? "" // clear error if empty
              : value === password
              ? ""
              : "Passwords do not match",
        }));
      }, 500)
    );
  };

  async function handleSignup(e) {
    e.preventDefault();

    // Reset all errors
    setErrors({ email: "", password: "", rePassword: "", terms: "" });

    // 1️⃣ Email validation
    if (!email) {
      setErrors({
        email: "Email is required",
        password: "",
        rePassword: "",
        terms: "",
      });
      return;
    }
    if (!validateEmail(email)) {
      setErrors({
        email: "Enter a valid email",
        password: "",
        rePassword: "",
        terms: "",
      });
      return;
    }

    // 2️⃣ Password validation
    if (!password) {
      setErrors({
        email: "",
        password: "Password is required",
        rePassword: "",
        terms: "",
      });
      return;
    }
    if (password.length < 6) {
      setErrors({
        email: "",
        password: "Password must be at least 6 characters",
        rePassword: "",
        terms: "",
      });
      return;
    }

    // 3️⃣ Re-enter password validation
    if (!rePassword) {
      setErrors({
        email: "",
        password: "",
        rePassword: "Please confirm your password",
        terms: "",
      });
      return;
    }
    if (password !== rePassword) {
      setErrors({
        email: "",
        password: "",
        rePassword: "Passwords do not match",
        terms: "",
      });
      return;
    }

    // 4️⃣ Terms checkbox validation
    if (!acceptedTerms) {
      setErrors({
        email: "",
        password: "",
        rePassword: "",
        terms: "You must accept the terms",
      });
      return;
    }

    // ✅ All validations passed, create user
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", email), {
        createdAt: new Date(),
      });
      navigate("/"); // Redirect to landing page after signup
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setErrors({
          email: "Email already registered",
          password: "",
          rePassword: "",
          terms: "",
        });
        setPassword(""); // Clear password fields
        setRePassword("");
      } else {
        setErrors({
          email: err.message,
          password: "",
          rePassword: "",
          terms: "",
        });
      }
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-4 bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      <div className="flex flex-col items-center w-full max-w-md mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-center relative px-4 w-full mb-4">
          <FaArrowLeft
            size={34}
            onClick={() => navigate("/")}
            className="absolute left-1 cursor-pointer p-2 rounded-full hover:bg-gray-200 transition"
          />
          <p className="flex items-center gap-2 text-center text-[20px] font-bold text-gray-800">
            <span>Sign Up</span>
            <FaDumbbell className="text-cyan-600" />
          </p>
        </div>

        {/* Card Form */}
        <form
          onSubmit={handleSignup}
          className="bg-white shadow-md p-8 rounded-3xl w-full space-y-6"
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
              onFocus={() => setErrors((prev) => ({ ...prev, email: "" }))}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="ex: jon.smith@email.com"
              className={`border placeholder:text-sm p-3 w-full rounded-xl focus:ring-2 focus:outline-none ${
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
              onFocus={() => setErrors((prev) => ({ ...prev, password: "" }))}
              onChange={handlePasswordChange}
              placeholder="Choose a 6-digit password"
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

          {/* Re-enter Password */}
          <div className="relative w-full">
            <label
              htmlFor="rePassword"
              className="absolute -top-2 left-3 bg-white px-1 text-[12px] text-gray-500"
            >
              Re-enter Password
            </label>
            <input
              type="password"
              id="rePassword"
              value={rePassword}
              onFocus={() => setErrors((prev) => ({ ...prev, rePassword: "" }))}
              onChange={handleRePasswordChange}
              placeholder="Confirm password"
              className={`border placeholder:text-sm p-3 w-full rounded-xl focus:ring-2 focus:outline-none ${
                errors.rePassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-cyan-600"
              }`}
            />
            {errors.rePassword && (
              <p className="text-red-500 text-sm mt-1">{errors.rePassword}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className={`h-4 w-4 rounded focus:ring-cyan-500 ${
                errors.terms ? "border-red-500" : "border-gray-300"
              }`}
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I understood the{" "}
              <span className="text-cyan-600 cursor-pointer hover:underline">
                terms and conditions
              </span>
            </label>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
          )}

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white font-bold py-3 rounded-xl hover:bg-cyan-700 active:scale-95 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Social Buttons Card */}
        <div className="bg-white shadow-md rounded-3xl w-full mt-6 p-6 flex flex-col items-center">
          <p className="font-semibold text-gray-600 text-[16px]">OR</p>
          <button className="mt-4 flex items-center justify-center gap-2 w-full border border-gray-200 rounded-xl py-3 px-6 shadow-sm hover:shadow-md transition">
            <FcGoogle size={20} />
            <span className="font-medium">Sign Up with Google</span>
          </button>

          <button className="mt-4 flex items-center justify-center gap-2 w-full border border-gray-200 rounded-xl py-3 px-6 shadow-sm hover:shadow-md transition text-blue-600">
            <FaFacebook size={20} />
            <span className="font-medium">Sign Up with Facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
}
