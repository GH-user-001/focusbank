export type Task = {
  id: string
  name: string
  totalEarned: number
  sessionCount: number
}

export type TransactionType = 'focus' | 'leak'

export type Transaction = {
  id: string
  type: TransactionType
  amount: number
  taskId?: string
  taskName: string
  duration: number
  timestamp: number
  note?: string
  category?: string
}

export type LeakCategory = {
  id: string
  name: string
  icon: string
  totalCost: number
  count: number
}

export type Streak = {
  current: number
  lastSessionDate: string | null
  multiplier: number
}

export const DEFAULT_TASKS: Task[] = [
  { id: 'work', name: 'Work', totalEarned: 0, sessionCount: 0 },
  { id: 'study', name: 'Study', totalEarned: 0, sessionCount: 0 },
  { id: 'personal', name: 'Personal', totalEarned: 0, sessionCount: 0 },
]

export const LEAK_CATEGORIES = [
  { id: 'streaming', name: 'Netflix / YouTube', icon: 'TelevisionSimple' },
  { id: 'social', name: 'Social Media Scroll', icon: 'DeviceMobile' },
  { id: 'notifications', name: 'Phone Notifications', icon: 'BellRinging' },
  { id: 'snack', name: 'Snack Break', icon: 'Coffee' },
  { id: 'interruption', name: 'Interruption', icon: 'Users' },
  { id: 'browsing', name: 'Mindless Browsing', icon: 'Globe' },
  { id: 'gaming', name: 'Gaming', icon: 'GameController' },
  { id: 'custom', name: 'Other', icon: 'Question' },
]

export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 10) return 1.5
  if (streakDays >= 7) return 1.25
  if (streakDays >= 3) return 1.1
  return 1.0
}

export function formatCurrency(amount: number, kidMode: boolean): string {
  if (kidMode) {
    return `${Math.floor(amount)}★`
  }
  return `$${Math.floor(amount)}`
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
