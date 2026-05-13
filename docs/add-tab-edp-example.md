# Add a tab (example: EDP) and related screens

This repo uses **typed React Navigation**: route strings live in [`routeNames.ts`](../src/navigation/routeNames.ts), param lists in [`types.ts`](../src/navigation/types.ts), the active shell is [`PlankBarV1TabNavigator.tsx`](../src/navigation/tabNavigators/plankBarV1/PlankBarV1TabNavigator.tsx) (see [`AppNavigator.tsx`](../src/navigation/AppNavigator.tsx)), and deep links in [`linking.ts`](../src/navigation/linking.ts).

**Note:** The bottom tab that shows the label **“EDP”** today is still the route key [`ROUTES.App.Bookings`](../src/navigation/routeNames.ts) with `options={{ title: 'EDP' }}`. The steps below use **“EDP” as a product name**; you can either attach screens to that existing tab or add a **new** tab key—pick one path so you do not end up with two “EDP” tabs.

---

## Choose a path

| Goal | What to do |
|------|----------------|
| **A. More screens under the current EDP tab** (same tab, push stack) | Keep `ROUTES.App.Bookings`. Replace the single `BookingsScreen` with a **stack navigator** (same pattern as Services). Add child routes under something like `ROUTES.Edp.*` and `EdpStackParamList`. |
| **B. A brand‑new tab** (e.g. separate from Bookings) | Add `ROUTES.App.Edp` (or similar), extend `AppTabParamList`, register a new `PlankTab.Screen`, add linking. **Max 5 tabs** (architecture rule)—this app currently has 4 tab routes, so one more is OK. |

Below is **Path B** end‑to‑end (new tab + nested stack). For Path A, skip adding `App.Edp` and instead swap the `Bookings` tab’s `component` to your new stack and define `EdpStackParamList` / `ROUTES.Edp.*` only.

---

## Path B — New “EDP” tab with its own stack (List + Detail)

### 1. Feature screens

Create screens under the feature folder, for example:

- `src/features/Edp/screens/EdpHomeScreen.tsx` — list / landing  
- `src/features/Edp/screens/EdpDetailScreen.tsx` — second screen; params e.g. `{ id: string }`

Use **named exports** and explicit return types (`React.ReactElement`). Do not call `fetch` directly from screens if you later add APIs—use hooks/services per project rules.

### 2. Route name constants

In [`src/navigation/routeNames.ts`](../src/navigation/routeNames.ts):

- Under `App`, add a key, e.g. `Edp: 'App/Edp'`.
- Add a small group for the nested stack, same style as `Services`, e.g.:

```ts
Edp: {
  List: 'App/Edp/List',
  Detail: 'App/Edp/Detail',
},
```

Use **serialisable** route names only (strings).

### 3. Param lists

In [`src/navigation/types.ts`](../src/navigation/types.ts):

- Declare `EdpStackParamList` mapping each `ROUTES.Edp.*` to `undefined` or `{ id: string }` etc.
- On `AppTabParamList`, set the new tab to nested params, same pattern as Services:

```ts
[ROUTES.App.Edp]: NavigatorScreenParams<EdpStackParamList>;
```

### 4. Stack navigator

Add a file next to [`ServicesStackNavigator.tsx`](../src/navigation/ServicesStackNavigator.tsx), e.g. `src/navigation/EdpStackNavigator.tsx`:

- `createNativeStackNavigator<EdpStackParamList>()`
- `initialRouteName={ROUTES.Edp.List}`
- One `<Stack.Screen>` per Edp route, `component` pointing at your feature screens.

### 5. Tab navigator

In [`PlankBarV1TabNavigator.tsx`](../src/navigation/tabNavigators/plankBarV1/PlankBarV1TabNavigator.tsx):

- Import `EdpStackNavigator`.
- Add `<PlankTab.Screen name={ROUTES.App.Edp} component={EdpStackNavigator} options={{ title: 'EDP' }} />` (or your label).
- Extend `getTabBarIcon` `switch` with `case ROUTES.App.Edp:` and Ionicons names.

If you ever switch root to [`BottomTabNavigator.tsx`](../src/navigation/tabNavigators/BottomTabNavigator.tsx), mirror the same `Screen` + icon there.

### 6. Deep linking

In [`linking.ts`](../src/navigation/linking.ts), under `[ROUTES.Root.App].screens`, add an entry for `[ROUTES.App.Edp]` with `path: 'edp'` (or your slug) and nested `screens` for List / Detail, following the same shape as `[ROUTES.App.Services]`.

Prefix stays `bizconsultancy://` unless you change it globally.

### 7. Navigate from code

From a screen inside the authenticated app:

```ts
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { EdpStackParamList } from '@/navigation/types';
import { ROUTES } from '@/navigation/routeNames';

const navigation = useNavigation<NativeStackNavigationProp<EdpStackParamList>>();
navigation.navigate(ROUTES.Edp.Detail, { id: '123' });
```

From **outside** the Edp stack (e.g. Home tab), use the **composite** / tab + stack typing (often `CompositeNavigationProp` or navigate via parent)—pick the pattern your codebase already uses for “Home → Services detail” if present.

### 8. Smoke checks

- `npx tsc --noEmit`
- Open tab, push Detail, back, deep link `bizconsultancy://edp/...` if configured

---

## Path A — Same tab label, multiple screens (recommended if “EDP” is already the tab)

1. Add `ROUTES.Edp.List` / `ROUTES.Edp.Detail` (or reuse `Bookings` names if you prefer one naming scheme).  
2. Add `EdpStackParamList` (or `BookingsStackParamList`).  
3. Create `EdpStackNavigator` (or `BookingsStackNavigator`).  
4. In `PlankBarV1TabNavigator`, change the **Bookings** line from `component={BookingsScreen}` to `component={EdpStackNavigator}` and keep `options={{ title: 'EDP' }}`.  
5. Update `AppTabParamList` so `[ROUTES.App.Bookings]` is `NavigatorScreenParams<EdpStackParamList>` instead of `undefined`.  
6. Update `linking.ts` for nested paths under `bookings` (or rename path to `edp` for clarity).

---

## Checklist (copy)

- [ ] Screens in `src/features/<Feature>/screens/`
- [ ] `routeNames.ts` — `App.*` tab key + nested `*Stack` keys
- [ ] `types.ts` — `*StackParamList` + `AppTabParamList` nested entry
- [ ] `*StackNavigator.tsx` in `src/navigation/`
- [ ] `PlankBarV1TabNavigator.tsx` — `Screen` + tab icon (`BottomTabNavigator` if used)
- [ ] `linking.ts` — nested `screens` + paths
- [ ] `tsc --noEmit` + manual run on device

---

## Related doc

See [navigation-scaling.md](./navigation-scaling.md) for *why* this is split across files and how to reduce duplication later (registry, feature screen lists).
