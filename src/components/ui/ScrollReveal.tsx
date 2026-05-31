import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
}

const variants = {
  up: { hidden: { y: 60, opacity: 0 }, visible: { y: 0, opacity: 1 } },
  down: { hidden: { y: -60, opacity: 0 }, visible: { y: 0, opacity: 1 } },
  left: { hidden: { x: -60, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  right: { hidden: { x: 60, opacity: 0 }, visible: { x: 0, opacity: 1 } },
}

export default function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.6,
}: ScrollRevealProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={variants[direction]}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
