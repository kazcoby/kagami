#!/usr/bin/env node

/**
 * Craft Standards Verification Script
 *
 * Verifies that the project meets Craft standards:
 * - Essential tier requirements
 * - Performance targets
 * - Accessibility compliance
 *
 * Usage: npm run craft:verify
 *
 * h(x) ≥ 0 — Always
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  gold: '\x1b[33m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  dim: '\x1b[2m',
};

console.log(`${colors.gold}🪞 Kagami Craft Verification${colors.reset}\n`);

const checks = {
  essential: [],
  elevated: [],
  transcendent: [],
};

// Essential Tier Checks
function checkEssential() {
  console.log(`${colors.dim}Checking Essential tier...${colors.reset}`);

  // Check for index.html with required CSS variables
  const indexPath = join(process.cwd(), 'public', 'index.html');
  if (existsSync(indexPath)) {
    const html = readFileSync(indexPath, 'utf-8');

    // Custom cursor variables
    checks.essential.push({
      name: 'Custom cursor CSS variables',
      passed: html.includes('--color-gold'),
    });

    // Breathing animation
    checks.essential.push({
      name: 'Breathing animation keyframes',
      passed: html.includes('@keyframes breathe'),
    });

    // Shimmer animation
    checks.essential.push({
      name: 'Shimmer animation keyframes',
      passed: html.includes('@keyframes shimmer'),
    });

    // Fibonacci timing
    checks.essential.push({
      name: 'Fibonacci timing CSS variables',
      passed: html.includes('--duration-1: 89ms'),
    });

    // Screen reader support
    checks.essential.push({
      name: 'Screen reader only class',
      passed: html.includes('.sr-only'),
    });

    // Reduced motion support
    checks.essential.push({
      name: 'Prefers-reduced-motion media query',
      passed: html.includes('prefers-reduced-motion'),
    });
  }

  // Check for main TypeScript with required features
  const mainPath = join(process.cwd(), 'src', 'core', 'KagamiExperience.ts');
  if (existsSync(mainPath)) {
    const ts = readFileSync(mainPath, 'utf-8');

    checks.essential.push({
      name: 'FIBONACCI_MS constant',
      passed: ts.includes('FIBONACCI_MS'),
    });

    checks.essential.push({
      name: 'Performance configuration',
      passed: ts.includes('PERF'),
    });

    checks.essential.push({
      name: 'Screen reader announcements',
      passed: ts.includes('announceToScreenReader'),
    });
  }
}

// Transcendent Tier Checks
function checkTranscendent() {
  console.log(`${colors.dim}Checking Transcendent tier...${colors.reset}`);

  const mainPath = join(process.cwd(), 'src', 'core', 'KagamiExperience.ts');
  if (existsSync(mainPath)) {
    const ts = readFileSync(mainPath, 'utf-8');

    checks.transcendent.push({
      name: 'Hidden window.鏡 object',
      passed: ts.includes('window.鏡') || ts.includes("window as any).鏡"),
    });

    checks.transcendent.push({
      name: 'Philosophical code commentary',
      passed: ts.includes('In the mirror') || ts.includes('Discovery rewards exploration'),
    });
  }
}

// Run checks
checkEssential();
checkTranscendent();

// Report results
console.log('\n--- Results ---\n');

let allEssentialPassed = true;

console.log(`${colors.gold}Essential Tier:${colors.reset}`);
checks.essential.forEach(check => {
  const symbol = check.passed ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
  console.log(`  ${symbol} ${check.name}`);
  if (!check.passed) allEssentialPassed = false;
});

console.log(`\n${colors.gold}Transcendent Tier:${colors.reset}`);
checks.transcendent.forEach(check => {
  const symbol = check.passed ? `${colors.green}✓${colors.reset}` : `${colors.dim}○${colors.reset}`;
  console.log(`  ${symbol} ${check.name}`);
});

// Final verdict
console.log('\n--- Verdict ---\n');

if (allEssentialPassed) {
  const transcendentCount = checks.transcendent.filter(c => c.passed).length;
  if (transcendentCount >= 2) {
    console.log(`${colors.gold}✨ TRANSCENDENT${colors.reset}`);
    console.log('  Exceptional craft achieved.');
  } else if (transcendentCount >= 1) {
    console.log(`${colors.green}✓ ELEVATED${colors.reset}`);
    console.log('  Target craft level met.');
  } else {
    console.log(`${colors.green}✓ ESSENTIAL${colors.reset}`);
    console.log('  Minimum craft requirements met.');
  }
  console.log(`\n  ${colors.dim}h(x) ≥ 0 — Always${colors.reset}`);
  process.exit(0);
} else {
  console.log(`${colors.red}✗ DOES NOT MEET ESSENTIAL${colors.reset}`);
  console.log('  Fix Essential tier issues before shipping.');
  process.exit(1);
}
