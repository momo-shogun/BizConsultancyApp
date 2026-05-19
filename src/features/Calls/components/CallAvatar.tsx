import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ImagePlaceholder, RemoteImage } from '@/shared/components';

type CallAvatarProps = {
  uri: string | null;
  name: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function CallAvatar({
  uri,
  name,
  size = 120,
  style,
}: CallAvatarProps): React.ReactElement {
  const radius = size / 2;

  return (
    <View
      style={[
        styles.ring,
        { width: size, height: size, borderRadius: radius },
        style,
      ]}
    >
      {uri != null ? (
        <RemoteImage
          uri={uri}
          style={{ width: size, height: size, borderRadius: radius }}
          placeholderVariant="avatar"
          placeholderName={name}
        />
      ) : (
        <View style={[styles.fallback, { width: size, height: size, borderRadius: radius }]}>
          <Ionicons name="person" size={size * 0.42} color="#fff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});
