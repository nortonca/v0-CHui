# File Organization & Component Architecture

## Overview

This document describes the organization and componentization strategy for the codebase. We follow a **200-line rule**: files should ideally not exceed 200 lines. When they do, they should be split into smaller, focused components.

## Directory Structure

```
app/
├── api/                    # API routes
│   └── chat/              # Chat API endpoint
│       └── route.ts       # Streaming chat completions
├── layout.tsx             # Root layout with fonts and providers
└── page.tsx              # Main page (renders ChatInterface)

components/
├── chat/                  # Chat-related components
│   ├── composer/         # Message input composer
│   │   ├── composer.tsx          # Main composer (REFACTOR: 474 lines → split)
│   │   ├── composer-tray.tsx     # Feature selection tray
│   │   ├── image-preview.tsx     # Image upload preview (REFACTOR: 264 lines)
│   │   └── index.ts              # Exports
│   ├── hooks/            # Custom hooks for chat logic
│   │   ├── useChatMessages.ts    # Message state management
│   │   ├── useChatStreaming.ts   # Streaming logic
│   │   ├── useLayoutHooks.ts     # Scroll/viewport handling
│   │   └── useMessageSections.ts # Message section logic
│   ├── buttons/          # Action buttons
│   ├── chat-interface.tsx        # Main chat container (REFACTOR: 642 lines)
│   ├── message.tsx              # Individual message rendering
│   ├── message-section.tsx      # Message grouping
│   ├── *-panel.tsx             # Feature panels (Memory, Tasks, etc.)
│   ├── ai-utils.ts             # AI streaming utilities
│   ├── types.ts                # TypeScript interfaces
│   └── utils.ts                # Helper functions
│
├── settings/             # Settings UI
│   ├── settings-modal-content.tsx  # Main settings (212 lines - acceptable)
│   ├── settings-section.tsx        # Reusable section components
│   └── settings-constants.ts       # Configuration options
│
├── voice/               # Voice mode
│   ├── voice-mode-modal.tsx      # Voice interface (REFACTOR: 217 lines)
│   ├── particle-sphere.tsx       # 3D visualization
│   └── utils/                   # Audio processing utilities
│
├── onboarding/          # Onboarding flow
├── profile/            # User profile
├── tools/             # Tool selection
├── providers/         # Context providers
└── ui/               # Shadcn UI components

lib/
├── agent/            # AI agent logic
│   └── base-agent.ts        # Base conversational agent
├── utils.ts          # Global utilities (cn helper)
├── audio-analyzer.ts # Audio processing
└── *-utilities.ts   # Domain-specific utils

hooks/               # Global hooks
├── use-agent-chat.ts  # AI chat integration
├── use-mobile.ts      # Mobile detection
└── use-toast.ts      # Toast notifications

docs/               # Documentation
├── PROJECT_OVERVIEW.md          # Complete project guide
├── COMPONENT_REFERENCE.md       # Component API docs
├── UI_UX_STYLE_GUIDE.md        # Design system
├── AGENT_SETUP.md              # AI integration
├── IMPLEMENTATION_SUMMARY.md   # Architecture decisions
└── FILE_ORGANIZATION.md        # This file
```

## Files Requiring Refactoring

### 1. chat-interface.tsx (642 lines)

**Current Issues:**
- Manages too many concerns: messages, streaming, layout, interactions
- Large state management (20+ useState hooks)
- Complex event handlers mixed with UI
- Difficult to test individual pieces

**Refactoring Plan:**

Split into:
```
components/chat/
├── chat-interface.tsx          # Main orchestrator (150 lines)
├── chat-container.tsx          # Layout & scroll management (100 lines)
├── hooks/
│   ├── useChatState.ts        # Consolidated state management (80 lines)
│   ├── useChatHandlers.ts     # Event handlers (100 lines)
│   └── useChatEffects.ts      # Side effects & auto-scroll (80 lines)
└── utils/
    └── chat-helpers.ts        # Pure helper functions (80 lines)
```

**Benefits:**
- Each file has a single responsibility
- Easier to test individual hooks
- Better code reusability
- Improved readability

### 2. composer.tsx (474 lines)

**Current Issues:**
- Handles input, features, panels, images, voice
- Complex state for all composer features
- Large JSX with nested conditionals

**Refactoring Plan:**

Split into:
```
components/chat/composer/
├── composer.tsx               # Main component (120 lines)
├── composer-input.tsx         # Textarea & submit (80 lines)
├── composer-actions.tsx       # Right side buttons (60 lines)
├── composer-features.tsx      # Feature toggle logic (80 lines)
├── composer-panels.tsx        # Panel rendering (100 lines)
├── hooks/
│   ├── useComposerState.ts   # State management (60 lines)
│   └── useComposerActions.ts # Action handlers (80 lines)
└── types.ts                  # Composer-specific types (40 lines)
```

### 3. image-preview.tsx (264 lines)

**Current Issues:**
- Combines thumbnail strip with full lightbox modal
- Rotation state management mixed with UI
- Large lightbox JSX

**Refactoring Plan:**

Split into:
```
components/chat/composer/
├── image-preview.tsx          # Thumbnail strip (80 lines)
├── image-lightbox.tsx         # Full-screen viewer (120 lines)
└── hooks/
    └── useImageRotation.ts    # Rotation state (40 lines)
```

### 4. voice-mode-modal.tsx (217 lines)

**Current Issues:**
- Combines modal UI, audio processing, and 3D visualization
- Complex audio state management
- Microphone permission handling

**Refactoring Plan:**

Split into:
```
components/voice/
├── voice-mode-modal.tsx       # Modal container (80 lines)
├── voice-controls.tsx         # Control buttons (60 lines)
├── voice-visualizer.tsx       # 3D scene wrapper (50 lines)
└── hooks/
    ├── useVoiceAudio.ts       # Audio capture & analysis (80 lines)
    └── useVoiceState.ts       # Voice mode state (40 lines)
```

## Component Design Principles

### Single Responsibility
Each component/file should have ONE primary purpose:
- ✅ `composer-input.tsx` - handles textarea input
- ❌ `composer.tsx` - handles input, features, panels, images (TOO MANY)

### Size Guidelines
- **Components**: 50-150 lines ideal, 200 lines maximum
- **Hooks**: 40-100 lines ideal, 150 lines maximum
- **Utils**: 30-80 lines per file, group by domain

### When to Split

Split when:
1. File exceeds 200 lines
2. File has multiple distinct responsibilities
3. Testing becomes difficult
4. Code is hard to understand
5. You're scrolling a lot to navigate

Don't split when:
1. Logic is tightly coupled and hard to separate
2. It would create excessive prop drilling
3. The split doesn't improve clarity

### Naming Conventions

**Components:**
- PascalCase: `ChatInterface.tsx`
- Descriptive: `ComposerInput.tsx` not `Input.tsx`
- Prefixed: `composer-input.tsx` for domain grouping

**Hooks:**
- camelCase with `use` prefix: `useComposerState.ts`
- Specific: `useChatHandlers.ts` not `useHandlers.ts`

**Utils:**
- kebab-case: `chat-helpers.ts`
- Domain-suffixed: `chat-utilities.ts`, `ui-utilities.ts`

**Types:**
- Same name as related component: `composer/types.ts`
- Or central: `components/chat/types.ts`

## Folder Organization Patterns

### Feature-Based (Preferred)
Group by feature/domain:
```
components/chat/
├── composer/          # All composer-related code
│   ├── composer.tsx
│   ├── composer-input.tsx
│   ├── hooks/
│   └── types.ts
└── messages/          # All message-related code
    ├── message.tsx
    ├── message-section.tsx
    └── types.ts
```

### Type-Based (When Needed)
Group by type for shared utilities:
```
lib/
├── hooks/            # Shared hooks
├── utils/           # Shared utilities
└── types/          # Shared types
```

## Import Organization

Standard import order:
```typescript
// 1. React & Next.js
import { useState, useEffect } from 'react'
import Image from 'next/image'

// 2. External libraries
import { cn } from '@/lib/utils'
import { Send, Plus } from 'lucide-react'

// 3. Internal components
import { Button } from '@/components/ui/button'
import ComposerInput from './composer-input'

// 4. Hooks
import { useComposerState } from './hooks/useComposerState'

// 5. Types & constants
import type { ComposerProps } from './types'
import { DEFAULT_MAX_LENGTH } from './constants'

// 6. Styles (if any)
import './composer.css'
```

## State Management Patterns

### Local State (useState)
For component-only state:
```typescript
const [isOpen, setIsOpen] = useState(false)
```

### Shared State (Custom Hooks)
For state shared across related components:
```typescript
// hooks/useComposerState.ts
export function useComposerState() {
  const [inputValue, setInputValue] = useState('')
  const [features, setFeatures] = useState({})
  return { inputValue, setInputValue, features, setFeatures }
}
```

### Prop Drilling Limit
Max 2-3 levels. Beyond that, use:
- Context API
- Custom hooks
- State management library

## Testing Strategy

With proper component splitting:

```typescript
// Easy to test individual pieces
describe('ComposerInput', () => {
  it('handles input changes', () => {
    // Test just the input logic
  })
})

describe('useComposerState', () => {
  it('manages state correctly', () => {
    // Test just the state logic
  })
})

describe('Composer', () => {
  it('integrates components', () => {
    // Test integration
  })
})
```

## Migration Checklist

When refactoring a large file:

- [ ] Identify distinct responsibilities
- [ ] Create new files/folders
- [ ] Extract types to shared location
- [ ] Move utilities to separate files
- [ ] Create custom hooks for state/logic
- [ ] Split UI into smaller components
- [ ] Update imports in parent component
- [ ] Update exports in index files
- [ ] Test each piece individually
- [ ] Verify integration works
- [ ] Update documentation
- [ ] Delete old file (if fully replaced)

## Best Practices

### DRY (Don't Repeat Yourself)
Extract repeated patterns:
```typescript
// ❌ Repeated button pattern
<button className="px-4 py-2 bg-primary...">Save</button>
<button className="px-4 py-2 bg-primary...">Cancel</button>

// ✅ Extracted component
<Button>Save</Button>
<Button>Cancel</Button>
```

### Composition Over Complexity
Build complex UIs from simple pieces:
```typescript
// ✅ Composable
<Composer>
  <ComposerInput />
  <ComposerActions />
</Composer>

// ❌ Monolithic
<Composer /> // Does everything internally
```

### Clear Interfaces
Well-defined props:
```typescript
interface ComposerInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  maxLength?: number
}
```

### Documentation
Document non-obvious decisions:
```typescript
/**
 * Custom hook for managing composer state.
 * 
 * Handles input value, feature flags, and panel visibility.
 * State is NOT persisted - resets on unmount.
 * 
 * @returns Composer state and updater functions
 */
export function useComposerState() { ... }
```

## Performance Considerations

### Code Splitting
Use dynamic imports for large components:
```typescript
const VoiceModeModal = dynamic(() => import('./voice-mode-modal'))
```

### Memo & Callbacks
Prevent unnecessary rerenders:
```typescript
const MemoizedMessage = memo(Message)
const handleSubmit = useCallback(() => { ... }, [deps])
```

### Lazy Loading
Load heavy components on demand:
```typescript
const ImageLightbox = lazy(() => import('./image-lightbox'))
```

## Conclusion

Proper file organization and component splitting leads to:
- **Better maintainability** - easy to find and update code
- **Improved testability** - small, focused units
- **Enhanced reusability** - extract common patterns
- **Faster development** - clear structure reduces cognitive load
- **Easier onboarding** - new developers can navigate quickly

Follow the 200-line rule, practice single responsibility, and keep extracting until each piece does ONE thing well.
