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
const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;
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
            <a href="/">
            <img
              src="./logo.png"
              alt="Bawarchi.AI Logo"
              className="w-20 object-contain"
            />
            </a>
            </div>
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
              src={user?.image || user?.picture ||  `./assets/${Math.floor(Math.random() * 8) + 1}.png`}
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
  <div className="mt-4 md:hidden flex flex-col gap-5 p-6 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-500">
    
    {/* Community Button */}
    <div
      onClick={() => {
        setMenuOpen(false);
        navigate("/community");
      }}
      className="text-center p-3 cursor-pointer font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transition-all duration-300 shadow-lg"
    >
       Community
    </div>

    {/* Dark Mode Toggle */}
    <button
      onClick={() => {
        setDarkMode(!darkMode);
        setMenuOpen(false);
      }}
      className={`p-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
        darkMode
          ? "bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:brightness-125"
          : "bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:brightness-90"
      }`}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      <span className="text-sm font-semibold">{darkMode ? "Light Mode" : "Dark Mode"}</span>
    </button>

    {/* User Profile */}
    <div className="flex flex-col items-center space-y-3">
      <img
        src={user?.image || `./assets/${Math.floor(Math.random() * 8) + 1}.png`}
        className="h-20 w-20 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600 shadow-xl transform transition-all duration-300 hover:scale-110"
        alt="User"
      />
      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
         Welcome Back, <span className="font-bold">{user?.name || "Guest"}</span>!
      </p>
    </div>

    {/* Logout Button */}
    <div
      onClick={() => {
        setMenuOpen(false);
        handleLogout();
      }}
      className="text-center p-3 cursor-pointer font-semibold rounded-xl text-white bg-gradient-to-r from-red-500 to-rose-600 hover:scale-105 transition-all duration-300 shadow-lg"
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
