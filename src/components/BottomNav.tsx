import { Timer, Vault } from '@phosphor-icons/react'

type BottomNavProps = {
  currentScreen: 'focus' | 'bank'
  onNavigate: (screen: 'focus' | 'bank') => void
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card/80 backdrop-blur-lg border-t border-border flex items-center justify-around px-8">
      <button
        onClick={() => onNavigate('focus')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          currentScreen === 'focus' ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        <Timer size={28} weight={currentScreen === 'focus' ? 'fill' : 'regular'} />
        <span className="text-xs font-medium uppercase tracking-wide">Focus</span>
      </button>
      
      <button
        onClick={() => onNavigate('bank')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          currentScreen === 'bank' ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        <Vault size={28} weight={currentScreen === 'bank' ? 'fill' : 'regular'} />
        <span className="text-xs font-medium uppercase tracking-wide">Bank</span>
      </button>
    </nav>
  )
}
