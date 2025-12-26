---
paths: src/**/*.{ts,tsx}
---

# WebXR Development Standards

## Session Management

Always check XR support before initialization:

```typescript
async function initializeXR(): Promise<XRSession | null> {
  if (!navigator.xr) {
    console.warn('WebXR not supported');
    return null;
  }

  const supported = await navigator.xr.isSessionSupported('immersive-vr');
  if (!supported) {
    console.warn('Immersive VR not supported');
    return null;
  }

  try {
    return await navigator.xr.requestSession('immersive-vr');
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      console.warn('XR permission denied');
    }
    return null;
  }
}
```

## Frame Rate Targets

- VR Mode: 72-90 fps (11-14ms per frame)
- Desktop: 60 fps (16.67ms per frame)
- Mobile: 30-60 fps (16.67-33.33ms per frame)

## Input Handling

```typescript
// Controller input must go through InputManager
interface XRInput {
  source: XRInputSource;
  type: 'controller' | 'hand';
  handedness: 'left' | 'right' | 'none';
}

// Normalize all input values to [-1, 1] range
function normalizeInput(value: number, min: number, max: number): number {
  return (value - min) / (max - min) * 2 - 1;
}
```

## Scene Structure (Kagami)

```typescript
// Mirror room configuration
const MIRROR_ROOM = {
  size: 30,                    // 30x30x30 units
  metalness: 0.98,
  roughness: 0.02,
  environmentIntensity: 2.5,
} as const;

// Cube camera for reflections
const CUBE_CAMERA = {
  textureSize: 512,
  updateRate: 30,              // frames between updates
} as const;
```

## Chapter Configuration

Each Kagami chapter must define:

```typescript
interface ChapterConfig {
  id: number;                  // 1-8
  name: string;
  particles: number;           // max 80 total
  effect: ParticleEffect;
  color: string;               // Colony color
  breathingRange: [number, number]; // [0.5, 1.5]
}
```

## Error Handling

```typescript
// Always handle XR session lifecycle gracefully
session.addEventListener('end', () => {
  // Clean up resources
  // Fall back to non-VR mode
  // Preserve user state
});
```

## Accessibility in VR

- Provide non-VR fallback for all experiences
- Support seated, standing, and room-scale modes
- Include motion sickness comfort options
- Allow controller OR gaze input
