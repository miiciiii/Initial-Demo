import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/protocols" className="text-xl font-bold text-indigo-600 whitespace-nowrap">
            ProtoHub
          </Link>
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search protocols and threads..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </form>
          <Link to="/protocols" className="text-sm text-gray-600 hover:text-indigo-600 whitespace-nowrap">
            Protocols
          </Link>
        </div>
      </div>
    </nav>
  )
}
