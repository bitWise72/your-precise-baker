import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import GoogleAuth from "./GoogleAuth"

const Login = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate("/home")
  }, [user, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome to Bawarchi.AI
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Your Personal Kitchen Assistant
        </p>

        <div className="flex justify-center">
          <GoogleAuth />
        </div>
        <p className="text-sm text-gray-500 text-center mt-6">
          By logging in, you agree to our{" "}
          <a href="/terms" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default Login
