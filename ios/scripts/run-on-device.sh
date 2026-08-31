#!/usr/bin/env bash
# Install and launch on a physical iPhone. Plain `react-native run-ios`
# launches Simulator when no device is booted.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

bash ios/scripts/write-metro-host.sh

DEVICE_LINE="$(
  xcrun xctrace list devices 2>/dev/null \
    | grep -v 'Simulator' \
    | grep -E 'iPhone|iPad' \
    | grep -v 'MacBook' \
    | head -n 1 || true
)"

UDID="$(printf '%s\n' "$DEVICE_LINE" | grep -oE '[0-9A-F]{8}-[0-9A-F]{16}' | tail -n 1 || true)"

if [[ -z "${UDID}" ]]; then
  echo "error: No physical iPhone detected."
  echo "1. Connect the phone with USB"
  echo "2. Unlock it and tap Trust"
  echo "3. Settings → Privacy & Security → Developer Mode = On"
  echo "4. Run: npm run ios"
  exit 1
fi

AVAILABLE="$(
  xcrun xcdevice list 2>/dev/null | python3 -c "
import json, sys
udid = sys.argv[1]
try:
    devices = json.load(sys.stdin)
except Exception:
    print('0')
    raise SystemExit
for device in devices:
    if device.get('identifier') == udid:
        print('1' if device.get('available') else '0')
        raise SystemExit
print('0')
" "$UDID"
)"

if [[ "${AVAILABLE}" != "1" ]]; then
  echo "error: Found ${DEVICE_LINE}"
  echo "but Xcode cannot install yet — USB tunnel is down."
  echo "1. Plug the USB cable into this Mac"
  echo "2. Unlock the iPhone and tap Trust"
  echo "3. Keep the screen awake, then run: npm run ios"
  exit 1
fi

echo "Using device: ${DEVICE_LINE}"
echo "UDID: ${UDID}"

exec npx react-native run-ios --udid "$UDID"
