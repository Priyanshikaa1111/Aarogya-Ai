import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '⌂' },
  { to: '/symptom-checker', label: 'Symptom Checker', icon: '✚' },
  { to: '/diet-planner', label: 'Diet Planner', icon: '☘' },
  { to: '/medicine-reminder', label: 'Medicine Reminder', icon: '⏰' },
  { to: '/chatbot', label: 'Health Chatbot', icon: '💬' },
  { to: '/profile', label: 'Profile', icon: '☺' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? 'bg-teal-600 text-white shadow-card'
        : 'text-teal-900/70 hover:bg-teal-50 hover:text-teal-800'
    }`

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-teal-100 sticky top-0 z-30">
        <span className="font-display font-semibold text-teal-800 text-lg">Aarogya AI</span>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-teal-50"
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 bg-teal-800 mb-1" />
          <span className="block w-5 h-0.5 bg-teal-800 mb-1" />
          <span className="block w-5 h-0.5 bg-teal-800" />
        </button>
      </div>

      <aside
        className={`${
          open ? 'block' : 'hidden'
        } md:block bg-white border-r border-teal-100 md:w-64 w-full md:min-h-screen px-4 py-6 md:sticky md:top-0`}
      >
        <div className="hidden md:flex items-center gap-2 px-2 mb-8">
          <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white font-display font-semibold">
            A
          </div>
          <span className="font-display font-semibold text-teal-900 text-lg">Aarogya AI</span>
        </div>

        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClasses} onClick={() => setOpen(false)}>
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-teal-100">
          <p className="px-2 text-xs text-teal-900/50 mb-2 truncate">{user?.full_name}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-coral hover:bg-coral/10 transition-colors"
          >
            ⎋ Logout
          </button>
        </div>
      </aside>
    </>
  )
}
