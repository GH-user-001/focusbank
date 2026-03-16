# FocusBank PRD

A Pomodoro-style focus timer that gamifies productivity by turning attention into virtual wealth, leveraging loss aversion and financial metaphors to build sustainable focus habits.

**Experience Qualities**:
1. **Visceral** - Every second of focus and distraction should feel financially consequential through live counters, animations, and real-time wealth changes
2. **Empowering** - Users feel ownership over their time-as-currency, building a tangible net worth from intangible focus sessions
3. **Reflective** - Post-session insights and distraction patterns create awareness without shame, framing losses as learning opportunities

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused timer app with persistent wealth tracking, task management, and analytics. It has clear feature boundaries (timer, bank, tasks, distractions) with state that persists between sessions but doesn't require complex multi-user systems or external integrations.

## Essential Features

### 1. Focus Timer Session
- **Functionality**: Countdown timer (5-120 min) that increments virtual earnings ($1/min) in real-time
- **Purpose**: Core mechanic that makes focus time feel valuable and creates immediate positive feedback
- **Trigger**: User selects task + duration, taps "START SESSION"
- **Progression**: Ready screen → Select task chip → Adjust duration slider → Start → Full-screen circular timer counts down → Live +$1 every 60s with particle flash → Completion animation → +$X added to bank → Auto-start 5min break
- **Success criteria**: Timer counts accurately, earnings increment smoothly, balance persists, completion triggers celebration

### 2. Wealth Leak / Distraction Tracking
- **Functionality**: Count-up timer that deducts money (–$1/min) for logged distractions with categorization
- **Purpose**: Creates loss aversion to strengthen focus habits, builds pattern awareness
- **Trigger**: User taps "Wealth Leak" button during session or from home screen
- **Progression**: Home/Focus screen → Tap leak button → Red-themed count-up timer starts → Select distraction category → Timer runs, –$1/min drains → Stop leak → "Lesson Learned" modal shows cost + pattern insights → Transaction saved
- **Success criteria**: Deductions persist, category patterns surface in analytics, reflection prompts feel constructive not punitive

### 3. Task Management
- **Functionality**: Create, select, and track earnings by task category (Work, Study, custom tags)
- **Purpose**: Contextualizes wealth accumulation and enables task-specific analytics
- **Trigger**: User taps task chip to select or "+" to create new
- **Progression**: Ready screen → Tap task chip (selects for next session) OR long-press chip (delete modal) OR tap + button → Enter custom task name → Chip added to list → Selection persists
- **Success criteria**: Tasks persist, selected task appears in active session, earnings breakdown by task visible in Bank

### 4. Bank Dashboard & Analytics
- **Functionality**: Display total net worth, session history, task/distraction breakdowns, streaks
- **Purpose**: Visualizes progress and patterns, reinforces compounding wealth metaphor
- **Trigger**: User taps "Bank" in bottom nav
- **Progression**: Bank tab → Big balance display → Stats cards (sessions, minutes, today's earnings) → Task breakdown (green bars) → Leaks tab (red pie chart) → Transaction history list → Streak display with multiplier
- **Success criteria**: All data accurate, charts render correctly, history scrollable, CSV export works

### 5. Focus Streaks & Multipliers
- **Functionality**: Track consecutive days with ≥1 focus session, apply earning bonuses (3d: +10%, 7d: +25%, 10d+: +50%)
- **Purpose**: Rewards consistency with compounding returns, mirrors real wealth-building
- **Trigger**: Automatic on daily session completion
- **Progression**: User completes session → System checks last session date → If consecutive days, increment streak → Display "+X% streak bonus!" → Apply multiplier to next session earnings → Long leak (>10min) breaks streak with warning modal
- **Success criteria**: Streak persists across days, multiplier calculates correctly, break conditions work

### 6. Kid Mode
- **Functionality**: Toggle UI theme from dark/green/money to warm/orange/stars for child users
- **Purpose**: Makes app family-friendly and accessible to younger users without financial literacy
- **Trigger**: User taps Kid Mode toggle in settings or ready screen
- **Progression**: Toggle switch → Theme instantly switches ($ → ★, green #00FF94 → orange #FF9500, bank → treasure chest icon, distraction penalties show sad emoji) → Preference persists
- **Success criteria**: All UI elements respect mode, no $ shown in Kid Mode, toggle persists

## Edge Case Handling

- **App backgrounded mid-session**: Timer pauses, resume prompt on return with elapsed time preserved
- **Zero/negative balance**: Balance can't go below $0; leaks cap at current balance with "bankrupt" modal and auto-reset
- **Duplicate task names**: Allow duplicates but show "(2)" suffix for clarity
- **Session interruption**: Pause button saves progress; reset confirms with "lose progress?" dialog
- **Very long sessions**: Cap duration slider at 120 min; earnings continue but suggest break after 90 min
- **Streak broken**: Show encouraging "Start fresh!" message, explain what broke it (long leak or missed day)
- **Empty task list**: Show default tasks (Work, Study, Personal) that can't all be deleted
- **First-time user**: 3-screen onboarding swipe explaining metaphor, then seed $0 balance

## Design Direction

FocusBank should feel like a premium personal finance app fused with a meditation timer — serious about time, playful with metaphor. Dark, focused interface that highlights neon green wealth accumulation. Animations should feel satisfying but never distracting. Loss (leaks) should be visually clear but not punitive. Kid Mode shifts to warm, encouraging rocket/space theme.

## Color Selection

**Primary Color**: Deep black #050505 (oklch(0.05 0 0)) — Communicates focus, eliminates visual noise, premium feel like banking apps
**Secondary Colors**:
  - Neon green #00FF94 (oklch(0.88 0.18 163)) for earnings, active timers, success states
  - Blood red #FF3B30 (oklch(0.62 0.22 27)) for leaks, deductions, warning states  
  - Slate gray #1C1C1E (oklch(0.15 0 0)) for cards and surfaces
**Accent Color**: Electric cyan #00D9FF (oklch(0.82 0.14 203)) for buttons, focus rings, interactive elements — grabs attention for CTAs
**Foreground/Background Pairings**:
  - Background #050505 → White text #FFFFFF (oklch(1 0 0)) - Ratio 20.6:1 ✓
  - Neon Green #00FF94 → Black text #050505 - Ratio 14.2:1 ✓
  - Slate cards #1C1C1E → White text #FFFFFF - Ratio 16.8:1 ✓
  - Accent Cyan #00D9FF → Black text #050505 - Ratio 13.1:1 ✓

**Kid Mode Palette**:
  - Primary: Warm orange #FF9500 (oklch(0.75 0.16 55))
  - Background: Deep navy #0A1628 (oklch(0.12 0.03 240))
  - Accents: Yellow stars #FFD60A (oklch(0.88 0.16 85))

## Font Selection

Typography should balance financial seriousness with modern approachability — monospace for numbers (reinforces precision/currency), geometric sans for UI (clean, readable).

- **Typographic Hierarchy**:
  - H1 (Net Worth Display): JetBrains Mono Bold / 48px / tight letter-spacing (-0.02em) / tabular numerals
  - H2 (Timer Display): JetBrains Mono Medium / 64px / tracking tight / slashed zero
  - H3 (Section Headers): Space Grotesk SemiBold / 24px / normal tracking
  - Body (Task Names, Stats): Space Grotesk Regular / 16px / line-height 1.5
  - Small (Timestamps, Labels): Space Grotesk Medium / 14px / uppercase / tracking wide (+0.05em)
  - Button Text: Space Grotesk SemiBold / 16px / tracking slight (+0.01em)

## Animations

Animations should celebrate earning and viscerally represent loss, making time feel like liquid wealth flowing in/out.

- **Earnings tick**: Fade-in +$1 with upward particle float (200ms ease-out) every 60s during focus
- **Balance increment**: Number counter animates digits rolling up (300ms) with subtle green glow pulse
- **Session complete**: Circular progress explodes into confetti particles (500ms), balance scales up briefly (spring physics)
- **Wealth leak start**: Timer circle bleeds red from edges inward (400ms), balance display shakes slightly
- **Leak deduction**: –$1 drips down with red particle trail (250ms), counter decrements with micro shake
- **Streak bonus unlock**: Gold sparkle burst from streak badge (600ms), "+X% BONUS" banner slides down
- **Page transitions**: Smooth 300ms slide with slight fade, maintaining spatial continuity
- **Task chip selection**: Scale up 105% + green border glow (150ms cubic-bezier)

## Component Selection

**Components**:
- **Timer Display**: Custom SVG circular progress ring (not Shadcn) with animated stroke-dashoffset for countdown
- **Task Chips**: Badge component with hover/active states, long-press gesture for delete
- **Duration Slider**: Shadcn Slider with custom $ price labels at intervals
- **Start Button**: Shadcn Button (default variant) with custom neon green bg and scale animation
- **Bank Cards**: Shadcn Card for stat displays and task breakdowns
- **Transaction List**: Shadcn ScrollArea wrapping custom list items with timestamps
- **Distraction Categories**: Shadcn Select or RadioGroup for quick category selection
- **Leak Modal**: Shadcn Dialog with red theme override for "Lesson Learned" reflection
- **Charts**: recharts for pie (leak breakdown) and bar charts (focus vs leak weekly)
- **Bottom Nav**: Custom fixed nav with Phosphor icons (Timer, Bank)
- **Toast Notifications**: Sonner for session complete, streak unlock, balance warnings

**Customizations**:
- Circular timer is fully custom React component with SVG + canvas
- Live earnings counter uses react spring or framer-motion for smooth number transitions
- Particle effects for +$1 ticks use framer-motion's motion.div with staggered animations
- Kid Mode applies CSS class that overrides all color variables globally

**States**:
- Buttons: default (cyan glow), hover (scale 102% + brighter glow), active (scale 98%), disabled (50% opacity)
- Inputs: default (slate border), focus (cyan ring + border), error (red border + shake), filled (green check icon)
- Task chips: unselected (slate bg), selected (green border + bg tint), hover (slight scale), long-press (scale down + delete icon appears)
- Timer: idle (gray), active focus (green pulsing ring), active leak (red pulsing ring), paused (yellow border), complete (gold burst)

**Icon Selection**:
- Timer/Focus: Timer (Phosphor)
- Bank/Wealth: Vault (Phosphor)
- Start Session: Play (Phosphor)
- Pause: Pause (Phosphor)
- Reset: ArrowCounterClockwise (Phosphor)
- Wealth Leak: Drop (Phosphor) or Leak (Phosphor)
- Add Task: Plus (Phosphor)
- Delete Task: Trash (Phosphor)
- Streak: Fire (Phosphor)
- Export: Export (Phosphor)
- Kid Mode: Rocket (Phosphor)
- Distraction Categories: varying by type (DeviceMobile, TelevisionSimple, GameController, etc.)

**Spacing**:
- Screen padding: px-6 py-8 (24px/32px)
- Card padding: p-6
- Component gaps: gap-4 for most lists, gap-2 for tight groups
- Timer to stats: gap-8 (generous breathing room)
- Bottom nav height: h-20 with safe-area-inset-bottom

**Mobile**:
- Single column layouts throughout (already mobile-first)
- Bottom nav fixed with backdrop blur
- Timer scales to fit viewport (max-w-sm)
- Charts switch to vertical stack on narrow screens
- Task chips wrap with flex-wrap
- History list items stack details vertically on mobile
- Duration slider uses larger touch targets (h-12)
