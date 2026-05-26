import React from 'react';
import { View } from 'react-native';

import { EdpSectionHeader } from '@/shared/components';

import { EdpLandingEmptyMessage } from './EdpLandingEmptyMessage';
import { landingStyles } from './EdpLandingSection.styles';

export interface EdpLandingSectionProps {
  title: string;
  count?: number;
  actionLabel?: string;
  onAction?: () => void;
  isLoading: boolean;
  isEmpty: boolean;
  emptyMessage: string;
  placeholder: React.ReactElement;
  children: React.ReactNode;
}

export function EdpLandingSection(props: EdpLandingSectionProps): React.ReactElement {
  const showAction = props.onAction != null && !props.isLoading && !props.isEmpty;

  let body: React.ReactElement;
  if (props.isLoading) {
    body = props.placeholder;
  } else if (props.isEmpty) {
    body = <EdpLandingEmptyMessage message={props.emptyMessage} />;
  } else {
    body = props.children ?? <View />;
  }

  return (
    <View style={landingStyles.section}>
      <EdpSectionHeader
        title={props.title}
        count={props.isLoading ? undefined : props.count}
        onAction={showAction ? props.onAction : undefined}
        actionLabel={props.actionLabel}
      />
      {body}
    </View>
  );
}
