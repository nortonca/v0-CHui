# UI/UX Style Guide - Chat Application

## Design Philosophy

This app follows a **Figma/Linear-inspired minimal design** approach with **iOS/Grok-style messaging**. The core principles are:

1. **Progressive Disclosure** - Default states are minimal; advanced features reveal on interaction
2. **Mobile-First** - Large touch targets, comfortable spacing, responsive scaling
3. **Calm & Intentional** - No visual clutter, purposeful use of color and space
4. **Consistency** - Unified patterns across all components

---

## Color System

### Primary Color: Orange (`hsl(24 95% 53%)`)
- Used for: Primary buttons, send button, voice mode, active states, links
- Light variant: `primary/10` for subtle backgrounds
- Border variant: `primary/30` for active borders

### Semantic Colors
| Token | Usage |
|-------|-------|
| `bg-background` | Page/app background |
| `bg-card` | Cards, modals, message bubbles |
| `bg-muted` | Hover states, subtle backgrounds |
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary text, icons |
| `border-border` | All borders |
| `text-primary` | Active/accent text, links |
| `bg-destructive/10` | Error backgrounds (avoid for actions) |

### State Colors
- **Recording/Active**: `bg-primary/10 border-primary/30 text-primary` (orange tones)
- **Hover**: `hover:bg-muted` or `hover:bg-primary/90`
- **Disabled**: `opacity-50 cursor-not-allowed`
- **Focus**: `focus:ring-2 focus:ring-primary focus:ring-offset-2`

---

## Typography

### Font Sizes
- Body text: `text-[15px]` with `leading-relaxed`
- Small text: `text-sm` (14px)
- Extra small: `text-xs` (12px)
- Labels/badges: `text-[10px]` to `text-xs`

### Text Colors
- Primary content: `text-foreground`
- Secondary/helper: `text-muted-foreground`
- Placeholder: `placeholder:text-muted-foreground/50`

---

## Spacing & Layout

### Container Padding
- Mobile: `px-4` (16px)
- Desktop: `px-6` (24px)
- Inside cards/bubbles: `p-3` or `px-4 py-3`

### Gap/Spacing
- Between messages: `mb-4`
- Between elements in a row: `gap-2` to `gap-3`
- Between icon buttons: `gap-0.5` to `gap-1`

### Max Widths
- Message bubbles: `max-w-[85%] sm:max-w-[75%]`
- Chat container: `max-w-3xl mx-auto`

---

## Component Patterns

### Buttons

#### Primary Button (Send, Voice Mode)
```
className="w-9 h-9 rounded-full bg-primary text-primary-foreground 
           hover:bg-primary/90 active:scale-95 transition-all duration-200"
```

#### Secondary/Outline Button (Microphone, Plus)
```
className="w-9 h-9 rounded-full border border-border bg-background 
           hover:bg-muted text-muted-foreground hover:text-foreground 
           transition-all duration-200"
```

#### Active State Button
```
className="bg-primary/10 border-primary/30 text-primary"
```

#### Icon Action Buttons (Copy, Share, etc.)
```
className="p-2 text-muted-foreground hover:text-foreground 
           hover:bg-muted rounded-xl transition-colors"
```

### Message Bubbles

#### User Message (iOS-style)
```
className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm 
           px-4 py-3 shadow-sm"
```

#### AI/System Message
```
className="bg-card border border-border text-foreground rounded-2xl 
           rounded-tl-sm px-4 py-3 shadow-sm"
```

### Cards & Panels

#### Standard Card
```
className="bg-card border border-border rounded-2xl shadow-sm"
```

#### Elevated Card (Modals, Popovers)
```
className="bg-card border border-border rounded-2xl md:rounded-3xl shadow-2xl"
```

### Input Fields

#### Text Input / Textarea
```
className="w-full bg-transparent border-0 outline-none resize-none
           text-[15px] text-foreground placeholder:text-muted-foreground/50
           leading-relaxed"
```

#### Input Container
```
className="bg-card border border-border rounded-2xl shadow-sm p-3
           focus-within:border-primary/30 focus-within:shadow-md
           transition-all duration-200"
```

---

## Modal Pattern

All modals follow this structure:

```jsx
{/* Backdrop */}
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div className="absolute inset-0 bg-background/95 backdrop-blur-md animate-fadeIn" />
  
  {/* Modal Container */}
  <div className="relative w-full max-w-lg bg-card border border-border 
                  rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">
    
    {/* Header */}
    <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 
                    border-b border-border">
      <h2 className="text-lg font-semibold text-foreground">Title</h2>
      <button className="p-2 -mr-2 hover:bg-muted rounded-xl transition-colors">
        <X className="size-5 text-muted-foreground" />
      </button>
    </div>
    
    {/* Content */}
    <div className="p-4 md:p-6">...</div>
    
    {/* Footer (optional) */}
    <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border">
      ...
    </div>
  </div>
</div>
```

---

## Animation Patterns

### Entry Animations
- Modals: `animate-scaleIn` (scale 0.95 -> 1 with fade)
- Backdrops: `animate-fadeIn`
- Panels/Trays: `animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2`

### Transitions
- All interactive elements: `transition-all duration-200` or `transition-colors`
- Transform effects: `active:scale-95`

### Hover States
- Buttons: `hover:bg-muted` or `hover:bg-primary/90`
- Icons: `hover:text-foreground`

---

## Touch Targets

### Minimum Sizes
- Buttons: `w-9 h-9` (36px) minimum
- Icon buttons with padding: `p-2` with icon size `h-4 w-4`
- Tappable cards/items: minimum height 44px

### Spacing for Touch
- Between tappable elements: `gap-2` minimum
- Around buttons in groups: `gap-0.5` to `gap-1`

---

## Progressive Disclosure

### Composer Pattern
1. **Default State**: Textarea + Plus button + Mic + Voice/Send
2. **Plus Button**: Reveals feature tray grid
3. **Feature Selection**: Opens dedicated panel
4. **Active Indicators**: Badge shows count of active features

### Panel Pattern
- Panels slide up from bottom
- Each panel is self-contained with its own header
- Panels auto-close when another is selected

---

## Scroll & Layout

### Proper Scroll Container
```jsx
<div className="flex-1 min-h-0 overflow-y-auto scroll-smooth">
  <div className="max-w-3xl mx-auto pb-4">
    {/* Content */}
  </div>
  {/* Spacer for fixed composer */}
  <div className="h-44 sm:h-36" aria-hidden="true" />
</div>
```

### Fixed Bottom Elements
- Composer is `fixed bottom-0 left-0 right-0`
- Add spacer div inside scroll area to prevent content hiding

---

## Accessibility

### ARIA Labels
- All icon-only buttons need `aria-label`
- Modals need `role="dialog"` and `aria-modal="true"`

### Keyboard Navigation
- Escape closes modals/panels
- Arrow keys for navigation in lists
- Enter/Space for button activation

### Focus Management
- `focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`
- Tab order follows visual order

---

## Do's and Don'ts

### Do
- Use semantic color tokens (`bg-card`, `text-foreground`)
- Keep buttons consistently sized (w-9 h-9 for circular)
- Use `rounded-2xl` for cards, `rounded-full` for circular buttons
- Apply `shadow-sm` for subtle depth, `shadow-2xl` for modals
- Use `transition-all duration-200` for smooth interactions

### Don't
- Use raw colors (`bg-red-500`) - use tokens (`bg-destructive`)
- Use `animate-pulse` for active states - it's too distracting
- Mix border styles - stick to `border border-border`
- Use hardcoded padding for scroll compensation - use spacer divs
- Hide important actions with `opacity-0` - keep them visible
