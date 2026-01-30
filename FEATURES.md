# Co-Working Assistant Features

This document outlines the features implemented in the Chat UI with Vibration project, designed as a collaborative workspace with an intelligent partner.

## Guiding Principle

This product should feel like a **shared workspace with an intelligent partner**. The UI emphasizes visibility, trust, and collaboration rather than raw execution or code output.

---

## Implemented Features

### 1. Onboarding Flow

**Purpose:** First-run experience to personalize the assistant and set expectations.

**Location:** Appears automatically on first load

**Features:**
- **Step 1: Name Your Assistant** - Personalize your working relationship
- **Step 2: About You** - Share your role and context
- **Step 3: Primary Use** - Define how you'll work together
- **Step 4: Collaboration Mode** - Choose autonomy level (Lead/Collaborate/Assist)
- Optional memory toggle for privacy

**User Flow:**
1. User opens app for the first time
2. Onboarding modal appears with progress bar
3. Responses are stored in Memory Panel for future reference
4. User can skip or complete all steps

---

### 2. Quick Actions Bar

**Purpose:** One-click actions to reduce typing and cognitive load.

**Location:** Above the chat input area

**Available Actions:**
- **Summarize** - "Summarize the conversation so far"
- **Plan** - "Help me create a plan for..."
- **Review** - "Review what we've discussed and suggest next steps"
- **Research** - "Research this topic in depth"
- **Follow-up** - "What should we work on next?"
- **Brainstorm** - "Let's brainstorm ideas for..."

**How It Works:**
- Click any action chip
- Prompt is inserted into input area
- User can edit before sending
- Maintains focus on input for seamless editing

---

### 3. Memory Panel

**Purpose:** Transparent, editable view of what the assistant remembers.

**Location:** Expandable panel from input area (Brain icon button)

**Categories:**
- **Preferences** - Communication style, work habits
- **About You** - Role, expertise, background
- **How You Work** - Processes, preferences, patterns
- **Session Context** - Current task-specific information

**Features:**
- Filter by category using chips
- Edit any memory inline (click pencil icon)
- Delete memories (click trash icon)
- See source (user-added vs AI-learned)
- Visual badges show memory type

**User Flow:**
1. Click Brain icon in input controls
2. Panel expands upward showing memories
3. Filter by category or view all
4. Edit/delete as needed
5. Click outside or Brain icon again to close

---

### 4. Task Panel

**Purpose:** Lightweight task management tied to conversation.

**Location:** Expandable panel from input area (List icon button)

**Features:**
- Add tasks manually or AI-generated
- Check off completed tasks
- Edit task text inline
- Delete tasks
- Progress indicator shows completion ratio (e.g., "2/5")

**User Flow:**
1. Click List icon to expand
2. Type task and press Enter to add
3. Click checkbox to mark complete
4. Click pencil to edit, trash to delete
5. Panel stays open until manually closed

---

### 5. Playbooks Panel

**Purpose:** Reusable workflows for common tasks - "how we work" templates.

**Location:** Expandable panel from input area (Book icon button)

**Built-in Playbooks:**
- **Weekly Review** - Reflect on progress and plan ahead
- **Project Kickoff** - Structure new project planning
- **Deep Research** - Systematic topic exploration

**Features:**
- Color-coded categories (Review/Planning/Research)
- View playbook steps before running
- Create custom playbooks with multiple steps
- Run playbook inserts all steps as prompts
- Delete custom playbooks

**Creating Custom Playbooks:**
1. Click "Create Playbook" button
2. Enter name and select category
3. Add steps (prompts/instructions)
4. Save - appears in playbooks list
5. Run anytime to execute workflow

---

### 6. Checkpoints Panel

**Purpose:** Visual timeline as a safety net for decisions and outputs.

**Location:** Expandable panel from input area (Clock icon button)

**Features:**
- **Auto-checkpoints** - Created every 5 messages
- **Manual checkpoints** - Save anytime with "Save Now" button
- Timeline visualization with timestamps
- One-click restore to any checkpoint
- Confirmation before restoring
- Visual badges (Auto/Manual save indicators)

**How Checkpoints Work:**
1. System auto-saves every 5 messages
2. User can manually save important moments
3. Click any checkpoint to preview details
4. Click "Restore" to return to that state
5. Confirmation prevents accidental resets

**Use Cases:**
- Before making major decisions
- After completing a section of work
- When trying experimental approaches
- Before changing direction

---

### 7. Activity Sidebar

**Purpose:** Live log showing what the assistant is doing - visibility and trust.

**Location:** Slides in from right side (Activity button in header)

**Sections:**

#### Activity Feed
Real-time log of agent actions with:
- Status icons (thinking, search, writing, completed)
- Timestamps (relative: "2m ago" or absolute)
- Activity descriptions
- Click for details (future: expanded view)

#### Scheduled Tasks
Ongoing responsibilities presented transparently:
- Task name and frequency
- Next run time
- Enable/disable toggles
- Add new scheduled tasks

**Activity Types:**
- 🤔 Thinking through approach
- 🔍 Searching for information
- ✍️ Writing response
- ✅ Completed task
- 📊 Analyzing data

**User Flow:**
1. Click Activity icon in header (badge shows count)
2. Sidebar slides in from right
3. See real-time updates as agent works
4. Manage scheduled tasks
5. Click outside or X to close

---

### 8. Collaboration Mode Toggle

**Purpose:** Control how autonomous the assistant should be.

**Location:** Input area, top-right corner

**Modes:**
- **Lead** (🎯) - Assistant autonomous, makes decisions
- **Collaborate** (🤝) - Back-and-forth, partnership approach
- **Assist** (💡) - User drives, assistant advises

**Behavior Changes:**
- **Lead Mode:** Assistant proposes plans and executes
- **Collaborate Mode:** Assistant suggests, waits for approval
- **Assist Mode:** Assistant responds to requests, minimal initiative

**Visual Indicators:**
- Selected mode highlighted in orange
- Icon reflects current relationship style
- Persists across session

---

## Technical Implementation

### State Management

All features use local React state in `chat-interface.tsx`:
```typescript
- memories: Memory[] - Persistent context
- tasks: Task[] - Task list items
- playbooks: Playbook[] - Workflow templates
- checkpoints: Checkpoint[] - Timeline saves
- activities: Activity[] - Real-time feed
- scheduledTasks: ScheduledTask[] - Cron jobs
```

### Panel System

All panels follow consistent patterns:
- Expand from input area (not blocking)
- Exclusive expansion (one panel at a time)
- Click outside to close
- Smooth animations (max-height transitions)
- Mobile-responsive (bottom-sheet on mobile)

### Data Persistence

Currently in-memory (resets on refresh). Future enhancement:
- LocalStorage for client-side persistence
- Database sync for cross-device
- Export/import functionality

---

## Future Features

### Phase 2: Enhanced Collaboration

#### Artifacts Panel
**Purpose:** Persistent workspace for outputs

**Features:**
- Dedicated space for plans, summaries, documents
- Organize by type (Plan/Summary/Code/Document)
- Pin important artifacts
- Edit inline with version history
- Export to files
- Link artifacts to conversations

**Location:** Sidebar accessible from header

---

#### Handoffs & Escalation
**Purpose:** Surface when sub-agents need input

**Features:**
- Notification badge when agent stuck
- Modal showing: progress, blocker, context
- Actions: "Give Input", "Take Over", "Cancel Task"
- Makes background work collaborative

**Trigger:** Sub-agent encounters uncertainty or needs approval

---

#### Session vs Persistent Context
**Purpose:** Distinguish temporary from permanent memory

**Current:** All in Memory Panel
**Enhancement:**
- Session Context (green badge) - Current task, cleared on new chat
- Persistent Memory (blue badge) - Long-term preferences
- One-click promote: Session → Persistent
- Clear session without losing persistent data

---

#### Feedback Loop
**Purpose:** Learn from corrections in real-time

**Features:**
- Toast appears on correction: "Update preference?"
- Options: "Yes, always" / "Just this time" / "Never ask"
- Stores in Memory Panel under "How I Work"
- Applied to future responses automatically

**Example:**
User: "No, summarize like this: bullet points, max 5 items"
Assistant: [Toast] "Remember this preference for summaries?"

---

### Phase 3: Advanced Features

#### Conversation History Search
**Purpose:** Find past discussions easily

**Features:**
- Full-text search across all chats
- Filter by date, topic, artifacts created
- Tag conversations
- Summarize long conversations
- Export conversation threads

---

#### Projects / Workspaces
**Purpose:** Organize chats by context

**Features:**
- Create projects with scoped context
- Upload reference files per project
- Project-specific playbooks and memories
- Switch between projects seamlessly
- Cross-project search

---

#### Knowledge Base
**Purpose:** Index and search codebase/docs

**Features:**
- Connect to GitHub repos
- Upload documentation folders
- Semantic search across files
- Auto-answer from knowledge base
- Update knowledge on file changes

---

#### Multi-Modal Inputs
**Purpose:** Expand beyond text

**Features:**
- Voice input with transcription
- Screen recording for context
- PDF/document parsing
- Whiteboard/diagram uploads
- Video summaries

---

#### Agent Analytics
**Purpose:** Understand how you work together

**Features:**
- Session insights (time spent, topics covered)
- Token usage tracking
- Task completion rates
- Most-used playbooks
- Collaboration patterns over time

---

#### Background Parallel Agents
**Purpose:** True multitasking

**Features:**
- Up to 8 agents in parallel
- Each with isolated context
- Queue system for pending work
- Merge results from multiple agents
- Priority levels

---

## Design Principles

### 1. Visibility Over Magic
Every action the assistant takes should be visible in the Activity Feed. No silent background work.

### 2. Trust Through Control
Users can edit memories, restore checkpoints, disable automations. Control builds trust.

### 3. Collaboration, Not Commands
UI language emphasizes partnership: "Let's plan", "We're working on", not "Execute task".

### 4. Progressive Disclosure
Advanced features hidden until needed. Onboarding is optional, panels collapsible.

### 5. Respectful of Attention
Notifications are minimal. Activity badge is informative, not alarming. Work happens in context.

---

## File Structure

```
/components
  /chat
    - chat-interface.tsx         # Main orchestrator
    - input-area.tsx             # Input + all panels
    - task-panel.tsx             # Task management
    - memory-panel.tsx           # Context memory
    - playbooks-panel.tsx        # Workflow templates
    - checkpoints-panel.tsx      # Timeline saves
    - activity-sidebar.tsx       # Activity + scheduled tasks
    - activity-feed.tsx          # Feed component
    - quick-actions.tsx          # Action chips
    - collaboration-mode.tsx     # Mode toggle
    - chat-header.tsx            # Header with activity button
  /onboarding
    - onboarding-modal.tsx       # First-run flow
  /tools
    - tools-modal-content.tsx    # MCP tools config
  /settings
    - settings-modal-content.tsx # Agent settings
```

---

## Contributing

When adding new features:

1. **Follow the Co-Working Model** - Does it feel collaborative?
2. **Add to Activity Feed** - Make work visible
3. **Support Checkpoints** - Can users undo this?
4. **Document in Memory** - Should preferences be stored?
5. **Test Mobile** - Does it work on small screens?

---

## Questions or Feedback

This is a living document. As features evolve, this documentation will be updated to reflect the current state and future vision.
