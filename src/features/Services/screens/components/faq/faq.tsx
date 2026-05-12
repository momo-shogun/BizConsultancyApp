import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from 'react-native-reanimated';

import { styles } from './FaqSection.styles';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQsData {
  faqs: FAQItem[];
}

interface FAQSectionProps {
  faqs: FAQsData;
}

const FAQSection: React.FC<FAQSectionProps> = ({
  faqs,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setActiveIndex(prev =>
      prev === index ? null : index
    );
  };

  if (!faqs?.faqs?.length) {
    return null;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <Animated.View entering={FadeInUp.duration(350)}>
        <View style={styles.headerWrap}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              FAQs
            </Text>
          </View>

          <Text style={styles.title}>
            Frequently Asked Questions
          </Text>

          <Text style={styles.subtitle}>
            Quick answers to common questions related
            to registration and compliance.
          </Text>
        </View>
      </Animated.View>

      {/* FAQ List */}
      <View style={styles.list}>
        {faqs.faqs.map((faq, index) => {
          const isOpen = activeIndex === index;

          return (
            <Animated.View
              key={`${faq.question}-${index}`}
              entering={FadeInDown.delay(index * 70)}
              layout={Layout.springify()}
              style={[
                styles.card,
                index === faqs.faqs.length - 1 &&
                  styles.lastCard,
              ]}
            >
              <Pressable
                onPress={() => toggleFAQ(index)}
                style={styles.questionWrap}
              >
                <View style={styles.leftSection}>
                  <View style={styles.questionBadge}>
                    <Text style={styles.questionBadgeText}>
                      Q
                    </Text>
                  </View>

                  <Text style={styles.question}>
                    {faq.question}
                  </Text>
                </View>

                <Animated.Text
                  layout={Layout.springify()}
                  style={[
                    styles.chevron,
                    isOpen && styles.chevronOpen,
                  ]}
                >
                  ⌄
                </Animated.Text>
              </Pressable>

              {isOpen && (
                <Animated.View
                  entering={FadeInDown.duration(220)}
                  style={styles.answerWrap}
                >
                  <View style={styles.answerLine} />

                  <Text style={styles.answer}>
                    {faq.answer}
                  </Text>
                </Animated.View>
              )}
            </Animated.View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default FAQSection;