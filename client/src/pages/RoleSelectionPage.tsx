import { useNavigate } from 'react-router-dom'
import { GraduationCap, BookOpen, Building, UserCog, Shield } from 'lucide-react'
import type { UserRole } from '../contexts/AuthContext'

interface RoleOption {
  role: UserRole
  name: string
  description: string
  icon: typeof GraduationCap
  color: string
  bgColor: string
}

const roleOptions: RoleOption[] = [
  {
    role: 'student',
    name: 'Sinh viên',
    description: 'Thực hiện khảo sát đánh giá môn học',
    icon: GraduationCap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
  },
  {
    role: 'lecturer',
    name: 'Giảng viên',
    description: 'Xem kết quả và phản hồi đánh giá',
    icon: BookOpen,
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100 border-green-200',
  },
  {
    role: 'department',
    name: 'Khoa',
    description: 'Xem báo cáo và thống kê khoa',
    icon: Building,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
  },
  {
    role: 'academic_affairs',
    name: 'Phòng Đào tạo',
    description: 'Quản lý khảo sát toàn trường',
    icon: UserCog,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 hover:bg-amber-100 border-amber-200',
  },
  {
    role: 'admin',
    name: 'Quản trị viên',
    description: 'Quản trị hệ thống',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100 border-red-200',
  },
]

export function RoleSelectionPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Hệ thống Khảo sát Đánh giá Môn học</h1>
          <p className="text-xl text-gray-600">Vui lòng chọn loại tài khoản của bạn để tiếp tục</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roleOptions.map((option) => {
            const Icon = option.icon
            return (
              <button
                key={option.role}
                type="button"
                onClick={() => navigate('/login/sign-in', { state: { selectedRole: option.role } })}
                className={`${option.bgColor} border-2 rounded-2xl p-8 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl text-left`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`${option.color} mb-4`}>
                    <Icon className="w-16 h-16" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{option.name}</h2>
                  <p className="text-gray-600">{option.description}</p>
                </div>
              </button>
            )
          })}
        </div>



        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2026 Trường Đại học Công nghệ Thông tin - UIT</p>
        </div>
      </div>
    </div>
  )
}
