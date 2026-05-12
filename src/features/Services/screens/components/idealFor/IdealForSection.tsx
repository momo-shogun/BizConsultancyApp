import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';

import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

import { styles } from './IdealForSection.styles';

interface TitleSegment {
  type: 'plain' | 'highlight';
  value: string;
  color?: string;
}

interface IdealForItem {
  image: string;
  title: string;
  description: string;
}

interface IdealForData {
  titleSegments?: TitleSegment[];
  items: IdealForItem[];
}

interface IdealForSectionProps {
  idealFor: IdealForData;
}

const HIGHLIGHT_COLORS: Record<string, string> = {
  blue: '#2563EB',
  green: '#059669',
  orange: '#EA580C',
  purple: '#7C3AED',
};

const CARD_ACCENTS = [
  {
    background: '#EFF6FF',
    border: '#BFDBFE',
    accent: '#2563EB',
  },
  {
    background: '#ECFDF5',
    border: '#A7F3D0',
    accent: '#059669',
  },
  {
    background: '#FFF7ED',
    border: '#FED7AA',
    accent: '#EA580C',
  },
  {
    background: '#F5F3FF',
    border: '#DDD6FE',
    accent: '#7C3AED',
  },
];

const IdealForSection: React.FC<IdealForSectionProps> = ({
  idealFor,
}) => {
  if (!idealFor?.items?.length) {
    return null;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(400)}>
        <View style={styles.headerContainer}>
          <Text style={styles.sectionTitle}>
            {idealFor.titleSegments?.map((segment, index) => {
              const color =
                segment.type === 'highlight'
                  ? HIGHLIGHT_COLORS[segment.color || 'blue']
                  : '#0F172A';

              return (
                <Text
                  key={`${segment.value}-${index}`}
                  style={{ color }}
                >
                  {segment.value}{' '}
                </Text>
              );
            })}
          </Text>

          <Text style={styles.sectionSubtitle}>
            Find out who can benefit the most from this
            service and business structure.
          </Text>
        </View>
      </Animated.View>

      {/* Grid */}
      <View style={styles.grid}>
        {idealFor.items.map((item, index) => {
          const palette =
            CARD_ACCENTS[index % CARD_ACCENTS.length];

          return (
            <Animated.View
              key={`${item.title}-${index}`}
              entering={FadeInDown.delay(index * 80).springify()}
              style={[
                styles.card,
                {
                  backgroundColor: palette.background,
                  borderColor: palette.border,
                },
              ]}
            >
              {/* Image */}
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                  resizeMode="cover"
                />

                <View
                  style={[
                    styles.imageAccent,
                    {
                      backgroundColor: palette.accent,
                    },
                  ]}
                />
              </View>

              {/* Content */}
              <View style={styles.content}>
                <View
                  style={[
                    styles.tag,
                    {
                      backgroundColor: `${palette.accent}15`,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      {
                        color: palette.accent,
                      },
                    ]}
                  >
                    Ideal For
                  </Text>
                </View>

                <Text style={styles.cardTitle}>
                  {item.title}
                </Text>

                <Text
                  numberOfLines={4}
                  style={styles.cardDescription}
                >
                  {item.description}
                </Text>
              </View>
            </Animated.View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default IdealForSection;