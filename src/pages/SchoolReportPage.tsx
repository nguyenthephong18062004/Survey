import { useState } from 'react'
import { ArrowLeft, Download, TrendingUp, TrendingDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

export default function SchoolReportPage() {
  const navigate = useNavigate()
  const [selectedSemester, setSelectedSemester] = useState('all')

  const semesters = [
    { id: 'all', name: 'Tất cả các học kỳ' },
    { id: '1', name: 'HK1 2024-2025' },
    { id: '2', name: 'HK2 2023-2024' },
    { id: '3', name: 'HK1 2023-2024' },
  ]

  const departmentData = [
    { name: 'Khoa CNTT', avgScore: 4.5, students: 1250, responses: 1100 },
    { name: 'Khoa Điện - Điện tử', avgScore: 4.3, students: 980, responses: 850 },
    { name: 'Khoa Cơ khí', avgScore: 4.4, students: 850, responses: 720 },
    { name: 'Khoa Xây dựng', avgScore: 4.2, students: 750, responses: 650 },
    { name: 'Khoa Kinh tế', avgScore: 4.6, students: 1100, responses: 980 },
  ]

  const trendData = [
    { semester: 'HK1 2023', score: 4.1 },
    { semester: 'HK2 2023', score: 4.2 },
    { semester: 'HK1 2024', score: 4.3 },
    { semester: 'HK2 2024', score: 4.4 },
    { semester: 'HK1 2025', score: 4.5 },
  ]

  const satisfactionData = [
    { name: 'Rất hài lòng', value: 48, color: '#10B981' },
    { name: 'Hài lòng', value: 32, color: '#84CC16' },
    { name: 'Trung bình', value: 15, color: '#F59E0B' },
    { name: 'Không hài lòng', value: 5, color: '#EF4444' },
  ]

  const handleExport = () => {
    alert('Xuất báo cáo tổng hợp thành công!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-white rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Báo cáo tổng hợp toàn trường</h1>
              <p className="text-gray-600 mt-1">Thống kê và phân tích dữ liệu khảo sát cấp trường</p>
            </div>
          </div>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Chọn học kỳ:</label>
            <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
              {semesters.map((semester) => (
                <option key={semester.id} value={semester.id}>
                  {semester.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Tổng số khảo sát</p><p className="text-3xl font-bold text-gray-900 mt-2">4,930</p><div className="flex items-center gap-1 mt-2 text-green-600 text-sm"><TrendingUp className="w-4 h-4" /><span>+12% so với kỳ trước</span></div></div>
          <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Điểm TB toàn trường</p><p className="text-3xl font-bold text-blue-600 mt-2">4.4/5</p><div className="flex items-center gap-1 mt-2 text-green-600 text-sm"><TrendingUp className="w-4 h-4" /><span>+0.3 điểm</span></div></div>
          <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Tỷ lệ tham gia</p><p className="text-3xl font-bold text-purple-600 mt-2">82%</p><div className="flex items-center gap-1 mt-2 text-red-600 text-sm"><TrendingDown className="w-4 h-4" /><span>-3% so với kỳ trước</span></div></div>
          <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Số khoa</p><p className="text-3xl font-bold text-orange-600 mt-2">5</p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá theo khoa</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={100} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgScore" fill="#3B82F6" name="Điểm trung bình" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Xu hướng theo thời gian</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} name="Điểm TB" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố mức độ hài lòng</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={satisfactionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {satisfactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tỷ lệ tham gia theo khoa</h3>
            <div className="space-y-4">
              {departmentData.map((dept, index) => {
                const percentage = Math.round((dept.responses / dept.students) * 100)
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                      <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
