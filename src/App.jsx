import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Content from "./pages/Content";
import { useEffect, useState } from "react";
import VantaDotsBG from "./components/Hero";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("abya-dark-mode");
      if (stored) return stored === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("abya-dark-mode", darkMode);
    }
  }, [darkMode]);

  const renderPage = () => {
    switch (currentPage) {
      case "test":
        return <Content />;
      case "home":
      default:
        return (
          <div className="flex items-center justify-center min-h-[80vh]">
            <Home />
          </div>
        );
    }
  };

  return (
    <>
      {/* Hero animated background */}
      <VantaDotsBG darkMode={darkMode} />

      {/* Navbar and content */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
      />

      {/* Main content area */}
      <div className="pt-24 min-h-screen bg-transparent relative z-10 flex flex-col items-center justify-center">
        {renderPage()}
      </div>

      {/* Dark mode toggle button */}
      <button
        onClick={() => setDarkMode((d) => !d)}
        className="fixed left-6 bottom-6 z-50 p-3 rounded-full shadow-lg flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none transition-all duration-300 hover:from-purple-600 hover:to-blue-500 hover:scale-110 backdrop-blur-sm"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 0 1 12.79 3a1 1 0 0 0-1.13 1.13A7 7 0 1 0 20.87 13.92a1 1 0 0 0 1.13-1.13z" />
          </svg>
        ) : (
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        )}
      </button>
    </>
  );
}

export default App;
