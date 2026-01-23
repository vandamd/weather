---
status: pending
priority: p2
issue_id: "001"
tags: [code-review, performance, caching]
dependencies: []
---

# Cache TTL Not Enforced - Weather Data Fetched Every App Foreground

## Problem Statement

The 15-minute cache TTL defined in `weatherCache.ts` is never checked. Weather data is refetched every time the app comes to foreground and every time the home tab gains focus, defeating the purpose of the cache.

## Findings

**From performance-oracle agent:**

1. **AppState listener** (`contexts/CurrentLocationContext.tsx:143-151`):
   - Fetches on every foreground event without cache check
   - No validation of cache validity before making API call

2. **Tab focus effect** (`app/(tabs)/index.tsx:69-75`):
   - `useFocusEffect` calls `refetchWeather()` on every tab focus
   - No minimum interval or cache check

**Impact:**
- Unnecessary battery drain on mobile devices
- Increased data usage for users on metered connections
- Potential API rate limiting at scale

## Proposed Solutions

### Option A: Add Cache Check to AppState Listener (Recommended)
```typescript
// contexts/CurrentLocationContext.tsx
if (
    appState.current.match(/inactive|background/) &&
    nextAppState === "active"
) {
    const cacheValid = await isCacheValid();
    if (!cacheValid) {
        fetchLocationAndWeather();
    }
}
```
- **Pros:** Simple, uses existing `isCacheValid()` function
- **Cons:** None
- **Effort:** Small
- **Risk:** Low

### Option B: Add Minimum Interval to Tab Focus
```typescript
// app/(tabs)/index.tsx
useFocusEffect(
    useCallback(() => {
        if (dataLoaded && lastUpdated) {
            const timeSinceLastUpdate = Date.now() - lastUpdated;
            if (timeSinceLastUpdate > 60000) { // 1 minute minimum
                refetchWeather();
            }
        }
    }, [dataLoaded, lastUpdated, refetchWeather])
);
```
- **Pros:** Prevents rapid refetches when switching tabs
- **Cons:** Adds complexity
- **Effort:** Small
- **Risk:** Low

### Option C: Implement Both A and B
- **Pros:** Comprehensive solution
- **Cons:** More changes
- **Effort:** Small
- **Risk:** Low

## Recommended Action

Implement Option C - both fixes are simple and address different scenarios.

## Technical Details

**Affected Files:**
- `contexts/CurrentLocationContext.tsx`
- `app/(tabs)/index.tsx`

## Acceptance Criteria

- [ ] Cache validity is checked before fetching on app foreground
- [ ] Tab focus does not trigger refetch if data is recent
- [ ] Existing `isCacheValid()` function is utilized
- [ ] No regression in initial data loading

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-23 | Created from code review | Cache TTL exists but isn't used |

## Resources

- PR #4: https://github.com/vandamd/weather/pull/4
- File: `utils/weatherCache.ts` (TTL definition)
