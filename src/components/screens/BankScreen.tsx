import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Task, Transaction, Streak, formatCurrency, formatDuration } from '@/lib/types'
import { Clock, Fire, TrendUp, TrendDown } from '@phosphor-icons/react'

type BankScreenProps = {
  tasks: Task[]
  transactions: Transaction[]
  balance: number
  streak: Streak
  kidMode: boolean
}

export function BankScreen({
  tasks,
  transactions,
  balance,
  streak,
  kidMode,
}: BankScreenProps) {
  const totalSessions = transactions.filter((t) => t.type === 'focus').length
  const totalMinutes = transactions
    .filter((t) => t.type === 'focus')
    .reduce((sum, t) => sum + t.duration, 0)
  
  const todayTransactions = transactions.filter((t) => {
    const today = new Date().toDateString()
    return new Date(t.timestamp).toDateString() === today
  })
  
  const todayEarned = todayTransactions
    .filter((t) => t.type === 'focus')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalLost = transactions
    .filter((t) => t.type === 'leak')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="text-sm text-muted-foreground uppercase tracking-wide">
          {kidMode ? '🏦 Treasure Vault' : 'FocusBank'}
        </div>
        <div className="font-mono text-6xl font-bold text-primary balance-glow">
          {formatCurrency(balance, kidMode)}
        </div>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m focused</span>
          </div>
          {streak.current > 0 && (
            <div className="flex items-center gap-2 text-destructive">
              <Fire size={16} weight="fill" />
              <span>{streak.current}-day streak</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSessions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              +{formatCurrency(todayEarned, kidMode)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Total Lost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              −{formatCurrency(totalLost, kidMode)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings by Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.filter((t) => t.sessionCount > 0).map((task) => {
            const maxEarned = Math.max(...tasks.map((t) => t.totalEarned))
            const percentage = maxEarned > 0 ? (task.totalEarned / maxEarned) * 100 : 0
            
            return (
              <div key={task.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{task.name}</span>
                  <span className="text-sm font-mono text-primary">
                    {formatCurrency(task.totalEarned, kidMode)}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {task.sessionCount} sessions
                </div>
              </div>
            )
          })}
          {tasks.filter((t) => t.sessionCount > 0).length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No completed sessions yet. Start focusing to build your wealth!
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {transactions.slice(0, 50).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-start justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'focus' ? 'bg-primary/10' : 'bg-destructive/10'
                    }`}>
                      {transaction.type === 'focus' ? (
                        <TrendUp size={20} className="text-primary" weight="bold" />
                      ) : (
                        <TrendDown size={20} className="text-destructive" weight="bold" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{transaction.taskName}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDuration(transaction.duration)} • {' '}
                        {new Date(transaction.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </div>
                      {transaction.note && (
                        <div className="text-xs text-muted-foreground mt-1 italic">
                          {transaction.note}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`font-mono font-bold ${
                    transaction.type === 'focus' ? 'text-primary' : 'text-destructive'
                  }`}>
                    {transaction.type === 'focus' ? '+' : '−'}
                    {formatCurrency(Math.abs(transaction.amount), kidMode)}
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No transactions yet. Complete a focus session to see your first entry!
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
