# Core Features: Shared Workspace Design

> **Guiding Principle**: This product should feel like a shared workspace with an intelligent partner. The UI should emphasize visibility, trust, and collaboration rather than raw execution or code output.

## Overview

The assistant is designed as a **co-working partner**, not a command-line tool. Every feature reinforces the feeling that you're working *with* someone, not issuing commands *to* something.

---

## Feature Categories

### 🛡️ Safety & Trust
Features that build confidence through transparency and reversibility.

- **Checkpoints** - Visual timeline of conversation states
- **Memory Panel** - Transparent view of what the assistant remembers
- **Activity Feed** - Live log of what's happening

### ⚡ Efficiency & Flow
Features that reduce friction and cognitive load.

- **Quick Actions Bar** - One-click common tasks
- **Playbooks** - Reusable workflows for repeated patterns
- **Sub-Agents** - Parallel background tasks

### 🤝 Onboarding & Alignment
Features that establish working relationship and expectations.

- **Onboarding Flow** - First-run setup and personalization
- **Cron Jobs / Scheduled Tasks** - Ongoing responsibilities

---

## Core Features

### 1. Checkpoints

**Purpose**: Acts as a safety net for decisions, plans, and agent outputs.

**What it does**:
- Automatically saves conversation states at key moments
- Creates a visual timeline users can browse
- Allows instant restore to any previous state
- Shows what changed between checkpoints

**UX Principles**:
- Always visible but never intrusive
- Auto-save is silent; manual saves are celebrated
- Restore requires confirmation to prevent accidents
- Timeline shows context, not just timestamps

**States**:
- Auto checkpoint (every 5 messages)
- Manual checkpoint (user-created)
- Milestone checkpoint (major decisions)

**Visual Design**:
```
Timeline View:
┌─────────────────────────────────┐
│ ● Now                           │
│ ├─ Manual: "Before refactor"    │
│ ├─ Auto: 3 messages ago         │
│ ├─ Milestone: "Decided on arch" │
│ └─ Auto: 12 messages ago        │
└─────────────────────────────────┘
```

---

### 2. Playbooks

**Purpose**: Reusable workflows for common tasks. Think "how we work," not scripts.

**What it does**:
- Stores multi-step workflows as templates
- Suggests relevant playbooks based on context
- Allows customization and forking
- Tracks which playbooks are used most

**UX Principles**:
- Playbooks are presented as "routines" not "automations"
- Each step is explained before execution
- Users can pause and edit mid-playbook
- Success shows completion celebration

**Built-in Playbooks**:
1. **Weekly Review** - Summarize week, identify blockers, plan ahead
2. **Project Kickoff** - Define goals, constraints, success metrics
3. **Deep Research** - Multi-source investigation with synthesis

**Visual Design**:
```
Playbook Card:
┌──────────────────────────────┐
│ 📋 Weekly Review              │
│ 4 steps · 5-10 min           │
│                              │
│ 1. Summarize this week       │
│ 2. Identify blockers         │
│ 3. Plan next week            │
│ 4. Set priorities            │
│                              │
│ [Run Playbook]               │
└──────────────────────────────┘
```

---

### 3. Sub-Agents / Background Agents

**Purpose**: Parallel assistants that run tasks in the background without interrupting main flow.

**What it does**:
- Spawns independent agents for long-running tasks
- Shows progress in Activity Feed
- Notifies when complete or needs input
- Can run up to 3 concurrent sub-agents

**UX Principles**:
- Sub-agents are "delegated tasks" not "background threads"
- Clear handoff: "I'll handle this while you continue"
- Progress is always visible
- Completion prompts a gentle notification, not interruption

**Use Cases**:
- Research while planning
- Code review while writing
- Data analysis while brainstorming

**Visual Design**:
```
Activity Feed:
┌────────────────────────────────┐
│ 🔄 Research Agent              │
│ Analyzing 5 sources...         │
│ [View Progress] [Cancel]       │
└────────────────────────────────┘
```

---

### 4. Quick Actions Bar

**Purpose**: One-click actions near the input to reduce typing and cognitive load.

**What it does**:
- Shows 6 most relevant actions based on context
- Inserts prompt template into input
- Updates based on conversation state
- Allows customization of action library

**UX Principles**:
- Actions feel like suggestions, not commands
- Clicking inserts text, doesn't auto-submit
- User can edit before sending
- Actions adapt to context (e.g., "Review Code" appears when code is shared)

**Default Actions**:
- 📝 Summarize
- 🎯 Plan
- 🔍 Review
- 🔬 Research
- ↩️ Follow-up
- 💡 Brainstorm

**Visual Design**:
```
Quick Actions (above input):
┌─────────────────────────────────────┐
│ [📝 Summarize] [🎯 Plan] [🔍 Review]│
│ [🔬 Research] [↩️ Follow-up] [💡]   │
└─────────────────────────────────────┘
```

---

### 5. Memory Panel

**Purpose**: Transparent, editable view of what the assistant remembers and is using for context.

**What it does**:
- Shows all stored context about user and session
- Allows inline editing and deletion
- Categorizes memory (Preferences, About You, How You Work, Session)
- Highlights recently used context

**UX Principles**:
- Memory is never hidden or mysterious
- Users can correct mistakes immediately
- Recently accessed memory is highlighted
- Source attribution (user-provided vs AI-inferred)

**Categories**:
1. **Preferences** - UI settings, response style
2. **About You** - Role, goals, background
3. **How You Work** - Patterns, routines, preferences
4. **Session Context** - Current project, active tasks

**Visual Design**:
```
Memory Panel:
┌──────────────────────────────┐
│ 🧠 What I Remember           │
│                              │
│ [Preferences] [About You]    │
│ [How You Work] [Session]     │
│                              │
│ Preferences:                 │
│ • Concise responses ✏️ 🗑️    │
│ • Dark mode ✏️ 🗑️            │
│                              │
│ About You:                   │
│ • Senior designer ✏️ 🗑️      │
│ • Working on chat UI ✏️ 🗑️   │
└──────────────────────────────┘
```

---

### 6. Onboarding Flow

**Purpose**: First-run experience to set expectations, define assistant's role, and align on working style.

**What it does**:
- 4-step wizard to personalize assistant
- Collects: name, user role, primary use case, collaboration mode
- Sets initial memory and preferences
- Explains key features with examples

**UX Principles**:
- Feels like meeting a new colleague
- Skippable but recommended
- Can be re-run from settings
- Warm, conversational tone

**Steps**:
1. **Name Your Assistant** - "What should I call you? How should you address me?"
2. **Tell Me About You** - Role, goals, what you're working on
3. **How We'll Work Together** - Collaboration mode (Lead/Collaborate/Assist)
4. **Let's Get Started** - Quick tour of key features

**Visual Design**:
```
Onboarding Step 2/4:
┌──────────────────────────────┐
│      Tell Me About You       │
│                              │
│ What's your role?            │
│ [________________]           │
│                              │
│ What are you working on?     │
│ [________________]           │
│                              │
│ ●●○○                         │
│ [Back] [Next]                │
└──────────────────────────────┘
```

---

### 7. Activity Feed

**Purpose**: Live log showing what the assistant is doing, has done, or has scheduled, so work feels visible and collaborative.

**What it does**:
- Real-time updates on assistant activity
- Shows background tasks, scheduled jobs, completed work
- Allows drill-down into task details
- Filterable by type (thinking, searching, writing, scheduled)

**UX Principles**:
- Activity is presented as "work in progress" not "system logs"
- Each entry has context and purpose
- Recent activity is emphasized
- Completed work shows celebration

**Activity Types**:
- 🤔 Thinking - Processing complex reasoning
- 🔍 Searching - Looking up information
- ✍️ Writing - Generating content
- ✅ Completed - Task finished
- ⏰ Scheduled - Upcoming task

**Visual Design**:
```
Activity Feed (Modal):
┌──────────────────────────────┐
│ Activity                     │
│                              │
│ 🤔 Deep thinking...          │
│ 2 minutes ago                │
│                              │
│ ✅ Research completed        │
│ 5 minutes ago                │
│                              │
│ ⏰ Daily summary             │
│ Due in 3 hours               │
└──────────────────────────────┘
```

---

### 8. Cron Jobs / Scheduled Tasks

**Purpose**: Optional recurring or delayed actions (check-ins, summaries, reminders), presented as "ongoing responsibilities."

**What it does**:
- Schedules recurring tasks (daily, weekly)
- Shows upcoming scheduled work
- Allows enable/disable per task
- Executes tasks and notifies user

**UX Principles**:
- Tasks are "responsibilities" not "automations"
- User is always in control (can disable anytime)
- Scheduled work respects user's focus
- Results are non-intrusive notifications

**Common Scheduled Tasks**:
- Daily morning briefing
- Weekly review reminder
- End-of-day summary
- Check-in after long absence

**Visual Design**:
```
Scheduled Tasks:
┌──────────────────────────────┐
│ ⏰ Scheduled Tasks            │
│                              │
│ Daily Morning Briefing       │
│ Every day at 9:00 AM         │
│ [●] Enabled                  │
│                              │
│ Weekly Review                │
│ Every Friday at 5:00 PM      │
│ [○] Disabled                 │
└──────────────────────────────┘
```

---

## Feature Interactions

### How Features Work Together

**Scenario 1: Starting a New Project**
1. User clicks Quick Action: "🎯 Plan"
2. Assistant suggests "Project Kickoff" playbook
3. Playbook runs, creating automatic checkpoint
4. Session context added to Memory Panel
5. Activity Feed shows progress
6. Completion triggers confetti 🎉

**Scenario 2: Research Task**
1. User asks complex research question
2. Assistant spawns Sub-Agent for research
3. Main conversation continues
4. Activity Feed shows research progress
5. Completion notification appears
6. Results added to Memory (Session Context)

**Scenario 3: Daily Routine**
1. Scheduled Task: "Morning Briefing" triggers
2. Notification appears in Activity Feed
3. User clicks to view briefing
4. Assistant summarizes yesterday's progress
5. Checkpoint created automatically
6. Memory updated with today's focus

---

## Design Principles

### Visibility
Every action the assistant takes should be visible and explained.

- Show thinking process
- Display background tasks
- Surface scheduled work
- Highlight memory usage

### Trust
Users should always feel in control and able to correct course.

- Checkpoints provide safety net
- Memory is editable
- Sub-agents can be cancelled
- Scheduled tasks can be disabled

### Collaboration
The UI should reinforce the feeling of working *with* someone.

- Use collaborative language ("Let's...", "We should...")
- Show assistant's "work in progress"
- Celebrate shared accomplishments
- Respect user's focus and time

### Progressive Disclosure
Power features are hidden until needed.

- Panels collapse when not in use
- Advanced options appear on hover
- Complexity grows with user sophistication
- Defaults are sensible for 80% of users

---

## Implementation Status

| Feature | Status | Component Location |
|---------|--------|-------------------|
| Checkpoints | ✅ Implemented | `/components/chat/checkpoints-panel.tsx` |
| Playbooks | ✅ Implemented | `/components/chat/playbooks-panel.tsx` |
| Sub-Agents | ⚠️ UI Only | `/components/chat/activity-modal-content.tsx` |
| Quick Actions | ✅ Implemented | `/components/chat/quick-actions.tsx` |
| Memory Panel | ✅ Implemented | `/components/chat/memory-panel.tsx` |
| Onboarding | ✅ Implemented | `/components/onboarding/onboarding-modal.tsx` |
| Activity Feed | ✅ Implemented | `/components/chat/activity-modal-content.tsx` |
| Scheduled Tasks | ⚠️ UI Only | `/components/chat/activity-modal-content.tsx` |

**Legend**:
- ✅ Fully implemented with working logic
- ⚠️ UI implemented, backend logic pending
- ❌ Not yet implemented

---

## Next Steps

### Phase 1: Backend Integration
- Connect sub-agents to actual parallel execution
- Implement scheduled task execution
- Add checkpoint restoration logic
- Persist memory across sessions

### Phase 2: Intelligence
- Context-aware quick action suggestions
- Automatic playbook recommendations
- Smart checkpoint creation (detect milestones)
- Proactive memory updates

### Phase 3: Personalization
- Learn user patterns for better suggestions
- Customize quick actions based on usage
- Generate personalized playbooks
- Adaptive collaboration mode

---

## References

- [DESIGN_PHILOSOPHY.md](/docs/DESIGN_PHILOSOPHY.md) - Core design principles
- [GAMIFICATION.md](/docs/GAMIFICATION.md) - Celebratory moments
- [PROGRESSIVE_DISCLOSURE.md](/docs/PROGRESSIVE_DISCLOSURE.md) - Complexity management
- [ROADMAP.md](/docs/ROADMAP.md) - Development timeline
