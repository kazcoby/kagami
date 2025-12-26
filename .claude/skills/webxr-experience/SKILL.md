---
name: webxr-experience
description: Create immersive WebXR experiences using Three.js. Design VR/AR scenes, implement spatial interactions, and optimize for headset performance. Use when building or enhancing WebXR features.
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

# WebXR Experience Development

Specializes in creating immersive WebXR experiences following the Kagami framework and Craft standards.

## Core Capabilities

### Scene Creation
- Initialize Three.js scenes with WebXR support
- Configure VR/AR session types
- Set up camera rigs for immersive viewing

### Particle Systems
- Create dynamic particle effects (Kagami chapters)
- Implement breathing animations (0.5-1.5x scale)
- Optimize for VR frame rates

### Spatial Interactions
- Handle controller input (select, squeeze)
- Implement hand tracking visualization
- Support gaze-based interaction fallbacks

## Performance Constraints

```javascript
const PERF = {
  maxOrbs: 80,           // Total particle limit
  maxLights: 7,          // Point lights maximum
  cubeUpdateRate: 30,    // Reflection update frequency
  sphereSegments: 16,    // Geometry detail level
  enableGlow: true       // Sprite glow effects
};
```

## Chapter Templates

### Void (Chapter 1)
```typescript
createVoidChapter(): ChapterConfig {
  return {
    particles: 60,
    colonies: 7,
    effect: 'polka-dot',
    color: theme.colors.primary.gold
  };
}
```

### Ignition (Chapter 2 - Spark)
```typescript
createIgnitionChapter(): ChapterConfig {
  return {
    particles: 50,
    effect: 'explosive-spark',
    color: theme.colors.colonies.spark.color
  };
}
```

## Accessibility Requirements

- Provide non-VR fallback mode
- Support keyboard navigation
- Announce chapter changes to screen readers
- Respect prefers-reduced-motion
- Ensure WCAG 2.1 AA compliance

## Quality Verification

All WebXR outputs must:
1. Maintain 60fps on target devices
2. Handle XR session gracefully
3. Provide meaningful interactions
4. Include accessibility fallbacks
5. Meet Craft Essential tier minimum
