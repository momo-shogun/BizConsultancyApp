import React from 'react';
import { View } from 'react-native';

import { EdpMetricCard, type EdpMetricCardItem } from '@/shared/components';

import { EDP_LANDING_EMPTY } from '../../constants/edpLandingCopy';
import { EdpLandingSection } from './EdpLandingSection';
import { landingStyles } from './EdpLandingSection.styles';
import { EdpMetricsGridPlaceholder } from './EdpLandingPlaceholders';

export interface EdpProgrammeOverviewSectionProps {
  isLoading: boolean;
  items: EdpMetricCardItem[];
}

export function EdpProgrammeOverviewSection(
  props: EdpProgrammeOverviewSectionProps,
): React.ReactElement {
  const isEmpty = !props.isLoading && props.items.length === 0;

  return (
    <EdpLandingSection
      title="Programme overview"
      count={props.items.length}
      isLoading={props.isLoading}
      isEmpty={isEmpty}
      emptyMessage={EDP_LANDING_EMPTY.overview}
      placeholder={<EdpMetricsGridPlaceholder />}
    >
      <View style={landingStyles.statGrid}>
        {props.items.map((item) => (
          <EdpMetricCard key={item.label} item={item} />
        ))}
      </View>
    </EdpLandingSection>
  );
}
