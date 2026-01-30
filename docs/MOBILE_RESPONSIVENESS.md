# Mobile Responsiveness & Touch-First Design Guide

## Overview
This app is being refactored to prioritize mobile-first design with fully responsive layouts, touch-optimized interactions, and consistent patterns across all breakpoints.

## Responsive Breakpoints & Strategy
- **Mobile (< 640px)**: Stacked layouts, full-width panels, single-column forms, large touch targets
- **Tablet (640px - 1024px)**: Two-column layouts where appropriate, optimized panel widths
- **Desktop (> 1024px)**: Multi-column layouts, side-by-side panels, hover affordances

## Touch Interactions
- **Minimum tap target size**: 44x44px (mobile), 36x36px (desktop)
- **Spacing between targets**: 8px minimum
- **Hover states**: Desktop only; never rely on hover for functionality
- **Dismissal**: Tap outside panel, swipe down, X button

## Safe Areas & Insets
- Respect notches and bottom bars on mobile devices
- Use `safe-area-inset-*` CSS when needed for notched devices
- Always provide bottom padding on fixed bottom UI (keyboard space + safe area)

## Key Patterns

### Panels & Modals
- **Preferred pattern**: Slide-up panels from bottom (Notebook, Tasks, Think, Tools)
- **Mobile height**: 50-60% of viewport on mobile, taller on tablet/desktop
- **Animation**: Smooth slide-in (150ms), fade (150ms)
- **Dismissal**: Click X, tap outside, swipe down

### Input Controls
- **Button sizing**: 36-40px minimum on mobile
- **Gap between buttons**: 8-12px
- **Overflow behavior**: Horizontal scroll on mobile if needed, but prefer wrapping
- **Label placement**: Below icon on mobile, beside on desktop

### Headers & Navigation
- **Fixed height**: 48px (mobile), 56px (desktop)
- **Content alignment**: Centered text, left menu, right actions
- **Icon spacing**: Consistent 4-8px gaps

### Collaboration Mode
- **Display**: Always visible, inline with controls on desktop; stacked on mobile
- **Buttons**: Full width on mobile (<640px), segmented on desktop
- **Label handling**: Show full labels on mobile and desktop

## Implementation Checklist

### Layout Files to Audit
- [ ] `/components/chat/chat-interface.tsx` - Main container
- [ ] `/components/chat/chat-header.tsx` - Fixed header responsive
- [ ] `/components/chat/input/input-bar.tsx` - Input controls responsive
- [ ] `/components/chat/input/input-area-simplified.tsx` - Panels responsive
- [ ] `/components/chat/quick-actions.tsx` - Horizontal scroll mobile-friendly
- [ ] `/components/chat/collaboration-mode.tsx` - Mode toggle responsive
- [ ] `/components/chat/message-section.tsx` - Message display responsive

### Panel Files
- [ ] `/components/chat/memory-panel.tsx` (Notebook)
- [ ] `/components/chat/task-panel.tsx`
- [ ] `/components/chat/think-panel.tsx`
- [ ] `/components/chat/tools-panel.tsx`
- [ ] `/components/chat/playbooks-panel.tsx`
- [ ] `/components/chat/checkpoints-panel.tsx`

### Image & Content
- [ ] `/components/chat/image-upload.tsx` - Responsive image preview
- [ ] `/components/chat/message.tsx` - Message bubbles responsive
- [ ] `/components/chat/thinking-display.tsx` - Thinking card responsive

## Mobile-First CSS Patterns

### Responsive Spacing
```tailwind
/* Mobile first, then desktop override */
<div className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4">
```

### Responsive Text
```tailwind
<h1 className="text-lg md:text-xl lg:text-2xl">
```

### Responsive Grid/Flex
```tailwind
/* Stack on mobile, side-by-side on desktop */
<div className="flex flex-col md:flex-row gap-3 md:gap-4">
```

### Responsive Panel Heights
```tailwind
/* Taller on mobile (60vh), more compact on desktop (50vh) */
<div className="max-h-[60vh] md:max-h-[50vh] lg:max-h-[45vh]">
```

## Accessibility for Mobile
- Large enough text (16px minimum on inputs to avoid zoom)
- Sufficient color contrast (WCAG AA minimum)
- Touch-friendly labels and descriptions
- Keyboard support for all controls
- Screen reader support for icons

## Testing & Validation
- Test on iPhone 12/13 (390px width)
- Test on iPad (768px width)
- Test landscape orientation
- Test with notch/bottom bar (simulator)
- Test touch interactions (no hover)
- Test keyboard input on mobile
- Verify no horizontal scroll at any breakpoint (unless intentional)

## Future Phases
- Native iOS/Android apps with same codebase
- Gesture support (swipe, pinch)
- Device-specific optimizations (haptic feedback)
- Offline functionality for mobile
