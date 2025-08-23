import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { isAuthenticated, logout, role } = useAuth();
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Debug logging
  console.log("Navbar - isAuthenticated:", isAuthenticated, "role:", role);

  return (
    <header className="bg-white  mx-w-[90%]  mx-auto sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            <img src="../images/logo.png" className="w-40" alt="logo" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              to="/"
              className="font-montserrat  text-[14px] font-normal leading-5 text-gray-700 hover:text-black"
            >
              TEA COLLECTIONS
            </Link>
            <Link
              to="/accessories"
              className=" text-[14px] font-normal leading-5 text-gray-700 hover:text-black"
            >
              ACCESSORIES
            </Link>
            <Link
              to=" "
              className=" text-[14px] font-normal leading-5 text-gray-700 hover:text-black"
            >
              BLOGS
            </Link>
            <Link
              to=" "
              className="hidden lg:block text-[14px] font-normal leading-5 text-gray-700 hover:text-black"
            >
              CONTACT US
            </Link>
            {(role === "admin" || role === "superadmin") && (
              <Link
                to="/admin-dashboard"
                className="text-[14px] font-semibold leading-5 text-blue-700 hover:text-blue-900"
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center justify-between space-x-10 mr-4">
            <Link to="#" className="w-4">
              <img src="/images/search.svg" alt="search icon" />
            </Link>

            {/* Show login/signup icon only if not authenticated */}
            {!isAuthenticated && (
              <Link to="/login" className="w-4">
                <img src="/images/person.svg" alt="person icon" />
              </Link>
            )}

            <Link
              to="/cart"
              className="relative w-5 h-5 flex items-center justify-center"
            >
              <img
                src="/images/mall.svg"
                alt="Cart"
                className="w-full h-full"
              />

              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* Show logout button only if authenticated */}
            {isAuthenticated && (
              <button
                onClick={logout}
                className="w-4 flex items-center justify-center cursor-pointer"
                title="Logout"
              >
                <FiLogOut className="w-5 h-5 text-red-500" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 focus:outline-none cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col gap-2 mt-2 pb-4 border-t pt-4 items-center text-center space-y-3">
            {(role === "admin" || role === "superadmin") && (
              <Link
                to="/admin-dashboard"
                className="text-blue-700 px-2 font-semibold"
              >
                Admin Dashboard
              </Link>
            )}
            <Link to="/" className="text-gray-700 px-2">
              TEA COLLECTIONS
            </Link>
            <Link to="/accessories" className="text-gray-700 px-2">
              ACCESSORIES
            </Link>
            <Link
              to="/cart"
              className="text-gray-700 px-2 flex items-center justify-center"
            >
              <img src="/images/mall.svg" alt="Cart" className="w-5 h-5 mr-2" />
              Cart
            </Link>

            {/* Show login link only if not authenticated */}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="text-gray-700 px-2 flex items-center justify-center"
              >
                <img
                  src="/images/person.svg"
                  alt="Login"
                  className="w-5 h-5 mr-2"
                />
                Login
              </Link>
            )}

            {/* Show logout button only if authenticated */}
            {isAuthenticated && (
              <button
                onClick={logout}
                className="flex items-center justify-center px-2 cursor-pointer text-red-500"
                title="Logout"
              >
                <FiLogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
