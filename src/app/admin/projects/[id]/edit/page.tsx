'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Loader, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import RichEditor from '@/components/ui/rich-editor'
import { projectsApi } from '@/lib/api'
import { Project } from '@/types'

interface ProjectForm {
  title: string
  description: string
  category: string
  image: string
  images: string
  client: string
  technologies: string
  url: string
  featured: boolean
  published: boolean
}

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [richDescription, setRichDescription] = useState('')
  const [project, setProject] = useState<Project | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProjectForm>()

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await projectsApi.getById(projectId)
      if (response.success && response.data) {
        const projectData = response.data
        setProject(projectData)

        // Set form values
        reset({
          title: projectData.title,
          description: projectData.description,
          category: projectData.category,
          image: projectData.image,
          images: projectData.images.join('\n'),
          client: projectData.client || '',
          technologies: projectData.technologies.join(', '),
          url: projectData.url || '',
          featured: projectData.featured,
          published: projectData.published,
        })

        // Set rich editor content
        setRichDescription(projectData.description)
      } else {
        toast.error('Project not found')
        router.push('/admin/projects')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Failed to load project')
      router.push('/admin/projects')
    } finally {
      setIsFetching(false)
    }
  }

  const onSubmit = async (data: ProjectForm) => {
    setIsLoading(true)

    try {
      // Convert technologies string to array
      const technologies = data.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0)

      // Convert images string to array
      const images = data.images
        ? data.images.split('\n').map(img => img.trim()).filter(img => img.length > 0)
        : []

      const projectData = {
        title: data.title,
        description: richDescription || data.description,
        category: data.category,
        image: data.image,
        images,
        client: data.client || undefined,
        technologies,
        url: data.url || undefined,
        featured: data.featured,
        published: data.published,
      }

      const response = await projectsApi.update(projectId, projectData)

      if (response.success) {
        toast.success('Project updated successfully!')
        router.push('/admin/projects')
      } else {
        toast.error(response.error || 'Failed to update project')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('An error occurred while updating the project')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    try {
      const response = await projectsApi.delete(projectId)
      if (response.success) {
        toast.success('Project deleted successfully')
        router.push('/admin/projects')
      } else {
        toast.error('Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('An error occurred while deleting the project')
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Project not found</p>
        <Link
          href="/admin/projects"
          className="inline-block mt-4 text-primary hover:text-primary/80"
        >
          ← Back to projects
        </Link>
      </div>
    )
  }

  const published = watch('published')
  const featured = watch('featured')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/projects"
            className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Project</h1>
            <p className="text-gray-400 mt-2">
              Update project details and content.
            </p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-900 rounded-lg border border-gray-800 p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Project Title *
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                type="text"
                id="title"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter project title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                id="category"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">Select a category</option>
                <option value="Branding">Branding</option>
                <option value="Web Design">Web Design</option>
                <option value="Mobile App">Mobile App</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Print">Print</option>
                <option value="Video">Video</option>
                <option value="Photography">Photography</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>
              )}
            </div>

            {/* Client */}
            <div>
              <label htmlFor="client" className="block text-sm font-medium text-gray-300 mb-2">
                Client
              </label>
              <input
                {...register('client')}
                type="text"
                id="client"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                placeholder="Client name (optional)"
              />
            </div>

            {/* URL */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                Project URL
              </label>
              <input
                {...register('url')}
                type="url"
                id="url"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                placeholder="https://example.com"
              />
            </div>

            {/* Technologies */}
            <div>
              <label htmlFor="technologies" className="block text-sm font-medium text-gray-300 mb-2">
                Technologies
              </label>
              <input
                {...register('technologies')}
                type="text"
                id="technologies"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                placeholder="React, TypeScript, Node.js (comma-separated)"
              />
              <p className="mt-1 text-xs text-gray-500">
                Separate technologies with commas
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Main Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
                Main Image URL *
              </label>
              <input
                {...register('image', { required: 'Main image is required' })}
                type="url"
                id="image"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                placeholder="https://example.com/image.jpg"
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-400">{errors.image.message}</p>
              )}
            </div>

            {/* Additional Images */}
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-300 mb-2">
                Additional Images
              </label>
              <textarea
                {...register('images')}
                id="images"
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                placeholder="One image URL per line"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter one image URL per line for gallery images
              </p>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Settings</h3>

              <div className="flex items-center space-x-3">
                <input
                  {...register('featured')}
                  type="checkbox"
                  id="featured"
                  className="w-4 h-4 text-primary bg-gray-800 border-gray-700 rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="featured" className="text-sm text-gray-300">
                  Featured project
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  {...register('published')}
                  type="checkbox"
                  id="published"
                  className="w-4 h-4 text-primary bg-gray-800 border-gray-700 rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="published" className="text-sm text-gray-300">
                  Published
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Description *
          </label>
          <RichEditor
            content={richDescription}
            onChange={setRichDescription}
            placeholder="Describe your project in detail..."
            className="min-h-[300px]"
          />
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-800">
          <Link
            href="/admin/projects"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            {isLoading && <Loader className="w-5 h-5 animate-spin" />}
            <span>Update Project</span>
          </button>
        </div>
      </motion.form>
    </div>
  )
}
