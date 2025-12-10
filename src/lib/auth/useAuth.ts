'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { User } from '@/types'
import { verifyJWT } from './jwt'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (token: string) => void
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = (newToken: string) => {
    localStorage.setItem('auth_token', newToken)
    setToken(newToken)

    // Decode token to get user info
    const payload = verifyJWT(newToken)
    if (payload) {
      // Note: In a real app, you'd want to fetch full user data from API
      setUser({
        id: payload.userId,
        email: payload.email,
        name: '', // Would be fetched from API
        role: payload.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setToken(null)
    setUser(null)
  }

  const checkAuth = async () => {
    setIsLoading(true)

    try {
      const storedToken = localStorage.getItem('auth_token')

      if (!storedToken) {
        setIsLoading(false)
        return
      }

      // Verify token locally first
      const payload = verifyJWT(storedToken)
      if (!payload) {
        logout()
        setIsLoading(false)
        return
      }

      // Verify token with server and get full user data
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setToken(storedToken)
          setUser(result.data)
        } else {
          logout()
        }
      } else {
        logout()
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
