# Chat UI with AI Agent - Project Overview

**Last Updated:** January 2025

## Table of Contents

1. [Project Introduction](#project-introduction)
2. [Architecture](#architecture)
3. [Design System](#design-system)
4. [Component Structure](#component-structure)
5. [AI Agent Integration](#ai-agent-integration)
6. [Development Workflow](#development-workflow)
7. [Key Features](#key-features)
8. [Best Practices](#best-practices)

---

## Project Introduction

This is a modern, production-ready chat application featuring a sophisticated AI agent powered by Fireworks AI (Kimi 2.5 model). The application combines clean iOS/Grok-inspired UI design with real-time AI streaming, haptic feedback, and a rich set of interactive features.

### Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4 with custom design tokens
- **UI Components:** shadcn/ui + custom components
- **AI SDK:** AI SDK v6 (Vercel)
- **AI Provider:** Fireworks AI (Kimi 2.5)
- **State Management:** React hooks (useState, useRef, useEffect)
- **TypeScript:** Full type safety throughout

### Key Principles

1. **Mobile-First Design** - Optimized for touch and small screens first
2. **Real-Time Streaming** - Live AI responses with word-by-word streaming
3. **Progressive Disclosure** - Hide complexity until needed
4. **Haptic Feedback** - iOS-style vibrations for key interactions
5. **Accessibility** - Proper ARIA labels, keyboard navigation, screen reader support

---

## Architecture

### Directory Structure

```
/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # AI streaming API endpoint
│   ├── globals.css               # Design tokens & base styles
│   └── page.tsx                  # Main app entry point
├── components/
│   ├── chat/
│   │   ├── chat-interface.tsx    # Main chat orchestration
│   │   ├── message.tsx           # Individual message bubbles
│   │   ├── message-section.tsx   # Message grouping logic
│   │   ├── composer/             # Input and interaction area
│   │   │   ├── composer.tsx      # Main composer component
│   │   │   ├── composer-tray.tsx # Feature selection tray
│   │   │   └── image-preview.tsx # Image upload preview
│   │   ├── ai-utils.ts           # AI streaming utilities
│   │   ├── types.ts              # TypeScript definitions
│   │   └── [panels, buttons, etc.]
│   ├── settings/
│   │   ├── settings-modal-content.tsx
│   │   ├── settings-section.tsx  # Reusable settings components
│   │   └── settings-constants.ts # Configuration options
│   └── [ui, voice, onboarding, etc.]
├── lib/
│   └── agent/
│       └── base-agent.ts         # AI agent configuration
├── hooks/
│   ├── use-mobile.tsx            # Mobile detection
│   └── use-agent-chat.ts         # Chat utilities
└── docs/
    ├── PROJECT_OVERVIEW.md       # This file
    ├── UI_UX_STYLE_GUIDE.md      # Design patterns
    ├── AGENT_SETUP.md            # AI setup guide
    └── IMPLEMENTATION_SUMMARY.md # Technical details
```

### Data Flow

```
User Input (Composer)
    ↓
Chat Interface (State Management)
    ↓
API Route (/api/chat)
    ↓
AI SDK v6 (streamText)
    ↓
Fireworks AI (Kimi 2.5)
    ↓
Streaming Response
    ↓
Message Display (Real-time updates)
```

---

## Design System

### Color Palette

The app uses a carefully selected **orange primary color** for brand identity:

```css
/* Primary - Orange/Amber tones */
--primary: 22 93% 60%;           /* Main brand color */
--primary-foreground: 0 0% 100%; /* Text on primary */

/* Neutrals - For backgrounds and borders */
--background: 0 0% 100%;
--foreground: 240 10% 4%;
--card: 0 0% 100%;
--border: 240 6% 90%;
--muted: 240 5% 96%;
--muted-foreground: 240 4% 46%;

/* Semantic Colors */
--destructive: 0 84% 60%;        /* For delete/remove actions */
```

### Typography

- **Font Size:** 15px for body text (optimal readability)
- **Line Height:** `leading-relaxed` (1.625) for comfortable reading
- **Font Families:**
  - `font-sans` - Geist (primary UI font)
  - `font-mono` - Geist Mono (code/technical text)

### Spacing System

Following a consistent 4px grid:

- `gap-1` / `p-1` = 4px
- `gap-2` / `p-2` = 8px
- `gap-3` / `p-3` = 12px
- `gap-4` / `p-4` = 16px
- `gap-6` / `p-6` = 24px

### Component Styling Patterns

#### Buttons

```tsx
// Primary Action Button
className="w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"

// Secondary/Outline Button
className="w-9 h-9 rounded-full border border-border bg-background hover:bg-muted"

// Icon Action Button
className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground"
```

#### Cards & Containers

```tsx
// Card Pattern
className="bg-card border border-border rounded-2xl shadow-sm"

// Modal Pattern
className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-2xl"
```

#### Message Bubbles (iOS Style)

```tsx
// User Message
className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm"

// AI Message
className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm"
```

---

## Component Structure

### Chat Interface (`chat-interface.tsx`)

**Purpose:** Main orchestrator for the chat application

**Responsibilities:**
- Message state management
- Message section grouping
- Streaming word handling
- Scroll behavior management
- Integration with composer and panels

**Key State:**
```typescript
const [messages, setMessages] = useState<Message[]>([])
const [messageSections, setMessageSections] = useState<MessageSection[]>([])
const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
const [streamingWords, setStreamingWords] = useState<StreamingWord[]>([])
```

### Composer (`composer/composer.tsx`)

**Purpose:** Input area with feature selection and interaction controls

**Features:**
- Text input with auto-resize
- Image upload with preview
- Feature tray (expandable grid)
- Quick actions (prompt suggestions)
- Voice input/output controls
- Panels (Memory, Tasks, Tools, etc.)

**Design Pattern:** Progressive disclosure - hide complexity behind the "+" button

### Message Component (`message.tsx`)

**Purpose:** Individual message bubble rendering

**Features:**
- User vs AI styling (different colors and alignment)
- Image attachments display
- Thinking indicators
- Tool call displays
- Action buttons (regenerate, copy, share, like/dislike)
- Markdown rendering via Streamdown

**Styling:** iOS-inspired bubbles with proper spacing and shadows

### Image Preview (`composer/image-preview.tsx`)

**Purpose:** Show uploaded images with preview and editing capabilities

**Features:**
- Thumbnail strip with hover effects
- Lightbox modal for full-size viewing
- Rotation controls (90° increments)
- Keyboard navigation (ESC to close, arrows to navigate)
- Remove button per image

**Design Pattern:** Matches modal system with proper backdrop, header, and footer

### Settings Modal (`settings/settings-modal-content.tsx`)

**Purpose:** Configure AI behavior and preferences

**Sections:**
- **Execution Mode:** Autonomous, Collaborative, Guided
- **Communication Style:** Concise, Balanced, Detailed
- **AI Questions:** Frequency and max count settings
- **Task Planning:** When to show breakdowns
- **Preferences:** Auto-apply changes, challenge ideas
- **Memory:** Enable/disable conversation memory

**Architecture:** Split into reusable components (`SettingsSection`, `SettingsRadioGroup`, `SettingsToggle`, `SettingsSlider`)

---

## AI Agent Integration

### Overview

The AI agent uses **AI SDK v6** with **Fireworks AI** (Kimi 2.5 model) for streaming responses.

### API Route (`/app/api/chat/route.ts`)

**Runtime:** Edge (for low latency)

**Flow:**
1. Accept messages array from client
2. Validate input
3. Call `streamText()` with Fireworks model
4. Return data stream response

**System Prompt:**
```
You are a helpful, professional AI assistant integrated into a modern chat application.

Core Characteristics:
- Professional yet approachable tone
- Concise but thorough responses
- Technically competent across general topics
- Honest about limitations
```

### Streaming Implementation (`chat/ai-utils.ts`)

**Key Function:** `streamAIResponse(messages)`

**Process:**
1. POST to `/api/chat` with conversation history
2. Read response body as ReadableStream
3. Parse AI SDK v6 data format (lines prefixed with `0:`, `2:`, etc.)
4. Yield text chunks for real-time updates

**Error Handling:**
- Network errors → Show fallback message
- Parsing errors → Skip malformed lines
- API errors → Display user-friendly error

### Client Integration

**Location:** `chat-interface.tsx` → `simulateAIResponse()`

**Process:**
1. Build conversation history from messages
2. Stream response chunks
3. Update message content in real-time
4. Mark message as completed when done

**Console Logging:**
```typescript
console.log('[v0] Starting real AI response for:', userMessage);
console.log('[v0] Real AI streaming error:', error);
```

---

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Add Fireworks API key
echo "FIREWORKS_API_KEY=your_key_here" > .env.local

# Run development server
npm run dev
```

### Debugging

Use `console.log("[v0] ...")` for debugging:

```typescript
console.log("[v0] Message state:", messages);
console.log("[v0] API response chunk:", chunk);
```

Remove debug logs when finished to keep console clean.

### Adding New Features

1. **Check existing patterns** - Use Glob/Grep to find similar implementations
2. **Follow design system** - Use established color tokens, spacing, and component patterns
3. **Split large components** - Keep files under ~300 lines for maintainability
4. **Document changes** - Update relevant docs in `/docs/`

### Code Style

- **Use semantic tokens:** `bg-card`, `text-foreground`, not `bg-white`, `text-black`
- **Consistent spacing:** Use `gap-*` instead of margins between siblings
- **TypeScript:** Always type props, state, and function returns
- **Accessibility:** Include ARIA labels, keyboard navigation, focus states

---

## Key Features

### 1. Real-Time Streaming

**What:** AI responses stream word-by-word as they're generated

**Implementation:** 
- Server: `streamText()` from AI SDK v6
- Client: `streamAIResponse()` async generator
- UI: Updates message content on each chunk

**User Experience:** Feels immediate and conversational

### 2. Image Upload & Preview

**What:** Upload images, preview thumbnails, view full-size with rotation

**Features:**
- Drag & drop or file picker
- Thumbnail strip with hover zoom icon
- Lightbox modal with navigation
- Rotate images 90° at a time
- Remove individual images

**Design Pattern:** Matches modal system styling

### 3. Quick Actions

**What:** Pre-built prompt buttons for common tasks

**Options:** Summarize, Plan, Review, Research, Follow-up, Brainstorm

**Location:** Above input when empty (progressive disclosure)

**Behavior:** Click fills input with prompt, ready to send or edit

### 4. Feature Tray

**What:** Expandable grid of advanced features

**Trigger:** "+" button in composer

**Features:** Notebook, Tasks, Think, Tools, Playbooks, Checkpoints, Mode

**Design:** 3-column grid with icons, labels, and badges for active states

### 5. Haptic Feedback (iOS)

**What:** Subtle vibrations for key interactions

**Library:** `ios-vibrator-pro-max`

**Triggers:**
- Message sent
- Feature selected
- Important actions

**Pattern:** Enhances tactile feedback without being intrusive

### 6. Settings & Customization

**What:** Control AI behavior and app preferences

**Categories:**
- Execution mode
- Communication style
- Question frequency
- Task planning
- Memory management

**Architecture:** Split into reusable components for maintainability

### 7. Responsive Design

**Approach:** Mobile-first with desktop enhancements

**Breakpoints:**
- Mobile: Default (< 640px)
- Tablet: `sm:` (≥ 640px)
- Desktop: `md:` (≥ 768px)
- Large: `lg:` (≥ 1024px)

**Patterns:**
- Stack on mobile, side-by-side on desktop
- Touch targets ≥ 44px on mobile
- Hover states desktop-only

---

## Best Practices

### 1. Scroll Container Pattern

**Problem:** Fixed composer hides messages at bottom

**Solution:** Use `flex-1 min-h-0` for scroll area + spacer div

```tsx
<div className="flex-1 min-h-0 overflow-y-auto">
  {/* Messages */}
  <div className="h-44" aria-hidden="true" /> {/* Spacer */}
</div>
```

**Why:** Proper flex containment + visual space for fixed elements

### 2. State Management

**Pattern:** Lift state to parent, pass down props

**Example:** `chat-interface.tsx` owns message state, passes to children

**Benefits:**
- Single source of truth
- Easier debugging
- Predictable updates

### 3. Component Splitting

**When:** File exceeds ~300 lines or has multiple concerns

**Example:** Settings modal split into:
- `settings-modal-content.tsx` (orchestrator)
- `settings-section.tsx` (reusable UI components)
- `settings-constants.ts` (configuration data)

**Benefits:**
- Easier to read and maintain
- Reusable components
- Better testing

### 4. Design Token Usage

**Always Use:**
- `bg-background`, `text-foreground`
- `border-border`, `bg-muted`
- `text-primary`, `bg-primary`

**Never Use:**
- `bg-white`, `text-black`
- `bg-red-500` (use `bg-destructive`)
- Arbitrary colors

**Why:** Consistent theming, easy dark mode support

### 5. Animation & Transitions

**Pattern:** Use Tailwind classes + CSS animations

```tsx
className="transition-all duration-200"
className="animate-in fade-in zoom-in-95"
className="animate-fadeIn" // Custom from tw-animate-css
```

**Guidelines:**
- 150-200ms for micro-interactions
- 300ms for modals/panels
- Use easing for natural feel

### 6. Error Handling

**Pattern:** Try/catch with user-friendly fallbacks

```typescript
try {
  // API call or operation
} catch (error) {
  console.error('[v0] Error description:', error);
  // Show user-friendly message
}
```

**User Experience:**
- Never show raw error messages
- Provide actionable next steps
- Log details for debugging

### 7. Accessibility

**Requirements:**
- ARIA labels on all interactive elements
- Keyboard navigation (Tab, Enter, Escape)
- Focus indicators (`focus:ring-2`)
- Semantic HTML (`<button>` for actions, `<nav>` for navigation)
- Screen reader text (`sr-only` class)

**Testing:**
- Tab through entire interface
- Use with screen reader (VoiceOver/NVDA)
- Check color contrast ratios

---

## Common Patterns

### Modal Structure

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  {/* Backdrop */}
  <div className="absolute inset-0 bg-background/95 backdrop-blur-md" />
  
  {/* Modal */}
  <div className="relative bg-card border border-border rounded-2xl shadow-2xl">
    {/* Header */}
    <div className="px-6 py-4 border-b border-border">
      <h2>Title</h2>
      <button>Close</button>
    </div>
    
    {/* Content */}
    <div className="p-6">
      {/* Content here */}
    </div>
    
    {/* Footer (optional) */}
    <div className="px-6 py-4 border-t border-border">
      {/* Actions */}
    </div>
  </div>
</div>
```

### Panel Structure

```tsx
{isExpanded && (
  <div className="absolute left-0 right-0 bottom-full mb-2">
    <div className="bg-card border border-border rounded-2xl shadow-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3>Panel Title</h3>
        <button onClick={onClose}>
          <X className="size-4" />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Panel content */}
      </div>
    </div>
  </div>
)}
```

### Button Variants

```tsx
// Primary
<button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">

// Secondary
<button className="px-4 py-2 rounded-xl border border-border bg-background hover:bg-muted">

// Ghost
<button className="px-4 py-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground">

// Destructive
<button className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
```

---

## Future Enhancements

### Planned Features

1. **Tool Calling** - Give AI ability to use functions (search, calculations, etc.)
2. **Memory System** - Persist conversation context across sessions
3. **Multi-modal Input** - Voice input, file uploads, screen sharing
4. **Collaborative Features** - Real-time multiplayer, shared chats
5. **Advanced Settings** - Temperature, max tokens, model selection
6. **Export/Share** - Save conversations, create shareable links
7. **Search** - Full-text search across conversation history

### Architecture Considerations

- **State Management:** Consider Zustand/Jotai for complex state
- **Database:** Add Supabase/Neon for persistence
- **Auth:** Implement user accounts and auth flow
- **API Rate Limiting:** Add rate limiting and request queuing
- **Caching:** Cache common responses, optimize API calls

---

## Troubleshooting

### Common Issues

**1. Messages hidden under composer**
- Check scroll container has `flex-1 min-h-0`
- Verify spacer div height matches composer

**2. Streaming not working**
- Check `FIREWORKS_API_KEY` in `.env.local`
- Verify API route returns `toDataStreamResponse()`
- Check browser console for parsing errors

**3. Styles not applied**
- Ensure using design tokens (`bg-card`, not `bg-white`)
- Check Tailwind CSS v4 syntax (no `tailwind.config.js`)
- Verify `globals.css` has design token definitions

**4. Buttons not responding**
- Check `disabled` prop logic
- Verify click handlers are attached
- Test with `console.log("[v0] Button clicked")`

### Debug Checklist

- [ ] Check browser console for errors
- [ ] Verify API key is set correctly
- [ ] Test network tab for API responses
- [ ] Add `console.log("[v0] ...")` at key points
- [ ] Check React DevTools for state values
- [ ] Verify environment variables loaded

---

## Resources

### Documentation

- [UI/UX Style Guide](./UI_UX_STYLE_GUIDE.md) - Design patterns and principles
- [Agent Setup](./AGENT_SETUP.md) - AI integration guide
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Technical architecture

### External Links

- [Next.js Docs](https://nextjs.org/docs)
- [AI SDK v6 Docs](https://sdk.vercel.ai/docs)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Fireworks AI](https://fireworks.ai)

### Community

- Issues: Report bugs and feature requests on GitHub
- Discussions: Ask questions and share ideas
- Contributing: See CONTRIBUTING.md for guidelines

---

## Conclusion

This chat application demonstrates modern web development best practices:
- Clean, maintainable architecture
- Beautiful, accessible UI
- Real AI integration
- Production-ready code

The codebase is designed for extensibility - new features can be added without major refactoring. The component structure, design system, and documentation provide a solid foundation for continued development.

**Happy coding! 🚀**
