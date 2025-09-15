export default function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
}) {
  const baseClasses =
    "w-full py-3 px-6 rounded-full font-semibold transition-colors text-center";

  const variantClasses = {
    primary: "bg-cyan-600 text-white hover:bg-cyan-700 cursor-pointer",
    outline:
      "bg-transparent border-2 border-cyan-600 text-cyan-600 hover:bg-gray-50",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    gray: "bg-gray-300 text-gray-600 cursor-not-allowed",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
}
