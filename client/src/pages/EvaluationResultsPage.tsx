import { useState } from 'react'
import { ArrowLeft, Download, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const courses = [
  { id: 1, code: 'IT001', name: 'Lập trình hướng đối tượng', responses: 128 },
  { id: 2, code: 'IT002', name: 'Cơ sở dữ liệu', responses: 95 },
]

const criteriaData = [
  { criterion: 'Nội dung môn học', score: 4.5 },
  { criterion: 'Phương pháp giảng dạy', score: 4.3 },
  { criterion: 'Tài liệu học tập', score: 4.1 },
  { criterion: 'Đánh giá bài tập', score: 4.4 },
]

export default function EvaluationResultsPage() {
  const navigate = useNavigate()
  const [selectedCourse, setSelectedCourse] = useState('')
  const [showResults, setShowResults] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white rounded-lg transition-colors"><ArrowLeft className="w-6 h-6" /></button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kết quả đánh giá môn học</h1>
            <p className="text-gray-600 mt-1">Xem phản hồi và điểm đánh giá của sinh viên</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg">
              <option value="">-- Chọn môn học --</option>
              {courses.map((course) => <option key={course.id} value={course.id}>{course.code} - {course.name} ({course.responses} phản hồi)</option>)}
            </select>
            <button onClick={() => setShowResults(Boolean(selectedCourse))} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Xem kết quả
            </button>
          </div>
        </div>

        {showResults && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm"><p className="text-sm text-gray-600">Điểm trung bình</p><p className="text-3xl font-bold text-blue-600 mt-2">4.35/5</p></div>
              <div className="bg-white rounded-xl p-6 shadow-sm"><p className="text-sm text-gray-600">Số phản hồi</p><p className="text-3xl font-bold text-gray-900 mt-2">128</p></div>
              <div className="bg-white rounded-xl p-6 shadow-sm"><p className="text-sm text-gray-600">Mức hài lòng</p><p className="text-3xl font-bold text-green-600 mt-2">86%</p></div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Đánh giá theo tiêu chí</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={criteriaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="criterion" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#3B82F6" name="Điểm số" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Nhận xét gần đây</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <Download className="w-4 h-4" />
                  Xuất báo cáo
                </button>
              </div>
              <div className="space-y-3">
                {['Giảng viên dạy dễ hiểu', 'Nội dung bám sát thực tế', 'Cần thêm bài tập thực hành'].map((text, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-1 mb-1">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}</div>
                    <p className="text-gray-700">{text}</p>
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
