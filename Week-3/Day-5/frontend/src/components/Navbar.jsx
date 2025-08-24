import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { MdLogout } from "react-icons/md";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { cartItems } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Update admin status whenever authentication state changes
  useEffect(() => {
    const role = localStorage.getItem("roleOfTheUser");
    setIsAdmin(role === "admin" || role === "superAdmin");
  }, [isAuthenticated]); // This will run whenever isAuthenticated changes

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
              className="font-montserrat  text-[14px] font-normal leading-5 text-black hover:text-gray-500"
            >
              TEA COLLECTIONS
            </Link>
            <Link
              to="/accessories"
              className=" text-[14px] font-normal leading-5 text-black hover:text-gray-500"
            >
              ACCESSORIES
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-[14px] font-normal leading-5 text-black hover:text-gray-500"
              >
                ADMIN PAGE
              </Link>
            )}
            <Link
              to="/ "
              className="hidden lg:block text-[14px] font-normal leading-5 text-black hover:text-gray-500"
            >
              BLOGS
            </Link>
            <Link
              to="/ "
              className="hidden lg:block text-[14px] font-normal leading-5 text-black hover:text-gray-500"
            >
              CONTACT US
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex justify-center items-center space-x-10 mr-4 ">
            {/* Show logout button only if logged in */}
            {isAuthenticated && (
              <button
                onClick={logout}
                className="w-5 h-5 text-gray-700 hover:text-red-600 cursor-pointer"
              >
                <MdLogout size={20} />
              </button>
            )}

            <Link to="/signup" className=" w-4 ">
              <img src="/images/search.svg" alt="person" />
            </Link>

            {/* Show person icon only if NOT logged in */}
            {!isAuthenticated && (
              <Link to="/signup" className=" w-4 ">
                <img src="/images/person.svg" alt="person" />
              </Link>
            )}

            <Link
              to="/cart"
              className="w-5 h-5 flex items-center justify-center"
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
          <div className="md:hidden flex justify-center items-center gap-3 flex-col mt-2 pb-4 border-t pt-4">
            <Link
              to="/"
              className="font-montserrat  text-[14px] font-normal leading-5 text-black hover:text-gray-400"
            >
              TEA COLLECTIONS
            </Link>
            <Link
              to="/accessories"
              className=" text-[14px] font-normal leading-5 text-black hover:text-gray-400"
            >
              ACCESSORIES
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-[14px] font-normal leading-5 text-black hover:text-gray-400"
              >
                ADMIN PAGE
              </Link>
            )}
            <Link
              to="/ "
              className=" text-[14px] font-normal leading-5 text-black hover:text-gray-400"
            >
              <Link to="/login">
                <img src="/images/login.svg" alt="" />
              </Link>
              BLOGS
            </Link>
            <Link
              to="/ "
              className=" text-[14px] font-normal leading-5 text-black hover:text-gray-400"
            >
              CONTACT US
            </Link>
            <div className="flex gap-4 mt-2">
              {/* Show logout button only if logged in */}
              {isAuthenticated && (
                <button
                  onClick={logout}
                  className="w-5 h-5 text-gray-700 hover:text-red-600 cursor-pointer"
                >
                  <MdLogout size={20} />
                </button>
              )}

              {/* Show person icon only if NOT logged in */}
              {!isAuthenticated && (
                <Link to="/signup" className="w-4">
                  <img src="/images/person.svg" alt="person" />
                </Link>
              )}
              <Link
                to="/cart"
                className="relative w-4 h-4 flex flex-col items-center justify-center"
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
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
