# Component Reference

Complete documentation of all components in the Chat UI with Vibration application.

---

## Table of Contents

1. [Input Components](#input-components)
2. [Panel Components](#panel-components)
3. [Button Components](#button-components)
4. [Modal Components](#modal-components)
5. [Feature Components](#feature-components)

---

## Input Components

### InputAreaSimplified
**Location:** `/components/chat/input/input-area-simplified.tsx`

**Purpose:** Main orchestrator for the input area, managing panels and quick actions.

**Props:**
```typescript
interface InputAreaSimplifiedProps {
  inputValue: string
  setInputValue: (value: string) => void
  handleSubmit: (e: React.FormEvent) => void
  isStreaming: boolean
  isMobile: boolean
  activeButtons: ActiveButtonState
  setActiveButtons: (buttons: ActiveButtonState) => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
  uploadedImages: UploadedImage[]
  setUploadedImages: (images: UploadedImage[]) => void
  memories: Memory[]
  onMemoryEdit: (id: string, text: string) => void
  onMemoryDelete: (id: string) => void
  checkpoints: Checkpoint[]
  currentCheckpointId: string | null
  onCheckpointRestore: (id: string) => void
  onCheckpointCreate: () => void
  playbooks: Playbook[]
  onPlaybookRun: (id: string) => void
  onPlaybookAdd: (playbook: Playbook) => void
  onPlaybookDelete: (id: string) => void
  collaborationMode: CollaborationMode
  onCollaborationModeChange: (mode: CollaborationMode) => void
}
```

**Key Features:**
- Renders QuickActions above input
- Manages panel expansion states (Memory, Task, Playbooks, Checkpoints)
- Ensures only one panel open at a time
- Delegates form handling to InputBar

**State Management:**
- `isPanelExpanded` states for each panel
- Task list (local state)
- Panel toggle logic

---

### InputBar
**Location:** `/components/chat/input/input-bar.tsx`

**Purpose:** Handles the form layout and textarea input.

**Props:**
```typescript
interface InputBarProps {
  inputValue: string
  setInputValue: (value: string) => void
  handleSubmit: (e: React.FormEvent) => void
  isStreaming: boolean
  isMobile: boolean
  activeButtons: ActiveButtonState
  setActiveButtons: (buttons: ActiveButtonState) => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
  uploadedImages: UploadedImage[]
  setUploadedImages: (images: UploadedImage[]) => void
  onTogglePanel: (panel: PanelType) => void
  panelStates: PanelStates
}
```

**Key Features:**
- Form submission handling
- Textarea auto-resize
- Image upload area
- Container click handling (focus textarea)

---

### InputControls
**Location:** `/components/chat/input/input-controls.tsx`

**Purpose:** Left side controls (tools, think, panels).

**Props:**
```typescript
interface InputControlsProps {
  activeButtons: ActiveButtonState
  onToggleButton: (button: keyof ActiveButtonState) => void
  onThinkLevelChange: (level: ThinkLevel) => void
  onTogglePanel: (panel: PanelType) => void
  panelStates: PanelStates
  taskCount?: { completed: number; total: number }
  memoryCount?: number
  checkpointCount?: number
  playbookCount?: number
  isStreaming: boolean
}
```

**Key Features:**
- Image, Think, Tools buttons
- Panel toggle chips with counts
- Visual indicators for active states

---

### InputActions
**Location:** `/components/chat/input/input-actions.tsx`

**Purpose:** Right side actions (mic, voice, send).

**Props:**
```typescript
interface InputActionsProps {
  activeButtons: ActiveButtonState
  onToggleButton: (button: keyof ActiveButtonState) => void
  onSubmit: () => void
  isStreaming: boolean
  hasContent: boolean
}
```

**Key Features:**
- Microphone button
- Voice toggle
- Send button (disabled when streaming)

---

## Panel Components

### MemoryPanel
**Location:** `/components/chat/memory-panel.tsx`

**Purpose:** Displays and manages assistant memory.

**Props:**
```typescript
interface MemoryPanelProps {
  isExpanded: boolean
  onToggle: () => void
  memories: Memory[]
  onMemoryEdit: (id: string, text: string) => void
  onMemoryDelete: (id: string) => void
  isMobile: boolean
}
```

**Types:**
```typescript
type Memory = {
  id: string
  text: string
  category: "preferences" | "about_you" | "how_you_work" | "session"
  source: "user" | "ai"
  timestamp: Date
}
```

**Key Features:**
- Category filtering
- Inline editing
- Delete with confirmation
- Source attribution (user vs AI)

---

### TaskPanel
**Location:** `/components/chat/task-panel.tsx`

**Purpose:** Lightweight task manager for conversation-related tasks.

**Props:**
```typescript
interface TaskPanelProps {
  isExpanded: boolean
  onToggle: () => void
  tasks: Task[]
  onTaskToggle: (id: string) => void
  onTaskAdd: (text: string) => void
  onTaskEdit: (id: string, text: string) => void
  onTaskDelete: (id: string) => void
  isMobile: boolean
}
```

**Types:**
```typescript
type Task = {
  id: string
  text: string
  completed: boolean
  addedBy: "user" | "ai"
}
```

**Key Features:**
- Add tasks via input
- Toggle completion
- Inline editing
- Delete functionality

---

### PlaybooksPanel
**Location:** `/components/chat/playbooks-panel.tsx`

**Purpose:** Reusable workflow templates.

**Props:**
```typescript
interface PlaybooksPanelProps {
  isExpanded: boolean
  onToggle: () => void
  playbooks: Playbook[]
  onPlaybookRun: (id: string) => void
  onPlaybookAdd: (playbook: Playbook) => void
  onPlaybookDelete: (id: string) => void
  isMobile: boolean
}
```

**Types:**
```typescript
type Playbook = {
  id: string
  name: string
  description: string
  category: "planning" | "research" | "review" | "custom"
  steps: string[]
  icon: string
}
```

**Key Features:**
- Built-in playbooks (Weekly Review, Project Kickoff, Deep Research)
- Run playbook (inserts steps into conversation)
- Add custom playbooks
- Delete playbooks

---

### CheckpointsPanel
**Location:** `/components/chat/checkpoints-panel.tsx`

**Purpose:** Visual timeline of conversation states.

**Props:**
```typescript
interface CheckpointsPanelProps {
  isExpanded: boolean
  onToggle: () => void
  checkpoints: Checkpoint[]
  currentCheckpointId: string | null
  onCheckpointRestore: (id: string) => void
  onCheckpointCreate: () => void
  isMobile: boolean
}
```

**Types:**
```typescript
type Checkpoint = {
  id: string
  title: string
  description: string
  timestamp: Date
  type: "auto" | "manual"
  messageCount: number
}
```

**Key Features:**
- Timeline visualization
- Auto-checkpoint every 5 messages
- Manual "Save Now" button
- Restore with confirmation

---

## Button Components

### ThinkButton
**Location:** `/components/chat/buttons/think-button.tsx`

**Purpose:** Opens Think mode selector modal.

**Props:**
```typescript
interface ThinkButtonProps {
  thinkLevel: ThinkLevel
  onLevelChange: (level: ThinkLevel) => void
  isStreaming: boolean
}

type ThinkLevel = "off" | "on" | "deep"
```

**Key Features:**
- Opens modal via modal provider
- Visual indicator of current level
- Disabled when streaming

---

### ToolsButton
**Location:** `/components/chat/buttons/tools-button.tsx`

**Purpose:** Opens tools selector modal.

**Props:**
```typescript
interface ToolsButtonProps {
  selectedTools: string[]
  onToolsChange: (tools: string[]) => void
  isStreaming: boolean
}
```

**Key Features:**
- Opens modal via modal provider
- Shows count of selected tools
- Badge indicator when tools active

---

### ImageButton
**Location:** `/components/chat/buttons/image-button.tsx`

**Purpose:** Toggles image upload area.

**Props:**
```typescript
interface ImageButtonProps {
  isActive: boolean
  onToggle: () => void
  isStreaming: boolean
}
```

---

### MicrophoneButton
**Location:** `/components/chat/buttons/microphone-button.tsx`

**Purpose:** Activates voice input.

**Props:**
```typescript
interface MicrophoneButtonProps {
  isActive: boolean
  onToggle: () => void
  isStreaming: boolean
}
```

---

### VoiceToggleButton
**Location:** `/components/chat/buttons/voice-toggle-button.tsx`

**Purpose:** Toggles voice mode.

**Props:**
```typescript
interface VoiceToggleButtonProps {
  isActive: boolean
  onToggle: () => void
  isStreaming: boolean
}
```

---

### SendButton
**Location:** `/components/chat/buttons/send-button.tsx`

**Purpose:** Submits the message.

**Props:**
```typescript
interface SendButtonProps {
  onClick: () => void
  isStreaming: boolean
  hasContent: boolean
}
```

---

## Modal Components

### OnboardingModal
**Location:** `/components/onboarding/onboarding-modal.tsx`

**Purpose:** First-run experience.

**Props:**
```typescript
interface OnboardingModalProps {
  isOpen: boolean
  onComplete: (data: OnboardingData) => void
}

type OnboardingData = {
  assistantName: string
  userRole: string
  primaryUse: string
  collaborationMode: CollaborationMode
  enableMemory: boolean
}
```

**Steps:**
1. Name your assistant
2. About you (role)
3. Primary use case
4. Collaboration mode preference

---

### ThinkModalContent
**Location:** `/components/chat/think-modal-content.tsx`

**Purpose:** Think level selector.

**Props:**
```typescript
interface ThinkModalContentProps {
  onClose: () => void
  currentLevel: ThinkLevel
  onLevelChange: (level: ThinkLevel) => void
}
```

**Levels:**
- **Off** - No extended thinking
- **On** - Basic reasoning
- **Deep** - Extended thinking

---

### ToolsSelectorModalContent
**Location:** `/components/chat/tools-selector-modal-content.tsx`

**Purpose:** Tool selection interface.

**Props:**
```typescript
interface ToolsSelectorModalContentProps {
  onClose: () => void
  selectedTools: string[]
  onToolsChange: (tools: string[]) => void
}
```

**Available Tools:**
- Web Search
- Code Executor
- File Analysis
- Data Visualization
- Calculator

---

### ActivityModalContent
**Location:** `/components/chat/activity-modal-content.tsx`

**Purpose:** Shows activity feed and scheduled tasks.

**Props:**
```typescript
interface ActivityModalContentProps {
  onClose: () => void
  activities: ActivityItem[]
  scheduledTasks: ScheduledTask[]
}
```

**Tabs:**
1. Activity Feed
2. Scheduled Tasks

---

## Feature Components

### QuickActions
**Location:** `/components/chat/quick-actions.tsx`

**Purpose:** One-click prompt shortcuts.

**Props:**
```typescript
interface QuickActionsProps {
  onActionSelect: (prompt: string) => void
  isStreaming: boolean
  className?: string
}
```

**Actions:**
- Summarize
- Plan
- Review
- Research
- Follow-up
- Brainstorm

---

### CollaborationMode
**Location:** `/components/chat/collaboration-mode.tsx`

**Purpose:** Mode selector for assistant autonomy.

**Props:**
```typescript
interface CollaborationModeProps {
  mode: CollaborationMode
  onChange: (mode: CollaborationMode) => void
}

type CollaborationMode = "lead" | "collaborate" | "assist"
```

**Modes:**
- **Lead** - Assistant drives, autonomous decisions
- **Collaborate** - Back-and-forth discussion
- **Assist** - User drives, assistant advises

---

### ChatHeader
**Location:** `/components/chat/chat-header.tsx`

**Purpose:** Top navigation bar.

**Props:**
```typescript
interface ChatHeaderProps {
  onActivityClick?: () => void
  assistantName?: string
  activityCount?: number
}
```

**Features:**
- Menu button (left)
- Assistant name (center)
- Activity button with badge (right)
- New chat button (right)

---

## Utility Components

### ImageUpload
**Location:** `/components/chat/image-upload.tsx`

**Purpose:** Drag-and-drop image upload.

**Props:**
```typescript
interface ImageUploadProps {
  images: UploadedImage[]
  onRemoveImage: (id: string) => void
  onAddImages: (images: UploadedImage[]) => void
  isVisible: boolean
}
```

---

### TextareaInput
**Location:** `/components/chat/textarea-input.tsx`

**Purpose:** Auto-resizing textarea.

**Props:**
```typescript
interface TextareaInputProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>
  inputValue: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  isStreaming: boolean
  isMobile: boolean
}
```

---

## Usage Patterns

### Adding a New Panel
1. Create component in `/components/chat/`
2. Define props interface with `isExpanded`, `onToggle`, `isMobile`
3. Add state to `InputAreaSimplified`
4. Add toggle button to `InputControls`
5. Wire up exclusive panel logic

### Adding a New Modal
1. Create modal content in `/components/chat/` or appropriate folder
2. Use modal provider pattern: `openModal(id, content, onClose)`
3. Ensure proper centering: wrap in `flex items-center justify-center h-full p-4`
4. Add `animate-scaleIn` for entrance animation

### Adding a New Button
1. Create in `/components/chat/buttons/`
2. Follow existing button patterns (active state, disabled state)
3. Use consistent sizing (`h-8`, `rounded-full`)
4. Add to appropriate controls component

---

**See Also:**
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Component hierarchy
- [CONVENTIONS.md](../CONVENTIONS.md) - Naming and file organization
- [DESIGN_PHILOSOPHY.md](./DESIGN_PHILOSOPHY.md) - Design principles
