import { useTheme } from "@/hooks/use-theme";
import { Bell, ChevronsLeft, Moon, Search, Sun } from "lucide-react";
import profileImg from "@/assets/profile-image.jpg";
import PropTypes from "prop-types";
import { useState } from "react";

export const Header = ({ collapsed, setCollapsed }) => {
  const { theme, setTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
      {/* Left Section */}
      <div className="flex items-center gap-x-3">
        <button
          className="btn-ghost size-10 transition hover:bg-gray-100 dark:hover:bg-slate-700"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronsLeft className={`${collapsed ? "rotate-180" : ""} transition-transform`} />
        </button>

        <div className="relative w-full max-w-xs md:max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg border border-gray-300 bg-transparent px-10 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:text-gray-50 dark:placeholder:text-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-x-3">
        {/* Theme Toggle */}
        <button
          className="btn-ghost size-10 transition hover:bg-gray-100 dark:hover:bg-slate-700"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun size={20} className="dark:hidden" />
          <Moon size={20} className="hidden dark:block" />
        </button>

        {/* Notifications */}
        <button className="btn-ghost size-10 transition hover:bg-gray-100 dark:hover:bg-slate-700">
          <Bell size={20} />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            className="size-10 overflow-hidden rounded-full transition hover:ring-2 hover:ring-blue-500"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <img
              src={profileImg}
              alt="profile image"
              className="size-full object-cover"
            />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-slate-800 dark:text-gray-50 z-20">
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700">Profile</button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700">Settings</button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};
