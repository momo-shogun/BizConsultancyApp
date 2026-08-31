#!/usr/bin/env bash
# Resolves the Mac LAN IP Metro should advertise to a physical iPhone.
# USB can install/launch the app; JS still loads over this IP:8081.
set -euo pipefail

resolve_ip() {
  local ip=""
  local iface
  for iface in en0 en1 en2 en3 en4 en5 bridge100; do
    ip="$(ipconfig getifaddr "${iface}" 2>/dev/null || true)"
    if [[ -n "${ip}" ]]; then
      printf '%s\n' "${ip}"
      return 0
    fi
  done
  ifconfig | awk '/inet / && $2 != "127.0.0.1" { print $2; exit }'
}

IP="$(resolve_ip | tr -d '[:space:]')"
if [[ -z "${IP}" ]]; then
  echo "warning: Could not resolve a LAN IP for Metro." >&2
  exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
IOS_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
mkdir -p "${IOS_DIR}/BizConsultancyApp"
printf '%s\n' "${IP}" > "${IOS_DIR}/BizConsultancyApp/ip.txt"
echo "Metro host IP: ${IP}"

if [[ -n "${TARGET_BUILD_DIR:-}" && -n "${UNLOCALIZED_RESOURCES_FOLDER_PATH:-}" ]]; then
  mkdir -p "${TARGET_BUILD_DIR}/${UNLOCALIZED_RESOURCES_FOLDER_PATH}"
  printf '%s\n' "${IP}" > "${TARGET_BUILD_DIR}/${UNLOCALIZED_RESOURCES_FOLDER_PATH}/ip.txt"
fi

if [[ -n "${TARGET_BUILD_DIR:-}" && -n "${INFOPLIST_PATH:-}" ]]; then
  PLIST="${TARGET_BUILD_DIR}/${INFOPLIST_PATH}"
  if [[ -f "${PLIST}" ]]; then
    /usr/libexec/PlistBuddy -c "Set :RCTMetroHost ${IP}" "${PLIST}" 2>/dev/null \
      || /usr/libexec/PlistBuddy -c "Add :RCTMetroHost string ${IP}" "${PLIST}"
  fi
fi
