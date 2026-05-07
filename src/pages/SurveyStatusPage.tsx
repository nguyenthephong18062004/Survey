import { useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, Clock, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type StatusItem = {
  id: number
  code: string
  name: string
  teacher: string
  status: 'submitted' | 'pending'
  submittedDate?: string
}

const items: StatusItem[] = [
  { id: 1, code: 'IT001', name: 'Lập trình hướng đối tượng', teacher: 'TS. Nguyễn Văn A', status: 'pending' },
  { id: 2, code: 'IT002', name: 'Cơ sở dữ liệu', teacher: 'PGS. Trần Thị B', status: 'submitted', submittedDate: '2026-05-01 20:00' },
  { id: 3, code: 'IT003', name: 'Mạng máy tính', teacher: 'TS. Lê Văn C', status: 'submitted', submittedDate: '2026-05-01 21:30' },
]

export default function SurveyStatusPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'submitted' | 'pending'>('all')

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchFilter = filter === 'all' || item.status === filter
      const q = query.toLowerCase()
      const matchQ = item.code.toLowerCase().includes(q) || item.name.toLowerCase().includes(q) || item.teacher.toLowerCase().includes(q)
      return matchFilter && matchQ
    })
  }, [filter, query])

  const submitted = items.filter((i) => i.status === 'submitted').length
  const pending = items.filter((i) => i.status === 'pending').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white rounded-lg transition-colors"><ArrowLeft className="w-6 h-6" /></button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trạng thái khảo sát</h1>
            <p className="text-gray-600 mt-1">Theo dõi các khảo sát đã gửi và chưa gửi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm"><p className="text-sm text-gray-600">Tổng số môn</p><p className="text-3xl font-bold">{items.length}</p></div>
          <div className="bg-white rounded-xl p-5 shadow-sm"><p className="text-sm text-gray-600">Đã gửi</p><p className="text-3xl font-bold text-green-600">{submitted}</p></div>
          <div className="bg-white rounded-xl p-5 shadow-sm"><p className="text-sm text-gray-600">Chưa gửi</p><p className="text-3xl font-bold text-red-600">{pending}</p></div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg" placeholder="Tìm kiếm..." />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Tất cả</button>
            <button onClick={() => setFilter('submitted')} className={`px-4 py-2 rounded-lg ${filter === 'submitted' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Đã gửi</button>
            <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>Chưa gửi</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã môn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Môn học</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giảng viên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày gửi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">{item.code}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.teacher}</td>
                  <td className="px-6 py-4">
                    {item.status === 'submitted'
                      ? <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle2 className="w-4 h-4" />Đã gửi</span>
                      : <span className="inline-flex items-center gap-1 text-red-600"><Clock className="w-4 h-4" />Chưa gửi</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.submittedDate ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
