export default function LoadingSpinner({ size = 'md' }) {
  const s = size === 'sm' ? 'w-4 h-4' : 'w-8 h-8'
  return (
    <div className="flex justify-center items-center py-16">
      <div className={`${s} border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin`}></div>
    </div>
  )
}
