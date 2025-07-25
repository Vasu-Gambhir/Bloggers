import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import { ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

const Appbar = ({ buttonVisible = true }: { buttonVisible?: boolean }) => {
  const { user, logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/signin");
  };

  return (
    <div className="border-b shadow-sm flex justify-between px-10 py-4 bg-white sticky top-0 z-50">
      <Link to="/blogs">
        <h1 className="text-2xl font-bold text-green-800 tracking-wide hover:opacity-80 transition flex flex-col justify-center h-full">
          Bloggers
        </h1>
      </Link>

      <div className="flex items-center space-x-4" ref={dropdownRef}>
        {buttonVisible && (
          <Link to="/publish">
            <button
              type="button"
              className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm transition"
            >
              + New Blog
            </button>
          </Link>
        )}

        <div
          onClick={() => setOpenDropdown((prev) => !prev)}
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-full px-2 py-1 transition"
        >
          <Avatar authorName={user?.name || "User"} size="big" />
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${
              openDropdown ? "rotate-180" : ""
            }`}
          />
        </div>

        <div
          className={`absolute right-10 top-16 w-48 bg-white border rounded-xl shadow-lg transition-all duration-150 ${
            openDropdown
              ? "scale-100 opacity-100 visible"
              : "scale-95 opacity-0 invisible"
          }`}
        >
          <div className="px-4 py-3 font-medium text-gray-700 border-b">
            {user?.name || "Anonymous"}
          </div>
          <button
            onClick={handleLogout}
            className="cursor-pointer w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Appbar;
