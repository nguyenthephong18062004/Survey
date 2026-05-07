import { useState } from 'react'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { semesterAPI, type Semester } from '../data/mockData'

export default function SemesterManagementPage() {
  const navigate = useNavigate()
  const [semesters, setSemesters] = useState<Semester[]>(semesterAPI.getAll())
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState<Semester['status']>('upcoming')

  const handleCreate = () => {
    if (!name || !startDate || !endDate) {
      alert('Vui lòng nhập đầy đủ thông tin')
      return
    }
    semesterAPI.create({ name, startDate, endDate, status })
    setSemesters(semesterAPI.getAll())
    setName('')
    setStartDate('')
    setEndDate('')
    setStatus('upcoming')
  }

  const handleDelete = (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa học kỳ này?')) return
    semesterAPI.delete(id)
    setSemesters(semesterAPI.getAll())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý học kỳ</h1>
          <p className="text-gray-600 mb-6">Danh sách và cấu hình học kỳ dùng cho khảo sát môn học</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên học kỳ" className="px-3 py-2 border border-gray-300 rounded-lg" />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
            <select value={status} onChange={(e) => setStatus(e.target.value as Semester['status'])} className="px-3 py-2 border border-gray-300 rounded-lg">
              <option value="upcoming">Sắp diễn ra</option>
              <option value="active">Đang diễn ra</option>
              <option value="completed">Đã kết thúc</option>
            </select>
          </div>
          <button onClick={handleCreate} className="mb-6 flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
            <Plus className="w-4 h-4" />
            Thêm học kỳ
          </button>

          <div className="space-y-3">
            {semesters.map((semester) => (
              <div key={semester.id} className="border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{semester.name}</p>
                  <p className="text-sm text-gray-600">{semester.startDate} - {semester.endDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{semester.status}</span>
                  <button onClick={() => handleDelete(semester.id)} className="text-red-600 hover:text-red-700" title="Xóa">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
