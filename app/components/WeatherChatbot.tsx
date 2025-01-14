'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ScrollArea from '@/components/ui/scroll-area'

export function WeatherChatbot() {
  const [open, setOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  })

  return (
    <div className="fixed bottom-4 right-4 lg:bottom-10 lg:right-64 z-auto text-black dark:text-white">
      <Button
        onClick={() => setOpen(!open)}
        className="rounded-full size-20 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </Button>
      {open && (
        <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-blue-500 text-white">
            <h3 className="text-lg font-semibold">Weather Assistant</h3>
          </div>
          <ScrollArea className="h-80 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {message.content}
                </span>
              </div>
            ))}
          </ScrollArea>
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about the weather..."
                className="flex-grow mr-2 text-black"
              />
              <Button type="submit">Send</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
