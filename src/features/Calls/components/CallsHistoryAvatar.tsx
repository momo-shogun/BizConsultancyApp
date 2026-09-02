import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { CALLS_TAB_THEME } from '@/features/Calls/constants/callsTabTheme';
import { RemoteImage } from '@/shared/components';

const AVATAR_SIZE = 52;

export interface CallsHistoryAvatarProps {
  name: string;
  uri?: string | null;
  isVideo?: boolean;
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  const letters = (first + last).toUpperCase();
  return letters.length > 0 ? letters : '?';
}

function pickAvatarGradient(name: string): readonly [string, string] {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CALLS_TAB_THEME.avatarGradients.length;
  return CALLS_TAB_THEME.avatarGradients[index] ?? CALLS_TAB_THEME.avatarGradients[0];
}

export function CallsHistoryAvatar(props: CallsHistoryAvatarProps): React.ReactElement {
  const uri = props.uri?.trim() ?? '';
  const hasUri = uri.length > 0;
  const initials = useMemo(() => initialsFromName(props.name), [props.name]);
  const gradient = useMemo(() => pickAvatarGradient(props.name), [props.name]);

  const avatarBody = hasUri ? (
    <RemoteImage
      uri={uri}
      placeholderVariant="avatar"
      placeholderName={props.name}
      style={styles.imageFill}
      imageStyle={styles.imageFill}
    />
  ) : (
    <LinearGradient
      colors={[...gradient]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.imageFill}
    >
      <Text style={styles.initials}>{initials}</Text>
    </LinearGradient>
  );

  return (
    <View style={styles.wrap}>
      <View style={styles.avatar} accessibilityRole="image" accessibilityLabel={props.name}>
        {avatarBody}
      </View>
      {props.isVideo === true ? (
        <View style={styles.videoBadge} accessibilityLabel="Video call">
          <Ionicons name="videocam" size={10} color={CALLS_TAB_THEME.onAccent} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    flexShrink: 0,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: CALLS_TAB_THEME.surfaceElevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,23,42,0.08)',
  },
  imageFill: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 18,
    fontWeight: '700',
    color: CALLS_TAB_THEME.onAccent,
    letterSpacing: 0.4,
  },
  videoBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: CALLS_TAB_THEME.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: CALLS_TAB_THEME.bg,
  },
});
