import React from 'react';
import { StyleSheet, View } from 'react-native';

import { THEME } from '@/constants/theme';
import { ContentPlaceholder } from '@/shared/components';

import { placeholderStyles as styles } from './EdpLandingPlaceholders.styles';

const DEFAULT_ROWS = 3;
const METRIC_TILES = 4;
const STRIP_ITEMS = 4;

function PlaceholderRows(props: {
  count: number;
  renderRow: (index: number) => React.ReactElement;
}): React.ReactElement {
  return (
    <>
      {Array.from({ length: props.count }, (_, index) => (
        <React.Fragment key={index}>{props.renderRow(index)}</React.Fragment>
      ))}
    </>
  );
}

export function EdpStatsStripPlaceholder(): React.ReactElement {
  return (
    <View style={styles.strip} accessibilityLabel="Loading programme stats">
      <PlaceholderRows
        count={STRIP_ITEMS}
        renderRow={() => (
          <View style={styles.stripItem}>
            <ContentPlaceholder variant="line" height={20} width={32} />
            <ContentPlaceholder variant="line" height={10} width={48} />
          </View>
        )}
      />
    </View>
  );
}

export function EdpMetricsGridPlaceholder(): React.ReactElement {
  return (
    <View style={styles.metricsGrid} accessibilityLabel="Loading programme overview">
      <PlaceholderRows
        count={METRIC_TILES}
        renderRow={() => (
          <View style={styles.metricCard}>
            <ContentPlaceholder variant="line" height={22} width="40%" />
            <ContentPlaceholder variant="line" height={12} width="65%" />
          </View>
        )}
      />
    </View>
  );
}

export function EdpCurriculumAccordionPlaceholder(props: {
  rows?: number;
}): React.ReactElement {
  const rows = props.rows ?? DEFAULT_ROWS;
  return (
    <View style={{ gap: THEME.spacing[12] }} accessibilityLabel="Loading curriculum">
      <PlaceholderRows
        count={rows}
        renderRow={() => (
          <View
            style={{
              borderRadius: 16,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: THEME.colors.border,
              backgroundColor: THEME.colors.white,
              padding: THEME.spacing[14],
              flexDirection: 'row',
              alignItems: 'center',
              gap: THEME.spacing[12],
            }}
          >
            <View style={{ flex: 1, gap: 8 }}>
              <ContentPlaceholder variant="line" height={14} width="88%" />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <ContentPlaceholder variant="line" height={20} width={72} />
                <ContentPlaceholder variant="line" height={20} width={56} />
              </View>
            </View>
            <ContentPlaceholder variant="circle" width={28} height={28} />
          </View>
        )}
      />
    </View>
  );
}

export function EdpFaqListPlaceholder(props: { rows?: number }): React.ReactElement {
  const rows = props.rows ?? DEFAULT_ROWS;
  return (
    <View style={styles.accordion} accessibilityLabel="Loading FAQs">
      <PlaceholderRows
        count={rows}
        renderRow={(index) => (
          <View
            style={[
              styles.accordionRow,
              index === rows - 1 ? { borderBottomWidth: 0 } : null,
            ]}
          >
            <ContentPlaceholder variant="line" height={14} width="88%" />
            <ContentPlaceholder variant="circle" width={22} height={22} />
          </View>
        )}
      />
    </View>
  );
}
