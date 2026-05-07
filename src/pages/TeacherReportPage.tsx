import { useState } from 'react'
import { ArrowLeft, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

export default function TeacherReportPage() {
  const navigate = useNavigate()
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('')
  const [showReport, setShowReport] = useState(false)

  const teachers = [
    { id: 1, name: 'TS. Nguyễn Văn A', department: 'Khoa CNTT' },
    { id: 2, name: 'PGS.TS. Trần Thị B', department: 'Khoa CNTT' },
    { id: 3, name: 'ThS. Lê Văn C', department: 'Khoa Điện - Điện tử' },
    { id: 4, name: 'TS. Phạm Thị D', department: 'Khoa Cơ khí' },
  ]

  const semesters = [
    { id: 1, name: 'HK1 2024-2025' },
    { id: 2, name: 'HK2 2023-2024' },
    { id: 3, name: 'HK1 2023-2024' },
  ]

  const radarData = [
    { subject: 'Kiến thức chuyên môn', score: 4.5 },
    { subject: 'Kỹ năng giảng dạy', score: 4.3 },
    { subject: 'Tương tác với SV', score: 4.6 },
    { subject: 'Chuẩn bị bài giảng', score: 4.4 },
    { subject: 'Đánh giá công bằng', score: 4.2 },
  ]

  const subjectScores = [
    { subject: 'Lập trình C++', score: 4.5, students: 45 },
    { subject: 'Cấu trúc dữ liệu', score: 4.3, students: 52 },
    { subject: 'Thuật toán', score: 4.6, students: 38 },
  ]

  const comments = [
    { id: 1, text: 'Giảng viên nhiệt tình, luôn sẵn sàng giải đáp thắc mắc', rating: 5, subject: 'Lập trình C++' },
    { id: 2, text: 'Bài giảng rõ ràng, có nhiều ví dụ thực tế', rating: 5, subject: 'Cấu trúc dữ liệu' },
    { id: 3, text: 'Cần thêm thời gian thực hành trên lớp', rating: 4, subject: 'Thuật toán' },
    { id: 4, text: 'Giảng viên có tâm huyết với nghề', rating: 5, subject: 'Lập trình C++' },
  ]

  const handleViewReport = () => {
    if (!selectedTeacher) {
      alert('Vui lòng chọn giảng viên')
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
              <h1 className="text-3xl font-bold text-gray-900">Xem báo cáo theo giảng viên</h1>
              <p className="text-gray-600 mt-1">Xem chi tiết báo cáo đánh giá của từng giảng viên</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn giảng viên <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Chọn giảng viên --</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.department}
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
                <option value="">-- Toàn bộ dữ liệu --</option>
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

        {showReport && selectedTeacher && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Số môn giảng dạy</p><p className="text-3xl font-bold text-gray-900 mt-2">3</p></div>
              <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Tổng sinh viên</p><p className="text-3xl font-bold text-blue-600 mt-2">135</p></div>
              <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Điểm TB chung</p><p className="text-3xl font-bold text-green-600 mt-2">4.5/5</p></div>
              <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Tỷ lệ hài lòng</p><p className="text-3xl font-bold text-purple-600 mt-2">92%</p></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá đa chiều</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 5]} />
                    <Radar name="Điểm số" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá theo môn học</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#64748B" name="Điểm số" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết theo môn học</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Môn học</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Số sinh viên</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Điểm trung bình</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Đánh giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {subjectScores.map((subject, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{subject.subject}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{subject.students}</td>
                        <td className="px-4 py-3 text-sm"><span className="font-semibold text-blue-600">{subject.score}/5</span></td>
                        <td className="px-4 py-3 text-sm"><span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Xuất sắc</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-lg ${i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">- {comment.subject}</span>
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
