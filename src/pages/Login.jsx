import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaArrowLeft, FaRunning, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import FormInput from "../components/FormInput";
import Button from "../components/Button";
import SocialButton from "../components/SocialButton";
import AlertMessage from "../components/AlertMessage";
import FormCard from "../components/FormCard";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", reset: "" });
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Login handler
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
      navigate("/dashboard");
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

  // Forgot password handler
  const handleForgotPassword = async () => {
    setErrors({ email: "", password: "", reset: "" });
    setShowResetSuccess(false);

    if (!email)
      return setErrors((prev) => ({
        ...prev,
        reset: "Please enter your registered email",
      }));

    try {
      const docSnap = await getDoc(doc(db, "users", email));
      if (!docSnap.exists())
        return setErrors((prev) => ({
          ...prev,
          reset: "Email is not registered",
        }));

      await sendPasswordResetEmail(auth, email);
      setShowResetSuccess(true);
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        setErrors((prev) => ({ ...prev, reset: "Invalid email format" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          reset: "Failed to send reset email. Try again.",
        }));
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

        {/* Form Card */}
        <FormCard>
          {(errors.reset || showResetSuccess) && (
            <div className="absolute top-2 left-0  w-full text-center z-10">
              {errors.reset && <AlertMessage message={errors.reset} />}
              {showResetSuccess && (
                <AlertMessage
                  message="Password reset email sent! Check your inbox."
                  type="success"
                />
              )}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <FormInput
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your registered email"
              error={errors.email}
              onFocus={() => setErrors({ ...errors, email: "", reset: "" })}
            />

            <FormInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              error={errors.password}
              onFocus={() => setErrors({ ...errors, password: "" })}
            />

            <Button type="submit" loading={loading}>
              Log In
            </Button>
          </form>

          <p
            className="text-cyan-600 font-bold text-sm mt-2 cursor-pointer hover:underline text-center"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </p>
        </FormCard>

        {/* Social Login */}
        <div className="bg-white shadow-md rounded-3xl w-full mt-6 p-6 flex flex-col items-center">
          <p className="font-semibold text-gray-600 text-[16px]">OR</p>
          <SocialButton
            icon={FcGoogle}
            text="Continue with Google"
            className="mt-4 py-2 px-2"
          />
          <SocialButton
            icon={FaFacebook}
            text="Continue with Facebook"
            className="mt-4 text-blue-600 py-2 px-2"
          />

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
