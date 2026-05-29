import React from 'react';
import { Text, View } from 'react-native';

import { helpSettingsStyles as s } from './helpSettings.styles';

export interface HelpSettingsScreenHeroProps {
  title: string;
  subtitle: string;
  eyebrow?: string;
}

export function HelpSettingsScreenHero({
  title,
  subtitle,
  eyebrow = 'Settings',
}: HelpSettingsScreenHeroProps): React.ReactElement {
  return (
    <View style={s.heroStrip}>
      <Text style={s.heroEyebrow}>{eyebrow}</Text>
      <Text style={s.heroTitle}>{title}</Text>
      <Text style={s.heroSubtitle}>{subtitle}</Text>
    </View>
  );
}
