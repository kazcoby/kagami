# /email — Email Management Command

Invoke: `/email [action] [query]`

## Actions

### Check (default)
```
/email check
/email check unread
/email check from:dean
```
Checks inbox for new or filtered emails.

### Search
```
/email search accessibility audit
/email search from:student@canyons.edu
/email search after:2024-01-01 subject:grades
```
Search emails with Gmail query syntax.

### Send
```
/email send to:faculty@canyons.edu subject:Workshop Reminder
/email send reply:thread_id
```
Compose and send emails (with confirmation).

### Draft
```
/email draft to:student subject:Grade Update
```
Create draft for review before sending.

### Summarize
```
/email summarize today
/email summarize from:department
```
Get AI summary of email threads.

## MCP Tools Used
- `@gongrzhe/server-gmail-autoauth-mcp`

## Agent
Invokes **Hermes** colony for execution.

## Examples

```
/email check unread
> Found 5 unread emails:
> 1. Dr. Smith - "RE: Curriculum Meeting" (2h ago)
> 2. Canvas - "New submission in ENG 101" (3h ago)
> ...

/email send to:faculty@canyons.edu
> Composing email...
> To: faculty@canyons.edu
> Subject: [Enter subject]
> Body: [Enter message]
>
> [Send] [Save Draft] [Cancel]
```

---

*h(x) ≥ 0 — Clear communication, swift delivery*
