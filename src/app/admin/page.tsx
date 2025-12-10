'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderOpen, FileText, MessageSquare, Eye, TrendingUp, Users } from 'lucide-react'
import { projectsApi, contactApi } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface DashboardStats {
  projects: number
  publishedProjects: number
  messages: number
  unreadMessages: number
  totalViews: number
}

interface RecentMessage {
  id: string
  name: string
  email: string
  subject: string
  createdAt: string
  read: boolean
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    publishedProjects: 0,
    messages: 0,
    unreadMessages: 0,
    totalViews: 0,
  })
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch projects
      const projectsResponse = await projectsApi.getAll({ limit: 100 })
      const messagesResponse = await contactApi.getMessages({ limit: 5 })

      if (projectsResponse.success && projectsResponse.data) {
        const projects = projectsResponse.data.data || []
        setStats(prev => ({
          ...prev,
          projects: projects.length,
          publishedProjects: projects.filter(p => p.published).length,
        }))
      }

      if (messagesResponse.success && messagesResponse.data) {
        const messages = messagesResponse.data.data || []
        setStats(prev => ({
          ...prev,
          messages: messages.length,
          unreadMessages: messages.filter(m => !m.read).length,
        }))
        setRecentMessages(messages.slice(0, 3))
      }

      // Mock total views for now (would come from analytics)
      setStats(prev => ({
        ...prev,
        totalViews: 15420,
      }))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.projects,
      subtitle: `${stats.publishedProjects} published`,
      icon: FolderOpen,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      href: '/admin/projects',
    },
    {
      title: 'Messages',
      value: stats.messages,
      subtitle: `${stats.unreadMessages} unread`,
      icon: MessageSquare,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      href: '/admin/messages',
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      subtitle: 'Portfolio views',
      icon: Eye,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      href: '/',
    },
    {
      title: 'Published Rate',
      value: stats.projects > 0 ? Math.round((stats.publishedProjects / stats.projects) * 100) : 0,
      subtitle: '% of projects published',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      suffix: '%',
      href: '/admin/projects',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Welcome back! Here's what's happening with your portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Link key={index} href={card.href || '#'}>
              <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {card.value}{card.suffix || ''}
                  </div>
                  {card.subtitle && (
                    <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.length > 0 ? (
                recentMessages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-xs text-primary font-bold">
                        {message.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{message.name}</p>
                      <p className="text-xs text-gray-400 truncate">{message.subject}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleDateString()}
                        {!message.read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full"></span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No messages yet</p>
                  <p className="text-xs text-gray-500 mt-1">New messages will appear here</p>
                </div>
              )}
            </div>

            {recentMessages.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <Link
                  href="/admin/messages"
                  className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                >
                  View all messages →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors">
                <FolderOpen className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm text-white">Add Project</p>
              </button>
              <button className="p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors">
                <FileText className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm text-white">Write Post</p>
              </button>
              <button className="p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors">
                <MessageSquare className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm text-white">View Messages</p>
              </button>
              <button className="p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors">
                <Eye className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm text-white">View Site</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
