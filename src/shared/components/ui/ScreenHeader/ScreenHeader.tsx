import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  onBackPress?: () => void;
}

export function ScreenHeader(props: ScreenHeaderProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {props.onBackPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={props.onBackPress}
            hitSlop={8}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={22} color={THEME.colors.textPrimary} />
          </Pressable>
        ) : (
          <View style={styles.backSpacer} />
        )}
        <Text style={styles.title}>{props.title}</Text>
      </View>
      <View style={styles.right} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    paddingHorizontal: THEME.spacing[16],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    backgroundColor: THEME.colors.background,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  right: {
    width: 32,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backSpacer: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textPrimary,
  },
});

