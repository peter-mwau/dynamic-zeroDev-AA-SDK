import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90vw] max-w-4xl rounded-2xl shadow-xl bg-white/80 backdrop-blur border border-gray-200 flex items-center justify-between px-8 py-3">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
        <span className="font-bold text-lg tracking-tight text-gray-900">
          <Link to={"/"}>Web3App</Link>
        </span>
      </div>
      {/* Navigation Links */}
      <div className="hidden md:flex gap-6 text-gray-700 font-medium">
        <Link to={"/content"} className="hover:text-blue-600 transition">
          Features
        </Link>
        <a href="#docs" className="hover:text-blue-600 transition">
          Docs
        </a>
        <a href="#about" className="hover:text-blue-600 transition">
          About
        </a>
      </div>
      {/* Web3 Widget */}
      <div className="flex items-center gap-2">
        <DynamicWidget
          variant="dropdown"
          innerButtonComponent={<>AA Sign In</>}
        />
      </div>
    </nav>
  );
}

export default Navbar;
