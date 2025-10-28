import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Carousel from "../components/Carousel";

const carouselCards = [
  {
    img: "/Images/landingpage-1.jpg",
    text: "Workouts tailored to your goals by fitness professional",
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
  const navigate = useNavigate();

  return (
    <div className="w-full bg-cyan-50 min-h-screen flex flex-col items-center lg:h-screen lg:justify-start">

      {/* ✅ Header centered across full width */}
      <header className="flex mt-5 md:mt-10 lg:mt-10 flex-col items-center mb-2">
        <p className="text-[15px] font-bold text-gray-600 md:text-[18px]">
          Welcome to
        </p>
        <h1 className="text-[40px] font-bold text-cyan-600 md:text-[52px] font-roboto">
          FITBYVG
          <span className="align-super text-[20px] md:text-[28px]">™</span>
        </h1>
      </header>

      {/* ✅ Two-column layout below header for large screens */}
      <div className="flex flex-col lg:w-[80%] items-center w-full lg:flex-row lg:justify-center lg:items-start lg:gap-20">

        {/* Left: Carousel */}
        <Carousel cards={carouselCards} />

        {/* Right: Buttons + Footer */}
        <section className="flex px-2 md:mt-15 md:gap-8 flex-col lg:gap-8 lg:max-w-[380px] lg:mr-5 lg:mt-25 justify-center items-center gap-4 w-full max-w-[420px] mt-6">
          <Button className="md:text-lg md:py-3" onClick={() => navigate("/signup")}>
            Sign up for free
          </Button>

          <Button
            variant="outline"
            className="md:text-lg md:py-3"
            onClick={() => navigate("/login")}
          >
            Log In
          </Button>

          <p className="text-gray-600 text-sm sm:text-base text-center mt-2">
            Made with ❤️ by Virat Gajjar
          </p>
        </section>

      </div>
    </div>
  );
}
