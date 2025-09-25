export default function FormInput({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  onFocus,
  rightIcon, // added for eye icon
}) {
  return (
    <div className="relative w-full">
      <label
        htmlFor={id}
        className="absolute -top-2 left-3 bg-white px-1 text-[12px] text-gray-500"
      >
        {label}
      </label>

      {/* Input field with extra padding on right for the icon */}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        className={`border p-3 w-full rounded-2xl focus:ring-2 focus:outline-none placeholder:text-sm ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-cyan-600"
        } pr-10`} // extra padding on right
      />

      {/* Right icon */}
      {rightIcon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {rightIcon}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
