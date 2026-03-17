export default function Badge({ tag, onClick, active = false }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-150
        ${active
          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
          : 'bg-indigo-50/80 text-indigo-600 border border-indigo-100/80 hover:bg-indigo-100/80'
        }`}
    >
      #{tag}
    </button>
  )
}
