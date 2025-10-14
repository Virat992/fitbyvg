import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Carousel from "../components/Carousel";

// Carousel cards data
// Each card contains an image and a descriptive text
const carouselCards = [
  {
    img: "/Images/landingpage-1.jpg",
    text: "Workouts tailored to your goals.",
  },
  {
    img: "/Images/landingpage-2.jpeg",
    text: "Log meals and track calories and macros in seconds",
  },
  {
    img: "/Images/landingpage-3.jpg",
    text: "See your daily progress and stay motivated to improve",
  },
];

export default function LandingPage() {
  // react-router-dom hook to programmatically navigate between routes
  const navigate = useNavigate();

  return (
    <div className="w-full bg-cyan-50 min-h-screen flex flex-col items-center py-4 md:py-8 md:px-6">
      {/* Header: site title and welcome message */}
      <header className="flex flex-col items-center md:mb-6">
        <p className="text-[15px] font-bold text-gray-600 md:text-[18px]">
          Welcome to
        </p>
        {/* Main site title */}
        <h1 className="text-[40px] font-bold text-cyan-600 md:text-[52px] font-roboto">
          FITBYVG
          <span className="align-super text-[20px] md:text-[28px]">™</span>
        </h1>
      </header>

      {/* Carousel component renders feature cards */}
      <Carousel cards={carouselCards} />

      {/* Actions Section: Sign Up, Log In buttons and footer */}
      <section className="flex md:mt-15 flex-col justify-center items-center gap-4 px-4 w-full max-w-[420px] mt-6 mb-4 md:max-w-[600px] md:gap-6">
        {/* Sign Up button navigates to /signup */}
        <Button
          className="md:text-lg md:py-3"
          onClick={() => navigate("/signup")}
        >
          Sign up for free
        </Button>
        {/* Log In button navigates to /login */}
        <Button
          variant="outline"
          className="md:text-lg md:py-3"
          onClick={() => navigate("/login")}
        >
          Log In
        </Button>
        {/* Footer text */}
        <p className="text-gray-600 md:mt-60 md:text-[18px] text-sm sm:text-base text-center mt-2">
          Made with ❤️ by Virat Gajjar
        </p>
      </section>
    </div>
  );
}
