import { useCallback, useEffect, useRef, useState } from 'react'
import {Centrifuge} from 'centrifuge'

type Message = {
  text: string
  createdAt: string
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [connected, setConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const centrifuge = new Centrifuge(
      'ws://localhost:8000/connection/websocket',
    )

    centrifuge.on('connected', () => setConnected(true))
    centrifuge.on('disconnected', () => setConnected(false))

    const sub = centrifuge.newSubscription('chat')

    sub.on('publication', (ctx) => {
      const message = ctx.data as Message
      setMessages((prev) => {
        if (prev.some((m) => m.createdAt === message.createdAt)) return prev
        return [...prev, message]
      })
    })

    sub.subscribe()
    centrifuge.connect()

    return () => {
      sub.unsubscribe()
      centrifuge.disconnect()
    }
  }, [])


  useEffect(() => {
    fetch('/chat')
      .then((res) => res.json())
      .then(setMessages)
      .catch(() => {})
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    setSending(true)
    setInput('')

    try {
      await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
    } catch {
      setInput(text)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="chat">
      <header className="chat-header">
        <div className="chat-header-avatar">C</div>
        <div className="chat-header-info">
          <h1>ChatCore</h1>
          <span className="chat-header-status">
            {connected ? 'Connected' : 'Connecting...'}
          </span>
        </div>
      </header>

      <main className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <p>No messages yet</p>
            <span>Say hello to start the conversation</span>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={`${msg.createdAt}-${i}`} className="message">
              <div className="message-bubble">
                <p>{msg.text}</p>
                <time dateTime={msg.createdAt}>{formatTime(msg.createdAt)}</time>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="chat-input-area">
        <form className="chat-input-form" onSubmit={sendMessage}>
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={sending}
            autoFocus
          />
          <button
            type="submit"
            className="chat-send"
            disabled={!input.trim() || sending}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  )
}

export default App
