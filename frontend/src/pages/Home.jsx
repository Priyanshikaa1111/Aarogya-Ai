import { Link } from 'react-router-dom'
import PublicNav from '../components/PublicNav.jsx'

const FEATURES = [
  {
    icon: '✚',
    title: 'Symptom Checker',
    desc: 'Describe how you feel in plain words and get simple, easy-to-understand possible explanations.',
  },
  {
    icon: '☘',
    title: 'Diet Planner',
    desc: 'Get a calorie estimate, simple meal plan, and water intake target based on your goal.',
  },
  {
    icon: '⏰',
    title: 'Medicine Reminder',
    desc: 'Never miss a dose. Add medicines, dosages, and reminder times, all in one place.',
  },
  {
    icon: '💬',
    title: 'Health Chatbot',
    desc: 'Ask general questions about sleep, hydration, exercise, and healthy habits anytime.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-cloud">
      <PublicNav />

      <section className="max-w-5xl mx-auto px-6 md:px-12 pt-10 md:pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-teal-100 rounded-full px-4 py-1.5 text-xs font-semibold text-teal-700 mb-6 shadow-card">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulseSlow" />
          Powered by Google Gemini
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-semibold text-ink leading-tight mb-6">
          Understand your health,
          <br className="hidden md:block" /> one simple answer at a time.
        </h1>
        <p className="text-teal-900/70 text-lg max-w-xl mx-auto mb-8">
          Aarogya AI turns confusing symptoms and health questions into calm, clear,
          beginner-friendly guidance — so you always know your next step.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/register" className="btn-primary text-base px-7 py-3">
            Create free account
          </Link>
          <Link to="/login" className="btn-secondary text-base px-7 py-3">
            Log in
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-12 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="card hover:-translate-y-1 transition-transform">
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-xl mb-4">
                {f.icon}
              </div>
              <h3 className="font-display font-semibold text-ink mb-1.5">{f.title}</h3>
              <p className="text-sm text-teal-900/60 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 md:px-12 pb-24">
        <div className="card bg-teal-900 border-teal-900 text-teal-50 text-center">
          <p className="text-sm leading-relaxed">
            Aarogya AI is an educational tool and does not diagnose diseases. All AI-generated
            responses are for general information only — always consult a qualified healthcare
            professional for medical advice.
          </p>
        </div>
      </section>
    </div>
  )
}
