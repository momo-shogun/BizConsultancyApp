import React from 'react';

import FAQSection, { type FAQsData } from '@/features/Services/screens/components/faq/faq';

import { EDP_LANDING_EMPTY } from '../../constants/edpLandingCopy';
import { EdpLandingSection } from './EdpLandingSection';
import { EdpFaqListPlaceholder } from './EdpLandingPlaceholders';

export interface EdpFaqSectionProps {
  isLoading: boolean;
  isEmpty: boolean;
  faqs: FAQsData;
  count: number;
}

export function EdpFaqSection(props: EdpFaqSectionProps): React.ReactElement {
  return (
    <EdpLandingSection
      title="Quick answers"
      count={props.count}
      isLoading={props.isLoading}
      isEmpty={props.isEmpty}
      emptyMessage={EDP_LANDING_EMPTY.faqs}
      placeholder={<EdpFaqListPlaceholder />}
    >
      <FAQSection
        faqs={props.faqs}
        variant="embedded"
        showHeader={false}
        initialActiveIndex={null}
      />
    </EdpLandingSection>
  );
}
