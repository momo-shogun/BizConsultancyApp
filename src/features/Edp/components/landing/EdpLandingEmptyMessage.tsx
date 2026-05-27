import React from 'react';
import { Text, type TextProps } from 'react-native';

import { landingStyles } from './EdpLandingSection.styles';

export interface EdpLandingEmptyMessageProps {
  message: string;
  accessibilityLabel?: string;
}

export function EdpLandingEmptyMessage(
  props: EdpLandingEmptyMessageProps,
): React.ReactElement {
  const a11y: TextProps = {
    accessibilityRole: 'text',
    accessibilityLabel: props.accessibilityLabel ?? props.message,
  };

  return <Text {...a11y} style={landingStyles.emptyText}>{props.message}</Text>;
}
