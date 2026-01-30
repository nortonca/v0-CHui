# Gamification Guide

## Philosophy

Gamification in our app should **motivate without manipulating**. We celebrate progress, encourage healthy habits, and make work feel rewarding—without addiction patterns or dark UX.

---

## Current Gamification Elements

### 1. Task Completion Animations
**When:** User checks off a task  
**Effect:** Smooth checkmark animation with subtle scale bounce  
**Code location:** `/components/chat/task-panel.tsx`

```tsx
// Pseudocode
<Checkbox 
  onCheckedChange={() => {
    // Trigger completion animation
    playCheckAnimation()
    // Update state
    handleTaskToggle(id)
  }}
/>
```

**Animation specs:**
- Duration: 150ms
- Easing: cubic-bezier(0.34, 1.56, 0.64, 1) (bounce)
- Transform: scale(1) → scale(1.1) → scale(1)

---

### 2. Checkpoint Save Celebration
**When:** User creates a manual checkpoint or auto-checkpoint triggers  
**Effect:** Brief green glow on checkpoint icon  
**Code location:** `/components/chat/checkpoints-panel.tsx`

```tsx
const createCheckpoint = () => {
  // Save checkpoint
  saveToState(newCheckpoint)
  // Trigger success animation
  triggerSuccessPulse()
}
```

**Animation specs:**
- Duration: 300ms
- Effect: Box shadow pulse (green)
- Sound: Subtle "pop" (optional, future)

---

### 3. Quick Action Selection
**When:** User clicks a Quick Action chip  
**Effect:** Pill button pulses and inserts prompt  
**Code location:** `/components/chat/quick-actions.tsx`

**Animation specs:**
- Duration: 100ms
- Effect: Scale pulse + background color flash

---

## Planned Gamification Features

### 🎉 Confetti on Milestones

**Trigger events:**
- First task completed
- First playbook created
- 10th checkpoint saved
- Week streak of daily check-ins

**Implementation:**
```tsx
import confetti from 'canvas-confetti'

const celebrateFirstTask = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  })
}
```

**Library:** `canvas-confetti` (lightweight, 2.5kb)  
**Trigger logic:** Check localStorage for "firstTaskCompleted" flag

---

### 🔥 Streak Counter for Scheduled Tasks

**Concept:** Show a fire icon and streak count when user completes scheduled tasks consistently

**UI:**
- Small flame icon next to task count
- Tooltip: "5 day streak! 🔥"
- Animates when streak increases

**Data model:**
```typescript
interface StreakData {
  taskId: string
  currentStreak: number
  longestStreak: number
  lastCompletedDate: Date
}
```

**Implementation location:** `/components/chat/activity-modal-content.tsx`

---

### ⭐ Achievement Badges

**Concept:** Unlock badges for meaningful actions (not spam)

**Badge types:**
- "Organizer" - Created 5 playbooks
- "Time Traveler" - Used checkpoint restore 10 times
- "Memory Keeper" - Added 20+ memories
- "Quick Thinker" - Used Quick Actions 50 times
- "Collaborator" - Set collaboration mode to "Lead" for first time

**UI:** Small badge icon in header or profile area

**Storage:** localStorage or database (future)

---

### 📊 Progress Visualization

**Concept:** Show visual progress for long-running tasks or projects

**Use cases:**
- Playbook execution progress bar
- Sub-agent task completion percentage
- Daily check-in completion status

**UI inspiration:** Linear's progress indicators (minimal, clear)

---

### 🎊 Onboarding Completion Celebration

**When:** User completes the 4-step onboarding  
**Effect:** Confetti burst + "You're all set!" message

**Implementation:**
```tsx
const handleOnboardingComplete = (data) => {
  setOnboardingData(data)
  setShowOnboarding(false)
  
  // Celebrate!
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5 }
  })
  
  // Show success toast
  toast.success("Welcome aboard! Let's get started.")
}
```

---

## Micro-Interactions Catalog

### Hover States
Every interactive element should respond to hover:
- Buttons: Background color + border color change
- Cards: Subtle shadow lift
- Links: Underline or color shift
- Icons: Scale up slightly (1.05)

### Button Press
Active state feedback:
- Desktop: `active:scale-95` (press down)
- Mobile: `active:opacity-80` (no scale on touch)

### Toggle Switches
- Smooth slide animation (200ms)
- Background color transition
- Thumb moves from left → right

### Expanding Panels
- Height animation with `transition-all duration-300`
- Content fade-in after height animation
- Icon rotates (chevron down → up)

### Loading Spinners
- Smooth rotation at 1s duration
- Linear easing for continuous spin
- Color matches primary theme

---

## Animation Guidelines

### When to Animate
✅ **Good uses:**
- State changes (open/close, on/off)
- User feedback (success, error)
- Drawing attention (new notification)
- Guiding focus (highlight input)

❌ **Bad uses:**
- Decorative only
- Slows down interaction
- Unpredictable timing
- Too frequent (every hover)

### Animation Timing
- **Instant (0ms)** - Text changes, immediate feedback
- **Fast (100ms)** - Micro-interactions, button presses
- **Normal (200ms)** - Panel opens, modal appears
- **Slow (300ms)** - Page transitions, celebrations
- **Too slow (>500ms)** - Avoid except for special moments

### Easing Functions
- **ease-out** - Entering (fast start, slow end)
- **ease-in** - Exiting (slow start, fast end)
- **ease-in-out** - State changes (smooth both ends)
- **linear** - Continuous loops (spinners)
- **bounce** - Celebrations (cubic-bezier with overshoot)

---

## Sound Design (Future)

### Subtle Audio Feedback
- Task completion: Soft "ding" (100ms)
- Checkpoint save: Gentle "whoosh"
- Error: Subtle "bonk" (not harsh)
- Success: Light chime

**Requirements:**
- Optional (user preference)
- Low volume by default
- No sound on page load
- Respects system mute

**Library:** Howler.js or Web Audio API

---

## Celebration Effects Library

### Confetti
```typescript
// Full screen celebration
const fullConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { x: 0.5, y: 0.5 }
  })
}

// Side burst (from button position)
const sideConfetti = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  confetti({
    particleCount: 50,
    angle: 90,
    spread: 45,
    origin: { 
      x: rect.left / window.innerWidth,
      y: rect.top / window.innerHeight
    }
  })
}
```

### Pulse Effect
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

.celebrate-pulse {
  animation: pulse 300ms ease-in-out;
}
```

### Glow Effect
```css
@keyframes glow {
  0%, 100% { box-shadow: 0 0 0 rgba(var(--primary), 0); }
  50% { box-shadow: 0 0 20px rgba(var(--primary), 0.6); }
}

.celebrate-glow {
  animation: glow 500ms ease-in-out;
}
```

---

## Progress Tracking System

### Data Model
```typescript
interface UserProgress {
  userId: string
  stats: {
    tasksCompleted: number
    checkpointsSaved: number
    playbooksCreated: number
    memoriesAdded: number
    quickActionsUsed: number
  }
  streaks: {
    dailyCheckins: number
    lastCheckinDate: Date
  }
  achievements: Achievement[]
  firstTimeFlags: {
    firstTaskCompleted: boolean
    firstPlaybookCreated: boolean
    firstCheckpointRestored: boolean
  }
}

interface Achievement {
  id: string
  name: string
  description: string
  unlockedAt: Date
  icon: string
}
```

### Storage Strategy
- **localStorage** for MVP (client-side only)
- **Database** for production (persistent across devices)
- **Sync on login** if user account exists

---

## Motivational Patterns

### Encouraging Empty States
Instead of blank screens, show:
- Friendly illustration or icon
- Clear call-to-action ("Add your first task")
- Benefits statement ("Stay organized and on track")
- Example/template to get started

### Positive Reinforcement
- "Great work!" on task completion
- "You're on a roll!" after 3 quick completions
- "Nice streak!" on scheduled task consistency

### Non-Intrusive Suggestions
- "You haven't saved a checkpoint yet. Want to create one?"
- "Quick Actions can speed up your workflow. Try one!"
- Appear as subtle hints, not pop-ups

---

## Implementation Priority

### Phase 1: Core Feedback (Completed ✅)
- Task completion checkmark animation
- Checkpoint save success indicator
- Quick Action selection pulse

### Phase 2: Celebrations (Next)
- [ ] Confetti on first task completion
- [ ] Onboarding completion celebration
- [ ] Playbook creation success toast

### Phase 3: Progress Tracking
- [ ] Streak counter for scheduled tasks
- [ ] Achievement badge system
- [ ] Progress visualization for long tasks

### Phase 4: Advanced
- [ ] Sound effects (optional)
- [ ] Custom celebration preferences
- [ ] Daily/weekly summary with stats

---

## Testing Checklist

Before shipping gamification features:
- [ ] Works in light and dark mode
- [ ] Respects `prefers-reduced-motion`
- [ ] Doesn't block or slow down primary actions
- [ ] Can be dismissed/skipped if needed
- [ ] Doesn't trigger repeatedly (one-time flags work)
- [ ] Performance tested (no frame drops)
- [ ] Accessible (screen reader compatible)
