import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { FadeIn } from 'react-native-reanimated';

import { THEME } from '@/constants/theme';

import type { ServiceSearchHit } from '../types/search.types';

type SearchResultRowProps = {
  item: ServiceSearchHit;
  index: number;
  accentColor: string;
  onPress: () => void;
};

export function SearchResultRow({
  item,
  index,
  accentColor,
  onPress,
}: SearchResultRowProps): React.ReactElement {
  return (
    <Animated.View entering={FadeIn.delay(Math.min(index * 30, 180)).duration(180)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        accessibilityRole="button"
        accessibilityLabel={`Open ${item.title}`}
      >
        <View style={[styles.iconWrap, { backgroundColor: `${accentColor}18` }]}>
          <Ionicons name="document-text-outline" size={20} color={accentColor} />
        </View>
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          {item.categorySlug != null && item.categorySlug.length > 0 ? (
            <Text style={styles.meta} numberOfLines={1}>
              {item.categorySlug.replace(/-/g, ' ')}
            </Text>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={18} color={THEME.colors.textSecondary} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[12],
    paddingVertical: THEME.spacing[12],
    paddingHorizontal: THEME.spacing[4],
  },
  rowPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.992 }],
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontSize: THEME.typography.size[15],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
    lineHeight: 20,
  },
  meta: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
    textTransform: 'capitalize',
  },
});
