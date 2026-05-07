import { useState, type FormEvent, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardCheck, ArrowLeft, CheckCircle, Star } from 'lucide-react'
import { subjectAPI, surveyAssignmentAPI, surveyAPI } from '../data/mockData'

export default function SurveyPage() {
  const navigate = useNavigate()
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null)
  const [ratings, setRatings] = useState<Record<number, number>>({})
  const [feedback, setFeedback] = useState('')
  const [errors, setErrors] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const assignments = surveyAssignmentAPI.getAll()
  const subjects = subjectAPI.getAll()
  const surveys = surveyAPI.getAll()

  const mockSubjects = useMemo(() => {
    const activeAssignments = assignments.filter(a => a.status === 'active')
    return activeAssignments.map(a => {
      const s = subjects.find(sub => sub.id === a.subjectId)
      return s ? {
        id: s.id,
        code: s.code,
        name: s.name,
        lecturer: s.lecturer.name,
        credits: s.credits,
        surveyId: a.surveyId
      } : null
    }).filter(Boolean) as any[]
  }, [assignments, subjects])

  const selectedSubjectData = mockSubjects.find(s => s.id === selectedSubject)
  const selectedSurvey = selectedSubjectData ? surveys.find(s => s.id === selectedSubjectData.surveyId) : null
  const surveyQuestions = selectedSurvey?.questions || []

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!selectedSubject) {
      setErrors('Vui lòng chọn môn học cần đánh giá')
      return
    }
    
    if (selectedSurvey?.type === 'internal') {
      const unanswered = surveyQuestions.filter((q) => !ratings[q.id])
      if (unanswered.length > 0) {
        setErrors('Vui lòng trả lời tất cả các câu hỏi đánh giá')
        return
      }
    }
    setIsSubmitted(true)
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
          <button onClick={() => navigate('/')} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
              <h1 className="text-3xl font-bold text-gray-900">Thực hiện khảo sát môn học</h1>
              <p className="text-gray-600 mt-1">Vui lòng đánh giá chất lượng giảng dạy của môn học</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Chọn môn học cần đánh giá <span className="text-red-500">*</span></label>
              {mockSubjects.length === 0 ? (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
                  Hiện tại không có khảo sát môn học nào được giao cho bạn.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {mockSubjects.map((subject) => (
                    <label key={subject.id} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedSubject === subject.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="subject" value={subject.id} checked={selectedSubject === subject.id} onChange={(e) => { setSelectedSubject(Number(e.target.value)); setErrors('') }} className="w-4 h-4 text-blue-600" />
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-gray-900">{subject.code} - {subject.name}</div>
                        <div className="text-sm text-gray-600">Giảng viên: {subject.lecturer} | {subject.credits} tín chỉ</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {selectedSubject && selectedSurvey && (
              <>
                {selectedSurvey.type === 'external' && selectedSurvey.googleFormUrl ? (
                  <div className="bg-white rounded-xl overflow-hidden flex flex-col">
                    <iframe 
                      src={selectedSurvey.googleFormUrl} 
                      className="w-full h-[800px] border-0 rounded-lg shadow-sm" 
                      title={selectedSurvey.title}
                    >
                      Đang tải...
                    </iframe>
                    <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg">
                      Lưu ý: Sau khi hoàn thành Google Form, vui lòng nhấn "Gửi khảo sát" bên dưới để hệ thống cập nhật trạng thái.
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{selectedSurvey.title}</h3>
                    {surveyQuestions.map((question: any, index: number) => (
                      <div key={question.id} className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">{index + 1}. {question.question} <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-4">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button key={rating} type="button" onClick={() => setRatings({ ...ratings, [question.id]: rating })} className={`flex items-center justify-center w-12 h-12 border-2 rounded-lg ${ratings[question.id] === rating ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}>
                              <Star className={`w-5 h-5 ${ratings[question.id] === rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ý kiến đóng góp (không bắt buộc)</label>
                      <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} maxLength={500} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Nhập ý kiến đóng góp của bạn..." />
                    </div>
                  </>
                )}

                {errors && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">{errors}</div>}
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">Gửi khảo sát</button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
