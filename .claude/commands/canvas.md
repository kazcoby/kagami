# /canvas — Canvas LMS Command

Invoke: `/canvas [action] [course] [parameters]`

## Actions

### Courses (default)
```
/canvas
/canvas courses
```
List active courses.

### Assignments
```
/canvas assignments ENG101
/canvas assignments due this week
/canvas assignments create ENG101 "Essay 2" due:2024-12-30
```
View or create assignments.

### Grades
```
/canvas grades ENG101
/canvas grades ENG101 student:jsmith
/canvas grades update ENG101 "Essay 1" student:jsmith grade:85
```
View or update grades.

### Students
```
/canvas students ENG101
/canvas students missing ENG101 "Essay 1"
/canvas students message ENG101 "Reminder about deadline"
```
Manage students and communication.

### Announcements
```
/canvas announce ENG101 "Class Cancelled Tomorrow"
```
Post course announcements.

### Analytics
```
/canvas analytics ENG101
/canvas analytics ENG101 module:3
```
View course performance data.

## MCP Tools Used
- `canvas-mcp-server` (54 tools!)

## Agent
Invokes **Athena** colony for execution.

## Examples

```
/canvas assignments due this week
> Assignments Due This Week:
>
> ENG 101:
>   - Essay 2 Draft (Wed) - 18/25 submitted
>   - Discussion Post (Fri) - 12/25 submitted
>
> COM 201:
>   - Speech Outline (Thu) - 20/22 submitted

/canvas students missing ENG101 "Essay 2 Draft"
> Students who haven't submitted "Essay 2 Draft":
> 1. John Smith (jsmith@student.canyons.edu)
> 2. Maria Garcia (mgarcia@student.canyons.edu)
> ...
>
> [Send Reminder] [View Details]
```

---

*h(x) ≥ 0 — Education empowered by technology*
