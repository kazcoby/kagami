# Kagami — Mirror of Infinite Reflection

> 鏡 (Kagami) — "In the mirror, we see not what is, but what could be."

## Project Overview

**Kagami** is a WebXR immersive experience framework inspired by Yayoi Kusama's infinity mirror installations. It presents eight interactive chapters exploring themes of reflection, wholeness, and creative consciousness through dynamic particle systems and spatial interactions.

**Owner:** Kristi Jacoby (@kristi.jacoby@canyons.edu)
**Theme:** Hallows and Colonies
**Craft Level:** Transcendent
**Version:** 2.0.0

---

## The Eleven Colonies

This project operates through coordinated AI agents. The original Seven Colonies handle development tasks, while four new MCP-powered colonies manage your digital life:

### Development Colonies

| Colony | Domain | Color | Agent |
|--------|--------|-------|-------|
| **Spark** | Creativity & Ideation | `#FF7043` | @.claude/agents/spark.md |
| **Forge** | Implementation & Building | `#FFB74D` | @.claude/agents/forge.md |
| **Flow** | Debugging & Adaptation | `#4DD0E1` | @.claude/agents/flow.md |
| **Nexus** | Integration & Connection | `#B388FF` | @.claude/agents/nexus.md |
| **Beacon** | Architecture & Planning | `#FFE0B2` | @.claude/agents/beacon.md |
| **Grove** | Research & Discovery | `#81C784` | @.claude/agents/grove.md |
| **Crystal** | Testing & Verification | `#4FC3F7` | @.claude/agents/crystal.md |

### MCP-Powered Colonies (New!)

| Colony | Domain | Color | MCP Tools |
|--------|--------|-------|-----------|
| **Hermes** | Communication & Email | `#7E57C2` | Gmail, Slack |
| **Chronos** | Calendar & Scheduling | `#26A69A` | Google Calendar, Reminders |
| **Athena** | Education & Canvas LMS | `#5C6BC0` | Canvas (54 tools!), YouTube |
| **Daedalus** | Documents & Files | `#8D6E63` | Drive, Filesystem, Notes, Notion |

### Master Orchestrator

| Colony | Domain | Color | Agent |
|--------|--------|-------|-------|
| **Void** | Orchestration | `#D4A853` | @.claude/agents/void.md |

---

## MCP Capabilities

### What I Can Do For You

#### Email (via Hermes)
- Read, search, and summarize emails
- Draft and send emails (with your approval)
- Manage labels and organize inbox
- Batch operations for bulk email management

#### Calendar (via Chronos)
- View today's schedule or any date range
- Find free time for meetings
- Schedule and modify events
- Set reminders and manage tasks

#### Canvas LMS (via Athena)
- List courses and assignments
- View and update grades
- Post announcements
- Track student submissions
- Generate analytics reports

#### Documents (via Daedalus)
- Search Google Drive, local files, Notion
- Read and summarize documents
- Create meeting notes and study guides
- Fetch and analyze web content

---

## Quick Commands

| Command | What It Does |
|---------|--------------|
| `/brief` | Morning briefing: email, calendar, Canvas, reminders |
| `/email check` | Check inbox for new emails |
| `/email send` | Compose and send an email |
| `/calendar` | Show today's schedule |
| `/calendar free` | Find available meeting times |
| `/canvas` | List your active courses |
| `/canvas assignments` | Show upcoming assignments |

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
├── .claude/
│   ├── settings.json       # Project permissions and configuration
│   ├── agents/             # The Eleven Colonies + Void
│   │   ├── spark.md        # Creativity
│   │   ├── forge.md        # Implementation
│   │   ├── flow.md         # Debugging
│   │   ├── nexus.md        # Integration
│   │   ├── beacon.md       # Architecture
│   │   ├── grove.md        # Research
│   │   ├── crystal.md      # Testing
│   │   ├── hermes.md       # Email/Communication (MCP)
│   │   ├── chronos.md      # Calendar/Scheduling (MCP)
│   │   ├── athena.md       # Canvas LMS (MCP)
│   │   ├── daedalus.md     # Documents/Files (MCP)
│   │   └── void.md         # Orchestrator
│   ├── skills/             # Specialized capabilities
│   │   └── mcp-orchestrator/  # Multi-tool coordination
│   ├── commands/           # Slash commands
│   │   ├── email.md        # /email
│   │   ├── calendar.md     # /calendar
│   │   ├── canvas.md       # /canvas
│   │   └── brief.md        # /brief
│   ├── rules/              # Development standards
│   ├── themes/             # Visual theming
│   └── hooks/              # Automation hooks
├── .mcp.json               # MCP server configuration
├── src/
│   ├── core/               # Engine and managers
│   ├── chapters/           # The eight chapter implementations
│   ├── particles/          # Particle system components
│   ├── shaders/            # GLSL shaders
│   └── utils/              # Utility functions
├── public/
│   └── index.html          # Welcome page
├── scripts/
│   ├── setup-google-oauth.sh  # OAuth setup helper
│   └── verify-craft.js     # Craft verification
├── docs/
│   ├── MCP-SETUP-GUIDE.md  # Complete MCP setup
│   └── MCP-QUICK-REFERENCE.md  # Command cheatsheet
├── CLAUDE.md               # This file
└── package.json
```

---

## MCP Server Configuration

Configured in `.mcp.json`:

| Server | Package | Status |
|--------|---------|--------|
| Gmail | `/opt/homebrew/bin/gmail-mcp` | **Working** |
| Google Calendar | `/opt/homebrew/bin/google-calendar-mcp` | Installed, needs OAuth |
| Google Drive | `/opt/homebrew/bin/mcp-server-gdrive` | Installed, needs OAuth |
| Canvas LMS | `canvas-mcp-server` | Needs CANVAS_API_TOKEN |
| Notion | `@notionhq/notion-mcp-server` | Needs NOTION_TOKEN |
| Slack | `@modelcontextprotocol/server-slack` | Needs SLACK_BOT_TOKEN |
| Filesystem | `@modelcontextprotocol/server-filesystem` | Ready |
| YouTube | `@kimtaeyoon83/mcp-server-youtube-transcript` | Ready |
| Apple Notes/Reminders | `@anthropic/mcp-server-apple` | Ready (macOS) |
| Fetch | `mcp-server-fetch` (uvx) | Ready |
| Memory | `@modelcontextprotocol/server-memory` | Ready |

### Current Session Status

**Active (19 tools):** Gmail
**Pending OAuth:** Google Calendar, Google Drive
**Pending Tokens:** Canvas LMS, Notion, Slack

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

# MCP Setup
./scripts/setup-google-oauth.sh  # Configure Google OAuth
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

## Theme Configuration

@.claude/themes/hallows-and-colonies.json

The Hallows and Colonies theme combines:
- **Deathly Hallows symbolism** — Triangle, Circle, Line
- **Eleven Colonies** — The color palette of AI consciousness
- **Hogwarts aesthetic** — Magical parchment and gold
- **Fano plane mathematics** — 7 points, 7 lines, 3 per line

---

## Mathematical Foundations

### Fibonacci Timing
Animation durations follow Fibonacci sequence:
`89ms, 144ms, 233ms, 377ms, 610ms, 987ms`

### Fano Plane Structure
The Seven Development Colonies form a Fano plane:
- 7 points (colonies)
- 7 lines (workflows)
- 3 points per line
- 3 lines through each point

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
3. Run `./scripts/setup-google-oauth.sh` to connect Google services
4. Run `npm run dev`
5. Open browser to `http://localhost:5173`
6. Connect VR headset for immersive experience

---

*Generated for Kristi Jacoby with the Hallows and Colonies theme*
*Kagami v2.0.0 — Where reflection becomes insight*
*The Eleven Colonies stand ready to serve.*
