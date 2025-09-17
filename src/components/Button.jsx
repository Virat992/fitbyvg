export default function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
  loading = false,
}) {
  const baseClasses =
    "w-full py-3 px-6 rounded-full font-semibold transition-colors text-center flex justify-center items-center gap-2";

  const variantClasses = {
    primary: "bg-cyan-600 text-white hover:bg-cyan-700 cursor-pointer",
    outline:
      "bg-transparent cursor-pointer border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-100",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    gray: "bg-gray-300 text-gray-600 cursor-not-allowed",
  };

  // Spinner color based on variant
  const spinnerColor = {
    primary: "text-white",
    outline: "text-cyan-600",
    secondary: "text-gray-800",
    gray: "text-gray-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading && (
        <svg
          className={`animate-spin h-5 w-5 ${spinnerColor[variant]}`}
          viewBox="25 25 50 50"
        >
          <circle
            className="opacity-25"
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle
            className="opacity-75"
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="31.4 31.4"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
