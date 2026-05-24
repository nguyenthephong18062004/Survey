import { Navigate, useRoutes } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { Header } from '../layouts/Header';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { RoleSelectionPage } from '../pages/RoleSelectionPage';
import { ForgotPassword } from '../pages/ForgotPassword';
import UserManagementPage from '../pages/UserManagementPage';
import SubjectReportPage from '../pages/SubjectReportPage';
import TeacherReportPage from '../pages/TeacherReportPage';
import ExportReportPage from '../pages/ExportReportPage';
import SurveyManagementPage from '../pages/SurveyManagementPage';
import SchoolReportPage from '../pages/SchoolReportPage';
import SurveyPage from '../pages/SurveyPage';
import SubjectManagementPage from '../pages/SubjectManagementPage';
import SemesterManagementPage from '../pages/SemesterManagementPage';
import SubjectsToEvaluatePage from '../pages/SubjectsToEvaluatePage';
import SurveyStatusPage from '../pages/SurveyStatusPage';
import UpdateInfoPage from '../pages/UpdateInfoPage';
import EvaluationResultsPage from '../pages/EvaluationResultsPage';
import FeedbackStatisticsPage from '../pages/FeedbackStatisticsPage';

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <RoleSelectionPage />
  },
  {
    path: '/login/sign-in',
    element: <LoginPage />
  },
  {
    path: '/login/forgot',
    element: <ForgotPassword />
  },
  {
    path: '/',
    element: <Header />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'users',
        element: <UserManagementPage />
      },
      {
        path: 'reports/subject',
        element: <SubjectReportPage />
      },
      {
        path: 'reports/teacher',
        element: <TeacherReportPage />
      },
      {
        path: 'export-report',
        element: <ExportReportPage />
      },
      {
        path: 'survey-management',
        element: <SurveyManagementPage />
      },
      {
        path: 'survey',
        element: <SurveyPage />
      },
      {
        path: 'subjects',
        element: <SubjectManagementPage />
      },
      {
        path: 'semesters',
        element: <SemesterManagementPage />
      },
      {
        path: 'reports/school',
        element: <SchoolReportPage />
      },
      {
        path: 'subjects-to-evaluate',
        element: <SubjectsToEvaluatePage />
      },
      {
        path: 'survey-status',
        element: <SurveyStatusPage />
      },
      {
        path: 'update-info',
        element: <UpdateInfoPage />
      },
      {
        path: 'evaluation-results',
        element: <EvaluationResultsPage />
      },
      {
        path: 'feedback-statistics',
        element: <FeedbackStatisticsPage />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
];

export function AppRoutes() {
  return useRoutes(routes);
}
