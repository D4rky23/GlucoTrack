import { NavLink } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const linkClasses = ({ isActive }) =>
    `px-4 py-2 rounded-xl transition-colors duration-300 ${
      isActive
        ? 'bg-emerald-600 text-white'
        : 'hover:bg-emerald-600/10 text-slate-700 dark:text-slate-300'
    }`

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            GlucoTrack
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <NavLink to="/" className={linkClasses}>
            Dashboard
          </NavLink>
          <NavLink to="/predict" className={linkClasses}>
            Predict
          </NavLink>
          <NavLink to="/batch" className={linkClasses}>
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
      </div>
    </nav>
  )
}
