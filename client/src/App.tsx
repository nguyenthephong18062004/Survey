import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AppRoutes } from './config/routes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen w-full">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
