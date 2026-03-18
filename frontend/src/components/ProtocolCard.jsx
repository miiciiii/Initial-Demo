import { Link } from 'react-router-dom'
import Badge from './Badge'

export default function ProtocolCard({ protocol }) {
  const voteScore = protocol.votes_sum_value ?? 0

  return (
    <Link to={`/protocols/${protocol.id}`}
      className="group block bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 hover:bg-white/90 hover:shadow-lg hover:shadow-slate-200/50 hover:border-indigo-200/50 transition-all duration-300">

      {/* Tags */}
      {(protocol.tags || []).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {(protocol.tags || []).slice(0, 3).map(tag => <Badge key={tag} tag={tag} />)}
        </div>
      )}

      {/* Title */}
      <h2 className="text-lg font-semibold text-slate-900 leading-snug mb-2 group-hover:text-indigo-700 transition-colors line-clamp-2">
        {protocol.title}
      </h2>

      {/* Content preview */}
      <p className="text-base text-slate-500 line-clamp-2 leading-relaxed mb-5">
        {protocol.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">{(protocol.user?.name || 'U')[0].toUpperCase()}</span>
          </div>
          <span className="text-sm text-slate-500">{protocol.user?.name || 'Unknown'}</span>
          <span className="text-sm text-slate-300">·</span>
          <span className="text-sm text-slate-400">{new Date(protocol.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
            </svg>
            <span className={`text-sm font-semibold ${voteScore > 0 ? 'text-indigo-600' : voteScore < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
              {voteScore}
            </span>
          </div>
          <span className="text-sm text-slate-400">{protocol.reviews_count ?? 0} reviews</span>
          <span className="text-sm text-slate-400">{protocol.threads_count ?? 0} threads</span>
        </div>
      </div>
    </Link>
  )
}
