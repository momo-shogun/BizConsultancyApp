import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type InCallControlButtonProps = {
  icon: string;
  label: string;
  active?: boolean;
  variant?: 'default' | 'danger';
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function InCallControlButton({
  icon,
  label,
  active = false,
  variant = 'default',
  onPress,
  style,
}: InCallControlButtonProps): React.ReactElement {
  const isDanger = variant === 'danger';

  return (
    <View style={[styles.wrap, style]}>
      <Pressable
        style={[
          styles.btn,
          isDanger ? styles.btnDanger : null,
          active && !isDanger ? styles.btnActive : null,
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Ionicons
          name={icon}
          size={isDanger ? 28 : 24}
          color="#fff"
          style={isDanger ? styles.endIcon : undefined}
        />
      </Pressable>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 8,
    minWidth: 72,
  },
  btn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActive: {
    backgroundColor: 'rgba(255,255,255,0.32)',
  },
  btnDanger: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EF4444',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  endIcon: {
    transform: [{ rotate: '135deg' }],
  },
});
