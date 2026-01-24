---
status: complete
priority: p3
issue_id: "005"
tags: [code-review, performance, react-native]
dependencies: []
---

# Move Inline Styles to StyleSheet in Forecast Components

## Problem Statement

New style objects are created for each of the 24 hourly items and 7 weekly items on every render, creating garbage collection pressure.

## Findings

**From performance-oracle agent:**

1. **HourlyForecast.tsx** (lines 138, 151-159):
   - `style={{ fontSize: n(19), paddingLeft: n(8) }}` - new object per item
   - Wind direction container styles - new array and objects per item

2. **WeeklyForecast.tsx** (similar patterns):
   - Inline styles in render loop

**Impact:**
- 60+ new objects per render cycle
- GC pressure on older devices

## Proposed Solutions

### Option A: Move Static Styles to StyleSheet (Recommended)
```typescript
const styles = StyleSheet.create({
    hourlyText: { fontSize: n(19), paddingLeft: n(8) },
    windContainer: { marginLeft: n(5), flexDirection: "row", alignItems: "center" },
});
```
- **Pros:** Better performance, React Native best practice
- **Cons:** Minor refactor
- **Effort:** Small
- **Risk:** Low

## Recommended Action

Move static inline styles to StyleSheet in both forecast components.

## Technical Details

**Affected Files:**
- `components/HourlyForecast.tsx`
- `components/WeeklyForecast.tsx`

## Acceptance Criteria

- [ ] Static inline styles moved to StyleSheet
- [ ] No visual regression
- [ ] Dynamic styles (transforms) remain inline

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-23 | Created from code review | Avoid inline styles in loops |

## Resources

- PR #4: https://github.com/vandamd/weather/pull/4
