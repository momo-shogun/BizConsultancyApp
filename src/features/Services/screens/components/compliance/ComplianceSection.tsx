import React from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';

import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

import { styles } from './ComplianceSection.styles';

interface TitleSegment {
  type: 'plain' | 'highlight';
  value: string;
  color?: string;
}

interface ComplianceData {
  badge?: string;

  titleSegments?: TitleSegment[];

  description?: string;

  items: string[];
}

interface ComplianceSectionProps {
  compliance: ComplianceData;
}

const HIGHLIGHT_COLORS: Record<string, string> = {
  blue: '#2563EB',
  green: '#059669',
  orange: '#EA580C',
  purple: '#7C3AED',
};

const CARD_COLORS = [
  {
    soft: '#EFF6FF',
    border: '#BFDBFE',
    accent: '#2563EB',
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
  {
    soft: '#F5F3FF',
    border: '#DDD6FE',
    accent: '#7C3AED',
  },
];

const ComplianceSection: React.FC<ComplianceSectionProps> = ({
  compliance,
}) => {
  if (!compliance?.items?.length) {
    return null;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(400)}>
        <View style={styles.headerCard}>
          {!!compliance.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {compliance.badge}
              </Text>
            </View>
          )}

          <Text style={styles.title}>
            {compliance.titleSegments?.map((segment, index) => {
              const color =
                segment.type === 'highlight'
                  ? HIGHLIGHT_COLORS[
                      segment.color || 'blue'
                    ]
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

          {!!compliance.description && (
            <Text style={styles.description}>
              {compliance.description}
            </Text>
          )}
        </View>
      </Animated.View>

      {/* Timeline List */}
      <View style={styles.timelineContainer}>
        {compliance.items.map((item, index) => {
          const palette =
            CARD_COLORS[index % CARD_COLORS.length];

          const isLast =
            index === compliance.items.length - 1;

          return (
            <Animated.View
              key={`${item}-${index}`}
              entering={FadeInDown.delay(index * 60)}
              style={styles.timelineItem}
            >
              {/* Left Timeline */}
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.timelineDot,
                    {
                      backgroundColor: palette.accent,
                      borderColor: palette.border,
                    },
                  ]}
                />

                {!isLast && (
                  <View style={styles.timelineLine} />
                )}
              </View>

              {/* Content */}
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: palette.soft,
                    borderColor: palette.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.topAccent,
                    // {
                    //   backgroundColor: palette.accent,
                    // },
                  ]}
                />

                <Text style={styles.itemText}>
                  {item}
                </Text>
              </View>
            </Animated.View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default ComplianceSection;