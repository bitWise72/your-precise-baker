import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_PORT}/auth/me`, { withCredentials: true })
        setUser(res.data)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  const login = async (email, password) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_PORT}/auth/login`, { email, password }, { withCredentials: true })
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_PORT}/auth/me`, { withCredentials: true })
      setUser(res.data) // ✅ Ensure user state is updated after login
    } catch (error) {
      console.error("Login failed", error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
