import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function TeacherReportPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/')} className="p-2 hover:bg-white rounded-lg transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Báo cáo theo giảng viên</h1>
                        <p className="text-gray-600 mt-1">Trang báo cáo theo giảng viên đang được phát triển.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-gray-700">Chức năng báo cáo theo giảng viên sẽ sớm được bổ sung. Vui lòng thử lại sau.</p>
                </div>
            </div>
        </div>
    )
}
