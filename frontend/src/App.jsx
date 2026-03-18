import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import TopRatedPanel from './components/TopRatedPanel'
import ProtocolListPage from './pages/ProtocolListPage'
import ProtocolDetailPage from './pages/ProtocolDetailPage'
import ThreadPage from './pages/ThreadPage'
import SearchPage from './pages/SearchPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function AppLayout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 min-w-0 lg:ml-64">
        <div className="px-5 py-8 flex gap-4 items-start">
          <div className="flex-1 min-w-0">
            <Routes>
              <Route path="/" element={<Navigate to="/protocols" replace />} />
              <Route path="/protocols" element={<ProtocolListPage />} />
              <Route path="/protocols/:id" element={<ProtocolDetailPage />} />
              <Route path="/threads/:id" element={<ThreadPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </div>
          <aside className="hidden xl:block w-72 flex-shrink-0 sticky top-6">
            <TopRatedPanel />
          </aside>
        </div>
      </main>
    </div>
  )
}

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-10h-1M4.34 12h-1m14.95 5.66-.7-.7M6.4 6.4l-.7-.7m12.02 0-.7.7M6.4 17.6l-.7.7" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm leading-tight">Optima Solutions</p>
            <p className="text-xs text-slate-400 leading-tight">Initial Demo</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </AuthProvider>
  )
}
