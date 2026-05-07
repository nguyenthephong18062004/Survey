export interface Subject {
  id: number
  code: string
  name: string
  credits: number
  description: string
  lecturer: {
    name: string
    email: string
  }
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}

export interface Survey {
  id: number
  title: string
  description: string
  type: 'internal' | 'external'
  googleFormUrl?: string
  questions?: SurveyQuestion[]
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}

export interface SurveyQuestion {
  id: number
  question: string
  type: 'rating' | 'text'
}

export interface SurveyAssignment {
  id: number
  surveyId: number
  subjectId: number
  semesterId: number
  startDate: string
  endDate: string
  status: 'active' | 'completed' | 'expired'
}

export interface Semester {
  id: number
  name: string
  startDate: string
  endDate: string
  status: 'upcoming' | 'active' | 'completed'
}

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key)
    if (saved) return JSON.parse(saved)
  } catch (e) {}
  return defaultValue
}

const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data))
}

let subjects: Subject[] = loadFromStorage('mock_subjects', [
  {
    id: 1,
    code: 'IT001',
    name: 'Lập trình căn bản',
    credits: 3,
    description: 'Môn học giới thiệu các khái niệm cơ bản về lập trình',
    lecturer: { name: 'TS. Nguyễn Văn A', email: 'a.nguyen@uit.edu.vn' },
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20',
    isDeleted: false,
  },
  {
    id: 2,
    code: 'IT002',
    name: 'Cấu trúc dữ liệu và giải thuật',
    credits: 4,
    description: 'Nghiên cứu các cấu trúc dữ liệu và giải thuật cơ bản',
    lecturer: { name: 'PGS. Trần Thị B', email: 'b.tran@uit.edu.vn' },
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-04-10',
    isDeleted: false,
  },
])

let surveys: Survey[] = loadFromStorage('mock_surveys', [
  {
    id: 1,
    title: 'Khảo sát đánh giá chất lượng giảng dạy',
    description: 'Khảo sát đánh giá chất lượng giảng dạy môn học',
    type: 'internal',
    questions: [
      { id: 1, question: 'Giảng viên truyền đạt kiến thức rõ ràng, dễ hiểu', type: 'rating' },
      { id: 2, question: 'Nội dung bài giảng phù hợp với mục tiêu môn học', type: 'rating' },
    ],
    status: 'active',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    isDeleted: false,
  },
])

let semesters: Semester[] = loadFromStorage('mock_semesters', [
  { id: 1, name: 'Học kỳ 1 - Năm học 2025-2026', startDate: '2025-09-01', endDate: '2026-01-15', status: 'completed' },
  { id: 2, name: 'Học kỳ 2 - Năm học 2025-2026', startDate: '2026-01-20', endDate: '2026-05-30', status: 'active' },
  { id: 3, name: 'Học kỳ hè - Năm học 2025-2026', startDate: '2026-06-05', endDate: '2026-08-15', status: 'upcoming' },
])

let surveyAssignments: SurveyAssignment[] = loadFromStorage('mock_assignments', [])

export const subjectAPI = {
  getAll: () => subjects.filter((s) => !s.isDeleted),
  create: (subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>) => {
    const newSubject: Subject = {
      ...subject,
      id: Math.max(0, ...subjects.map((s) => s.id)) + 1,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      isDeleted: false,
    }
    subjects.push(newSubject)
    saveToStorage('mock_subjects', subjects)
    return newSubject
  },
  update: (id: number, data: Partial<Subject>) => {
    const index = subjects.findIndex((s) => s.id === id)
    if (index === -1) return null
    subjects[index] = { ...subjects[index], ...data, updatedAt: new Date().toISOString().split('T')[0] }
    saveToStorage('mock_subjects', subjects)
    return subjects[index]
  },
  delete: (id: number) => {
    const index = subjects.findIndex((s) => s.id === id)
    if (index !== -1) {
      subjects[index].isDeleted = true
      saveToStorage('mock_subjects', subjects)
    }
  },
}

export const surveyAPI = {
  getAll: () => surveys.filter((s) => !s.isDeleted),
  create: (survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>) => {
    const newSurvey: Survey = {
      ...survey,
      id: Math.max(0, ...surveys.map((s) => s.id)) + 1,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      isDeleted: false,
    }
    surveys.push(newSurvey)
    saveToStorage('mock_surveys', surveys)
    return newSurvey
  },
  update: (id: number, data: Partial<Survey>) => {
    const index = surveys.findIndex((s) => s.id === id)
    if (index === -1) return null
    surveys[index] = { ...surveys[index], ...data, updatedAt: new Date().toISOString().split('T')[0] }
    saveToStorage('mock_surveys', surveys)
    return surveys[index]
  },
  delete: (id: number) => {
    const index = surveys.findIndex((s) => s.id === id)
    if (index !== -1) {
      surveys[index].isDeleted = true
      saveToStorage('mock_surveys', surveys)
    }
  },
}

export const semesterAPI = {
  getAll: () => semesters,
  create: (semester: Omit<Semester, 'id'>) => {
    const newSemester = { ...semester, id: Math.max(0, ...semesters.map((s) => s.id)) + 1 }
    semesters.push(newSemester)
    saveToStorage('mock_semesters', semesters)
    return newSemester
  },
  update: (id: number, data: Partial<Semester>) => {
    const index = semesters.findIndex((s) => s.id === id)
    if (index === -1) return null
    semesters[index] = { ...semesters[index], ...data }
    saveToStorage('mock_semesters', semesters)
    return semesters[index]
  },
  delete: (id: number) => {
    semesters = semesters.filter((s) => s.id !== id)
    saveToStorage('mock_semesters', semesters)
  },
}

export const surveyAssignmentAPI = {
  getAll: () => surveyAssignments,
  create: (assignment: Omit<SurveyAssignment, 'id'>) => {
    const newAssignment = { ...assignment, id: Math.max(0, ...surveyAssignments.map((sa) => sa.id)) + 1 }
    surveyAssignments.push(newAssignment)
    saveToStorage('mock_assignments', surveyAssignments)
    return newAssignment
  },
}
