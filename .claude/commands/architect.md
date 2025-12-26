---
description: Design system architecture and make strategic decisions
allowed-tools: Read, Grep, Glob, WebFetch, WebSearch
---

# /architect — Strategic Design

Invoke the Beacon colony for architectural planning and strategic decisions.

## Process

1. **Understand the Need**
   - What system needs to be designed?
   - What are the constraints?
   - What future needs should we anticipate?

2. **Explore Options**
   - Consider multiple architectural approaches
   - Research patterns and precedents
   - Identify trade-offs

3. **Evaluate Trade-offs**
   - Simplicity vs. flexibility
   - Performance vs. maintainability
   - Current needs vs. future growth

4. **Make Recommendations**
   - Select optimal approach with rationale
   - Define key components and interfaces
   - Document important decisions

5. **Guide Implementation**
   - Provide clear structure for Forge
   - Define interfaces and contracts
   - Set quality expectations

## Usage

```
/architect [system or feature to design]
```

## Example

```
/architect Chapter navigation system with state management
```

## Output Format

```markdown
## Architecture Design: [System]

### Context
[What we're designing and why]

### Requirements
- Functional: [List]
- Non-functional: [Performance, accessibility, etc.]

### Options Considered

#### Option 1: [Name]
**Approach:** [Description]
**Pros:** [Benefits]
**Cons:** [Drawbacks]

#### Option 2: [Name]
...

### Recommendation
**Selected:** [Option name]
**Rationale:** [Why this approach]

### Architecture

```
[ASCII diagram or component structure]
```

### Key Decisions
| Decision | Rationale |
|----------|-----------|
| [Decision 1] | [Why] |

### Interfaces

```typescript
interface [Name] {
  // Key contracts
}
```

### Implementation Guidance
[Notes for Forge colony implementation]

### Quality Expectations
- Essential: [Required elements]
- Elevated: [Target elements]
- Transcendent: [Aspirational elements]
```
