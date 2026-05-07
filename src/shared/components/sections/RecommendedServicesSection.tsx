import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';

import {
  RecommendedServiceCard,
  type RecommendedServiceItem,
} from '../cards/RecommendedServiceCard/RecommendedServiceCard';

export interface RecommendedServicesSectionProps {
  title?: string;
  onViewAllPress?: () => void;
  viewAllLabel?: string;
  items: RecommendedServiceItem[];
  cardWidth?: number;
  contentBottomInset?: number;
  onItemPress?: (item: RecommendedServiceItem) => void;
  onCtaPress?: (item: RecommendedServiceItem) => void;
}

export function RecommendedServicesSection(props: RecommendedServicesSectionProps): React.ReactElement {
  const {
    title = 'Connect with Verified Business Experts @ One Click',
    onViewAllPress,
    viewAllLabel = 'View all',
    items,
    cardWidth = 320,
    contentBottomInset = THEME.spacing[16],
    onItemPress,
    onCtaPress,
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
        {items.map((item) => (
          <RecommendedServiceCard
            key={item.id}
            item={item}
            cardWidth={cardWidth}
            onPress={() => onItemPress?.(item)}
            onCtaPress={onCtaPress ? () => onCtaPress(item) : undefined}
          />
        ))}
      </ScrollView>
    </View>
  );
}

RecommendedServicesSection.displayName = 'RecommendedServicesSection';

const styles = StyleSheet.create({
  section: {
    marginTop: THEME.spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    lineHeight: 24,
  },
  viewAll: {
    flexShrink: 0,
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginTop: 2,
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
    marginTop: 2,
  },
  carousel: {
    paddingLeft: THEME.spacing[16],
    paddingRight: THEME.spacing[8],
    paddingBottom: THEME.spacing[4],
  },
});
