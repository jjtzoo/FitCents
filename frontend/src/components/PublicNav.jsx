import { NavLink } from "react-router";
import AppHeader from "./AppHeader";

const PublicNav = () => {
    return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white bg-opacity-90 backdrop-blur-md border border-amber-200 rounded-full px-4 sm:px-6 py-2 shadow-md max-w-full">
      <ul className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-gray-700">

        {/* Left Side Links */}
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-amber-700 font-semibold" : "hover:text-amber-700 transition"
            }
          >
            Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/aboutus"
            className={({ isActive }) =>
              isActive ? "text-amber-700 font-semibold" : "hover:text-amber-700 transition"
            }
          >
            About Us
          </NavLink>
        </li>

        {/* Centered Logo */}
        <li className="order-first sm:order-none mx-2">
          <NavLink to="/" className="pointer-events-auto">
            <AppHeader />
          </NavLink>
        </li>

        {/* Right Side Links */}
        <li>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "text-amber-700 font-semibold" : "hover:text-amber-700 transition"
            }
          >
            Login
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              isActive ? "text-amber-700 font-semibold" : "hover:text-amber-700 transition"
            }
          >
            Register
          </NavLink>
        </li>

      </ul>
    </nav>
    )
}

export default PublicNav
