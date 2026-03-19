import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import api from '../api/axios'
import { SearchSkeleton } from '../components/Skeleton'
import Badge from '../components/Badge'
import GlassCard from '../components/GlassCard'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState({ protocols: [], threads: [] })
  const [loading, setLoading] = useState(false)
  const [sort, setSort] = useState('recent')
  const [activeTag, setActiveTag] = useState(null)
  const [availableTags, setAvailableTags] = useState([])
  const debounceRef = useRef(null)

  const doSearch = async (q, s, tag = null) => {
    if (!q.trim()) {
      setResults({ protocols: [], threads: [] })
      setAvailableTags([])
      return
    }
    setLoading(true)
    try {
      const params = { q, sort: s }
      if (tag) params.tags = tag
      const res = await api.get('/search', { params })
      const data = res.data.data
      const protocols = (data.protocols || []).map(h => h.document)
      const threads = (data.threads || []).map(h => h.document)
      setResults({ protocols, threads })
      // Only refresh available tags on unfiltered searches so the tag list stays stable
      if (!tag) {
        const tags = [...new Set([
          ...protocols.flatMap(p => p.tags || []),
          ...threads.flatMap(t => t.tags || []),
        ])]
        setAvailableTags(tags)
      }
    } catch {
      setResults({ protocols: [], threads: [] })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const q = searchParams.get('q') || ''
    setQuery(q)
    setActiveTag(null)
    setAvailableTags([])
    doSearch(q, sort)
  }, [searchParams])

  const handleInput = (e) => {
    const val = e.target.value
    setQuery(val)
    setActiveTag(null)
    setSearchParams(val ? { q: val } : {})
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(val, sort), 300)
  }

  const handleSort = (s) => {
    setSort(s)
    doSearch(query, s, activeTag)
  }

  const handleTag = (tag) => {
    const next = activeTag === tag ? null : tag
    setActiveTag(next)
    doSearch(query, sort, next)
  }

  const total = results.protocols.length + results.threads.length

  return (
    <div className="space-y-4">
      <div className="pt-2 pb-1">
        <h1 className="text-xl font-bold text-slate-900">Search</h1>
        <p className="text-sm text-slate-500 mt-0.5">Find protocols and discussions</p>
      </div>

      {/* Search input */}
      <GlassCard className="p-3">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={query} onChange={handleInput}
            placeholder="Search protocols and threads..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/60 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:bg-white transition-all"
            autoFocus />
        </div>
      </GlassCard>

      {/* Sort pills */}
      <div className="flex gap-1.5 flex-wrap">
        {[['recent', 'Recent'], ['upvoted', 'Most Upvoted']].map(([val, label]) => (
          <button key={val} onClick={() => handleSort(val)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 ${sort === val ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white/70 backdrop-blur-sm border border-slate-200/60 text-slate-500 hover:bg-white/90 hover:text-slate-800'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Tag filter pills */}
      {!loading && query && availableTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-slate-400 mr-0.5">Tag:</span>
          {availableTags.map(tag => (
            <button key={tag} onClick={() => handleTag(tag)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 ${activeTag === tag ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white/70 backdrop-blur-sm border border-slate-200/60 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200/60'}`}>
              {tag}
            </button>
          ))}
          {activeTag && (
            <button onClick={() => handleTag(activeTag)}
              className="px-2 py-1 rounded-lg text-xs text-slate-400 hover:text-slate-600 transition-colors">
              ✕ clear
            </button>
          )}
        </div>
      )}

      {loading ? <SearchSkeleton /> : (
        <>
          {query && (
            <p className="text-xs text-slate-400 px-1">
              {total} result{total !== 1 ? 's' : ''} for "<span className="text-slate-600 font-medium">{query}</span>"
              {activeTag && <> tagged <span className="text-indigo-600 font-medium">{activeTag}</span></>}
            </p>
          )}

          {results.protocols.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Protocols</h2>
              {results.protocols.map(p => (
                <Link key={p.id} to={`/protocols/${p.id}`}
                  className="block bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 hover:bg-white/90 hover:shadow-md hover:border-indigo-200/50 transition-all duration-200">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 hover:text-indigo-700">{p.title}</h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <svg className="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                      </svg>
                      <span className="text-xs font-semibold text-slate-500">{p.votes ?? 0}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(p.tags || []).map(tag => <Badge key={tag} tag={tag} />)}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {results.threads.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Threads</h2>
              {results.threads.map(t => (
                <Link key={t.id} to={`/threads/${t.id}`}
                  className="block bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-4 hover:bg-white/90 hover:shadow-md hover:border-indigo-200/50 transition-all duration-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">{t.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{t.body}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(t.tags || []).map(tag => <Badge key={tag} tag={tag} />)}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {query && total === 0 && (
            <GlassCard className="p-16 text-center">
              <p className="text-slate-400 text-sm">No results for "<span className="text-slate-600">{query}</span>"</p>
              <p className="text-slate-300 text-xs mt-1">
                {activeTag ? 'Try clearing the tag filter or use different keywords' : 'Try different keywords'}
              </p>
            </GlassCard>
          )}

          {!query && (
            <GlassCard className="p-16 text-center">
              <svg className="w-10 h-10 text-slate-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-slate-400 text-sm">Start typing to search protocols and threads</p>
            </GlassCard>
          )}
        </>
      )}
    </div>
  )
}
