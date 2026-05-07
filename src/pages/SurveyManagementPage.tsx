import { useState, type FormEvent } from 'react'
import { ArrowLeft, Plus, Edit, Trash2, Eye, Link, FileText, X, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { surveyAPI, type Survey, type SurveyQuestion, subjectAPI, semesterAPI, surveyAssignmentAPI } from '../data/mockData'

export default function SurveyManagementPage() {
  const navigate = useNavigate()
  const [surveys, setSurveys] = useState<Survey[]>(surveyAPI.getAll())
  const [showFormModal, setShowFormModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'internal' as 'internal' | 'external',
    googleFormUrl: '',
    questions: [] as SurveyQuestion[],
    status: 'active' as 'active' | 'inactive',
  })
  const [newQuestion, setNewQuestion] = useState({ question: '', type: 'rating' as 'rating' | 'text' })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [assignData, setAssignData] = useState({ subjectIds: [] as string[], semesterId: '', startDate: '', endDate: '' })
  const [assignments, setAssignments] = useState(surveyAssignmentAPI.getAll())
  const subjects = subjectAPI.getAll()
  const semesters = semesterAPI.getAll()

  const handleCreate = () => {
    setFormData({ title: '', description: '', type: 'internal', googleFormUrl: '', questions: [], status: 'active' })
    setFormErrors({})
    setIsEditing(false)
    setShowFormModal(true)
  }

  const handleEdit = (survey: Survey) => {
    setSelectedSurvey(survey)
    setFormData({
      title: survey.title,
      description: survey.description,
      type: survey.type,
      googleFormUrl: survey.googleFormUrl || '',
      questions: survey.questions || [],
      status: survey.status,
    })
    setFormErrors({})
    setIsEditing(true)
    setShowFormModal(true)
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.title.trim()) errors.title = 'Vui lòng nhập tiêu đề khảo sát'
    if (!formData.description.trim()) errors.description = 'Vui lòng nhập mô tả'
    if (formData.type === 'external' && !formData.googleFormUrl.trim()) errors.googleFormUrl = 'Vui lòng nhập link Google Form'
    if (formData.type === 'internal' && formData.questions.length === 0) errors.questions = 'Vui lòng thêm ít nhất một câu hỏi'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    if (isEditing && selectedSurvey) {
      surveyAPI.update(selectedSurvey.id, {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        googleFormUrl: formData.type === 'external' ? formData.googleFormUrl : undefined,
        questions: formData.type === 'internal' ? formData.questions : undefined,
        status: formData.status,
      })
    } else {
      surveyAPI.create({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        googleFormUrl: formData.type === 'external' ? formData.googleFormUrl : undefined,
        questions: formData.type === 'internal' ? formData.questions : undefined,
        status: formData.status,
      })
    }
    setSurveys(surveyAPI.getAll())
    setFormErrors({})
    setShowFormModal(false)
  }

  const handleDelete = (survey: Survey) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khảo sát "${survey.title}"?`)) {
      surveyAPI.delete(survey.id)
      setSurveys(surveyAPI.getAll())
    }
  }

  const handleAddQuestion = () => {
    if (!newQuestion.question.trim()) return
    const question: SurveyQuestion = { id: formData.questions.length + 1, question: newQuestion.question, type: newQuestion.type }
    setFormData({ ...formData, questions: [...formData.questions, question] })
    setNewQuestion({ question: '', type: 'rating' })
  }

  const handleAssign = (survey: Survey) => {
    setSelectedSurvey(survey)
    setAssignData({ subjectIds: [], semesterId: '', startDate: '', endDate: '' })
    setShowAssignModal(true)
  }

  const handleSubmitAssign = (e: FormEvent) => {
    e.preventDefault()
    if (!selectedSurvey || assignData.subjectIds.length === 0 || !assignData.semesterId || !assignData.startDate || !assignData.endDate) {
      alert('Vui lòng nhập đầy đủ thông tin và chọn ít nhất một môn học')
      return
    }
    assignData.subjectIds.forEach(subjectId => {
      surveyAssignmentAPI.create({
        surveyId: selectedSurvey.id,
        subjectId: Number(subjectId),
        semesterId: Number(assignData.semesterId),
        startDate: assignData.startDate,
        endDate: assignData.endDate,
        status: 'active',
      })
    })
    setAssignments(surveyAssignmentAPI.getAll())
    setShowAssignModal(false)
    alert('Gán khảo sát thành công!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý khảo sát</h1>
              <p className="text-gray-600 mt-1">Tổng số: {surveys.length} khảo sát</p>
            </div>
            <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Plus className="w-5 h-5" />
              <span>Tạo khảo sát</span>
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {surveys.map((survey) => (
              <div key={survey.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{survey.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${survey.type === 'internal' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {survey.type === 'internal' ? (
                          <>
                            <FileText className="w-3 h-3" />
                            Nội bộ
                          </>
                        ) : (
                          <>
                            <Link className="w-3 h-3" />
                            Google Form
                          </>
                        )}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{survey.description}</p>
                    {assignments.filter(a => a.surveyId === survey.id).length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="text-sm font-medium text-gray-500">Đã gán cho:</span>
                        {Array.from(new Set(assignments.filter(a => a.surveyId === survey.id).map(a => a.subjectId))).map(subjectId => {
                          const s = subjects.find(sub => sub.id === subjectId)
                          return s ? (
                            <span key={s.id} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium border border-indigo-100">
                              {s.code} - {s.name}
                            </span>
                          ) : null
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => { setSelectedSurvey(survey); setShowDetailModal(true) }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem chi tiết"><Eye className="w-5 h-5" /></button>
                    <button onClick={() => handleEdit(survey)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Chỉnh sửa"><Edit className="w-5 h-5" /></button>
                    <button onClick={() => handleAssign(survey)} className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Gán</button>
                    <button onClick={() => handleDelete(survey)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-4xl font-bold text-slate-900">{isEditing ? 'Chỉnh sửa khảo sát' : 'Tạo khảo sát mới'}</h3>
              <button onClick={() => setShowFormModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-7 h-7" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-5">
              <div>
                <label className="block text-xl font-semibold text-slate-900 mb-2">Tiêu đề khảo sát <span className="text-red-500">*</span></label>
                <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-lg" placeholder="Nhập tiêu đề khảo sát" />
                {formErrors.title && <p className="text-sm text-red-600 mt-1">{formErrors.title}</p>}
              </div>

              <div>
                <label className="block text-xl font-semibold text-slate-900 mb-2">Mô tả <span className="text-red-500">*</span></label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-lg resize-none" placeholder="Nhập mô tả khảo sát" />
                {formErrors.description && <p className="text-sm text-red-600 mt-1">{formErrors.description}</p>}
              </div>

              <div>
                <label className="block text-xl font-semibold text-slate-900 mb-2">Loại khảo sát <span className="text-red-500">*</span></label>
                <div className="flex gap-8">
                  <label className="flex items-center text-lg font-semibold text-slate-900">
                    <input type="radio" value="internal" checked={formData.type === 'internal'} onChange={(e) => setFormData({ ...formData, type: e.target.value as 'internal' | 'external' })} className="w-5 h-5 text-blue-600" />
                    <span className="ml-3">Câu hỏi nội bộ (hệ thống)</span>
                  </label>
                  <label className="flex items-center text-lg font-semibold text-slate-900">
                    <input type="radio" value="external" checked={formData.type === 'external'} onChange={(e) => setFormData({ ...formData, type: e.target.value as 'internal' | 'external' })} className="w-5 h-5 text-blue-600" />
                    <span className="ml-3">Google Form (link)</span>
                  </label>
                </div>
              </div>

              {formData.type === 'external' && (
                <div>
                  <label className="block text-xl font-semibold text-slate-900 mb-2">Link Google Form <span className="text-red-500">*</span></label>
                  <input value={formData.googleFormUrl} onChange={(e) => setFormData({ ...formData, googleFormUrl: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-lg" placeholder="https://forms.gle/..." />
                  {formErrors.googleFormUrl && <p className="text-sm text-red-600 mt-1">{formErrors.googleFormUrl}</p>}
                </div>
              )}

              {formData.type === 'internal' && (
                <div>
                  <label className="block text-xl font-semibold text-slate-900 mb-2">Câu hỏi khảo sát <span className="text-red-500">*</span></label>
                  {formData.questions.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {formData.questions.map((q) => (
                        <div key={q.id} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                          <span className="flex-1 text-sm text-slate-900">{q.question}</span>
                          <button type="button" onClick={() => setFormData({ ...formData, questions: formData.questions.filter((x) => x.id !== q.id) })}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-lg" placeholder="Nhập nội dung câu hỏi" />
                    <select value={newQuestion.type} onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as 'rating' | 'text' })} className="px-4 py-3 border border-slate-300 rounded-xl text-lg font-semibold">
                      <option value="rating">Đánh giá (1-5)</option>
                      <option value="text">Văn bản</option>
                    </select>
                    <button type="button" onClick={handleAddQuestion} className="px-4 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700">
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  {formErrors.questions && <p className="text-sm text-red-600 mt-1">{formErrors.questions}</p>}
                </div>
              )}

              <div>
                <label className="block text-xl font-semibold text-slate-900 mb-2">Trạng thái</label>
                <div className="flex gap-8">
                  <label className="flex items-center text-lg font-semibold text-slate-900">
                    <input type="radio" value="active" checked={formData.status === 'active'} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })} className="w-5 h-5 text-blue-600" />
                    <span className="ml-3">Hoạt động</span>
                  </label>
                  <label className="flex items-center text-lg font-semibold text-slate-900">
                    <input type="radio" value="inactive" checked={formData.status === 'inactive'} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })} className="w-5 h-5 text-blue-600" />
                    <span className="ml-3">Không hoạt động</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 px-4 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors font-bold text-2xl flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  {isEditing ? 'Cập nhật' : 'Tạo mới'}
                </button>
                <button type="button" onClick={() => setShowFormModal(false)} className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-bold text-2xl">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssignModal && selectedSurvey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <form onSubmit={handleSubmitAssign} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Gán khảo sát cho môn học</h3>
              
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Chọn các môn học:</p>
                {subjects.map((subject) => (
                  <label key={subject.id} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-50 rounded">
                    <input 
                      type="checkbox" 
                      value={subject.id}
                      checked={assignData.subjectIds.includes(String(subject.id))}
                      onChange={(e) => {
                        const newSubjectIds = e.target.checked 
                          ? [...assignData.subjectIds, String(subject.id)]
                          : assignData.subjectIds.filter(id => id !== String(subject.id))
                        setAssignData({ ...assignData, subjectIds: newSubjectIds })
                      }}
                      className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{subject.code} - {subject.name}</span>
                  </label>
                ))}
              </div>

              <select value={assignData.semesterId} onChange={(e) => setAssignData({ ...assignData, semesterId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                <option value="">Chọn học kỳ</option>
                {semesters.map((semester) => <option key={semester.id} value={semester.id}>{semester.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" value={assignData.startDate} onChange={(e) => setAssignData({ ...assignData, startDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                <input type="date" value={assignData.endDate} onChange={(e) => setAssignData({ ...assignData, endDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Gán</button>
                <button type="button" onClick={() => setShowAssignModal(false)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && selectedSurvey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Chi tiết khảo sát</h3>
            <p className="font-semibold text-gray-900">{selectedSurvey.title}</p>
            <p className="text-gray-700 mt-2">{selectedSurvey.description}</p>
            <div className="mt-6">
              <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
