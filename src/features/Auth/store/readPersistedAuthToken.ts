import MMKVStorage from 'react-native-mmkv-storage';

/**
 * Redux-persist rehydrates auth asynchronously. FCM/Socket bootstrap in a headless,
 * freshly-started isolate can run before `_persist`/REHYDRATE completes — resolve the JWT
 * directly from MMKV (`persist:root`) so incoming-call handling still connects the socket.
 */
export function readPersistedAuthTokenSync(): string | undefined {
  try {
    const mmkv = new MMKVStorage.Loader().initialize();
    const rawRoot = mmkv.getString('persist:root');
    if (rawRoot == null || rawRoot.length === 0) {
      return undefined;
    }
    const outer = JSON.parse(rawRoot) as Record<string, unknown>;
    const authChunk = outer.auth;
    if (typeof authChunk !== 'string' || authChunk.length === 0) {
      return undefined;
    }
    const authState = JSON.parse(authChunk) as { token?: unknown };
    const token = authState.token;
    return typeof token === 'string' && token.length > 0 ? token : undefined;
  } catch {
    return undefined;
  }
}
