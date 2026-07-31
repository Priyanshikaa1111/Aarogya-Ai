import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const QUICK_LINKS = [
  { to: '/symptom-checker', icon: '✚', title: 'Check symptoms', desc: 'Describe how you feel' },
  { to: '/diet-planner', icon: '☘', title: 'Plan your diet', desc: 'Get a simple meal plan' },
  { to: '/medicine-reminder', icon: '⏰', title: 'Add a reminder', desc: 'Never miss a dose' },
  { to: '/chatbot', icon: '💬', title: 'Ask the chatbot', desc: 'General health questions' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.full_name?.split(' ')[0] || 'there'

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-1">
        Hi {firstName} 👋
      </h1>
      <p className="text-teal-900/60 mb-8">What would you like to do today?</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {QUICK_LINKS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="card flex items-center gap-4 hover:-translate-y-1 transition-transform"
          >
            <div className="w-12 h-12 shrink-0 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-2xl">
              {item.icon}
            </div>
            <div>
              <h3 className="font-display font-semibold text-ink">{item.title}</h3>
              <p className="text-sm text-teal-900/60">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="card mt-6 bg-teal-900 border-teal-900 text-teal-50">
        <p className="text-sm leading-relaxed">
          Reminder: Aarogya AI provides general educational information only and does not
          diagnose diseases. Always consult a qualified healthcare professional for medical
          advice.
        </p>
      </div>
    </DashboardLayout>
  )
}
