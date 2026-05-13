# Navigation: why many files, and simpler production patterns

## Is the current approach “wrong”?

No. React Navigation in production usually needs:

| Piece | Purpose |
|--------|--------|
| Route name constants | No typos, single source for strings |
| Param list types (`types.ts`) | Typed `navigate` / `route.params` |
| Stack / tab navigator | Where screens are mounted |
| `linking` config | Deep links and URLs |

Touching several places when adding a screen is normal; you are paying for **type safety** and **predictable stacks**.

## What you change today for one new screen (this repo)

Rough checklist:

1. **`src/navigation/routeNames.ts`** — add a route id (if not nested under existing keys).
2. **`src/navigation/types.ts`** — add params for that screen on the right param list.
3. **The navigator that owns it** (e.g. `AuthNavigator`, `ServicesStackNavigator`, tab navigator) — add `<Stack.Screen … />`.
4. **`src/navigation/linking.ts`** — add a path if the screen should open from a URL / notification.

Optional: headers, `screenOptions`, guards (auth).

## Simpler *without* dropping production quality

### 1. One route registry (recommended)

Keep **names + param shapes** in one module (or one per root: `authRoutes.ts`, `appRoutes.ts`). Navigators **import** from there instead of repeating literals. You still edit the registry + one stack, but you stop hunting magic strings.

### 2. Feature-owned screen lists

Each feature exports a small array of `{ name, component, options }`. The stack file **merges** those arrays. New screen = one entry next to the screen file + one import in the stack composer.

### 3. Codegen (larger teams)

Generate `types.ts` / linking from YAML or JSON. More setup; fewer manual edits later.

## What looks simpler but costs you

- **Untyped `useNavigation()`** — fewer files, more runtime bugs.
- **Skipping linking** — fine for prototypes; breaks deep links and some integrations.

## What this project intentionally avoids

**Expo Router / file-based routing** — different model; not used here (see project navigation rules).

## Summary

- **Right way for production:** typed stacks + linking + explicit navigators.
- **Simpler “right enough”:** central **route registry** + **per-feature screen registration** so “add screen” is 2 focused edits, not five scattered guesses.
