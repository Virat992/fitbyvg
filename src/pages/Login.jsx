import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import FormInput from "../components/FormInput";
import Button from "../components/Button";
import AlertMessage from "../components/AlertMessage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", reset: "" });
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", reset: "" });
    setShowResetSuccess(false);

    if (!email)
      return setErrors((prev) => ({ ...prev, email: "Email is required" }));
    if (!password)
      return setErrors((prev) => ({
        ...prev,
        password: "Password is required",
      }));

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

      const userDoc = await getDoc(doc(db, "users", email));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.onboardingCompleted) {
          navigate("/dashboard", { replace: true }); // prevents /login in history
        } else {
          const step = userData.onboardingStep ?? 0;
          navigate("/onboarding", {
            state: { startStep: step },
            replace: true,
          });
        }
      } else {
        navigate("/onboarding", { state: { startStep: 0 }, replace: true });
      }
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          setErrors((prev) => ({ ...prev, email: "Email is not registered" }));
          break;
        case "auth/wrong-password":
          setErrors((prev) => ({ ...prev, password: "Incorrect password" }));
          setPassword("");
          break;
        case "auth/invalid-email":
          setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
          break;
        default:
          setErrors((prev) => ({
            ...prev,
            password: "Email or Password is invalid.",
          }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-cyan-50 flex flex-col items-center">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        {/* Top Section */}
        <div
          className="w-full h-50 flex items-center justify-center rounded-b-3xl relative 
            bg-gradient-to-r from-cyan-700 via-cyan-600 to-cyan-400 cursor-pointer"
          onClick={() => navigate("/")}
        >
          {/* Optional design element or logo */}
          <p
            className="text-[40px] -mt-15 font-bold text-white"
            style={{ fontFamily: "'Roboto', cursive" }}
          >
            FITBYVG<span className="align-super text-[20px]">™</span>
          </p>
        </div>

        {/* Login Form Card */}
        <div className="w-full max-w-[420px] bg-white shadow-lg rounded-3xl -mt-10 z-10 p-6 flex flex-col items-center">
          {/* Header */}
          <div className="flex items-center justify-center relative w-full mb-4">
            <p className="flex items-center gap-2 text-[20px] font-bold text-gray-800">
              Existing Member Login
            </p>
          </div>

          {/* Alerts */}
          {(errors.reset || showResetSuccess) && (
            <div className="absolute top-2 left-0 w-full text-center z-10">
              {errors.reset && <AlertMessage message={errors.reset} />}
              {showResetSuccess && (
                <AlertMessage
                  message="Password reset email sent! Check your inbox."
                  type="success"
                />
              )}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6 mt-3 w-full">
            <FormInput
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your registered email"
              error={errors.email}
            />

            <FormInput
              id="password"
              label="Password"
              type={passwordVisible ? "text" : "password"} // toggle type
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              error={errors.password}
              rightIcon={
                passwordVisible ? (
                  <FaEyeSlash
                    className="cursor-pointer text-gray-500"
                    onClick={() => setPasswordVisible(false)}
                  />
                ) : (
                  <FaEye
                    className="cursor-pointer text-gray-500"
                    onClick={() => setPasswordVisible(true)}
                  />
                )
              }
            />

            <Button type="submit" loading={loading} className="w-full py-3">
              Log In
            </Button>
          </form>

          <p
            className="text-cyan-600 font-bold text-sm mt-5 cursor-pointer hover:underline text-center"
            onClick={() => alert("Forgot password functionality")}
          >
            Forgot password?
          </p>

          <p className="mt-4 text-gray-700 text-sm text-center">
            Don’t have an account?{" "}
            <span
              className="text-cyan-600 font-semibold cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
