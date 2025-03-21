import React from "react"

const GoogleAuth: React.FC = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_PORT}/auth/google`
  }

  return (
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-blue-500 text-white rounded "
    >
      Login with Google
    </button>
  )
}

export default GoogleAuth
interface User {
  id: string
  name: string
  email: string
  picture: string
}

function setUser(user: User) {
  throw new Error("Function not implemented.")
}
