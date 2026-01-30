# Progressive Disclosure Guide

## Principle

**Show users what they need, when they need it. Hide complexity until it's useful.**

Progressive disclosure reduces cognitive load by presenting information and controls gradually, based on the user's context and experience level.

---

## Current Implementation

### 1. Expandable Input Panels

**Pattern:** Panels collapse by default, expand on demand

**Implemented panels:**
- Memory Panel (brain icon)
- Task Panel (checklist icon)
- Playbooks Panel (workflow icon)
- Checkpoints Panel (history icon)

**Behavior:**
- Only one panel open at a time (exclusive)
- Badge shows count when collapsed (e.g., "3/5 tasks")
- Smooth height animation on expand/collapse
- Panel content only renders when expanded (performance)

**Code example:**
```tsx
// Only one panel expanded at a time
const togglePanel = (panel: PanelType) => {
  const isOpen = currentPanel === panel
  
  // Close all panels first
  setCurrentPanel(null)
  
  // If wasn't open, open it now
  if (!isOpen) setCurrentPanel(panel)
}
```

---

### 2. Quick Actions Bar

**Pattern:** Common actions visible, complex workflows hidden in panels

**Implementation:**
- 6 preset actions visible (Summarize, Plan, Review, etc.)
- One click inserts prompt into input
- More complex workflows (Playbooks) require opening panel

**Why this works:**
- New users see immediate value (quick actions)
- Power users discover Playbooks later
- No overwhelming "what can I do?" moment

---

### 3. Onboarding Flow

**Pattern:** 4 steps instead of all-at-once form

**Progression:**
1. Name your assistant
2. Tell us about you (role/work)
3. Primary use case
4. Collaboration mode

**Why this works:**
- One question at a time reduces overwhelm
- Progress bar shows "almost done"
- Can skip and return later
- Only shown once (first time)

---

### 4. Tools & Think Modals

**Pattern:** Settings hidden until clicked, shown in focused modal

**Implementation:**
- Button shows current state ("Think: On", "3 tools")
- Click opens modal with all options
- Modal forces focus, avoids clutter in main UI

**Before (bad):**
```
[Input bar with 20 visible options] ← Overwhelming
```

**After (good):**
```
[Input bar with 5 buttons] → Click → [Modal with details]
```

---

## Patterns to Follow

### Nested Disclosure

**Level 1:** Always visible  
**Level 2:** Visible on hover  
**Level 3:** Visible on click/expand  

**Example: Memory Panel**
```
Level 1: Memory icon + count badge (always visible)
  ↓
Level 2: Panel header + categories (on expand)
  ↓
Level 3: Edit/delete actions (on hover over memory item)
```

---

### Contextual Actions

Show actions only when relevant.

**Example: Checkpoint Restore**
- "Restore" button only appears when hovering over past checkpoint
- Confirmation modal only appears after clicking restore
- Auto-checkpoint creation happens silently (no UI until needed)

**Example: Task Edit**
- Edit icon appears on hover
- Click replaces text with input field
- Save/cancel buttons appear inline

---

### Smart Defaults

Choose sensible defaults so most users never need advanced options.

**Examples:**
- Think mode: "On" by default (most users want reasoning)
- Collaboration mode: "Collaborate" (balanced approach)
- Memory: On by default
- Auto-checkpoints: Every 5 messages

**Advanced users can change these in Settings**

---

## Anti-Patterns to Avoid

### ❌ Accordion Overload
Don't hide everything in accordions. Core actions should be visible.

**Bad:**
```
▶ Input
▶ Tools
▶ Memory
▶ Tasks
```

**Good:**
```
[Visible input bar]
[Icons that expand panels when needed]
```

---

### ❌ Wizard Fatigue
Don't make users click "Next" 20 times.

**Bad:**
```
Step 1 → Step 2 → Step 3 → ... → Step 15
```

**Good:**
```
Step 1-2-3-4 [with skip option]
```

---

### ❌ Hidden Primary Actions
Don't hide the main action user came for.

**Bad:**
```
Menu → Settings → Advanced → Enable feature
```

**Good:**
```
[Feature visible] → [Advanced options in Settings]
```

---

## Implementation Guidelines

### When to Use Progressive Disclosure

✅ **Use when:**
- Feature is advanced/rare
- Feature has complex settings
- Screen space is limited
- User needs focus on primary task

❌ **Don't use when:**
- Action is primary purpose
- Feature is frequently used
- Hiding creates confusion
- "Discoverability" is critical

---

### Disclosure Methods

#### 1. Expandable Panels
Best for: Related controls that are used occasionally

```tsx
<Panel isExpanded={isOpen} onToggle={toggle}>
  <PanelHeader>
    <Icon />
    <Title>Memory</Title>
    <Badge>{count}</Badge>
  </PanelHeader>
  {isExpanded && (
    <PanelContent>
      {/* Detailed content here */}
    </PanelContent>
  )}
</Panel>
```

#### 2. Modal Dialogs
Best for: Focused tasks that require full attention

```tsx
<Modal isOpen={isOpen} onClose={close}>
  <ModalHeader>Select Tools</ModalHeader>
  <ModalContent>
    {/* Tool selection interface */}
  </ModalContent>
  <ModalFooter>
    <Button onClick={save}>Save</Button>
  </ModalFooter>
</Modal>
```

#### 3. Hover Reveals
Best for: Secondary actions on list items

```tsx
<ListItem 
  onMouseEnter={showActions}
  onMouseLeave={hideActions}
>
  <ItemContent>{text}</ItemContent>
  {isHovering && (
    <Actions>
      <EditButton />
      <DeleteButton />
    </Actions>
  )}
</ListItem>
```

#### 4. Tooltips
Best for: Explaining icons or abbreviated labels

```tsx
<Tooltip content="Think mode affects response depth">
  <IconButton icon={<Brain />} />
</Tooltip>
```

#### 5. Progressive Forms
Best for: Multi-step processes

```tsx
<Wizard>
  <Step1 /> {/* Name */}
  <Step2 /> {/* Details */}
  <Step3 /> {/* Preferences */}
  <Step4 /> {/* Confirmation */}
</Wizard>
```

---

## Disclosure Timing

### On First Use
Show helpful hints or tours for first-time users:
- "This is the Memory panel. It shows what I remember about you."
- "Quick Actions help you work faster. Try one!"

**Implementation:**
```tsx
const [hasSeenTour, setHasSeenTour] = useLocalStorage('hasSeenTour', false)

{!hasSeenTour && <Tooltip>...</Tooltip>}
```

### On Hover
Reveal secondary actions on hover:
- Edit/delete buttons on list items
- Additional info on cards
- Tooltips on icons

### On Click/Expand
Show detailed interfaces when user opts in:
- Panel expansion
- Modal dialogs
- Dropdown menus

### On Scroll
Reveal more content as user scrolls:
- Infinite scroll for long lists
- "Load more" buttons
- Sticky headers appear

---

## Accessibility Considerations

### Keyboard Navigation
All disclosed content must be keyboard accessible:
- Tab to reach hidden controls
- Enter/Space to expand panels
- Escape to close modals

### Screen Readers
Announced state changes:
- "Panel expanded"
- "3 items available"
- "Dialog opened"

**ARIA attributes:**
```tsx
<button
  aria-expanded={isExpanded}
  aria-controls="panel-content"
  aria-label="Toggle memory panel"
>
  <Brain />
</button>

<div
  id="panel-content"
  role="region"
  aria-hidden={!isExpanded}
>
  {/* Content */}
</div>
```

---

## Mobile Considerations

### Bottom Sheets
On mobile, panels slide up from bottom instead of expanding in place:

```tsx
const Panel = ({ isExpanded, children }) => {
  const isMobile = useIsMobile()
  
  return (
    <div className={cn(
      isMobile 
        ? "fixed inset-x-0 bottom-0 rounded-t-3xl" 
        : "absolute bottom-full mb-2 rounded-2xl"
    )}>
      {children}
    </div>
  )
}
```

### Touch Targets
Expanded controls must be large enough:
- Minimum 44x44px touch targets
- Adequate spacing between tappable items

---

## Testing Checklist

Before shipping progressive disclosure:
- [ ] Primary action is immediately visible
- [ ] Advanced features are discoverable (not too hidden)
- [ ] Expansion/collapse animations are smooth
- [ ] Works with keyboard navigation
- [ ] Screen reader announces state changes
- [ ] Mobile responsive (bottom sheets)
- [ ] Performance: Hidden content doesn't render until needed
- [ ] Empty states guide users to next action
- [ ] Tooltips provide helpful context

---

## Future Enhancements

### Adaptive UI
Learn user behavior and surface frequently used features:
- If user opens Memory panel often, show it by default
- If user never uses Playbooks, hide the button
- If user prefers keyboard shortcuts, show command palette

### Contextual Disclosure
Show features based on current context:
- If conversation is about code, show code-specific tools
- If user is planning, emphasize Playbooks
- If user is reviewing, suggest Checkpoints

### User Preferences
Let users customize disclosure:
- "Always show Memory panel"
- "Hide Quick Actions bar"
- "Compact mode" (more hidden by default)

---

## Summary

Progressive disclosure makes our co-working assistant feel:
- **Simple** for new users (core features visible)
- **Powerful** for experienced users (depth available on demand)
- **Focused** by hiding distractions
- **Discoverable** through intuitive expansion patterns

Remember: **Hide complexity, not capabilities.**
