import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Carousel from "../components/Carousel";

export default function LandingPage() {
  const navigate = useNavigate();

  const cards = [
    {
      img: "https://plus.unsplash.com/premium_photo-1661580254001-234e9e1c0f6a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170https://plus.unsplash.com/premium_photo-1725576700786-23d683d8c53c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVyc29uYWxpc2VkJTIwd29ya291dHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
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
