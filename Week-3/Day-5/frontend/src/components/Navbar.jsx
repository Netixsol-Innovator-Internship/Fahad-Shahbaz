import { logo, person, search, cart } from "../assets/index.js"

const Navbar = () => {
  return (
    <nav className="py-10">
      <div className="container mx-auto px-6 lg:px-16 flex justify-between items-center">
        {/* Logo/Brand Name */}
        <div className="text-lg md:text-xl font-bold text-gray-800 flex items-center justify-center">
          <img src={logo} alt="Brand Logo" className="h-8 mr-2" />
          <a href="/">
            Brand Name
          </a>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex space-x-8">
          <a
            href="/Collections"
            className="text-[#282828] hover:text-gray-400 transition duration-300"
          >
            TEA COLLECTIONS
          </a>
          <a
            href="#"
            className="text-[#282828] hover:text-gray-400 transition duration-300"
          >
            ACCESSORIES
          </a>
          <a
            href="#"
            className="text-[#282828] hover:text-gray-400 transition duration-300"
          >
            BLOG
          </a>
          <a
            href="#"
            className="text-[#282828] hover:text-gray-400 transition duration-300"
          >
            CONTACT US
          </a>
        </div>

        {/* Icons - Placeholder for your SVGs */}
        <div className="hidden lg:flex items-center space-x-6">
          <button className="focus:outline-none">
            {/* Replace with your SVG */}
            <img src={search} alt="Search" className="h-5 w-5" />
          </button>
          <button className="focus:outline-none">
            {/* Replace with your SVG */}
            <img src={person} alt="Person" className="h-5 w-5" />
          </button>
          <button className="focus:outline-none">
            {/* Replace with your SVG */}
            <img src={cart} alt="Cart" className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu - Hidden by default */}
    </nav>
  );
};

export default Navbar;
