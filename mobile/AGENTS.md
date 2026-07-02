# Stash Mobile

Read Expo v55 docs: https://docs.expo.dev/versions/v55.0.0/

## Scope

- Work only inside `mobile/`
- Never edit `../backend/` or parent repo backend files
- Treat the Go API as an external contract (read-only reference)

## Stack

- Expo 55, Expo Router, TypeScript
- Tailwind v4 + NativeWind v5 + react-native-css (`@/tw` components)
- `react-native-reanimated` for animations; `expo-haptics` for tactile feedback
- `@expo-google-fonts/fraunces` for onboarding display type
- Offline-first: local SQLite (`expo-sqlite`), no sync in v1 foundation
- NativeTabs navigation (`expo-router/unstable-native-tabs`)

## Dev builds

Use a development build (`npx expo run:ios` / `npx expo run:android`), not Expo Go — required for `expo-sqlite`, `expo-dev-client`, and native modules.

## Theming

Two token families live in `src/global.css`:

| Prefix | Usage | Behavior |
|--------|-------|----------|
| `sf-*` | Main app screens | Adapts to system light/dark via `light-dark()` and `platformColor()` on iOS |
| `fg-*` | Onboarding only | Fixed values — always warm cream + orange, immune to system appearance |

### `fg` theme tokens (onboarding)

- `fg-orange` — primary accent / CTAs
- `fg-orange-deep` — pressed / emphasis
- `fg-orange-soft` — tinted chips / cards
- `fg-cream` — base background
- `fg-ink` / `fg-ink-2` — primary / secondary text
- `fg-line` — borders / separators
- `fg-red` — error text

Use `fg-*` Tailwind classes (e.g. `bg-fg-cream`, `text-fg-ink`) in onboarding. Never use `sf-*` there.

### `sf` theme tokens (main app)

- `sf-bg`, `sf-bg-2`, `sf-text`, `sf-text-2`, `sf-blue`, `sf-green`, `sf-red`, `sf-gray`

## Onboarding

Route: `app/onboarding.tsx` → `components/onboarding/onboarding-flow.tsx`

### Structure

```
components/onboarding/
  onboarding-flow.tsx      # step state, transitions, progress dots, haptics
  use-onboarding-form.ts   # budget form state + submit
  types.ts
  steps/
    welcome-step.tsx
    explain-step.tsx
    budget-step.tsx
    celebration-step.tsx
    shared.ts              # step prop types
  ui/
    step-shell.tsx         # cream bg, safe-area, content + footer layout
    display-text.tsx       # Fraunces display headings
    primary-button.tsx     # orange pill CTA + haptics
    ghost-button.tsx       # back button
    progress-dots.tsx      # animated step indicator
```

### Conventions

- Every step wraps content in `StepShell` and uses `DisplayText` for headings
- Body copy uses system sans via `@/tw` `Text` with `text-fg-ink-2`
- Staggered entrances: `FadeInDown.delay(...)` from Reanimated on content blocks
- Step transitions: direction-aware `FadeInRight`/`FadeOutLeft` (forward) and reversed (back)
- Haptics: `selectionAsync` on step change; `impactAsync` on button press; success notification on celebration
- Onboarding route sets `StatusBar style="dark"` and `contentStyle` cream background — locked regardless of system theme
- Fraunces fonts (`Fraunces_600SemiBold`, `Fraunces_400Regular_Italic`) are loaded in `app/_layout.tsx` via `useFonts`; gate splash hide on font load

## Conventions

- Routes in `app/` only; components in `components/`, data in `db/` and `features/`
- Use `ScrollView` with `contentInsetAdjustmentBehavior="automatic"` as first child in main app screens
- Import styled primitives from `@/tw` (not raw react-native for layout)
- Animated views: import `Animated` from `@/tw/animated` (wraps `@/tw` View with Reanimated)
- Platform-specific trees live in `components/` (`.ios.tsx` / `.android.tsx`), never in `app/`
