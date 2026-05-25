import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, ArrowLeft, Plus, Search, Edit, Trash2, X, CheckCircle } from 'lucide-react'
import { subjectAPI } from '../api'
import type { Subject } from '../types'

const initialFormState: Omit<Subject, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'> = {
  code: '',
  name: '',
  credits: 0,
  description: '',
  lecturerName: '',
  lecturerEmail: '',
  status: 'active'
}

export default function SubjectManagementPage() {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showFormModal, setShowFormModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [formData, setFormData] = useState({ ...initialFormState })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadSubjects()
  }, [])

  const loadSubjects = async () => {
    try {
      const data = await subjectAPI.getAll()
      setSubjects(data)
    } catch (error) {
      console.error('Failed to load subjects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSubjects = subjects
    .filter((s) => !s.isDeleted)
    .filter((s) => 
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.lecturerName.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const handleDelete = async (subject: Subject) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa môn học "${subject.name}"?`)) {
      try {
        await subjectAPI.delete(subject.id)
        loadSubjects()
      } catch (error) {
        console.error('Failed to delete subject:', error)
      }
    }
  }

  const resetForm = () => {
    setSelectedSubject(null)
    setIsEditing(false)
    setFormData({ ...initialFormState })
    setFormErrors({})
  }

  const handleCreate = () => {
    resetForm()
    setShowFormModal(true)
  }

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject)
    setFormData({
      code: subject.code,
      name: subject.name,
      credits: subject.credits,
      description: subject.description,
      lecturerName: subject.lecturerName,
      lecturerEmail: subject.lecturerEmail,
      status: subject.status
    })
    setIsEditing(true)
    setShowFormModal(true)
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.code.trim()) errors.code = 'Mã môn học không được để trống'
    if (!formData.name.trim()) errors.name = 'Tên môn học không được để trống'
    if (!formData.lecturerName.trim()) errors.lecturerName = 'Tên giảng viên không được để trống'
    if (!formData.lecturerEmail.trim()) errors.lecturerEmail = 'Email giảng viên không được để trống'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) return

    try {
      const payload = {
        code: formData.code,
        name: formData.name,
        credits: formData.credits,
        description: formData.description,
        lecturerName: formData.lecturerName,
        lecturerEmail: formData.lecturerEmail,
        status: formData.status
      }

      if (isEditing && selectedSubject) {
        await subjectAPI.update(selectedSubject.id, payload)
      } else {
        await subjectAPI.create(payload)
      }

      setShowFormModal(false)
      loadSubjects()
    } catch (error) {
      console.error('Failed to save subject:', error)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading subjects...</div>
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý danh sách môn học</h1>
                <p className="text-gray-600 mt-1">Tổng số: {filteredSubjects.length} môn học</p>
              </div>
            </div>
                <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Thêm môn học</span>
                </button>

                <div className="relative w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm môn học..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg"
                  />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã môn học</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên môn học</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tín chỉ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giảng viên</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{subject.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{subject.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{subject.credits}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{subject.lecturerName}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(subject)} className="text-green-600 hover:text-green-900" title="Chỉnh sửa"><Edit className="w-5 h-5" /></button>
                        <button onClick={() => handleDelete(subject)} className="text-red-600 hover:text-red-900" title="Xóa"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">{isEditing ? 'Chỉnh sửa môn học' : 'Thêm môn học mới'}</h3>
                <p className="text-gray-600 mt-1">Nhập thông tin chi tiết để lưu môn học.</p>
              </div>
              <button onClick={() => setShowFormModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-7 h-7" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Mã môn học</label>
                  <input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    placeholder="Nhập mã môn học"
                  />
                  {formErrors.code && <p className="text-sm text-red-600 mt-1">{formErrors.code}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Tên môn học</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    placeholder="Nhập tên môn học"
                  />
                  {formErrors.name && <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Số tín chỉ</label>
                  <input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    placeholder="Số tín chỉ"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Tên giảng viên</label>
                  <input
                    value={formData.lecturerName}
                    onChange={(e) => setFormData({ ...formData, lecturerName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    placeholder="Nhập tên giảng viên"
                  />
                  {formErrors.lecturerName && <p className="text-sm text-red-600 mt-1">{formErrors.lecturerName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email giảng viên</label>
                  <input
                    type="email"
                    value={formData.lecturerEmail}
                    onChange={(e) => setFormData({ ...formData, lecturerEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    placeholder="Nhập email giảng viên"
                  />
                  {formErrors.lecturerEmail && <p className="text-sm text-red-600 mt-1">{formErrors.lecturerEmail}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none"
                  placeholder="Mô tả ngắn về môn học"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  {isEditing ? 'Cập nhật' : 'Thêm môn học'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
