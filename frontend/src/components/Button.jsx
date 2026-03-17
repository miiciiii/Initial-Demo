export default function Button({ children, variant = 'primary', className = '', size = 'md', ...props }) {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-xl',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-2.5 text-sm rounded-2xl',
  }
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 focus:ring-indigo-400',
    secondary: 'bg-white/80 text-slate-700 border border-slate-200/80 hover:bg-slate-50 shadow-sm focus:ring-slate-300 backdrop-blur-sm',
    ghost: 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-800 focus:ring-slate-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm focus:ring-red-400',
    gradient: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-sm shadow-indigo-200 focus:ring-indigo-400',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
