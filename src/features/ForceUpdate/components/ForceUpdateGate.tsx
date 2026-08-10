import React, { useCallback, useEffect, useState } from 'react';
import { AppState, Linking, Platform } from 'react-native';

import { Dialog } from '@/shared/components/dialog';
import { store } from '@/store';

import { appVersionApi } from '../api/appVersionApi';
import {
  ANDROID_PLAY_STORE_URL,
  FORCE_UPDATE_MESSAGE,
  FORCE_UPDATE_TITLE,
} from '../constants/forceUpdateCopy';
import {
  readLocalAndroidVersionCode,
  shouldForceAndroidUpdate,
} from '../utils/androidVersionGate';

/**
 * Blocks the Android app when local versionCode is below the admin floor.
 * API failure → allow (offline users must not be stuck).
 */
export function ForceUpdateGate(props: React.PropsWithChildren): React.ReactElement {
  const [blocked, setBlocked] = useState(false);

  const evaluate = useCallback(async (): Promise<void> => {
    if (Platform.OS !== 'android') {
      setBlocked(false);
      return;
    }

    try {
      const result = await store.dispatch(
        appVersionApi.endpoints.getAppVersionPolicy.initiate(undefined, {
          forceRefetch: true,
        }),
      );
      if ('error' in result || result.data == null) {
        setBlocked(false);
        return;
      }
      const local = readLocalAndroidVersionCode();
      setBlocked(shouldForceAndroidUpdate(local, result.data.androidMinVersionCode));
    } catch {
      setBlocked(false);
    }
  }, []);

  useEffect(() => {
    void evaluate();
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        void evaluate();
      }
    });
    return () => sub.remove();
  }, [evaluate]);

  const openPlayStore = useCallback((): void => {
    void Linking.openURL(ANDROID_PLAY_STORE_URL);
  }, []);

  return (
    <>
      {props.children}
      <Dialog
        visible={blocked}
        onClose={() => undefined}
        dismissible={false}
        closeOnBackdrop={false}
        variant="warning"
        title={FORCE_UPDATE_TITLE}
        description={FORCE_UPDATE_MESSAGE}
        actions={[{ label: 'Update', onPress: openPlayStore }]}
      />
    </>
  );
}
