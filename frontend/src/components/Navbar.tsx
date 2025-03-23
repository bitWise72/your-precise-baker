import { Moon, Sun, X, Menu } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"

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
    localStorage.removeItem("user")
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    // ✅ Force full page reload to clear session
    window.location.href = "/"
  } catch (error) {
    console.error("Logout failed:", error)
  }
}

const Navbar = ({ darkMode, setDarkMode, name, image }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<{
    picture?: string
    name?: string
  } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem("user") || "{}")

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } shadow-sm relative z-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <a href="/home">
              <img
                src="./logo.png"
                alt="Bawarchi.AI Logo"
                className="w-16 object-contain"
              />
            </a>
            <div>
              <h1
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Bawarchi.AI
              </h1>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Your Personal Kitchen Assistant
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div
              className="text-center p-2.5 cursor-pointer font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors"
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
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <img
              src={
                user?.image ||
                `./assets/${Math.floor(Math.random() * 8) + 1}.png`
              }
              className="h-12 rounded-full object-cover"
              alt="User"
              crossOrigin="anonymous"
            />
            <div
              onClick={handleLogout}
              className="text-center p-2.5 cursor-pointer font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors"
            >
              Logout
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2.5 rounded-lg transition-colors ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
            }`}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu - Animated Dropdown */}
        <div
          ref={menuRef}
          className={`md:hidden fixed inset-x-0 transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <div
            className={`mx-4 mt-4 rounded-xl shadow-lg overflow-hidden ${
              darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
            }`}
          >
            <div className="p-2">
              {/* User Profile Section */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      user?.image ||
                      `./assets/${Math.floor(Math.random() * 8) + 1}.png`
                    }
                    className="h-10 w-10 rounded-full object-cover"
                    alt="User"
                    crossOrigin="anonymous"
                  />
                  <div>
                    <div
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {user?.name || "User"}
                    </div>
                    <div
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      View Profile
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="px-2 py-2 space-y-1">
                <button
                  onClick={() => {
                    navigate("/community")
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    darkMode
                      ? "text-white hover:bg-gray-700"
                      : "text-gray-900 hover:bg-gray-100"
                  } flex items-center space-x-3`}
                >
                  <span>Community</span>
                </button>

                <button
                  onClick={() => {
                    setDarkMode(!darkMode)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    darkMode
                      ? "text-white hover:bg-gray-700"
                      : "text-gray-900 hover:bg-gray-100"
                  } flex items-center space-x-3`}
                >
                  <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                  {darkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>

                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-3"
                >
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
