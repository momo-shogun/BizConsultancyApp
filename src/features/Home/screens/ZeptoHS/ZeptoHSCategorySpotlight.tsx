import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import type { HomeCategoryId } from './ZeptoHS.types';
import diagnosisAnimation from '@/assets/animations/businessDiagonisis.json';

/** Satisfies `LottieView` `source` when JSON is typed as `Record<string, unknown>` from Metro. */
const DIAGNOSIS_LOTTIE_SOURCE = diagnosisAnimation as unknown as React.ComponentProps<
  typeof LottieView
>['source'];

export type ZeptoHSCategorySpotlightProps = {
  categoryId: HomeCategoryId;
  backgroundColor: string;
  accentColor: string;
};

/** Build `rgba(...)` from `#RRGGBB` for soft overlays on the shell background. */
function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '').trim();
  if (h.length !== 6) return `rgba(37, 99, 235, ${alpha})`;
  const r = Number.parseInt(h.slice(0, 2), 16);
  const g = Number.parseInt(h.slice(2, 4), 16);
  const b = Number.parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return `rgba(37, 99, 235, ${alpha})`;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─── Text shadows (BIZ block unchanged) ───────────────────────────────────────

const SHADOW_RED = '#7a1a0a';
const SHADOW_TEAL = '#0d3a2e';

/** Soft “radial” glow using linear gradient in a circle + slow drift (native driver). */
function AmbientRadialOrbs({ accentColor }: { accentColor: string }) {
  const driftA = useRef(new Animated.Value(0)).current;
  const driftB = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (v: Animated.Value, halfMs: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, {
            toValue: 1,
            duration: halfMs,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 0,
            duration: halfMs,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );
    const a = loop(driftA, 9200);
    const b = loop(driftB, 12400);
    a.start();
    b.start();
    return () => {
      a.stop();
      b.stop();
    };
  }, [driftA, driftB]);

  const aOpacity = driftA.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.38, 0.52, 0.38],
  });
  const aTx = driftA.interpolate({ inputRange: [0, 1], outputRange: [-6, 8] });
  const aTy = driftA.interpolate({ inputRange: [0, 1], outputRange: [4, -7] });

  const bOpacity = driftB.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.32, 0.46, 0.32],
  });
  const bTx = driftB.interpolate({ inputRange: [0, 1], outputRange: [7, -5] });
  const bTy = driftB.interpolate({ inputRange: [0, 1], outputRange: [-5, 6] });

  const leftColors = [
    withAlpha(accentColor, 0.26),
    withAlpha(accentColor, 0.09),
    withAlpha(accentColor, 0.02),
    'rgba(0,0,0,0)',
  ] as const;
  const rightColors = [
    'rgba(13, 148, 136, 0.16)',
    'rgba(13, 148, 136, 0.06)',
    'rgba(255, 255, 255, 0.04)',
    'rgba(0,0,0,0)',
  ] as const;

  return (
    <View style={ambient.layer} pointerEvents="none">
      <Animated.View
        style={[
          ambient.orbShell,
          ambient.orbLeft,
          { opacity: aOpacity, transform: [{ translateX: aTx }, { translateY: aTy }] },
        ]}
      >
        <LinearGradient
          colors={[...leftColors]}
          locations={[0, 0.28, 0.58, 1]}
          start={{ x: 0.2, y: 0.2 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View
        style={[
          ambient.orbShell,
          ambient.orbRight,
          { opacity: bOpacity, transform: [{ translateX: bTx }, { translateY: bTy }] },
        ]}
      >
        <LinearGradient
          colors={[...rightColors]}
          locations={[0, 0.32, 0.62, 1]}
          start={{ x: 0.85, y: 0.15 }}
          end={{ x: 0.15, y: 0.95 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const ambient = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
    overflow: 'hidden',
  },
  orbShell: {
    position: 'absolute',
    overflow: 'hidden',
  },
  orbLeft: {
    width: 168,
    height: 168,
    borderRadius: 84,
    top: -52,
    left: -36,
  },
  orbRight: {
    width: 152,
    height: 152,
    borderRadius: 76,
    bottom: -48,
    right: -28,
  },
});

type DiagnosisBannerProps = {
  backgroundColor: string;
  accentColor: string;
};

function DiagnosisBanner({ backgroundColor, accentColor }: DiagnosisBannerProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulse]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1.02],
  });

  return (
    <View style={[banner.wrap, { backgroundColor }]}>
      <AmbientRadialOrbs accentColor={accentColor} />

      <View style={banner.lottieSlot}>
        <LottieView source={DIAGNOSIS_LOTTIE_SOURCE} autoPlay loop style={banner.lottie} />
      </View>

      <Animated.View style={[banner.center, { transform: [{ scale }] }]}>
        <Text style={[banner.eyebrow, { color: accentColor }]}>AI-POWERED</Text>

        <View style={banner.titleRow}>
          <Text style={banner.wordBoost}>Boost </Text>
          <Text style={banner.wordYour}>Your</Text>
        </View>
        <View style={banner.titleRow}>
          <Text style={banner.wordBiz}>BIZ</Text>
          <Text style={banner.dot}> · </Text>
          <Text style={banner.wordDiag}>Diagnostics</Text>
        </View>
        <Text style={banner.sub}>Smart insights to fix, scale & grow</Text>
      </Animated.View>

      <View style={[banner.lottieSlot, banner.lottieRight]}>
        <LottieView
          source={DIAGNOSIS_LOTTIE_SOURCE}
          autoPlay
          loop
          style={[banner.lottie, { transform: [{ scaleX: -1 }] }]}
        />
      </View>
    </View>
  );
}

const banner = StyleSheet.create({
  wrap: {
    width: '100%',
    minHeight: 156,
    borderRadius: 0,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  lottieSlot: {
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  lottieRight: {},
  lottie: {
    width: 86,
    height: 86,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    zIndex: 2,
    minWidth: 0,
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2.2,
    fontWeight: '700',
    marginBottom: 6,
    opacity: 0.92,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  wordBoost: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    textShadowColor: 'rgba(148, 163, 184, 0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 1,
  },
  wordYour: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E3A5F',
    textShadowColor: 'rgba(15, 23, 42, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  /** BIZ styling — unchanged from approved design. */
  wordBiz: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFD93D', // fallback; use MaskedView for gradient
    textShadowColor: SHADOW_RED,
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 1,
  },
  dot: {
    fontSize: 18,
    color: 'rgba(15, 23, 42, 0.35)',
    fontWeight: '900',
  },
  wordDiag: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F766E',
    textShadowColor: SHADOW_TEAL,
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 0,
  },
  sub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 17,
    textAlign: 'center',
    maxWidth: 220,
    marginTop: 6,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    rowGap: 8,
  },
  pill: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

const PLACEHOLDER_COPY: Record<Exclude<HomeCategoryId, 'diagnosis'>, string> = {
  services: 'Browse business services tailored to your stage.',
  consultation: 'Book experts for strategy, finance, and operations.',
  mentorship: 'Find mentors and structured growth programs.',
};

const ph = StyleSheet.create({
  wrap: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  hint: {
    fontSize: 12,
    color: 'rgba(10,10,10,0.55)',
    lineHeight: 18,
  },
});

export function ZeptoHSCategorySpotlight({
  categoryId,
  backgroundColor,
  accentColor,
}: ZeptoHSCategorySpotlightProps): React.ReactElement {
  if (categoryId === 'diagnosis') {
    return <DiagnosisBanner backgroundColor={backgroundColor} accentColor={accentColor} />;
  }

  const body = PLACEHOLDER_COPY[categoryId];

  return (
    <View style={[ph.wrap, { backgroundColor }]}>
      <Text style={[ph.title, { color: accentColor }]}>{body}</Text>
      <Text style={ph.hint}>Demo content — wire real data later.</Text>
    </View>
  );
}
