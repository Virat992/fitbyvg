import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect } from "react";

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

  useEffect(() => {
  if (errors.reset || showResetSuccess) {
    const timer = setTimeout(() => {
      setErrors((prev) => ({ ...prev, reset: "" }));
      setShowResetSuccess(false);
    }, 4000);

    return () => clearTimeout(timer);
  }
}, [errors.reset, showResetSuccess]);

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

      // ✅ Sign in user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ Fetch user doc
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.onboardingCompleted) {
          if (window.location.pathname !== "/dashboard") {
            navigate("/dashboard", { replace: true });
          }
        } else {
          if (window.location.pathname !== "/onboarding") {
            const step = userData.onboardingStep ?? 0;
            navigate("/onboarding", {
              state: { startStep: step },
              replace: true,
            });
          }
        }
      } else {
        if (window.location.pathname !== "/onboarding") {
          navigate("/onboarding", { state: { startStep: 0 }, replace: true });
        }
      }
    } catch (error) {
      console.error("Firebase Login Error:", error);
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

 // 🔹 Forgot Password logic
  
const handleForgotPassword = async () => {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail) {
    return setErrors((prev) => ({
      ...prev,
      reset: "Please enter your email to reset password.",
    }));
  }

  try {
    setLoading(true);
    setErrors((prev) => ({ ...prev, reset: "" }));
    setShowResetSuccess(false);

    // ✅ Directly send password reset email without checking if email exists
    await sendPasswordResetEmail(auth, trimmedEmail);
    setShowResetSuccess(true);
  } catch (error) {
    console.error("Password Reset Error:", error);

    switch (error.code) {
      case "auth/invalid-email":
        setErrors((prev) => ({ ...prev, reset: "Invalid email format." }));
        break;
      case "auth/user-not-found":
        // Firebase throws this when email not registered
        setErrors((prev) => ({
          ...prev,
          reset: "No account found with this email.",
        }));
        break;
      default:
        setErrors((prev) => ({
          ...prev,
          reset: "Failed to send reset email. Try again later.",
        }));
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className=" md:w-full  w-full min-h-screen bg-cyan-50 flex flex-col items-center">
      <div className="w-full max-w-md md:max-w-lg mx-auto flex flex-col items-center">
        {/* Top Section */}
        <div
          className="w-full md:h-80 h-50 flex items-center justify-center rounded-b-3xl relative 
            bg-gradient-to-r from-cyan-700 via-cyan-600 to-cyan-400 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <p
            className="text-[40px] md:text-[52px] lg:-mt-30 -mt-15 md:-mt-20 font-bold text-white"
            style={{ fontFamily: "'Roboto', cursive" }}
          >
            FITBYVG
            <span className="align-super text-[20px] md:text-[28px]">™</span>
          </p>
        </div>

        {/* Login Form Card */}
        <div className="w-full bg-white shadow-lg rounded-3xl lg:-mt-32 -mt-10 md:-mt-16 z-10 p-6 md:p-8 flex flex-col items-center max-w-[420px] md:max-w-[600px]">
          
          {/* Alerts (Forgot Password) */}
          {(errors.reset || showResetSuccess) && (
            <div className="w-full text-center mb-2">
              {errors.reset && <AlertMessage message={errors.reset} />}
                {showResetSuccess && (
                  <AlertMessage
                    message="Password reset email sent! Check your inbox."
                    type="success"
                  />
              )}
            </div>
          )}
          
          {/* Header */}
          <div className="flex items-center justify-center relative w-full mb-4">
            <p className="flex items-center gap-2 text-[20px] md:text-[24px] font-bold text-gray-800">
              Existing Member Login
            </p>
          </div>

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
              type={passwordVisible ? "text" : "password"}
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

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3 text-sm md:text-base md:py-4"
            >
              Log In
            </Button>
          </form>

          <p
            className="text-cyan-600 font-bold text-sm md:text-base mt-5 cursor-pointer hover:underline text-center"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </p>

          <p className="mt-4 text-gray-700 text-sm md:text-base text-center">
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
