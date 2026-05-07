import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';

import { TestimonialCard, type TestimonialItem } from '../cards/TestimonialCard/TestimonialCard';

const STAGGER_OFFSET = THEME.spacing[24];

export interface TestimonialsSectionProps {
  title?: string;
  onViewAllPress?: () => void;
  viewAllLabel?: string;
  items: TestimonialItem[];
  cardWidth?: number;
  contentBottomInset?: number;
  onItemPress?: (item: TestimonialItem) => void;
}

export function TestimonialsSection(props: TestimonialsSectionProps): React.ReactElement {
  const {
    title = 'Testimonials',
    onViewAllPress,
    viewAllLabel = 'View all',
    items,
    cardWidth = 260,
    contentBottomInset = THEME.spacing[20],
    onItemPress,
  } = props;

  return (
    <View style={[styles.section, { marginBottom: contentBottomInset }]}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        {onViewAllPress != null ? (
          <Pressable
            onPress={onViewAllPress}
            accessibilityRole="button"
            accessibilityLabel={viewAllLabel}
            hitSlop={8}
            style={({ pressed }) => [styles.viewAll, pressed && styles.viewAllPressed]}
          >
            <Text style={styles.viewAllText}>{viewAllLabel}</Text>
          </Pressable>
        ) : (
          <Text style={styles.viewAllTextMuted}>{viewAllLabel}</Text>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToAlignment="center"
        contentContainerStyle={styles.carousel}
      >
        {items.map((item, index) => (
          <View key={item.id} style={index % 2 === 1 ? styles.staggered : undefined}>
            <TestimonialCard
              item={item}
              cardWidth={cardWidth}
              onPress={onItemPress ? () => onItemPress(item) : undefined}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

TestimonialsSection.displayName = 'TestimonialsSection';

const styles = StyleSheet.create({
  section: {
    marginTop: THEME.spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing[12],
    paddingHorizontal: THEME.spacing[16],
    gap: THEME.spacing[12],
  },
  title: {
    flex: 1,
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.35,
  },
  viewAll: {
    flexShrink: 0,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  viewAllPressed: {
    opacity: 0.75,
  },
  viewAllText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: '#2563EB',
  },
  viewAllTextMuted: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: '#9CA3AF',
  },
  carousel: {
    paddingLeft: THEME.spacing[16],
    paddingRight: THEME.spacing[8],
    paddingBottom: STAGGER_OFFSET,
  },
  staggered: {
    marginTop: STAGGER_OFFSET,
  },
});

