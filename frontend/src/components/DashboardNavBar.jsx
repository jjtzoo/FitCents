import { useState, useContext } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { MdPerson, MdRestaurantMenu, MdKitchen, MdAdminPanelSettings, MdMenu, MdClose } from "react-icons/md";
import { UserContext } from "../context/UserContext";
import LogoutButton from "./LogoutButton";
import AppHeader from "./AppHeader";
import Badge from "./ui/Badge";

const navGroups = [
  {
    label: "Overview",
    icon: MdPerson,
    roles: ["regular", "premium", "developer"],
    links: [
      { label: "My Info", to: "/dashboard/user", roles: ["regular", "premium", "developer"] },
    ],
  },
  {
    label: "Meal Planning",
    icon: MdRestaurantMenu,
    roles: ["regular", "premium", "developer"],
    links: [
      { label: "Auto Meal Plan", to: "/dashboard/automealplan", roles: ["regular", "premium", "developer"] },
      { label: "Pick Meal Plan", to: "/dashboard/pickmealplan", roles: ["premium", "developer"], premium: true },
    ],
  },
  {
    label: "Kitchen",
    icon: MdKitchen,
    roles: ["premium", "developer"],
    links: [
      { label: "Pantry Tracker", to: "/dashboard/inventory", roles: ["premium", "developer"], premium: true },
      { label: "Magic Dish", to: "/dashboard/magicdish", roles: ["premium", "developer"], premium: true },
    ],
  },
  {
    label: "Admin",
    icon: MdAdminPanelSettings,
    roles: ["developer"],
    links: [
      { label: "All Recipes", to: "/dashboard/allrecipes", roles: ["developer"] },
      { label: "Analytics", to: "/dashboard/analytics", roles: ["developer"] },
    ],
  },
];

const NavLinks = ({ userRole, onNavigate }) => {
  const location = useLocation();

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      {navGroups
        .filter((group) => group.roles.includes(userRole))
        .map((group) => {
          const links = group.links.filter((link) => link.roles.includes(userRole));
          if (links.length === 0) return null;
          const Icon = group.icon;

          return (
            <div key={group.label}>
              <div className="flex items-center gap-2 px-2 mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
                <Icon className="text-sm" />
                {group.label}
              </div>
              <div className="space-y-1">
                {links.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={onNavigate}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition
                        ${isActive
                          ? "bg-primary-600 text-white shadow-sm"
                          : "text-stone-700 hover:bg-primary-50 hover:text-primary-700"}
                      `}
                    >
                      {link.label}
                      {link.premium && (
                        <Badge tone={isActive ? "neutral" : "primary"} className={isActive ? "bg-white/20 text-white" : ""}>
                          Premium
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
    </nav>
  );
};

const DashboardNavBar = () => {
  const { user } = useContext(UserContext);
  const userRole = user?.role || "regular";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-white border-r border-stone-200">
        <div className="px-4 py-5 border-b border-stone-100">
          <Link to="/dashboard/user">
            <AppHeader />
          </Link>
          <div className="text-xs text-stone-500 italic mt-1">
            Plan: <span className="capitalize font-semibold text-primary-700">{userRole}</span>
          </div>
        </div>
        <NavLinks userRole={userRole} />
        <div className="p-4 border-t border-stone-100">
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard/user">
          <AppHeader />
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-stone-600 hover:bg-stone-100"
          aria-label="Open menu"
        >
          <MdMenu size={24} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white z-50 flex flex-col md:hidden shadow-xl"
            >
              <div className="px-4 py-5 border-b border-stone-100 flex items-center justify-between">
                <AppHeader />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-stone-600 hover:bg-stone-100"
                  aria-label="Close menu"
                >
                  <MdClose size={22} />
                </button>
              </div>
              <NavLinks userRole={userRole} onNavigate={() => setMobileOpen(false)} />
              <div className="p-4 border-t border-stone-100">
                <LogoutButton />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardNavBar;
