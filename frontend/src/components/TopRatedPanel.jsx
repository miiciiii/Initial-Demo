import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import StarRating from './StarRating'

export default function TopRatedPanel() {
  const [protocols, setProtocols] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/protocols', { params: { sort: 'rated', per_page: 3, page: 1 } })
      .then(res => setProtocols(res.data.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-900">Top Rated</h3>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-3 bg-slate-100 rounded-lg w-3/4 mb-1.5" />
              <div className="h-2.5 bg-slate-100 rounded-lg w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {protocols.map((p, i) => (
            <Link key={p.id} to={`/protocols/${p.id}`}
              className="flex items-start gap-3 group">
              <span className={`text-xs font-bold w-5 flex-shrink-0 mt-0.5 ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : 'text-orange-400'}`}>
                #{i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {p.title}
                </p>
                <div className="mt-1">
                  <StarRating rating={p.rating || 0} />
                </div>
              </div>
            </Link>
          ))}
          {protocols.length === 0 && (
            <p className="text-xs text-slate-400">No protocols yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
