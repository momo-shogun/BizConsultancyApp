import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  onBackPress?: () => void;
  onSearchPress?: () => void;
}

export function ScreenHeader(props: ScreenHeaderProps): React.ReactElement {
  const hasBack = props.onBackPress != null;
  const hasSearch = props.onSearchPress != null;

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {hasBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={props.onBackPress}
            hitSlop={8}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={22} color={THEME.colors.textPrimary} />
          </Pressable>
        ) : null}
        <Text style={styles.title}>{props.title}</Text>
      </View>
      {hasSearch ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search"
          onPress={props.onSearchPress}
          hitSlop={8}
          style={styles.rightButton}
        >
          <Ionicons name="search" size={20} color={THEME.colors.textPrimary} />
        </Pressable>
      ) : null}
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
  rightButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textPrimary,
  },
});

