import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function TopRatedPanel() {
  const [protocols, setProtocols] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/protocols', { params: { sort: 'upvoted', per_page: 3, page: 1 } })
      .then(res => setProtocols(res.data.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-900">Most Upvoted</h3>
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
            <Link key={p.id} to={`/protocols/${p.id}`} className="flex items-start gap-3 group">
              <span className={`text-xs font-bold w-5 flex-shrink-0 mt-0.5 ${i === 0 ? 'text-indigo-500' : i === 1 ? 'text-slate-400' : 'text-violet-400'}`}>
                #{i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {p.title}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <svg className="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                  </svg>
                  <span className="text-xs text-slate-500 font-medium">
                    {p.votes_sum_value ?? 0} votes
                  </span>
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
