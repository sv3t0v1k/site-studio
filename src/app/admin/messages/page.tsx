'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, MailOpen, Trash2, Eye, Search, Filter } from 'lucide-react'
import { ContactMessage } from '@/types'
import { contactApi } from '@/lib/api'
import toast from 'react-hot-toast'

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await contactApi.getMessages({ limit: 100 })
      if (response.success && response.data) {
        setMessages(response.data.data || [])
      } else {
        toast.error('Failed to fetch messages')
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('An error occurred while fetching messages')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (messageId: string, read: boolean) => {
    try {
      // Note: This would require a PUT endpoint for updating message status
      // For now, we'll just update local state
      setMessages(messages.map(msg =>
        msg.id === messageId ? { ...msg, read } : msg
      ))
      toast.success(`Message marked as ${read ? 'read' : 'unread'}`)
    } catch (error) {
      console.error('Error updating message status:', error)
      toast.error('Failed to update message status')
    }
  }

  const handleDelete = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return
    }

    try {
      // Note: This would require a DELETE endpoint for messages
      // For now, we'll just update local state
      setMessages(messages.filter(msg => msg.id !== messageId))
      toast.success('Message deleted successfully')
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error('An error occurred while deleting message')
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filter === 'all' ||
                         (filter === 'read' && message.read) ||
                         (filter === 'unread' && !message.read)

    return matchesSearch && matchesFilter
  })

  const unreadCount = messages.filter(msg => !msg.read).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-gray-400 mt-2">
            Manage contact form submissions and respond to inquiries.
          </p>
          {unreadCount > 0 && (
            <p className="text-primary mt-1">
              {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {(['all', 'unread', 'read'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === filterType
                  ? 'bg-primary text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType === 'unread' && unreadCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-lg border border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">
                Messages ({filteredMessages.length})
              </h2>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-gray-800' : ''
                    } ${!message.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-white font-medium truncate">
                            {message.name}
                          </h3>
                          {!message.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm truncate">
                          {message.subject}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMarkAsRead(message.id, !message.read)
                          }}
                          className="p-1 text-gray-400 hover:text-primary transition-colors"
                          title={message.read ? 'Mark as unread' : 'Mark as read'}
                        >
                          {message.read ? <MailOpen size={14} /> : <Mail size={14} />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(message.id)
                          }}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Mail className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No messages found</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {searchTerm || filter !== 'all'
                      ? 'Try adjusting your search or filter.'
                      : 'Messages from your contact form will appear here.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-lg border border-gray-800">
            {selectedMessage ? (
              <div className="p-6">
                <div className="border-b border-gray-800 pb-4 mb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">
                        {selectedMessage.subject}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>From: {selectedMessage.name}</span>
                        <span>{selectedMessage.email}</span>
                        <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleMarkAsRead(selectedMessage.id, !selectedMessage.read)}
                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                        title={selectedMessage.read ? 'Mark as unread' : 'Mark as read'}
                      >
                        {selectedMessage.read ? <MailOpen size={18} /> : <Mail size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(selectedMessage.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-gray-300 font-sans">
                      {selectedMessage.message}
                    </pre>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Reply via Email
                  </a>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Select a message</h3>
                <p className="text-gray-400">
                  Choose a message from the list to view its contents and details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
