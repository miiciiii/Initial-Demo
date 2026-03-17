import { useState } from 'react'
import api from '../api/axios'
import VoteButtons from './VoteButtons'
import Button from './Button'

export default function CommentItem({ comment, depth = 0 }) {
  const [showReply, setShowReply] = useState(false)
  const [replyBody, setReplyBody] = useState('')
  const [replies, setReplies] = useState(comment.replies || [])
  const [submitting, setSubmitting] = useState(false)

  const submitReply = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await api.post('/comments', { thread_id: comment.thread_id, parent_id: comment.id, body: replyBody })
      setReplies(prev => [...prev, res.data.data])
      setReplyBody('')
      setShowReply(false)
    } catch { alert('Failed to post reply.') }
    finally { setSubmitting(false) }
  }

  return (
    <div className={depth > 0 ? 'ml-5 pl-4 border-l-2 border-indigo-100/60' : ''}>
      <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 mb-2 hover:bg-white/80 transition-all">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{(comment.user?.name || 'U')[0].toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-800">{comment.user?.name}</span>
              <span className="text-xs text-slate-400">{new Date(comment.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{comment.body}</p>
            <div className="flex items-center gap-2 mt-2">
              <VoteButtons votableId={comment.id} votableType="comment" initialScore={comment.vote_score || 0} />
              {depth < 3 && (
                <button onClick={() => setShowReply(!showReply)}
                  className="text-xs text-slate-400 hover:text-indigo-600 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-indigo-50">
                  {showReply ? 'Cancel' : 'Reply'}
                </button>
              )}
            </div>
          </div>
        </div>
        {showReply && (
          <form onSubmit={submitReply} className="mt-3 space-y-2 pl-10">
            <textarea required value={replyBody} onChange={e => setReplyBody(e.target.value)}
              placeholder="Write a reply..." rows={2}
              className="w-full bg-slate-50/80 border border-slate-200/60 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 resize-none transition-all" />
            <Button type="submit" size="sm" disabled={submitting}>{submitting ? 'Posting...' : 'Post Reply'}</Button>
          </form>
        )}
      </div>
      {replies.map(r => <CommentItem key={r.id} comment={r} depth={depth + 1} />)}
    </div>
  )
}
