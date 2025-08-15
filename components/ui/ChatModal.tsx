'use client'

import { X } from 'lucide-react'

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-background border border-border rounded-2xl shadow-2xl w-full max-w-6xl h-[95vh] md:h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Chat with Soichiro</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>
        
        {/* Iframe Container */}
        <div className="w-full h-[calc(100%-4rem)]">
          <iframe
            src="https://udify.app/chatbot/1rQ6s6rHPz0nRjAu"
            style={{ width: '100%', height: '100%', minHeight: '600px' }}
            frameBorder="0"
            allow="microphone"
            className="w-full h-full border-0"
            title="Dify Chatbot"
          />
        </div>
      </div>
    </div>
  )
}