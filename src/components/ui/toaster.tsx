'use client'

import { Toaster as HotToaster } from 'react-hot-toast'

interface ToasterProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  toastOptions?: any
}

export function Toaster({ position = 'top-right', toastOptions }: ToasterProps) {
  return (
    <HotToaster
      position={position}
      toastOptions={{
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #333',
        },
        success: {
          iconTheme: {
            primary: '#ee4818',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
        ...toastOptions,
      }}
    />
  )
}
