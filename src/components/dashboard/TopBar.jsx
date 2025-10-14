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
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    <div
      className="
      bg-gradient-to-r from-cyan-700 via-cyan-600 to-cyan-400 
      text-white flex items-center justify-between 
      px-4 py-3 md:px-8 md:py-4 
      shadow-md sticky top-0 z-50
    "
    >
      {/* Logo */}
      <span
        onClick={() => navigate("/")}
        className="
          font-bold text-lg md:text-2xl tracking-wide 
          cursor-pointer hover:text-gray-200 transition-all
        "
      >
        FITBYVG
        <span className="align-super text-[12px] md:text-[16px]">™</span>
      </span>

      {/* Icons */}
      <div ref={menuRef} className="flex items-center gap-4 md:gap-8 relative">
        <Calendar
          onClick={onCalendar}
          className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-gray-200 transition-transform hover:scale-110"
        />
        <Bell
          onClick={onNotifications}
          className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-gray-200 transition-transform hover:scale-110"
        />
        <div className="relative">
          <User
            onClick={onProfileClick}
            className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-gray-200 transition-transform hover:scale-110"
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
