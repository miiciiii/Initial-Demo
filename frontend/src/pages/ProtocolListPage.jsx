import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import ProtocolCard from '../components/ProtocolCard'
import Pagination from '../components/Pagination'
import { ProtocolListSkeleton } from '../components/Skeleton'
import ErrorMessage from '../components/ErrorMessage'
import Button from '../components/Button'
import GlassCard from '../components/GlassCard'

const SORT_OPTIONS = [
  { value: 'all',      label: 'All Protocols' },
  { value: 'recent',   label: 'Recent' },
  { value: 'reviewed', label: 'Most Reviewed' },
  { value: 'upvoted',  label: 'Most Upvoted' },
]

export default function ProtocolListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [protocols, setProtocols] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('all')
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(searchParams.get('new') === '1')
  const [form, setForm] = useState({ title: '', content: '', tags: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchProtocols = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { sort: sort === 'all' ? 'recent' : sort, page, per_page: 6 }
      if (search) params.search = search
      const res = await api.get('/protocols', { params })
      setProtocols(res.data.data.data)
      setMeta(res.data.data)
    } catch { setError('Failed to load protocols.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProtocols() }, [sort, page])

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchProtocols() }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/protocols', {
        title: form.title,
        content: form.content,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      })
      setForm({ title: '', content: '', tags: '' })
      setShowForm(false)
      setSearchParams({})
      fetchProtocols()
    } catch { alert('Failed to create protocol.') }
    finally { setSubmitting(false) }
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="pt-2 pb-1">
        <h1 className="text-3xl font-bold text-slate-900">Protocols</h1>
        <p className="text-base text-slate-500 mt-1">Browse and discuss research protocols</p>
      </div>

      {/* Create Form */}
      {showForm && (
        <GlassCard className="p-5">
          <h2 className="font-semibold text-slate-900 mb-4 text-sm">Create Protocol</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              placeholder="Protocol title"
              className="w-full bg-slate-50/80 border border-slate-200/60 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:bg-white transition-all" />
            <textarea required value={form.content} onChange={e => setForm({...form, content: e.target.value})}
              placeholder="Protocol content and procedures..." rows={5}
              className="w-full bg-slate-50/80 border border-slate-200/60 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:bg-white transition-all resize-none" />
            <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})}
              placeholder="Tags (comma separated: biology, medicine, lab)"
              className="w-full bg-slate-50/80 border border-slate-200/60 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:bg-white transition-all" />
            <div className="flex gap-2">
              <Button type="submit" variant="gradient" disabled={submitting}>{submitting ? 'Creating...' : 'Publish Protocol'}</Button>
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setSearchParams({}) }}>Cancel</Button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Search + Filter bar */}
      <GlassCard className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              onKeyDown={e => e.key === 'Enter' && fetchProtocols()}
              placeholder="Search protocols..."
              className="w-full pl-10 pr-3 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:bg-white transition-all"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {SORT_OPTIONS.map(o => (
              <button key={o.value} onClick={() => { setSort(o.value); setPage(1) }}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-150 ${sort === o.value ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-800'}`}>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Content */}
      {loading ? <ProtocolListSkeleton /> : error ? <ErrorMessage message={error} /> : (
        <>
          <div className="space-y-4">
            {protocols.map(p => <ProtocolCard key={p.id} protocol={p} />)}
          </div>
          {protocols.length === 0 && (
            <GlassCard className="p-16 text-center">
              <p className="text-slate-400 text-sm">No protocols found.</p>
            </GlassCard>
          )}
          <Pagination meta={meta} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
