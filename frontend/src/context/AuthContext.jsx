import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('aarogya_user')
    const token = localStorage.getItem('aarogya_token')
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (token, userData) => {
    localStorage.setItem('aarogya_token', token)
    localStorage.setItem('aarogya_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('aarogya_token')
    localStorage.removeItem('aarogya_user')
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const res = await authAPI.me()
      localStorage.setItem('aarogya_user', JSON.stringify(res.data))
      setUser(res.data)
    } catch {
      // token invalid; interceptor will redirect
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshUser, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
