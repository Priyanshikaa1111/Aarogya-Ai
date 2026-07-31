import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout.jsx'
import Disclaimer from '../components/Disclaimer.jsx'
import Loader from '../components/Loader.jsx'
import { dietAPI } from '../services/api.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { translateTexts } from '../utils/translate.js'

const INITIAL_FORM = {
  age: '',
  height_cm: '',
  weight_kg: '',
  gender: 'Male',
  diet_preference: 'Vegetarian',
  goal: 'Maintain Weight',
}

export default function DietPlanner() {
  const { language } = useLanguage()
  const [form, setForm] = useState(INITIAL_FORM)
  const [result, setResult] = useState(null)
  const [display, setDisplay] = useState(null)
  const [translating, setTranslating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Re-translate the AI response whenever the result or selected language
  // changes. Falls back to the original English result on any failure.
  useEffect(() => {
    if (!result) {
      setDisplay(null)
      return
    }
    if (language === 'en') {
      setDisplay(result)
      return
    }
    let cancelled = false
    setTranslating(true)
    const mealLen = result.meal_plan.length
    const tipsLen = result.lifestyle_tips.length
    const texts = [
      result.daily_calorie_estimate,
      result.water_intake,
      ...result.meal_plan,
      ...result.lifestyle_tips,
    ]
    translateTexts(texts, language).then((translated) => {
      if (cancelled) return
      setDisplay({
        ...result,
        daily_calorie_estimate: translated[0],
        water_intake: translated[1],
        meal_plan: translated.slice(2, 2 + mealLen),
        lifestyle_tips: translated.slice(2 + mealLen, 2 + mealLen + tipsLen),
      })
      setTranslating(false)
    })
    return () => {
      cancelled = true
    }
  }, [result, language])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await dietAPI.generate({
        ...form,
        age: Number(form.age),
        height_cm: Number(form.height_cm),
        weight_kg: Number(form.weight_kg),
      })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not generate a diet plan right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-1">
        AI Diet Recommendation
      </h1>
      <p className="text-teal-900/60 mb-6">
        Tell us a bit about yourself for a simple, general meal plan.
      </p>

      <form onSubmit={handleSubmit} className="card mb-6 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-ink/80 mb-1.5 block">Age</label>
          <input
            type="number"
            name="age"
            required
            min={1}
            max={119}
            value={form.age}
            onChange={handleChange}
            className="input-field"
            placeholder="21"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80 mb-1.5 block">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="input-field">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80 mb-1.5 block">Height (cm)</label>
          <input
            type="number"
            name="height_cm"
            required
            step="0.1"
            value={form.height_cm}
            onChange={handleChange}
            className="input-field"
            placeholder="172"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80 mb-1.5 block">Weight (kg)</label>
          <input
            type="number"
            name="weight_kg"
            required
            step="0.1"
            value={form.weight_kg}
            onChange={handleChange}
            className="input-field"
            placeholder="68"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80 mb-1.5 block">Diet preference</label>
          <select
            name="diet_preference"
            value={form.diet_preference}
            onChange={handleChange}
            className="input-field"
          >
            <option>Vegetarian</option>
            <option>Non-Vegetarian</option>
            <option>Vegan</option>
            <option>Eggetarian</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-ink/80 mb-1.5 block">Goal</label>
          <select name="goal" value={form.goal} onChange={handleChange} className="input-field">
            <option>Weight Loss</option>
            <option>Weight Gain</option>
            <option>Maintain Weight</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="btn-primary sm:col-span-2 mt-1">
          {loading ? 'Generating plan…' : 'Generate diet plan'}
        </button>
      </form>

      {loading && <Loader label="Building your meal plan…" />}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-6">
          {error}
        </div>
      )}

      {result && display && (
        <div className="flex flex-col gap-4 animate-fadeUp">
          {translating && (
            <p className="text-xs text-teal-900/50 -mb-2">Translating…</p>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card">
              <h3 className="font-display font-semibold text-ink mb-2">Daily calorie estimate</h3>
              <p className="text-sm text-teal-900/80">{display.daily_calorie_estimate}</p>
            </div>
            <div className="card">
              <h3 className="font-display font-semibold text-ink mb-2">Water intake</h3>
              <p className="text-sm text-teal-900/80">{display.water_intake}</p>
            </div>
          </div>

          <div className="card">
            <h3 className="font-display font-semibold text-ink mb-2">Simple meal plan</h3>
            <ul className="list-disc list-inside text-sm text-teal-900/80 space-y-1">
              {display.meal_plan.map((meal, i) => (
                <li key={i}>{meal}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3 className="font-display font-semibold text-ink mb-2">Healthy lifestyle tips</h3>
            <ul className="list-disc list-inside text-sm text-teal-900/80 space-y-1">
              {display.lifestyle_tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          <Disclaimer text={result.disclaimer} />
        </div>
      )}
    </DashboardLayout>
  )
}
