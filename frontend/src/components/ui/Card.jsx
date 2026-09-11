const Card = ({ className = "", padding = "p-6", children, ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-[0_1px_2px_rgba(64,33,19,0.06),0_8px_24px_-12px_rgba(64,33,19,0.18)] ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
