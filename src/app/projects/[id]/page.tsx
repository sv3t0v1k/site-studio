'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Calendar, User } from 'lucide-react'
import { Project } from '@/types'
import { projectsApi } from '@/lib/api'
import HtmlRenderer from '@/components/ui/html-renderer'
import { formatDate } from '@/lib/utils'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    setLoading(true)
    try {
      const response = await projectsApi.getById(projectId)
      if (response.success && response.data) {
        setProject(response.data)
        // Fetch related projects from same category
        fetchRelatedProjects(response.data.category, projectId)
      } else {
        router.push('/projects')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      router.push('/projects')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProjects = async (category: string, excludeId: string) => {
    try {
      const response = await projectsApi.getAll({
        category,
        published: true,
        limit: 3,
      })

      if (response.success && response.data) {
        const related = response.data.data?.filter(p => p.id !== excludeId) || []
        setRelatedProjects(related.slice(0, 2)) // Show only 2 related projects
      }
    } catch (error) {
      console.error('Error fetching related projects:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
          <Link
            href="/projects"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            ← Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Button */}
      <div className="fixed top-20 left-4 z-10">
        <Link
          href="/projects"
          className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2"
        >
          <ArrowLeft size={20} />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium">
                {project.category}
              </span>
              {project.featured && (
                <span className="inline-block ml-3 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                  Featured Project
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              {project.title}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center justify-center space-x-6 text-gray-400 mb-8">
              {project.client && (
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span>Client: {project.client}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{formatDate(project.createdAt)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                >
                  <span>View Live Project</span>
                  <ExternalLink size={20} />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Image */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-800">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
                <div className="prose prose-invert max-w-none">
                  <HtmlRenderer html={project.description} />
                </div>
              </motion.div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Technologies */}
                {project.technologies.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="bg-gray-900 rounded-lg p-6 mb-6"
                  >
                    <h3 className="text-xl font-bold mb-4">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Project Details */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="bg-gray-900 rounded-lg p-6"
                >
                  <h3 className="text-xl font-bold mb-4">Project Details</h3>
                  <div className="space-y-3 text-gray-400">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="text-white">{project.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`${
                        project.published ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {project.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span className="text-white">{formatDate(project.createdAt)}</span>
                    </div>
                    {project.client && (
                      <div className="flex justify-between">
                        <span>Client:</span>
                        <span className="text-white">{project.client}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Additional Images */}
            {project.images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="mt-16"
              >
                <h2 className="text-3xl font-bold mb-8">Project Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.images.map((image, index) => (
                    <div key={index} className="aspect-video relative overflow-hidden rounded-lg bg-gray-800">
                      <Image
                        src={image}
                        alt={`${project.title} - Image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-center mb-12">Related Projects</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedProjects.map((relatedProject, index) => (
                  <motion.div
                    key={relatedProject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="group relative overflow-hidden rounded-lg bg-gray-900"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={relatedProject.image}
                        alt={relatedProject.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Link
                          href={`/projects/${relatedProject.id}`}
                          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
                        >
                          View Project
                        </Link>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                        {relatedProject.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {relatedProject.category}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}
