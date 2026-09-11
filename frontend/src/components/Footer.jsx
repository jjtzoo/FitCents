const Footer = ({ compact = false }) => {
  return (
    <footer
      className={`flex items-center gap-1.5 text-stone-400 ${
        compact ? "text-xs justify-start" : "text-sm justify-center py-6"
      }`}
    >
      <img src="/favicon.svg" alt="" className="w-3.5 h-3.5 rounded-sm opacity-70" />
      <span>
        Powered by <span className="font-medium text-stone-500">jjtzoo</span>
      </span>
    </footer>
  );
};

export default Footer;
