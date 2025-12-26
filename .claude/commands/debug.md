---
description: Diagnose and fix issues systematically
allowed-tools: Read, Edit, Bash, Grep, Glob
---

# /debug — Systematic Issue Resolution

Invoke the Flow colony for methodical debugging and problem-solving.

## Process

1. **Reproduce the Issue**
   - Understand the symptoms
   - Create reliable reproduction steps
   - Identify environmental factors

2. **Isolate the Cause**
   - Narrow down the scope
   - Eliminate variables
   - Trace execution paths

3. **Identify Root Cause**
   - Find the actual source (not just symptoms)
   - Understand why it happens
   - Consider related issues

4. **Implement Fix**
   - Minimal targeted change
   - Preserve existing behavior
   - Don't introduce new issues

5. **Verify and Prevent**
   - Confirm fix works
   - Add regression tests
   - Consider similar vulnerabilities

## Usage

```
/debug [issue description]
```

## Example

```
/debug Chapter transitions sometimes skip frames on Quest 2
```

## Output Format

```markdown
## Debug Report: [Issue]

### Symptoms
[What was observed]

### Reproduction Steps
1. [Step 1]
2. [Step 2]
3. [Expected vs. actual]

### Investigation

#### Hypothesis 1
**Theory:** [What might be wrong]
**Evidence:** [What we found]
**Result:** [Confirmed/Ruled out]

#### Hypothesis 2
...

### Root Cause
**Location:** [File:line]
**Cause:** [Explanation]
**Why:** [Deeper reason]

### Fix Applied
```typescript
// Before
[old code]

// After
[new code]
```

### Verification
- [ ] Issue no longer reproduces
- [ ] Related functionality still works
- [ ] Regression test added

### Prevention
[Guards added to prevent recurrence]

### Related Considerations
[Other areas that might have similar issues]
```
