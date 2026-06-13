import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { semesterAPI } from '../api'
import type { Semester } from '../types'

export default function SemesterManagementPage() {
  const navigate = useNavigate()
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState<Semester['status']>('upcoming')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSemesters()
  }, [])

  const loadSemesters = async () => {
    setLoading(true)
    try {
      const data = await semesterAPI.getAll()
      // apply status updates if needed
      await applyStatusUpdates(data)
      const refreshed = await semesterAPI.getAll()
      setSemesters(refreshed)
    } catch (error) {
      console.error('Failed to load semesters:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyStatusUpdates = async (data: Semester[]) => {
    const now = new Date()
    const toUpdate: Array<{ id: number; status: Semester['status'] }> = []
    for (const s of data) {
      const start = new Date(s.startDate)
      const end = new Date(s.endDate)
      let desired: Semester['status'] = 'upcoming'
      if (now > end) desired = 'completed'
      else if (now >= start) desired = 'active'
      else desired = 'upcoming'
      if (desired !== s.status) toUpdate.push({ id: s.id, status: desired })
    }
    if (toUpdate.length === 0) return
    for (const u of toUpdate) {
      try {
        await semesterAPI.update(u.id, { status: u.status })
      } catch (error) {
        console.error('Failed to update semester status for id', u.id, error)
      }
    }
  }

  const resetForm = () => {
    setName('')
    setStartDate('')
    setEndDate('')
    setStatus('upcoming')
    setEditingId(null)
  }

  const handleSave = async () => {
    if (!name || !startDate || !endDate) {
      alert('Vui lòng nhập đầy đủ thông tin')
      return
    }
    const sDate = new Date(startDate)
    const eDate = new Date(endDate)
    if (eDate < sDate) {
      alert('Ngày kết thúc không được nhỏ hơn ngày bắt đầu')
      return
    }

    // Check for overlap with active semesters
    const activeSemesters = semesters.filter(s => s.status === 'active' && s.id !== editingId)
    for (const active of activeSemesters) {
      const activeStart = new Date(active.startDate)
      const activeEnd = new Date(active.endDate)
      // Check if new semester overlaps with active semester
      if (sDate <= activeEnd && eDate >= activeStart) {
        alert(`Không thể thêm/sửa học kỳ vì có thời gian trùng lặp với học kỳ đang diễn ra "${active.name}"`)
        return
      }
    }

    try {
      if (editingId) {
        await semesterAPI.update(editingId, { name, startDate, endDate, status })
      } else {
        await semesterAPI.create({ name, startDate, endDate, status })
      }
      await loadSemesters()
      resetForm()
    } catch (error) {
      console.error('Failed to save semester:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa học kỳ này?')) return

    try {
      await semesterAPI.delete(id)
      await loadSemesters()
    } catch (error) {
      console.error('Failed to delete semester:', error)
    }
  }

  const startEdit = (semester: Semester) => {
    setEditingId(semester.id)
    setName(semester.name)
    setStartDate(semester.startDate.slice(0, 10))
    setEndDate(semester.endDate.slice(0, 10))
    setStatus(semester.status)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading semesters...</div>
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
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên học kỳ" className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
            <select value={status} onChange={(e) => setStatus(e.target.value as Semester['status'])} className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent">
              <option value="upcoming">Sắp diễn ra</option>
              <option value="active">Đang diễn ra</option>
              <option value="completed">Đã kết thúc</option>
            </select>
          </div>
          <div className="mb-6 flex items-center gap-3">
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              <Plus className="w-4 h-4" />
              {editingId ? 'Lưu thay đổi' : 'Thêm học kỳ'}
            </button>
            {editingId && (
              <button onClick={resetForm} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">Hủy</button>
            )}
          </div>

          <div className="space-y-3">
            {semesters.map((semester) => (
              <div key={semester.id} className="border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold text-gray-900">{semester.name}</p>
                  <p className="text-sm text-gray-600">{(new Date(semester.startDate)).toLocaleDateString('vi-VN')} - {(new Date(semester.endDate)).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${semester.status === 'active' ? 'bg-green-100 text-green-700' :
                      semester.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                        'bg-blue-100 text-blue-700'
                    }`}>
                    {semester.status === 'active' ? 'Đang diễn ra' :
                      semester.status === 'completed' ? 'Đã kết thúc' : 'Sắp diễn ra'}
                  </span>
                  <button onClick={() => startEdit(semester)} className="text-gray-600 hover:text-gray-800 p-1 hover:bg-gray-50 rounded" title="Chỉnh sửa">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(semester.id)} className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded" title="Xóa">
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
