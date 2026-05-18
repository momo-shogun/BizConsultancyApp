import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

import type { ProcessStep } from '../../types';
import { processColors, processGradients, styles } from './ProcessSection.styles';

export interface ProcessSectionData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  steps?: ProcessStep[];
}

interface ProcessSectionProps {
  process: ProcessSectionData;
}

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

const STEP_ICONS: FeatherIconName[] = [
  'file-text',
  'upload-cloud',
  'shield',
  'check-circle',
  'award',
];

const FOOTER_ITEMS: { icon: FeatherIconName; label: string }[] = [
  { icon: 'check-circle', label: 'Guided Steps' },
  { icon: 'clock', label: 'Fast Process' },
  { icon: 'headphones', label: 'Expert Support' },
];

function SectionHeader({ process }: { process: ProcessSectionData }): React.ReactElement {
  return (
    <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
      <LinearGradient
        colors={[...processGradients.badge]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.badgeGradient}
      >
        <Text style={styles.badgeText}>{(process.badge || 'PROCESS').toUpperCase()}</Text>
      </LinearGradient>

      <Text style={styles.title}>
        {process.title || 'How It '}
        <Text style={styles.titleHighlight}>{process.titleHighlight || 'Works'}</Text>
      </Text>

      {process.subtitle != null && process.subtitle.length > 0 ? (
        <Text style={styles.subtitle}>{process.subtitle}</Text>
      ) : null}
    </Animated.View>
  );
}

function TimelineConnector({ isLast }: { isLast: boolean }): React.ReactElement | null {
  if (isLast) {
    return null;
  }

  return <View style={styles.timelineConnector} />;
}

function ProcessStepCard({
  step,
  index,
  isLast,
}: {
  step: ProcessStep;
  index: number;
  isLast: boolean;
}): React.ReactElement {
  const icon = STEP_ICONS[index % STEP_ICONS.length];

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 120).springify()}
      style={isLast ? styles.stepWrapperLast : styles.stepWrapper}
    >
      <TimelineConnector isLast={isLast} />

      <View style={styles.stepRow}>
        <Animated.View entering={ZoomIn.delay(index * 120)}>
          <LinearGradient
            colors={[...processGradients.stepCircle]}
            style={styles.stepCircleGradient}
          >
            <Feather name={icon} size={18} color={processColors.white} />
          </LinearGradient>
        </Animated.View>

        <Pressable style={styles.stepCardPressable}>
          <LinearGradient colors={[...processGradients.stepCard]} style={styles.stepCardGradient}>
            <View style={styles.stepCardTopRow}>
              <View style={styles.stepPill}>
                <Text style={styles.stepPillText}>STEP {index + 1}</Text>
              </View>

              <View style={styles.stepDurationRow}>
                <Feather name="clock" size={12} color={processColors.muted} />
                <Text style={styles.stepDurationText}>2 mins</Text>
              </View>
            </View>

            <Text style={styles.stepTitle}>{step.title}</Text>

            {step.description.length > 0 ? (
              <Text style={styles.stepDescription}>{step.description}</Text>
            ) : null}

            <View style={styles.stepFooterRow}>
              <View style={styles.stepStatusDot} />
              <Text style={styles.stepStatusText}>Simple & guided process</Text>
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </Animated.View>
  );
}

function FooterBadges(): React.ReactElement {
  return (
    <Animated.View entering={FadeInUp.delay(500)} style={styles.footer}>
      {FOOTER_ITEMS.map(item => (
        <View key={item.label} style={styles.footerBadge}>
          <Feather name={item.icon} size={14} color={processColors.primary} />
          <Text style={styles.footerBadgeText}>{item.label}</Text>
        </View>
      ))}
    </Animated.View>
  );
}

export function ProcessSection({ process }: ProcessSectionProps): React.ReactElement | null {
  const steps = process.steps ?? [];

  if (steps.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.decorCircleTop} />
      <View style={styles.decorCircleBottom} />

      <SectionHeader process={process} />

      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {steps.map((step, index) => (
          <ProcessStepCard
            key={`${step.title}-${index}`}
            step={step}
            index={index}
            isLast={index === steps.length - 1}
          />
        ))}
      </ScrollView>

      <FooterBadges />
    </View>
  );
}
