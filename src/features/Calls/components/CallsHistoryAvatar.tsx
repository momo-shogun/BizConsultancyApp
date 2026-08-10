import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { CALLS_TAB_THEME } from '@/features/Calls/constants/callsTabTheme';
import {
  avatarGradientIndex,
  initialsFromName,
} from '@/features/Calls/utils/callsTabHistoryDisplay';

const AVATAR_SIZE = 48;

export interface CallsHistoryAvatarProps {
  name: string;
}

export function CallsHistoryAvatar(props: CallsHistoryAvatarProps): React.ReactElement {
  const initials = useMemo(() => initialsFromName(props.name), [props.name]);
  const colors = CALLS_TAB_THEME.avatarGradients[avatarGradientIndex(props.name)];

  return (
    <LinearGradient
      colors={[colors[0], colors[1]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.avatar}
    >
      <View style={styles.inner}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: CALLS_TAB_THEME.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
