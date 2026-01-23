# App Template

Expo template with pre-built components and patterns.

## Setup

Update `app.json`:
```json
{
  "expo": {
    "name": "App Name",
    "slug": "appname",
    "icon": "./assets/icon.png",
    "android": {
      "package": "com.vandam.appname"
    }
  }
}
```

Delete `/android` folder before first build (regenerates with your config).

## Commands
- `bunx expo run:android` - Build and run
- `bun start` - Start dev server
- `bun run sync-version` - Sync version from app.json to package.json + build.gradle
- `bun run generate-icon` - Generate app icon from first letter of app name

## GitHub Actions

Workflow at `.github/workflows/build.yml` builds APK and creates release:
1. Triggered manually via `workflow_dispatch`
2. Builds production APK using EAS
3. Creates GitHub release with changelog

Requires `EXPO_TOKEN` secret in repo settings.

## Components (Ready to Use)

| Component | Purpose |
|-----------|---------|
| `ContentContainer` | Page wrapper with header, handles background color |
| `StyledText` | Theme-aware text with custom font |
| `StyledButton` | Button with haptic feedback |
| `HapticPressable` | Pressable with haptic feedback |
| `Header` | Top bar with title, back button, icons |
| `Navbar` | Bottom tab navigation |
| `CustomScrollView` | FlatList with custom scroll indicator |
| `ToggleSwitch` | On/off toggle |
| `SelectorButton` | Shows label + value, navigates to options page |
| `OptionsSelector` | Full-page picker for selecting from options |

## Styling with `n()`

**Always use `n()` for sizes** - normalizes across screen densities:
```tsx
import { n } from "@/utils/scaling";

const styles = StyleSheet.create({
  container: { padding: n(16) },
  text: { fontSize: n(18) },
  icon: { width: n(24), height: n(24) }
});
```

## Tabs

To add a new tab:

1. Create screen file `app/(tabs)/search.tsx`
2. Add to `TABS_CONFIG` in `app/(tabs)/_layout.tsx`:
```tsx
export const TABS_CONFIG: ReadonlyArray<TabConfigItem> = [
  { name: "Home", screenName: "index", iconName: "home" },
  { name: "Search", screenName: "search", iconName: "search" },  // new
  { name: "Settings", screenName: "settings", iconName: "settings" },
] as const;
```
3. Add `<Tabs.Screen>` entry:
```tsx
<Tabs.Screen name="index" />
<Tabs.Screen name="search" />  // new
<Tabs.Screen name="settings" />
```

Icons: Use [MaterialIcons](https://icons.expo.fyi/Index) names.

## Settings Pattern

Settings use nested routes:
```
app/(tabs)/settings.tsx        → Main settings page
app/settings/customise.tsx     → Customise options
app/settings/display-mode.tsx  → Options page (example)
```

Use `SelectorButton` + `OptionsSelector` for option pickers:
```tsx
// In settings page
<SelectorButton
    label="Display Mode"
    value={currentValue}
    href="/settings/display-mode"
/>

// In options page (app/settings/display-mode.tsx)
<OptionsSelector
    title="Display Mode"
    options={[{ label: "Standard", value: "standard" }, ...]}
    selectedValue={displayMode}
    onSelect={(value) => setDisplayMode(value)}
/>
```

## Confirmation Screen

For destructive actions, use the confirm screen pattern:
```tsx
router.push({
    pathname: "/confirm",
    params: {
        title: "Clear Cache",
        message: "Are you sure?",
        confirmText: "Clear",
        action: "clearCache",
        returnPath: "/(tabs)/settings",
    },
});

// Handle confirmation in useEffect
useEffect(() => {
    if (params.confirmed === "true" && params.action === "clearCache") {
        router.setParams({ confirmed: undefined, action: undefined });
        // Do the action
    }
}, [params.confirmed, params.action]);
```

## Contexts

Wrapped in `app/_layout.tsx`:
- `InvertColorsContext` - Theme toggle (black/white), persists to AsyncStorage
- `DisplayModeContext` - Example setting context (see `app/settings/display-mode.tsx`)
- `HapticContext` - `useHaptic()` returns function to trigger feedback

Use: `const { invertColors } = useInvertColors();`

## Rules
- Use `n()` for all numeric style values
- Use `bun` instead of npm
- Minimize `useEffect` - see [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- Readable code > comments
