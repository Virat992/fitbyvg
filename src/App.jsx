// src/App.jsx
import "./styles/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import OnboardingRoute from "./routes/OnboardingRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import WorkoutTemplates from "./pages/WorkoutTemplates.jsx";
import AddWorkout from "./admin/AddWorkout.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/workout" element={<WorkoutTemplates />} />
        <Route path="/addworkout" element={<AddWorkout />} />

        {/* Onboarding route */}
        <Route
          path="/onboarding/*"
          element={
            <OnboardingRoute>
              <Onboarding />
            </OnboardingRoute>
          }
        />

        {/* Dashboard route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
