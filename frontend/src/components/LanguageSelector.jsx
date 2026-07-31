import { useLanguage } from '../context/LanguageContext.jsx'

export default function LanguageSelector() {
  const { language, setLanguage, languages } = useLanguage()

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      aria-label="AI response language"
      className="text-sm rounded-xl border border-teal-100 bg-white px-3 py-1.5 text-ink
      focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-shadow"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  )
}
