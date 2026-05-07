import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { surveyAPI, surveyAssignmentAPI, type Survey } from '../data/mockData'

export default function TakeSurveyPage() {
  const navigate = useNavigate()
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null)

  useEffect(() => {
    const assignments = surveyAssignmentAPI.getAll()
    const assignedSurveyIds = assignments.map(a => a.surveyId)
    const activeSurveys = surveyAPI.getAll().filter((s: Survey) => s.status === 'active' && assignedSurveyIds.includes(s.id))
    setSurveys(activeSurveys)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => selectedSurvey ? setSelectedSurvey(null) : navigate('/')} className="p-2 hover:bg-white rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{selectedSurvey ? selectedSurvey.title : 'Thực hiện khảo sát'}</h1>
            <p className="text-gray-600 mt-1">{selectedSurvey ? selectedSurvey.description : 'Danh sách các môn học / khảo sát bạn cần thực hiện'}</p>
          </div>
        </div>

        {!selectedSurvey ? (
          <div className="space-y-4">
            {surveys.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm">
                Hiện không có khảo sát nào đang hoạt động.
              </div>
            ) : (
              surveys.map(survey => (
                <div key={survey.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedSurvey(survey)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{survey.title}</h3>
                      <p className="text-gray-600 mt-2">{survey.description}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Đang mở</span>
                  </div>
                  <div className="mt-4 text-sm text-gray-500 flex gap-4">
                    <span>Loại: {survey.type === 'internal' ? 'Nội bộ' : 'Google Form'}</span>
                    <span>Cập nhật: {survey.updatedAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
            {selectedSurvey.googleFormUrl ? (
              <iframe 
                src={selectedSurvey.googleFormUrl} 
                className="w-full h-[800px] border-0" 
                title={selectedSurvey.title}
              >
                Đang tải...
              </iframe>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-500 min-h-[400px]">
                Khảo sát này chưa được cấu hình Link Google Form để thực hiện online.<br/>
                Vui lòng liên hệ quản trị viên.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
