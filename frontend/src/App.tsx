import { useChat } from './hooks/useChat'
import { ChatHeader } from './components/ChatHeader'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'

function App() {
  const { messages, isLoading, sendMessage } = useChat()

  return (
    <div className="app">
      <ChatHeader />
      <main className="chat-container">
        <div className="messages-container">
          <MessageList messages={messages} />
        </div>
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </main>
    </div>
  )
}

export default App
