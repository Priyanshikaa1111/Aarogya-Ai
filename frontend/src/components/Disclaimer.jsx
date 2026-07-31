export default function Disclaimer({ text }) {
  return (
    <div className="flex gap-3 items-start bg-coral/10 border border-coral/30 rounded-xl px-4 py-3 text-sm text-ink/80">
      <span className="text-coral font-bold leading-none mt-0.5">⚕</span>
      <p>
        {text ||
          'This information is AI-generated and is for educational purposes only. Please consult a qualified healthcare professional for medical advice.'}
      </p>
    </div>
  )
}
