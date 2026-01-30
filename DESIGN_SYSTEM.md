# Design System Documentation

## Color Palette

### Primary Color - Orange Accent
The app uses a vibrant orange as its primary brand color, applied consistently across interactive elements, accents, and key UI components.

**Primary Color:** `hsl(24 95% 53%)` - `#FC6D08`
- **Usage:** Primary buttons, active states, links, focus indicators, accent elements
- **Foreground:** White (`hsl(0 0% 100%)`) for text on primary backgrounds

**Primary Variants:**
- `--primary-hover`: `hsl(24 95% 48%)` - Hover state for primary elements
- `--primary-light`: `hsl(24 95% 93%)` - Light backgrounds, subtle accents (light mode)
- `--primary-lighter`: `hsl(24 95% 97%)` - Very subtle backgrounds (light mode)

### Semantic Colors

#### Background & Surface
- `--background`: Base page background
- `--card`: Card and elevated surface background
- `--popover`: Popover and dropdown background
- `--muted`: Subtle background for secondary elements

#### Text & Content
- `--foreground`: Primary text color
- `--muted-foreground`: Secondary text, labels, descriptions
- `--card-foreground`: Text on card surfaces

#### Interactive
- `--ring`: Focus ring color (matches primary orange)
- `--border`: Default border color
- `--input`: Input field borders

#### Secondary & Accent
- `--secondary`: Secondary backgrounds with orange tint
- `--accent`: Accent backgrounds (uses primary orange)
- `--destructive`: Error and destructive actions

## Typography

### Font Scale
- Base: 16px
- Small: 0.875rem (14px)
- Large: 1.125rem (18px)
- XL: 1.25rem (20px)
- 2XL: 1.5rem (24px)
- 3XL: 1.875rem (30px)

### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing & Layout

### Border Radius
- `--radius-sm`: calc(var(--radius) - 4px) → ~6px
- `--radius-md`: calc(var(--radius) - 2px) → ~8px
- `--radius-lg`: var(--radius) → ~10px
- `--radius-xl`: calc(var(--radius) + 4px) → ~14px

### Common Spacing
Use Tailwind's spacing scale (multiples of 0.25rem):
- `gap-2`: 0.5rem (8px)
- `gap-4`: 1rem (16px)
- `gap-6`: 1.5rem (24px)
- `gap-8`: 2rem (32px)

## Components

### Buttons

**Primary Button:**
```tsx
className="bg-primary text-white hover:bg-primary-hover rounded-full px-4 py-2"
```

**Secondary Button:**
```tsx
className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full px-4 py-2"
```

**Ghost Button:**
```tsx
className="hover:bg-muted text-foreground rounded-full px-4 py-2"
```

### Cards
```tsx
className="bg-card border border-border rounded-2xl p-6 shadow-sm"
```

### Input Fields
```tsx
className="bg-card border border-input rounded-xl px-4 py-2 focus:ring-2 focus:ring-ring"
```

## Animations

### Built-in Animations
- `animate-fadeIn`: Fade in with slight upward motion
- `animate-scaleIn`: Scale up from 90% to 100%
- `animate-pop`: Quick scale pulse effect
- `animate-pulse-primary`: Opacity pulse with primary color context
- `animate-ping-primary`: Expanding ping effect for orange elements

### Transitions
Default transition duration: 200ms
Common easing: `ease-out` or `cubic-bezier(0.4, 0, 0.6, 1)`

## Utility Classes

### Primary Color Utilities
- `.glow-primary`: Orange glow effect
- `.glow-primary-sm`: Subtle orange glow
- `.bg-primary-gradient`: Orange gradient background
- `.focus-ring-primary`: Orange focus outline

### Gradients
- `.bg-gradient-radial`: Radial gradient with CSS variable stops

## Best Practices

### Color Usage
1. **Always use semantic tokens** instead of hardcoded colors
   - ✅ `bg-primary` 
   - ❌ `bg-orange-500`

2. **Primary color for:**
   - Call-to-action buttons
   - Active navigation items
   - Interactive icons
   - Focus indicators
   - Important accents

3. **Avoid primary overuse:**
   - Not every interactive element needs primary color
   - Use muted/secondary for less important actions
   - Maintain visual hierarchy

### Accessibility
- **Contrast ratios:** Primary orange on white exceeds WCAG AA (4.5:1)
- **Focus indicators:** Always visible with 2px ring
- **Interactive states:** Clear hover, active, and disabled states
- **Color independence:** Don't rely solely on color to convey information

### Dark Mode
The design system automatically adapts to dark mode with adjusted:
- Background and foreground colors
- Border and muted tones
- Primary color remains consistent (orange) for brand recognition
- Adjusted primary-light variants for dark backgrounds

## Usage Examples

### Voice Mode Button
```tsx
<button className="bg-primary text-white rounded-full h-10 w-10 hover:bg-primary-hover transition-all shadow-sm hover:shadow-md">
  <AudioWaveform className="h-5 w-5" />
</button>
```

### Microphone Button (Active State)
```tsx
<button className="bg-primary text-white rounded-full w-16 h-16 hover:bg-primary-hover shadow-lg scale-105">
  <Mic className="size-6" />
  <span className="absolute inset-0 rounded-full bg-primary animate-ping-primary opacity-75" />
</button>
```

### Card with Orange Accent
```tsx
<div className="bg-card border border-border rounded-3xl p-6 relative">
  <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
  {/* Card content */}
</div>
```

## File Structure

```
/app
  /styles
    /animations.css    # Keyframes and animation utilities
    /prose.css         # Markdown content styling
    /utilities.css     # Custom utility classes
  globals.css          # Main theme tokens and imports
```

## Migration Notes

When updating components to use the standardized orange system:
1. Replace any `bg-orange-*` with `bg-primary`
2. Replace hardcoded orange colors with semantic tokens
3. Use `text-white` or `text-primary-foreground` on primary backgrounds
4. Apply `hover:bg-primary-hover` for interactive states
5. Use provided utility classes for glows and special effects
