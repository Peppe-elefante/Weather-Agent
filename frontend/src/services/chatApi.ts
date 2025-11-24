const API_URL = 'http://localhost:8787/api/chat'

export interface ChatApiResponse {
  response: string
}

export async function sendChatMessage(message: string): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })

  if (!response.ok) {
    throw new Error('Failed to get response from server')
  }

  const data: ChatApiResponse = await response.json()
  return data.response || 'No response received'
}
