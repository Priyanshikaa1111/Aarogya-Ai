export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="relative w-10 h-10">
        <span className="absolute inset-0 rounded-full bg-teal-400 animate-pulseSlow" />
        <span className="absolute inset-2 rounded-full bg-teal-600" />
      </div>
      <p className="text-sm text-teal-800/70">{label}</p>
    </div>
  )
}
