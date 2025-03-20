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
    <div>
      <h1>Login</h1>
      <GoogleAuth/>
    </div>
  )
}

export default Login
