import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import type { EdpCurriculumModule } from '../../../types/edpCurriculum.types';
import { EdpCurriculumModuleRow } from './EdpCurriculumModuleRow';
import { accordionStyles as styles } from './EdpCurriculumAccordion.styles';

export interface EdpCurriculumAccordionProps {
  modules: EdpCurriculumModule[];
  onKnowMore: (module: EdpCurriculumModule) => void;
  onViewModulePdf: (module: EdpCurriculumModule) => void;
}

export function EdpCurriculumAccordion(props: EdpCurriculumAccordionProps): React.ReactElement {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (props.modules.length === 0) {
      setExpandedId(null);
      return;
    }
    setExpandedId((current) => {
      if (current != null && props.modules.some((m) => m.id === current)) {
        return current;
      }
      return props.modules[0]?.id ?? null;
    });
  }, [props.modules]);

  return (
    <View style={styles.list}>
      {props.modules.map((module) => (
        <EdpCurriculumModuleRow
          key={module.id}
          module={module}
          expanded={expandedId === module.id}
          onToggle={() => {
            setExpandedId((current) => (current === module.id ? null : module.id));
          }}
          onKnowMore={() => props.onKnowMore(module)}
          onViewPdf={() => props.onViewModulePdf(module)}
        />
      ))}
    </View>
  );
}
