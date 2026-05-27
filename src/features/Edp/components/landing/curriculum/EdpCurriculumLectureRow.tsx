import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { EdpCurriculumTopic } from '../../../types/edpCurriculum.types';
import { EDP_CURRICULUM_THEME as T } from './edpCurriculumTheme';
import { accordionStyles as styles } from './EdpCurriculumAccordion.styles';

export interface EdpCurriculumLectureRowProps {
  topic: EdpCurriculumTopic;
  isLast: boolean;
}

export function EdpCurriculumLectureRow(props: EdpCurriculumLectureRowProps): React.ReactElement {
  const { topic, isLast } = props;

  return (
    <View style={[styles.lectureRow, isLast ? styles.lectureRowLast : null]}>
      <View style={styles.lectureIconWrap}>
        <Ionicons name="play" size={14} color={T.lectureIcon} />
      </View>
      <Text style={styles.lectureTitle} numberOfLines={2}>
        {topic.name}
      </Text>
    </View>
  );
}
