# Refactoring Roadmap

## Overview

This document provides a step-by-step plan for refactoring the codebase to follow the 200-line rule and improve component architecture.

## Priority Levels

- **🔴 Critical (P0)** - Blocks development, needs immediate attention
- **🟡 High (P1)** - Significantly improves maintainability
- **🟢 Medium (P2)** - Nice to have, improves organization
- **🔵 Low (P3)** - Future optimization

## Phase 1: chat-interface.tsx (🔴 Critical - 642 lines)

**Impact:** High - Core of the application
**Effort:** Large
**Dependencies:** None

### Current Structure
```
chat-interface.tsx (642 lines)
├── Imports & Types (20 lines)
├── State Management (80 lines)
├── Effect Hooks (100 lines)
├── Event Handlers (200 lines)
├── Helper Functions (80 lines)
└── JSX Render (162 lines)
```

### Target Structure
```
components/chat/
├── ChatInterface.tsx                # Main orchestrator (150 lines)
│   └── Renders ChatContainer with state
├── ChatContainer.tsx                # Layout wrapper (100 lines)
│   └── Manages scroll, viewport, sections
├── hooks/
│   ├── useChatState.ts             # All useState consolidated (80 lines)
│   ├── useChatHandlers.ts          # Event handlers (120 lines)
│   ├── useChatEffects.ts           # useEffect hooks (100 lines)
│   └── useChatHelpers.ts           # Helper functions (80 lines)
└── utils/
    └── chat-helpers.ts             # Pure utility functions (60 lines)
```

### Step-by-Step Implementation

#### Step 1.1: Extract State Management Hook
```typescript
// File: components/chat/hooks/useChatState.ts
// Extract all useState calls into one hook
// Lines: ~80
// Dependencies: types.ts
```

#### Step 1.2: Extract Event Handlers Hook
```typescript
// File: components/chat/hooks/useChatHandlers.ts
// Move all event handler functions
// Lines: ~120
// Dependencies: useChatState, types.ts, ai-utils.ts
```

#### Step 1.3: Extract Effects Hook
```typescript
// File: components/chat/hooks/useChatEffects.ts
// Move all useEffect calls
// Lines: ~100
// Dependencies: useChatState, useLayoutHooks.ts
```

#### Step 1.4: Extract Pure Helpers
```typescript
// File: components/chat/utils/chat-helpers.ts
// Move pure functions (no hooks, no state)
// Lines: ~60
// Dependencies: types.ts
```

#### Step 1.5: Create Container Component
```typescript
// File: components/chat/ChatContainer.tsx
// Layout, scroll, viewport management
// Lines: ~100
// Dependencies: message-section.tsx
```

#### Step 1.6: Refactor Main Component
```typescript
// File: components/chat/ChatInterface.tsx
// Use all extracted hooks, render ChatContainer
// Lines: ~150
// Dependencies: All new hooks, ChatContainer
```

### Testing Checklist
- [ ] Message submission works
- [ ] Streaming displays correctly
- [ ] Scroll behavior maintained
- [ ] Panels open/close properly
- [ ] Images upload successfully
- [ ] Voice mode activates
- [ ] Onboarding shows on first visit

### Estimated Time: 8-12 hours

---

## Phase 2: composer.tsx (🟡 High Priority - 474 lines)

**Impact:** High - Primary user interaction point
**Effort:** Medium-Large
**Dependencies:** Phase 1 completion recommended

### Current Structure
```
composer.tsx (474 lines)
├── Imports (30 lines)
├── Props & State (60 lines)
├── Event Handlers (100 lines)
├── Render Logic (284 lines)
│   ├── Panels (100 lines)
│   ├── Form & Input (80 lines)
│   ├── Tray (50 lines)
│   └── Modals (54 lines)
```

### Target Structure
```
components/chat/composer/
├── Composer.tsx                    # Main orchestrator (120 lines)
├── ComposerInput.tsx              # Textarea & form (80 lines)
├── ComposerActions.tsx            # Right button group (70 lines)
├── ComposerPanels.tsx             # Panel rendering (100 lines)
├── ComposerTray.tsx               # Already exists ✅
├── hooks/
│   ├── useComposerState.ts        # State management (70 lines)
│   ├── useComposerHandlers.ts     # Event handlers (90 lines)
│   └── useComposerFeatures.ts     # Feature toggle logic (60 lines)
└── types.ts                       # Composer types (40 lines)
```

### Step-by-Step Implementation

#### Step 2.1: Extract Types
Create `composer/types.ts` with all local interfaces

#### Step 2.2: Create State Hook
Extract all `useState` calls to `useComposerState.ts`

#### Step 2.3: Create Handlers Hook
Move event handlers to `useComposerHandlers.ts`

#### Step 2.4: Split Input Component
Create `ComposerInput.tsx` for textarea/form

#### Step 2.5: Split Actions Component
Create `ComposerActions.tsx` for right-side buttons

#### Step 2.6: Split Panels Component
Create `ComposerPanels.tsx` for all panel rendering

#### Step 2.7: Refactor Main
Update `Composer.tsx` to use new components

### Testing Checklist
- [ ] Input accepts text
- [ ] Features toggle correctly
- [ ] Panels open/close
- [ ] Images attach
- [ ] Send button works
- [ ] Voice mode triggers
- [ ] Keyboard shortcuts functional

### Estimated Time: 6-8 hours

---

## Phase 3: image-preview.tsx (🟡 High Priority - 264 lines)

**Impact:** Medium - Improves media handling
**Effort:** Small-Medium
**Dependencies:** None

### Current Structure
```
image-preview.tsx (264 lines)
├── State & Hooks (60 lines)
├── Thumbnail Strip (40 lines)
└── Lightbox Modal (164 lines)
```

### Target Structure
```
components/chat/composer/
├── ImagePreview.tsx               # Thumbnail strip (80 lines)
├── ImageLightbox.tsx              # Full viewer (140 lines)
└── hooks/
    └── useImageRotation.ts        # Rotation state (40 lines)
```

### Step-by-Step Implementation

#### Step 3.1: Extract Rotation Hook
Create `useImageRotation.ts` with rotation state logic

#### Step 3.2: Split Lightbox Component
Move lightbox JSX to `ImageLightbox.tsx`

#### Step 3.3: Refactor Preview
Update `ImagePreview.tsx` to render thumbnails only

### Testing Checklist
- [ ] Thumbnails display correctly
- [ ] Click opens lightbox
- [ ] Rotation works in both views
- [ ] Navigation arrows work
- [ ] Keyboard shortcuts work
- [ ] Remove button functions

### Estimated Time: 3-4 hours

---

## Phase 4: voice-mode-modal.tsx (🟢 Medium Priority - 217 lines)

**Impact:** Medium - Improves voice feature
**Effort:** Medium
**Dependencies:** None

### Current Structure
```
voice-mode-modal.tsx (217 lines)
├── State & Audio Setup (70 lines)
├── Effects & Handlers (50 lines)
└── Modal Render (97 lines)
```

### Target Structure
```
components/voice/
├── VoiceModeModal.tsx             # Modal container (80 lines)
├── VoiceControls.tsx              # Button group (60 lines)
├── VoiceVisualizer.tsx            # Canvas wrapper (50 lines)
└── hooks/
    ├── useVoiceAudio.ts           # Audio logic (80 lines)
    └── useVoiceState.ts           # State management (40 lines)
```

### Step-by-Step Implementation

#### Step 4.1: Extract Audio Hook
Create `useVoiceAudio.ts` with audio capture/analysis

#### Step 4.2: Extract State Hook
Create `useVoiceState.ts` for modal state

#### Step 4.3: Split Controls
Create `VoiceControls.tsx` for button group

#### Step 4.4: Split Visualizer
Create `VoiceVisualizer.tsx` for 3D scene

#### Step 4.5: Refactor Modal
Update main modal to use new components

### Testing Checklist
- [ ] Modal opens/closes
- [ ] Microphone permission requested
- [ ] Audio visualizer animates
- [ ] Recording starts/stops
- [ ] Keyboard mode toggles
- [ ] Close on escape works

### Estimated Time: 4-5 hours

---

## Phase 5: Additional Optimizations (🔵 Low Priority)

### 5.1 Settings Modal Enhancement
- Already split into sections ✅
- Could extract individual section components
- Priority: Low (already manageable at 212 lines)

### 5.2 Message Component Optimization
- Current: ~150 lines (acceptable)
- Could split thinking/tools display
- Priority: Low

### 5.3 Panel Components
- Memory, Tasks, Think, Tools panels
- All under 200 lines currently ✅
- No immediate action needed

### 5.4 Utility File Consolidation
- Group related utilities by domain
- Create index files for easier imports
- Priority: Low

---

## Implementation Strategy

### Approach: Iterative & Incremental

1. **One phase at a time** - Complete and test before moving on
2. **Backward compatible** - Keep old code until new code is verified
3. **Test thoroughly** - Ensure no regressions
4. **Update docs** - Keep documentation in sync

### Git Workflow

```bash
# For each phase:
git checkout -b refactor/phase-1-chat-interface

# Make changes iteratively
git add components/chat/hooks/useChatState.ts
git commit -m "Extract chat state management hook"

git add components/chat/hooks/useChatHandlers.ts
git commit -m "Extract chat event handlers"

# etc...

# Final commit
git commit -m "Complete Phase 1: Refactor chat-interface.tsx"

# Test thoroughly, then merge
git checkout main
git merge refactor/phase-1-chat-interface
```

### Testing Between Phases

After each phase:
1. Manual testing of affected features
2. Check browser console for errors
3. Verify no TypeScript errors
4. Test on mobile viewport
5. Check accessibility (keyboard navigation)

---

## Success Metrics

### Code Quality
- ✅ No files over 200 lines
- ✅ Each component has single responsibility
- ✅ TypeScript errors: 0
- ✅ Linting warnings: 0

### Maintainability
- ✅ New developers can navigate easily
- ✅ Testing individual pieces is straightforward
- ✅ Common patterns are extracted and reusable

### Performance
- ✅ No degradation in app performance
- ✅ Bundle size remains similar or smaller
- ✅ Lazy loading opportunities identified

---

## Timeline

### Conservative Estimate
- Phase 1: 2 days (12 hours)
- Phase 2: 1.5 days (8 hours)
- Phase 3: 0.5 days (4 hours)
- Phase 4: 1 day (5 hours)
- **Total: 5 days**

### Aggressive Estimate
- Phase 1: 1 day (8 hours)
- Phase 2: 1 day (6 hours)
- Phase 3: 0.5 days (3 hours)
- Phase 4: 0.5 days (4 hours)
- **Total: 3 days**

### Recommended Approach
- Allocate 1-2 hours per day over 2-3 weeks
- Complete one major step per session
- Don't rush - quality over speed
- Test thoroughly at each step

---

## Maintenance Plan

### After Refactoring

1. **Enforce 200-line rule**
   - Add ESLint rule or pre-commit hook
   - Code review checklist item

2. **Regular reviews**
   - Monthly: Check for new violations
   - Quarterly: Assess if further optimization needed

3. **Documentation updates**
   - Update component docs when splitting
   - Keep COMPONENT_REFERENCE.md in sync

4. **Continuous improvement**
   - Extract repeated patterns
   - Consolidate similar utilities
   - Update design system tokens

---

## Common Pitfalls to Avoid

### Over-splitting
- ❌ Don't create files with <30 lines
- ❌ Don't split tightly coupled logic
- ✅ Balance between organization and complexity

### Breaking Changes
- ❌ Don't change public APIs unnecessarily
- ✅ Maintain backward compatibility during transition
- ✅ Use deprecation warnings if needed

### Prop Drilling
- ❌ Don't pass props through 5+ levels
- ✅ Use Context or custom hooks for shared state
- ✅ Co-locate state with components that use it

### Premature Optimization
- ❌ Don't optimize before measuring
- ✅ Focus on code organization first
- ✅ Add performance optimizations only when needed

---

## Questions & Decisions Log

### Why 200 lines?
- Research shows humans can effectively scan ~200 lines
- Beyond that, cognitive load increases significantly
- Sweet spot for single responsibility principle

### Why hooks over context?
- Hooks provide fine-grained reactivity
- Easier to test in isolation
- Context is better for global/theme state

### Why not Redux/Zustand?
- Current app size doesn't justify the overhead
- Local state with hooks is sufficient
- Can migrate later if app grows significantly

---

## Next Steps

1. Review this roadmap with team
2. Prioritize phases based on current needs
3. Start with Phase 1 (chat-interface.tsx)
4. Set up testing environment
5. Begin incremental refactoring
6. Update documentation as you go

---

**Last Updated:** Based on current codebase state
**Status:** Planning Phase - Ready to Begin
**Owner:** Development Team
