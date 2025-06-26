import { NavLink } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const linkClasses = ({ isActive }) =>
    `block px-4 py-2 rounded-xl transition-colors duration-300 w-full text-left md:inline md:w-auto md:text-center md:px-4 md:py-2 ${
      isActive
        ? 'bg-emerald-600 text-white'
        : 'hover:bg-emerald-600/10 text-slate-700 dark:text-slate-300'
    }`

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-slate-800 shadow-md h-16 flex items-center">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full px-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            GlucoTrack
          </h1>
        </div>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-2">
          <NavLink to="/" className={linkClasses}>
            Dashboard
          </NavLink>
          <NavLink to="/predict" className={linkClasses}>
            Predict
          </NavLink>
          <NavLink to="/batch-predict" className={linkClasses}>
            Batch
          </NavLink>
          <NavLink to="/model" className={linkClasses}>
            Model Info
          </NavLink>
          <button
            onClick={toggleDarkMode}
            className="ml-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-300"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
         </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
        {/* Mobile burger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Open menu"
          >
            <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-800 shadow-lg border-t border-slate-200 dark:border-slate-700 z-50 animate-fade-in">
          <div className="flex flex-col items-stretch px-4 py-4 gap-2">
            <NavLink to="/" className={linkClasses} onClick={() => setMenuOpen(false)}>
              Dashboard
            </NavLink>
            <NavLink to="/predict" className={linkClasses} onClick={() => setMenuOpen(false)}>
              Predict
            </NavLink>
            <NavLink to="/batch-predict" className={linkClasses} onClick={() => setMenuOpen(false)}>
              Batch
            </NavLink>
            <NavLink to="/model" className={linkClasses} onClick={() => setMenuOpen(false)}>
              Model Info
            </NavLink>
            <button
              onClick={() => { toggleDarkMode(); setMenuOpen(false); }}
              className="mt-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-300 text-left"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <span className="flex items-center gap-2"><svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>Dark</span>
              ) : (
                <span className="flex items-center gap-2"><svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>Light</span>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
