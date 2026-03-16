import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

type OnboardingScreenProps = {
  onComplete: () => void
}

const slides = [
  {
    title: 'Your Time = Money',
    description: 'Every minute you focus earns you $1. Watch your wealth grow in real-time as you work.',
    emoji: '💰',
  },
  {
    title: 'Distractions Cost You',
    description: 'Track wealth leaks when you get distracted. See exactly how much time-as-money you lose.',
    emoji: '⏱️',
  },
  {
    title: 'Build Your Streak',
    description: 'Stay consistent to unlock earning multipliers. Turn focus into a compounding habit.',
    emoji: '🔥',
  },
]

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8">
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="text-7xl">{slides[currentSlide].emoji}</div>
        <h1 className="text-4xl font-bold text-foreground">
          {slides[currentSlide].title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {slides[currentSlide].description}
        </p>
      </motion.div>

      <div className="mt-12 flex gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-primary w-8' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <Button
        onClick={handleNext}
        size="lg"
        className="mt-12 bg-accent hover:bg-accent/90 text-accent-foreground px-12"
      >
        {currentSlide < slides.length - 1 ? 'Next' : 'Get Started'}
      </Button>
    </div>
  )
}
