import { useState, useEffect } from 'react'
import { ArrowLeft, Save, User, Mail, Phone, MapPin, IdCard, Building, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { userAPI } from '../api'

type RoleType = 'student' | 'lecturer' | 'teacher' | 'department' | 'academic_affairs' | 'admin' | undefined

type StudentForm = {
  fullName: string
  email: string
  email2: string
  phone: string
  address: string
  studentId: string
  dob: string
  gender: string
  status: string
  idNumber: string
  ethnicity: string
  religion: string
  placeOfBirth: string
  nationality: string
  className: string
  major: string
  program: string
  cohort: string
}

type TeacherForm = {
  fullName: string
  email: string
  email2: string
  phone: string
  address: string
  employeeId: string
  department: string
  position: string
  office: string
  specialty: string
}

type GenericForm = {
  fullName: string
  email: string
  phone: string
  address: string
}

const getInitialForm = (user: any, role: RoleType) => {
  const base: GenericForm = {
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  }

  if (role === 'student') {
    return {
      ...base,
      email2: user?.email2 || '',
      studentId: user?.studentId || user?.username || String(user?.id || ''),
      dob: user?.dob || '',
      gender: user?.gender || '',
      status: user?.status || 'Đang học',
      idNumber: user?.idNumber || '',
      ethnicity: user?.ethnicity || '',
      religion: user?.religion || '',
      placeOfBirth: user?.placeOfBirth || '',
      nationality: user?.nationality || 'Việt Nam',
      className: user?.className || user?.class || '',
      major: user?.major || '',
      program: user?.program || 'Chương trình đào tạo Bằng 2 CDIO 4.5 năm hệ CQ',
      cohort: user?.cohort || '2022-2027',
    } as StudentForm
  }

  if (role === 'lecturer' || role === 'teacher') {
    return {
      ...base,
      email2: user?.email2 || '',
      employeeId: user?.employeeId || user?.username || String(user?.id || ''),
      department: user?.department || user?.faculty || '',
      position: user?.position || 'Giảng viên',
      office: user?.office || '',
      specialty: user?.specialty || '',
    } as TeacherForm
  }

  return base as GenericForm
}

export default function UpdateInfoPage() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<StudentForm | TeacherForm | GenericForm>(getInitialForm(null, undefined))

  useEffect(() => {
    if (user) {
      setForm(getInitialForm(user, user.role))
    }
  }, [user])

  const role = user?.role
  const isStudent = role === 'student'
  const isInstructor = role === 'lecturer' || role === 'teacher'

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      const payload: any = {
        email: form.email,
        fullName: form.fullName,
        role: user.role,
      }

      if (isStudent) {
        payload.username = (form as StudentForm).studentId
        payload.status = (form as StudentForm).status
        payload.department = ''
      } else if (isInstructor) {
        payload.username = (form as TeacherForm).employeeId
        payload.department = (form as TeacherForm).department
        payload.status = 'active'
      } else {
        payload.username = user.username || user.email.split('@')[0]
      }

      const updatedUser = await userAPI.update(user.id, payload)
      updateUser({
        ...updatedUser,
        name: updatedUser.fullName || updatedUser.name || form.fullName,
        email: updatedUser.email || form.email,
        username: updatedUser.username || (isStudent ? (form as StudentForm).studentId : isInstructor ? (form as TeacherForm).employeeId : user.username),
        department: updatedUser.department || (isInstructor ? (form as TeacherForm).department : undefined),
        status: updatedUser.status || (isStudent ? (form as StudentForm).status : 'active')
      })

      setForm(getInitialForm({ ...user, ...form, ...updatedUser }, role))
      alert('Cập nhật thông tin thành công')
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'Cập nhật thông tin thất bại')
    } finally {
      setSaving(false)
    }
  }

  const renderStudentForm = () => (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600"><IdCard className="w-5 h-5" /></div>
            <div>
              <h2 className="text-xl font-semibold">Thông tin sinh viên</h2>
              <p className="text-sm text-slate-600">Chi tiết hồ sơ cá nhân sinh viên</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Mã SV', key: 'studentId' },
              { label: 'Ngày sinh', key: 'dob' },
              { label: 'Giới tính', key: 'gender' },
              { label: 'Trạng thái', key: 'status' },
              { label: 'Số điện thoại', key: 'phone' },
              { label: 'Số CMND/CCCD', key: 'idNumber' },
              { label: 'Dân tộc', key: 'ethnicity' },
              { label: 'Tôn giáo', key: 'religion' },
              { label: 'Nơi sinh', key: 'placeOfBirth' },
              { label: 'Quốc tịch', key: 'nationality' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-slate-700 mb-2">{field.label}</label>
                <input
                  value={(form as StudentForm)[field.key as keyof StudentForm] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600"><Building className="w-5 h-5" /></div>
            <div>
              <h2 className="text-xl font-semibold">Thông tin khóa học</h2>
              <p className="text-sm text-slate-600">Thông tin chuyên ngành và niên khóa</p>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              { label: 'Lớp', key: 'className' },
              { label: 'Ngành', key: 'major' },
              { label: 'Chương trình', key: 'program' },
              { label: 'Niên khóa', key: 'cohort' },
              { label: 'Email 1', key: 'email' },
              { label: 'Email 2', key: 'email2' },
              { label: 'Địa chỉ', key: 'address', textarea: true },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-slate-700 mb-2">{field.label}</label>
                {field.textarea ? (
                  <textarea
                    value={(form as StudentForm)[field.key as keyof StudentForm] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white shadow-sm focus:border-blue-500 focus:outline-none resize-none"
                    rows={3}
                  />
                ) : (
                  <input
                    value={(form as StudentForm)[field.key as keyof StudentForm] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white shadow-sm focus:border-blue-500 focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )

  const renderTeacherForm = () => (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-violet-100 rounded-xl text-violet-600"><Shield className="w-5 h-5" /></div>
            <div>
              <h2 className="text-xl font-semibold">Thông tin giảng viên</h2>
              <p className="text-sm text-slate-600">Chi tiết hồ sơ công tác giảng viên</p>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              { label: 'Mã giảng viên', key: 'employeeId' },
              { label: 'Tên giảng viên', key: 'fullName' },
              { label: 'Bộ môn', key: 'department' },
              { label: 'Chức vụ', key: 'position' },
              { label: 'Số điện thoại', key: 'phone' },
              { label: 'Email 1', key: 'email' },
              { label: 'Email 2', key: 'email2' },
              { label: 'Văn phòng', key: 'office' },
              { label: 'Chuyên môn', key: 'specialty' },
              { label: 'Địa chỉ', key: 'address', textarea: true },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-slate-700 mb-2">{field.label}</label>
                {field.textarea ? (
                  <textarea
                    value={(form as TeacherForm)[field.key as keyof TeacherForm] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white shadow-sm focus:border-blue-500 focus:outline-none resize-none"
                    rows={3}
                  />
                ) : (
                  <input
                    value={(form as TeacherForm)[field.key as keyof TeacherForm] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white shadow-sm focus:border-blue-500 focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )

  const renderGenericForm = () => (
    <div className="grid gap-6 lg:grid-cols-2">
      {[
        { label: 'Họ và tên', key: 'fullName', icon: User },
        { label: 'Email', key: 'email', icon: Mail },
        { label: 'Số điện thoại', key: 'phone', icon: Phone },
      ].map((field) => {
        const Icon = field.icon
        return (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={(form as GenericForm)[field.key as keyof GenericForm] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )
      })}
      <div className="lg:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            value={(form as GenericForm).address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg resize-none"
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white rounded-lg transition-colors"><ArrowLeft className="w-6 h-6" /></button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cập nhật thông tin cá nhân</h1>
            <p className="text-gray-600 mt-1">
              {isStudent
                ? 'Chỉnh sửa thông tin sinh viên của bạn'
                : isInstructor
                ? 'Chỉnh sửa thông tin giảng viên của bạn'
                : 'Cập nhật thông tin tài khoản của bạn'}
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          {isStudent && renderStudentForm()}
          {isInstructor && renderTeacherForm()}
          {!isStudent && !isInstructor && renderGenericForm()}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button disabled={saving} className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70" type="submit">
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
            <button type="button" onClick={() => navigate('/')} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
