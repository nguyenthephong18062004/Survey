import { useMemo, useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle2, Clock, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { subjectAPI, assignmentAPI as surveyAssignmentAPI } from '../api'

type EvaluateSubject = {
  id: number // assignmentId
  subjectId: number
  code: string
  name: string
  teacher: string
  surveyId: number
  surveyTitle: string
  status: 'submitted' | 'pending'
}

export default function SubjectsToEvaluatePage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'pending'>('all')
  
  const [mockSubjects, setMockSubjects] = useState<EvaluateSubject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const assignments = await surveyAssignmentAPI.getStudentAssignments()
        
        const evaluatedData = assignments.map((a: any) => ({
          id: a.assignmentId,
          subjectId: a.subjectId,
          code: a.subjectCode,
          name: a.subjectName,
          teacher: a.lecturerName,
          surveyId: a.surveyId,
          surveyTitle: a.surveyTitle,
          status: a.isCompleted ? 'submitted' : 'pending'
        }))
        
        setMockSubjects(evaluatedData)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filtered = useMemo(
    () =>
      mockSubjects.filter((subject) => {
        const matchesFilter = filterStatus === 'all' || subject.status === filterStatus
        const q = searchTerm.toLowerCase()
        const matchesSearch = subject.code.toLowerCase().includes(q) || subject.name.toLowerCase().includes(q) || subject.teacher.toLowerCase().includes(q)
        return matchesFilter && matchesSearch
      }),
    [mockSubjects, filterStatus, searchTerm],
  )

  const submitted = mockSubjects.filter((s) => s.status === 'submitted').length
  const pending = mockSubjects.filter((s) => s.status === 'pending').length

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading subjects...</div>
  }

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
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm theo mã môn, tên môn, giảng viên..." className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setFilterStatus('all')} className={`px-4 py-2 rounded-lg transition-colors font-medium ${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Tất cả</button>
              <button onClick={() => setFilterStatus('submitted')} className={`px-4 py-2 rounded-lg transition-colors font-medium ${filterStatus === 'submitted' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Đã gửi</button>
              <button onClick={() => setFilterStatus('pending')} className={`px-4 py-2 rounded-lg transition-colors font-medium ${filterStatus === 'pending' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Chưa gửi</button>
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
                <tr key={subject.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{subject.code}</td>
                  <td className="px-6 py-4 text-gray-700">{subject.name}</td>
                  <td className="px-6 py-4 text-gray-700">{subject.teacher}</td>
                  <td className="px-6 py-4">
                    {subject.status === 'submitted' ? (
                      <div className="inline-flex items-center gap-1 text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full text-sm"><CheckCircle2 className="w-4 h-4" /> Đã gửi</div>
                    ) : (
                      <div className="inline-flex items-center gap-1 text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full text-sm"><Clock className="w-4 h-4" /> Chưa gửi</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {subject.status === 'pending' ? (
                      <button onClick={() => navigate('/survey', { state: { assignmentId: subject.id } })} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">Thực hiện khảo sát</button>
                    ) : (
                      <span className="text-gray-500 text-sm">Cảm ơn bạn đã đánh giá</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Không tìm thấy môn học nào phù hợp.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
