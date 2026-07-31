import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PublicNav from '../components/PublicNav.jsx'
import { authAPI } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.register(form)
      login(res.data.access_token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-cloud">
      <PublicNav />
      <div className="max-w-md mx-auto px-6 py-10">
        <div className="card animate-fadeUp">
          <h1 className="font-display text-2xl font-semibold text-ink mb-1">Create your account</h1>
          <p className="text-sm text-teal-900/60 mb-6">Start understanding your health today.</p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-ink/80 mb-1.5 block">Full name</label>
              <input
                name="full_name"
                required
                minLength={2}
                value={form.full_name}
                onChange={handleChange}
                className="input-field"
                placeholder="Vivek Kumar"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink/80 mb-1.5 block">Email</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink/80 mb-1.5 block">Password</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                className="input-field"
                placeholder="At least 6 characters"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary mt-2">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-teal-900/60 mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-700 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
