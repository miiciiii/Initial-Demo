import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopRatedPanel from './components/TopRatedPanel'
import ProtocolListPage from './pages/ProtocolListPage'
import ProtocolDetailPage from './pages/ProtocolDetailPage'
import ThreadPage from './pages/ThreadPage'
import SearchPage from './pages/SearchPage'

export default function App() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 min-w-0 lg:ml-64">
        <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6 items-start">
          {/* Main content */}
          <div className="flex-1 min-w-0 max-w-2xl">
            <Routes>
              <Route path="/" element={<Navigate to="/protocols" replace />} />
              <Route path="/protocols" element={<ProtocolListPage />} />
              <Route path="/protocols/:id" element={<ProtocolDetailPage />} />
              <Route path="/threads/:id" element={<ThreadPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </div>
          {/* Right panel */}
          <aside className="hidden xl:block w-64 flex-shrink-0 sticky top-6">
            <TopRatedPanel />
          </aside>
        </div>
      </main>
    </div>
  )
}
