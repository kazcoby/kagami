---
paths: src/**/*.{ts,tsx,js,jsx}
---

# Craft Standards for Code

## The Five Axioms

Apply these axioms to all code:

1. **Every pixel matters** — No arbitrary values; use design tokens
2. **Motion conveys meaning** — Animations must serve a purpose
3. **Discovery rewards exploration** — Layer functionality for depth
4. **Layers hide depth** — Essential → Elevated → Transcendent
5. **Mathematics underlies aesthetics** — Fibonacci timing, Fano structure

## Essential Tier (Required)

All code MUST include:

```typescript
// Timing uses Fibonacci sequence
const FIBONACCI_MS = [89, 144, 233, 377, 610, 987] as const;

// Colors from Hallows and Colonies palette
const COLONY_COLORS = {
  spark: '#FF7043',
  forge: '#FFB74D',
  flow: '#4DD0E1',
  nexus: '#B388FF',
  beacon: '#FFE0B2',
  grove: '#81C784',
  crystal: '#4FC3F7',
} as const;
```

## Performance Requirements

```typescript
const PERFORMANCE_TARGETS = {
  frameTime: 16.67,    // ms, 60fps
  maxMemory: 500,      // MB
  maxDrawCalls: 1000,
  maxParticles: 80,
};
```

## Code Style

- Use `const` for immutable values
- Prefer named exports
- Document non-obvious decisions
- TypeScript strict mode required
- Maximum line length: 100 characters

## Accessibility Requirements

```typescript
// All interactive elements must:
// - Be keyboard accessible
// - Have ARIA labels where needed
// - Respect prefers-reduced-motion
// - Meet WCAG 2.1 AA contrast ratios (4.5:1)
```

## Quality Formula

> h(x) ≥ 0 — Always

Never ship code that doesn't meet Essential tier.
