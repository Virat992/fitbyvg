import { useState, useEffect, useRef } from "react";

function useDraggable(initialPos = { x: 20, y: 80 }, handleRef = null) {
  const saved = JSON.parse(localStorage.getItem("chatButtonPos"));
  const [pos, setPos] = useState(saved || initialPos);
  const ref = useRef();

  useEffect(() => {
    localStorage.setItem("chatButtonPos", JSON.stringify(pos));
  }, [pos]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX, startY;
    let offsetX, offsetY;
    let dragging = false;

    const onMouseDown = (e) => {
      // Only start drag if handleRef contains target
      if (handleRef?.current && !handleRef.current.contains(e.target)) return;

      e.preventDefault();
      const rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      startX = e.clientX;
      startY = e.clientY;
      dragging = false;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
      // Only start moving after a small threshold to allow scrolling inside content
      if (!dragging) {
        const dx = Math.abs(e.clientX - startX);
        const dy = Math.abs(e.clientY - startY);
        if (dx < 5 && dy < 5) return;
        dragging = true;
      }
      setPos({ x: e.clientX - offsetX, y: e.clientY - offsetY });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    const onTouchStart = (e) => {
      if (handleRef?.current && !handleRef.current.contains(e.target)) return;
      const touch = e.touches[0];
      const rect = el.getBoundingClientRect();
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;
      startX = touch.clientX;
      startY = touch.clientY;
      dragging = false;

      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("touchend", onTouchEnd);
    };

    const onTouchMove = (e) => {
      const touch = e.touches[0];
      if (!dragging) {
        const dx = Math.abs(touch.clientX - startX);
        const dy = Math.abs(touch.clientY - startY);
        if (dx < 5 && dy < 5) return;
        dragging = true;
      }
      setPos({ x: touch.clientX - offsetX, y: touch.clientY - offsetY });
    };

    const onTouchEnd = () => {
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("touchstart", onTouchStart, { passive: false });

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("touchstart", onTouchStart);
    };
  }, [handleRef]);

  return [ref, pos];
}

export default useDraggable;
