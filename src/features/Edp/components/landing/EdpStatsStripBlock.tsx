import React from 'react';

import { EdpStatsStrip, type EdpStatsStripItem } from '@/shared/components';

import { EdpStatsStripPlaceholder } from './EdpLandingPlaceholders';

export interface EdpStatsStripBlockProps {
  isLoading: boolean;
  items: EdpStatsStripItem[];
}

export function EdpStatsStripBlock(props: EdpStatsStripBlockProps): React.ReactElement {
  if (props.isLoading) {
    return <EdpStatsStripPlaceholder />;
  }
  return <EdpStatsStrip items={props.items} />;
}
