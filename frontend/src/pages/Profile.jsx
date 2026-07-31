import DashboardLayout from '../components/DashboardLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Profile() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-1">Profile</h1>
      <p className="text-teal-900/60 mb-6">Your account details.</p>

      <div className="card max-w-md">
        <div className="w-16 h-16 rounded-full bg-teal-600 text-white flex items-center justify-center font-display text-2xl font-semibold mb-4">
          {user?.full_name?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <div>
            <p className="text-teal-900/50">Full name</p>
            <p className="font-semibold text-ink">{user?.full_name}</p>
          </div>
          <div>
            <p className="text-teal-900/50">Email</p>
            <p className="font-semibold text-ink">{user?.email}</p>
          </div>
          <div>
            <p className="text-teal-900/50">Member since</p>
            <p className="font-semibold text-ink">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
