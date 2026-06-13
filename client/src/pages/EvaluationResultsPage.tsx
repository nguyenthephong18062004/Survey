import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Download, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { reportAPI, subjectAPI } from '../api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const getSatisfactionLevel = (score: number) => {
  if (score >= 4.5) return 'Rất hài lòng'
  if (score >= 3.5) return 'Hài lòng'
  if (score >= 2.5) return 'Bình thường'
  if (score >= 1.5) return 'Không hài lòng'
  return 'Rất không hài lòng'
}

export default function EvaluationResultsPage() {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState<any[]>([])
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [reportData, setReportData] = useState<any>(null)
  const [showResults, setShowResults] = useState(false)
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

  const ratingQuestions = useMemo(
    () => reportData?.questions?.filter((q: any) => q.type === 'rating') || [],
    [reportData]
  )

  const chartData = useMemo(
    () =>
      ratingQuestions.map((q: any, index: number) => ({
        name: `Câu ${index + 1}`,
        fullQuestion: q.question,
        score: Number(q.averageRating || 0)
      })),
    [ratingQuestions]
  )

  const overallAverage = reportData?.overallAverage
    ? Number(reportData.overallAverage).toFixed(2)
    : ratingQuestions.length > 0
      ? (ratingQuestions.reduce((acc: number, q: any) => acc + Number(q.averageRating || 0), 0) / ratingQuestions.length).toFixed(2)
      : '0'

  const satisfactionLevel = overallAverage !== '0' ? getSatisfactionLevel(Number(overallAverage)) : 'Chưa có dữ liệu'

  const handleViewResults = async () => {
    if (!selectedSubjectId) {
      alert('Vui lòng chọn môn học')
      return
    }

    setLoading(true)
    setShowResults(false)

    try {
      const data = await reportAPI.getSubjectReport(Number(selectedSubjectId))
      setReportData(data)
      setShowResults(true)
    } catch (error) {
      console.error('Failed to fetch report', error)
      alert('Không thể tải báo cáo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white rounded-lg transition-colors"><ArrowLeft className="w-6 h-6" /></button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kết quả đánh giá môn học</h1>
            <p className="text-gray-600 mt-1">Chọn môn học để xem bài khảo sát và kết quả trả lời trung bình từng câu hỏi.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chọn môn học</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => {
                  setSelectedSubjectId(e.target.value)
                  setReportData(null)
                  setShowResults(false)
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">-- Chọn môn học --</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.code} - {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleViewResults}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Đang tải...' : 'Xem kết quả'}
            </button>
          </div>
        </div>

        {showResults && reportData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-sm text-gray-600">Điểm trung bình</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{overallAverage}/5</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-sm text-gray-600">Số phản hồi</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{reportData.totalResponses || 0}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-sm text-gray-600">Mức hài lòng</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{satisfactionLevel}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Bài khảo sát</h3>
                  <p className="text-sm text-gray-600 mt-1">{reportData.surveyTitle || 'Không có thông tin bài khảo sát'}</p>
                </div>
                <div className="text-sm text-gray-700">{ratingQuestions.length} câu hỏi đánh giá</div>
              </div>

              {ratingQuestions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Câu hỏi</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">Điểm trung bình</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Đánh giá</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {ratingQuestions.map((question: any, index: number) => {
                        const score = Number(question.averageRating || 0)
                        return (
                          <tr key={question.id}>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              <span className="font-semibold">Câu {index + 1}:</span> {question.question}
                            </td>
                            <td className="px-4 py-4 text-right text-lg font-bold text-blue-700">
                              {score > 0 ? score.toFixed(1) : '0.0'}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-700">
                              {score > 0 ? getSatisfactionLevel(score) : 'Chưa có dữ liệu'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600">Không có câu hỏi đánh giá hoặc dữ liệu khảo sát cho môn học này.</div>
              )}
            </div>

            {chartData.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Biểu đồ điểm trung bình theo câu hỏi</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip formatter={(value: any) => [`${value}/5`, 'Điểm']} />
                    <Legend />
                    <Bar dataKey="score" fill="#3B82F6" name="Điểm trung bình" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : (
          showResults && !loading && (
            <div className="bg-white rounded-xl shadow-sm p-6 text-gray-600 text-center">Không tìm thấy báo cáo cho môn học đã chọn.</div>
          )
        )}
      </div>
    </div>
  )
}
