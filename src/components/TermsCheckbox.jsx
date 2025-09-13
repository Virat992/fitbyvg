export default function TermsCheckbox({ checked, onChange, label, error }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className={`h-4 w-4 rounded focus:ring-cyan-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        <label className="ml-2 text-sm text-gray-600">{label}</label>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
