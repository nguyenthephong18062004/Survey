import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Lock,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  Building,
  UserCog,
  Shield,
} from 'lucide-react'
import { useAuth, type UserRole } from '../contexts/AuthContext'

const roleInfo: Record<UserRole, { name: string; icon: typeof GraduationCap; color: string; ring: string; btn: string }> =
  {
    student: { name: 'Sinh viên', icon: GraduationCap, color: 'blue', ring: 'focus:ring-blue-500', btn: 'bg-blue-600 hover:bg-blue-700' },
    lecturer: { name: 'Giảng viên', icon: BookOpen, color: 'green', ring: 'focus:ring-green-500', btn: 'bg-green-600 hover:bg-green-700' },
    department: { name: 'Khoa', icon: Building, color: 'purple', ring: 'focus:ring-purple-500', btn: 'bg-purple-600 hover:bg-purple-700' },
    academic_affairs: {
      name: 'Phòng Đào tạo',
      icon: UserCog,
      color: 'amber',
      ring: 'focus:ring-amber-500',
      btn: 'bg-amber-600 hover:bg-amber-700',
    },
    admin: { name: 'Quản trị viên', icon: Shield, color: 'red', ring: 'focus:ring-red-500', btn: 'bg-red-600 hover:bg-red-700' },
  }

const roleIconBg: Record<UserRole, string> = {
  student: 'bg-blue-100',
  lecturer: 'bg-green-100',
  department: 'bg-purple-100',
  academic_affairs: 'bg-amber-100',
  admin: 'bg-red-100',
}

const roleIconFg: Record<UserRole, string> = {
  student: 'text-blue-600',
  lecturer: 'text-green-600',
  department: 'text-purple-600',
  academic_affairs: 'text-amber-600',
  admin: 'text-red-600',
}

const roleText: Record<UserRole, string> = {
  student: 'text-blue-600',
  lecturer: 'text-green-600',
  department: 'text-purple-600',
  academic_affairs: 'text-amber-600',
  admin: 'text-red-600',
}

const roleDemoBg: Record<UserRole, string> = {
  student: 'bg-blue-50 border-blue-200',
  lecturer: 'bg-green-50 border-green-200',
  department: 'bg-purple-50 border-purple-200',
  academic_affairs: 'bg-amber-50 border-amber-200',
  admin: 'bg-red-50 border-red-200',
}

const roleDemoText: Record<UserRole, string> = {
  student: 'text-blue-900',
  lecturer: 'text-green-900',
  department: 'text-purple-900',
  academic_affairs: 'text-amber-900',
  admin: 'text-red-900',
}

const roleDemoMuted: Record<UserRole, string> = {
  student: 'text-blue-700',
  lecturer: 'text-green-700',
  department: 'text-purple-700',
  academic_affairs: 'text-amber-700',
  admin: 'text-red-700',
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const selectedRole = (location.state as { selectedRole?: UserRole } | null)?.selectedRole

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!selectedRole) {
      navigate('/login', { replace: true })
    }
  }, [selectedRole, navigate])

  if (!selectedRole) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) {
      setError('Vui lòng nhập đầy đủ thông tin')
      return
    }
    setLoading(true)
    try {
      const success = await login(username.trim(), password)
      if (success) {
        navigate('/')
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng')
      }
    } catch {
      setError('Đã xảy ra lỗi, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  const role = roleInfo[selectedRole]
  const RoleIcon = role.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Chọn vai trò khác</span>
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${roleIconBg[selectedRole]} mb-4`}>
              <RoleIcon className={`w-10 h-10 ${roleIconFg[selectedRole]}`} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
            <p className="text-gray-600">
              Dành cho <span className={`font-semibold ${roleText[selectedRole]}`}>{role.name}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ${role.ring} focus:border-transparent outline-none`}
                  placeholder="Nhập tên đăng nhập"
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                {selectedRole !== 'admin' && (
                  <button
                    type="button"
                    onClick={() => navigate('/login/forgot')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 ${role.ring} focus:border-transparent outline-none`}
                  placeholder="Nhập mật khẩu"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={loading}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 ${role.btn} text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Đăng nhập</span>
                </>
              )}
            </button>
          </form>


        </div>

        <p className="text-center mt-6 text-gray-600 text-sm">
          <Link to="/" className="text-blue-600 font-medium hover:underline">
            ← Về trang chức năng
          </Link>
        </p>
        <div className="text-center mt-4 text-gray-500 text-sm">
          <p>© 2026 Trường Đại học Công nghệ Thông tin - UIT</p>
        </div>
      </div>
    </div>
  )
}
