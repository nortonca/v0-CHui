# Chat UI with Vibration - Co-Working Assistant

A collaborative AI assistant interface designed to feel like a **shared workspace with an intelligent partner**, emphasizing visibility, trust, and collaboration.

## 🎯 Design Philosophy

This application makes complex AI functionality feel **simple, intuitive, and delightful** by:
- **Progressive disclosure** - Advanced features revealed contextually
- **Duolingo-inspired gamification** - Celebratory moments and momentum-building
- **Figma-inspired UX** - Contextual panels and real-time collaboration feel
- **Trust through transparency** - Memory, activity, and checkpoints are always visible

---

## 📚 Documentation Index

### Getting Started
- **[CONVENTIONS.md](./CONVENTIONS.md)** - Code style, naming conventions, and file organization
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Colors, typography, spacing, and component patterns

### Architecture & Implementation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture, state management, and component hierarchy
- **[REFACTORING.md](./REFACTORING.md)** - Input area refactoring and modular design improvements
- **[FEATURES.md](./FEATURES.md)** - Complete feature reference with usage and implementation status

### Design Guidelines
- **[docs/DESIGN_PHILOSOPHY.md](./docs/DESIGN_PHILOSOPHY.md)** - Core design principles inspired by Duolingo and Figma
- **[docs/PROGRESSIVE_DISCLOSURE.md](./docs/PROGRESSIVE_DISCLOSURE.md)** - When and how to hide complexity
- **[docs/GAMIFICATION.md](./docs/GAMIFICATION.md)** - Celebration animations, micro-interactions, and delightful moments
- **[docs/COLLABORATION_UX.md](./docs/COLLABORATION_UX.md)** - Language, visibility, and trust patterns

### Feature Documentation
- **[docs/CORE_FEATURES.md](./docs/CORE_FEATURES.md)** - Detailed feature overview with visual designs
- **[docs/FEATURE_SPECS.md](./docs/FEATURE_SPECS.md)** - Technical specifications, user stories, and data models
- **[docs/ROADMAP.md](./docs/ROADMAP.md)** - Development roadmap and future enhancements

---

## 🚀 Core Features

### Safety & Trust
- **Checkpoints** - Visual timeline with instant restore capability
- **Memory Panel** - Transparent, editable context the assistant uses
- **Activity Feed** - Real-time log of agent actions and background tasks

### Efficiency & Flow
- **Quick Actions** - One-click prompts for common tasks (Summarize, Plan, Review)
- **Playbooks** - Reusable workflows for repeated patterns
- **Sub-Agents** - Parallel background assistants for non-blocking work

### Onboarding & Personalization
- **Onboarding Flow** - 4-step wizard to personalize assistant and set collaboration mode
- **Collaboration Modes** - Lead (autonomous), Collaborate (back-and-forth), Assist (user-driven)
- **Scheduled Tasks** - Optional recurring check-ins, summaries, and reminders

---

## 🎨 Design Highlights

### Duolingo Inspiration
- Progress visualization through checkpoint timelines
- Encouraging feedback on task completion
- Bite-sized interactions via Quick Actions
- Streak-like momentum with scheduled tasks

### Figma Inspiration
- Expandable panels reveal context on demand
- Properties sidebar pattern for tools/settings
- Command palette feel with Quick Actions
- Real-time collaboration indicators

### Gamification Elements
- ✨ **Task completion** - Smooth checkmark animation with bounce
- 🎉 **Checkpoint saves** - Brief green glow on save
- 🎊 **Playbook completion** - Confetti effect (future)
- 🔥 **Daily streaks** - Scheduled task completion tracking (future)

---

## 🏗️ Technical Architecture

### Component Structure
```
ChatInterface
├── OnboardingModal (first-run)
├── ChatHeader (with Activity button)
├── MessageSection
└── InputAreaSimplified
    ├── QuickActions (above input)
    ├── InputBar
    │   ├── ImageUpload
    │   ├── TextareaInput
    │   ├── InputControls (tools, panels, mode)
    │   └── InputActions (mic, voice, send)
    ├── MemoryPanel (expandable)
    ├── TaskPanel (expandable)
    ├── PlaybooksPanel (expandable)
    └── CheckpointsPanel (expandable)
```

### State Management
- **ChatInterface** - Owns all feature state (memories, tasks, playbooks, checkpoints)
- **InputArea** - Manages panel expansion and delegates data operations
- **Modal Provider** - Centralized modal system for Think, Tools, Settings, Activity

### Styling
- **Tailwind CSS v4** with `@theme inline` configuration
- **Design tokens** for semantic colors (background, foreground, primary, etc.)
- **Animations** using CSS keyframes and Tailwind utilities

---

## 🛠️ Development Guidelines

### Code Quality Principles
1. **Modularity** - Components should have a single, clear responsibility
2. **Prop Minimization** - Reduce prop drilling; use composition
3. **Type Safety** - Export and reuse TypeScript types consistently
4. **Predictable Patterns** - Follow established modal, panel, and button patterns

### Adding New Features
1. Check **[docs/PROGRESSIVE_DISCLOSURE.md](./docs/PROGRESSIVE_DISCLOSURE.md)** for visibility guidelines
2. Reference **[docs/GAMIFICATION.md](./docs/GAMIFICATION.md)** for delightful interactions
3. Follow component patterns in **[ARCHITECTURE.md](./ARCHITECTURE.md)**
4. Update **[docs/FEATURE_SPECS.md](./docs/FEATURE_SPECS.md)** with technical details

### Design Checklist
- [ ] Does it follow progressive disclosure?
- [ ] Is the visual hierarchy clear?
- [ ] Are there celebratory moments?
- [ ] Does it feel collaborative (not command-driven)?
- [ ] Is it mobile-responsive?
- [ ] Are animations purposeful (not decorative)?

---

## 📖 Key Concepts

### Co-Working Assistant Pattern
This isn't a chatbot or command-line tool. It's a **partner**:
- Uses "we" language instead of "I" or "you"
- Shows its work through Activity Feed
- Asks for input, doesn't assume
- Celebrates successes together
- Admits when it needs help

### Progressive Disclosure
Complexity is hidden by default, revealed contextually:
- **First use**: Simple input, Quick Actions, basic chat
- **Explorers**: Discover expandable panels (Memory, Tasks)
- **Power users**: Find Playbooks, Checkpoints, Scheduled Tasks
- **Experts**: Create custom playbooks, configure sub-agents

### Trust Through Transparency
Every AI decision is visible and reversible:
- **Memory Panel** shows what context is being used
- **Activity Feed** shows what the assistant is doing
- **Checkpoints** allow instant rollback to any state
- **Edit controls** let users correct AI mistakes

---

## 🔮 Future Enhancements

See **[docs/ROADMAP.md](./docs/ROADMAP.md)** for the complete development plan.

### Phase 1: Polish & Delight (Next)
- Confetti on task/playbook completion
- Checkpoint timeline animations
- Hover state micro-interactions
- Empty state illustrations

### Phase 2: Power User Features
- Custom playbook creation
- Checkpoint branching/comparison
- Advanced memory filters
- Keyboard shortcuts

### Phase 3: Collaboration & Sharing
- Export conversations
- Share playbooks with team
- Collaborative checkpoints
- Real-time co-working

---

## 🎓 Learning Resources

### Internal Documentation
- Start with **[docs/DESIGN_PHILOSOPHY.md](./docs/DESIGN_PHILOSOPHY.md)** to understand the "why"
- Read **[docs/CORE_FEATURES.md](./docs/CORE_FEATURES.md)** for feature overview
- Reference **[ARCHITECTURE.md](./ARCHITECTURE.md)** for technical implementation

### External Inspiration
- [Duolingo Design](https://blog.duolingo.com/tag/design/) - Gamification patterns
- [Figma's Design System](https://www.figma.com/community/file/928108847914589057) - UI patterns
- [Stripe's Design Principles](https://stripe.com/blog/payment-api-design) - Progressive disclosure
- [Linear's Interface](https://linear.app) - Keyboard-first, delightful interactions

---

## 💡 Contributing

When contributing, ensure:
1. **Design-first** - Check design docs before implementing
2. **Document changes** - Update relevant .md files
3. **Test interactions** - Verify animations, hover states, mobile behavior
4. **Follow patterns** - Use existing modal, panel, button components
5. **Consider delight** - Add micro-interactions where appropriate

---

**Built with:** Next.js 15, React, TypeScript, Tailwind CSS v4, Shadcn UI

**Design inspired by:** Duolingo, Figma, Linear, Stripe
