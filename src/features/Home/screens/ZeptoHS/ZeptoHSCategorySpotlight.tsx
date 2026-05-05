import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing, Pressable } from 'react-native';
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

/** One config object for the diagnosis hero loop: Lottie in → dwell → fly-by → text in → hold → text out → repeat. */
const DIAG_BANNER = {
  /** Time copy stays readable before the next Lottie pass. */
  dwellMs: 10_000,
  introMs: 820,
  afterIntroMs: 320,
  flyByMs: 580,
  lottieFadeOutMs: 480,
  textInOpacityMs: 440,
  textOutMoveMs: 440,
  textOutOpacityMs: 400,
  springLottie: { friction: 8, tension: 70 } as const,
  springTextIn: { friction: 10, tension: 78 } as const,
  lottie: {
    from: { tx: -120, ty: -95, s: 0.52 },
    center: { tx: 0, ty: 0, s: 1 },
    exit: { tx: 300, ty: -55, s: 0.68 },
  },
  text: { hiddenAbove: -36, exitDown: 40 },
} as const;

type DiagnosisAnimValues = {
  lottieTx: Animated.Value;
  lottieTy: Animated.Value;
  lottieScale: Animated.Value;
  lottieOpacity: Animated.Value;
  textTy: Animated.Value;
  textOpacity: Animated.Value;
};

function resetDiagnosisBannerForCycle(v: DiagnosisAnimValues): void {
  const { from } = DIAG_BANNER.lottie;
  v.lottieTx.setValue(from.tx);
  v.lottieTy.setValue(from.ty);
  v.lottieScale.setValue(from.s);
  v.lottieOpacity.setValue(1);
  v.textTy.setValue(DIAG_BANNER.text.hiddenAbove);
  v.textOpacity.setValue(0);
}

/** Full cycle once; caller resets with `resetDiagnosisBannerForCycle` before each start. */
function createDiagnosisBannerCycle(v: DiagnosisAnimValues): Animated.CompositeAnimation {
  const { center, exit } = DIAG_BANNER.lottie;

  const intro = Animated.parallel([
    Animated.timing(v.lottieTx, {
      toValue: center.tx,
      duration: DIAG_BANNER.introMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
    Animated.timing(v.lottieTy, {
      toValue: center.ty,
      duration: DIAG_BANNER.introMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
    Animated.spring(v.lottieScale, {
      toValue: center.s,
      ...DIAG_BANNER.springLottie,
      useNativeDriver: true,
    }),
  ]);

  const flyBy = Animated.parallel([
    Animated.timing(v.lottieTx, {
      toValue: exit.tx,
      duration: DIAG_BANNER.flyByMs,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }),
    Animated.timing(v.lottieTy, {
      toValue: exit.ty,
      duration: DIAG_BANNER.flyByMs,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }),
    Animated.timing(v.lottieScale, {
      toValue: exit.s,
      duration: DIAG_BANNER.flyByMs,
      useNativeDriver: true,
    }),
    Animated.timing(v.lottieOpacity, {
      toValue: 0,
      duration: DIAG_BANNER.lottieFadeOutMs,
      useNativeDriver: true,
    }),
  ]);

  const textIn = Animated.parallel([
    Animated.spring(v.textTy, {
      toValue: 0,
      ...DIAG_BANNER.springTextIn,
      useNativeDriver: true,
    }),
    Animated.timing(v.textOpacity, {
      toValue: 1,
      duration: DIAG_BANNER.textInOpacityMs,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }),
  ]);

  const textOut = Animated.parallel([
    Animated.timing(v.textTy, {
      toValue: DIAG_BANNER.text.exitDown,
      duration: DIAG_BANNER.textOutMoveMs,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }),
    Animated.timing(v.textOpacity, {
      toValue: 0,
      duration: DIAG_BANNER.textOutOpacityMs,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }),
  ]);

  return Animated.sequence([
    intro,
    Animated.delay(DIAG_BANNER.afterIntroMs),
    flyBy,
    textIn,
    Animated.delay(DIAG_BANNER.dwellMs),
    textOut,
  ]);
}

/** Soft "radial" glow using linear gradient in a circle + slow drift (native driver). */
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
  const lottieTx = useRef(new Animated.Value(DIAG_BANNER.lottie.from.tx)).current;
  const lottieTy = useRef(new Animated.Value(DIAG_BANNER.lottie.from.ty)).current;
  const lottieScale = useRef(new Animated.Value(DIAG_BANNER.lottie.from.s)).current;
  const lottieOpacity = useRef(new Animated.Value(1)).current;
  const textTy = useRef(new Animated.Value(DIAG_BANNER.text.hiddenAbove)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    let running: Animated.CompositeAnimation | null = null;

    const v: DiagnosisAnimValues = {
      lottieTx,
      lottieTy,
      lottieScale,
      lottieOpacity,
      textTy,
      textOpacity,
    };

    const stop = (): void => {
      running?.stop();
      running = null;
    };

    const runLoop = (): void => {
      if (cancelled) return;
      stop();
      resetDiagnosisBannerForCycle(v);
      running = createDiagnosisBannerCycle(v);
      running.start(({ finished }) => {
        running = null;
        if (!finished || cancelled) return;
        runLoop();
      });
    };

    runLoop();

    return () => {
      cancelled = true;
      stop();
    };
  }, [lottieTx, lottieTy, lottieScale, lottieOpacity, textTy, textOpacity]);

  const lottieMotion = {
    opacity: lottieOpacity,
    transform: [{ translateX: lottieTx }, { translateY: lottieTy }, { scale: lottieScale }],
  };

  const textMotion = {
    opacity: textOpacity,
    transform: [{ translateY: textTy }],
  };

  return (
    <View style={[banner.wrap, { backgroundColor }]}>
      <AmbientRadialOrbs accentColor={accentColor} />

      <View style={banner.stage}>
        <Animated.View style={[banner.lottieAnchor, lottieMotion]} pointerEvents="none">
          <LottieView
            source={DIAGNOSIS_LOTTIE_SOURCE}
            autoPlay
            loop
            style={banner.lottie}
          />
        </Animated.View>

        <Animated.View style={[banner.textBlock, textMotion]}>
          <View style={banner.textColumn}>
            <Text style={[banner.eyebrow, { color: accentColor }]}>Business Intelligence 
            </Text>

            <View style={banner.titleRow}>
              <Text style={banner.wordBoost}>Boost </Text>
              <Text style={banner.wordYour}>your business</Text>
            </View>

            {/* "with" — hairline rules flanking the word as a divider */}
            <View style={banner.withRow}>
              {/* <View style={banner.withLine} /> */}
              <Text style={banner.withWord}>with</Text>
              {/* <View style={banner.withLine} /> */}
            </View>

            <View style={banner.titleRow}>
              <Text style={banner.wordBiz}>BIZ</Text>
              {/* <Text style={banner.dot}> · </Text> */}
              <Text style={banner.wordDiag}>Diagnostics</Text>
            </View>

            <Text style={banner.sub}>Smart insights to fix, scale & grow</Text>

            <View style={banner.pills}>
              <Pressable
                style={({ pressed }) => [
                  banner.pill,
                  banner.pillPrimary,
                  pressed && banner.pillPressed,
                ]}
                onPress={() => console.log('Talk to expert clicked')}
                accessibilityRole="button"
                accessibilityLabel="Talk to expert"
                hitSlop={6}
              >
                <Text style={banner.pillIconPrimary}>💬</Text>
                <Text style={[banner.pillText, banner.pillTextPrimary]}>Talk to Expert</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  banner.pill,
                  banner.pillSecondary,
                  pressed && banner.pillPressed,
                ]}
                onPress={() => console.log('Request Diagnosis clicked')}
                accessibilityRole="button"
                accessibilityLabel="Request Diagnosis"
                hitSlop={6}
              >
                <Text style={banner.pillIconSecondary}>🔍</Text>
                <Text style={[banner.pillText, banner.pillTextSecondary]}>Diagnose Now</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const banner = StyleSheet.create({
  wrap: {
    width: '100%',
    minHeight: 172,
    borderRadius: 0,
    overflow: 'hidden',
    paddingHorizontal: 14,
  },
  stage: {
    position: 'relative',
    minHeight: 172,
    zIndex: 2,
    paddingVertical: 10,
  },
  lottieAnchor: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  lottie: {
    width: 148,
    height: 148,
  },
  textBlock: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'stretch',
    zIndex: 2,
  },
  textColumn: {
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'stretch',
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2.2,
    fontWeight: '700',
    marginBottom: 4,
    opacity: 0.92,
    width: '100%',
    textAlign: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'stretch',
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
  /** "with" divider row — hairline rules + small italic label */
  withRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 2,
    marginBottom: -4,
    gap: 2,
    justifyContent: 'center',
  },
  withLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: 'rgba(15, 23, 42, 0.16)',
    borderRadius: 1,
  },
  withWord: {
    fontSize: 10,
    fontWeight: '500',
    fontStyle: 'italic',
    letterSpacing: 1.0,
    color: 'rgba(15, 23, 42, 0.4)',
  },
  /** BIZ styling — unchanged from approved design. */
  wordBiz: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFD93D',
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
    marginLeft: 8,
  },
  sub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 18,
    textAlign: 'center',
    width: '100%',
    alignSelf: 'stretch',
    marginTop: 6,
    marginBottom: 10,
    paddingHorizontal: 0,
  },
  pills: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'stretch',
    gap: 8,
    marginTop: 2,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderWidth: 1,
    gap: 5,
  },
  pillPrimary: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    borderColor: 'rgba(37, 99, 235, 0.35)',
  },
  pillSecondary: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(4, 120, 87, 0.32)',
  },
  pillPressed: {
    opacity: 0.65,
    transform: [{ scale: 0.97 }],
  },
  pillIconPrimary: {
    fontSize: 13,
    lineHeight: 16,
  },
  pillIconSecondary: {
    fontSize: 13,
    lineHeight: 16,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  pillTextPrimary: {
    color: '#1D4ED8',
  },
  pillTextSecondary: {
    color: '#047857',
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
