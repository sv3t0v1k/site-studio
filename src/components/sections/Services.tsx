'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRightUp } from 'lucide-react'
import { Service } from '@/types'

export default function Services() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    // For now, use static data. In a real app, this would come from an API
    setServices([
      {
        id: '1',
        title: 'Brand Identity Design',
        description: 'Blend of strategic thinking and creative flair to craft a digital identity that resonates and captivates.',
        icon: 'ri-palette-line',
        order: 1,
        published: true,
      },
      {
        id: '2',
        title: 'Visual Design',
        description: 'Blend of artistic intuition with strategic insight to craft a visual identity.',
        icon: 'ri-brush-line',
        order: 2,
        published: true,
      },
      {
        id: '3',
        title: 'UX Research',
        description: 'Blend of functionality with aesthetics to create delightful experience.',
        icon: 'ri-search-line',
        order: 3,
        published: true,
      },
      {
        id: '4',
        title: 'Art Direction',
        description: 'Blend of strategic thinking and creative flair to craft a digital identity that resonates and captivates.',
        icon: 'ri-compass-line',
        order: 4,
        published: true,
      },
    ])
  }, [])

  return (
    <section id="services" className="py-20 bg-gray-900">
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
            Services
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Comprehensive design solutions tailored to bring your vision to life
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-black p-8 rounded-lg border border-gray-800 hover:border-primary/50 transition-colors duration-300"
            >
              {/* Service Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black font-bold text-lg">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <i className={`${service.icon} text-2xl text-primary`}></i>
                </div>
              </div>

              {/* Content */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRightUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
