export default function GlassCard({ children, className = '' }) {
  return (
    <div className={`bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  )
}
