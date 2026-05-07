import { useState } from 'react'
import { ArrowLeft, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function SubjectReportPage() {
  const navigate = useNavigate()
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('')
  const [showReport, setShowReport] = useState(false)

  const subjects = [
    { id: 1, name: 'Lập trình hướng đối tượng', code: 'IT001' },
    { id: 2, name: 'Cơ sở dữ liệu', code: 'IT002' },
    { id: 3, name: 'Mạng máy tính', code: 'IT003' },
    { id: 4, name: 'Trí tuệ nhân tạo', code: 'IT004' },
  ]

  const semesters = [
    { id: 1, name: 'HK1 2024-2025' },
    { id: 2, name: 'HK2 2023-2024' },
    { id: 3, name: 'HK1 2023-2024' },
  ]

  const ratingData = [
    { category: 'Nội dung môn học', score: 4.5 },
    { category: 'Phương pháp giảng dạy', score: 4.2 },
    { category: 'Tài liệu học tập', score: 4.0 },
    { category: 'Đánh giá bài tập', score: 4.3 },
    { category: 'Hỗ trợ sinh viên', score: 4.6 },
  ]

  const satisfactionData = [
    { name: 'Rất hài lòng', value: 45, color: '#10B981' },
    { name: 'Hài lòng', value: 35, color: '#84CC16' },
    { name: 'Trung bình', value: 15, color: '#F59E0B' },
    { name: 'Không hài lòng', value: 5, color: '#EF4444' },
  ]

  const comments = [
    { id: 1, text: 'Giảng viên nhiệt tình, giảng dạy dễ hiểu', rating: 5 },
    { id: 2, text: 'Nội dung môn học phù hợp với thực tế', rating: 4 },
    { id: 3, text: 'Cần bổ sung thêm bài tập thực hành', rating: 4 },
    { id: 4, text: 'Tài liệu tham khảo đầy đủ và cập nhật', rating: 5 },
  ]

  const handleViewReport = () => {
    if (!selectedSubject) {
      alert('Vui lòng chọn môn học')
      return
    }
    setShowReport(true)
  }

  const handleExport = () => {
    alert('Xuất báo cáo thành công!')
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
              <h1 className="text-3xl font-bold text-gray-900">Xem báo cáo theo môn học</h1>
              <p className="text-gray-600 mt-1">Xem chi tiết báo cáo đánh giá của từng môn học</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn môn học <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Chọn môn học --</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.code} - {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chọn học kỳ</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Tất cả học kỳ --</option>
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button onClick={handleViewReport} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Xem báo cáo
            </button>
          </div>
        </div>

        {showReport && selectedSubject && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-gray-600 text-sm">Tổng số phản hồi</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">128</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-gray-600 text-sm">Điểm trung bình</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">4.3/5</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-gray-600 text-sm">Tỷ lệ hài lòng</p>
                <p className="text-3xl font-bold text-green-600 mt-2">80%</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-gray-600 text-sm">Tỷ lệ tham gia</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">85%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá theo tiêu chí</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ratingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-15} textAnchor="end" height={100} />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#3B82F6" name="Điểm số" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mức độ hài lòng</h3>
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
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Nhận xét từ sinh viên</h3>
                <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Xuất báo cáo
                </button>
              </div>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-lg ${i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
