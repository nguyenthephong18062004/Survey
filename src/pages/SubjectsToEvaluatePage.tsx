import { useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, Clock, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type Subject = {
  id: number
  code: string
  name: string
  teacher: string
  credits: number
  status: 'submitted' | 'pending'
}

import { subjectAPI, surveyAssignmentAPI } from '../data/mockData'

export default function SubjectsToEvaluatePage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'pending'>('all')

  const assignments = surveyAssignmentAPI.getAll()
  const subjects = subjectAPI.getAll()
  
  const mockSubjects = useMemo(() => {
    const assignedSubjectIds = Array.from(new Set(assignments.map(a => a.subjectId)))
    return assignedSubjectIds.map(id => {
      const s = subjects.find(sub => sub.id === id)
      return s ? {
        id: s.id,
        code: s.code,
        name: s.name,
        teacher: s.lecturer.name,
        credits: s.credits,
        status: 'pending' as const // Default to pending as we don't track submissions yet
      } : null
    }).filter(Boolean) as Subject[]
  }, [assignments, subjects])

  const filtered = useMemo(
    () =>
      mockSubjects.filter((subject) => {
        const matchesFilter = filterStatus === 'all' || subject.status === filterStatus
        const q = searchTerm.toLowerCase()
        const matchesSearch = subject.code.toLowerCase().includes(q) || subject.name.toLowerCase().includes(q) || subject.teacher.toLowerCase().includes(q)
        return matchesFilter && matchesSearch
      }),
    [filterStatus, searchTerm],
  )

  const submitted = mockSubjects.filter((s) => s.status === 'submitted').length
  const pending = mockSubjects.filter((s) => s.status === 'pending').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Danh sách môn học cần đánh giá</h1>
            <p className="text-gray-600 mt-1">Theo dõi và thực hiện khảo sát học kỳ hiện tại</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5"><p className="text-sm text-gray-600">Tổng số môn</p><p className="text-3xl font-bold">{mockSubjects.length}</p></div>
          <div className="bg-white rounded-xl shadow-sm p-5"><p className="text-sm text-gray-600">Đã gửi</p><p className="text-3xl font-bold text-green-600">{submitted}</p></div>
          <div className="bg-white rounded-xl shadow-sm p-5"><p className="text-sm text-gray-600">Chưa gửi</p><p className="text-3xl font-bold text-red-600">{pending}</p></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm theo mã môn, tên môn, giảng viên..." className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setFilterStatus('all')} className={`px-4 py-2 rounded-lg ${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Tất cả</button>
              <button onClick={() => setFilterStatus('submitted')} className={`px-4 py-2 rounded-lg ${filterStatus === 'submitted' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Đã gửi</button>
              <button onClick={() => setFilterStatus('pending')} className={`px-4 py-2 rounded-lg ${filterStatus === 'pending' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>Chưa gửi</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã môn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên môn học</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giảng viên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((subject) => (
                <tr key={subject.id}>
                  <td className="px-6 py-4">{subject.code}</td>
                  <td className="px-6 py-4">{subject.name}</td>
                  <td className="px-6 py-4">{subject.teacher}</td>
                  <td className="px-6 py-4">
                    {subject.status === 'submitted' ? (
                      <div className="inline-flex items-center gap-1 text-green-600"><CheckCircle2 className="w-4 h-4" /> Đã gửi</div>
                    ) : (
                      <div className="inline-flex items-center gap-1 text-red-600"><Clock className="w-4 h-4" /> Chưa gửi</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {subject.status === 'pending' ? (
                      <button onClick={() => navigate('/survey')} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">Thực hiện khảo sát</button>
                    ) : (
                      <button onClick={() => navigate('/evaluation-results')} className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm">Xem kết quả</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
