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

      {/* Carousel */}
      <div className="w-full h-[370px] sm:h-[360px] my-2 px-3">
        <div
          ref={cardsRef}
          className="flex overflow-x-auto gap-4 snap-x snap-mandatory px-1 scrollbar-hide scroll-smooth"
          onScroll={handleScroll}
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[100%] h-90 px-0 snap-center rounded-3xl overflow-hidden shadow-md relative"
            >
              {/* Card Image */}
              <img
                src={card.img}
                alt="Card"
                className="w-full h-100 sm:h-[340px] object-cover"
              />
              {/* Fade Overlay */}
              <div
                className="absolute bottom-0 left-0 w-full h-[95px] bg-white/100 backdrop-blur-3xl"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to top, black 70%, transparent 100%)",
                }}
              />
              <p className="absolute bottom-2 w-full text-center text-[19px] font-bold text-gray-900 px-6 leading-snug">
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
            className={`w-2 h-2 rounded-full ${
              currentCard === index ? "bg-cyan-600" : "bg-cyan-300"
            }`}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col justify-center items-center gap-4 px-4 w-full max-w-[420px] mt-6 mb-4">
        <button
          onClick={() => navigate("/signup")}
          className="w-full bg-cyan-600 text-white font-bold py-3 rounded-3xl active:bg-cyan-700 transition hover:bg-cyan-700 cursor-pointer shadow-md"
        >
          Sign up for free
        </button>
        <button
          onClick={() => navigate("/login")}
          className="w-full py-3 rounded-3xl text-cyan-600 font-bold border border-cyan-600 active:bg-cyan-100 transition cursor-pointer"
        >
          Log In
        </button>
        <p className="text-gray-600 text-sm sm:text-base text-center">
          Made with ❤️ by Virat Gajjar
        </p>
      </div>
    </div>
  );
}
