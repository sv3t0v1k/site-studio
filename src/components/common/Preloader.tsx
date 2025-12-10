'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Simulate loading time

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          <div className="text-center">
            {/* Animated SVG */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <svg
                viewBox="0 0 1000 1000"
                preserveAspectRatio="none"
                className="w-32 h-32 mx-auto"
              >
                <motion.path
                  id="preloaderSvg"
                  d="M0,1005S175,995,500,995s500,5,500,5V0H0Z"
                  fill="none"
                  stroke="#ee4818"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>

            {/* Loading text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-2xl font-bold text-white"
            >
              <div className="flex justify-center space-x-1">
                {['L', 'o', 'a', 'd', 'i', 'n', 'g'].map((letter, index) => (
                  <motion.span
                    key={letter}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.7 + index * 0.1,
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200
                    }}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="mt-8 mx-auto w-48 h-1 bg-gray-800 rounded-full overflow-hidden"
            >
              <div className="h-full bg-primary rounded-full"></div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
