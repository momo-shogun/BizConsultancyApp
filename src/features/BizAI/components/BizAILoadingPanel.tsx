import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  Easing,
  FadeIn,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { THEME } from '@/constants/theme';

import { BIZ_AI_THEME } from '../constants/bizAiTheme';
import { BIZ_AI_THINKING_STEPS } from '../constants/bizAiThinkingSteps';

type BizAILoadingPanelProps = {
  query: string;
  stepIndex?: number;
  compact?: boolean;
};

export function BizAILoadingPanel({
  query,
  stepIndex = 0,
  compact = false,
}: BizAILoadingPanelProps): React.ReactElement {
  const spin = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    spin.value = withRepeat(withTiming(360, { duration: 2200, easing: Easing.linear }), -1, false);
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 900, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.in(Easing.ease) }),
      ),
      -1,
      false,
    );
    return () => {
      cancelAnimation(spin);
      cancelAnimation(pulse);
    };
  }, [pulse, spin]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }, { scale: pulse.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value * 1.15 }],
    opacity: 0.35 + (pulse.value - 1) * 2,
  }));

  const truncatedQuery =
    query.length > 64 ? `${query.slice(0, 61).trimEnd()}…` : query;

  return (
    <Animated.View
      entering={FadeIn.duration(280)}
      style={[styles.root, compact ? styles.rootCompact : null]}
    >
      <LinearGradient
        colors={[...BIZ_AI_THEME.gradient.loader]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.panel}
      >
        <Text style={styles.eyebrow}>Processing your request</Text>
        <Text style={styles.title}>Crafting a tailored answer</Text>
        {truncatedQuery.length > 0 ? (
          <Text style={styles.queryPreview} numberOfLines={2}>
            “{truncatedQuery}”
          </Text>
        ) : null}

        <View style={styles.orbWrap}>
          <Animated.View style={[styles.ring, ringStyle]} />
          <Animated.View style={[styles.orb, orbStyle]}>
            <Ionicons name="sparkles" size={26} color={BIZ_AI_THEME.text.accent} />
          </Animated.View>
        </View>

        <View style={styles.stepsRow}>
          {BIZ_AI_THINKING_STEPS.map((label, index) => (
            <LoadingStep
              key={label}
              label={label}
              completed={index < stepIndex}
              active={index === stepIndex}
            />
          ))}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

type LoadingStepProps = {
  label: string;
  active?: boolean;
  completed?: boolean;
};

function LoadingStep({
  label,
  active = false,
  completed = false,
}: LoadingStepProps): React.ReactElement {
  return (
    <View style={styles.step}>
      <View
        style={[
          styles.stepDot,
          completed ? styles.stepDotCompleted : null,
          active ? styles.stepDotActive : null,
        ]}
      />
      <Text
        style={[
          styles.stepLabel,
          completed ? styles.stepLabelCompleted : null,
          active ? styles.stepLabelActive : null,
        ]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: BIZ_AI_THEME.spacing.screenX,
    paddingBottom: 56,
  },
  rootCompact: {
    flex: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  panel: {
    width: '100%',
    borderRadius: BIZ_AI_THEME.radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BIZ_AI_THEME.border.strong,
    paddingVertical: THEME.spacing[28],
    paddingHorizontal: THEME.spacing[20],
    alignItems: 'center',
    gap: THEME.spacing[10],
    ...BIZ_AI_THEME.shadow.card,
  },
  eyebrow: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    color: BIZ_AI_THEME.text.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: BIZ_AI_THEME.text.primary,
    fontSize: THEME.typography.size[20],
    fontWeight: THEME.typography.weight.semibold as '600',
    textAlign: 'center',
    lineHeight: 28,
  },
  queryPreview: {
    color: BIZ_AI_THEME.text.secondary,
    fontSize: THEME.typography.size[14],
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
    paddingHorizontal: THEME.spacing[8],
  },
  orbWrap: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: THEME.spacing[8],
    marginBottom: THEME.spacing[4],
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 44,
    borderWidth: 1.5,
    borderColor: BIZ_AI_THEME.border.accent,
  },
  orb: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: BIZ_AI_THEME.border.accent,
    backgroundColor: 'rgba(15,23,42,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: THEME.spacing[8],
    marginTop: THEME.spacing[4],
    width: '100%',
  },
  step: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  stepDotCompleted: {
    backgroundColor: BIZ_AI_THEME.accent.success,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepDotActive: {
    backgroundColor: BIZ_AI_THEME.accent.sky,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepLabel: {
    fontSize: 10,
    color: BIZ_AI_THEME.text.faint,
    fontWeight: THEME.typography.weight.medium as '500',
    textAlign: 'center',
    lineHeight: 13,
  },
  stepLabelCompleted: {
    color: BIZ_AI_THEME.text.muted,
  },
  stepLabelActive: {
    color: BIZ_AI_THEME.text.secondary,
    fontWeight: THEME.typography.weight.semibold as '600',
  },
});
