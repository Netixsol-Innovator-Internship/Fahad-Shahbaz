import { useState } from "react";

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  return (
    <header className="bg-[#313131] py-3 md:py-0">
      <div className="mx-auto text-xs">
        <div className="flex items-center justify-between ">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 pl-4">
              <img src="/logo.png" alt="Logo" className="w-7 h-9" />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-300 hover:text-blue-400">
                STORE
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400">
                FAQ
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400">
                HELP
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400">
                UNREAL ENGINE
              </a>
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Hide icons and download button on mobile */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-gray-300 hover:text-white cursor-pointer">
                <img src="/globe.svg" alt="Logo" />
              </div>
              <div className="text-gray-300 hover:text-white cursor-pointer space-x-2">
                <img
                  src="/person.svg"
                  alt="person"
                  className=" inline-block pb-1"
                />
                <p className=" inline-block text-xs">SIGN IN</p>
              </div>
              <div className="text-sm bg-[#007AFF] hover:bg-blue-700 text-white px-5 py-3 cursor-pointer">
                <p>DOWNLOAD</p>
              </div>
            </div>
          </div>
          {/* Hamburger for mobile on right */}
          <button
            className="md:hidden ml-2 pr-4 focus:outline-none cursor-pointer"
            aria-label="Open navigation menu"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            <svg
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-80 md:hidden transition-all">
            <div className="flex flex-row w-full h-full justify-end">
              <div className="relative bg-[#222] w-4/5 max-w-xs h-full flex flex-col items-center py-10 shadow-xl">
                <button
                  className="absolute top-6 right-6 text-gray-300 focus:outline-none"
                  aria-label="Close navigation menu"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <svg
                    width="32"
                    height="32"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <nav className="flex flex-col space-y-8 text-center mt-8">
                  <a
                    href="#"
                    className="text-gray-300 text-xl hover:text-blue-400"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    STORE
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 text-xl hover:text-blue-400"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    FAQ
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 text-xl hover:text-blue-400"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    HELP
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 text-xl hover:text-blue-400"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    UNREAL ENGINE
                  </a>
                  {/* Show icons and download button in mobile menu */}
                  <div className="flex flex-col items-center space-y-6 mt-10">
                    <div className="text-gray-300 hover:text-white cursor-pointer">
                      <img src="/globe.svg" alt="Logo" />
                    </div>
                    <div className="text-gray-300 hover:text-white cursor-pointer space-x-2 flex items-center">
                      <img
                        src="/person.svg"
                        alt="person"
                        className=" inline-block pb-1"
                      />
                      <p className=" inline-block text-lg">SIGN IN</p>
                    </div>
                    <div className="text-lg bg-[#007AFF] hover:bg-blue-700 text-white px-8 py-4 cursor-pointer rounded">
                      <p>DOWNLOAD</p>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
