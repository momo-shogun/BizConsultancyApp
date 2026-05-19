import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { THEME } from '@/constants/theme';

import { QUICK_ACTIONS, TRENDING_SEARCHES } from '../constants/searchContent';

type SearchDiscoveryPanelProps = {
  recent: string[];
  categoryLabels: string[];
  accentColor: string;
  onSelectQuery: (query: string) => void;
  onClearRecent: () => void;
  onQuickAction: (actionId: string) => void;
};

function SectionTitle(props: { title: string; action?: React.ReactNode }): React.ReactElement {
  return (
    <View style={styles.sectionHead}>
      <Text style={styles.sectionTitle}>{props.title}</Text>
      {props.action}
    </View>
  );
}

export function SearchDiscoveryPanel({
  recent,
  categoryLabels,
  accentColor,
  onSelectQuery,
  onClearRecent,
  onQuickAction,
}: SearchDiscoveryPanelProps): React.ReactElement {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <Animated.View entering={FadeInDown.delay(40).duration(220)} style={styles.quickSection}>
        <SectionTitle title="Quick actions" />
        <View style={styles.quickRow}>
          {QUICK_ACTIONS.map((action) => (
            <Pressable
              key={action.id}
              onPress={() => onQuickAction(action.id)}
              style={({ pressed }) => [styles.quickCard, pressed && styles.chipPressed]}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <View style={[styles.quickIcon, { backgroundColor: `${accentColor}14` }]}>
                <Ionicons name={action.icon} size={20} color={accentColor} />
              </View>
              <Text style={styles.quickLabel} numberOfLines={1}>
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {recent.length > 0 ? (
        <Animated.View entering={FadeInDown.delay(60).duration(220)} style={styles.sectionBlock}>
          <SectionTitle
            title="Recent"
            action={
              <Pressable onPress={onClearRecent} hitSlop={8} accessibilityRole="button">
                <Text style={styles.link}>Clear</Text>
              </Pressable>
            }
          />
          <View style={styles.chipWrap}>
            {recent.map((term) => (
              <Pressable
                key={term}
                onPress={() => onSelectQuery(term)}
                style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
              >
                <Ionicons name="time-outline" size={14} color={THEME.colors.textSecondary} />
                <Text style={styles.chipText} numberOfLines={1}>
                  {term}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeInDown.delay(80).duration(220)} style={styles.sectionBlock}>
        <SectionTitle title="Trending" />
        <View style={styles.chipWrap}>
          {TRENDING_SEARCHES.map((term) => (
            <Pressable
              key={term}
              onPress={() => onSelectQuery(term)}
              style={({ pressed }) => [styles.chip, styles.trendChip, pressed && styles.chipPressed]}
            >
              <Ionicons name="trending-up" size={14} color={accentColor} />
              <Text style={styles.chipText} numberOfLines={1}>
                {term}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {categoryLabels.length > 0 ? (
        <Animated.View entering={FadeInDown.delay(100).duration(220)} style={styles.sectionBlock}>
          <SectionTitle title="Browse categories" />
          <View style={styles.chipWrap}>
            {categoryLabels.map((label) => (
              <Pressable
                key={label}
                onPress={() => onSelectQuery(label)}
                style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
              >
                <Text style={styles.chipText} numberOfLines={1}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[20],
    paddingBottom: THEME.spacing[32],
  },
  quickSection: {
    marginTop: THEME.spacing[4],
  },
  sectionBlock: {
    marginTop: THEME.spacing[24],
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing[12],
  },
  sectionTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  link: {
    fontSize: THEME.typography.size[13],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.primary,
  },
  quickRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: THEME.spacing[12],
  },
  quickCard: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[16],
    paddingVertical: THEME.spacing[14],
    paddingHorizontal: THEME.spacing[8],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: THEME.colors.border,
    gap: THEME.spacing[10],
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
    textAlign: 'center',
    lineHeight: 16,
    width: '100%',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '100%',
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[8],
    borderRadius: 999,
    backgroundColor: THEME.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: THEME.colors.border,
  },
  trendChip: {
    backgroundColor: THEME.colors.white,
  },
  chipPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  chipText: {
    fontSize: THEME.typography.size[13],
    color: THEME.colors.textPrimary,
    maxWidth: 220,
  },
});
