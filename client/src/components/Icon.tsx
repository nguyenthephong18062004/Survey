import {
  LogIn,
  UserCog,
  BookOpen,
  Calendar,
  ClipboardCheck,
  ListChecks,
  Shield,
  RefreshCw,
  Award,
  PieChart,
  FileText,
  UserCheck,
  Download,
  Sliders,
  LayoutGrid,
} from "lucide-react"

/** Lucide React icons */

type IconProps = { className?: string }

export const IconLogin = ({ className }: IconProps) => <LogIn className={className} />
export const IconUserCog = ({ className }: IconProps) => <UserCog className={className} />
export const IconBook = ({ className }: IconProps) => <BookOpen className={className} />
export const IconCalendar = ({ className }: IconProps) => <Calendar className={className} />
export const IconClipboardCheck = ({ className }: IconProps) => <ClipboardCheck className={className} />
export const IconListChecks = ({ className }: IconProps) => <ListChecks className={className} />
export const IconShield = ({ className }: IconProps) => <Shield className={className} />
export const IconRefresh = ({ className }: IconProps) => <RefreshCw className={className} />
export const IconAward = ({ className }: IconProps) => <Award className={className} />
export const IconPie = ({ className }: IconProps) => <PieChart className={className} />
export const IconFileText = ({ className }: IconProps) => <FileText className={className} />
export const IconUserCheck = ({ className }: IconProps) => <UserCheck className={className} />
export const IconDownload = ({ className }: IconProps) => <Download className={className} />
export const IconSliders = ({ className }: IconProps) => <Sliders className={className} />
export const IconSchoolReport = ({ className }: IconProps) => <LayoutGrid className={className} />
