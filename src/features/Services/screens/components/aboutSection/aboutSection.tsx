import React, { memo } from 'react';
import {
  View,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';

import { styles, highlightColors } from './aboutSection.styles';

export type HighlightColor = 'blue' | 'orange' | 'emerald';

export type ContentSegment =
  | string
  | {
      text: string;
      color: HighlightColor;
    };

export interface AboutSectionProps {
  title: string;
  titleSegments?: ContentSegment[];
  intro?: string | ContentSegment[];
  paragraphs: (string | ContentSegment[])[];
  tagline?: string | ContentSegment[];
  containerStyle?: StyleProp<ViewStyle>;
}

interface HighlightChipProps {
  text: string;
  color: HighlightColor;
  inline?: boolean;
}

const HighlightChip = memo(
  ({ text, color, inline }: HighlightChipProps) => {
    return (
      <View
        style={[
          styles.highlightChip,
          inline && styles.inlineHighlightChip,
          {
            borderColor: highlightColors[color].border,
            backgroundColor: highlightColors[color].bg,
          },
        ]}
      >
        <Text
          style={[
            styles.highlightText,
            {
              color: highlightColors[color].text,
            },
          ]}
        >
          {text}
        </Text>
      </View>
    );
  }
);

HighlightChip.displayName = 'HighlightChip';

const renderSegments = (
  segments: ContentSegment[],
  inline = false
) => {
  return segments.map((segment, index) => {
    if (typeof segment === 'string') {
      return (
        <Text key={`text-${index}`} style={styles.inlineText}>
          {segment}
        </Text>
      );
    }

    return (
      <HighlightChip
        key={`highlight-${index}`}
        text={segment.text}
        color={segment.color}
        inline={inline}
      />
    );
  });
};

export const AboutSection = memo(
  ({
    title,
    titleSegments,
    intro,
    paragraphs,
    tagline,
    containerStyle,
  }: AboutSectionProps) => {
    return (
      <View style={[styles.sectionWrapper, containerStyle]}>
        <View style={styles.gradientGlowTop} />
        <View style={styles.gradientGlowBottom} />

        <View style={styles.card}>
          {/* Badge */}
          <Animated.View
            entering={FadeInDown.delay(80).duration(500)}
            style={styles.badge}
          >
            <View style={styles.badgeDot} />

            <Text style={styles.badgeText}>
              About this service
            </Text>
          </Animated.View>

          {/* Title */}
          <Animated.View
            entering={FadeInDown.delay(140).duration(550)}
          >
            <Text style={styles.title}>
              {titleSegments && titleSegments.length > 0
                ? renderSegments(titleSegments)
                : title}
            </Text>
          </Animated.View>

          {/* Intro */}
          {intro ? (
            <Animated.View
              entering={FadeInDown.delay(220).duration(550)}
              style={styles.introWrapper}
            >
              <Text style={styles.introText}>
                {Array.isArray(intro)
                  ? renderSegments(intro, true)
                  : intro}
              </Text>
            </Animated.View>
          ) : null}

          {/* Paragraphs */}
          <View style={styles.paragraphsContainer}>
            {paragraphs.map((paragraph, index) => (
              <Animated.View
                key={`paragraph-${index}`}
                entering={FadeInDown
                  .delay(260 + index * 90)
                  .duration(550)}
              >
                <Text style={styles.paragraphText}>
                  {Array.isArray(paragraph)
                    ? renderSegments(paragraph, true)
                    : paragraph}
                </Text>
              </Animated.View>
            ))}
          </View>

          {/* Tagline */}
          {tagline ? (
            <Animated.View
              entering={FadeInDown.delay(420).duration(550)}
              style={styles.taglineContainer}
            >
              <View style={styles.taglineBar} />

              <Text style={styles.taglineText}>
                {Array.isArray(tagline)
                  ? renderSegments(tagline, true)
                  : tagline}
              </Text>
            </Animated.View>
          ) : null}
        </View>
      </View>
    );
  }
);

AboutSection.displayName = 'AboutSection';