import { useRef, useState } from "react";

export default function Carousel({ cards }) {
  const cardsRef = useRef();
  const [currentCard, setCurrentCard] = useState(0);

  const handleScroll = () => {
    const scrollLeft = cardsRef.current.scrollLeft;
    const cardWidth = cardsRef.current.firstChild.offsetWidth + 1; // card + gap
    setCurrentCard(Math.round(scrollLeft / cardWidth));
  };

  return (
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
            <img
              src={card.img}
              alt="Card"
              className="w-full h-100 sm:h-[340px] object-cover"
            />
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

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-2">
        {cards.map((_, index) => (
          <span
            key={index}
            className={`w-2 h-2 rounded-full ${
              currentCard === index ? "bg-cyan-600" : "bg-cyan-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
