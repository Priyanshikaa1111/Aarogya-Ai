import { Link } from 'react-router-dom'

export default function PublicNav() {
  return (
    <header className="flex items-center justify-between px-6 md:px-12 py-5 max-w-6xl mx-auto">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white font-display font-semibold">
          A
        </div>
        <span className="font-display font-semibold text-teal-900 text-lg">Aarogya AI</span>
      </Link>
      <nav className="flex items-center gap-3">
        <Link to="/login" className="btn-secondary">
          Log in
        </Link>
        <Link to="/register" className="btn-primary">
          Get started
        </Link>
      </nav>
    </header>
  )
}
