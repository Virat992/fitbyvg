export default function AlertMessage({
  message,
  type = "error",
  className = "",
}) {
  const color = type === "error" ? "text-red-500" : "text-green-600";
  return <p className={`${color} text-sm ${className}`}>{message}</p>;
}
