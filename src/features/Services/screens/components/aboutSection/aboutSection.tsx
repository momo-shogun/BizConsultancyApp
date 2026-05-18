import React, { memo } from 'react';
import {
  View,
  Text,
  StyleProp,
  TextStyle,
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

function withTrailingSpace(value: string): string {
  const trimmed = value.trimEnd();
  return trimmed.length > 0 ? `${trimmed} ` : '';
}

function renderSegmentNodes(
  segments: ContentSegment[],
  plainStyle: StyleProp<TextStyle>,
  highlightBaseStyle: StyleProp<TextStyle>,
): React.ReactNode[] {
  return segments.map((segment, index) => {
    if (typeof segment === 'string') {
      return (
        <Text key={`seg-${index}`} style={plainStyle}>
          {withTrailingSpace(segment)}
        </Text>
      );
    }

    const palette = highlightColors[segment.color];
    return (
      <Text
        key={`seg-${index}`}
        style={[
          highlightBaseStyle,
          { color: palette.text },
        ]}
      >
        {withTrailingSpace(segment.text)}
      </Text>
    );
  });
}

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
          <Animated.View
            entering={FadeInDown.delay(140).duration(550)}
          >
            <Text style={styles.title}>
              {titleSegments != null && titleSegments.length > 0
                ? renderSegmentNodes(
                    titleSegments,
                    styles.titlePlainSegment,
                    styles.titleHighlightSegment,
                  )
                : title}
            </Text>
          </Animated.View>

          {intro != null && intro !== '' ? (
            <Animated.View
              entering={FadeInDown.delay(220).duration(550)}
              style={styles.introWrapper}
            >
              <Text style={styles.introText}>
                {Array.isArray(intro)
                  ? renderSegmentNodes(
                      intro,
                      styles.introPlainSegment,
                      styles.introHighlightSegment,
                    )
                  : intro}
              </Text>
            </Animated.View>
          ) : null}

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
                    ? renderSegmentNodes(
                        paragraph,
                        styles.paragraphPlainSegment,
                        styles.paragraphHighlightSegment,
                      )
                    : paragraph}
                </Text>
              </Animated.View>
            ))}
          </View>

          {tagline != null &&
          (typeof tagline === 'string'
            ? tagline.length > 0
            : tagline.length > 0) ? (
            <Animated.View
              entering={FadeInDown.delay(420).duration(550)}
              style={styles.taglineContainer}
            >
              <View style={styles.taglineBar} />

              <Text style={styles.taglineText}>
                {Array.isArray(tagline)
                  ? renderSegmentNodes(
                      tagline,
                      styles.taglinePlainSegment,
                      styles.taglineHighlightSegment,
                    )
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
