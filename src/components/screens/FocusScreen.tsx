import { useState, useEffect, useCallback } from 'react'
import { CircularTimer } from '@/components/CircularTimer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Play, Pause, ArrowCounterClockwise, Drop, Plus, Trash, Fire, Rocket } from '@phosphor-icons/react'
import { Task, Transaction, Streak, formatCurrency, formatDuration, getStreakMultiplier, LEAK_CATEGORIES } from '@/lib/types'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

type SessionState = 'idle' | 'focusing' | 'leak' | 'break'

type FocusScreenProps = {
  tasks: Task[]
  setTasks: (newValue: Task[] | ((oldValue?: Task[]) => Task[])) => void
  transactions: Transaction[]
  setTransactions: (newValue: Transaction[] | ((oldValue?: Transaction[]) => Transaction[])) => void
  balance: number
  setBalance: (newValue: number | ((oldValue?: number) => number)) => void
  streak: Streak
  setStreak: (newValue: Streak | ((oldValue?: Streak) => Streak)) => void
  kidMode: boolean
  setKidMode: (kidMode: boolean) => void
}

export function FocusScreen({
  tasks,
  setTasks,
  transactions,
  setTransactions,
  balance,
  setBalance,
  streak,
  setStreak,
  kidMode,
  setKidMode,
}: FocusScreenProps) {
  const [sessionState, setSessionState] = useState<SessionState>('idle')
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '')
  const [duration, setDuration] = useState(25)
  const [timeRemaining, setTimeRemaining] = useState(duration * 60)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [earnings, setEarnings] = useState(0)
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTaskName, setNewTaskName] = useState('')
  const [showLeakDialog, setShowLeakDialog] = useState(false)
  const [leakCategory, setLeakCategory] = useState(LEAK_CATEGORIES[0].id)
  const [leakNote, setLeakNote] = useState('')
  const [showLessonLearned, setShowLessonLearned] = useState(false)
  const [lastLeakCost, setLastLeakCost] = useState(0)

  useEffect(() => {
    if (sessionState === 'idle' || sessionState === 'break') {
      setTimeRemaining(duration * 60)
    }
  }, [duration, sessionState])

  useEffect(() => {
    let interval: number | undefined

    if (sessionState === 'focusing' || sessionState === 'leak') {
      interval = window.setInterval(() => {
        if (sessionState === 'focusing') {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              handleSessionComplete()
              return 0
            }
            return prev - 1
          })
          setElapsedTime((prev) => prev + 1)
          
          if ((elapsedTime + 1) % 60 === 0) {
            const earnedAmount = 1 * streak.multiplier
            setEarnings((prev) => prev + earnedAmount)
          }
        } else if (sessionState === 'leak') {
          setElapsedTime((prev) => prev + 1)
          
          if ((elapsedTime + 1) % 60 === 0) {
            setEarnings((prev) => prev - 1)
          }
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [sessionState, elapsedTime, streak.multiplier])

  const handleSessionComplete = useCallback(() => {
    const finalEarnings = Math.floor(elapsedTime / 60) * streak.multiplier
    
    setBalance((current) => Math.max(0, (current || 0) + finalEarnings))
    
    const task = tasks.find((t) => t.id === selectedTaskId)
    if (task) {
      setTasks((currentTasks) =>
        (currentTasks || []).map((t) =>
          t.id === selectedTaskId
            ? { ...t, totalEarned: t.totalEarned + finalEarnings, sessionCount: t.sessionCount + 1 }
            : t
        )
      )
    }
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'focus',
      amount: finalEarnings,
      taskId: selectedTaskId,
      taskName: task?.name || 'Unknown',
      duration: elapsedTime,
      timestamp: Date.now(),
    }
    
    setTransactions((current) => [transaction, ...(current || [])])
    
    const today = new Date().toDateString()
    const isConsecutive = streak.lastSessionDate === new Date(Date.now() - 86400000).toDateString()
    const isToday = streak.lastSessionDate === today
    
    if (!isToday) {
      const newStreak = isConsecutive ? streak.current + 1 : 1
      const newMultiplier = getStreakMultiplier(newStreak)
      
      setStreak(() => ({
        current: newStreak,
        lastSessionDate: today,
        multiplier: newMultiplier,
      }))
      
      if (newStreak >= 3) {
        toast.success(`🔥 ${newStreak}-day streak! +${Math.round((newMultiplier - 1) * 100)}% bonus`)
      }
    }
    
    toast.success(`Session complete! +${formatCurrency(finalEarnings, kidMode)}`)
    
    setSessionState('idle')
    setEarnings(0)
    setElapsedTime(0)
  }, [elapsedTime, streak, selectedTaskId, tasks, setTasks, setTransactions, setBalance, setStreak, kidMode])

  const startSession = () => {
    setSessionState('focusing')
    setTimeRemaining(duration * 60)
    setElapsedTime(0)
    setEarnings(0)
  }

  const pauseSession = () => {
    setSessionState('idle')
  }

  const resetSession = () => {
    setSessionState('idle')
    setTimeRemaining(duration * 60)
    setElapsedTime(0)
    setEarnings(0)
  }

  const startLeak = () => {
    setSessionState('leak')
    setElapsedTime(0)
    setEarnings(0)
    setShowLeakDialog(false)
  }

  const stopLeak = () => {
    const leakCost = Math.floor(elapsedTime / 60)
    const actualCost = Math.min(leakCost, balance)
    
    setBalance((current) => Math.max(0, (current || 0) - actualCost))
    
    const category = LEAK_CATEGORIES.find((c) => c.id === leakCategory)
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'leak',
      amount: -actualCost,
      taskName: category?.name || 'Distraction',
      duration: elapsedTime,
      timestamp: Date.now(),
      category: leakCategory,
      note: leakNote,
    }
    
    setTransactions((current) => [transaction, ...(current || [])])
    
    if (elapsedTime > 600) {
      setStreak(() => ({
        current: 0,
        lastSessionDate: null,
        multiplier: 1,
      }))
      toast.error('Streak broken! Long leak detected.')
    }
    
    setLastLeakCost(actualCost)
    setShowLessonLearned(true)
    setSessionState('idle')
    setElapsedTime(0)
    setEarnings(0)
    setLeakNote('')
  }

  const addTask = () => {
    if (newTaskName.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        name: newTaskName.trim(),
        totalEarned: 0,
        sessionCount: 0,
      }
      setTasks((current) => [...(current || []), newTask])
      setNewTaskName('')
      setShowAddTask(false)
      toast.success(`Task "${newTask.name}" added`)
    }
  }

  const deleteTask = (taskId: string) => {
    if (tasks.length <= 1) {
      toast.error('Cannot delete last task')
      return
    }
    
    setTasks((current) => (current || []).filter((t) => t.id !== taskId))
    
    if (selectedTaskId === taskId) {
      setSelectedTaskId(tasks.find((t) => t.id !== taskId)?.id || tasks[0].id)
    }
    
    toast.success('Task deleted')
  }

  const selectedTask = tasks.find((t) => t.id === selectedTaskId)

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {kidMode ? <Rocket size={32} className="text-primary" weight="fill" /> : null}
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Net Worth</div>
            <div className="font-mono text-2xl font-bold text-primary balance-glow">
              {formatCurrency(balance, kidMode)}
            </div>
          </div>
        </div>
        
        {streak.current > 0 && (
          <Badge className="flex items-center gap-2 px-3 py-2 bg-destructive/20 text-destructive border-destructive/30">
            <Fire size={16} weight="fill" />
            <span className="font-bold">{streak.current} days</span>
          </Badge>
        )}
      </div>

      {sessionState === 'idle' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground uppercase tracking-wide">Task</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddTask(true)}
              className="gap-2"
            >
              <Plus size={16} />
              Add Task
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tasks.map((task) => (
              <div key={task.id} className="relative group">
                <Badge
                  variant={selectedTaskId === task.id ? 'default' : 'outline'}
                  className="px-4 py-2 cursor-pointer transition-all hover:scale-105"
                  onClick={() => setSelectedTaskId(task.id)}
                >
                  {task.name}
                </Badge>
                {tasks.length > 1 && (
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <Trash size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground uppercase tracking-wide">
              Duration: {duration}m · {formatCurrency(duration * streak.multiplier, kidMode)}
            </Label>
            <Slider
              value={[duration]}
              onValueChange={(value) => setDuration(value[0])}
              min={5}
              max={120}
              step={5}
              className="w-full"
            />
          </div>

          <Button
            onClick={startSession}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
          >
            <Play size={24} weight="fill" className="mr-2" />
            START SESSION
          </Button>

          <Button
            onClick={() => setShowLeakDialog(true)}
            variant="destructive"
            size="lg"
            className="w-full gap-2"
          >
            <Drop size={20} weight="fill" />
            Track Wealth Leak
          </Button>

          <div className="flex items-center justify-between pt-4">
            <Label htmlFor="kid-mode" className="text-sm">
              {kidMode ? '🚀 Kid Mode' : 'Kid Mode'}
            </Label>
            <Switch
              id="kid-mode"
              checked={kidMode}
              onCheckedChange={setKidMode}
            />
          </div>
        </div>
      )}

      {(sessionState === 'focusing' || sessionState === 'leak') && (
        <div className="space-y-8">
          <div className="text-center">
            <div className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
              {sessionState === 'leak' ? 'Wealth Leak' : selectedTask?.name || 'Focus'}
            </div>
            <CircularTimer
              timeRemaining={timeRemaining}
              totalTime={duration * 60}
              isActive={true}
              mode={sessionState === 'leak' ? 'leak' : 'focus'}
              earnings={sessionState === 'leak' ? earnings : earnings}
              kidMode={kidMode}
            />
          </div>

          <AnimatePresence>
            {Math.floor(elapsedTime) % 60 === 0 && elapsedTime > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="text-center"
              >
                <div className={`font-mono text-2xl font-bold ${sessionState === 'leak' ? 'text-destructive' : 'text-primary'}`}>
                  {sessionState === 'leak' ? '−' : '+'}{formatCurrency(1, kidMode)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3">
            {sessionState === 'focusing' && (
              <>
                <Button
                  onClick={pauseSession}
                  variant="outline"
                  size="lg"
                  className="flex-1 gap-2"
                >
                  <Pause size={20} />
                  Pause
                </Button>
                <Button
                  onClick={resetSession}
                  variant="outline"
                  size="lg"
                  className="flex-1 gap-2"
                >
                  <ArrowCounterClockwise size={20} />
                  Reset
                </Button>
              </>
            )}
            {sessionState === 'leak' && (
              <Button
                onClick={stopLeak}
                variant="destructive"
                size="lg"
                className="w-full gap-2"
              >
                Stop Leak
              </Button>
            )}
          </div>
        </div>
      )}

      <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Task name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <Button onClick={addTask} className="w-full">
              Add Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showLeakDialog} onOpenChange={setShowLeakDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Track Wealth Leak</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Category</Label>
              <div className="grid grid-cols-2 gap-2">
                {LEAK_CATEGORIES.slice(0, 8).map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={leakCategory === cat.id ? 'default' : 'outline'}
                    className="px-3 py-2 cursor-pointer justify-center"
                    onClick={() => setLeakCategory(cat.id)}
                  >
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </div>
            <Button onClick={startLeak} variant="destructive" className="w-full">
              Start Tracking
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showLessonLearned} onOpenChange={setShowLessonLearned}>
        <DialogContent className="border-destructive">
          <DialogHeader>
            <DialogTitle className="text-destructive">Lesson Learned</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-lg">
              You lost <span className="font-mono font-bold">{formatCurrency(lastLeakCost, kidMode)}</span> today.
              That's {lastLeakCost} {kidMode ? 'stars' : 'minutes'} of future wealth gone.
            </p>
            <Textarea
              placeholder="What triggered this distraction? (optional)"
              value={leakNote}
              onChange={(e) => setLeakNote(e.target.value)}
            />
            <Button
              onClick={() => {
                setShowLessonLearned(false)
                setLeakNote('')
              }}
              className="w-full"
            >
              Got It
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
