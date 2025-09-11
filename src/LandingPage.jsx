import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const cardsRef = useRef();
  const [currentCard, setCurrentCard] = useState(0);
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

  const handleScroll = () => {
    const scrollLeft = cardsRef.current.scrollLeft;
    const cardWidth = cardsRef.current.firstChild.offsetWidth + 1; // card + gap
    const index = Math.round(scrollLeft / cardWidth);
    setCurrentCard(index);
  };

  return (
    <div className="w-full bg-white min-h-screen flex flex-col items-center">
      {/* Header */}
      <div className="flex flex-col items-center">
        <p className="text-[15px] font-bold text-gray-700">Welcome to</p>
        {/* 
        <img
          className="w-[90px] sm:w-[150px] mt-4"
          src="/Images/main-logo.png"
          alt="Fitbyvg"
        />
        */}
        <p
          className="text-[40px] font-bold text-cyan-600"
          style={{ fontFamily: "'Roboto', cursive" }}
        >
          FITBYVG<span className="align-super text-[20px]">™</span>
        </p>
      </div>

      {/* Carousel */}
      <div className="w-full h-[360px] sm:h-[290px] my-4">
        <div
          ref={cardsRef}
          className="flex overflow-x-auto gap-4 snap-x snap-mandatory px-1 scrollbar-hide"
          onScroll={handleScroll}
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-72 snap-center rounded-3xl overflow-hidden"
            >
              <img
                src={card.img}
                alt="Card"
                className="w-full h-72 object-cover rounded-3xl"
              />
              <p className="text-center text-[20px] font-bold p-2 bg-white whitespace-pre-line">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-0">
        {cards.map((_, index) => (
          <span
            key={index}
            className={`w-1 h-1 rounded-full ${
              currentCard === index ? "bg-cyan-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col justify-center items-center gap-4 px-4 w-full max-w-[420px] mt-6 mb-4">
        <button
          onClick={() => navigate("/signup")}
          className="w-full bg-cyan-600 text-white font-bold py-3 rounded-3xl active:bg-cyan-700 transition"
        >
          Sign up for free
        </button>
        <button
          onClick={() => navigate("/login")}
          className=" w-full py-1 rounded-3xl text-cyan-600 font-bold active:bg-gray-300 transition"
        >
          Log In
        </button>
        <p className="text-cyan-600 text-sm sm:text-base text-center">
          Made with ❤️ by Virat Gajjar
        </p>
      </div>
    </div>
  );
}
