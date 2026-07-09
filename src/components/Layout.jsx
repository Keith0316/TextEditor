import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { DarkContext } from './DarkContext'

export default function Layout({ children }) {
  const location = useLocation()
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      setDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const navItems = [
    { path: '/', label: '首页', icon: HomeIcon },
    { path: '/plain', label: '纯文本', icon: TextIcon },
    { path: '/rich', label: '富文本', icon: RichIcon },
    { path: '/markdown', label: 'Markdown', icon: MarkdownIcon },
    { path: '/code', label: '代码', icon: CodeIcon },
  ]

  return (
    <DarkContext.Provider value={{ dark, toggleDark }}>
    <div className={`min-h-screen transition-colors duration-200 ${dark ? 'dark bg-[#0a0a0a]' : 'bg-[#f5f5f7]'}`}>
      {/* Top Nav */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors ${dark ? 'bg-[#0a0a0a]/90 border-gray-800/50' : 'bg-white/80 border-gray-200/60'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-base group-hover:scale-105 transition-transform">
                Te
              </div>
              <span className={`font-semibold text-base hidden sm:block ${dark ? 'text-white' : 'text-gray-900'}`}>
                在线文本编辑器
              </span>
            </Link>

            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const active = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                      active
                        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                        : dark
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="hidden md:block">{item.label}</span>
                  </Link>
                )
              })}
              <button
                onClick={toggleDark}
                className={`ml-2 p-2 rounded-lg transition-colors ${dark ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                title="切换主题"
              >
                {dark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className={`mt-12 border-t transition-colors ${dark ? 'border-gray-800/50 bg-[#0a0a0a]' : 'border-gray-200/60 bg-white/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-xs">
                Te
              </div>
              <span className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                在线文本编辑器 © 2026
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className={`flex items-center gap-1.5 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>
                <ShieldIcon className="w-4 h-4 text-green-500" />
                隐私优先 · 本地处理
              </span>
              <span className={`flex items-center gap-1.5 ${dark ? 'text-gray-500' : 'text-gray-500'}`}>
                <BoltIcon className="w-4 h-4 text-yellow-500" />
                React + Vite
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </DarkContext.Provider>
  )
}

/* Icons */
function HomeIcon(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l9-9 9 9M5 10v10h14V10"/></svg>
}
function TextIcon(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>
}
function RichIcon(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h10M4 18h7"/></svg>
}
function MarkdownIcon(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 17V9l4 4 4-4v8M15 17V9l4 4 4-4"/></svg>
}
function CodeIcon(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 18l-6-6 6-6M16 6l6 6-6 6"/></svg>
}
function SunIcon(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
}
function MoonIcon(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
}
function ShieldIcon(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
}
function BoltIcon(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
}
