import React from 'react';
import { StyleSheet, View } from 'react-native';

import { THEME } from '@/constants/theme';
import { ContentPlaceholder } from '@/shared/components';

const TAB_PILL_COUNT = 6;

export function ServiceDetailSkeleton(): React.ReactElement {
  return (
    <View style={styles.root} testID="service-detail-skeleton">
      <View style={styles.hero}>
        <View style={styles.heroTopRow}>
          <ContentPlaceholder variant="circle" width={40} height={40} />
          <ContentPlaceholder variant="line" width={120} height={32} style={styles.heroPill} />
        </View>

        <ContentPlaceholder variant="line" width="92%" height={28} />
        <ContentPlaceholder variant="line" width="78%" height={28} />

        <ContentPlaceholder variant="line" width="100%" height={14} />
        <ContentPlaceholder variant="line" width="88%" height={14} />

        <View style={styles.trustRow}>
          <ContentPlaceholder variant="line" width={88} height={14} />
          <ContentPlaceholder variant="line" width={120} height={14} />
        </View>

        <View style={styles.priceCard}>
          <View style={styles.priceCardLeft}>
            <ContentPlaceholder variant="line" width={140} height={22} />
            <ContentPlaceholder variant="line" width="90%" height={12} />
          </View>
          <ContentPlaceholder variant="block" width={118} height={44} style={styles.ctaBlock} />
        </View>

        <View style={styles.quickRow}>
          <ContentPlaceholder variant="block" width="48%" height={40} />
          <ContentPlaceholder variant="block" width="48%" height={40} />
        </View>
      </View>

      <View style={styles.tabsRow}>
        {Array.from({ length: TAB_PILL_COUNT }, (_, index) => (
          <ContentPlaceholder
            key={`tab-ph-${index}`}
            variant="line"
            width={index % 2 === 0 ? 72 : 84}
            height={34}
            style={styles.tabPill}
          />
        ))}
      </View>

      <View style={styles.panel}>
        <ContentPlaceholder variant="line" width="70%" height={24} />
        <ContentPlaceholder variant="line" width="100%" height={14} />
        <ContentPlaceholder variant="line" width="96%" height={14} />
        <ContentPlaceholder variant="line" width="88%" height={14} />
        <ContentPlaceholder variant="block" width="100%" height={120} style={styles.panelBlock} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: THEME.spacing[20],
  },
  hero: {
    minHeight: 392,
    padding: THEME.spacing[16],
    gap: THEME.spacing[12],
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    backgroundColor: 'rgba(15, 81, 50, 0.35)',
    overflow: 'hidden',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroPill: {
    borderRadius: 999,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[16],
    marginTop: THEME.spacing[4],
  },
  priceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: THEME.spacing[12],
    padding: THEME.spacing[14],
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginTop: THEME.spacing[4],
  },
  priceCardLeft: {
    flex: 1,
    gap: THEME.spacing[8],
  },
  ctaBlock: {
    borderRadius: THEME.radius[12],
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: THEME.spacing[10],
  },
  tabsRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[12],
  },
  tabPill: {
    borderRadius: 999,
  },
  panel: {
    paddingHorizontal: THEME.spacing[16],
    gap: THEME.spacing[12],
  },
  panelBlock: {
    marginTop: THEME.spacing[8],
    borderRadius: THEME.radius[16],
  },
});
