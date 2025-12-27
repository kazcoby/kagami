# Kagami — Mirror of Infinite Reflection

> 鏡 (Kagami) — "In the mirror, we see not what is, but what could be."

## Project Overview

**Kagami** is a WebXR immersive experience framework inspired by Yayoi Kusama's infinity mirror installations. It presents eight interactive chapters exploring themes of reflection, wholeness, and creative consciousness through dynamic particle systems and spatial interactions.

**Owner:** Kristi Jacoby (@kristi.jacoby@canyons.edu)
**Theme:** Hallows and Colonies
**Craft Level:** Transcendent
**Version:** 2.0.0

---

## MCP Capabilities

### Active MCP Servers

| Server | Status | Tools Available |
|--------|--------|-----------------|
| **Gmail** | Working | 19 tools - send, search, read, draft, labels, filters, attachments |
| **Filesystem** | Working | 15 tools - read, write, edit, search, directory operations |
| **Google Drive** | Working | Search files |

### What I Can Do For You

#### Email (via Gmail MCP)
- Read, search, and summarize emails
- Draft and send emails (with your approval)
- Manage labels and organize inbox
- Create filters for automatic organization
- Download attachments
- Batch operations for bulk email management

#### Files (via Filesystem MCP)
- Read and write files in the robots directory
- Search for files by pattern
- Edit files with precise replacements
- Create directories and organize files

#### Google Drive
- Search for files in your Drive

---

## Quick Commands

| Command | What It Does |
|---------|--------------|
| `/email check` | Check inbox for new emails |
| `/email send` | Compose and send an email |

---

## The Eight Chapters of Kagami

Each chapter represents a stage in the creative journey:

1. **The Void** — Origin point, seven colonies + 60 polka dots
2. **Ignition (Spark)** — 50 explosive spark particles of creativity
3. **The Anvil (Forge)** — 40 molten droplets with upward motion
4. **Currents (Flow)** — 45 particles in 3 spiraling debugging streams
5. **The Web (Nexus)** — 12 network nodes + connection particles
6. **Lighthouse (Beacon)** — Central beacon + 8 rays (48 orbs)
7. **The Grove** — Branching tree structures (max 50 orbs)
8. **Crystallization (Crystal)** — Octahedron (6 vertices + 12 edges + 25 dust)

---

## Craft Standards

All outputs must meet these quality tiers:

### Essential (Required)
- Custom cursor with glow effects
- Floating particle systems with atmospheric qualities
- Three-layer breathing background animations
- Shimmer/gradient animations on primary text
- 3D card hover transforms with perspective
- Scroll-reveal animations using Intersection Observer

### Elevated (Target)
- Hidden data-attributes enabling advanced interactions
- Keyboard trigger sequences unlocking features
- Click-sequence mechanics for discovery
- SVG path animations
- Ripple effects responding to user input

### Transcendent (Ultimate Goal)
- Hidden window objects (like `window.鏡`)
- Philosophical commentary embedded in code
- Mathematical structure visibly embedded throughout
- Multiple discovery layers rewarding deeper exploration
- Self-referential design teaching by example

---

## Five Axioms

1. **Every pixel matters** — All visual elements require deliberate design
2. **Motion conveys meaning** — Animations serve functional and emotional purposes
3. **Discovery rewards exploration** — Hidden layers encourage engagement
4. **Layers hide depth** — Essential, elevated, transcendent levels
5. **Mathematics underlies aesthetics** — Fibonacci timing, Fano plane structure

---

## For Kristi Jacoby

This installation is personalized for your expertise in:
- **Online Education** — Course design and LMS administration
- **Accessibility** — WCAG 2.1, Section 508, Quality Matters
- **Universal Design** — UDL principles for inclusive experiences
- **Canvas LMS** — Integration-ready components

All outputs will consider accessibility and educational technology contexts.

---

## Architecture

```
kagami/
├── .mcp.json               # MCP server configuration
├── src/
│   ├── core/               # Engine and managers
│   ├── chapters/           # The eight chapter implementations
│   ├── particles/          # Particle system components
│   ├── shaders/            # GLSL shaders
│   └── utils/              # Utility functions
├── public/
│   └── index.html          # Welcome page
├── CLAUDE.md               # This file
└── package.json
```

---

## Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build

# Testing
npm test                 # Run test suite
npm run test:a11y        # Accessibility tests

# Quality
npm run lint             # ESLint check
npm run format           # Prettier formatting
npm run craft:verify     # Verify Craft standards
```

---

## Performance Targets

| Metric | Target | Rationale |
|--------|--------|-----------|
| Frame Time | <16.67ms | 60fps for VR |
| Memory | <500MB | VR headset constraints |
| Draw Calls | <1000 | GPU efficiency |
| Bundle Size | <500KB gzipped | Fast load |
| Lighthouse A11y | 100 | Accessibility |

---

## Development Guidelines

### Code Style
- TypeScript strict mode
- Prefer `const` over `let`
- Maximum line length: 100 characters
- Use async/await over raw promises

### WebXR Specific
- Always check XR support before initializing
- Implement proper error handling for device access
- Support both VR and AR modes
- Test on actual devices (Quest, Vive)

### Accessibility (for Kristi's context)
- Keyboard navigation for all interactions
- Screen reader announcements for state changes
- WCAG 2.1 AA minimum compliance
- Motion reduction options (prefers-reduced-motion)

---

## Mathematical Foundations

### Fibonacci Timing
Animation durations follow Fibonacci sequence:
`89ms, 144ms, 233ms, 377ms, 610ms, 987ms`

### Catastrophe Theory Easing
- **Fold (A₂)**: Sudden emergence
- **Cusp (A₃)**: Decisive transition
- **Swallowtail (A₄)**: Recovery arc with overshoot
- **Butterfly (A₅)**: Complex oscillation

---

## Quality Formula

> **h(x) ≥ 0 — Always**

Ship only when outputs consistently meet or exceed standards. The craft verification formula ensures every delivery maintains quality.

---

## Getting Started

1. Clone this repository
2. Run `npm install`
3. Run `npm run dev`
4. Open browser to `http://localhost:5173`
5. Connect VR headset for immersive experience

---

*Generated for Kristi Jacoby*
*Kagami v2.0.0 — Where reflection becomes insight*
