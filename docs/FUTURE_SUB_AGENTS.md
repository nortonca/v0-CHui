# Future Feature: Sub-Agents & Workflow Automation

> **Status**: 📋 Planned  
> **Inspiration**: DO/ER-AI architecture  
> **Priority**: Phase 3 (Advanced Features)

---

## Overview

Transform the assistant from a single conversational agent into a **multi-agent orchestration system** where specialized sub-agents work autonomously on background tasks while keeping the user informed through live progress tracking and reasoning traces.

### Guiding Principle

**"From conversation to delegation"** - Users should be able to describe what they want automated, approve a plan, and then watch specialized agents execute tasks in the background with full visibility into their thinking process.

---

## System Architecture

### 1. Manager Agent (Main Conversational Interface)

**Role**: Orchestrates sub-agents, plans workflows, manages user communication

**Capabilities**:
- Natural language understanding of automation requests
- Breaks down complex requests into discrete workflows
- Assigns workflows to appropriate sub-agent types
- Manages approval flow with users
- Monitors all sub-agent progress

**Tools**:
- `set_todos` - Create initial task breakdown
- `update_todo` - Update task status
- `create_plan` - Generate workflow plan for approval
- `create_workflows` - Instantiate workflows with sub-agents
- `ask_clarification` - Request user input when needed
- `get_status` - Check sub-agent progress
- `add_todo` - Add new task to plan
- `clear_todos` - Reset task list

**UI Pattern**: Inline to-do list showing Manager's current thinking:
```
Understanding request...     ✓
Analyzing requirements...    ✓
Building plan...             ●
```

---

### 2. Browser Agent (Web Automation Specialist)

**Role**: Automates web interactions, monitoring, and data extraction

**Skills**:
- **Navigate** - Go to URLs, follow links, handle redirects
- **Click** - Interact with buttons, links, dropdowns
- **Type** - Fill forms, search boxes, text fields
- **Screenshot** - Capture full page or specific elements
- **Scrape** - Extract structured data from pages
- **Search** - Find elements, text, or patterns

**Example Workflows**:
- Monitor competitor pricing daily at 9am
- Fill out recurring form submissions
- Screenshot dashboard for weekly reports
- Scrape product data from e-commerce sites
- Track changes to specific web pages

**Visual Indicator**: 🌐 Browser icon on workflow cards

---

### 3. Coder Agent (Code & Data Specialist)

**Role**: Handles code generation, data analysis, and automation scripts

**Skills**:
- **Write Code** - Generate scripts, functions, utilities
- **Debug** - Analyze and fix errors
- **Refactor** - Improve code structure
- **Analyze Data** - Process CSV, JSON, APIs
- **Generate Report** - Create summaries and visualizations

**Example Workflows**:
- Analyze sales CSV and generate weekly report
- Write automation script for file processing
- Debug failing API integration
- Refactor legacy code for performance
- Generate charts from database queries

**Visual Indicator**: `</>` Code icon on workflow cards

---

## UI/UX Design

### Chat View (Creating Workflows)

**Step 1: Request**
```
User: "Monitor our competitor's prices every morning and alert me if they drop below ours"

Manager: [Inline to-do appears]
✓ Understanding request
✓ Identifying data sources
● Building automation plan
```

**Step 2: Plan Preview**
```
┌─ Workflow Plan ─────────────────────────┐
│                                          │
│ 📋 Daily Price Monitoring                │
│                                          │
│ Workflows to create:                     │
│                                          │
│ 🌐 Scrape Competitor Prices             │
│    → Navigate to competitor site         │
│    → Extract pricing data                │
│    → Store in database                   │
│                                          │
│ </> Compare & Alert                      │
│    → Query our prices                    │
│    → Compare values                      │
│    → Send alert if threshold met         │
│                                          │
│ 🕐 Schedule: Daily at 9:00 AM            │
│                                          │
│ [Approve & Create]  [Modify]  [Cancel]   │
└──────────────────────────────────────────┘
```

**Step 3: Creation**
```
Manager: [To-do updates]
✓ Understanding request
✓ Identifying data sources
✓ Building automation plan
✓ Waiting for approval
● Creating workflows...
```

---

### Kanban Board View

Three-column layout showing workflow states:

```
┌─ To Do ────────┬─ In Progress ──────┬─ Done ──────────┐
│                │                    │                 │
│ 🌐 Scrape      │ </> Generate       │ 🌐 Monitor      │
│ Product Data   │ Sales Report       │ Dashboard ✓     │
│ Not started    │ ●●●○ 75%          │ Completed       │
│                │ "Analyzing data"   │ 2 hours ago     │
│ [▶ Start]      │ [⏸ Pause]         │                 │
│                │                    │                 │
│ 🌐 Fill Form   │ 🌐 Price Check     │ </> Backup      │
│ Not started    │ ●●○○ 50%          │ Script ✓        │
│ [▶ Start]      │ "Scraping page 2"  │ Completed       │
│                │ [⏸ Pause]         │ 1 day ago       │
│                │                    │                 │
└────────────────┴────────────────────┴─────────────────┘
```

**Card Components**:
- Agent type icon (🌐 or </>)
- Workflow name
- Progress indicator (●●●○)
- Current step description
- Action button (Start/Pause/Resume)
- Timestamp

---

### Workflow Detail View

Click any workflow card to see the detailed reasoning trace:

```
┌─ Scrape Product Data ──────────────────────────────────────────┐
│                                                                 │
│ Progress: ████████░░ 80%                                        │
│                                                                 │
├─ Left Panel ──────────────────┬─ Right Panel ──────────────────┤
│                               │                                │
│ 📋 Instruction                │ 💭 Live Reasoning Trace        │
│ Extract all product names,    │                                │
│ prices, and ratings from      │ [12:34:56]                     │
│ example.com/products          │ Thought: I need to navigate    │
│                               │ to the products page first     │
│ 🛠 Skills                     │                                │
│ • Navigate  • Scrape          │ [12:34:57]                     │
│ • Screenshot                  │ Action: Using navigate tool    │
│                               │ with URL: example.com/products │
│ 🤖 Agent                      │                                │
│ Browser Agent #3              │ [12:34:58]                     │
│                               │ Observation: Successfully      │
│ ✓ Steps                       │ loaded page. Found 48 product  │
│ ✓ Navigate to products page   │ listings.                      │
│ ✓ Wait for page load          │                                │
│ ● Extract product data        │ [12:34:59]                     │
│ ○ Validate data completeness  │ Thought: I should scrape all   │
│ ○ Save to database            │ product cards using CSS        │
│                               │ selector ".product-card"       │
│                               │                                │
│                               │ [12:35:00]                     │
│                               │ Action: Using scrape tool with │
│                               │ selector ".product-card"       │
│                               │                                │
│                               │ [12:35:02]                     │
│                               │ Observation: Extracted 48      │
│                               │ products. Sample: {"name":     │
│                               │ "Widget A", "price": "$29.99"} │
│                               │                                │
└───────────────────────────────┴────────────────────────────────┘
```

**Reasoning Trace Color Coding**:
- 💭 **Thought** (Blue) - Agent's internal reasoning
- ⚡ **Action** (Purple) - Tool being executed
- 👁 **Observation** (Green) - Result from action

---

### Voice Input Pattern

**Mobile-First Design** (not full-screen takeover):

```
┌─ Chat Input ────────────────────────────────────┐
│                                                 │
│  Type or speak...                      [🎤]    │
│                                         ◉      │
│                                     ◉       ◉  │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Interaction Flow**:
1. Tap mic icon → Recording starts with ripple animation
2. Transcript appears in real-time as you speak
3. Tap mic again → Recording stops and sends
4. Works inline with text input (not modal)

---

## Technical Implementation

### Data Models

```typescript
// Manager Agent
interface ManagerAgent {
  id: string
  conversationId: string
  currentTodos: Todo[]
  activeWorkflows: string[]
}

interface Todo {
  id: string
  text: string
  status: "pending" | "in_progress" | "complete"
  timestamp: Date
}

// Workflows
interface Workflow {
  id: string
  name: string
  description: string
  agentType: "browser" | "coder"
  status: "todo" | "in_progress" | "done" | "paused" | "failed"
  progress: number // 0-100
  currentStep: string
  steps: WorkflowStep[]
  schedule?: CronSchedule
  createdAt: Date
  completedAt?: Date
}

interface WorkflowStep {
  id: string
  description: string
  status: "pending" | "in_progress" | "complete" | "failed"
  skill: BrowserSkill | CoderSkill
  timestamp?: Date
}

// Sub-Agents
interface BrowserAgent {
  id: string
  workflowId: string
  skills: BrowserSkill[]
  currentUrl?: string
  reasoningTrace: ReasoningStep[]
}

interface CoderAgent {
  id: string
  workflowId: string
  skills: CoderSkill[]
  context: string
  reasoningTrace: ReasoningStep[]
}

type BrowserSkill = "navigate" | "click" | "type" | "screenshot" | "scrape" | "search"
type CoderSkill = "write_code" | "debug" | "refactor" | "analyze_data" | "generate_report"

// Reasoning Trace (ReAct Loop)
interface ReasoningStep {
  id: string
  type: "thought" | "action" | "observation"
  content: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

interface CronSchedule {
  expression: string // e.g., "0 9 * * *" for daily at 9am
  timezone: string
  nextRun: Date
}
```

---

### Component Architecture

```
/components/workflows/
  ├── workflow-kanban.tsx         # Main Kanban board
  ├── workflow-card.tsx           # Individual workflow card
  ├── workflow-detail-modal.tsx   # Detail view with reasoning trace
  ├── workflow-create-modal.tsx   # Plan approval interface
  ├── reasoning-trace.tsx         # Live ReAct loop display
  └── voice-input.tsx             # Voice recording component

/components/manager/
  ├── inline-todos.tsx            # Manager's thinking to-do list
  └── plan-preview.tsx            # Workflow plan approval

/lib/agents/
  ├── manager-agent.ts            # Orchestration logic
  ├── browser-agent.ts            # Web automation
  ├── coder-agent.ts              # Code/data tasks
  └── reasoning-engine.ts         # ReAct loop implementation
```

---

## User Experience Flow

### Example: Setting Up Price Monitoring

**1. User Request**
```
User: "I need to check our competitor's prices every morning 
       and tell me if they go below ours"
```

**2. Manager Thinking (Inline)**
```
✓ Understanding request
✓ Identifying: Competitor site, our pricing database
✓ Planning: Browser scrape + Coder comparison
● Creating workflow plan...
```

**3. Plan Preview**
```
📋 Daily Competitor Price Check

Workflows:
🌐 Scrape Competitor Prices (Browser Agent)
  • Navigate to competitor.com/products
  • Scrape all prices
  • Save to price_history table

</> Compare & Alert (Coder Agent)
  • Query our current prices
  • Compare with competitor data
  • Send alert if competitor < our_price

🕐 Schedule: Daily at 9:00 AM

[Approve & Create]  [Modify]
```

**4. User Approves → Workflows Created**

**5. Next Morning at 9am**
- Browser Agent activates
- User sees workflow in "In Progress"
- Can click to watch reasoning trace
- Gets alert if price condition met

---

## Gamification & Delight

### Workflow Completion Celebrations

**Small Task** (< 5 min):
- Subtle checkmark animation
- Soft "ding" sound
- Card slides to "Done" column

**Medium Task** (5-30 min):
- Confetti burst from card
- "Workflow Complete!" toast
- Progress bar fills with green animation

**Large Task** (> 30 min):
- Full-screen confetti
- Achievement badge: "Marathon Runner 🏃"
- Summary stats: "Saved you 2 hours of work!"

### Progress Indicators

**Animated Dots**: `●●●○` (pulsing)
- Creates sense of "something happening"
- Different speeds based on task complexity

**Reasoning Trace Scroll**:
- Auto-scrolls as new thoughts appear
- Typewriter effect for text
- Subtle glow on active step

---

## Progressive Disclosure

### Levels of Detail

**Level 1: Kanban Card** (Glance)
- Agent icon
- Workflow name
- Progress percentage
- Current step (one line)

**Level 2: Card Hover** (Quick Check)
- Tooltip with next 3 steps
- Time running
- Estimated completion

**Level 3: Detail Modal** (Deep Dive)
- Full step breakdown
- Complete reasoning trace
- Ability to pause/modify
- Export results

**Level 4: Advanced Settings** (Power User)
- Edit workflow logic
- Adjust retry policies
- Set custom alerts
- View logs/debugging

---

## Integration with Existing Features

### With Activity Feed
- Workflow status updates appear in feed
- Click feed item → Opens workflow detail
- "Browser Agent started scraping..." notifications

### With Memory Panel
- Manager remembers past workflows
- "You usually check prices on Monday mornings"
- Suggest similar workflows based on history

### With Checkpoints
- Auto-checkpoint before starting workflows
- Can restore if workflow causes issues
- "Safe rollback" if automation breaks something

### With Scheduled Tasks
- Workflows can be scheduled via cron
- Appear in Activity Feed's scheduled section
- One-time vs recurring workflows

---

## Implementation Phases

### Phase 1: Foundation (4-6 weeks)
- [ ] Manager Agent with inline to-do display
- [ ] Workflow data models and storage
- [ ] Basic Kanban board UI
- [ ] Manual workflow creation (no AI planning yet)
- [ ] Simple Browser Agent with Navigate + Scrape

### Phase 2: Reasoning & Progress (4-6 weeks)
- [ ] ReAct loop implementation
- [ ] Live reasoning trace display
- [ ] Workflow detail modal
- [ ] Progress tracking and status updates
- [ ] Coder Agent with basic skills

### Phase 3: Orchestration (6-8 weeks)
- [ ] Manager AI planning capabilities
- [ ] Natural language workflow creation
- [ ] Plan approval flow
- [ ] Multiple workflow coordination
- [ ] Voice input for mobile

### Phase 4: Polish & Scale (4-6 weeks)
- [ ] Workflow templates library
- [ ] Advanced scheduling
- [ ] Error recovery and retries
- [ ] Performance optimization
- [ ] Celebration animations

---

## Success Metrics

**Adoption**:
- % of users who create at least 1 workflow
- Average workflows per active user
- Workflow approval rate (plan → created)

**Engagement**:
- Daily active workflows
- Workflow detail view open rate
- Time spent watching reasoning traces

**Utility**:
- Average time saved per workflow
- Workflow success rate
- User satisfaction with automation quality

---

## Technical Considerations

### Performance
- Reasoning traces can be large → Pagination
- Multiple agents running → Queue management
- Real-time updates → WebSocket connection

### Security
- Browser Agent needs sandbox environment
- Credential management for web automation
- Rate limiting to prevent abuse

### Error Handling
- Agent gets stuck → Auto-retry with backoff
- Workflow fails → Notify user with context
- Website changed → Graceful degradation

---

## Inspiration Sources

- **DO/ER-AI**: Multi-agent architecture with reasoning traces
- **n8n/Zapier**: Workflow visual design
- **Linear**: Clean Kanban board aesthetics
- **Retool**: Inline progress indicators
- **Cursor**: AI thinking process visibility

---

## Open Questions

1. Should workflows be shareable between users? (Community library)
2. How do we handle paid API costs for long-running workflows?
3. Should sub-agents be visible as "team members" in the UI?
4. Can users create custom sub-agent types?
5. How do we prevent workflow "spam" (too many automations)?

---

## Conclusion

Sub-agents transform the assistant from a **reactive helper** into a **proactive team member** that can handle complex, multi-step tasks autonomously while keeping users fully informed through transparent reasoning traces and live progress updates. Combined with our existing features (Memory, Tasks, Playbooks, Checkpoints), this creates a truly collaborative workspace where users can delegate with confidence.
