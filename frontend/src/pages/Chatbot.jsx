import { useState, useRef, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout.jsx'
import { chatbotAPI } from '../services/api.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { translateTexts } from '../utils/translate.js'

const STARTER_PROMPTS = [
  'How much water should I drink daily?',
  'Tips for better sleep?',
  'How can I improve my digestion naturally?',
]

export default function Chatbot() {
  const { language } = useLanguage()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  const sendMessage = async (text) => {
    const content = text ?? input
    if (!content.trim() || sending) return

    const newMessages = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setInput('')
    setSending(true)

    try {
      const res = await chatbotAPI.send({ message: content, history: newMessages })
      // Only the AI-generated reply is translated; the user's own message
      // above is left untouched.
      const [translatedReply] = await translateTexts([res.data.reply], language)
      setMessages([...newMessages, { role: 'assistant', content: translatedReply }])
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content:
            err.response?.data?.detail ||
            "Sorry, I couldn't respond right now. Please try again in a moment.",
        },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-1">
        AI Health Chatbot
      </h1>
      <p className="text-teal-900/60 mb-6">
        Ask about healthy eating, exercise, sleep, hydration, and everyday habits.
      </p>

      <div className="card flex flex-col h-[65vh]">
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
          {messages.length === 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-teal-900/50 mb-1">Try asking:</p>
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="text-left text-sm text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl px-4 py-2.5 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'self-end bg-teal-600 text-white rounded-br-sm'
                  : 'self-start bg-teal-50 text-ink rounded-bl-sm'
              }`}
            >
              {m.content}
            </div>
          ))}

          {sending && (
            <div className="self-start bg-teal-50 text-ink px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulseSlow" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulseSlow [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulseSlow [animation-delay:0.3s]" />
              </span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
          className="flex gap-2 mt-4 pt-4 border-t border-teal-50"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field"
            placeholder="Ask a health question…"
          />
          <button type="submit" disabled={sending} className="btn-primary shrink-0">
            Send
          </button>
        </form>
      </div>

      <p className="text-xs text-teal-900/40 mt-3">
        Chat history is kept only for this session and is not saved.
      </p>
    </DashboardLayout>
  )
}
