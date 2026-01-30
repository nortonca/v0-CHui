# Component Reference Guide

Complete reference for all major components in the chat application.

---

## Table of Contents

- [Chat Components](#chat-components)
- [Composer Components](#composer-components)
- [Panel Components](#panel-components)
- [Settings Components](#settings-components)
- [UI Components](#ui-components)
- [Utility Hooks](#utility-hooks)

---

## Chat Components

### ChatInterface

**Location:** `/components/chat/chat-interface.tsx`

**Purpose:** Main orchestrator for the entire chat application

**Props:**
```typescript
interface ChatInterfaceProps {
  // No external props - manages all state internally
}
```

**Key State:**
```typescript
messages: Message[]              // All chat messages
messageSections: MessageSection[] // Grouped messages by section
streamingMessageId: string | null // Currently streaming message
streamingWords: StreamingWord[]  // Words being streamed
isStreaming: boolean             // Is AI currently responding
```

**Key Methods:**
```typescript
handleSubmit(content: string, images?: UploadedImage[]) // Send message
simulateAIResponse(userMessage: string)                  // Get AI response
handleStopStreaming()                                     // Stop current response
```

**Usage:**
```tsx
<ChatInterface />
```

---

### Message

**Location:** `/components/chat/message.tsx`

**Purpose:** Render individual message bubbles with proper styling and features

**Props:**
```typescript
interface MessageProps {
  message: Message
  streamingMessageId: string | null
  streamingWords: StreamingWord[]
  completedMessages: Set<string>
}
```

**Message Type:**
```typescript
interface Message {
  id: string
  type: 'user' | 'system'
  content: string
  completed: boolean
  thinking?: string
  thinkingComplete?: boolean
  toolCalls?: ToolCall[]
  images?: UploadedImage[]
}
```

**Styling:**
- User messages: `bg-primary text-primary-foreground rounded-tr-sm`
- AI messages: `bg-card border border-border rounded-tl-sm`
- Max width: `85%` mobile, `75%` desktop
- Spacing: `mb-4` between messages, `px-4 py-3` inside bubble

**Features:**
- Image attachments display
- Thinking indicators (expandable)
- Tool call displays
- Action buttons (regenerate, copy, share, like, dislike)
- Markdown rendering via Streamdown

---

### MessageSection

**Location:** `/components/chat/message-section.tsx`

**Purpose:** Group messages into sections with proper spacing and scroll behavior

**Props:**
```typescript
interface MessageSectionProps {
  section: MessageSection
  streamingMessageId: string | null
  streamingWords: StreamingWord[]
  completedMessages: Set<string>
  viewportHeight: number
  isLastSection: boolean
  newSectionRef: React.RefObject<HTMLDivElement>
}
```

**MessageSection Type:**
```typescript
interface MessageSection {
  id: string
  sectionIndex: number
  messages: Message[]
  isNewSection: boolean
  isActive: boolean
}
```

**Behavior:**
- Groups consecutive messages
- Handles dynamic height for active sections
- Auto-scrolls to new sections

---

## Composer Components

### Composer

**Location:** `/components/chat/composer/composer.tsx`

**Purpose:** Input area with all interaction controls and feature access

**Props:**
```typescript
interface ComposerProps {
  onSubmit: (content: string, images?: UploadedImage[]) => void
  isStreaming: boolean
  onStopStreaming: () => void
  activeButtons: ActiveButtonState
  onActiveButtonsChange: (buttons: ActiveButtonState) => void
  // ... memory, tasks, checkpoints props
}
```

**Key Features:**
1. **Text Input** - Auto-resizing textarea
2. **Image Upload** - Drag & drop or file picker
3. **Feature Tray** - Expandable grid (Memory, Tasks, Tools, etc.)
4. **Quick Actions** - Prompt suggestions
5. **Voice Controls** - Microphone and voice mode
6. **Panels** - Slide-up interfaces for features

**Styling:**
```tsx
// Main container
className="relative w-full max-w-3xl mx-auto px-4 py-3"

// Input box
className="bg-card border border-border rounded-2xl shadow-sm p-3"

// Plus button
className="w-9 h-9 rounded-full border border-border bg-background"
```

**State Management:**
```typescript
const [inputValue, setInputValue] = useState("")
const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
const [isTrayOpen, setIsTrayOpen] = useState(false)
const [activePanel, setActivePanel] = useState<string | null>(null)
```

---

### ComposerTray

**Location:** `/components/chat/composer/composer-tray.tsx`

**Purpose:** Grid of feature buttons that slides up from composer

**Props:**
```typescript
interface ComposerTrayProps {
  isOpen: boolean
  onToggle: () => void
  activeButtons: ActiveButtonState
  onPanelOpen: (panelId: string) => void
  isMobile: boolean
}
```

**Layout:**
- 3-column grid: `grid-cols-3`
- Gap: `gap-3`
- Animation: `animate-slideUpFadeIn` when opening

**Items:**
```typescript
const trayItems = [
  { id: 'notebook', icon: BookOpen, label: 'Notebook' },
  { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
  { id: 'think', icon: Sparkles, label: 'Think' },
  { id: 'tools', icon: Wrench, label: 'Tools' },
  { id: 'playbooks', icon: Play, label: 'Playbooks' },
  { id: 'checkpoints', icon: Archive, label: 'Checkpoints' },
  { id: 'mode', icon: Users, label: 'Mode' },
]
```

**Styling Pattern:**
```tsx
className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted"
```

---

### ImagePreview

**Location:** `/components/chat/composer/image-preview.tsx`

**Purpose:** Display uploaded images with preview and editing capabilities

**Props:**
```typescript
interface ImagePreviewProps {
  images: UploadedImage[]
  onRemove: (id: string) => void
}
```

**Features:**
1. **Thumbnail Strip** - Horizontal scrollable list
2. **Lightbox** - Full-size modal view
3. **Rotation** - 90° clockwise rotation
4. **Keyboard Nav** - ESC to close, arrows to navigate

**State:**
```typescript
const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
const [rotations, setRotations] = useState<Record<string, number>>({})
```

**Thumbnail Styling:**
```tsx
className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-border shadow-sm"
```

**Lightbox Pattern:**
```tsx
// Modal
className="fixed inset-0 z-50"

// Backdrop
className="bg-background/95 backdrop-blur-md"

// Content
className="bg-card border border-border rounded-2xl shadow-2xl"
```

---

### QuickActions

**Location:** `/components/chat/quick-actions.tsx`

**Purpose:** Pre-built prompt suggestions above input

**Props:**
```typescript
interface QuickActionsProps {
  onActionSelect: (prompt: string) => void
  isStreaming: boolean
  className?: string
}
```

**Actions:**
```typescript
const quickActions = [
  { id: 'summarize', label: 'Summarize', prompt: 'Please summarize...' },
  { id: 'plan', label: 'Plan', prompt: 'Help me plan...' },
  { id: 'review', label: 'Review', prompt: 'Review this...' },
  { id: 'research', label: 'Research', prompt: 'Research...' },
  { id: 'followup', label: 'Follow-up', prompt: 'Follow up on...' },
  { id: 'brainstorm', label: 'Brainstorm', prompt: 'Let\'s brainstorm...' },
]
```

**Styling:**
```tsx
// Container
className="flex gap-2 overflow-x-auto scrollbar-hide"

// Button
className="px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted"
```

---

## Panel Components

### MemoryPanel (Notebook)

**Location:** `/components/chat/memory-panel.tsx`

**Purpose:** Store and manage conversation memories

**Props:**
```typescript
interface MemoryPanelProps {
  isExpanded: boolean
  onToggle: () => void
  memories: Memory[]
  onMemoryEdit: (id: string, content: string) => void
  onMemoryDelete: (id: string) => void
  isMobile: boolean
}
```

**Memory Type:**
```typescript
interface Memory {
  id: string
  content: string
  timestamp: Date
}
```

---

### TaskPanel

**Location:** `/components/chat/task-panel.tsx`

**Purpose:** Create and track tasks

**Props:**
```typescript
interface TaskPanelProps {
  isExpanded: boolean
  onToggle: () => void
  tasks: Task[]
  onTaskToggle: (id: string) => void
  onTaskAdd: (content: string) => void
  onTaskEdit: (id: string, content: string) => void
  onTaskDelete: (id: string) => void
  isMobile: boolean
}
```

**Task Type:**
```typescript
interface Task {
  id: string
  content: string
  completed: boolean
  timestamp: Date
}
```

---

### ThinkPanel

**Location:** `/components/chat/think-panel.tsx`

**Purpose:** Control AI thinking depth

**Props:**
```typescript
interface ThinkPanelProps {
  isExpanded: boolean
  onToggle: () => void
  thinkLevel: 'off' | 'low' | 'medium' | 'high'
  onLevelChange: (level: string) => void
  isMobile: boolean
}
```

**Levels:**
- **Off:** No extended thinking
- **Low:** Brief consideration
- **Medium:** Thoughtful analysis
- **High:** Deep reasoning

---

### ToolsPanel

**Location:** `/components/chat/tools-panel.tsx`

**Purpose:** Select available tools for AI to use

**Props:**
```typescript
interface ToolsPanelProps {
  isExpanded: boolean
  onToggle: () => void
  selectedTools: string[]
  onToolsChange: (tools: string[]) => void
  isMobile: boolean
}
```

**Available Tools:**
```typescript
const availableTools = [
  { id: 'search', name: 'Web Search', icon: Search },
  { id: 'calculator', name: 'Calculator', icon: Calculator },
  { id: 'codeInterpreter', name: 'Code Runner', icon: Code },
]
```

---

## Settings Components

### SettingsModalContent

**Location:** `/components/settings/settings-modal-content.tsx`

**Purpose:** Main settings interface

**Props:**
```typescript
interface SettingsModalContentProps {
  onClose: () => void
}
```

**Sections:**
1. Execution Mode
2. Communication Style
3. AI Questions
4. Task Planning
5. Preferences
6. Conversation Memory

---

### SettingsSection

**Location:** `/components/settings/settings-section.tsx`

**Purpose:** Reusable section wrapper

**Props:**
```typescript
interface SettingsSectionProps {
  icon: LucideIcon
  title: string
  description: string
  children: React.ReactNode
}
```

**Usage:**
```tsx
<SettingsSection
  icon={Zap}
  title="Execution Mode"
  description="How the agent approaches tasks"
>
  {/* Content */}
</SettingsSection>
```

---

### SettingsRadioGroup

**Location:** `/components/settings/settings-section.tsx`

**Purpose:** Radio button group for settings

**Props:**
```typescript
interface SettingsRadioGroupProps {
  options: Array<{ id: string; label: string; description: string }>
  value: string
  onChange: (value: string) => void
}
```

**Styling:**
```tsx
// Selected
className="bg-primary/5 border border-primary/20"

// Radio indicator
className="w-4 h-4 rounded-full border-2 border-primary bg-primary"
```

---

### SettingsToggle

**Location:** `/components/settings/settings-section.tsx`

**Purpose:** On/off toggle switch

**Props:**
```typescript
interface SettingsToggleProps {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}
```

**Styling:**
```tsx
// Toggle track
className="w-11 h-6 rounded-full bg-primary" // when on
className="w-11 h-6 rounded-full bg-muted"   // when off

// Toggle thumb
className="w-5 h-5 rounded-full bg-white translate-x-5" // when on
```

---

### SettingsSlider

**Location:** `/components/settings/settings-section.tsx`

**Purpose:** Numeric range input

**Props:**
```typescript
interface SettingsSliderProps {
  label: string
  description: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  labels?: Record<number, string>
}
```

**Example:**
```tsx
<SettingsSlider
  label="Max Questions"
  description="Limit AI questions per response"
  value={2}
  onChange={setMaxQuestions}
  min={0}
  max={5}
  step={1}
  labels={{
    0: 'None',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5+'
  }}
/>
```

---

## UI Components

### Button (shadcn/ui)

**Location:** `/components/ui/button.tsx`

**Variants:**
- `default` - Primary action
- `secondary` - Secondary action
- `outline` - Outlined button
- `ghost` - No background
- `destructive` - Dangerous action

**Sizes:**
- `sm` - Small (h-8)
- `default` - Medium (h-10)
- `lg` - Large (h-12)
- `icon` - Square (h-9 w-9)

---

### Card (shadcn/ui)

**Location:** `/components/ui/card.tsx`

**Components:**
- `Card` - Container
- `CardHeader` - Top section
- `CardTitle` - Title text
- `CardDescription` - Subtitle
- `CardContent` - Main content
- `CardFooter` - Bottom section

---

### Dialog (shadcn/ui)

**Location:** `/components/ui/dialog.tsx`

**Components:**
- `Dialog` - Root component
- `DialogTrigger` - Opens dialog
- `DialogContent` - Modal content
- `DialogHeader` - Header section
- `DialogTitle` - Title
- `DialogDescription` - Description
- `DialogFooter` - Footer with actions

---

## Utility Hooks

### useMobile

**Location:** `/hooks/use-mobile.tsx`

**Purpose:** Detect mobile viewport

**Usage:**
```tsx
const isMobile = useMobile()

return isMobile ? <MobileView /> : <DesktopView />
```

**Breakpoint:** 768px

---

### useAgentChat

**Location:** `/hooks/use-agent-chat.ts`

**Purpose:** Manage chat with AI agent

**Returns:**
```typescript
{
  messages: Message[]
  sendMessage: (content: string) => Promise<void>
  isStreaming: boolean
  stopStreaming: () => void
}
```

**Usage:**
```tsx
const { messages, sendMessage, isStreaming } = useAgentChat()
```

---

## Styling Patterns

### Responsive Classes

```tsx
// Mobile first, then larger screens
className="text-sm sm:text-base md:text-lg"

// Hide on mobile, show on desktop
className="hidden md:block"

// Different padding
className="p-4 sm:p-6 md:p-8"
```

### State-based Styling

```tsx
// Using cn() helper
className={cn(
  "base-classes",
  isActive && "active-classes",
  isDisabled && "disabled-classes"
)}

// Boolean flags
className={`base ${isOpen ? 'open' : 'closed'}`}
```

### Animation Classes

```tsx
// Fade in
className="animate-in fade-in duration-200"

// Scale in
className="animate-in zoom-in-95 duration-300"

// Slide up
className="animate-slideUpFadeIn"

// Transition
className="transition-all duration-200"
```

---

## Common Gotchas

### 1. Scroll Containers

**Problem:** Content doesn't scroll properly

**Solution:** Use `flex-1 min-h-0` pattern
```tsx
<div className="flex flex-col h-screen">
  <div className="flex-1 min-h-0 overflow-y-auto">
    {/* Scrollable content */}
  </div>
</div>
```

### 2. Fixed Elements

**Problem:** Fixed elements cover content

**Solution:** Add spacer div with matching height
```tsx
<div className="overflow-y-auto">
  {/* Content */}
  <div className="h-36" aria-hidden="true" />
</div>
<div className="fixed bottom-0">
  {/* Fixed element */}
</div>
```

### 3. Event Propagation

**Problem:** Parent click fires when clicking child

**Solution:** Use `stopPropagation`
```tsx
<div onClick={parentHandler}>
  <button onClick={(e) => {
    e.stopPropagation()
    childHandler()
  }}>
    Click
  </button>
</div>
```

### 4. Ref Forwarding

**Problem:** Need to pass ref through custom component

**Solution:** Use `forwardRef`
```tsx
const MyComponent = forwardRef<HTMLDivElement, MyProps>(
  (props, ref) => {
    return <div ref={ref}>{props.children}</div>
  }
)
```

---

## Testing Checklist

When creating or modifying components:

- [ ] Works on mobile (< 640px)
- [ ] Works on tablet (640px - 1024px)
- [ ] Works on desktop (> 1024px)
- [ ] Keyboard accessible (Tab, Enter, Escape)
- [ ] Screen reader friendly (ARIA labels)
- [ ] Proper focus states
- [ ] Handles loading states
- [ ] Handles error states
- [ ] Handles empty states
- [ ] TypeScript types defined
- [ ] Console logs removed
- [ ] Follows design system
- [ ] Documented in this file

---

## Quick Reference

### Component Checklist

Creating a new component? Include:

1. **TypeScript Props Interface** - Define all props with types
2. **JSDoc Comment** - Describe purpose and usage
3. **Default Props** - Set sensible defaults
4. **Error Handling** - Handle edge cases gracefully
5. **Accessibility** - ARIA labels, keyboard nav
6. **Responsive Design** - Mobile, tablet, desktop
7. **Design Tokens** - Use semantic color classes
8. **Documentation** - Add to this reference

### Import Pattern

```tsx
// React
import { useState, useEffect, useRef } from 'react'

// Next.js
import Image from 'next/image'
import Link from 'next/link'

// External libraries
import { cn } from '@/lib/utils'

// Icons
import { Icon } from 'lucide-react'

// Components
import { Button } from '@/components/ui/button'

// Types
import type { MyType } from './types'

// Local
import './styles.css'
```

---

This reference covers all major components. For detailed implementation, refer to the source files.
