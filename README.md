# Chat UI with Haptic Feedback & AI Agent

A modern, production-ready chat application with real-time AI responses, iOS/Grok-inspired design, advanced composer features, voice mode with 3D visualization, and haptic feedback.

## ✨ Highlights

- **🤖 Real AI Integration** - Fireworks AI (Kimi 2.5) with streaming responses via AI SDK v6
- **📱 iOS-Style Design** - Message bubbles, smooth animations, proper spacing and layout
- **🎨 Orange Design System** - Warm, energetic brand with semantic design tokens
- **📸 Image Management** - Upload, preview, lightbox with rotation and keyboard navigation
- **🎤 Voice Mode** - 3D particle sphere with real-time audio visualization
- **📳 Haptic Feedback** - iOS-style vibrations on key interactions
- **⚙️ Advanced Settings** - AI behavior, communication style, question frequency
- **🔧 Clean Architecture** - Component splitting, hooks, proper state management

---

## 📚 Complete Documentation

### 🚀 Getting Started
- **[PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)** - Complete project guide with architecture, patterns, and examples (718 lines)
- **[AGENT_SETUP.md](docs/AGENT_SETUP.md)** - AI integration guide, API setup, and troubleshooting (233 lines)
- **[IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md)** - Architecture decisions and key changes (193 lines)

### 🎨 Design & UI/UX
- **[UI_UX_STYLE_GUIDE.md](docs/UI_UX_STYLE_GUIDE.md)** - Design system, color palette, component patterns, animations (277 lines)
- **[COMPONENT_REFERENCE.md](docs/COMPONENT_REFERENCE.md)** - API reference for all components with props and examples (844 lines)

### 🏗️ Code Organization
- **[FILE_ORGANIZATION.md](docs/FILE_ORGANIZATION.md)** - 200-line rule, component architecture, best practices (416 lines)
- **[REFACTORING_ROADMAP.md](docs/REFACTORING_ROADMAP.md)** - Step-by-step plan for splitting large files (471 lines)

### 📖 Legacy Documentation
- **[CONVENTIONS.md](./CONVENTIONS.md)** - Original code conventions
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Original design system
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Original architecture
- **[FEATURES.md](./FEATURES.md)** - Original feature reference

---

## 🚀 Core Features

### 💬 Chat & Messaging
- **Real-time AI Responses** - Streaming from Fireworks AI (Kimi 2.5 model)
- **iOS-Style Message Bubbles** - User messages with orange primary color, AI messages with card background
- **Message Actions** - Regenerate, copy, share, like/dislike buttons
- **Proper Scroll Handling** - Flex-based layout with spacer div prevents content hiding under input
- **Message Sections** - Smart grouping with proper spacing (mb-4 between messages)
- **Thinking Display** - Shows AI reasoning process when enabled
- **Tool Call Display** - Visualizes when AI uses tools

### 📝 Advanced Composer
- **Minimal Input Design** - Clean textarea with plus button for features
- **Expandable Tray** - Grid layout showing all available features with active badges
- **Feature Panels** - Memory/Notebook, Tasks, Think levels, Tools, Playbooks, Checkpoints
- **Quick Actions** - One-tap prompts (Summarize, Plan, Review, Research, Follow-up, Brainstorm)
- **Image Upload** - Drag-and-drop with thumbnail preview
- **Voice Input** - Speech-to-text with proper orange recording state (not flashing)
- **Auto-resize Textarea** - Grows with content up to max height
- **Keyboard Shortcuts** - Enter to send, Shift+Enter for new line

### 🖼️ Image Management
- **Upload Preview** - Thumbnail strip with zoom icon on hover
- **Rotation** - Rotate button on each thumbnail (90° increments)
- **Lightbox Modal** - Full-screen viewer with proper modal styling
- **Navigation** - Arrow buttons and keyboard shortcuts (←/→)
- **Image Counter** - Shows current image number (e.g., "2 / 5")
- **Keyboard Hints** - ESC to close, arrow keys to navigate
- **Remove Button** - X button with hover state on each thumbnail

### 🎤 Voice Mode
- **3D Particle Sphere** - React Three Fiber visualization
- **Audio Reactivity** - Particles respond to microphone input
- **Real-time Analysis** - Web Audio API frequency and amplitude detection
- **Recording Controls** - Start/stop with visual feedback
- **Keyboard Mode** - Toggle text input within voice mode
- **Modal Pattern** - Consistent backdrop, header, controls layout

### ⚙️ Settings & Customization
- **Execution Mode** - Autonomous, Collaborative, or Guided
- **Communication Style** - Concise, Balanced, or Detailed  
- **AI Questions** - None, Minimal, Moderate, or Thorough frequency
- **Max Questions Slider** - Limit questions per response (0-5+)
- **Task Planning** - Auto, Always, or Never show breakdowns
- **Memory Toggle** - Enable/disable conversation memory
- **Preferences** - Auto-apply changes, challenge ideas
- **Modular Design** - Split into reusable section components

### 🎨 Design Features
- **Orange Primary Color** - #f97316 with proper state variants
- **Semantic Design Tokens** - bg-card, border-border, text-foreground
- **Consistent Modals** - Blur backdrop, card container, header pattern
- **Smooth Animations** - animate-scaleIn, animate-fadeIn, transitions
- **Proper Button States** - Border, background, text color changes on hover/active
- **Touch Targets** - Minimum 44px for mobile usability
- **Haptic Feedback** - iOS-style vibrations on key actions

---

## 🏗️ Architecture & Tech Stack

### Core Technologies
- **Next.js 16** - React framework with App Router
- **React 19** - Latest with concurrent features
- **TypeScript** - Full type safety
- **Tailwind CSS v4** - Design system with `@theme inline`
- **AI SDK v6** - Vercel AI SDK for streaming
- **Fireworks AI** - Kimi 2.5 language model

### UI & Components
- **Shadcn UI** - Accessible component primitives
- **Radix UI** - Unstyled, accessible base components
- **Lucide Icons** - Consistent icon system
- **React Three Fiber** - 3D voice visualization
- **Streamdown** - Markdown streaming renderer

### Audio & Interaction
- **Web Audio API** - Real-time audio analysis
- **ios-vibrator-pro-max** - Haptic feedback patterns
- **MediaRecorder API** - Voice input capture

### Component Architecture
```
app/
├── api/chat/route.ts           # Streaming AI endpoint
├── layout.tsx                  # Fonts, providers, theme
└── page.tsx                    # Main ChatInterface

components/
├── chat/
│   ├── chat-interface.tsx      # Main container (642 lines - needs split)
│   ├── message.tsx             # iOS-style message bubbles
│   ├── message-section.tsx     # Message grouping
│   ├── composer/
│   │   ├── composer.tsx        # Input system (474 lines - needs split)
│   │   ├── composer-tray.tsx   # Feature selection grid
│   │   └── image-preview.tsx   # Upload preview + lightbox (264 lines - needs split)
│   ├── hooks/                  # Custom hooks for logic
│   ├── *-panel.tsx            # Feature panels
│   └── ai-utils.ts            # Streaming helpers
├── settings/
│   ├── settings-modal-content.tsx  # Main settings (212 lines - acceptable)
│   ├── settings-section.tsx        # Reusable components
│   └── settings-constants.ts       # Configuration options
├── voice/
│   ├── voice-mode-modal.tsx   # Voice UI (217 lines - needs split)
│   └── particle-sphere.tsx    # 3D visualization
└── ui/                        # Shadcn components

lib/
├── agent/base-agent.ts        # AI agent configuration
└── utils.ts                   # Global utilities
```

### State Management Pattern
- **Local State** - `useState` for component-only state
- **Custom Hooks** - Extracted logic (useChatMessages, useChatStreaming, etc.)
- **Context API** - Theme, modals (via modal-provider)
- **Server State** - AI SDK handles streaming state

### Layout Strategy
- **Flexbox First** - Most layouts use `flex` with `gap`
- **Proper Scroll Container** - `flex-1 min-h-0` pattern with spacer div
- **Mobile First** - Design for mobile, enhance for desktop
- **Semantic HTML** - `<main>`, `<header>`, proper ARIA labels

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Fireworks AI API key ([Get one here](https://fireworks.ai))

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd chat-ui

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Add your API key
# FIREWORKS_API_KEY=your_key_here
```

### Development

```bash
# Start dev server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

```env
# Required
FIREWORKS_API_KEY=your_fireworks_api_key

# Optional (future)
DATABASE_URL=your_database
AUTH_SECRET=your_secret
```

---

## 🛠️ Development Guidelines

### Code Organization (200-Line Rule)
Files should not exceed 200 lines. When they do:
1. Extract hooks to separate files
2. Split UI into smaller components  
3. Move utilities to helper files
4. Create wrapper components for composition

See **[FILE_ORGANIZATION.md](docs/FILE_ORGANIZATION.md)** and **[REFACTORING_ROADMAP.md](docs/REFACTORING_ROADMAP.md)** for detailed plans.

### Component Design Principles
1. **Single Responsibility** - Each component does ONE thing
2. **Composition Over Props** - Build complex UIs from simple pieces
3. **Clear Interfaces** - Well-defined TypeScript props
4. **Proper State Co-location** - State lives closest to where it's used

### Styling Guidelines
- Use semantic design tokens (`bg-card`, `text-foreground`, `border-border`)
- Orange primary color (#f97316) for brand elements
- Consistent button patterns: `border border-border bg-background hover:bg-muted`
- Modal pattern: blur backdrop + card container + header with close button
- Touch targets: minimum 44px (`h-11 w-11` or larger)

See **[UI_UX_STYLE_GUIDE.md](docs/UI_UX_STYLE_GUIDE.md)** for complete guidelines.

### Adding New Features
1. Check existing patterns in **[COMPONENT_REFERENCE.md](docs/COMPONENT_REFERENCE.md)**
2. Follow design system in **[UI_UX_STYLE_GUIDE.md](docs/UI_UX_STYLE_GUIDE.md)**
3. Keep files under 200 lines
4. Update documentation

### Testing Checklist
- [ ] Works on mobile and desktop
- [ ] Keyboard navigation functional
- [ ] Proper loading/error states
- [ ] Haptic feedback where appropriate
- [ ] Animations smooth and purposeful
- [ ] TypeScript types exported and reused

---

## 🎯 Recent Major Changes

This session focused on:

### UI/UX Improvements
- ✅ iOS/Grok-style message bubbles with proper spacing
- ✅ Composer refactored with minimal input + expandable tray
- ✅ Image preview with lightbox, rotation, and keyboard navigation
- ✅ Microphone button with proper orange state (not flashing red)
- ✅ Proper scroll handling with spacer div (no hardcoded padding)
- ✅ Message actions always visible (regenerate, copy, share, like/dislike)

### Settings & Configuration
- ✅ Settings modal refactored into reusable section components
- ✅ AI Questions setting added (frequency + max questions slider)
- ✅ Modular design with SettingsSection, SettingsRadioGroup, SettingsToggle, SettingsSlider

### AI Integration
- ✅ Real AI agent using Fireworks AI (Kimi 2.5)
- ✅ AI SDK v6 integration with streaming
- ✅ API route at `/api/chat` with proper error handling
- ✅ Custom streaming parser for AI SDK v6 data format

### Documentation
- ✅ PROJECT_OVERVIEW.md - Complete guide (718 lines)
- ✅ COMPONENT_REFERENCE.md - All components documented (844 lines)
- ✅ UI_UX_STYLE_GUIDE.md - Design system (277 lines)
- ✅ AGENT_SETUP.md - AI integration guide (233 lines)
- ✅ FILE_ORGANIZATION.md - Code structure (416 lines)
- ✅ REFACTORING_ROADMAP.md - Improvement plan (471 lines)
- ✅ IMPLEMENTATION_SUMMARY.md - Architecture decisions (193 lines)

---

## 📈 Roadmap

### Current Phase: Refactoring
- [ ] Split chat-interface.tsx (642 lines → ~150 each)
- [ ] Split composer.tsx (474 lines → ~120 each)
- [ ] Split image-preview.tsx (264 lines → ~80 each)
- [ ] Split voice-mode-modal.tsx (217 lines → ~80 each)

### Next Phase: Features
- [ ] User authentication
- [ ] Persistent conversation history (database)
- [ ] Tool calling (web search, calculator, code execution)
- [ ] Multi-modal support (document upload, PDFs)
- [ ] Collaboration features

### Future: Enhancements
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Browser extension
- [ ] Public API

---

## 🐛 Known Issues

1. **AI SDK v6 Streaming** - Custom parser needed for data format
2. **Image Rotation** - Not persisted (resets on page reload)
3. **Voice Mode iOS** - Safari microphone permissions tricky
4. **Scroll Jump** - Occasional on rapid messages

See troubleshooting sections in documentation.

---

## 📝 License

MIT License - See LICENSE file

---

## 🙏 Acknowledgments

- **Vercel** - AI SDK and Next.js
- **Fireworks AI** - Fast, affordable LLM inference
- **Shadcn** - Beautiful component system
- **Tailwind Labs** - Excellent CSS framework

---

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Built with ❤️ using Next.js, React, TypeScript, and AI SDK**
