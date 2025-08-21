import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar({ currentPage, setCurrentPage, darkMode }) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90vw] max-w-4xl rounded-2xl transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900/80 backdrop-blur-xl shadow-2xl border border-gray-700/30"
          : "bg-gray-900/60 backdrop-blur-md shadow-lg border border-gray-700/20"
      } flex items-center justify-between px-6 py-3`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-[#20ff96] to-[#00cc75] h-10 w-10 rounded-xl flex items-center justify-center shadow-lg">
          <svg
            className="h-6 w-6 text-gray-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#20ff96] to-[#00cc75] tracking-tight">
          <Link to={"/"}>Web3App</Link>
        </span>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-8">
        {[
          { name: "Home", page: "home" },
          { name: "Test", page: "test" },
        ].map((item) => (
          <button
            key={item.name}
            onClick={() => setCurrentPage && setCurrentPage(item.page)}
            className={`relative transition-all duration-300 group font-medium py-2
                  ${
                    currentPage === item.page
                      ? "text-[#20ff96] font-semibold"
                      : "text-gray-300 hover:text-[#20ff96] font-normal"
                  }
                `}
          >
            {item.name}
            <span
              className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300
                    ${
                      currentPage === item.page
                        ? "bg-gradient-to-r from-[#20ff96] to-[#00cc75] w-full"
                        : "bg-gradient-to-r from-[#20ff96] to-[#00cc75] w-0 group-hover:w-full"
                    }
                  `}
            ></span>
          </button>
        ))}
      </div>

      {/* Web3 Widget */}
      <div className="flex items-center gap-3">
        <DynamicWidget
          variant="dropdown"
          innerButtonComponent={
            <div className="px-4 py-2 bg-gradient-to-r from-[#20ff96] to-[#00cc75] text-gray-900 font-medium rounded-lg hover:shadow-lg hover:shadow-[#20ff96]/30 transition-all duration-300">
              AA Sign In
            </div>
          }
        />
      </div>
    </nav>
  );
}

export default Navbar;
