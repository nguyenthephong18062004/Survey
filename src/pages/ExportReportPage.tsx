import { useState } from 'react'
import { ArrowLeft, FileDown, FileSpreadsheet, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ExportReportPage() {
  const navigate = useNavigate()
  const [selectedFormat, setSelectedFormat] = useState('')
  const [reportType, setReportType] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const formats = [
    { id: 'pdf', name: 'PDF', icon: FileDown, description: 'Định dạng PDF (Phù hợp để in ấn)' },
    { id: 'excel', name: 'Excel', icon: FileSpreadsheet, description: 'Định dạng Excel (Phù hợp để phân tích dữ liệu)' },
  ]

  const reportTypes = [
    { id: 'subject', name: 'Báo cáo theo môn học' },
    { id: 'teacher', name: 'Báo cáo theo giảng viên' },
    { id: 'school', name: 'Báo cáo tổng hợp toàn trường' },
    { id: 'semester', name: 'Báo cáo theo học kỳ' },
  ]

  const handleExport = () => {
    if (!selectedFormat) {
      alert('Vui lòng chọn định dạng file')
      return
    }
    if (!reportType) {
      alert('Vui lòng chọn loại báo cáo')
      return
    }

    setIsExporting(true)
    setExportSuccess(false)

    setTimeout(() => {
      setIsExporting(false)
      setExportSuccess(true)
      setTimeout(() => {
        const fileName = `bao_cao_${reportType}_${Date.now()}.${selectedFormat}`
        alert(`Đang tải file: ${fileName}`)
      }, 500)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Xuất báo cáo</h1>
            <p className="text-gray-600 mt-1">Tải xuống báo cáo dưới dạng file PDF hoặc Excel</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Chọn loại báo cáo <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setReportType(type.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${reportType === type.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{type.name}</span>
                    {reportType === type.id && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Chọn định dạng file <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formats.map((format) => {
                const Icon = format.icon
                return (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-6 border-2 rounded-lg text-left transition-all ${selectedFormat === format.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${selectedFormat === format.id ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Icon className={`w-6 h-6 ${selectedFormat === format.id ? 'text-green-600' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{format.name}</h4>
                          {selectedFormat === format.id && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{format.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${isExporting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
            >
              {isExporting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang tạo file...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FileDown className="w-5 h-5" />
                  Xuất báo cáo
                </span>
              )}
            </button>

            {exportSuccess && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Xuất báo cáo thành công!</p>
                    <p className="text-sm text-green-700 mt-1">File đang được tải xuống...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
