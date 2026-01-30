# Composer Refactor Analysis

## Problem
Two competing implementations of the message input bar exist:
1. **Old System**: `input-area-simplified.tsx` → `input-bar.tsx` → `input-controls.tsx` + `input-actions.tsx`
2. **New System**: `composer.tsx` → `composer-tray.tsx` + `composer-panels.tsx`

## Current State

### Old System (components/chat/input/*)
**What it does well:**
- ✅ Comprehensive panel management (Memory, Tasks, Playbooks, Checkpoints, Think, Tools)
- ✅ Proper panel state tracking with exclusive behavior (only one open at a time)
- ✅ Input controls with clear button states and indicators
- ✅ Voice mode modal integration in InputBar
- ✅ Selection state preservation for textarea
- ✅ Image upload button with proper state
- ✅ Collaboration mode toggle
- ✅ Think and Tools panels with slide-up animations
- ✅ Quick actions with prompt insertion

**Issues:**
- ❌ Complex nested component structure (4 levels deep)
- ❌ Props drilling through multiple layers
- ❌ Multiple small buttons clustered together - overwhelming UI
- ❌ Not mobile-first design
- ❌ hasTyped state used incorrectly

### New System (components/chat/composer/*)
**What it does well:**
- ✅ Minimal, Figma-inspired default state (just textarea + plus button + send/voice)
- ✅ Progressive disclosure via tray (advanced features hidden by default)
- ✅ Mobile-first with large touch targets
- ✅ Single unified component with flat structure
- ✅ hasContent derived from input (no redundant state)
- ✅ Proper microphone recording state with visual feedback
- ✅ Voice mode modal integration
- ✅ Active feature count badge on plus button
- ✅ Clean animation for tray opening

**Issues:**
- ❌ Missing Quick Actions integration
- ❌ Panel management duplicated in ComposerPanels (not using existing panel components properly)
- ❌ Tasks state duplicated locally
- ❌ Image preview not integrated with upload
- ❌ Collaboration mode buried in tray instead of visible

## Decision: Merge into New Composer

The new Composer has the right UX approach (minimal + progressive disclosure), but needs:
1. Integrate existing panel components properly
2. Add Quick Actions back
3. Fix panel state management
4. Ensure all buttons work correctly
5. Remove old input system completely

## Implementation Plan

1. **Keep** `composer.tsx` as the base
2. **Integrate** existing panel components:
   - MemoryPanel
   - TaskPanel  
   - PlaybooksPanel
   - CheckpointsPanel
   - ThinkPanel
   - ToolsPanel
3. **Add** QuickActions above composer
4. **Fix** panel state management (exclusive behavior)
5. **Ensure** microphone and voice mode buttons work
6. **Delete** old input system files:
   - input-area-simplified.tsx
   - input-bar.tsx
   - input-controls.tsx
   - input-actions.tsx

## Expected Result
Single, clean Composer component with:
- Minimal default state (textarea + plus + send/mic/voice)
- Progressive disclosure via tray
- All advanced features accessible but hidden
- Mobile-first responsive design
- No redundant state
- All button logic working correctly
