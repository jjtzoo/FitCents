import { motion } from "framer-motion";

const PageHeader = ({ eyebrow, title, subtitle, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`space-y-2 ${className}`}
    >
      {eyebrow && (
        <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-primary-600">
          {eyebrow}
        </p>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">{title}</h1>
      {subtitle && <p className="text-stone-500 text-sm sm:text-base">{subtitle}</p>}
    </motion.div>
  );
};

export default PageHeader;
