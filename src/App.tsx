import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'
import { FocusScreen } from '@/components/screens/FocusScreen'
import { BankScreen } from '@/components/screens/BankScreen'
import { OnboardingScreen } from '@/components/screens/OnboardingScreen'
import { BottomNav } from '@/components/BottomNav'
import { Task, Transaction, Streak, DEFAULT_TASKS } from '@/lib/types'

function App() {
  const [tasks, setTasks] = useKV<Task[]>('focusbank-tasks', DEFAULT_TASKS)
  const [transactions, setTransactions] = useKV<Transaction[]>('focusbank-transactions', [])
  const [balance, setBalance] = useKV<number>('focusbank-balance', 0)
  const [streak, setStreak] = useKV<Streak>('focusbank-streak', {
    current: 0,
    lastSessionDate: null,
    multiplier: 1,
  })
  const [kidMode, setKidMode] = useKV<boolean>('focusbank-kidmode', false)
  const [hasOnboarded, setHasOnboarded] = useKV<boolean>('focusbank-onboarded', false)
  
  const [currentScreen, setCurrentScreen] = useState<'focus' | 'bank'>('focus')

  useEffect(() => {
    if (kidMode) {
      document.documentElement.classList.add('kid-mode')
    } else {
      document.documentElement.classList.remove('kid-mode')
    }
  }, [kidMode])

  if (!hasOnboarded) {
    return <OnboardingScreen onComplete={() => setHasOnboarded(true)} />
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {currentScreen === 'focus' && (
        <FocusScreen
          tasks={tasks || DEFAULT_TASKS}
          setTasks={setTasks}
          transactions={transactions || []}
          setTransactions={setTransactions}
          balance={balance || 0}
          setBalance={setBalance}
          streak={streak || { current: 0, lastSessionDate: null, multiplier: 1 }}
          setStreak={setStreak}
          kidMode={kidMode || false}
          setKidMode={setKidMode}
        />
      )}
      {currentScreen === 'bank' && (
        <BankScreen
          tasks={tasks || DEFAULT_TASKS}
          transactions={transactions || []}
          balance={balance || 0}
          streak={streak || { current: 0, lastSessionDate: null, multiplier: 1 }}
          kidMode={kidMode || false}
        />
      )}
      
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
      />
      
      <Toaster />
    </div>
  )
}

export default App
