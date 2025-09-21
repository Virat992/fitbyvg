import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { setDoc, doc } from "firebase/firestore";
import { FaArrowLeft, FaDumbbell } from "react-icons/fa";

import Button from "../components/Button";
import FormInput from "../components/FormInput";
import FormCard from "../components/FormCard";
import TermsCheckbox from "../components/TermsCheckbox";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    rePassword: "",
    terms: "",
  });

  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", rePassword: "", terms: "" });

    if (!email)
      return setErrors((prev) => ({ ...prev, email: "Email is required" }));
    if (!validateEmail(email))
      return setErrors((prev) => ({ ...prev, email: "Enter a valid email" }));
    if (!password)
      return setErrors((prev) => ({
        ...prev,
        password: "Password is required",
      }));
    if (password.length < 6)
      return setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
    if (!rePassword)
      return setErrors((prev) => ({
        ...prev,
        rePassword: "Please confirm your password",
      }));
    if (password !== rePassword)
      return setErrors((prev) => ({
        ...prev,
        rePassword: "Passwords do not match",
      }));
    if (!acceptedTerms)
      return setErrors((prev) => ({
        ...prev,
        terms: "You must accept the terms",
      }));

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", email), {
        createdAt: new Date(),
        onboardingCompleted: false,
        onboardingStep: 0,
        forms: {},
        formsCompleted: false,
      });
      navigate("/onboarding");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setErrors((prev) => ({ ...prev, email: "Email already registered" }));
      } else {
        setErrors((prev) => ({ ...prev, email: err.message }));
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
            onClick={() => navigate("/")}
            className="absolute left-0 cursor-pointer p-2 rounded-full hover:bg-gray-200 transition"
          />
          <p className="flex items-center gap-2 text-center text-[20px] font-bold text-gray-800">
            Sign Up <FaDumbbell className="text-cyan-600" />
          </p>
        </div>

        {/* Form */}
        <FormCard>
          <form className="space-y-4" onSubmit={handleSignup}>
            <FormInput
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="ex: jon.smith@email.com"
            />
            <FormInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="Choose a 6-digit password"
            />
            <FormInput
              id="rePassword"
              label="Re-enter Password"
              type="password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              error={errors.rePassword}
              placeholder="Confirm password"
            />
            <TermsCheckbox
              checked={acceptedTerms}
              onChange={setAcceptedTerms}
              label="I understood the terms and conditions"
              error={errors.terms}
            />

            <Button type="submit" loading={loading} className="w-full py-3">
              Sign Up
            </Button>
          </form>
        </FormCard>

        <p className="mt-4 text-gray-700 text-sm text-center">
          Already have an account?{" "}
          <span
            className="text-cyan-600 font-semibold cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}
