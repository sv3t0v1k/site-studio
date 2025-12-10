'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function MagicCursor() {
  const cursorRef = useMotionValue({ x: 0, y: 0 })
  const ballRef = useMotionValue({ x: 0, y: 0 })

  const cursorX = useSpring(cursorRef.x, { stiffness: 300, damping: 30 })
  const cursorY = useSpring(cursorRef.y, { stiffness: 300, damping: 30 })

  const ballX = useSpring(ballRef.x, { stiffness: 200, damping: 25 })
  const ballY = useSpring(ballRef.y, { stiffness: 200, damping: 25 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.set({ x: e.clientX, y: e.clientY })
      ballRef.set({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => {
      document.body.style.cursor = 'none'
    }

    const handleMouseLeave = () => {
      document.body.style.cursor = 'auto'
    }

    // Hide cursor on interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.matches('a, button, input, textarea, [role="button"]')) {
        document.body.style.cursor = 'none'
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseover', handleElementHover)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseover', handleElementHover)
      document.body.style.cursor = 'auto'
    }
  }, [cursorRef, ballRef])

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 bg-primary rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Ball cursor */}
      <motion.div
        id="ball"
        className="fixed top-0 left-0 w-20 h-20 border-2 border-primary rounded-full pointer-events-none z-40"
        style={{
          x: ballX,
          y: ballY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  )
}
