import { useRef, useEffect } from 'react'
import { Message } from '../types/message'
import { EmptyState } from './EmptyState'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (messages.length === 0) {
    return <EmptyState />
  }

  return (
    <>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.sender === 'user' ? 'message-user' : 'message-assistant'}`}
        >
          <div className="message-content">
            <div className="message-sender">
              {message.sender === 'user' ? 'You' : 'Assistant'}
            </div>
            <div className="message-text">{message.text}</div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </>
  )
}
