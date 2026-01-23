---
status: pending
priority: p2
issue_id: "003"
tags: [code-review, cleanup, dead-code]
dependencies: []
---

# Remove Unused Code - Dead Files, Functions, and Props

## Problem Statement

The PR contains unused code artifacts that increase maintenance burden and confusion.

## Findings

**From code-simplicity-reviewer agent:**

1. **Dead Hook File** (`hooks/usePreventDoubleTap.ts`):
   - 21 lines of code
   - Never imported or used anywhere

2. **Unused Cache Functions** (`utils/weatherCache.ts:88-124`):
   - `isCacheValid()` - exported but never called
   - `getCacheAge()` - exported but never called
   - `clearCachedWeather()` - exported but never called
   - 36 lines of dead code

3. **Unused Props** (`components/ToggleSwitch.tsx`):
   - `disabled` prop - defined but never used
   - `color` prop - defined but never used

4. **Redundant Prop** (`components/SelectorButton.tsx:12`):
   - `href` prop - never used, all callers use `valueChangePage`

5. **Unused Style** (`components/CurrentSummary.tsx:77-79`):
   - `rangeTemperature` style defined but never referenced

6. **Empty Interface** (`components/CustomScrollView.tsx:14-16`):
   - YAGNI violation with "future" comment

## Proposed Solutions

### Option A: Remove All Dead Code (Recommended)
Delete all unused artifacts in one PR.

| File | Action | LOC |
|------|--------|-----|
| `hooks/usePreventDoubleTap.ts` | Delete file | -21 |
| `utils/weatherCache.ts` | Keep `isCacheValid` (will be used by #001), remove others | -24 |
| `components/ToggleSwitch.tsx` | Remove `disabled`, `color` props | -4 |
| `components/SelectorButton.tsx` | Remove `href` prop | -2 |
| `components/CurrentSummary.tsx` | Remove `rangeTemperature` style | -3 |
| `components/CustomScrollView.tsx` | Remove empty interface | -3 |

- **Pros:** Cleaner codebase, less confusion
- **Cons:** None
- **Effort:** Small
- **Risk:** Low

## Recommended Action

Remove all dead code except `isCacheValid()` which will be used by todo #001.

## Technical Details

**Affected Files:**
- `hooks/usePreventDoubleTap.ts` (delete)
- `utils/weatherCache.ts`
- `components/ToggleSwitch.tsx`
- `components/SelectorButton.tsx`
- `components/CurrentSummary.tsx`
- `components/CustomScrollView.tsx`

## Acceptance Criteria

- [ ] `usePreventDoubleTap.ts` deleted
- [ ] Unused cache functions removed (keep `isCacheValid`)
- [ ] Unused props removed from ToggleSwitch
- [ ] `href` prop removed from SelectorButton
- [ ] Unused style removed from CurrentSummary
- [ ] Empty interface removed from CustomScrollView
- [ ] TypeScript compiles without errors

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-23 | Created from code review | YAGNI - remove unused code |

## Resources

- PR #4: https://github.com/vandamd/weather/pull/4
