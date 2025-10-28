import { useRef, useState, useEffect } from "react";

export default function Carousel({ cards }) {
  const cardsRef = useRef();
  const [currentCard, setCurrentCard] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const isAutoScrolling = useRef(false); // prevent flicker

  const handleScroll = () => {
    if (isAutoScrolling.current) return; // ignore during auto-scroll
    const scrollLeft = cardsRef.current.scrollLeft;
    const cardWidth = cardsRef.current.firstChild.offsetWidth + 16; // card + gap
    const index = Math.round(scrollLeft / cardWidth);
    setCurrentCard(index);
  };

  const scrollToCard = (index) => {
    const cardWidth = cardsRef.current.firstChild.offsetWidth + 16; // card + gap
    isAutoScrolling.current = true;
    cardsRef.current.scrollTo({
      left: cardWidth * index,
      behavior: "smooth",
    });
    setCurrentCard(index);
    // release after animation (~500ms)
    setTimeout(() => {
      isAutoScrolling.current = false;
    }, 500);
  };

  // ✅ Auto scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentCard + direction;

      if (nextIndex >= cards.length) {
        nextIndex = cards.length - 2;
        setDirection(-1);
      } else if (nextIndex < 0) {
        nextIndex = 1;
        setDirection(1);
      }

      scrollToCard(nextIndex);
    }, 53000);

    return () => clearInterval(interval);
  }, [currentCard, direction, cards.length]);

  return (
    <div className="w-[95%] h-[370px] sm:h-[360px] my-2 px-3">
      <div
        ref={cardsRef}
        className="flex lg:w-[560px] overflow-x-auto gap-4 snap-x snap-mandatory px-1 scrollbar-hide scroll-smooth max-w-[600px] mx-auto"
        onScroll={handleScroll}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full sm:w-[500px] md:w-full lg:w-[560px] h-90 px-0 snap-center rounded-3xl overflow-hidden shadow-md relative"
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
            <p className="absolute md:mb-3 bottom-2 w-full text-center text-[19px] font-bold text-gray-900 px-6 leading-snug">
              {card.text}
            </p>
          </div>
        ))}
      </div>

      {/* Clickable Dots */}
      <div className="flex justify-center gap-2 mt-2">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            className={`w-2 h-2 cursor-pointer rounded-full ${
              currentCard === index ? "bg-cyan-600" : "bg-cyan-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
