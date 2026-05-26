import React from 'react';
import { StyleSheet, View } from 'react-native';

import { THEME } from '@/constants/theme';
import { ContentPlaceholder } from '@/shared/components';

import {
  EXPERT_SEGMENT_CARD_WIDTH,
  EXPERT_SEGMENT_IMAGE_HEIGHT,
} from './expertConsultationCardMetrics';

const SKELETON_CARD_COUNT = 3;

function ExpertSegmentCardSkeleton(): React.ReactElement {
  return (
    <View style={styles.card}>
      <ContentPlaceholder variant="block" width="100%" height={EXPERT_SEGMENT_IMAGE_HEIGHT} />
      <View style={styles.cardBody}>
        <ContentPlaceholder variant="line" height={12} width="78%" />
        <View style={styles.footer}>
          <ContentPlaceholder variant="line" height={18} width={64} />
          <ContentPlaceholder variant="circle" width={24} height={24} />
        </View>
      </View>
    </View>
  );
}

export function ExpertConsultationSectionSkeleton(): React.ReactElement {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ContentPlaceholder variant="line" height={16} width={120} />
        <View style={styles.sectionLine} />
      </View>
      <View style={styles.row}>
        {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
          <ExpertSegmentCardSkeleton key={`expert-segment-skeleton-${index}`} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: THEME.spacing[12],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[12],
    marginBottom: THEME.spacing[8],
  },
  sectionLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: 'rgba(15,23,42,0.08)',
    marginLeft: THEME.spacing[10],
    borderRadius: 1,
  },
  row: {
    flexDirection: 'row',
    paddingLeft: THEME.spacing[12],
    paddingRight: THEME.spacing[4],
  },
  card: {
    width: EXPERT_SEGMENT_CARD_WIDTH,
    marginRight: THEME.spacing[8],
    borderRadius: 14,
    backgroundColor: THEME.colors.white,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: THEME.colors.border,
  },
  cardBody: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 8,
    gap: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
