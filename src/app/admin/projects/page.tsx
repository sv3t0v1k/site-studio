'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react'
import { Project } from '@/types'
import { projectsApi } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'
import HtmlRenderer from '@/components/ui/html-renderer'
import { htmlToText, truncateText } from '@/lib/utils'

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await projectsApi.getAll()
      if (response.success && response.data) {
        setProjects(response.data.data || [])
      } else {
        toast.error('Failed to fetch projects')
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error('An error occurred while fetching projects')
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePublished = async (project: Project) => {
    try {
      const response = await projectsApi.update(project.id, {
        published: !project.published,
      })

      if (response.success) {
        setProjects(projects.map(p =>
          p.id === project.id
            ? { ...p, published: !p.published }
            : p
        ))
        toast.success(`Project ${!project.published ? 'published' : 'unpublished'}`)
      } else {
        toast.error('Failed to update project status')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('An error occurred while updating project')
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    try {
      const response = await projectsApi.delete(projectId)
      if (response.success) {
        setProjects(projects.filter(p => p.id !== projectId))
        toast.success('Project deleted successfully')
      } else {
        toast.error('Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('An error occurred while deleting project')
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filter === 'all' ||
                         (filter === 'published' && project.published) ||
                         (filter === 'draft' && !project.published)

    return matchesSearch && matchesFilter
  })

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
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-2">
            Manage your portfolio projects and showcase your work.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Add Project</span>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {(['all', 'published', 'draft'] as const).map((filterType) => (
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
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden"
          >
            {/* Project Image */}
            <div className="aspect-video bg-gray-800 relative overflow-hidden">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  No Image
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  project.published
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {project.published ? 'Published' : 'Draft'}
                </span>
              </div>

              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded">
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="p-4">
              <h3 className="text-white font-semibold mb-2 line-clamp-2">
                {project.title}
              </h3>
              <p className="text-gray-400 text-sm mb-2">
                {project.category}
              </p>
                            <p className="text-gray-500 text-sm line-clamp-2">
                {truncateText(htmlToText(project.description), 100)}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </Link>

                  <button
                    onClick={() => handleTogglePublished(project)}
                    className={`p-2 transition-colors ${
                      project.published
                        ? 'text-green-400 hover:text-green-300'
                        : 'text-yellow-400 hover:text-yellow-300'
                    }`}
                    title={project.published ? 'Unpublish' : 'Publish'}
                  >
                    {project.published ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
          <p className="text-gray-400">
            {searchTerm || filter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first project.'
            }
          </p>
          {!searchTerm && filter === 'all' && (
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Add Your First Project
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
