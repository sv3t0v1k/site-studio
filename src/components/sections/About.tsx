'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function About() {
  const [stats, setStats] = useState({
    experience: 8,
    projects: 100,
    satisfaction: 90,
  })

  useEffect(() => {
    // Animate counters
    const animateCounter = (element: HTMLElement, target: number, suffix: string = '') => {
      let current = 0
      const increment = target / 100
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        element.textContent = Math.floor(current) + suffix
      }, 30)
    }

    // Trigger animations when section comes into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('.counter')
          counters.forEach((counter, index) => {
            const targets = [stats.experience, stats.projects, stats.satisfaction]
            const suffixes = ['', '+', '%']
            animateCounter(counter as HTMLElement, targets[index], suffixes[index])
          })
          observer.unobserve(entry.target)
        }
      })
    })

    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      observer.observe(aboutSection)
    }

    return () => observer.disconnect()
  }, [stats])

  return (
    <section id="about" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Me
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              <Image
                src="/images/about/me2.jpg"
                alt="Enna Noir"
                width={500}
                height={600}
                className="rounded-lg w-full h-auto"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h3 className="text-3xl font-bold text-white mb-6">
              I'm Noir Enna, a seasoned UX Designer
            </h3>

            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              I'm Noir Enna, a seasoned UX designer with over 8 years of experience in crafting
              intuitive and engaging digital experiences. My journey began with a background in
              graphic design, where I discovered my passion for understanding user behavior and
              translating it into seamless interactions.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  <span className="counter">0</span>
                </div>
                <p className="text-gray-400 text-sm">Years Of Experience</p>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  <span className="counter">0</span>
                  <span className="text-primary">+</span>
                </div>
                <p className="text-gray-400 text-sm">Complete Projects</p>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  <span className="counter">0</span>
                  <span className="text-primary">%</span>
                </div>
                <p className="text-gray-400 text-sm">Client Satisfactions</p>
              </div>
            </div>

            {/* Skills/Expertise */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-white mb-4">Expertise</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-300">User Research</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-300">UI/UX Design</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-300">Prototyping</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-300">Design Systems</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-300">Brand Identity</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-gray-300">Art Direction</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
