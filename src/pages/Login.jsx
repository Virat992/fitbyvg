import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaArrowLeft, FaRunning } from "react-icons/fa";

import FormInput from "../components/FormInput";
import Button from "../components/Button";
import FormCard from "../components/FormCard";
import AlertMessage from "../components/AlertMessage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", reset: "" });
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
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
        if (userData.onboardingCompleted) navigate("/dashboard");
        else {
          const step = userData.onboardingStep ?? 0;
          navigate("/onboarding", { state: { startStep: step } });
        }
      } else {
        navigate("/onboarding", { state: { startStep: 0 } });
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
    <div className="w-full min-h-screen flex flex-col items-center pt-4 bg-gradient-to-b from-cyan-50 via-white to-cyan-100">
      <div className="flex flex-col items-center w-full max-w-[420px] px-4">
        {/* Header */}
        <div className="flex items-center justify-center relative w-full mb-4">
          <FaArrowLeft
            size={32}
            onClick={() => navigate(-1)}
            className="absolute left-0 cursor-pointer p-2 rounded-full hover:bg-gray-200 transition"
          />
          <p className="flex items-center gap-2 text-[20px] font-bold text-gray-800">
            Login <FaRunning className="text-cyan-600" />
          </p>
        </div>

        <FormCard>
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

          <form onSubmit={handleLogin} className="space-y-6">
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              error={errors.password}
            />

            <Button type="submit" loading={loading} className="w-full py-3">
              Log In
            </Button>
          </form>

          <p
            className="text-cyan-600 font-bold text-sm mt-2 cursor-pointer hover:underline text-center"
            onClick={() => alert("Forgot password functionality")}
          >
            Forgot password?
          </p>
        </FormCard>

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
  );
}
