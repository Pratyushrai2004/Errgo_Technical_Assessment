import React, { useState, useEffect, useRef, FormEvent } from 'react'

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState('')
  const wsRef = useRef<WebSocket>()

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/chat')
    wsRef.current = ws
    ws.onmessage = event => {
      setMessages(prev => [...prev, event.data])
    }
    return () => {
      ws.close()
    }
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    wsRef.current?.send(input)
    setInput('')
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="bg-gray-200 rounded px-3 py-1">
            {msg}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          placeholder="Type a message…"
          className="flex-1 border rounded px-2"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="bg-purple-500 text-white px-4 rounded">
          Send
        </button>
      </form>
    </div>
  )
}

export default Chat
