import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, ArrowLeft, Plus, Search, Edit, Trash2 } from 'lucide-react'
import { subjectAPI } from '../api'
import type { Subject } from '../types'

export default function SubjectManagementPage() {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading subjects...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="w-5 h-5" />
              <span>Thêm môn học</span>
            </button>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm kiếm theo mã môn học, tên môn học hoặc giảng viên..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" />
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
                        <button className="text-green-600 hover:text-green-900" title="Chỉnh sửa"><Edit className="w-5 h-5" /></button>
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
    </div>
  )
}
