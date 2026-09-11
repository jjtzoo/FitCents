const Input = ({ label, id, error, className = "", ...props }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-stone-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 border rounded-lg text-sm sm:text-base
          bg-white text-stone-900 placeholder:text-stone-400
          focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400
          ${error ? "border-red-400" : "border-stone-300"} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
