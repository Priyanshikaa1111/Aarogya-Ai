import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout.jsx'
import Loader from '../components/Loader.jsx'
import { reminderAPI } from '../services/api.js'

const INITIAL_FORM = { medicine_name: '', dosage: '', reminder_time: '' }

export default function MedicineReminder() {
  const [reminders, setReminders] = useState([])
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadReminders = async () => {
    setLoading(true)
    try {
      const res = await reminderAPI.list()
      setReminders(res.data)
    } catch {
      setError('Could not load your reminders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReminders()
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await reminderAPI.create(form)
      setForm(INITIAL_FORM)
      await loadReminders()
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not add the reminder.')
    } finally {
      setSaving(false)
    }
  }

  const toggleComplete = async (reminder) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminder.id ? { ...r, is_completed: !r.is_completed } : r)),
    )
    try {
      await reminderAPI.update(reminder.id, { is_completed: !reminder.is_completed })
    } catch {
      loadReminders()
    }
  }

  const handleDelete = async (id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id))
    try {
      await reminderAPI.remove(id)
    } catch {
      loadReminders()
    }
  }

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-1">
        Medicine Reminder
      </h1>
      <p className="text-teal-900/60 mb-6">Keep track of your medicines and dosage times.</p>

      <form onSubmit={handleSubmit} className="card mb-6 grid sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-ink/80 mb-1.5 block">Medicine name</label>
          <input
            name="medicine_name"
            required
            value={form.medicine_name}
            onChange={handleChange}
            className="input-field"
            placeholder="Paracetamol"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80 mb-1.5 block">Dosage</label>
          <input
            name="dosage"
            required
            value={form.dosage}
            onChange={handleChange}
            className="input-field"
            placeholder="500mg, 1 tablet"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80 mb-1.5 block">Reminder time</label>
          <input
            type="time"
            name="reminder_time"
            required
            value={form.reminder_time}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary sm:col-span-3">
          {saving ? 'Adding…' : '+ Add reminder'}
        </button>
      </form>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <Loader label="Loading reminders…" />
      ) : reminders.length === 0 ? (
        <div className="card text-center text-sm text-teal-900/60">
          No reminders yet. Add your first one above.
        </div>
      ) : (
        <div className="flex flex-col gap-3 animate-fadeUp">
          {reminders.map((r) => (
            <div
              key={r.id}
              className={`card flex items-center justify-between gap-4 ${
                r.is_completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleComplete(r)}
                  aria-label="Mark as completed"
                  className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                    r.is_completed
                      ? 'bg-teal-600 border-teal-600 text-white'
                      : 'border-teal-300'
                  }`}
                >
                  {r.is_completed && '✓'}
                </button>
                <div>
                  <p className={`font-semibold text-ink ${r.is_completed ? 'line-through' : ''}`}>
                    {r.medicine_name}
                  </p>
                  <p className="text-sm text-teal-900/60">
                    {r.dosage} · {r.reminder_time}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(r.id)}
                className="text-sm text-coral font-semibold hover:underline shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
