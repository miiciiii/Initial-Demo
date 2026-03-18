import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import VoteButtons from '../components/VoteButtons'
import CommentItem from '../components/CommentItem'
import Badge from '../components/Badge'
import { ThreadPageSkeleton } from '../components/Skeleton'
import ErrorMessage from '../components/ErrorMessage'
import Button from '../components/Button'
import GlassCard from '../components/GlassCard'

export default function ThreadPage() {
  const { id } = useParams()
  const [thread, setThread] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [commentBody, setCommentBody] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [threadRes, commentsRes] = await Promise.all([
          api.get(`/threads/${id}`),
          api.get(`/comments/thread/${id}`),
        ])
        setThread(threadRes.data.data)
        setComments(commentsRes.data.data)
      } catch { setError('Failed to load thread.') }
      finally { setLoading(false) }
    }
    fetchData()
  }, [id])

  const submitComment = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      const res = await api.post('/comments', { thread_id: Number(id), body: commentBody })
      setComments(prev => [...prev, { ...res.data.data, replies: [] }])
      setCommentBody('')
    } catch { alert('Failed to post comment.') }
    finally { setSubmitting(false) }
  }

  if (loading) return <ThreadPageSkeleton />
  if (error) return <ErrorMessage message={error} />
  if (!thread) return null

  return (
    <div className="space-y-4">
      {/* Back */}
      <Link to={`/protocols/${thread.protocol_id}`} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Protocol
      </Link>

      {/* Thread */}
      <GlassCard className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-xl font-bold text-slate-900 leading-snug flex-1">{thread.title}</h1>
          <VoteButtons votableId={thread.id} votableType="thread" initialScore={thread.vote_score || 0} initialVote={thread.user_vote ?? null} />
        </div>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mb-4">{thread.body}</p>
        {(thread.tags || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 pb-4 border-b border-slate-100">
            {(thread.tags || []).map(tag => <Badge key={tag} tag={tag} />)}
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{(thread.user?.name || 'U')[0].toUpperCase()}</span>
          </div>
          <span className="text-xs text-slate-500">{thread.user?.name} · {new Date(thread.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </GlassCard>

      {/* Add Comment */}
      <GlassCard className="p-4">
        <form onSubmit={submitComment} className="space-y-3">
          <textarea required value={commentBody} onChange={e => setCommentBody(e.target.value)}
            placeholder="Share your thoughts on this thread..." rows={3}
            className="w-full bg-slate-50/80 border border-slate-200/60 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:bg-white transition-all resize-none" />
          <Button type="submit" variant="gradient" size="sm" disabled={submitting}>{submitting ? 'Posting...' : 'Post Comment'}</Button>
        </form>
      </GlassCard>

      {/* Comments */}
      <div>
        <h2 className="font-semibold text-slate-900 text-sm mb-3">Comments <span className="text-slate-400 font-normal">({comments.length})</span></h2>
        <div className="space-y-2">
          {comments.map(c => <CommentItem key={c.id} comment={c} depth={0} />)}
          {comments.length === 0 && <p className="text-sm text-slate-400 px-1">No comments yet. Be the first!</p>}
        </div>
      </div>
    </div>
  )
}
