# Dialog rules (BizConsultancyApp)

All user-facing overlays in feature code must use the shared **`Dialog`** component.

**Location:** `src/shared/components/dialog/dialog.tsx`  
**Import:** `import { Dialog } from '@/shared/components/dialog';`

## When to use Dialog

- Confirm / cancel (delete, logout, discard changes)
- Info or warning messages
- Login or permission prompts
- Short forms (amount, single field, date + time) via `children`

## API summary

| Prop | Purpose |
|------|---------|
| `visible` | Show/hide |
| `onClose` | Close handler (X, backdrop if enabled) |
| `variant` | `default` \| `warning` \| `destructive` \| `success` |
| `title` / `description` | Copy |
| `actions` | Footer buttons (`label`, `onPress`, `variant`) |
| `children` | Custom body (inputs, etc.) |
| `dismissible` | Show close button (default `true`) |
| `closeOnBackdrop` | Tap outside to close (default `true`) |

## Actions

```typescript
{ label: 'Cancel', variant: 'ghost', onPress: onClose }
{ label: 'Remove', variant: 'destructive', onPress: onConfirm }
{ label: 'Save', variant: 'default', onPress: onSave }
```

## Hooks

For imperative prompts, keep dialog state in a hook and return JSX:

```typescript
const { promptLogin, profileLoginDialog } = useProfileLoginPrompt();
// render {profileLoginDialog} once at screen root
```

## Bottom sheets

`FilterSheet` and similar full-width slide-up UIs remain shared primitives. New feature code should not copy `Modal` + sheet styles; either use `Dialog` or extend a shared bottom-sheet component.

## Legacy migration checklist

- [ ] Remove `Alert.alert`
- [ ] Replace `Modal` + custom card with `Dialog`
- [ ] Delete unused modal StyleSheet blocks
