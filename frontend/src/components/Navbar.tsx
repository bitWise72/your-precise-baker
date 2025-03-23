import { Sun, Moon, Menu, X } from "lucide-react"; 
import { useNavigate } from "react-router-dom"
import React, { useState } from "react";

interface NavbarProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  name: string | null
  image: string | null
}

const handleLogout = async () => {
  try {
    await fetch(`${import.meta.env.VITE_BACKEND_PORT}/auth/logout`, {
      method: "GET",
      credentials: "include",
    })

    // ✅ Clear ALL stored authentication data
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    // ✅ Force full page reload to clear session
    window.location.href = "/"
  } catch (error) {
    console.error("Logout failed:", error)
  }
}

const Navbar = ({ darkMode, setDarkMode, name, image }: NavbarProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  return (
    // <header className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    //     <div className="flex items-center justify-between">
    //       <div className="flex items-center space-x-3">
    //         <img
    //           src="./logo.png"
    //           alt="Bawarchi.AI Logo"
    //           className="w-20   object-contain"
    //         />
    //         <div>
    //           <h1 className="text-2xl font-bold">Bawarchi.AI</h1>
    //           <p
    //             className={`text-sm ${
    //               darkMode ? "text-gray-300" : "text-gray-600"
    //             }`}
    //           >
    //             Your Personal Kitchen Assistant
    //           </p>
    //         </div>
    //       </div>

    //       <div className="flex items-center space-x-4">
    //         <div
    //           className="text-center p-2.5 cursor-pointer lg:font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors font-normal"
    //           onClick={() => {
    //             navigate("/community")
    //           }}
    //         >
    //           Community
    //         </div>
    //         <button
    //           onClick={() => setDarkMode(!darkMode)}
    //           className={`p-2 rounded-lg ${
    //             darkMode
    //               ? "bg-gray-700 hover:bg-gray-600 text-white"
    //               : "bg-gray-100 hover:bg-gray-200 text-gray-900"
    //           } transition-colors`}
    //           aria-label={
    //             darkMode ? "Switch to light mode" : "Switch to dark mode"
    //           }
    //         >
    //           {darkMode ? (
    //             <Sun className="h-5 w-5" />
    //           ) : (
    //             <Moon className="h-5 w-5" />
    //           )}
    //         </button>
    //         <div className="flex items-center space-x-4">
    //           <img
    //             src={`./assets/${Math.floor(Math.random() * 8) + 1}.png`}
    //             // src={`../${Math.floor(Math.random() * 8) + 1}.jpg`}
    //             className="h-16 rounded-full"
    //             alt="User"
    //           />
    //         </div>
    //         <div>
    //           <div
    //             onClick={handleLogout}
    //             className="text-center p-2.5 cursor-pointer lg:font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors font-normal"
    //           >
    //             Logout
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </header>

    <header className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <img
              src="./logo.png"
              alt="Bawarchi.AI Logo"
              className="w-20 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold">Bawarchi.AI</h1>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Your Personal Kitchen Assistant
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div
              className="text-center p-2.5 cursor-pointer lg:font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors font-normal"
              onClick={() => navigate("/community")}
            >
              Community
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <img
              src={`./assets/${Math.floor(Math.random() * 8) + 1}.png`}
              className="h-16 w-16 rounded-full object-cover"
              alt="User"
            />
            <div
              onClick={handleLogout}
              className="text-center p-2.5 cursor-pointer lg:font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors font-normal"
            >
              Logout
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
  <div className="mt-4 md:hidden flex flex-col gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
    <div
      onClick={() => {
        setMenuOpen(false);
        navigate("/community");
      }}
      className="text-center p-3 cursor-pointer font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-md"
    >
      Community
    </div>
    <button
      onClick={() => {
        setDarkMode(!darkMode);
        setMenuOpen(false);
      }}
      className={`p-3 rounded-lg transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
        darkMode
          ? "bg-gray-700 hover:bg-gray-600 text-white"
          : "bg-white hover:bg-gray-200 text-gray-900"
      }`}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="text-sm font-medium">{darkMode ? "Light Mode" : "Dark Mode"}</span>
    </button>
    <div className="flex flex-col items-center">
      <img
        src={`./assets/${Math.floor(Math.random() * 8) + 1}.png`}
        className="h-16 w-16 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 shadow-md"
        alt="User"
      />
      <p className="text-sm mt-2 text-gray-600 dark:text-gray-300 font-medium">
        Welcome Back!
      </p>
    </div>
    <div
      onClick={() => {
        setMenuOpen(false);
        handleLogout();
      }}
      className="text-center p-3 cursor-pointer font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-md"
    >
      Logout
    </div>
  </div>
)}

      </div>
    </header>

  )
}

export default Navbar
