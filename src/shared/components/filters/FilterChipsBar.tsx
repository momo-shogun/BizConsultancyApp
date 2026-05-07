import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

export interface FilterChipItem {
  id: string;
  label: string;
  isSelected?: boolean;
  onPress?: () => void;
  leftIconName?: string;
}

export interface FilterChipsBarProps {
  onSortPress?: () => void;
  onFilterPress?: () => void;
  chips?: FilterChipItem[];
}

export function FilterChipsBar(props: FilterChipsBarProps): React.ReactElement {
  const { onSortPress, onFilterPress, chips = [] } = props;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sort"
        onPress={onSortPress}
        hitSlop={8}
        style={({ pressed }) => [styles.controlChip, pressed ? styles.pressed : null]}
      >
        <Ionicons name="swap-vertical" size={16} color={THEME.colors.textPrimary} />
        <Text style={styles.controlText}>Sort</Text>
        <Ionicons name="chevron-down" size={16} color={THEME.colors.textSecondary} />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Filter"
        onPress={onFilterPress}
        hitSlop={8}
        style={({ pressed }) => [styles.controlChip, pressed ? styles.pressed : null]}
      >
        <Ionicons name="options-outline" size={16} color={THEME.colors.textPrimary} />
        <Text style={styles.controlText}>Filter</Text>
      </Pressable>

      {chips.map((chip) => (
        <Pressable
          key={chip.id}
          accessibilityRole="button"
          accessibilityLabel={chip.label}
          onPress={chip.onPress}
          hitSlop={8}
          style={({ pressed }) => [
            styles.chip,
            chip.isSelected ? styles.chipSelected : null,
            pressed ? styles.pressed : null,
          ]}
        >
          {chip.leftIconName ? (
            <Ionicons
              name={chip.leftIconName}
              size={16}
              color={chip.isSelected ? THEME.colors.white : THEME.colors.textSecondary}
            />
          ) : null}
          <Text style={[styles.chipText, chip.isSelected ? styles.chipTextSelected : null]}>
            {chip.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

FilterChipsBar.displayName = 'FilterChipsBar';

const CHIP_HEIGHT = 36;

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    paddingRight: THEME.spacing[8],
    gap: THEME.spacing[8],
  },
  controlChip: {
    height: CHIP_HEIGHT,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
    paddingHorizontal: THEME.spacing[12],
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  controlText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  chip: {
    height: CHIP_HEIGHT,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: THEME.spacing[12],
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  chipSelected: {
    backgroundColor: THEME.colors.primary,
    borderColor: 'rgba(15, 81, 50, 0.25)',
  },
  chipText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textSecondary,
  },
  chipTextSelected: {
    color: THEME.colors.white,
  },
  pressed: {
    opacity: 0.85,
  },
});

