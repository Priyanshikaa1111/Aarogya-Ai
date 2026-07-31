import { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout.jsx'
import Disclaimer from '../components/Disclaimer.jsx'
import Loader from '../components/Loader.jsx'
import { symptomAPI, careAPI } from '../services/api.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { translateTexts } from '../utils/translate.js'

export default function SymptomChecker() {
  const { language } = useLanguage()
  const [symptoms, setSymptoms] = useState('')
  const [result, setResult] = useState(null)
  const [display, setDisplay] = useState(null)
  const [translating, setTranslating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [careLoading, setCareLoading] = useState(false)
  const [careError, setCareError] = useState('')
  const [facilities, setFacilities] = useState(null)

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
    const causesLen = result.possible_causes.length
    const tipsLen = result.self_care_tips.length
    const texts = [
      result.explanation,
      result.see_doctor,
      ...result.possible_causes,
      ...result.self_care_tips,
    ]
    translateTexts(texts, language).then((translated) => {
      if (cancelled) return
      setDisplay({
        ...result,
        explanation: translated[0],
        see_doctor: translated[1],
        possible_causes: translated.slice(2, 2 + causesLen),
        self_care_tips: translated.slice(2 + causesLen, 2 + causesLen + tipsLen),
      })
      setTranslating(false)
    })
    return () => {
      cancelled = true
    }
  }, [result, language])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!symptoms.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    setFacilities(null)
    setCareError('')
    try {
      const res = await symptomAPI.check({ symptoms })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not check symptoms right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFindCare = () => {
    if (!navigator.geolocation) {
      setCareError('Geolocation is not supported by your browser.')
      return
    }
    setCareLoading(true)
    setCareError('')
    setFacilities(null)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await careAPI.nearby({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setFacilities(res.data.facilities || [])
        } catch (err) {
          setCareError(
            err.response?.data?.detail || 'Could not find nearby care right now. Please try again.',
          )
        } finally {
          setCareLoading(false)
        }
      },
      (geoErr) => {
        setCareLoading(false)
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setCareError('Location access was denied. Please allow location access to find nearby care.')
        } else {
          setCareError('Could not get your location. Please try again.')
        }
      },
    )
  }

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-1">
        AI Symptom Checker
      </h1>
      <p className="text-teal-900/60 mb-6">
        Describe how you feel in your own words, e.g. "I have a headache and mild fever."
      </p>

      <form onSubmit={handleSubmit} className="card mb-6">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={4}
          required
          minLength={3}
          className="input-field resize-none"
          placeholder="Describe your symptoms here…"
        />
        <button type="submit" disabled={loading} className="btn-primary mt-4">
          {loading ? 'Analyzing…' : 'Check symptoms'}
        </button>
      </form>

      {loading && <Loader label="Analyzing your symptoms…" />}

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
          <div className="card">
            <h3 className="font-display font-semibold text-ink mb-2">Possible causes</h3>
            <ul className="list-disc list-inside text-sm text-teal-900/80 space-y-1">
              {display.possible_causes.map((cause, i) => (
                <li key={i}>{cause}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3 className="font-display font-semibold text-ink mb-2">What this means</h3>
            <p className="text-sm text-teal-900/80 leading-relaxed">{display.explanation}</p>
          </div>

          <div className="card">
            <h3 className="font-display font-semibold text-ink mb-2">Self-care tips</h3>
            <ul className="list-disc list-inside text-sm text-teal-900/80 space-y-1">
              {display.self_care_tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="card border-coral/30 bg-coral/5">
            <h3 className="font-display font-semibold text-ink mb-2">Should you see a doctor?</h3>
            <p className="text-sm text-teal-900/80 leading-relaxed">{display.see_doctor}</p>
          </div>

          <Disclaimer text={result.disclaimer} />

          <div className="card">
            <h3 className="font-display font-semibold text-ink mb-2">Find care nearby</h3>
            <p className="text-sm text-teal-900/60 mb-4">
              Find hospitals, clinics, doctors, and pharmacies near your current location.
            </p>
            <button
              type="button"
              onClick={handleFindCare}
              disabled={careLoading}
              className="btn-secondary"
            >
              {careLoading ? 'Finding care near you…' : '🗺️ Find Care Near Me'}
            </button>

            {careLoading && <Loader label="Finding nearby care…" />}

            {careError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mt-4">
                {careError}
              </div>
            )}

            {facilities && facilities.length === 0 && !careError && (
              <div className="text-sm text-teal-900/60 mt-4">
                No nearby healthcare facilities were found. Try again from a different location.
              </div>
            )}

            {facilities && facilities.length > 0 && (
              <div className="flex flex-col gap-3 mt-4">
                {facilities.map((facility, i) => (
                  <div
                    key={i}
                    className="border border-teal-100 rounded-xl p-4 flex flex-col gap-1"
                  >
                    <p className="font-display font-semibold text-ink">{facility.name}</p>
                    <p className="text-sm text-teal-900/70">{facility.address}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-teal-900/60 mt-1">
                      {facility.rating != null && (
                        <span>
                          ⭐ {facility.rating}
                          {facility.user_rating_count != null && ` (${facility.user_rating_count})`}
                        </span>
                      )}
                      {facility.open_now === true && (
                        <span className="text-teal-700 font-semibold">Open now</span>
                      )}
                      {facility.open_now === false && (
                        <span className="text-coral font-semibold">Closed</span>
                      )}
                    </div>
                    <a
                      href={facility.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary mt-3 self-start text-sm px-4 py-2"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
