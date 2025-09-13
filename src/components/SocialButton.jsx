export default function SocialButton({
  icon: Icon,
  text,
  onClick,
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 w-full border rounded-xl shadow-sm hover:shadow-md transition ${className}`}
    >
      <Icon size={20} />
      <span className="font-medium">{text}</span>
    </button>
  );
}
