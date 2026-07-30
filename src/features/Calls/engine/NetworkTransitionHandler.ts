import NetInfo, { type NetInfoState, type NetInfoSubscription } from '@react-native-community/netinfo';

type NetworkHandler = {
  onNetworkChange: () => void;
};

let subscription: NetInfoSubscription | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
/** `null` until first NetInfo snapshot — initial fire must not trigger reconnect. */
let lastConnected: boolean | null = null;

/**
 * Use link connectivity only. `isInternetReachable` flickers null→false→true on cellular
 * and right after call connect; treating that as offline→online caused leave()+rejoin ~2s
 * after connect, which the peer saw as Agora Quit → POST end(network_drop).
 */
function isLinkUp(state: NetInfoState): boolean {
  return state.isConnected === true;
}

/**
 * Only invoke reconnect after a real offline → online recovery.
 * Soft recovery should not leave the Agora channel; CallEngine skips hard rejoin when still joined.
 */
export function startNetworkTransitionHandler(handler: NetworkHandler): void {
  stopNetworkTransitionHandler();
  lastConnected = null;
  subscription = NetInfo.addEventListener((state) => {
    const connected = isLinkUp(state);
    if (lastConnected === null) {
      lastConnected = connected;
      return;
    }
    const wasConnected = lastConnected;
    lastConnected = connected;
    if (!(!wasConnected && connected)) {
      return;
    }
    if (debounceTimer != null) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      handler.onNetworkChange();
    }, 2000);
  });
}

export function stopNetworkTransitionHandler(): void {
  if (debounceTimer != null) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  subscription?.();
  subscription = null;
  lastConnected = null;
}
