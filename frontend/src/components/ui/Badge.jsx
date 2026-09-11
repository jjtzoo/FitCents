const tones = {
  primary: "bg-primary-100 text-primary-700",
  sage: "bg-sage-100 text-sage-700",
  neutral: "bg-stone-100 text-stone-600",
};

const Badge = ({ tone = "primary", className = "", children }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
