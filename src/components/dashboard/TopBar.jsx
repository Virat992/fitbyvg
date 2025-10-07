// src/components/TopBar.jsx
import { useState, useEffect, useRef } from "react";
import { Calendar, Bell, User } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

export default function TopBar({
  onCalendar,
  onNotifications,
  onProfileClick,
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="bg-cyan-600 text-white flex items-center justify-between px-4 py-3 shadow-md">
      {/* Clickable Logo */}
      <span
        onClick={() => navigate("/")}
        className="font-bold text-lg sm:text-xl tracking-wide cursor-pointer hover:text-gray-200 transition"
      >
        FITBYVG<span className="align-super text-[12px] sm:text-[15px]">™</span>
      </span>

      <div className="flex items-center gap-4 sm:gap-6 relative" ref={menuRef}>
        <Calendar
          onClick={onCalendar}
          className="w-5 h-5 cursor-pointer hover:text-gray-200 transition"
        />
        <Bell
          onClick={onNotifications}
          className="w-5 h-5 cursor-pointer hover:text-gray-200 transition"
        />
        <div className="relative">
          <User
            onClick={onProfileClick}
            className="w-5 h-5 cursor-pointer hover:text-gray-200 transition"
          />
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-white text-gray-800 rounded-lg shadow-lg z-50">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
