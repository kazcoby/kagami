---
paths: src/**/*.{ts,tsx,jsx,html}
---

# Accessibility Standards

## WCAG 2.1 AA Compliance (Required)

All outputs must meet these criteria:

### Perceivable

```typescript
// Text contrast ratios
const CONTRAST_REQUIREMENTS = {
  normalText: 4.5,    // AA requirement
  largeText: 3.0,     // 18pt+ or 14pt+ bold
  uiComponents: 3.0,  // buttons, inputs, icons
};

// Color alone cannot convey meaning
// Always provide secondary indicators
```

### Operable

```typescript
// All interactive elements must be keyboard accessible
interface KeyboardAccessible {
  tabIndex: number;
  onKeyDown: (e: KeyboardEvent) => void;
  ariaLabel: string;
}

// Focus management
const FOCUS_VISIBLE_STYLE = {
  outline: '2px solid #D4A853',
  outlineOffset: '2px',
};
```

### Understandable

```typescript
// Clear, predictable navigation
// Consistent labeling
// Error identification and suggestions
interface FormField {
  id: string;
  label: string;
  required: boolean;
  errorMessage?: string;
  helpText?: string;
}
```

### Robust

```typescript
// Semantic HTML first
// ARIA only when needed
// Valid markup always

// Prefer:
<button onClick={handleClick}>Submit</button>

// Instead of:
<div role="button" tabIndex={0} onClick={handleClick}>Submit</div>
```

## Motion Sensitivity

```typescript
// Always respect user preferences
const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animate(element: HTMLElement, keyframes: Keyframe[]): void {
  if (prefersReducedMotion) {
    // Apply final state immediately
    return;
  }
  element.animate(keyframes, { duration: 300 });
}
```

## Screen Reader Considerations

```typescript
// Announce dynamic content changes
function announceToScreenReader(message: string): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}
```

## Quality Matters Alignment

For educational technology contexts (Kristi's domain):

- Clear navigation structure
- Consistent layout across pages
- Meaningful link text (not "click here")
- Accessible multimedia with captions
- Readable font sizes (16px minimum base)
