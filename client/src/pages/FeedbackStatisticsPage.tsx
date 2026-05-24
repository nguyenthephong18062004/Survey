import { useState, useEffect } from 'react'
import { ArrowLeft, Download, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { reportAPI } from '../api'

export default function FeedbackStatisticsPage() {
  const navigate = useNavigate()
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await reportAPI.getSchoolReport()
        setReportData(data)
      } catch (error) {
        console.error('Failed to load school report:', error)
      } finally {
        setLoading(false)
      }
    }
    loadReport()
  }, [])

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

        {loading ? (
          <div className="flex justify-center py-12"><p className="text-gray-500">Đang tải dữ liệu...</p></div>
        ) : reportData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm"><p className="text-sm text-gray-600">Tổng sinh viên</p><p className="text-3xl font-bold">{reportData.totalStudents}</p></div>
              <div className="bg-white rounded-xl p-6 shadow-sm"><p className="text-sm text-gray-600">Môn học đang triển khai</p><p className="text-3xl font-bold text-blue-600">{reportData.totalSubjects}</p></div>
              <div className="bg-white rounded-xl p-6 shadow-sm"><p className="text-sm text-gray-600">Tổng bộ khảo sát</p><p className="text-3xl font-bold text-purple-600">{reportData.totalSurveys}</p></div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Top 10 môn học điểm cao nhất</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={reportData.topSubjects} layout="vertical" margin={{ left: 50, right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 5]} />
                    <YAxis dataKey="code" type="category" width={100} />
                    <Tooltip formatter={(value: any) => [`${value}/5`, 'Điểm TB']} />
                    <Legend />
                    <Bar dataKey="overallRating" fill="#3B82F6" name="Điểm TB" />
                  </BarChart>
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
        ) : null}
      </div>
    </div>
  )
}
