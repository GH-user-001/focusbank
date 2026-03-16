import { motion } from 'framer-motion'
import { formatDuration, formatCurrency } from '@/lib/types'

type CircularTimerProps = {
  timeRemaining: number
  totalTime: number
  isActive: boolean
  mode: 'focus' | 'leak' | 'idle'
  earnings: number
  kidMode: boolean
}

export function CircularTimer({
  timeRemaining,
  totalTime,
  isActive,
  mode,
  earnings,
  kidMode,
}: CircularTimerProps) {
  const radius = 140
  const circumference = 2 * Math.PI * radius
  const progress = totalTime > 0 ? 1 - timeRemaining / totalTime : 0
  const strokeDashoffset = circumference * (1 - progress)

  const getColor = () => {
    if (mode === 'leak') return 'oklch(0.62 0.22 27)'
    if (mode === 'focus') return 'oklch(0.88 0.18 163)'
    return 'oklch(0.35 0 0)'
  }

  const getGlowClass = () => {
    if (!isActive) return ''
    if (mode === 'leak') return 'timer-glow-red'
    if (mode === 'focus') return 'timer-glow-green'
    return ''
  }

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width="320"
        height="320"
        className={getGlowClass()}
      >
        <circle
          cx="160"
          cy="160"
          r={radius}
          stroke="oklch(0.25 0 0)"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx="160"
          cy="160"
          r={radius}
          stroke={getColor()}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 160 160)"
          initial={false}
          animate={{
            strokeDashoffset,
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-mono text-6xl font-medium tracking-tight text-foreground">
          {formatDuration(timeRemaining)}
        </div>
        <div className={`font-mono text-2xl font-bold mt-2 ${
          mode === 'leak' ? 'text-destructive' : 'text-primary'
        }`}>
          {mode === 'leak' ? '−' : '+'}{formatCurrency(earnings, kidMode)}
        </div>
      </div>
    </div>
  )
}
