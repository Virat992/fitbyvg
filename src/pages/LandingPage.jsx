import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Carousel from "../components/Carousel";

export default function LandingPage() {
  const navigate = useNavigate();

  const cards = [
    {
      img: "/Images/value-prop-1.png",
      text: "Ready for some wins?\nStart tracking, it's easy",
    },
    {
      img: "/Images/value-prop-2.png",
      text: "Discover the impact of\nyour food and fitness",
    },
    {
      img: "/Images/value-prop-3.png",
      text: "And make mindful eating\na habit of life",
    },
  ];

  return (
    <div className="w-full bg-cyan-50 min-h-screen flex flex-col items-center py-4">
      {/* Header */}
      <div className="flex flex-col items-center">
        <p className="text-[15px] font-bold text-gray-600">Welcome to</p>
        <p
          className="text-[40px] font-bold text-cyan-600"
          style={{ fontFamily: "'Roboto', cursive" }}
        >
          FITBYVG<span className="align-super text-[20px]">™</span>
        </p>
      </div>

      {/* Carousel component */}
      <Carousel cards={cards} />

      {/* Actions */}
      <div className="flex flex-col justify-center items-center gap-4 px-4 w-full max-w-[420px] mt-6 mb-4">
        <Button onClick={() => navigate("/signup")}>Sign up for free</Button>
        <Button variant="outline" onClick={() => navigate("/login")}>
          Log In
        </Button>
        <p className="text-gray-600 text-sm sm:text-base text-center">
          Made with ❤️ by Virat Gajjar
        </p>
      </div>
    </div>
  );
}
