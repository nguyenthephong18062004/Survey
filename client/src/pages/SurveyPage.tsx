import { useState, type FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardCheck, ArrowLeft, CheckCircle } from 'lucide-react'
import { surveyAPI, assignmentAPI as surveyAssignmentAPI } from '../api'

export default function SurveyPage() {
  const navigate = useNavigate()
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null)
  const [ratings, setRatings] = useState<Record<number, number>>({})
  const [errors, setErrors] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const [assignments, setAssignments] = useState<any[]>([])
  const [surveys, setSurveys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [assignmentsData, surveysData] = await Promise.all([
          surveyAssignmentAPI.getStudentAssignments(),
          surveyAPI.getAll()
        ])
        // Filter out completed assignments
        const pendingAssignments = assignmentsData.filter((a: any) => !a.isCompleted)
        setAssignments(pendingAssignments)
        setSurveys(surveysData)
      } catch (error) {
        console.error('Failed to load data', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const selectedAssignment = assignments.find(a => a.assignmentId === selectedAssignmentId)
  const selectedSurvey = selectedAssignment ? surveys.find(s => s.id === selectedAssignment.surveyId) : null
  const selectedSurveyTitle = selectedSurvey?.title || selectedAssignment?.surveyTitle || ''
  const surveyQuestions = selectedSurvey?.questions || []

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedAssignmentId) {
      setErrors('Vui lòng chọn môn học cần đánh giá')
      return
    }
    
    const unanswered = surveyQuestions.filter((q: any) => !ratings[q.id])
    if (unanswered.length > 0) {
      setErrors('Vui lòng trả lời tất cả các câu hỏi đánh giá')
      return
    }

    setSubmitting(true)
    setErrors('')
    try {
      const responseArray = Object.entries(ratings).map(([questionId, value]) => ({
        questionId: Number(questionId),
        ratingValue: Number(value)
      }))

      await surveyAPI.submit(selectedAssignmentId, responseArray)
      setIsSubmitted(true)
    } catch (error: any) {
      setErrors(error.message || 'Có lỗi xảy ra khi gửi khảo sát')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading survey data...</div>
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Gửi khảo sát thành công!</h2>
          <p className="text-gray-600 mb-6">Cảm ơn bạn đã hoàn thành khảo sát. Phản hồi của bạn đã được ghi nhận.</p>
          <button onClick={() => navigate('/')} className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-sm transition-colors">
            Về trang chủ
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <ClipboardCheck className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Thực hiện khảo sát </h1>
              <p className="text-gray-600 mt-1">Vui lòng đánh giá khảo sát để nâng cao chất lượng giảng dạy của nhà trường</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Chọn khảo sát cần đánh giá <span className="text-red-500">*</span></label>
              {assignments.length === 0 ? (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
                  Hiện tại không có khảo sát  nào được giao cho bạn hoặc bạn đã hoàn thành tất cả.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {assignments.map((assignment) => {
                    const assignmentTitle = assignment.subjectCode && assignment.subjectName
                      ? `${assignment.subjectCode} - ${assignment.subjectName}`
                      : assignment.surveyTitle || 'Khảo sát chung';

                    return (
                      <label key={assignment.assignmentId} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAssignmentId === assignment.assignmentId ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" name="assignment" value={assignment.assignmentId} checked={selectedAssignmentId === assignment.assignmentId} onChange={(e) => { setSelectedAssignmentId(Number(e.target.value)); setErrors('') }} className="w-4 h-4 text-blue-600" />
                        <div className="ml-3 flex-1">
                          <div className="font-medium text-gray-900">{assignmentTitle}</div>
                          {assignment.subjectCode && assignment.subjectName ? (
                            <div className="text-sm text-gray-600">Giảng viên: {assignment.lecturerName}</div>
                          ) : (
                            <div className="text-sm text-gray-600">Loại khảo sát: chung toàn trường</div>
                          )}
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>

            {selectedAssignment && selectedSurvey && (
              <>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{selectedSurveyTitle}</h3>
                {surveyQuestions.map((question: any, index: number) => (
                  <div key={question.id} className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">{index + 1}. {question.question} <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-2">
                      {[
                        { value: 1, label: 'Rất không đồng ý' },
                        { value: 2, label: 'Không đồng ý' },
                        { value: 3, label: 'Trung lập' },
                        { value: 4, label: 'Đồng ý' },
                        { value: 5, label: 'Rất đồng ý' }
                      ].map(({ value, label }) => (
                        <label key={value} className={`flex flex-col items-center justify-center p-3 text-center rounded-lg border cursor-pointer transition-all ${ratings[question.id] === value ? 'border-blue-600 bg-blue-50 shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                          <input 
                            type="radio" 
                            name={`question_${question.id}`} 
                            value={value}
                            checked={ratings[question.id] === value}
                            onChange={() => setRatings({ ...ratings, [question.id]: value })}
                            className="w-4 h-4 mb-2 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {value} - {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                {errors && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">{errors}</div>}
                <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg shadow-sm disabled:opacity-70">
                  {submitting ? 'Đang gửi...' : 'Gửi khảo sát'}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
