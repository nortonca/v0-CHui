# Code Conventions & Design Patterns

This document captures the established patterns and conventions for this application. Follow these guidelines to maintain consistency.

---

## Modal System

### Structure Pattern

All modals MUST follow this exact structure:

```tsx
export default function ExampleModalContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-center h-full p-4">
      <div
        className={cn(
          "bg-card border border-border rounded-2xl shadow-2xl",
          "w-full max-w-lg max-h-[calc(100vh-8rem)] overflow-hidden",
          "animate-scaleIn flex flex-col"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="example-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 id="example-modal-title" className="text-lg font-semibold text-foreground">
            Title
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-muted/50 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Modal content here */}
        </div>

        {/* Footer (optional) */}
        <div className="px-6 py-4 border-t border-border">
          {/* Footer buttons */}
        </div>
      </div>
    </div>
  )
}
```

### Required Elements

1. **Outer wrapper**: `flex items-center justify-center h-full p-4`
2. **Card container**: `bg-card border border-border rounded-2xl shadow-2xl`
3. **Stop propagation**: `onClick={(e) => e.stopPropagation()}` on card
4. **Aria attributes**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
5. **Max height constraint**: `max-h-[calc(100vh-8rem)]` or similar
6. **Animation**: `animate-scaleIn`

### Modal Provider Usage

```tsx
const { openModal, closeModal } = useModal()

// Opening a modal
openModal("modal-id", <ModalContent onClose={() => closeModal("modal-id")} />, () => {})
```

---

## Hover States

### DO: Subtle Darkening

```tsx
// Primary button
className="bg-primary hover:bg-primary/90"

// Ghost/secondary elements  
className="hover:bg-muted/50"

// Cards and list items
className="hover:bg-muted/50"
```

### DON'T: Color Changes

```tsx
// WRONG - Don't change to accent/primary color on hover
className="hover:bg-accent"
className="hover:bg-primary"
className="hover:text-primary"

// WRONG - Don't use color-shifting hovers
className="bg-muted hover:bg-primary/20"
```

### Principle

Hover states provide feedback through **subtle darkening**, not color changes. This creates a professional, cohesive experience.

---

## Icons

### Always Use Lucide Icons

```tsx
// CORRECT
import { Search, Calculator, Code, Palette } from "lucide-react"

<Search className="h-4 w-4 text-muted-foreground" />
```

### Never Use Emojis as Icons

```tsx
// WRONG - Never use emojis
const tools = [
  { id: "search", icon: "🔍" },  // BAD
  { id: "calc", icon: "🧮" },    // BAD
]

// CORRECT - Use Lucide components
const tools = [
  { id: "search", Icon: Search },
  { id: "calc", Icon: Calculator },
]
```

---

## Animations

### Keep Animations Subtle

```tsx
// GOOD - Simple, subtle feedback
className="transition-colors"
className="transition-all duration-200"

// GOOD - Single subtle animation
{isActive && <span className="animate-pulse opacity-20" />}
```

### Avoid Animation Overload

```tsx
// BAD - Too many overlapping animations
{isActive && (
  <>
    <span className="animate-ping opacity-75" />
    <span className="animate-pulse" />
    <span className="animate-bounce" />
  </>
)}

// BAD - High opacity pings are distracting
className="animate-ping opacity-75"
```

### Principle

Animations should be **barely noticeable** - they guide attention without distracting.

---

## Button Sizing Consistency

### Match Related Button Sizes

Buttons that appear together should have consistent dimensions:

```tsx
// Microphone button
className="rounded-full h-8 w-8"
<Mic className="h-4 w-4" />

// Voice toggle button (should match)
className="rounded-full h-8 w-8"
<AudioWaveform className="h-4 w-4" />

// Send button (can scale when active)
className={cn("rounded-full h-8 w-8", hasText && "scale-110")}
```

### Scaling Rules

- Only scale buttons that **change function** (e.g., voice → send)
- Don't scale icons on hover for static buttons
- Use `scale-105` or `scale-110` max

---

## Visual Effects

### Avoid Unnecessary Decorative Elements

```tsx
// BAD - Unnecessary gradient fog/glow
<div className="bg-gradient-radial from-primary/20 via-transparent to-transparent" />
<div className="bg-primary/10 blur-3xl animate-pulse" />

// GOOD - Clean, content-focused
<Canvas>
  <ParticleSphere />
</Canvas>
```

### When Effects Are Appropriate

- Loading states (subtle pulse)
- Active/recording indicators (minimal)
- Focus rings for accessibility

---

## Responsive Design

### Modal Responsiveness

```tsx
// Account for headers/safe areas
className="max-h-[calc(100vh-5rem)]"

// Different padding for mobile/desktop
className="px-4 py-3 md:px-6 md:py-4"

// Anchor modals appropriately
className="items-end md:items-center"  // Bottom on mobile, center on desktop

// Account for header offset
className="pt-14"  // Clear the fixed header
```

### Always Test Constraints

- Modals must not extend under headers
- Content must not overflow viewport
- Touch targets must be accessible (min 44px)

---

## Color System

### Use Semantic Tokens

```tsx
// CORRECT
className="bg-card text-foreground border-border"
className="bg-primary text-primary-foreground"
className="text-muted-foreground"

// WRONG - Hardcoded colors
className="bg-white text-gray-900 border-gray-200"
className="bg-orange-500"
```

### Primary Color (Orange) Usage

- Primary actions: `bg-primary text-white`
- Selected states: `bg-primary/10 text-primary`
- Borders on active: `border-primary/20`
- Hover darkening: `hover:bg-primary/90`

---

## Component Patterns

### Button with Dropdown

```tsx
<div className="relative" ref={dropdownRef}>
  <button onClick={() => setIsOpen(!isOpen)}>
    Trigger
  </button>
  
  {isOpen && (
    <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-xl shadow-lg">
      {/* Dropdown content */}
    </div>
  )}
</div>
```

### Selection Chips

```tsx
{selectedItems.map((item) => (
  <span
    key={item}
    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
  >
    {item}
  </span>
))}
```

---

## Checklist Before Committing

- [ ] Modals follow the standard structure pattern
- [ ] Hover states darken, don't change color
- [ ] All icons are Lucide components, no emojis
- [ ] Animations are subtle and minimal
- [ ] Related buttons have consistent sizing
- [ ] No unnecessary decorative gradients/glows
- [ ] Responsive: tested on mobile viewport
- [ ] Uses semantic color tokens, no hardcoded colors
- [ ] Accessibility: aria labels, keyboard support
