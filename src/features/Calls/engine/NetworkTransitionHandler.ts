import NetInfo, { type NetInfoSubscription } from '@react-native-community/netinfo';

type NetworkHandler = {
  onNetworkChange: () => void;
};

let subscription: NetInfoSubscription | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export function startNetworkTransitionHandler(handler: NetworkHandler): void {
  stopNetworkTransitionHandler();
  subscription = NetInfo.addEventListener(() => {
    if (debounceTimer != null) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
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
}
