import React from 'react';

import { useEdpAccess } from '../../hooks/useEdpAccess';
import { EDP_LANDING_EMPTY } from '../../constants/edpLandingCopy';
import { useEdpCurriculumActions } from '../../hooks/useEdpCurriculumActions';
import type { EdpCurriculumModule } from '../../types/edpCurriculum.types';
import { EdpLandingSection } from './EdpLandingSection';
import { EdpCurriculumAccordionPlaceholder } from './EdpLandingPlaceholders';
import { EdpCurriculumAccordion } from './curriculum/EdpCurriculumAccordion';

export interface EdpCurriculumSectionProps {
  isLoading: boolean;
  isEmpty: boolean;
  modules: EdpCurriculumModule[];
  onViewAll: () => void;
}

export function EdpCurriculumSection(props: EdpCurriculumSectionProps): React.ReactElement {
  const { onKnowMore, onViewModulePdf } = useEdpCurriculumActions();
  const { canAccessFullEdp } = useEdpAccess();

  return (
    <EdpLandingSection
      title="Curriculum"
      count={props.modules.length}
      actionLabel={canAccessFullEdp ? 'View all' : undefined}
      onAction={canAccessFullEdp ? props.onViewAll : undefined}
      isLoading={props.isLoading}
      isEmpty={props.isEmpty}
      emptyMessage={EDP_LANDING_EMPTY.curriculum}
      placeholder={<EdpCurriculumAccordionPlaceholder />}
    >
      <EdpCurriculumAccordion
        modules={props.modules}
        onKnowMore={onKnowMore}
        onViewModulePdf={onViewModulePdf}
      />
    </EdpLandingSection>
  );
}
