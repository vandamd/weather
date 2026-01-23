---
title: Rebuild Weather App with Light Template and New UI Components
type: refactor
date: 2026-01-23
deepened: 2026-01-23
---

# Rebuild Weather App with Light Template and New UI Components

## Enhancement Summary

**Deepened on:** 2026-01-23
**Research agents used:** TypeScript reviewer, Architecture strategist, Performance oracle, Security sentinel, Code simplicity reviewer, Pattern recognition specialist, Frontend races reviewer, Best practices researcher, Framework docs researcher, Code explorer, Code architect, Frontend design patterns

### Key Improvements
1. Added comprehensive TypeScript type safety recommendations
2. Identified and documented 10 race condition risks with fixes
3. Added performance optimization patterns for list rendering and caching
4. Security hardening recommendations for location data and permissions
5. Simplified implementation phases from 8 to 4 consolidated phases

### Critical Issues Discovered
- **Race conditions** in concurrent fetch operations (must add in-flight guards)
- **Security**: Excessive Android permissions in manifest (remove unused)
- **Performance**: Weather cache needs TTL enforcement (15-30 min)
- **Type safety**: 34 non-null assertions in weather.ts need defensive handling

---

## Overview

Start fresh from the light-template base and rebuild the weather app using the new, cleaned-up UI components from the passes project. This modernizes the codebase to use:
- Expo SDK 54 (from 53)
- React Native 0.81.5 (from 0.79.2)
- expo-router 6.0.21 (from 5.0.6)
- React 19.1.0
- Refined UI component patterns from passes

### Research Insights

**Best Practices:**
- expo-router 6.x: Add `_layout.tsx` files to `settings/` and `search/` directories for proper Stack navigation
- React 19.1: Leverage `useTransition` for weather fetching, `useOptimistic` for save/unsave locations
- Consider MMKV instead of AsyncStorage (10x faster, synchronous API)

**Performance Considerations:**
- Implement weather cache TTL (15-30 min) to reduce API calls by 80%
- Add FlatList virtualization for hourly forecast (currently renders all 24 items)
- Pre-compute sunrise/sunset events outside render loop (O(n) to O(1) per item)

**References:**
- Expo SDK 54 Changelog: https://expo.dev/changelog/sdk-54
- expo-router v6: https://docs.expo.dev/router/introduction/

---

## Problem Statement / Motivation

The current weather app uses an older version of the light-template with outdated component patterns. The passes project has recently undergone a UI component cleanup that:
1. Removed deprecated components (ListItem, OptionsSelector, SelectorButton, Separator)
2. Refined core components (ToggleSwitch, Header, ContentContainer, CustomScrollView)
3. Added new utilities (ReorderItem, CenteredMessage)
4. Standardized the `n()` scaling function usage

Rebuilding from scratch ensures:
- Clean, modern codebase without legacy patterns
- Consistent component usage matching passes
- Latest Expo SDK and dependencies
- Proper density normalization throughout

---

## Proposed Solution

1. Create a new branch `rebuild-with-light-template`
2. Copy light-template as the base
3. Port UI components from passes (the refined versions)
4. Migrate weather-specific code (copy, don't rewrite)
5. Preserve existing weather functionality

### Research Insights

**Simplification Recommendations:**
- Use "copy and adapt" instead of "rebuild" - existing components work fine
- Remove HapticContext (unnecessary abstraction) - call Haptics.impactAsync directly
- Skip CenteredMessage - use inline View+Text (3 lines vs. separate component)
- Remove confirm.tsx from scope - not needed for initial release

---

## Technical Approach

### Architecture

```
app/
├── _layout.tsx              # Root layout with providers
├── (tabs)/
│   ├── _layout.tsx          # Tab configuration
│   ├── index.tsx            # Current location weather
│   ├── search.tsx           # Location search
│   └── settings.tsx         # Settings screen
├── search/
│   ├── _layout.tsx          # Stack layout (NEW)
│   ├── results.tsx          # Search results
│   └── weather.tsx          # Weather for searched location
└── settings/
    ├── _layout.tsx          # Stack layout (NEW)
    ├── temperature-unit.tsx
    ├── precipitation-unit.tsx
    └── wind-speed-unit.tsx

components/
├── ContentContainer.tsx     # From passes (refined)
├── Header.tsx               # From passes (refined)
├── Navbar.tsx               # From passes
├── StyledText.tsx           # From passes
├── StyledButton.tsx         # From passes
├── HapticPressable.tsx      # From passes
├── ToggleSwitch.tsx         # From passes (refined)
├── CustomScrollView.tsx     # From passes (refined)
├── CurrentSummary.tsx       # Weather-specific (copy)
├── HourlyForecast.tsx       # Weather-specific (copy)
├── WeeklyForecast.tsx       # Weather-specific (copy)
└── WeatherVariableSelector.tsx  # Weather-specific (copy)

contexts/
├── InvertColorsContext.tsx  # From light-template
├── CurrentLocationContext.tsx # From weather (migrate)
└── UnitsContext.tsx         # From weather (migrate)

utils/
├── scaling.ts               # From light-template (n() function)
├── weather.ts               # From weather (migrate)
├── geocoding.ts             # From weather (migrate)
├── savedLocations.ts        # From weather (migrate)
├── weatherCache.ts          # From weather (migrate)
├── weatherIconMap.ts        # From weather (migrate)
└── weatherDescriptionMap.ts # From weather (migrate)

assets/
├── fonts/PublicSans-Regular.ttf
└── weather/*.svg            # From weather (migrate all icons)
```

### Research Insights

**Architecture Improvements:**
- Add `_layout.tsx` to search/ and settings/ directories for proper expo-router 6 Stack navigation
- Remove HapticContext from provider chain - use direct Haptics.impactAsync() calls
- Provider order: SafeArea > InvertColors > Units > CurrentLocation

**Pattern Recognition:**
- Current patterns are well-designed (Provider, Container, Wrapper patterns)
- Duplicate weather variable mapping in HourlyForecast/WeeklyForecast - extract to shared utility
- Inline styles in Header.tsx repeated 4x - extract to StyleSheet

---

## Implementation Phases (Consolidated)

### Phase 1: Foundation Setup

**Tasks:**
- [x] Create new branch `rebuild-with-light-template` from main
- [x] Remove all existing source files (keep .git)
- [x] Copy light-template contents as base
- [x] Update app.json with weather app config
- [x] Add dependencies: openmeteo, expo-location, react-native-svg
- [x] Copy assets (fonts, weather SVGs, icon)
- [x] Create types/svg.d.ts for SVG imports
- [x] Run `bun install` and verify template runs

**Research Insights:**

**app.json Configuration:**
```json
{
  "expo": {
    "name": "Weather",
    "slug": "weather",
    "newArchEnabled": true,
    "android": {
      "package": "com.vandam.weather",
      "permissions": [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.INTERNET",
        "android.permission.VIBRATE"
      ]
    }
  }
}
```

**Security Note:** Remove unnecessary permissions from current manifest:
- ❌ READ_EXTERNAL_STORAGE (not needed)
- ❌ WRITE_EXTERNAL_STORAGE (not needed)
- ❌ SYSTEM_ALERT_WINDOW (not needed)
- Set `android:allowBackup="false"` for location data privacy

---

### Phase 2: Port Code (Copy, Don't Rewrite)

**UI Components from passes:**
- [x] Copy ContentContainer.tsx, Header.tsx, Navbar.tsx
- [x] Copy StyledText.tsx, StyledButton.tsx, HapticPressable.tsx
- [x] Copy ToggleSwitch.tsx, CustomScrollView.tsx
- [x] Update imports to use `@/*` alias

**Weather utilities from current app:**
- [x] Copy utils/weather.ts, geocoding.ts, savedLocations.ts
- [x] Copy utils/weatherCache.ts, weatherIconMap.ts, weatherDescriptionMap.ts
- [x] Copy all SVG icons to assets/weather/

**Contexts:**
- [x] Copy InvertColorsContext from light-template
- [x] Copy CurrentLocationContext, UnitsContext from weather
- [x] Update imports and scaling function references

**Weather components:**
- [x] Copy CurrentSummary.tsx, HourlyForecast.tsx, WeeklyForecast.tsx
- [x] Copy WeatherVariableSelector.tsx
- [x] Replace `scaledFontSize()`/`normalizedSize()` with `n()`

**Research Insights:**

**Scaling Migration (find/replace):**
```typescript
// Before
scaledFontSize(88) → n(88)
normalizedSize(32) → n(32)
```

**TypeScript Improvements to Apply:**
```typescript
// Add type guards for API responses
function isValidTemperatureUnit(value: string): value is TemperatureUnit {
  return ['Celsius', 'Fahrenheit'].includes(value as TemperatureUnit);
}

// Fix error typing (remove `any`)
} catch (error: unknown) {
  if (isGeolocationError(error)) {
    setErrorMsg(`Error: ${error.message}`);
  }
}
```

---

### Phase 3: Build Screens and Routes

**Tab layout:**
- [ ] Create app/(tabs)/_layout.tsx with tab config
- [ ] Create app/index.tsx with redirect to /(tabs)/

**Main screens:**
- [ ] Copy (tabs)/current-location.tsx → index.tsx
- [ ] Copy (tabs)/search.tsx
- [ ] Copy (tabs)/settings.tsx

**Nested routes:**
- [ ] Create search/_layout.tsx (Stack navigator)
- [ ] Copy search/results.tsx, search/weather.tsx
- [ ] Create settings/_layout.tsx (Stack navigator)
- [ ] Copy settings/temperature-unit.tsx, wind-speed-unit.tsx, precipitation-unit.tsx

**Root layout:**
- [ ] Update app/_layout.tsx with provider chain
- [ ] Add font loading with SplashScreen
- [ ] Configure status bar and system UI

**Research Insights:**

**Tab Configuration:**
```typescript
export const TABS_CONFIG = [
  { name: "Weather", screenName: "index", iconName: "place" },
  { name: "Search", screenName: "search", iconName: "search" },
  { name: "Settings", screenName: "settings", iconName: "settings" },
] as const satisfies ReadonlyArray<TabConfigItem>;
```

**Stack Layout for Nested Routes:**
```typescript
// app/settings/_layout.tsx
import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="temperature-unit" />
      <Stack.Screen name="wind-speed-unit" />
      <Stack.Screen name="precipitation-unit" />
    </Stack>
  );
}
```

---

### Phase 4: Test, Fix, Polish

**Functional testing:**
- [ ] Test location permission flow
- [ ] Test weather data fetching and display
- [ ] Test all unit conversions
- [ ] Test theme toggle (invert colors)
- [ ] Test tab navigation
- [ ] Test settings persistence
- [ ] Test search and saved locations

**Race condition fixes:**
- [ ] Add in-flight guard to CurrentLocationContext.fetchLocationAndWeather
- [ ] Add cancellation flag to search-results.tsx useEffect
- [ ] Add mutex to savedLocations.ts read-modify-write operations

**Performance optimizations:**
- [ ] Add cache TTL check (15 min) before refetching
- [ ] Pre-compute sunrise/sunset events with useMemo
- [ ] Verify memoization on list items

**Final checks:**
- [ ] Build production APK: `eas build -p android --profile production --local`
- [ ] Test on physical device
- [ ] Verify all screens scale properly

---

## Acceptance Criteria

### Functional Requirements
- [ ] App displays current location weather
- [ ] Hourly forecast (24 hours) displays correctly
- [ ] Weekly forecast (7 days) displays correctly
- [ ] Weather variable selector changes displayed data
- [ ] Location search works via Open-Meteo Geocoding API
- [ ] Can save/unsave favorite locations
- [ ] Settings: temperature unit (C/F) persists
- [ ] Settings: precipitation unit (mm/in) persists
- [ ] Settings: wind speed unit (km/h, m/s, mph, knots) persists
- [ ] Invert colors toggle works

### Non-Functional Requirements
- [ ] All sizes use n() scaling function
- [ ] UI matches passes component patterns
- [ ] Uses bun as package manager
- [ ] No deprecated components used
- [ ] Consistent with light-template conventions

### Quality Gates
- [ ] App builds without errors
- [ ] App runs on Android emulator/device
- [ ] No TypeScript errors
- [ ] All weather features functional

### Research Insights

**Additional Quality Checks:**
- [ ] No `as any` type assertions (use proper typing)
- [ ] In-flight guards on all concurrent fetch operations
- [ ] Cache TTL enforced (15-30 min)
- [ ] Only necessary Android permissions requested

---

## Critical Implementation Details

### Race Condition Fixes (MUST IMPLEMENT)

**1. CurrentLocationContext - Concurrent Fetch Guard**
```typescript
const isFetchingRef = useRef(false);

const fetchLocationAndWeather = useCallback(async () => {
  if (isFetchingRef.current) return;
  isFetchingRef.current = true;
  try {
    // ... existing fetch logic
  } finally {
    isFetchingRef.current = false;
  }
}, [/* deps */]);
```

**2. search-results.tsx - Unmount Cancellation**
```typescript
useEffect(() => {
  let canceled = false;

  const fetchResults = async () => {
    setLoading(true);
    const data = await searchLocations(query);
    if (canceled) return;
    setResults(data);
    setLoading(false);
  };

  fetchResults();
  return () => { canceled = true; };
}, [query]);
```

**3. savedLocations.ts - Mutex for Read-Modify-Write**
```typescript
let writeLock = Promise.resolve();

export const saveLocation = async (location: SavedLocation): Promise<boolean> => {
  return new Promise((resolve) => {
    writeLock = writeLock.then(async () => {
      const current = await getSavedLocations();
      if (current.find(l => l.id === location.id)) {
        resolve(false);
        return;
      }
      await AsyncStorage.setItem(KEY, JSON.stringify([...current, location]));
      resolve(true);
    });
  });
};
```

### Performance Optimizations

**Weather Cache with TTL:**
```typescript
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function getWeatherWithCache(coords, units, forceRefresh = false) {
  const cached = await getCachedWeather();

  if (cached && !forceRefresh) {
    const age = Date.now() - cached.timestamp;
    if (age < CACHE_TTL_MS) {
      return { data: cached.data, fromCache: true };
    }
  }

  const fresh = await getWeatherData(coords, units);
  await setCachedWeather(coords, fresh);
  return { data: fresh, fromCache: false };
}
```

**Pre-compute Sunrise/Sunset:**
```typescript
const sunEvents = useMemo(() => {
  const events = new Map<number, { time: Date; isSunrise: boolean }>();
  sunriseDates.forEach(d => {
    const hourKey = Math.floor(d.getTime() / 3600000);
    events.set(hourKey, { time: d, isSunrise: true });
  });
  sunsetDates.forEach(d => {
    const hourKey = Math.floor(d.getTime() / 3600000);
    events.set(hourKey, { time: d, isSunrise: false });
  });
  return events;
}, [sunriseDates, sunsetDates]);
```

---

## Error States & Edge Cases

### Location Permission Denied
- **UI**: Show CenteredMessage with "Location access required to show weather"
- **Recovery**: User can still use Search tab to find locations manually

### No Network / API Errors
- **UI**: Show CenteredMessage with "Unable to load weather. Check your connection."
- **Cached data**: If available, show with prominent "Last updated X ago" indicator
- **Retry**: Auto-retry when app returns to foreground

### Empty Saved Locations
- **UI**: Show CenteredMessage with hint "Search for a location to save it"

### Search No Results
- **UI**: Show CenteredMessage with "No locations found for [query]"

### Loading States
- **UI**: Use CenteredMessage with "Loading..." text (consistent across all screens)

---

## Data Format Standards

| Data Type | Format | Example |
|-----------|--------|---------|
| Temperature | Integer, with degree symbol | 72° |
| Time (hourly) | Device locale | 3:00 PM or 15:00 |
| Day (weekly) | Abbreviated | Mon, Tue, Wed |
| Last updated | Relative time | 5m ago, 2h ago |
| Decimal values | One decimal place | 12.5 mm |

---

## Security Checklist

- [ ] Remove READ_EXTERNAL_STORAGE permission
- [ ] Remove WRITE_EXTERNAL_STORAGE permission
- [ ] Remove SYSTEM_ALERT_WINDOW permission
- [ ] Set android:allowBackup="false"
- [ ] Consider truncating GPS coordinates (2 decimal places = ~1km accuracy, sufficient for weather)
- [ ] Add cache expiration to clear old location data

---

## Dependencies & Prerequisites

- light-template at ~/Developer/light-template
- passes UI components at ~/Developer/passes
- Open-Meteo API (no key required)
- Bun package manager installed

---

## Risk Analysis & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Expo SDK 54 breaking changes | Medium | Review Expo changelog, test incrementally |
| expo-router 6 migration issues | Medium | Add _layout.tsx to nested routes |
| Component API differences | Low | Copy directly, minimal modifications |
| Race conditions | High | Implement in-flight guards, cancellation flags |
| Cache staleness | Medium | Add 15-min TTL enforcement |

---

## References & Research

### Internal References
- Light template: `/Users/vandam/Developer/light-template`
- Passes UI components: `/Users/vandam/Developer/passes/components`
- Current weather app: `/Users/vandam/Developer/weather`

### External Documentation
- Expo SDK 54: https://docs.expo.dev/versions/v54.0.0/
- expo-router 6: https://docs.expo.dev/router/introduction/
- React 19: https://react.dev/blog/2024/04/25/react-19
- Open-Meteo API: https://open-meteo.com/en/docs

### Key Files to Port from Passes
- `/Users/vandam/Developer/passes/components/ContentContainer.tsx`
- `/Users/vandam/Developer/passes/components/Header.tsx`
- `/Users/vandam/Developer/passes/components/StyledText.tsx`
- `/Users/vandam/Developer/passes/components/HapticPressable.tsx`
- `/Users/vandam/Developer/passes/components/CustomScrollView.tsx`
- `/Users/vandam/Developer/passes/components/ToggleSwitch.tsx`
- `/Users/vandam/Developer/passes/utils/scaling.ts`

### Key Files to Migrate from Weather
- `/Users/vandam/Developer/weather/utils/weather.ts`
- `/Users/vandam/Developer/weather/utils/geocoding.ts`
- `/Users/vandam/Developer/weather/utils/weatherCache.ts`
- `/Users/vandam/Developer/weather/contexts/CurrentLocationContext.tsx`
- `/Users/vandam/Developer/weather/contexts/UnitsContext.tsx`
- All files in `/Users/vandam/Developer/weather/assets/weather/`
