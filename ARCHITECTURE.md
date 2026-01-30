# Technical Architecture

## Overview

This document describes the technical architecture of the Co-Working Assistant chat interface, focusing on state management, component structure, and interaction patterns.

---

## Core Philosophy

### Panel-Based Architecture
All advanced features are implemented as **expandable panels** that emerge from the input area. This creates a unified interaction model where:
- One panel can be open at a time (exclusive expansion)
- All panels share consistent behavior and styling
- Panels never block the main chat input
- Mobile users get bottom-sheet experiences

### State Colocation
State lives close to where it's used:
- **chat-interface.tsx** - Orchestrates all features, owns primary state
- **input-area.tsx** - Owns panel expansion states, delegates to chat-interface for data
- Individual panels are presentational components receiving props

---

## Component Hierarchy

```
app/page.tsx
  └── components/chat/index.tsx
      └── ChatInterface
          ├── OnboardingModal (conditional: first load only)
          ├── ChatHeader
          │   └── Activity button (opens ActivitySidebar)
          ├── ChatMessages
          │   └── [Message components]
          ├── ActivitySidebar (slide-in from right)
          │   ├── ActivityFeed
          │   └── ScheduledTasks section
          └── InputArea
              ├── QuickActions (above input)
              ├── CollaborationMode (top-right corner)
              ├── MemoryPanel (expandable)
              ├── TaskPanel (expandable)
              ├── PlaybooksPanel (expandable)
              ├── CheckpointsPanel (expandable)
              ├── TextareaInput
              └── Control buttons row
                  ├── Memory toggle
                  ├── Task toggle
                  ├── Playbooks toggle
                  ├── Checkpoints toggle
                  ├── Image, Tools, Think, Voice, Search
                  └── Send button
```

---

## State Management

### ChatInterface State

Located in `/components/chat/chat-interface.tsx`:

```typescript
// Core chat state
const [messages, setMessages] = useState<Message[]>([])
const [inputValue, setInputValue] = useState("")
const [isStreaming, setIsStreaming] = useState(false)

// Feature states
const [memories, setMemories] = useState<Memory[]>([])
const [tasks, setTasks] = useState<Task[]>([])
const [playbooks, setPlaybooks] = useState<Playbook[]>([])
const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
const [activities, setActivities] = useState<Activity[]>([])
const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([])

// UI states
const [showOnboarding, setShowOnboarding] = useState(true)
const [isActivityOpen, setIsActivityOpen] = useState(false)
const [collaborationMode, setCollaborationMode] = useState<"lead" | "collaborate" | "assist">("collaborate")
const [assistantName, setAssistantName] = useState("Assistant")

// Input controls state
const [activeButtons, setActiveButtons] = useState<ActiveButtonState>({
  image: false,
  tools: false,
  thinkLevel: "off",
  browser: false,
  add: false,
  selectedTools: [],
})
```

### InputArea State

Located in `/components/chat/input-area.tsx`:

```typescript
// Panel expansion states (exclusive - only one open at a time)
const [isTaskPanelExpanded, setIsTaskPanelExpanded] = useState(false)
const [isMemoryPanelExpanded, setIsMemoryPanelExpanded] = useState(false)
const [isPlaybooksPanelExpanded, setIsPlaybooksPanelExpanded] = useState(false)
const [isCheckpointsPanelExpanded, setIsCheckpointsPanelExpanded] = useState(false)

// Other UI state
const [hasTyped, setHasTyped] = useState(false)
const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
```

### Panel Toggle Logic

Only one panel can be open at a time. When toggling:

```typescript
const togglePanel = (panel: "task" | "memory" | "playbooks" | "checkpoints") => {
  // Check if this panel is currently open
  const isCurrentlyOpen = /* check current state */
  
  // Close all panels first
  setIsTaskPanelExpanded(false)
  setIsMemoryPanelExpanded(false)
  setIsPlaybooksPanelExpanded(false)
  setIsCheckpointsPanelExpanded(false)
  
  // If panel was closed, open it
  if (!isCurrentlyOpen) {
    // Open the requested panel
  }
}
```

This ensures clicking the same button twice will close the panel, and clicking a different button switches panels smoothly.

---

## Data Models

### Memory
```typescript
interface Memory {
  id: string
  text: string
  category: "preferences" | "about" | "how-you-work" | "session"
  source: "user" | "ai"
  timestamp: Date
}
```

### Task
```typescript
interface Task {
  id: string
  text: string
  completed: boolean
  addedBy: "user" | "ai"
}
```

### Playbook
```typescript
interface Playbook {
  id: string
  name: string
  description: string
  category: "review" | "planning" | "research"
  steps: string[]
  isBuiltIn: boolean
}
```

### Checkpoint
```typescript
interface Checkpoint {
  id: string
  timestamp: Date
  messageCount: number
  type: "auto" | "manual"
  label?: string
}
```

### Activity
```typescript
interface Activity {
  id: string
  type: "thinking" | "search" | "writing" | "completed"
  message: string
  timestamp: Date
}
```

### ScheduledTask
```typescript
interface ScheduledTask {
  id: string
  name: string
  schedule: string // e.g., "Daily at 9am"
  nextRun: Date
  enabled: boolean
}
```

---

## Event Flow Examples

### User Adds a Task

1. User clicks Task icon → `togglePanel("task")` in InputArea
2. Panel expands, input field focused
3. User types task and presses Enter
4. `onTaskAdd(text)` called → bubbles to ChatInterface
5. ChatInterface: `setTasks([...tasks, newTask])`
6. TaskPanel re-renders with new task
7. Task count badge updates in input controls

### User Creates Checkpoint

1. User clicks Checkpoints icon → panel expands
2. User clicks "Save Now" button
3. `onCheckpointSave()` called → bubbles to ChatInterface
4. ChatInterface creates checkpoint with current message count
5. `setCheckpoints([...checkpoints, newCheckpoint])`
6. CheckpointsPanel shows new manual checkpoint
7. Timeline updates visually

### User Restores Checkpoint

1. User clicks checkpoint in panel
2. Confirmation modal appears
3. User confirms restore
4. `onCheckpointRestore(checkpointId)` called
5. ChatInterface finds checkpoint, gets message count
6. `setMessages(messages.slice(0, messageCount))`
7. All panels close
8. Activity feed shows "Restored to checkpoint"

### Assistant Adds Memory During Onboarding

1. User completes onboarding step 2 (About You)
2. Response: "I'm a product designer"
3. Onboarding saves to initial memories
4. When onboarding completes: `onComplete(assistantName, initialMemories)`
5. ChatInterface: `setMemories(initialMemories)`, `setAssistantName(name)`
6. Header updates to show assistant name
7. Memory panel now contains onboarding responses

---

## Styling Architecture

### Design Tokens

All colors use semantic tokens from `globals.css`:

```css
--background: 0 0% 100%
--foreground: 240 10% 3.9%
--card: 0 0% 100%
--primary: 24 87% 54%  /* Orange accent */
--muted: 240 4.8% 95.9%
--border: 240 5.9% 90%
```

### Consistent Panel Styling

All panels follow this pattern:

```tsx
className={cn(
  "absolute left-0 right-0 bg-card border border-border",
  "transition-all duration-300",
  isMobile 
    ? "bottom-full rounded-t-3xl" // Mobile: bottom sheet
    : "bottom-full mb-2 rounded-2xl shadow-lg", // Desktop: floating
  isExpanded 
    ? "max-h-[60vh] opacity-100" 
    : "max-h-0 opacity-0 overflow-hidden"
)}
```

### Button Patterns

Control buttons in input area:

```tsx
className={cn(
  "rounded-full h-8 px-3 flex items-center",
  "border border-border gap-1.5 transition-colors bg-background",
  isActive && "bg-primary/10 border-primary/20",
  hasContent && "border-primary/50"
)}
```

### Mobile Responsiveness

```tsx
const isMobile = useIsMobile() // Custom hook from @/hooks/use-mobile

// Conditionally render or adjust layout
{isMobile ? (
  <MobileLayout />
) : (
  <DesktopLayout />
)}
```

---

## Performance Considerations

### Preventing Unnecessary Re-renders

- Use `React.memo` for expensive components
- Callbacks are memoized with `useCallback`
- Panel expansion doesn't re-render entire chat

### Event Propagation

Panel clicks must not bubble to input container:

```tsx
<div 
  onClick={(e) => e.stopPropagation()}
  onMouseDown={(e) => e.stopPropagation()}
>
  {/* Panel content */}
</div>
```

This prevents focus from jumping to textarea when clicking inside panels.

### Textarea Auto-resize

The textarea grows with content:

```typescript
const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  e.target.style.height = "auto"
  const newHeight = Math.max(24, Math.min(e.target.scrollHeight, 160))
  e.target.style.height = `${newHeight}px`
}
```

Max height: 160px before scrolling.

---

## Future Technical Enhancements

### Persistence Layer

Currently all state is in-memory. Planned:

1. **LocalStorage** - Client-side persistence
   - Store memories, playbooks, checkpoints
   - Restore on page refresh
   - Size limit: ~5MB

2. **IndexedDB** - Larger data storage
   - Full conversation history
   - Artifacts and documents
   - Search index

3. **Backend Sync** - Server persistence
   - Cross-device sync
   - Collaboration features
   - Cloud backup

### Context Management

As conversations grow, context window limits require:

1. **Summarization** - Compress old messages
2. **Semantic Search** - Retrieve relevant past context
3. **Context Budget** - Show token usage, warn when near limit
4. **Smart Truncation** - Keep important messages, summarize middle

### Real-time Updates

For background agents:

1. **WebSocket** - Push updates from server
2. **Server-Sent Events** - Activity feed updates
3. **Optimistic UI** - Show pending states immediately

### Testing Strategy

Current: Manual testing
Planned:
- Unit tests for state logic
- Integration tests for panel interactions
- E2E tests for user flows (Playwright)
- Visual regression tests for UI consistency

---

## Development Guidelines

### Adding a New Panel

1. Create component in `/components/chat/[feature]-panel.tsx`
2. Define data model interface
3. Add state to ChatInterface
4. Add expansion state to InputArea
5. Add toggle button to input controls
6. Wire up callbacks for data changes
7. Update togglePanel logic
8. Add to FEATURES.md documentation

### Adding a New Activity Type

1. Update Activity interface with new type
2. Add icon mapping in activity-feed.tsx
3. Create activity when action occurs
4. Update Activity Feed styling if needed

### Modifying State

All state changes flow through ChatInterface:
- InputArea calls callbacks (e.g., `onTaskAdd`)
- ChatInterface updates state
- Props flow down to panels
- UI updates reactively

Never mutate state directly. Always use setters.

---

## Debugging Tips

### Panel Not Opening?

Check:
1. Is togglePanel being called?
2. Is expansion state being set correctly?
3. Is panel in the DOM but hidden (opacity/height)?
4. Console log the expansion state before/after toggle

### State Not Updating?

Check:
1. Is callback being passed correctly as prop?
2. Is ChatInterface receiving the event?
3. Console log state before/after setState
4. Is component re-rendering? (React DevTools)

### Styling Issues?

Check:
1. Are Tailwind classes being applied? (Inspect element)
2. Is z-index causing overlap?
3. Is parent container constraining size?
4. Does it work on mobile/desktop breakpoint?

### Using Debug Logs

```typescript
console.log("[v0] Panel toggled:", panel, "isOpen:", isCurrentlyOpen)
console.log("[v0] Tasks updated:", tasks)
console.log("[v0] Checkpoint saved:", checkpoint)
```

Prefix with `[v0]` to easily filter in browser console.

---

## Architecture Decisions

### Why Panels Instead of Modals?

- Panels feel lighter weight
- Don't block the main interface
- Can reference chat while using features
- Faster to access (no modal open/close)

### Why Exclusive Panel Expansion?

- Prevents UI clutter
- Clear focus on one task at a time
- Easier to implement smooth transitions
- Better mobile experience

### Why State in ChatInterface?

- Single source of truth
- Easier to save/restore full state
- Simpler data flow (unidirectional)
- Facilitates future persistence

### Why Not Redux/Zustand?

- Current complexity doesn't warrant it
- React state is sufficient for now
- Can migrate later if needed
- Keeps bundle size smaller

---

This architecture supports the guiding principle: a collaborative workspace that emphasizes visibility, trust, and partnership over raw execution.
