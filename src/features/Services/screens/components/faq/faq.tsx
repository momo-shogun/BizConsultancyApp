import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from './FaqSection.styles';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQsData {
  faqs: FAQItem[];
}

export interface FAQSectionProps {
  faqs: FAQsData;
  showHeader?: boolean;
  variant?: 'page' | 'embedded';
  initialActiveIndex?: number | null;
  headerTitle?: string;
  headerSubtitle?: string;
  badgeLabel?: string;
}

const CHEVRON_COLOR = '#64748B';
const CHEVRON_COLOR_OPEN = '#2563EB';

function FAQSection(props: FAQSectionProps): React.ReactElement | null {
  const {
    faqs,
    showHeader = true,
    variant = 'page',
    initialActiveIndex = 0,
    headerTitle = 'Frequently Asked Questions',
    headerSubtitle = 'Quick answers to common questions related to registration and compliance.',
    badgeLabel = 'FAQs',
  } = props;

  const [activeIndex, setActiveIndex] = useState<number | null>(initialActiveIndex);
  const isCompact = variant === 'embedded';

  const items = faqs.faqs;

  const toggleFAQ = (index: number): void => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const containerStyle = useMemo(
    () => [styles.container, isCompact ? styles.containerEmbedded : null],
    [isCompact],
  );

  if (items.length === 0) {
    return null;
  }

  const chevronSize = isCompact ? 14 : 16;

  return (
    <View style={containerStyle}>
      {showHeader ? (
        <Animated.View entering={FadeInUp.duration(280)}>
          <View style={styles.headerWrap}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeLabel}</Text>
            </View>
            <Text style={styles.title}>{headerTitle}</Text>
            <Text style={styles.subtitle}>{headerSubtitle}</Text>
          </View>
        </Animated.View>
      ) : null}

      <View style={[styles.list, isCompact ? styles.listEmbedded : null]}>
        {items.map((faq, index) => {
          const isOpen = activeIndex === index;

          return (
            <Animated.View
              key={`${faq.question}-${index}`}
              entering={FadeInDown.delay(index * 40).duration(200)}
              layout={Layout.springify().damping(18).stiffness(220)}
              style={[
                styles.card,
                isOpen ? styles.cardOpen : null,
                index === items.length - 1 ? styles.lastCard : null,
              ]}
            >
              <Pressable
                onPress={() => toggleFAQ(index)}
                style={[styles.questionWrap, isCompact ? styles.questionWrapCompact : null]}
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
                accessibilityLabel={faq.question}
              >
                <View style={styles.leftSection}>
                  {!isCompact ? (
                    <View
                      style={[styles.questionBadge, isCompact ? styles.questionBadgeCompact : null]}
                    >
                      <Text
                        style={[
                          styles.questionBadgeText,
                          isCompact ? styles.questionBadgeTextCompact : null,
                        ]}
                      >
                        Q
                      </Text>
                    </View>
                  ) : null}

                  <Text
                    style={[styles.question, isCompact ? styles.questionCompact : null]}
                    numberOfLines={isOpen ? undefined : 2}
                  >
                    {faq.question}
                  </Text>
                </View>

                <Animated.View
                  layout={Layout.springify()}
                  style={[
                    styles.chevronWrap,
                    isCompact ? styles.chevronWrapCompact : null,
                    isOpen ? styles.chevronOpen : null,
                  ]}
                >
                  <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={chevronSize}
                    color={isOpen ? CHEVRON_COLOR_OPEN : CHEVRON_COLOR}
                  />
                </Animated.View>
              </Pressable>

              {isOpen ? (
                <Animated.View
                  entering={FadeInDown.duration(160)}
                  style={[styles.answerWrap, isCompact ? styles.answerWrapCompact : null]}
                >
                  <Text style={[styles.answer, isCompact ? styles.answerCompact : null]}>
                    {faq.answer}
                  </Text>
                </Animated.View>
              ) : null}
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

export default FAQSection;
