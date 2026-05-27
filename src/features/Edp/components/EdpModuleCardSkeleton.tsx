import React from 'react';
import { View } from 'react-native';

import { ContentPlaceholder } from '@/shared/components';

import { EDP_MODULE_CARD_WIDTH, moduleCardSkeletonStyles as styles } from './EdpModuleCardSkeleton.styles';

const SKELETON_ROWS = 6;

export function EdpModuleCardSkeleton(): React.ReactElement {
  return (
    <View
      style={[styles.card, { width: EDP_MODULE_CARD_WIDTH }]}
      accessibilityLabel="Loading module"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <ContentPlaceholder
        variant="block"
        width="100%"
        height={92}
        style={styles.thumb}
      />
      <View style={styles.body}>
        <ContentPlaceholder variant="line" width="92%" height={14} />
        <ContentPlaceholder variant="line" width="68%" height={14} />

        <View style={styles.progressBlock}>
          <View style={styles.progressTopRow}>
            <ContentPlaceholder variant="line" width={64} height={10} />
            <ContentPlaceholder variant="line" width={36} height={18} style={styles.badge} />
          </View>
          <ContentPlaceholder variant="line" width="100%" height={6} style={styles.track} />
        </View>

        <ContentPlaceholder variant="line" width="78%" height={22} style={styles.metaPill} />
      </View>
    </View>
  );
}

export function EdpModulesListSkeleton(): React.ReactElement {
  return (
    <View style={styles.grid} accessibilityLabel="Loading modules">
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <EdpModuleCardSkeleton key={`edp-module-skel-${index}`} />
      ))}
    </View>
  );
}

export function EdpModulesSearchSkeleton(): React.ReactElement {
  return (
    <View style={styles.searchWrap}>
      <ContentPlaceholder variant="circle" width={18} height={18} />
      <ContentPlaceholder variant="line" height={14} style={styles.searchLine} />
      <ContentPlaceholder variant="line" width={24} height={12} />
    </View>
  );
}
