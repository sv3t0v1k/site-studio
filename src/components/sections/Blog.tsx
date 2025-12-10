'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, User } from 'lucide-react'
import { BlogPost } from '@/types'

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    // For now, use static data. In a real app, this would come from an API
    setPosts([
      {
        id: '1',
        title: 'Create a Landing Page That Performs Great',
        slug: 'create-landing-page-that-performs-great',
        content: 'Learn how to create high-converting landing pages with modern design principles and best practices.',
        excerpt: 'Learn how to create high-converting landing pages with modern design principles and best practices.',
        author: 'Enna Noir',
        category: 'Design',
        tags: ['landing-page', 'conversion', 'design'],
        image: '/images/blog/blog1.jpg',
        published: true,
        publishedAt: new Date('2024-01-15'),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        title: 'Starting and Growing a Career in Web Design',
        slug: 'starting-growing-career-web-design',
        content: 'A comprehensive guide for aspiring web designers looking to build successful careers in the creative industry.',
        excerpt: 'A comprehensive guide for aspiring web designers looking to build successful careers in the creative industry.',
        author: 'Enna Noir',
        category: 'Career',
        tags: ['career', 'web-design', 'tips'],
        image: '/images/blog/blog2.jpg',
        published: true,
        publishedAt: new Date('2024-01-10'),
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        id: '3',
        title: 'The Future of UI/UX Design Trends',
        slug: 'future-ui-ux-design-trends',
        content: 'Exploring upcoming trends and technologies that will shape the future of user interface and experience design.',
        excerpt: 'Exploring upcoming trends and technologies that will shape the future of user interface and experience design.',
        author: 'Enna Noir',
        category: 'Trends',
        tags: ['ui-ux', 'trends', 'future'],
        image: '/images/blog/blog3.jpg',
        published: true,
        publishedAt: new Date('2024-01-05'),
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      },
    ])
  }, [])

  return (
    <section id="blog" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Stories
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Insights, thoughts, and stories from the world of design
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-black rounded-lg overflow-hidden border border-gray-800 hover:border-primary/50 transition-colors duration-300"
            >
              {/* Post Image */}
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary/90 text-white text-sm font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                {/* Meta Information */}
                <div className="flex items-center text-gray-400 text-sm mb-4">
                  <div className="flex items-center mr-4">
                    <Calendar size={14} className="mr-1" />
                    <span>
                      {post.publishedAt?.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User size={14} className="mr-1" />
                    <span>{post.author}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Read More Link */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Read more
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/blog"
            className="inline-block px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            View All Posts
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
