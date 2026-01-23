---
status: pending
priority: p3
issue_id: "004"
tags: [code-review, duplication, refactor]
dependencies: []
---

# Extract Location Name Formatting Utility

## Problem Statement

Location display name formatting is duplicated in two files with identical logic.

## Findings

**From pattern-recognition-specialist agent:**

Duplicated code (79 tokens) in:
- `app/(tabs)/search.tsx:36-44`
- `app/search/results.tsx:56-64`

```tsx
`${location.name}${
    location.admin1 && location.admin1 !== location.name
        ? `, ${location.admin1}`
        : ""
}, ${location.country}`
```

## Proposed Solutions

### Option A: Extract to Utility Function (Recommended)
```typescript
// utils/formatting.ts
export function formatLocationName(location: {
    name: string;
    admin1?: string;
    country: string;
}): string {
    const admin = location.admin1 && location.admin1 !== location.name
        ? `, ${location.admin1}`
        : "";
    return `${location.name}${admin}, ${location.country}`;
}
```
- **Pros:** DRY, single source of truth
- **Cons:** New file
- **Effort:** Small
- **Risk:** Low

## Recommended Action

Create `utils/formatting.ts` with `formatLocationName()` function.

## Technical Details

**Affected Files:**
- `utils/formatting.ts` (new)
- `app/(tabs)/search.tsx`
- `app/search/results.tsx`

## Acceptance Criteria

- [ ] `formatLocationName()` utility created
- [ ] Both files use the shared utility
- [ ] No change in displayed output

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-23 | Created from code review | Extract duplicated logic |

## Resources

- PR #4: https://github.com/vandamd/weather/pull/4
