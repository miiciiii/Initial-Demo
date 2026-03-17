import { useState } from 'react'
import api from '../api/axios'

export default function VoteButtons({ votableId, votableType, initialScore = 0 }) {
  const [score, setScore] = useState(initialScore)
  const [loading, setLoading] = useState(false)
  const [voted, setVoted] = useState(null)

  const vote = async (value) => {
    if (loading) return
    setLoading(true)
    try {
      const res = await api.post('/votes', { votable_id: votableId, votable_type: votableType, value })
      setScore(res.data.data.score)
      setVoted(voted === value ? null : value)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-1 bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-1 py-0.5">
      <button onClick={() => vote(1)} disabled={loading}
        className={`p-1.5 rounded-xl transition-all duration-150 ${voted === 1 ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <span className={`text-xs font-bold min-w-[1.25rem] text-center ${score > 0 ? 'text-indigo-600' : score < 0 ? 'text-rose-500' : 'text-slate-500'}`}>
        {score}
      </span>
      <button onClick={() => vote(-1)} disabled={loading}
        className={`p-1.5 rounded-xl transition-all duration-150 ${voted === -1 ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  )
}
