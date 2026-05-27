import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { EdpCurriculumModule } from '../../../types/edpCurriculum.types';
import { EDP_CURRICULUM_THEME as T } from './edpCurriculumTheme';
import { EdpCurriculumLectureRow } from './EdpCurriculumLectureRow';
import { accordionStyles as styles } from './EdpCurriculumAccordion.styles';

export interface EdpCurriculumModuleRowProps {
  module: EdpCurriculumModule;
  expanded: boolean;
  onToggle: () => void;
  onKnowMore: () => void;
  onViewPdf: () => void;
}

function MetaChip(props: { icon: string; label: string }): React.ReactElement {
  return (
    <View style={styles.chip}>
      <Ionicons name={props.icon} size={12} color={T.chipText} />
      <Text style={styles.chipText}>{props.label}</Text>
    </View>
  );
}

export function EdpCurriculumModuleRow(props: EdpCurriculumModuleRowProps): React.ReactElement {
  const { module, expanded } = props;
  const lectureCount = module.topics.length;
  const sectionCountLabel =
    lectureCount === 1 ? '1 lecture' : `${lectureCount} lectures`;

  return (
    <View style={styles.moduleCard}>
      <Pressable
        onPress={props.onToggle}
        style={[styles.headerPressable, expanded ? styles.headerExpanded : null]}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${module.name}, ${sectionCountLabel}`}
      >
        <View style={styles.headerTextWrap}>
          <Text style={styles.moduleTitle} numberOfLines={2}>
            {module.name}
          </Text>
          <View style={styles.chipRow}>
            <MetaChip icon="play-circle-outline" label={`${module.videoCount} videos`} />
            <MetaChip icon="document-text-outline" label={`${module.pdfCount} PDFs`} />
            {lectureCount > 0 ? (
              <MetaChip icon="list-outline" label={sectionCountLabel} />
            ) : null}
          </View>
        </View>

        <View style={styles.chevronWrap}>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={T.chipText}
          />
        </View>
      </Pressable>

      {expanded ? (
        <View style={styles.body}>
          <Text style={styles.sectionLabel}>Course content</Text>

          {lectureCount > 0 ? (
            <View style={styles.lectureList}>
              {module.topics.map((topic, index) => (
                <EdpCurriculumLectureRow
                  key={`${module.id}-${topic.serial}`}
                  topic={topic}
                  isLast={index === module.topics.length - 1}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.emptyLectures}>Lectures will appear here when available.</Text>
          )}

          <View style={styles.actions}>
            <Pressable
              onPress={props.onKnowMore}
              style={({ pressed }) => [styles.primaryBtn, pressed ? { opacity: 0.92 } : null]}
              accessibilityRole="button"
              accessibilityLabel="Watch module overview"
            >
              <Ionicons name="play-circle" size={20} color="#FFFFFF" />
              <Text style={styles.primaryBtnText}>Watch overview</Text>
            </Pressable>
            <Pressable
              onPress={props.onViewPdf}
              style={({ pressed }) => [styles.secondaryBtn, pressed ? { opacity: 0.9 } : null]}
              accessibilityRole="button"
              accessibilityLabel="Download module PDF"
            >
              <Ionicons name="download-outline" size={18} color={T.primary} />
              <Text style={styles.secondaryBtnText}>Download module PDF</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}
