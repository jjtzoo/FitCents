import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";
import LogoutButton from "./LogoutButton";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import AppHeader from "./AppHeader";

const DashboardNavBar = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const userRole = user?.role || "regular";

  const allLinks = [
    { label: "My Info", to: "/dashboard/user", roles: ["regular", "premium", "developer"] },
    { label: "Auto Meal Plan", to: "/dashboard/automealplan", roles: ["regular", "premium", "developer"] },
    { label: "Pick Meal Plan", to: "/dashboard/pickmealplan", roles: ["premium", "developer"] },
    { label: "Pantry Tracker", to: "/dashboard/inventory", roles: ["premium", "developer"] },
    { label: "Magic Dish", to: "/dashboard/magicdish", roles: ["premium", "developer"] },
    { label: "All Recipes", to: "/dashboard/allrecipes", roles: ["developer"] },
    { label: "Analytics", to: "/dashboard/analytics", roles: ["developer"] }
  ];

  const filteredLinks = allLinks.filter(link => link.roles.includes(userRole));

  return (
    <motion.nav
      className="bg-white shadow-md w-full px-4 py-4 border-b border-amber-100 flex flex-col items-center space-y-4"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
        <div className="absolute top-4 right-6">
            <LogoutButton />
        </div>
      {/* Logo */}
        <Link to="/dashboard/user">
            <AppHeader />
        </Link>

      {/* User Role */}
      <div className="text-sm text-gray-600 italic">
        Plan: <span className="capitalize font-semibold text-amber-700">{userRole}</span>
      </div>

      {/* Links */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-5 lg:gap-6 pt-2">
        {filteredLinks.map(link => {
          const isActive = location.pathname === link.to;
          return (
            <motion.div key={link.to} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={link.to}
                className={`px-4 py-2 rounded-2xl text-sm md:text-base font-medium transition
                  ${isActive
                    ? "bg-amber-500 text-white shadow"
                    : "bg-gray-100 text-gray-800 hover:bg-amber-100 hover:text-amber-700"}
                `}
              >
                {link.label}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default DashboardNavBar;
