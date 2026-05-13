import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

// import consultationAnimation from '@/assets/animations/expertConsultation.json';

// const CONSULTATION_SOURCE =
//   consultationAnimation as unknown as React.ComponentProps<
//     typeof LottieView
//   >['source'];

type Props = {
  backgroundColor: string;
  accentColor: string;
};

export function ExpertConsultation({
  backgroundColor,
  accentColor,
}: Props) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(18)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.parallel([
      Animated.spring(contentOpacity, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(contentTranslate, {
        toValue: 0,
        friction: 8,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const floatingY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const glowOpacity = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.6],
  });

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Background Glow */}
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glowOpacity,
            backgroundColor: accentColor,
          },
        ]}
      />

      <LinearGradient
        colors={[
          'rgba(255,255,255,0.14)',
          'rgba(255,255,255,0.03)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.glass}
      >
        {/* Floating Lottie */}
        {/* <Animated.View
          style={[
            styles.lottieWrap,
            {
              transform: [{ translateY: floatingY }],
            },
          ]}
        >
          <View style={styles.ringOuter}>
            <View style={styles.ringInner}>
              <LottieView
                source={CONSULTATION_SOURCE}
                autoPlay
                loop
                style={styles.lottie}
              />
            </View>
          </View>
        </Animated.View> */}

        {/* Content */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslate }],
            },
          ]}
        >
          <Text style={[styles.label, { color: accentColor }]}>
            EXPERT CONSULTATION
          </Text>

          <Text style={styles.heading}>
            Connect With{"\n"}
            <Text style={styles.headingAccent}>Experts.</Text>
          </Text>

          <View style={styles.modeRow}>
            <View style={styles.modeChip}>
              <Text style={styles.modeEmoji}>🎧</Text>
              <Text style={styles.modeText}>Audio</Text>
            </View>

            <View style={styles.modeDivider} />

            <View style={styles.modeChip}>
              <Text style={styles.modeEmoji}>📹</Text>
              <Text style={styles.modeText}>Video</Text>
            </View>
          </View>

          <Text style={styles.sub}>
            Your Choice. Instant guidance from verified professionals.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { transform: [{ scale: 0.97 }] },
            ]}
          >
            <LinearGradient
              colors={['#2563EB', '#0EA5E9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonIcon}>✨</Text>
              <Text style={styles.buttonText}>
                Book Consultation Now
              </Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 220,
    overflow: 'hidden',
    padding: 14,
    justifyContent: 'center',
  },

  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 120,
    top: -75,
    right: -30,
  },

  glass: {
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
  },

  lottieWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  ringOuter: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: 'rgba(37,99,235,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  ringInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  lottie: {
    width: 88,
    height: 88,
  },

  content: {
    alignItems: 'center',
  },

  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 10,
  },

  heading: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 34,
  },

  headingAccent: {
    color: '#2563EB',
  },

  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
    gap: 12,
  },

  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.68)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 6,
  },

  modeEmoji: {
    fontSize: 14,
  },

  modeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },

  modeDivider: {
    width: 18,
    height: 1,
    backgroundColor: 'rgba(15,23,42,0.18)',
  },

  sub: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    color: '#475569',
    marginBottom: 18,
    paddingHorizontal: 10,
  },

  button: {
    width: '100%',
  },

  buttonGradient: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  buttonIcon: {
    fontSize: 15,
  },

  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});