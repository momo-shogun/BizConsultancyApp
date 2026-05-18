import React from 'react';
import { Text, View } from 'react-native';

import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';

import { styles } from './DocumentCategories.styles';

interface DocumentCategory {
  title: string;
  subtitle?: string;
  documents: string[];
}

export interface DocumentsSectionData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  categories: DocumentCategory[];
}

interface DocumentCategoriesProps {
  documents: DocumentsSectionData;
}

const ACCENTS = ['#2563EB', '#7C3AED', '#059669', '#EA580C'] as const;

function SectionHeader({ documents }: { documents: DocumentsSectionData }): React.ReactElement {
  const badgeLabel = documents.badge?.trim() || 'DOCUMENTS';
  const title = documents.title?.trim() || 'Documents';
  const highlight = documents.titleHighlight?.trim();

  return (
    <>
      <Animated.View entering={FadeInUp.duration(280)}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeLabel.toUpperCase()}</Text>
        </View>
      </Animated.View>
      <Animated.View entering={FadeInUp.delay(30).duration(280)}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {highlight != null && highlight.length > 0 ? (
            <Text style={styles.titleHighlight}>{highlight}</Text>
          ) : null}
        </View>
      </Animated.View>
    </>
  );
}

function DocumentCategories({ documents }: DocumentCategoriesProps): React.ReactElement {
  if (!documents.categories.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No documents required</Text>
        <Text style={styles.emptySubtitle}>
          This service does not require documentation at the moment.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionHeader documents={documents} />

      <Animated.View entering={FadeInUp.delay(60).duration(300)} style={styles.card}>
        {documents.categories.map((category, categoryIndex) => {
          const accent = ACCENTS[categoryIndex % ACCENTS.length];
          const isLast = categoryIndex === documents.categories.length - 1;

          return (
            <View
              key={category.title}
              style={[styles.categoryBlock, isLast ? null : styles.categoryBlockBorder]}
            >
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryDot, { backgroundColor: accent }]} />
                <Text style={styles.categoryTitle} numberOfLines={2}>
                  {category.title}
                </Text>
                <View style={[styles.countPill, { backgroundColor: `${accent}18` }]}>
                  <Text style={[styles.countText, { color: accent }]}>
                    {category.documents.length}
                  </Text>
                </View>
              </View>

              <View style={styles.docList}>
                {category.documents.map((doc, docIndex) => (
                  <Animated.View
                    key={`${doc}-${docIndex}`}
                    entering={FadeInDown.delay(80 + docIndex * 25).duration(240)}
                    style={styles.docRow}
                  >
                    <Feather
                      name="file-text"
                      size={13}
                      color={accent}
                      style={styles.docIcon}
                    />
                    <Text style={styles.docText}>{doc}</Text>
                  </Animated.View>
                ))}
              </View>
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
}

export default DocumentCategories;
