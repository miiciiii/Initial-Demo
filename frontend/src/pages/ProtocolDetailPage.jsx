import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import Badge from '../components/Badge'
import StarRating from '../components/StarRating'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import Button from '../components/Button'
import GlassCard from '../components/GlassCard'

export default function ProtocolDetailPage() {
  const { id } = useParams()
  const [protocol, setProtocol] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reviewForm, setReviewForm] = useState({ rating: 5, feedback: '' })
  const [threadForm, setThreadForm] = useState({ title: '', body: '', tags: '' })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showThreadForm, setShowThreadForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchProtocol = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/protocols/${id}`)
      setProtocol(res.data.data)
    } catch { setError('Failed to load protocol.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProtocol() }, [id])

  const submitReview = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      await api.post('/reviews', { protocol_id: Number(id), ...reviewForm })
      setReviewForm({ rating: 5, feedback: '' }); setShowReviewForm(false); fetchProtocol()
    } catch { alert('Failed to submit review.') }
    finally { setSubmitting(false) }
  }

  const submitThread = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      await api.post('/threads', {
        protocol_id: Number(id), title: threadForm.title, body: threadForm.body,
        tags: threadForm.tags ? threadForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      })
      setThreadForm({ title: '', body: '', tags: '' }); setShowThreadForm(false); fetchProtocol()
    } catch { alert('Failed to start thread.') }
    finally { setSubmitting(false) }
  }

  const inputClass = "w-full bg-slate-50/80 border border-slate-200/60 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:bg-white transition-all"

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!protocol) return null

  return (
    <div className="space-y-4">
      {/* Back */}
      <Link to="/protocols" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Protocols
      </Link>

      {/* Protocol */}
      <GlassCard className="p-6">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(protocol.tags || []).map(tag => <Badge key={tag} tag={tag} />)}
        </div>
        <h1 className="text-xl font-bold text-slate-900 leading-snug mb-3">{protocol.title}</h1>
        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">{(protocol.user?.name || 'U')[0].toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">{protocol.user?.name}</p>
            <p className="text-xs text-slate-400">{new Date(protocol.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="ml-auto"><StarRating rating={protocol.rating || 0} size="md" /></div>
        </div>
        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{protocol.content}</p>
      </GlassCard>

      {/* Reviews */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900 text-sm">Reviews <span className="text-slate-400 font-normal">({protocol.reviews?.length || 0})</span></h2>
          <Button variant="secondary" size="sm" onClick={() => setShowReviewForm(!showReviewForm)}>
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </Button>
        </div>

        {showReviewForm && (
          <GlassCard className="p-4 mb-3">
            <form onSubmit={submitReview} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600">Rating</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setReviewForm({...reviewForm, rating: n})}
                      className={`text-lg transition-all ${n <= reviewForm.rating ? 'text-amber-400' : 'text-slate-200 hover:text-amber-300'}`}>★</button>
                  ))}
                </div>
              </div>
              <textarea value={reviewForm.feedback} onChange={e => setReviewForm({...reviewForm, feedback: e.target.value})}
                placeholder="Share your thoughts on this protocol..." rows={3} className={`${inputClass} resize-none`} />
              <Button type="submit" variant="gradient" size="sm" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</Button>
            </form>
          </GlassCard>
        )}

        <div className="space-y-2">
          {(protocol.reviews || []).map(r => (
            <GlassCard key={r.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{(r.user?.name || 'U')[0].toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-800">{r.user?.name}</span>
                    <StarRating rating={r.rating} />
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  {r.feedback && <p className="text-sm text-slate-600 leading-relaxed">{r.feedback}</p>}
                </div>
              </div>
            </GlassCard>
          ))}
          {(protocol.reviews || []).length === 0 && <p className="text-sm text-slate-400 px-1">No reviews yet. Be the first!</p>}
        </div>
      </div>

      {/* Threads */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900 text-sm">Threads <span className="text-slate-400 font-normal">({protocol.threads?.length || 0})</span></h2>
          <Button variant="secondary" size="sm" onClick={() => setShowThreadForm(!showThreadForm)}>
            {showThreadForm ? 'Cancel' : 'Start a Thread'}
          </Button>
        </div>

        {showThreadForm && (
          <GlassCard className="p-4 mb-3">
            <form onSubmit={submitThread} className="space-y-3">
              <input required value={threadForm.title} onChange={e => setThreadForm({...threadForm, title: e.target.value})}
                placeholder="Thread title" className={inputClass} />
              <textarea required value={threadForm.body} onChange={e => setThreadForm({...threadForm, body: e.target.value})}
                placeholder="What would you like to discuss?" rows={4} className={`${inputClass} resize-none`} />
              <input value={threadForm.tags} onChange={e => setThreadForm({...threadForm, tags: e.target.value})}
                placeholder="Tags (comma separated)" className={inputClass} />
              <Button type="submit" variant="gradient" size="sm" disabled={submitting}>{submitting ? 'Posting...' : 'Post Thread'}</Button>
            </form>
          </GlassCard>
        )}

        <div className="space-y-2">
          {(protocol.threads || []).map(t => (
            <Link key={t.id} to={`/threads/${t.id}`}
              className="block bg-white/60 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 hover:bg-white/90 hover:shadow-md hover:border-indigo-200/50 transition-all duration-200">
              <h3 className="text-sm font-semibold text-slate-900 mb-1 hover:text-indigo-700">{t.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">{t.body}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {(t.tags || []).map(tag => <Badge key={tag} tag={tag} />)}
                <span className="text-xs text-slate-400 ml-auto">by {t.user?.name} · {new Date(t.created_at).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
          {(protocol.threads || []).length === 0 && <p className="text-sm text-slate-400 px-1">No threads yet.</p>}
        </div>
      </div>
    </div>
  )
}
