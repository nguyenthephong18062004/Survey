import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { surveyAPI, assignmentAPI as surveyAssignmentAPI } from '../api'

export default function TakeSurveyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [assignment, setAssignment] = useState<any>(null)
  const [survey, setSurvey] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [responses, setResponses] = useState<Record<number, any>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Get assignmentId from router state
  const assignmentId = location.state?.assignmentId

  useEffect(() => {
    if (!assignmentId) {
      navigate('/evaluate-subjects')
      return
    }

    const loadData = async () => {
      try {
        const assignments = await surveyAssignmentAPI.getStudentAssignments()
        const currentAssignment = assignments.find((a: any) => a.assignmentId === assignmentId)
        
        if (!currentAssignment) {
          navigate('/evaluate-subjects')
          return
        }
        
        setAssignment(currentAssignment)
        
        // Fetch survey questions
        const surveys = await surveyAPI.getAll()
        const currentSurvey = surveys.find((s: any) => s.id === currentAssignment.surveyId)
        setSurvey(currentSurvey)
      } catch (error) {
        console.error('Failed to load survey data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [assignmentId, navigate])

  const handleResponseChange = (questionId: number, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all rating questions are answered
    if (survey?.questions) {
      const missingRatings = survey.questions.filter((q: any) => q.type === 'rating' && !responses[q.id])
      if (missingRatings.length > 0) {
        alert('Vui lòng đánh giá tất cả các câu hỏi trắc nghiệm.')
        return
      }
    }

    setSubmitting(true)
    try {
      const responseArray = Object.entries(responses).map(([questionId, value]) => {
        const question = survey.questions.find((q: any) => q.id === Number(questionId))
        if (question?.type === 'rating') {
          return { questionId: Number(questionId), ratingValue: Number(value) }
        } else {
          return { questionId: Number(questionId), textValue: value }
        }
      })

      await surveyAPI.submit(assignmentId, responseArray)
      setSuccess(true)
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra khi nộp bài.')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải khảo sát...</div>
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gửi thành công!</h2>
          <p className="text-gray-600 mb-6">Cảm ơn bạn đã tham gia đánh giá. Ý kiến của bạn đã được ghi nhận ẩn danh.</p>
          <button 
            onClick={() => navigate('/evaluate-subjects')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Quay lại danh sách môn học
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('/evaluate-subjects')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        {assignment && survey && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-indigo-50">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{survey.title}</h1>
              <p className="text-gray-700 mb-4">{survey.description}</p>
              <div className="flex flex-wrap gap-4 text-sm font-medium text-indigo-800">
                <span className="bg-white px-3 py-1 rounded-full border border-indigo-200">Môn: {assignment.subjectCode} - {assignment.subjectName}</span>
                <span className="bg-white px-3 py-1 rounded-full border border-indigo-200">Giảng viên: {assignment.lecturerName}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {survey.questions?.map((q: any, index: number) => (
                <div key={q.id} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <p className="text-lg font-medium text-gray-900 mb-4">
                    <span className="text-indigo-600 mr-2">Câu {index + 1}:</span>
                    {q.question}
                    {q.type === 'rating' && <span className="text-red-500 ml-1">*</span>}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-2">
                    {[
                      { value: 1, label: 'Rất không đồng ý' },
                      { value: 2, label: 'Không đồng ý' },
                      { value: 3, label: 'Trung lập' },
                      { value: 4, label: 'Đồng ý' },
                      { value: 5, label: 'Rất đồng ý' }
                    ].map(({ value, label }) => (
                      <label key={value} className={`flex flex-col items-center justify-center p-3 text-center rounded-lg border cursor-pointer transition-all ${responses[q.id] === value ? 'bg-indigo-50 border-indigo-500 shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <input 
                          type="radio" 
                          name={`question_${q.id}`} 
                          value={value}
                          checked={responses[q.id] === value}
                          onChange={() => handleResponseChange(q.id, value)}
                          className="w-4 h-4 mb-2 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {value} - {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className={`px-8 py-3 bg-indigo-600 text-white rounded-xl text-lg font-bold shadow-md hover:bg-indigo-700 transition-all focus:ring-4 focus:ring-indigo-300 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {submitting ? 'Đang gửi...' : 'Hoàn thành khảo sát'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
