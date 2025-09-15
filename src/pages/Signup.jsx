import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { FaArrowLeft, FaDumbbell } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { setDoc, doc } from "firebase/firestore";

import Button from "../components/Button";
import FormInput from "../components/FormInput";
import FormCard from "../components/FormCard";
import TermsCheckbox from "../components/TermsCheckbox";
import SocialButton from "../components/SocialButton";

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
      await setDoc(doc(db, "users", email), { createdAt: new Date() });
      navigate("/onboarding");
    } catch (err) {
      if (err.code === "auth/email-already-in-use")
        setErrors((prev) => ({ ...prev, email: "Email already registered" }));
      else setErrors((prev) => ({ ...prev, email: err.message }));
    } finally {
      setLoading(false);
    }
  };

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
            <span>Sign Up</span> <FaDumbbell className="text-cyan-600" />
          </p>
        </div>
        {/* Form */}
        <FormCard>
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
          <Button type="submit" loading={loading} onClick={handleSignup}>
            Sign Up
          </Button>
        </FormCard>
        {/* Social */}
        {/* Social Buttons Card */}{" "}
        <div className="bg-white shadow-md rounded-3xl w-full mt-6 px-6 pt-4 pb-2 flex flex-col items-center">
          <p className="font-semibold text-gray-600 text-[16px]">OR</p>
          <SocialButton
            icon={FcGoogle}
            text="Sign Up with Google"
            className="mt-4 border-gray-200 py-2 px-2 hover:bg-gray-50"
          />
          <SocialButton
            icon={FaFacebook}
            text="Sign Up with Facebook"
            className="mt-4 border-gray-200 py-2 mb-3 px-2 text-blue-600 hover:bg-blue-50"
          />
        </div>
      </div>
    </div>
  );
}
