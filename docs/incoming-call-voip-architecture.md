# Incoming call system (production VoIP roadmap)

This document describes the **implemented** hybrid delivery path in `BizConsultancyApp` plus the native pieces still required for **feature parity with WhatsApp / FaceTime**.

## Implemented client architecture

### 1. Foreground → Socket.IO (authoritative UX)

While the bridge is authenticated and foregrounded:

- Caller hits `POST /calls/initiate` on the Nest API (`biz_consultancy_portal`).
- Callee hears `call.incoming` via Socket.IO (`callSocketService`).
- `CallEngine.handleIncoming()` updates Redux + routes to `IncomingCall`.
- **`displayIncomingCallNotification` is skipped** when `AppState === 'active'` to avoid duplicated UX.

### 2. Background / terminated → Firebase Cloud Messaging (high priority data)

Quit and background wakes use `@react-native-firebase/messaging` + `@notifee/react-native`:

| Entry | Behaviour |
| ----- | --------- |
| `index.js` `setBackgroundMessageHandler` | `delivery: 'background'` → always eligible for tray + full-screen on Android |
| `messaging().onMessage` | `delivery: 'foreground'` → tray suppressed when app active |
| `onNotificationOpenedApp` / `getInitialNotification` | `delivery: 'opened'` → state sync only (no duplicate tray) |

### 3. Socket while background

If Socket.IO reconnects quickly while the JS runtime is alive, **`handleIncoming`** calls `displayIncomingCallNotification(payload, { delivery: 'foreground' })` whenever `AppState.currentState !== 'active'`. That fixes “ringtone but no tray” when push is delayed.

### 4. Cold-start navigation

`navigationRef.isReady()` is often **false** when FCM wakes the isolate. `CallEngine` now **queues** the target (`IncomingCall` / `OutgoingCall` / `InCall`) until `NavigationContainer` fires `onReady`, then **`flushPendingCallNavigation()`** runs from `RootNavigator`.

### 5. Persist race (headless FCM handler)

Auth is stored via `redux-persist` → async MMKV adapter. Fresh isolates may run **before REHYDRATE**.

- `bindSocketHandlers()` resolves: `store.auth.token ?? readPersistedAuthTokenSync()` (sync read of `persist:root`).
- `handleIncoming()` resolves role via `resolveLocalCallRole()`: Redux `accountRole` / `preferredAccountRole` → sync MMKV preferred role / persisted auth → if still unknown, **trust `payload.calleeRole`** (device was already targeted by FCM).
- Notifee Answer / Decline uses `seedIncomingFromNotification()` so session state is always seeded from notification data before accept/decline.

### 6. Idempotency

Push payloads now carry **`eventId`**, **`eventVersion`**, **`timestamp`** aligned with Socket.IO envelopes so `CallReliabilityManager` rejects duplicates.

---

## Implemented server payload (`FCM` `data` map)

All values are strings (FCM requirement):

| Key | Example | Notes |
| --- | ------- | ----- |
| `type` | `call.incoming` | Required discriminator |
| `sessionId` | `12345` | |
| `callType` | `voice` \| `video` | |
| `status` | `initiated` | |
| `callerUserId` / `calleeUserId` | numeric strings | |
| `callerRole` / `calleeRole` | `consultant` \| `user` | |
| `callerName` | display string | fallback “Someone” on API |
| `callerThumbnail` | URL or backend key | large icon when resolvable |
| `eventId` | UUID | new in API |
| `eventVersion` | monotonic number | new in API |
| `timestamp` | epoch ms | new in API |

Android: **`android.priority = high`** and short TTL remain in `CallPushService`.

APNs: Existing alert block is retained as **best-effort** when JS does not wake; native CallKit flows should eventually replace reliance on banner-only APNS behaviour.

---

## Deep links (`bizconsultancy://`)

Configured in `src/navigation/linking.ts`:

- `bizconsultancy://call/incoming/:sessionId`
- `bizconsultancy://call/active/:sessionId`

Populate these from notifications or marketing surfaces when you attach `Linking`-compatible intent data.

---

## Android hardening checklist (partially done)

| Item | Status |
| ---- | ------ |
| `POST_NOTIFICATIONS` (API 33+) | Requested via `PermissionsAndroid` + token sync |
| High-importance incoming channel | Native `MainApplication` + Notifee |
| Full-screen incoming intent | Notifee `fullScreenAction` + `USE_FULL_SCREEN_INTENT` |
| Android 14+ FSI permission check | `CallAndroidPermissions` native module + one-time Dialog → settings |
| Battery optimisation soft-prompt | Notifee `isBatteryOptimizationEnabled` + one-time Dialog |
| Wake + lock screen Activity | Manifest + runtime flags in `MainActivity` |
| Headless consultant role race | Fixed via `resolveLocalCallRole` + notification seed |
| **Killed-state native FCM receiver** | `IncomingCallFcmReceiver` paints CALL + FSI when JS headless cannot run |
| Foreground Service for ongoing call | Implemented (`callForegroundService` from CallEngine on connect) |
| Telecom `ConnectionService` | **TODO** for OS-level dialer parity / Bluetooth routing |

### Debugging killed vs background (Android)

| How you “close” the app | What it means | Expect incoming UI? |
| --- | --- | --- |
| Home button (still in Recents) | **Background** — JS process often alive | Yes (Notifee / headless) |
| Swipe away from Recents | **Killed** — process gone | Yes via **native** `IncomingCallFcmReceiver` (release APK most reliable) |
| Settings → Force stop | FCM **blocked** until user opens app | **No** — not a valid test |
| `adb shell am force-stop …` | Same as Force stop | **No** |

**Debug builds:** swiping away often fails to run Headless JS (Metro/bundle). Prefer **`assembleRelease` / release APK** to validate killed-state. Debug is fine for **background** tests.

**Logcat filters while testing:** `IncomingCallFcm`, `RNFirebaseMsgReceiver`, `CallPushService`.

---

## iOS checklist (critical gaps remain)

| Item | Status |
| ---- | ------ |
| `UIBackgroundModes`: `audio`, `voip`, `remote-notification` | Present |
| VoIP UX via Notifee (`timeSensitive`, category actions) | Implemented |
| **PushKit VoIP pushes** separate from standard FCM | **TODO** (required for deterministic wake-to-call in killed state since iOS throttles data pushes) |
| **CallKit** (`CXProvider` / native answer-decline syncing) | **TODO** – recommended via `react-native-callkeep` or custom native bridge |
| Entitlements & Xcode capabilities | Needs Apple Developer setup + provisioning |

Production reference (Apple): Incoming VoIP pushes must be delivered through **PushKit** and surfaced with **CallKit**; standard user-visible notifications are not a substitute for regulatory-compliant VoIP wakeups.

---

## Operational toggles (API)

- `CALL_PUSH_ENABLED=true`
- `FIREBASE_SERVICE_ACCOUNT_PATH` → service account JSON for `firebase-admin`
- Register device tokens via `POST /calls/device-token` (already used by the app)

---

## Next implementation passes (recommended order)

1. **iOS PushKit + CallKit** (production VoIP wake) with maintained libraries only; route answer / end into `CallEngine`.
2. **Telecom `ConnectionService`** on Android + `ConnectionRequest` from FCM / full-screen flow (dialer-grade UX).
3. **Ring timeout + missed-call** push from API when callee never ACKs (align with consult SLA).

This ordering maximises user-visible reliability before investing in full OS telephony integration.
