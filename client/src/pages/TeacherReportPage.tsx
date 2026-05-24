import { useState, useEffect } from 'react'
import { ArrowLeft, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { subjectAPI, reportAPI } from '../api'

export default function TeacherReportPage() {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState<any[]>([])
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await subjectAPI.getAll()
        setSubjects(data)
      } catch (error) {
        console.error('Failed to load subjects', error)
      }
    }
    loadSubjects()
  }, [])

  const handleViewReport = async () => {
    if (!selectedSubjectId) {
      alert('Vui lòng chọn môn học')
      return
    }
    setLoading(true)
    try {
      const data = await reportAPI.getSubjectReport(Number(selectedSubjectId))
      setReportData(data)
    } catch (error) {
      console.error('Failed to fetch report', error)
      alert('Không thể tải báo cáo')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    alert('Xuất báo cáo thành công!')
  }

  // Parse report data into charts format
  const chartData = reportData?.questions
    ?.filter((q: any) => q.type === 'rating')
    .map((q: any) => ({
      name: q.question.length > 20 ? q.question.substring(0, 20) + '...' : q.question,
      fullQuestion: q.question,
      score: Number(q.averageRating)
    })) || []
    
  const textComments = reportData?.questions
    ?.filter((q: any) => q.type === 'text') || []

  const getSatisfactionLevel = (score: number) => {
    if (score >= 4.5) return 'Rất hài lòng'
    if (score >= 3.5) return 'Hài lòng'
    if (score >= 2.5) return 'Bình thường'
    if (score >= 1.5) return 'Không hài lòng'
    return 'Rất không hài lòng'
  }

  // Overall average
  const overallAverage = reportData?.overallAverage 
    ? Number(reportData.overallAverage).toFixed(2)
    : chartData.length > 0 
      ? (chartData.reduce((acc: number, curr: any) => acc + curr.score, 0) / chartData.length).toFixed(2)
      : "0"

  const satisfactionLevel = overallAverage !== "0" ? getSatisfactionLevel(Number(overallAverage)) : "Chưa có"

  // Process submission scores for distribution chart
  const satisfactionDistribution = [
    { name: 'Rất hài lòng', count: 0 },
    { name: 'Hài lòng', count: 0 },
    { name: 'Bình thường', count: 0 },
    { name: 'Không hài lòng', count: 0 },
    { name: 'Rất không hài lòng', count: 0 }
  ]

  if (reportData?.submissionScores) {
    reportData.submissionScores.forEach((sub: any) => {
      const level = getSatisfactionLevel(Number(sub.score))
      const target = satisfactionDistribution.find(s => s.name === level)
      if (target) target.count += 1
    })
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
              <h1 className="text-3xl font-bold text-gray-900">Xem báo cáo môn học</h1>
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
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Chọn môn học --</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.code} - {subject.name} (GV: {subject.lecturerName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button onClick={handleViewReport} disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? 'Đang tải...' : 'Xem báo cáo'}
            </button>
          </div>
        </div>

        {reportData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Môn học</p><p className="text-xl font-bold text-gray-900 mt-2">{reportData.subject?.code}</p></div>
              <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Giảng viên</p><p className="text-lg font-bold text-blue-600 mt-2">{reportData.subject?.lecturerName}</p></div>
              <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Số lượng đánh giá</p><p className="text-3xl font-bold text-green-600 mt-2">{reportData.totalResponses}</p></div>
              <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Điểm TB (1-5)</p><p className="text-3xl font-bold text-purple-600 mt-2">{overallAverage}</p><p className="text-sm font-medium text-purple-800 mt-1">{satisfactionLevel}</p></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mức độ đồng ý theo câu hỏi</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis domain={[0, 5]} />
                    <Radar name="Điểm trung bình" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ đánh giá</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 5]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value: any) => [`${value}/5`, 'Điểm TB']} />
                    <Legend />
                    <Bar dataKey="score" fill="#64748B" name="Điểm TB" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {reportData?.submissionScores && reportData.submissionScores.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố mức độ hài lòng từ các bài khảo sát</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={satisfactionDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip formatter={(value: any) => [`${value} bài`, 'Số lượng']} />
                      <Bar dataKey="count" fill="#10B981" name="Số bài khảo sát" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {textComments.length > 0 && textComments.map((q: any) => (
              <div key={q.id} className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ý kiến: {q.question}</h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
                  {q.comments && q.comments.length > 0 ? (
                    q.comments.map((comment: string, idx: number) => (
                      <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 italic">"{comment}"</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Chưa có ý kiến nào.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
