import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { setDoc, doc } from "firebase/firestore";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import Button from "../components/Button";
import FormInput from "../components/FormInput";
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
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rePasswordVisible, setRePasswordVisible] = useState(false);

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
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
        onboardingCompleted: false,
        onboardingStep: 0,
        forms: {},
        formsCompleted: false,
        role: "user",
        currentProgram: null,
        programStartDate: null,
      });

      navigate("/onboarding", { replace: true });
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
    <div className="w-full min-h-screen bg-cyan-50 flex flex-col items-center">
      <div className="w-full max-w-md md:max-w-lg mx-auto flex flex-col items-center">
        {/* Top Section */}
        <div
          className="w-full md:h-80 h-50 flex items-center justify-center rounded-b-3xl relative 
            bg-gradient-to-r from-cyan-700 via-cyan-600 to-cyan-400 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <p
            className="text-[40px] md:text-[52px] lg:-mt-60 -mt-15 md:-mt-20 font-bold text-white"
            style={{ fontFamily: "'Roboto', cursive" }}
          >
            FITBYVG
            <span className="align-super text-[20px] md:text-[28px]">™</span>
          </p>
        </div>

        {/* Signup Form Card */}
        <div className="w-full bg-white shadow-lg rounded-3xl lg:-mt-60 -mt-12 md:-mt-16 z-10 p-6 md:p-8 flex flex-col items-center">
          <div className="flex items-center justify-center relative w-full mb-4">
            <p className="flex items-center gap-2 text-[20px] md:text-[24px] font-bold text-gray-800">
              Create Your Account
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6 mt-3 w-full">
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
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="Choose a 6-digit password"
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

            <FormInput
              id="rePassword"
              label="Re-enter Password"
              type={rePasswordVisible ? "text" : "password"}
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              error={errors.rePassword}
              placeholder="Confirm password"
              rightIcon={
                rePasswordVisible ? (
                  <FaEyeSlash
                    className="cursor-pointer text-gray-500"
                    onClick={() => setRePasswordVisible(false)}
                  />
                ) : (
                  <FaEye
                    className="cursor-pointer text-gray-500"
                    onClick={() => setRePasswordVisible(true)}
                  />
                )
              }
            />

            <div className="flex justify-center mt-8">
              <TermsCheckbox
                checked={acceptedTerms}
                onChange={setAcceptedTerms}
                error={errors.terms}
                label={
                  <span className="text-center text-sm md:text-base">
                    I understood the{" "}
                    <span className="text-cyan-600 cursor-pointer">
                      terms and conditions
                    </span>
                  </span>
                }
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3 mt-8 text-sm md:text-base md:py-4"
            >
              Sign Up
            </Button>
          </form>

          <p className="mt-8 text-gray-700 text-sm text-center md:text-base">
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
    </div>
  );
}
