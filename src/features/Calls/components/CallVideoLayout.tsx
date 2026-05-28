import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RenderModeType, RtcSurfaceView } from 'react-native-agora';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { CallAvatar } from './CallAvatar';

export interface CallVideoLayoutProps {
  remoteUid: number | null;
  remoteVideoEnabled: boolean;
  localVideoEnabled: boolean;
  remoteName: string;
  remoteAvatarUrl: string | null;
}

export function CallVideoLayout(props: CallVideoLayoutProps): React.ReactElement {
  const {
    remoteUid,
    remoteVideoEnabled,
    localVideoEnabled,
    remoteName,
    remoteAvatarUrl,
  } = props;

  const hasRemoteUid = remoteUid != null && remoteUid > 0;
  const showRemoteSurface = hasRemoteUid && remoteVideoEnabled;

  return (
    <View style={styles.root}>
      {showRemoteSurface ? (
        <RtcSurfaceView
          key={`remote-${remoteUid}`}
          style={styles.remoteVideo}
          canvas={{
            uid: remoteUid,
            renderMode: RenderModeType.RenderModeHidden,
          }}
        />
      ) : (
        <View style={styles.remoteFallback}>
          <CallAvatar uri={remoteAvatarUrl} name={remoteName} size={120} />
          <Text style={styles.remoteName}>{remoteName}</Text>
          <Text style={styles.waitingText}>
            {!hasRemoteUid
              ? 'Waiting for video…'
              : remoteVideoEnabled
                ? 'Connecting video…'
                : 'Camera is off'}
          </Text>
        </View>
      )}

      <View style={styles.localPip}>
        {localVideoEnabled ? (
          <RtcSurfaceView
            key="local-preview"
            style={styles.localVideo}
            canvas={{
              uid: 0,
              renderMode: RenderModeType.RenderModeHidden,
            }}
            zOrderOnTop
            zOrderMediaOverlay
          />
        ) : (
          <View style={styles.localFallback}>
            <Ionicons name="videocam-off-outline" size={28} color="rgba(255,255,255,0.75)" />
            <Text style={styles.cameraOffText}>Camera off</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0F14',
  },
  remoteVideo: {
    flex: 1,
    width: '100%',
  },
  remoteFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  remoteName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  waitingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
  },
  localPip: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    width: 108,
    height: 152,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: '#1E293B',
  },
  localVideo: {
    width: '100%',
    height: '100%',
  },
  localFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  cameraOffText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
  },
});
