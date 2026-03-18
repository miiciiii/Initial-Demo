import { useState } from 'react'
import api from '../api/axios'

export default function VoteButtons({ votableId, votableType, initialScore = 0, initialVote = null }) {
  const [score, setScore] = useState(Number(initialScore))
  const [voted, setVoted] = useState(initialVote)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2000)
  }

  const vote = async (value) => {
    if (loading) return

    // Optimistic update
    const prevScore = score
    const prevVoted = voted
    const isUnvote = voted === value
    const scoreDelta = isUnvote ? -value : voted !== null ? value - voted : value
    setScore(score + scoreDelta)
    setVoted(isUnvote ? null : value)
    setLoading(true)

    try {
      const res = await api.post('/votes', { votable_id: votableId, votable_type: votableType, value })
      setScore(res.data.data.score)
      showToast(res.data.message)
    } catch (e) {
      // Revert on failure
      setScore(prevScore)
      setVoted(prevVoted)
      showToast(e.response?.status === 401 ? 'Login to vote' : 'Failed to vote')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex flex-col items-center gap-0.5 bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-0.5 py-1">
      {toast && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-xs px-2.5 py-1 rounded-lg shadow-lg z-10 pointer-events-none">
          {toast}
        </div>
      )}
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
