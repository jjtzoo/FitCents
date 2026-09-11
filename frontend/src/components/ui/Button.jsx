import { motion } from "framer-motion";

const variants = {
  primary: "bg-primary-600 text-white shadow-sm hover:bg-primary-700",
  secondary: "bg-sage-600 text-white shadow-sm hover:bg-sage-700",
  outline: "bg-transparent text-primary-700 border border-primary-300 hover:bg-primary-50",
  ghost: "bg-transparent text-stone-600 hover:bg-stone-100",
  danger: "bg-red-500 text-white shadow-sm hover:bg-red-600",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm sm:text-base",
  lg: "px-6 py-3 text-base",
};

const Button = ({
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  children,
  ...props
}) => {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
