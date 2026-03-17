import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200
      ${isActive
        ? 'bg-indigo-50 text-indigo-600 shadow-sm'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`
    }
  >
    {icon}
    <span className="hidden lg:block">{label}</span>
  </NavLink>
)

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMobileOpen(false)
    }
  }

  const handleNewProtocol = () => {
    navigate('/protocols?new=1')
    setMobileOpen(false)
  }

  const navItems = [
    {
      to: '/protocols',
      label: 'Protocols',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ]

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-200/50 px-4 h-14 flex items-center justify-between">
        <Link to="/protocols" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">O</span>
          </div>
          <span className="font-semibold text-slate-900 text-sm">Optima Solutions</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100">
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 pt-14">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-14 left-0 bottom-0 w-64 bg-white/95 backdrop-blur-2xl border-r border-gray-200/50 p-4 space-y-2">
            {navItems.map(item => <NavItem key={item.to} {...item} />)}
            <button onClick={handleNewProtocol}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200/60">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Protocol
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 bg-white/70 backdrop-blur-2xl border-r border-gray-200/40 z-40 p-5">
        {/* Logo */}
        <Link to="/protocols" className="flex items-center gap-3 px-2 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white text-sm font-bold">O</span>
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm leading-tight">Optima Solutions</p>
            <p className="text-xs text-slate-400 leading-tight">Demo Platform</p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="space-y-1 mb-4">
          {navItems.map(item => <NavItem key={item.to} {...item} />)}
        </nav>

        {/* New Protocol Button */}
        <button
          onClick={handleNewProtocol}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200/60 hover:from-indigo-700 hover:to-violet-700 transition-all duration-200 mb-auto"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden lg:block">New Protocol</span>
        </button>

        <div className="flex-1" />

        {/* Search */}
        <div className="mt-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-100/80 border border-slate-200/60 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:bg-white transition-all"
              />
            </div>
          </form>
        </div>

        {/* Footer label */}
        <p className="text-xs text-slate-400 px-2 mt-4">© 2026 Optima Solutions</p>
      </aside>

      {/* Mobile top spacer */}
      <div className="lg:hidden h-14 flex-shrink-0" />
    </>
  )
}
