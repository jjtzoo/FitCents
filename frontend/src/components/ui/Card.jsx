const Card = ({ className = "", padding = "p-6", children, ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-stone-200/70 shadow-sm ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
