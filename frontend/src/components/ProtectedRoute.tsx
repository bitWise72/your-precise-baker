import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth()

  if (loading) return <p>Loading...</p>
  if (!user) return <Navigate to="/" />

  return children
}

export default ProtectedRoute
