export interface Subject {
  id: number;
  code: string;
  name: string;
  credits: number;
  description: string;
  lecturerName: string;
  lecturerEmail: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export interface SurveyQuestion {
  id: number;
  surveyId: number;
  question: string;
  type: 'rating' | 'text';
}

export interface Survey {
  id: number;
  title: string;
  description: string;
  questions?: SurveyQuestion[];
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export interface SurveyAssignment {
  id: number;
  surveyId: number;
  subjectId: number;
  semesterId: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'expired';
}

export interface Semester {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
}
