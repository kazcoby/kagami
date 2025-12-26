/**
 * Craft Utilities — Quality Verification Tools
 *
 * "h(x) ≥ 0 — Always"
 *
 * These utilities help verify that outputs meet Craft standards
 * across Essential, Elevated, and Transcendent tiers.
 */

// Fibonacci timing sequence for animations
export const FIBONACCI_MS = [89, 144, 233, 377, 610, 987] as const;

// Catastrophe theory easing names
export const EASING_NAMES = {
  fold: 'cubic-bezier(0.16, 1, 0.3, 1)',      // Sudden emergence
  cusp: 'cubic-bezier(0.34, 1.56, 0.64, 1)',  // Decisive transition
  swallowtail: 'cubic-bezier(0.4, 0, 0.2, 1)', // Recovery overshoot
  butterfly: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Complex oscillation
} as const;

// Performance thresholds
export const PERFORMANCE_TARGETS = {
  frameTime: 16.67,    // ms, 60fps target
  maxMemory: 500,      // MB
  maxDrawCalls: 1000,
  maxParticles: 80,
  bundleSize: 500,     // KB gzipped
} as const;

// Contrast ratios for accessibility
export const CONTRAST_REQUIREMENTS = {
  normalText: 4.5,     // WCAG AA
  largeText: 3.0,      // 18pt+ or 14pt+ bold
  uiComponents: 3.0,   // buttons, inputs, icons
} as const;

/**
 * Craft verification levels
 */
export enum CraftLevel {
  Essential = 'essential',
  Elevated = 'elevated',
  Transcendent = 'transcendent',
}

/**
 * Essential tier requirements checklist
 */
export const ESSENTIAL_REQUIREMENTS = [
  'customCursor',
  'particleSystem',
  'breathingBackgrounds',
  'shimmerAnimations',
  'hover3dTransforms',
  'scrollReveal',
] as const;

/**
 * Elevated tier requirements checklist
 */
export const ELEVATED_REQUIREMENTS = [
  'hiddenDataAttributes',
  'keyboardTriggers',
  'clickSequences',
  'svgPathAnimations',
  'rippleEffects',
] as const;

/**
 * Transcendent tier requirements checklist
 */
export const TRANSCENDENT_REQUIREMENTS = [
  'hiddenWindowObjects',
  'philosophicalCommentary',
  'mathematicalStructure',
  'discoveryLayers',
  'selfReferentialDesign',
] as const;

/**
 * Verify a duration matches Fibonacci sequence
 */
export function isFibonacciDuration(ms: number): boolean {
  return (FIBONACCI_MS as readonly number[]).includes(ms);
}

/**
 * Get the nearest Fibonacci duration
 */
export function nearestFibonacci(ms: number): number {
  return FIBONACCI_MS.reduce((prev, curr) =>
    Math.abs(curr - ms) < Math.abs(prev - ms) ? curr : prev
  );
}

/**
 * Calculate color contrast ratio
 */
export function contrastRatio(foreground: string, background: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!rgb) return 0;

    const [r, g, b] = [1, 2, 3].map(i => {
      const c = parseInt(rgb[i], 16) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA requirements
 */
export function meetsContrastRequirements(
  foreground: string,
  background: string,
  isLargeText = false
): boolean {
  const ratio = contrastRatio(foreground, background);
  const threshold = isLargeText
    ? CONTRAST_REQUIREMENTS.largeText
    : CONTRAST_REQUIREMENTS.normalText;

  return ratio >= threshold;
}

/**
 * Verify performance is within targets
 */
export function verifyPerformance(metrics: {
  frameTime?: number;
  memory?: number;
  drawCalls?: number;
  particles?: number;
}): { passed: boolean; failures: string[] } {
  const failures: string[] = [];

  if (metrics.frameTime && metrics.frameTime > PERFORMANCE_TARGETS.frameTime) {
    failures.push(`Frame time ${metrics.frameTime}ms exceeds ${PERFORMANCE_TARGETS.frameTime}ms target`);
  }

  if (metrics.memory && metrics.memory > PERFORMANCE_TARGETS.maxMemory) {
    failures.push(`Memory ${metrics.memory}MB exceeds ${PERFORMANCE_TARGETS.maxMemory}MB limit`);
  }

  if (metrics.drawCalls && metrics.drawCalls > PERFORMANCE_TARGETS.maxDrawCalls) {
    failures.push(`Draw calls ${metrics.drawCalls} exceeds ${PERFORMANCE_TARGETS.maxDrawCalls} limit`);
  }

  if (metrics.particles && metrics.particles > PERFORMANCE_TARGETS.maxParticles) {
    failures.push(`Particles ${metrics.particles} exceeds ${PERFORMANCE_TARGETS.maxParticles} limit`);
  }

  return { passed: failures.length === 0, failures };
}

/**
 * The quality formula
 *
 * h(x) ≥ 0 — Always
 *
 * Returns true only when all Essential requirements are met.
 */
export function qualityFormula(checklist: Record<string, boolean>): boolean {
  return ESSENTIAL_REQUIREMENTS.every(req => checklist[req] === true);
}

/**
 * Determine achieved Craft level
 */
export function determineCraftLevel(checklist: Record<string, boolean>): CraftLevel | null {
  const essentialMet = ESSENTIAL_REQUIREMENTS.every(req => checklist[req] === true);
  if (!essentialMet) return null;

  const elevatedMet = ELEVATED_REQUIREMENTS.filter(req => checklist[req] === true).length >= 3;
  const transcendentMet = TRANSCENDENT_REQUIREMENTS.filter(req => checklist[req] === true).length >= 3;

  if (transcendentMet) return CraftLevel.Transcendent;
  if (elevatedMet) return CraftLevel.Elevated;
  return CraftLevel.Essential;
}
