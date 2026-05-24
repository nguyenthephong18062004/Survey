import type { LucideIcon } from 'lucide-react'

interface BusinessFunctionCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: string
  onClick?: () => void
}

export function BusinessFunctionCard({ icon: Icon, title, description, color, onClick }: BusinessFunctionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full text-left bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200 hover:-translate-y-1"
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${color}33` }}
      >
        <Icon className="w-7 h-7" style={{ color }} />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </button>
  )
}
