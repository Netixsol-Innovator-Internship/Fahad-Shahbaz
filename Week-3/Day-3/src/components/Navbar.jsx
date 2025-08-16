import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="font-bold text-xl md:text-2xl text-indigo-400 hover:text-indigo-300 transition duration-300"
        >
          TaskManager
        </Link>
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="bg-gray-800 p-4 mt-4 rounded-lg shadow-lg">
          <div className="flex flex-col gap-2">
            <Link
              to="/login"
              className="text-white hover:text-indigo-300 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/dashboard"
              className="bg-indigo-500 px-4 py-2 rounded-lg text-white hover:bg-indigo-400 transition duration-300"
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
