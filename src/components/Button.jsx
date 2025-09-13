export default function Button({
  children,
  onClick,
  variant = "primary", // default style
  size = "md", // optional size
  className = "", // extra classes if needed
  loading = false, // new loading state
  ...props
}) {
  // Base styles for all buttons
  const baseStyle =
    "w-full font-bold rounded-3xl transition cursor-pointer shadow-md flex items-center justify-center";

  // Variant styles
  const variants = {
    primary: "bg-cyan-600 text-white hover:bg-cyan-700 active:bg-cyan-700",
    outline:
      "border border-cyan-600 text-cyan-600 hover:bg-cyan-50 active:bg-cyan-100",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
    gray: "bg-gray-300 text-gray-700 hover:bg-gray-400 active:bg-gray-500", // example new variant
  };

  // Size styles
  const sizes = {
    sm: "py-2 text-sm",
    md: "py-3 text-base",
    lg: "py-4 text-lg",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${
        sizes[size]
      } ${className} ${loading ? "cursor-not-allowed opacity-70" : ""}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}
