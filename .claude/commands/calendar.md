# /calendar — Schedule Management Command

Invoke: `/calendar [action] [parameters]`

## Actions

### Today (default)
```
/calendar
/calendar today
```
Show today's schedule.

### Week
```
/calendar week
/calendar next week
```
Show weekly overview.

### Free
```
/calendar free
/calendar free 1h tomorrow
/calendar free 30m this week
```
Find available time slots.

### Schedule
```
/calendar schedule "Faculty Meeting" tomorrow 2pm 1h
/calendar schedule "Office Hours" weekly Thu 2-4pm
```
Create new calendar events.

### Move
```
/calendar move "Faculty Meeting" to Friday 3pm
```
Reschedule existing events.

### Cancel
```
/calendar cancel "Faculty Meeting"
```
Remove calendar events.

## MCP Tools Used
- `@sudomcp/google-calendar-mcp`
- `@rudrasankha/apple-mcp` (Reminders)

## Agent
Invokes **Chronos** colony for execution.

## Examples

```
/calendar today
> Thursday, December 26, 2024
>
> 9:00 AM - 10:00 AM  Department Meeting
> 11:00 AM - 12:00 PM  Office Hours
> 2:00 PM - 3:00 PM   Student Advising
>
> 3 events today, 2 hours free time

/calendar free 1h tomorrow
> Available 1-hour slots for Friday:
> - 9:00 AM - 10:00 AM
> - 1:00 PM - 2:00 PM
> - 4:00 PM - 5:00 PM
```

---

*h(x) ≥ 0 — Time well managed is life well lived*
