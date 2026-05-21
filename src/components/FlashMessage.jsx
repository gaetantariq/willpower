import React from 'react'

export default function FlashMessage({ message }) {
  if (!message) return null
  return (
    <div
      className="fixed top-5 left-1/2 font-mono-tech text-xs px-5 py-2.5 rounded-lg z-50 whitespace-nowrap animate-slide-down"
      style={{
        transform: 'translateX(-50%)',
        background: 'rgba(0,255,136,0.15)',
        border: '1px solid #00ff88',
        color: '#00ff88',
      }}
    >
      {message}
    </div>
  )
}
