# MCP Orchestrator Skill

> Coordinate multiple MCP tools for complex workflows

## Trigger
When user requests require multiple MCP services working together.

## Available MCP Servers

### Communication
| Server | Tools | Status |
|--------|-------|--------|
| Gmail | search, read, send, draft, label, batch | Requires OAuth |
| Slack | post, search, channels | Requires token |

### Scheduling
| Server | Tools | Status |
|--------|-------|--------|
| Google Calendar | list, create, update, free, search | Requires OAuth |
| Apple Reminders | list, create, complete, due | Ready |

### Education
| Server | Tools | Status |
|--------|-------|--------|
| Canvas LMS | 54 tools for courses, grades, etc. | Requires token |
| YouTube Transcript | extract transcripts | Ready |

### Documents
| Server | Tools | Status |
|--------|-------|--------|
| Google Drive | search, read, create, organize | Requires OAuth |
| Filesystem | read, write, list (local) | Ready |
| Apple Notes | search, read, create | Ready |
| Notion | search, read, create, update | Requires token |

### Utilities
| Server | Tools | Status |
|--------|-------|--------|
| Fetch | url, convert | Ready |
| Memory | store, recall | Ready |

## Orchestration Patterns

### Morning Briefing
```yaml
sequence:
  - gmail: search unread priority emails
  - calendar: get today's events
  - canvas: get due assignments this week
  - reminders: get due today
  - memory: recall ongoing projects
output: Unified daily briefing
```

### Student Support
```yaml
sequence:
  - canvas: get student info and grades
  - gmail: search correspondence with student
  - calendar: find meeting availability
  - gmail: draft support email
output: Complete student context
```

### Content Creation
```yaml
sequence:
  - youtube: extract transcript
  - fetch: get supplementary articles
  - notes: create study guide
  - canvas: create assignment with content
output: Educational content package
```

### Meeting Prep
```yaml
sequence:
  - calendar: get meeting details
  - gmail: search related emails
  - drive: find relevant documents
  - notes: create agenda
output: Meeting preparation package
```

## Usage

The orchestrator automatically coordinates tools when requests span multiple domains:

```
User: "Prepare for my meeting with Dr. Chen tomorrow"

Orchestrator:
1. Calendar → Find meeting time and details
2. Gmail → Search recent emails from Dr. Chen
3. Drive → Find shared documents
4. Notes → Generate prep notes
5. Reminders → Add prep tasks
```

## Error Handling

- If a server is unavailable, gracefully degrade
- Report which services succeeded/failed
- Suggest alternatives when possible

---

*h(x) ≥ 0 — The whole is greater than the sum of its parts*
