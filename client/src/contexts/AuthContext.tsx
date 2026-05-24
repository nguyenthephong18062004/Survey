import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authAPI } from '../api'

export type UserRole = 'student' | 'lecturer' | 'department' | 'academic_affairs' | 'admin' | 'teacher'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (path: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const rolePermissions: Record<string, string[]> = {
  student: ['/subjects-to-evaluate', '/survey', '/survey-status', '/update-info'],
  teacher: ['/evaluation-results', '/feedback-statistics', '/reports/subject', '/update-info'],
  department: ['/reports/subject', '/reports/teacher', '/export-report', '/reports/school'],
  academic_affairs: [
    '/survey-management',
    '/reports/school',
    '/reports/subject',
    '/reports/teacher',
    '/export-report',
  ],
  admin: [
    '/users',
    '/subjects',
    '/semesters',
    '/survey-management',
    '/reports/subject',
    '/reports/teacher',
    '/reports/school',
    '/export-report',
  ],
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const userData = await authAPI.getMe()
          setUser(userData)
          localStorage.setItem('userRole', userData.role)
        } catch (error) {
          console.error("Auth init failed", error)
          localStorage.removeItem('token')
          localStorage.removeItem('userRole')
        }
      } else {
        localStorage.removeItem('userRole')
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await authAPI.login({ email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('userRole', data.user.role)
      setUser(data.user)
      return true
    } catch (error) {
      console.error('Login failed', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
  }

  const hasPermission = (path: string): boolean => {
    if (!user) return false
    const permissions = rolePermissions[user.role] || []
    return permissions.includes(path)
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
