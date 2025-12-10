'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Loader } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import RichEditor from '@/components/ui/rich-editor'
import { projectsApi } from '@/lib/api'

interface ProjectForm {
  title: string
  description: string
  category: string
  image: string
  images: string[]
  client: string
  technologies: string
  url: string
  featured: boolean
  published: boolean
}

export default function NewProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [richDescription, setRichDescription] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectForm>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      image: '',
      images: [],
      client: '',
      technologies: '',
      url: '',
      featured: false,
      published: false,
    },
  })

  const onSubmit = async (data: ProjectForm) => {
    setIsLoading(true)

    try {
      // Convert technologies string to array
      const technologies = data.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0)

      // Convert images string to array
      const images = data.images.length > 0
        ? data.images.split('\n').map(img => img.trim()).filter(img => img.length > 0)
        : []

      const projectData = {
        title: data.title,
        description: richDescription || data.description, // Use rich editor content if available
        category: data.category,
        image: data.image,
        images,
        client: data.client || undefined,
        technologies,
        url: data.url || undefined,
        featured: data.featured,
        published: data.published,
      }

      const response = await projectsApi.create(projectData)

      if (response.success) {
        toast.success('Project created successfully!')
        router.push('/admin/projects')
      } else {
        toast.error(response.error || 'Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('An error occurred while creating the project')
    } finally {
      setIsLoading(false)
    }
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
            <h1 className="text-3xl font-bold text-white">Create New Project</h1>
            <p className="text-gray-400 mt-2">
              Add a new project to your portfolio collection.
            </p>
          </div>
        </div>
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
                  Publish immediately
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
          {!richDescription && (
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={6}
              className="w-full mt-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
              placeholder="Fallback description if rich editor fails to load"
            />
          )}
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
          )}
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
            <span>Create Project</span>
          </button>
        </div>
      </motion.form>
    </div>
  )
}
