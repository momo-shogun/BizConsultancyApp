import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ProgressSegmentsProps {
  totalSteps: number;
  activeStep: number;
}

export function ProgressSegments(props: ProgressSegmentsProps): React.ReactElement {
  return (
    <View style={styles.row} accessibilityRole="progressbar">
      {Array.from({ length: props.totalSteps }, (_, index) => (
        <View
          key={`segment-${index}`}
          style={[styles.segment, index <= props.activeStep ? styles.segmentActive : styles.segmentInactive]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 4,
  },
  segmentActive: {
    backgroundColor: '#0B3B66',
  },
  segmentInactive: {
    backgroundColor: '#D5DCE5',
  },
});
