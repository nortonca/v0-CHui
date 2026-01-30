# Collaboration UX Patterns

How to make the UI feel like a **shared workspace with an intelligent partner** rather than a command-line tool.

---

## Core Principle

> The assistant is a **colleague**, not a tool. Every interaction should reinforce the feeling that you're working *with* someone, not issuing commands *to* something.

---

## Language & Tone

### ✅ Do Use
- **Collaborative pronouns**: "Let's...", "We should...", "Shall we..."
- **Progress language**: "I'm working on...", "Just finished...", "Almost done..."
- **Partnership framing**: "What should we tackle next?", "I noticed..."
- **Transparent thinking**: "I'm thinking through...", "Let me consider..."

### ❌ Don't Use
- **Subservient**: "I will obey...", "As you command..."
- **Robotic**: "Processing...", "Executing task..."
- **Vague**: "Done.", "OK.", "Completed."
- **Over-eager**: "I'd LOVE to help!", excessive enthusiasm

### Examples

**Instead of:**
> "Task completed."

**Say:**
> "We're done! Here's what we accomplished together."

---

**Instead of:**
> "Processing your request..."

**Say:**
> "Let me think through this for a moment..."

---

**Instead of:**
> "Error: Invalid input"

**Say:**
> "I'm not quite sure what you mean. Could you rephrase that?"

---

## Visibility Patterns

### Principle: Show Your Work
Users should always understand what the assistant is doing and why.

#### Pattern 1: Progress Disclosure

**Bad: Silent execution**
```
[User asks question]
[5 seconds pass]
[Answer appears]
```

**Good: Visible thinking**
```
[User asks question]
"Let me research this..." (with animated dots)
[Activity Feed shows: 🔍 Searching 3 sources]
[2 seconds later]
"I found some interesting information. Here's what I learned..."
```

#### Pattern 2: Decision Transparency

**Bad: Opaque choices**
```
"I decided to use approach B."
```

**Good: Explained reasoning**
```
"I considered two approaches:
A) Quick but limited
B) Thorough but takes longer

Given your preference for thoroughness (from our earlier conversation), 
I went with B. Want me to explain more?"
```

#### Pattern 3: Error Honesty

**Bad: Vague failure**
```
"Something went wrong."
```

**Good: Specific admission**
```
"I ran into an issue accessing that file. It looks like the link might 
have expired. Want me to try a different approach?"
```

---

## Trust Patterns

### Principle: Always Give Control
Users should never feel trapped by assistant decisions.

#### Pattern 1: Reversible Actions

Every significant action should be:
1. **Previewed**: "I'm about to..."
2. **Confirmed**: "Should I proceed?"
3. **Reversible**: Checkpoint before action

**Example: Playbook execution**
```
Before starting "Weekly Review" playbook:
┌─────────────────────────────────┐
│ This will run 4 steps:          │
│ 1. Summarize week               │
│ 2. Identify blockers            │
│ 3. Plan next week               │
│ 4. Set priorities               │
│                                 │
│ Estimated time: 5-10 minutes    │
│                                 │
│ [Start] [Customize] [Cancel]   │
└─────────────────────────────────┘
```

#### Pattern 2: Editable Memory

All context should be user-editable:

```
Memory Panel:
┌─────────────────────────────────┐
│ About You:                      │
│ • Senior designer  [Edit] [×]   │
│                                 │
│ [Edit clicked]                  │
│ • [Input: ___________] [✓] [×]  │
└─────────────────────────────────┘
```

#### Pattern 3: Pauseable Progress

Long-running tasks should be interruptible:

```
Activity Feed:
┌─────────────────────────────────┐
│ 🔍 Deep research in progress... │
│ ████████████░░░░░░ 60%          │
│ [Pause] [Cancel] [View So Far]  │
└─────────────────────────────────┘
```

---

## Collaboration Modes

### Lead Mode
Assistant takes initiative, suggests next steps.

**Characteristics:**
- Proactive suggestions
- "Have you considered...?"
- Offers alternatives unprompted
- Creates plans autonomously

**Example:**
```
User: "I need to design a login page"
