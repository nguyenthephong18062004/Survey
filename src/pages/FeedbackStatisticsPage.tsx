import { useState } from 'react'
import { ArrowLeft, Download, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

const departmentStats = [
  { name: 'Khoa CNTT', score: 4.5, responses: 856 },
  { name: 'Khoa Điện-ĐT', score: 4.3, responses: 645 },
  { name: 'Khoa Cơ khí', score: 4.2, responses: 523 },
]

const trendData = [
  { semester: 'HK1 2023', avgScore: 4.1, totalResponses: 2145 },
  { semester: 'HK2 2023', avgScore: 4.2, totalResponses: 2268 },
  { semester: 'HK1 2024', avgScore: 4.3, totalResponses: 2436 },
]

export default function FeedbackStatisticsPage() {
  const navigate = useNavigate()
  const [semester, setSemester] = useState('')
  const [showStats, setShowStats] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white rounded-lg transition-colors"><ArrowLeft className="w-6 h-6" /></button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thống kê phản hồi sinh viên</h1>
            <p className="text-gray-600 mt-1">Tổng hợp và phân tích phản hồi đánh giá môn học</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Bộ lọc thống kê</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select value={semester} onChange={(e) => setSemester(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg">
              <option value="">-- Chọn học kỳ --</option>
              <option value="hk1-2425">HK1 2024-2025</option>
              <option value="hk2-2324">HK2 2023-2024</option>
            </select>
            <select className="px-4 py-3 border border-gray-300 rounded-lg"><option>Tất cả khoa</option></select>
            <select className="px-4 py-3 border border-gray-300 rounded-lg"><option>Tất cả môn học</option></select>
          </div>
          <button onClick={() => setShowStats(Boolean(semester))} className="mt-5 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Xem thống kê
          </button>
        </div>

        {showStats && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm"><p className="text-sm text-gray-600">Tổng phản hồi</p><p className="text-3xl font-bold">2436</p></div>
              <div className="bg-white rounded-xl p-6 shadow-sm"><p className="text-sm text-gray-600">Điểm TB</p><p className="text-3xl font-bold text-green-600">4.35/5</p></div>
              <div className="bg-white rounded-xl p-6 shadow-sm"><p className="text-sm text-gray-600">Tỷ lệ phản hồi</p><p className="text-3xl font-bold text-purple-600">85.2%</p></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Điểm theo khoa</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={departmentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#3B82F6" name="Điểm TB" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Xu hướng học kỳ</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semester" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgScore" stroke="#10B981" strokeWidth={3} name="Điểm TB" />
                    <Line type="monotone" dataKey="totalResponses" stroke="#3B82F6" strokeWidth={2} name="Số phản hồi" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Xuất báo cáo</h3>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"><Download className="w-5 h-5" />Xuất PDF</button>
                <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"><Download className="w-5 h-5" />Xuất Excel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
