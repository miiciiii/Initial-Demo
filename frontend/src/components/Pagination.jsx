import Button from './Button'

export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null
  return (
    <div className="flex items-center justify-center gap-3 mt-8 pb-4">
      <Button variant="secondary" size="sm" disabled={meta.current_page === 1} onClick={() => onPageChange(meta.current_page - 1)}>
        ← Previous
      </Button>
      <span className="text-xs text-slate-500 bg-white/80 backdrop-blur-sm border border-slate-200/60 px-3 py-1.5 rounded-xl">
        {meta.current_page} / {meta.last_page}
      </span>
      <Button variant="secondary" size="sm" disabled={meta.current_page === meta.last_page} onClick={() => onPageChange(meta.current_page + 1)}>
        Next →
      </Button>
    </div>
  )
}
