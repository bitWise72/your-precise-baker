import { Moon, Sun } from "lucide-react"

interface NavbarProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  name: string | null
  image: string | null
}

const handleLogout = async () => {
  try {
    await fetch("http://localhost:5000/auth/logout", {
      method: "GET",
      credentials: "include",
    })

    // ✅ Clear ALL stored authentication data
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    // ✅ Force full page reload to clear session
    window.location.href = "/login"
  } catch (error) {
    console.error("Logout failed:", error)
  }
}

const Navbar = ({ darkMode, setDarkMode, name, image }: NavbarProps) => {
  return (
    <header className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-primary w-10 h-10 flex items-center justify-center text-white font-bold text-lg">
              B
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

          <div className="flex items-center space-x-4">
            <div className="text-center p-2.5 cursor-pointer lg:font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors font-normal">
              Community
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              } transition-colors`}
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
            <div className="flex items-center space-x-4">
              <img
                src={`./assets/${Math.floor(Math.random() * 8) + 1}.png`}
                // src={`../${Math.floor(Math.random() * 8) + 1}.jpg`}
                className="h-16 rounded-full"
                alt="User"
              />
            </div>
            <div>
              <div
                onClick={handleLogout}
                className="text-center p-2.5 cursor-pointer lg:font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors font-normal"
              >
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
