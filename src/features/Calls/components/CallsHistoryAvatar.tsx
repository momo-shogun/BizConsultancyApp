import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { CALLS_TAB_THEME } from '@/features/Calls/constants/callsTabTheme';
import { RemoteImage } from '@/shared/components';

const AVATAR_SIZE = 48;

export interface CallsHistoryAvatarProps {
  name: string;
  uri?: string | null;
}

export function CallsHistoryAvatar(props: CallsHistoryAvatarProps): React.ReactElement {
  const uri = props.uri?.trim() ?? '';
  const hasUri = uri.length > 0;

  if (hasUri) {
    return (
      <View style={styles.avatar} accessibilityRole="image" accessibilityLabel={props.name}>
        <RemoteImage
          uri={uri}
          placeholderVariant="avatar"
          placeholderName={props.name}
        />
      </View>
    );
  }

  return (
    <View style={styles.fallback} accessibilityRole="image" accessibilityLabel={props.name}>
      <Ionicons name="person" size={22} color={CALLS_TAB_THEME.textSecondary} />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: CALLS_TAB_THEME.surfaceElevated,
    flexShrink: 0,
  },
  fallback: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: CALLS_TAB_THEME.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
