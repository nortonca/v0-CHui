# Feature Specifications

Detailed technical and UX specifications for each core feature in the collaborative workspace assistant.

---

## 1. Checkpoints

### Overview
A visual timeline allowing users to save and restore conversation states, providing a safety net for exploration and experimentation.

### User Stories
- **As a user**, I want to save my conversation state before making a big decision, so I can return if things go wrong.
- **As a user**, I want to see a timeline of key moments in my conversation, so I understand the evolution of my thinking.
- **As a user**, I want to restore to a previous checkpoint, so I can explore alternate paths.

### Functional Requirements

#### FR-1: Automatic Checkpointing
- System creates checkpoint every 5 messages
- Checkpoint includes: conversation history, memory state, uploaded files
- Auto-checkpoints are timestamped with message count
- Maximum 20 auto-checkpoints stored (FIFO)

#### FR-2: Manual Checkpointing
- User can create checkpoint with custom name and description
- Manual checkpoints never expire
- Show confirmation: "Checkpoint saved: [name]"
- Add visual marker in timeline

#### FR-3: Milestone Checkpointing
- System detects major decisions (keywords: "decided", "going with", "final choice")
- Prompts user: "Save this as a milestone?"
- Milestone checkpoints are highlighted in timeline
- Include decision summary in checkpoint metadata

#### FR-4: Checkpoint Restoration
- User selects checkpoint from timeline
- Show diff preview: what will change
- Confirmation modal: "Restore to [checkpoint name]?"
- On confirm: restore conversation state, show success message
- Current state is auto-saved before restore

### Non-Functional Requirements

#### NFR-1: Performance
- Checkpoint creation: < 100ms
- Timeline render: < 200ms
- Restoration: < 500ms

#### NFR-2: Storage
- Each checkpoint: ~50KB average
- Total storage per user: 10MB max
- Compression for older checkpoints

#### NFR-3: Reliability
- Atomic checkpoint operations
- Rollback on restoration failure
- Checkpoint corruption detection

### UI Components

#### Checkpoint Button
```tsx
<button onClick={createCheckpoint}>
  <History className="h-4 w-4" />
  Save Checkpoint
</button>
```

#### Timeline View
```tsx
<div className="checkpoint-timeline">
  {checkpoints.map(cp => (
    <CheckpointCard
      key={cp.id}
      checkpoint={cp}
      onRestore={handleRestore}
      isCurrent={cp.id === currentId}
    />
  ))}
</div>
```

#### Restoration Confirmation
```tsx
<Modal title="Restore Checkpoint">
  <p>Restore to: {checkpoint.name}?</p>
  <DiffView before={current} after={checkpoint} />
  <Button onClick={confirmRestore}>Restore</Button>
  <Button onClick={cancel}>Cancel</Button>
</Modal>
```

### Data Model

```typescript
interface Checkpoint {
  id: string
  type: "auto" | "manual" | "milestone"
  name: string
  description?: string
  createdAt: Date
  messageCount: number
  conversationState: {
    messages: Message[]
    memory: Memory[]
    uploadedFiles: File[]
    activeContext: string[]
  }
  metadata: {
    isCurrentState: boolean
    canRestore: boolean
  }
}
```

### Edge Cases
- Restoring while sub-agent is running → Cancel sub-agent first
- Restoring to checkpoint with deleted file → Show warning
- Creating checkpoint during streaming → Queue until stream complete
- Restoration fails → Show error, keep current state

---

## 2. Playbooks

### Overview
Reusable multi-step workflows that encode "how we work" patterns into executable templates.

### User Stories
- **As a user**, I want to run a weekly review routine without typing the same prompts each time.
- **As a user**, I want to customize playbooks to match my specific workflow.
- **As a user**, I want the assistant to suggest relevant playbooks based on context.

### Functional Requirements

#### FR-1: Playbook Library
- Display built-in playbooks (3 default)
- Allow user-created custom playbooks
- Show: name, description, step count, estimated time
- Filter by category: Planning, Research, Review, Custom

#### FR-2: Playbook Execution
- User clicks "Run Playbook"
- Each step executes sequentially
- Show progress: "Step 2 of 4"
- User can pause, edit, or cancel mid-execution
- On completion: show summary and celebrate

#### FR-3: Playbook Creation
- User clicks "Create Playbook"
- Wizard: Name → Category → Add Steps → Review
- Each step: prompt template + optional wait for response
- Save to library for future use

#### FR-4: Playbook Customization
- Fork existing playbook
- Edit steps, reorder, add/remove
- Save as new playbook
- Share playbooks (future: community library)

#### FR-5: Contextual Suggestions
- Detect user intent from conversation
- Suggest relevant playbook: "Want to run [playbook name]?"
- Inline suggestion in chat
- One-click to start

### Non-Functional Requirements

#### NFR-1: Performance
- Playbook list render: < 100ms
- Step execution: immediate
- Step transition: < 50ms animation

#### NFR-2: Reliability
- Save playbook state on each step
- Resume from last step on cancel
- Atomic playbook operations

### UI Components

#### Playbook Card
```tsx
<Card>
  <Icon category={playbook.category} />
  <Title>{playbook.name}</Title>
  <Description>{playbook.description}</Description>
  <Meta>{playbook.steps.length} steps · {playbook.estimatedTime}</Meta>
  <Button onClick={runPlaybook}>Run Playbook</Button>
</Card>
```

#### Execution Progress
```tsx
<ProgressBar current={currentStep} total={totalSteps} />
<StepIndicator>
  Step {currentStep} of {totalSteps}: {stepName}
</StepIndicator>
<Button onClick={pause}>Pause</Button>
<Button onClick={cancel}>Cancel</Button>
```

### Data Model

```typescript
interface Playbook {
  id: string
  name: string
  description: string
  category: "planning" | "research" | "review" | "custom"
  steps: PlaybookStep[]
  estimatedTime: string // "5-10 min"
  createdBy: "system" | "user"
  usageCount: number
  lastUsed?: Date
}

interface PlaybookStep {
  id: string
  order: number
  name: string
  promptTemplate: string
  waitForResponse: boolean
  expectedOutputType?: "text" | "list" | "plan"
}
```

### Built-in Playbooks

#### Weekly Review
```yaml
name: Weekly Review
category: planning
steps:
  - name: Summarize Week
    prompt: "Summarize the key accomplishments and decisions from this week"
  - name: Identify Blockers
    prompt: "What blockers or challenges came up? Are any still unresolved?"
  - name: Plan Next Week
    prompt: "Based on this week, what should we focus on next week?"
  - name: Set Priorities
    prompt: "What are the top 3 priorities for next week?"
```

#### Project Kickoff
```yaml
name: Project Kickoff
category: planning
steps:
  - name: Define Goals
    prompt: "What are we trying to achieve with this project?"
  - name: Identify Constraints
    prompt: "What constraints do we need to work within? (time, budget, tech)"
  - name: Success Metrics
    prompt: "How will we measure success?"
  - name: First Steps
    prompt: "What are the first 3 concrete steps to start?"
```

---

## 3. Sub-Agents / Background Agents

### Overview
Parallel assistant instances that execute long-running tasks independently while the main conversation continues.

### User Stories
- **As a user**, I want to delegate research to a background agent so I can continue planning.
- **As a user**, I want to see progress of background tasks without switching context.
- **As a user**, I want to be notified when a background task completes.

### Functional Requirements

#### FR-1: Agent Spawning
- User delegates task explicitly: "Research this while I continue"
- System suggests: "This will take a while. Should I handle it in the background?"
- Maximum 3 concurrent sub-agents
- Each agent has: name, task description, progress indicator

#### FR-2: Progress Tracking
- Show agent status in Activity Feed
- Progress states: Starting → In Progress → Completing → Done
- Real-time updates (every 5s)
- Estimated time remaining

#### FR-3: Notifications
- Subtle badge on Activity Feed icon when agent completes
- Non-intrusive notification: "Research complete. View results?"
- User clicks to see full output
- Option to insert results into current conversation

#### FR-4: Agent Management
- View all active agents
- Pause/resume individual agents
- Cancel agent (with confirmation)
- View agent history

### Non-Functional Requirements

#### NFR-1: Performance
- Agent spawn: < 500ms
- Status updates: < 100ms
- Notification render: < 50ms

#### NFR-2: Concurrency
- Max 3 simultaneous agents per user
- Queue additional requests
- Prioritization: user-initiated > auto-suggested

### UI Components

#### Agent Card (in Activity Feed)
```tsx
<Card>
  <Icon type="sub-agent" />
  <Title>{agent.name}</Title>
  <Description>{agent.task}</Description>
  <ProgressBar value={agent.progress} />
  <Actions>
    <Button onClick={viewDetails}>View</Button>
    <Button onClick={cancel}>Cancel</Button>
  </Actions>
</Card>
```

#### Completion Notification
```tsx
<Toast>
  <CheckIcon />
  <Message>{agent.name} completed</Message>
  <Button onClick={viewResults}>View Results</Button>
</Toast>
```

### Data Model

```typescript
interface SubAgent {
  id: string
  name: string
  task: string
  status: "starting" | "in_progress" | "completing" | "done" | "failed"
  progress: number // 0-100
  startedAt: Date
  completedAt?: Date
  estimatedTimeRemaining?: number // seconds
  results?: any
  error?: string
}
```

---

## 4. Quick Actions Bar

### Overview
Contextual one-click actions displayed above the input to reduce typing and cognitive load.

### User Stories
- **As a user**, I want quick access to common prompts without typing them each time.
- **As a user**, I want action suggestions that adapt to what I'm currently doing.
- **As a user**, I want to customize which actions appear.

### Functional Requirements

#### FR-1: Action Display
- Show 6 most relevant actions in horizontal bar
- Actions above input area, below any expanded panels
- Scrollable on mobile if needed
- Icon + label for each action

#### FR-2: Action Execution
- Click action → insert prompt template into input
- User can edit before submitting
- Does NOT auto-submit
- Focus moves to input after click

#### FR-3: Context Adaptation
- Default actions: Summarize, Plan, Review, Research, Follow-up, Brainstorm
- Context-aware: "Review Code" appears when code shared
- "Summarize Meeting" when calendar integration active
- "Continue" appears after assistant pause

#### FR-4: Customization
- User can add custom actions
- Reorder actions (drag-and-drop)
- Hide/show specific actions
- Reset to defaults

### Non-Functional Requirements

#### NFR-1: Performance
- Action bar render: < 50ms
- Click-to-insert: < 20ms
- No janky animations

### UI Components

#### Quick Action Button
```tsx
<button
  onClick={() => insertPrompt(action.template)}
  className="quick-action"
>
  {action.icon}
  <span>{action.label}</span>
</button>
```

### Data Model

```typescript
interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  promptTemplate: string
  contextTriggers?: string[] // Keywords that make this action relevant
  order: number
  enabled: boolean
  isCustom: boolean
}
```

### Default Actions

```typescript
const DEFAULT_ACTIONS: QuickAction[] = [
  {
    id: "summarize",
    label: "Summarize",
    icon: <FileText />,
    promptTemplate: "Summarize the key points from our conversation so far",
  },
  {
    id: "plan",
    label: "Plan",
    icon: <Target />,
    promptTemplate: "Help me create a plan for",
  },
  {
    id: "review",
    label: "Review",
    icon: <Search />,
    promptTemplate: "Review and provide feedback on",
  },
  // ... more actions
]
```

---

## 5. Memory Panel

### Overview
Transparent, editable interface showing everything the assistant remembers about the user and current session.

### User Stories
- **As a user**, I want to see what the assistant remembers about me so I can correct mistakes.
- **As a user**, I want to understand what context is being used in responses.
- **As a user**, I want to remove outdated or incorrect information.

### Functional Requirements

#### FR-1: Memory Display
- Categorized view: Preferences, About You, How You Work, Session Context
- Each memory item shows: text, source, last used
- Recently used items highlighted
- Filter by category

#### FR-2: Memory Editing
- Click edit icon → inline edit
- Save changes with checkmark
- Cancel with X
- Confirmation for edits: "Memory updated"

#### FR-3: Memory Deletion
- Click delete icon → confirmation modal
- "Delete this memory? This cannot be undone."
- On confirm: remove with fade-out animation
- Toast: "Memory deleted"

#### FR-4: Memory Addition
- "Add Memory" button at bottom
- Modal: category selector + text input
- Auto-categorize based on content
- Save with success message

#### FR-5: Memory Attribution
- Show source: "You told me..." vs "I inferred..."
- Confidence indicator for inferred memories
- User can mark inference as incorrect

### Non-Functional Requirements

#### NFR-1: Performance
- Panel render: < 100ms
- Edit save: < 200ms
- Search/filter: < 50ms

#### NFR-2: Privacy
- Memory stored encrypted
- Option to export all memory
- One-click "Clear all memory"

### UI Components

#### Memory Item
```tsx
<MemoryItem>
  <Category badge={memory.category} />
  <Text>{memory.text}</Text>
  <Meta>
    <Source>{memory.source}</Source>
    {memory.lastUsed && <LastUsed>{memory.lastUsed}</LastUsed>}
  </Meta>
  <Actions>
    <IconButton onClick={edit}><Edit /></IconButton>
    <IconButton onClick={delete}><Trash /></IconButton>
  </Actions>
</MemoryItem>
```

### Data Model

```typescript
interface Memory {
  id: string
  category: "preferences" | "about_you" | "how_you_work" | "session"
  text: string
  source: "user" | "inferred"
  confidence?: number // 0-1 for inferred
  createdAt: Date
  lastUsed?: Date
  usageCount: number
}
```

---

## 6. Onboarding Flow

### Overview
Four-step wizard that personalizes the assistant and sets expectations for the working relationship.

### User Stories
- **As a new user**, I want to understand how to use the assistant effectively.
- **As a new user**, I want to customize the experience to match my needs.
- **As a new user**, I want to feel welcomed and excited to start.

### Functional Requirements

#### FR-1: Step 1 - Naming
- "What should I call you?"
- Text input for user's preferred name
- "What would you like to call me?"
- Text input for assistant name (default: "Assistant")
- Warm, friendly copy

#### FR-2: Step 2 - About You
- "What's your role?" (dropdown + custom)
- "What are you working on?" (free text)
- "What brings you here today?" (optional)

#### FR-3: Step 3 - How We'll Work
- Choose collaboration mode:
  - **Lead**: I'll take initiative and suggest next steps
  - **Collaborate**: We'll work together, back and forth
  - **Assist**: You lead, I'll help when asked
- Visual cards for each mode
- Can change later in settings

#### FR-4: Step 4 - Quick Tour
- Highlight key features (30 seconds)
- Memory Panel, Quick Actions, Playbooks
- Skip button available
- "Let's Get Started" CTA

#### FR-5: Completion
- Save all inputs to Memory
- Create welcome message personalized to user
- Confetti animation 🎉
- Redirect to main chat

### Non-Functional Requirements

#### NFR-1: Experience
- Total time: 2-3 minutes
- Skippable at any point
- Can revisit from settings
- Mobile-optimized

### UI Components

#### Onboarding Step
```tsx
<OnboardingStep current={step} total={4}>
  <Title>{step.title}</Title>
  <Description>{step.description}</Description>
  <Content>{step.content}</Content>
  <Navigation>
    {step > 1 && <Button onClick={back}>Back</Button>}
    <Button onClick={next}>Next</Button>
  </Navigation>
  <ProgressDots current={step} total={4} />
</OnboardingStep>
```

---

## 7. Activity Feed

### Overview
Live log displaying what the assistant is currently doing, has done recently, and has scheduled for the future.

### User Stories
- **As a user**, I want to see what the assistant is working on right now.
- **As a user**, I want a history of completed work to reference later.
- **As a user**, I want visibility into scheduled tasks.

### Functional Requirements

#### FR-1: Activity Types
- 🤔 **Thinking**: Deep reasoning or planning
- 🔍 **Searching**: Looking up information
- ✍️ **Writing**: Generating content
- ✅ **Completed**: Task finished
- ⏰ **Scheduled**: Upcoming task

#### FR-2: Real-Time Updates
- Live updates for active tasks
- Progress indicators where applicable
- Streaming status changes
- Auto-scroll to latest

#### FR-3: Activity History
- Show last 50 activities
- Grouped by time: Today, Yesterday, Earlier
- Click activity to see details
- Filter by type

#### FR-4: Scheduled Tasks
- Separate tab for scheduled work
- Show: task name, schedule, next run time
- Enable/disable toggle per task
- Add new scheduled task

### UI Components

#### Activity Item
```tsx
<ActivityItem type={activity.type}>
  <Icon type={activity.type} />
  <Content>
    <Title>{activity.title}</Title>
    <Description>{activity.description}</Description>
    <Timestamp>{activity.timestamp}</Timestamp>
  </Content>
  {activity.status === "in_progress" && (
    <ProgressIndicator />
  )}
</ActivityItem>
```

### Data Model

```typescript
interface ActivityItem {
  id: string
  type: "thinking" | "searching" | "writing" | "completed" | "scheduled"
  title: string
  description: string
  status: "pending" | "in_progress" | "completed" | "failed"
  timestamp: Date
  duration?: number
  relatedTo?: string // Message ID or task ID
}
```

---

## 8. Cron Jobs / Scheduled Tasks

### Overview
Recurring or delayed tasks that the assistant performs automatically, presented as "ongoing responsibilities."

### User Stories
- **As a user**, I want a daily morning briefing without having to ask each day.
- **As a user**, I want to be reminded to do weekly reviews.
- **As a user**, I want control over when and if scheduled tasks run.

### Functional Requirements

#### FR-1: Task Scheduling
- User creates scheduled task
- Choose: frequency (daily, weekly, custom)
- Choose: time of day
- Choose: task type (briefing, reminder, summary)

#### FR-2: Task Execution
- Task triggers at scheduled time
- Appears in Activity Feed
- Non-intrusive notification
- Results available on demand

#### FR-3: Task Management
- List all scheduled tasks
- Enable/disable individual tasks
- Edit schedule
- Delete task (with confirmation)

#### FR-4: Default Tasks
- Offer common templates:
  - Morning briefing (9 AM daily)
  - Weekly review (Friday 5 PM)
  - End-of-day summary (6 PM daily)

### Data Model

```typescript
interface ScheduledTask {
  id: string
  name: string
  description: string
  schedule: string // cron format
  nextRun: Date
  enabled: boolean
  taskType: "briefing" | "reminder" | "summary" | "custom"
  createdBy: "user" | "system"
  lastRun?: Date
}
```

---

## Cross-Feature Integration

### Memory + Playbooks
When playbook runs, key outputs are saved to Session Context memory.

### Checkpoints + Sub-Agents
Checkpoint saves state of all active sub-agents. Restoration cancels current agents and doesn't restore old ones.

### Activity Feed + Everything
All features log to Activity Feed for transparency.

### Quick Actions + Playbooks
Quick actions can trigger playbooks: "🎯 Plan" → suggests "Project Kickoff" playbook

---

## Testing Scenarios

### Scenario 1: New User Journey
1. Land on app → Onboarding appears
2. Complete 4 steps → Memory populated
3. See welcome message with name
4. Quick Actions suggested based on role
5. Try first playbook

### Scenario 2: Power User Flow
1. Open Memory Panel → verify context
2. Create manual checkpoint before big decision
3. Run playbook for weekly review
4. Spawn sub-agent for research
5. Continue main conversation
6. Sub-agent completes → notification
7. Restore checkpoint to try alternate approach

### Scenario 3: Daily Routine
1. Morning: scheduled briefing triggers
2. Click notification → read summary
3. Use Quick Action: "🎯 Plan day"
4. Memory shows today's focus
5. Evening: scheduled summary triggers
6. Review progress in Activity Feed

---

## References

- [CORE_FEATURES.md](/docs/CORE_FEATURES.md) - Feature overview
- [IMPLEMENTATION_GUIDE.md](/docs/IMPLEMENTATION_GUIDE.md) - Technical implementation
- [COLLABORATION_UX.md](/docs/COLLABORATION_UX.md) - UX patterns for collaborative feel
