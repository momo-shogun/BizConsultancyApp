import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { HomeCategoryId } from './ZeptoHS.types';
import { ZeptoHSServicesSpotlight } from './ZeptoHSServicesSpotlight';
import { ExpertConsultation } from './ExpertConsultation';
import { MentorshipProgram } from './MentorshipProgram';
import { BusinessDiagnosisHero } from '@/features/Diagnostics/components/BusinessDiagnosisHero';

export type ZeptoHSCategorySpotlightProps = {
  categoryId: HomeCategoryId;
  backgroundColor: string;
  accentColor: string;
  onTalkToExpertPress?: () => void;
  onDiagnosePress?: () => void;
};

const PLACEHOLDER_COPY: Record<Exclude<HomeCategoryId, 'diagnosis'>, string> = {
  services: 'Browse business services tailored to your stage.',
  consultation: 'Book experts for strategy, finance, and operations.',
  mentorship: 'Find mentors and structured growth programs.',
};

const ph = StyleSheet.create({
  wrap: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  hint: {
    fontSize: 12,
    color: 'rgba(10,10,10,0.55)',
    lineHeight: 18,
  },
});

export function ZeptoHSCategorySpotlight({
  categoryId,
  backgroundColor,
  accentColor,
  onTalkToExpertPress,
  onDiagnosePress,
}: ZeptoHSCategorySpotlightProps): React.ReactElement {
  if (categoryId === 'diagnosis') {
    return (
      <BusinessDiagnosisHero
        backgroundColor={backgroundColor}
        accentColor={accentColor}
        onTalkToExpertPress={onTalkToExpertPress}
        onSecondaryPress={onDiagnosePress}
      />
    );
  }

  else if (categoryId === 'services') {
    return <ZeptoHSServicesSpotlight backgroundColor={backgroundColor} accentColor={accentColor} />;
  }

  else if (categoryId === 'consultation') {
    return (
      <ExpertConsultation backgroundColor={backgroundColor} accentColor={accentColor} />
    );
  }

  else if (categoryId === 'mentorship') {
    return (
      <MentorshipProgram backgroundColor={backgroundColor} accentColor={accentColor} />
    )

  }
    

  const body = PLACEHOLDER_COPY[categoryId];

  return (
    <View style={[ph.wrap, { backgroundColor }]}>
      <Text style={[ph.title, { color: accentColor }]}>{body}</Text>
      <Text style={ph.hint}>Demo content — wire real data later.</Text>
    </View>
  );
}
