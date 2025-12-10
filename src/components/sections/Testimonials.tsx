'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { Testimonial } from '@/types'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    // For now, use static data. In a real app, this would come from an API
    setTestimonials([
      {
        id: '1',
        name: 'Zonathon Doe',
        position: 'CEO & Founder',
        company: 'Company X',
        content: 'Financial planners help people to knowledge in about how to invest and in save their moneye the most efficient way eve plan ners help people tioniio know ledige in about how.',
        avatar: '/images/testimonials/author1.jpg',
        rating: 5,
        published: true,
        createdAt: new Date(),
      },
      {
        id: '2',
        name: 'Martin Smith',
        position: 'CEO & Founder',
        company: 'Google',
        content: 'Asian planners help people to knowledge in about how to invest and in save their moneye the most efficient way eve plan ners help people tioniio know ledige in about how.',
        avatar: '/images/testimonials/author2.jpg',
        rating: 5,
        published: true,
        createdAt: new Date(),
      },
      {
        id: '3',
        name: 'Methail Dev',
        position: 'Managing Director',
        company: 'Paydesk',
        content: 'Hello planners help people to knowledge in about how to invest and in save their moneye the most efficient way eve plan ners help people tioniio know ledige in about how.',
        avatar: '/images/testimonials/author3.jpg',
        rating: 5,
        published: true,
        createdAt: new Date(),
      },
      {
        id: '4',
        name: 'Eliana Tweet',
        position: 'CEO & Founder',
        company: 'Tesla',
        content: 'Financial planners help people to knowledge in about how to invest and in save their moneye the most efficient way eve plan ners help people tioniio know ledige in about how.',
        avatar: '/images/testimonials/author4.jpg',
        rating: 5,
        published: true,
        createdAt: new Date(),
      },
      {
        id: '5',
        name: 'Henry Clark',
        position: 'Founder',
        company: 'Oxyzen',
        content: 'Yelp planners help people to knowledge in about how to invest and in save their moneye the most efficient way eve plan ners help people tioniio know ledige in about how.',
        avatar: '/images/testimonials/author5.jpg',
        rating: 5,
        published: true,
        createdAt: new Date(),
      },
    ])
  }, [])

  return (
    <section className="py-20 bg-black">
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
            Testimonials
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            What clients say about working with me
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-900 p-6 rounded-lg border border-gray-800"
            >
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-700 mr-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">
                    {testimonial.position}
                  </p>
                  <p className="text-primary text-sm font-medium">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
