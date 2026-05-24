import { useState, useEffect } from 'react'
import { ArrowLeft, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { subjectAPI, reportAPI } from '../api'

export default function SchoolReportPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'school' | 'subject'>('school')
  
  // Data for School Report
  const [schoolReport, setSchoolReport] = useState<any>(null)
  
  // Data for Subject Report
  const [subjects, setSubjects] = useState<any[]>([])
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [subjectReport, setSubjectReport] = useState<any>(null)
  
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSchoolReport()
    loadSubjects()
  }, [])

  const loadSchoolReport = async () => {
    setLoading(true)
    try {
      const data = await reportAPI.getSchoolReport()
      setSchoolReport(data)
    } catch (error) {
      console.error('Failed to load school report', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSubjects = async () => {
    try {
      const data = await subjectAPI.getAll()
      setSubjects(data)
    } catch (error) {
      console.error('Failed to load subjects', error)
    }
  }

  const handleViewSubjectReport = async () => {
    if (!selectedSubjectId) {
      alert('Vui lòng chọn môn học')
      return
    }
    setLoading(true)
    try {
      const data = await reportAPI.getSubjectReport(Number(selectedSubjectId))
      setSubjectReport(data)
    } catch (error) {
      console.error('Failed to fetch subject report', error)
      alert('Không thể tải báo cáo')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    alert('Xuất báo cáo thành công!')
  }

  const getSatisfactionLevel = (score: number) => {
    if (score >= 4.5) return 'Rất hài lòng'
    if (score >= 3.5) return 'Hài lòng'
    if (score >= 2.5) return 'Bình thường'
    if (score >= 1.5) return 'Không hài lòng'
    return 'Rất không hài lòng'
  }

  // Calculate General Survey Distribution for School Tab
  const generalSatisfactionDistribution = [
    { name: 'Rất hài lòng', count: 0 },
    { name: 'Hài lòng', count: 0 },
    { name: 'Bình thường', count: 0 },
    { name: 'Không hài lòng', count: 0 },
    { name: 'Rất không hài lòng', count: 0 }
  ]
  if (schoolReport?.generalSubmissionScores) {
    schoolReport.generalSubmissionScores.forEach((sub: any) => {
      const level = getSatisfactionLevel(Number(sub.score))
      const target = generalSatisfactionDistribution.find(s => s.name === level)
      if (target) target.count += 1
    })
  }

  // Calculate Subject Survey Distribution for Subject Tab
  const subjectSatisfactionDistribution = [
    { name: 'Rất hài lòng', count: 0 },
    { name: 'Hài lòng', count: 0 },
    { name: 'Bình thường', count: 0 },
    { name: 'Không hài lòng', count: 0 },
    { name: 'Rất không hài lòng', count: 0 }
  ]
  if (subjectReport?.submissionScores) {
    subjectReport.submissionScores.forEach((sub: any) => {
      const level = getSatisfactionLevel(Number(sub.score))
      const target = subjectSatisfactionDistribution.find(s => s.name === level)
      if (target) target.count += 1
    })
  }

  const chartData = subjectReport?.questions
    ?.filter((q: any) => q.type === 'rating')
    .map((q: any) => ({
      name: q.question.length > 20 ? q.question.substring(0, 20) + '...' : q.question,
      fullQuestion: q.question,
      score: Number(q.averageRating)
    })) || []
    
  const textComments = subjectReport?.questions
    ?.filter((q: any) => q.type === 'text') || []

  const subjectOverallAverage = subjectReport?.overallAverage 
    ? Number(subjectReport.overallAverage).toFixed(2)
    : chartData.length > 0 
      ? (chartData.reduce((acc: number, curr: any) => acc + curr.score, 0) / chartData.length).toFixed(2)
      : "0"

  const subjectSatisfactionLevel = subjectOverallAverage !== "0" ? getSatisfactionLevel(Number(subjectOverallAverage)) : "Chưa có"
  
  const generalSatisfactionLevel = schoolReport?.generalOverallAverage ? getSatisfactionLevel(Number(schoolReport.generalOverallAverage)) : "Chưa có"

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-white rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Đánh giá Toàn trường</h1>
              <p className="text-gray-600 mt-1">Xem tổng quan toàn trường và chi tiết theo môn học</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('school')}
            className={`py-3 px-6 text-lg font-medium border-b-2 transition-colors ${activeTab === 'school' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}`}
          >
            Tổng quan toàn trường
          </button>
          <button
            onClick={() => setActiveTab('subject')}
            className={`py-3 px-6 text-lg font-medium border-b-2 transition-colors ${activeTab === 'subject' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}`}
          >
            Báo cáo theo môn học
          </button>
        </div>

        {loading && <div className="text-center py-8 text-gray-600 font-medium">Đang tải dữ liệu...</div>}

        {/* Tab 1: School Report */}
        {!loading && activeTab === 'school' && schoolReport && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Tổng số môn học</p><p className="text-3xl font-bold text-gray-900 mt-2">{schoolReport.totalSubjects}</p></div>
              <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Tổng số sinh viên</p><p className="text-3xl font-bold text-blue-600 mt-2">{schoolReport.totalStudents}</p></div>
              <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Số bộ khảo sát</p><p className="text-3xl font-bold text-green-600 mt-2">{schoolReport.totalSurveys}</p></div>
              <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Điểm TB Khảo sát chung</p><p className="text-3xl font-bold text-purple-600 mt-2">{schoolReport.generalOverallAverage || "0"}</p><p className="text-sm font-medium text-purple-800 mt-1">{generalSatisfactionLevel}</p></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mức độ hài lòng (Khảo sát chung)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={generalSatisfactionDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value: any) => [`${value} bài`, 'Số lượng']} />
                    <Bar dataKey="count" fill="#8B5CF6" name="Số bài khảo sát" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 overflow-y-auto" style={{ maxHeight: '400px' }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 môn học điểm cao nhất</h3>
                {schoolReport.topSubjects && schoolReport.topSubjects.length > 0 ? (
                  <div className="space-y-4">
                    {schoolReport.topSubjects.map((sub: any, idx: number) => (
                      <div key={sub.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-amber-600' : 'bg-blue-200 text-blue-800'}`}>{idx + 1}</div>
                          <div>
                            <p className="font-semibold text-gray-900">{sub.code} - {sub.name}</p>
                            <p className="text-sm text-gray-500">GV: {sub.lecturerName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-indigo-600">{sub.overallRating}</p>
                          <p className="text-xs text-gray-500">{sub.totalResponses} bài khảo sát</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Chưa có dữ liệu môn học.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Subject Report */}
        {!loading && activeTab === 'subject' && (
          <div>
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
                <button onClick={handleViewSubjectReport} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Xem báo cáo
                </button>
              </div>
            </div>

            {subjectReport && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Môn học</p><p className="text-xl font-bold text-gray-900 mt-2">{subjectReport.subject?.code}</p></div>
                  <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Giảng viên</p><p className="text-lg font-bold text-blue-600 mt-2">{subjectReport.subject?.lecturerName}</p></div>
                  <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Số lượng bài khảo sát</p><p className="text-3xl font-bold text-green-600 mt-2">{subjectReport.totalResponses}</p></div>
                  <div className="bg-white rounded-xl shadow-sm p-6"><p className="text-gray-600 text-sm">Điểm TB (1-5)</p><p className="text-3xl font-bold text-purple-600 mt-2">{subjectOverallAverage}</p><p className="text-sm font-medium text-purple-800 mt-1">{subjectSatisfactionLevel}</p></div>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố mức độ hài lòng</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={subjectSatisfactionDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip formatter={(value: any) => [`${value} bài`, 'Số lượng']} />
                        <Bar dataKey="count" fill="#10B981" name="Số bài khảo sát" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
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
        )}
      </div>
    </div>
  )
}
