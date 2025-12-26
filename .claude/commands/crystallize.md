---
description: Run comprehensive testing and verification
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

# /crystallize — Test and Verify

Invoke the Crystal colony for comprehensive quality verification.

## Process

1. **Analyze What Needs Testing**
   - New features
   - Changed components
   - Integration points

2. **Design Test Coverage**
   - Unit tests for logic
   - Integration tests for flows
   - Accessibility tests for compliance
   - Performance tests for targets

3. **Execute Tests**
   - Run automated test suites
   - Perform manual verification where needed
   - Document any issues found

4. **Verify Craft Standards**
   - Check against Essential tier
   - Verify Elevated tier elements
   - Note Transcendent achievements

5. **Generate Report**
   - Summarize coverage
   - List issues
   - Provide remediation guidance

## Usage

```
/crystallize [scope or "all"]
```

## Example

```
/crystallize Ignition chapter implementation
```

## Output Format

```markdown
## Crystal Verification Report

### Scope
[What was tested]

### Test Results
| Suite | Pass | Fail | Skip |
|-------|------|------|------|
| Unit  |      |      |      |
| Integration |  |   |      |
| A11y  |      |      |      |
| Performance | |     |      |

### Coverage
- Core Logic: X%
- Components: X%
- Overall: X%

### Issues Found
1. [Issue description] — [Severity] — [Location]

### Craft Verification
- Essential: [Pass/Fail]
- Elevated: [Elements present]
- Transcendent: [Achievements]

### Remediation
[Steps to address any issues]

### Verdict
- [ ] SHIP IT — All clear
- [ ] FIX FIRST — Address issues before shipping
- [ ] REWORK — Significant changes needed
```
