---
name: accessibility-audit
description: Audit and improve accessibility compliance. Check WCAG 2.1 AA/AAA standards, Section 508, and Quality Matters criteria. Use when ensuring inclusive design for all users.
allowed-tools: Read, Grep, Glob, Bash
---

# Accessibility Audit Skill

Comprehensive accessibility auditing aligned with Kristi Jacoby's educational technology expertise.

## Standards Covered

### WCAG 2.1
- **Level A**: Minimum accessibility
- **Level AA**: Target compliance (required)
- **Level AAA**: Enhanced accessibility (aspiration)

### Section 508
- Federal accessibility requirements
- Essential for educational institutions

### Quality Matters
- Online course accessibility rubric
- LMS-specific considerations

## Audit Categories

### Perceivable
- [ ] Text alternatives for non-text content
- [ ] Captions and audio descriptions
- [ ] Content adaptable to different presentations
- [ ] Distinguishable colors and contrasts (4.5:1 minimum)

### Operable
- [ ] Keyboard accessible (all functionality)
- [ ] Enough time to read and use content
- [ ] No seizure-inducing content
- [ ] Navigable structure and headings

### Understandable
- [ ] Readable text content
- [ ] Predictable functionality
- [ ] Input assistance and error prevention

### Robust
- [ ] Compatible with assistive technologies
- [ ] Valid, semantic markup
- [ ] ARIA where appropriate

## WebXR-Specific Checks

### VR Accessibility
- [ ] Non-VR fallback available
- [ ] Motion sickness considerations
- [ ] Alternative input methods
- [ ] Audio descriptions for spatial content

### Immersive Content
- [ ] Clear spatial navigation cues
- [ ] Haptic feedback alternatives
- [ ] Session timeout warnings
- [ ] Emergency exit mechanisms

## Audit Workflow

```
1. SCAN — Automated tool analysis (axe-core, WAVE)
2. NAVIGATE — Keyboard-only testing
3. SCREEN-READ — VoiceOver/NVDA testing
4. VISUAL — Color contrast and zoom testing
5. COGNITIVE — Readability and cognitive load
6. DOCUMENT — Findings and remediation plan
```

## Integration with Canvas LMS

- Check embedded content accessibility
- Verify LTI tool compliance
- Test within Canvas interface
- Ensure mobile accessibility

## Reporting Template

```markdown
## Accessibility Audit Report

**Project:** [Name]
**Date:** [Date]
**Auditor:** Crystal Colony (AI-assisted)

### Summary
- Critical Issues: X
- Major Issues: X
- Minor Issues: X

### Findings
[Detailed findings organized by WCAG principle]

### Remediation Priority
1. [Critical items first]
2. [Major items second]
3. [Minor items as capacity allows]
```

## Craft Standards

Accessibility is Essential tier — it is required, not optional.
