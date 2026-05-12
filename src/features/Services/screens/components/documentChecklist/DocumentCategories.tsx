import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { styles } from './DocumentCategories.styles';

interface DocumentCategory {
  title: string;
  subtitle?: string;
  documents: string[];
}

interface DocumentsData {
  categories: DocumentCategory[];
}

interface DocumentCategoriesProps {
  documents: DocumentsData;
}

const CATEGORY_COLORS = [
  {
    soft: '#EFF6FF',
    border: '#BFDBFE',
    accent: '#2563EB',
  },
  {
    soft: '#F5F3FF',
    border: '#DDD6FE',
    accent: '#7C3AED',
  },
  {
    soft: '#ECFDF5',
    border: '#A7F3D0',
    accent: '#059669',
  },
  {
    soft: '#FFF7ED',
    border: '#FED7AA',
    accent: '#EA580C',
  },
];

const DocumentCategories: React.FC<DocumentCategoriesProps> = ({
  documents,
}) => {
  if (!documents?.categories?.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Documents Required</Text>
        <Text style={styles.emptySubtitle}>
          This service currently does not require any documentation.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Categories */}
      {documents.categories.map((category, categoryIndex) => {
        const palette =
          CATEGORY_COLORS[categoryIndex % CATEGORY_COLORS.length];

        return (
          <Animated.View
            key={category.title}
            entering={FadeInDown.delay(categoryIndex * 80).springify()}
            style={[
              styles.categoryCard,
              {
                backgroundColor: palette.soft,
                borderColor: palette.border,
              },
            ]}
          >
            {/* Top */}
            <View style={styles.categoryTop}>
              <View
                style={[
                  styles.categoryAccent,
                  { backgroundColor: palette.accent },
                ]}
              />

              <View style={styles.categoryTextWrap}>
                <Text style={styles.categoryTitle}>
                  {category.title}
                </Text>

                {!!category.subtitle && (
                  <Text style={styles.categorySubtitle}>
                    {category.subtitle}
                  </Text>
                )}
              </View>

              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: `${palette.accent}15`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    { color: palette.accent },
                  ]}
                >
                  {category.documents.length}
                </Text>
              </View>
            </View>

            {/* Documents */}
            <View style={styles.documentsWrap}>
              {category.documents.map((doc, docIndex) => (
                <Animated.View
                  key={`${doc}-${docIndex}`}
                  entering={FadeInDown.delay(docIndex * 40)}
                  style={styles.documentRow}
                >
                  <View
                    style={[
                      styles.documentDot,
                      { backgroundColor: palette.accent },
                    ]}
                  />

                  <Text style={styles.documentText}>
                    {doc}
                  </Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
};

export default DocumentCategories;