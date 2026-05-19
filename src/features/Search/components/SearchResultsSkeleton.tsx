import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { THEME } from '@/constants/theme';
import { ContentPlaceholder } from '@/shared/components';

const ROW_COUNT = 6;

export function SearchResultsSkeleton(): React.ReactElement {
  return (
    <Animated.View entering={FadeIn.duration(200)} style={styles.wrap}>
      {Array.from({ length: ROW_COUNT }, (_, index) => (
        <View key={`sk-${index}`} style={styles.row}>
          <ContentPlaceholder variant="circle" width={44} height={44} />
          <View style={styles.lines}>
            <ContentPlaceholder variant="line" height={14} width="72%" />
            <ContentPlaceholder variant="line" height={12} width="40%" />
          </View>
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: THEME.spacing[12],
    paddingTop: THEME.spacing[8],
    gap: THEME.spacing[16],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[12],
  },
  lines: {
    flex: 1,
    gap: THEME.spacing[8],
  },
});
