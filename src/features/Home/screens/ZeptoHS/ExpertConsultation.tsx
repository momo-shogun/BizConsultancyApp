import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { THEME } from '@/constants/theme';

// import consultationAnimation from '@/assets/animations/expertConsultation.json';

// const CONSULTATION_SOURCE =
//   consultationAnimation as unknown as React.ComponentProps<
//     typeof LottieView
//   >['source'];

type ExpertConsultationItem = {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  description: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
};

type Props = {
  backgroundColor: string;
  accentColor: string;
  data?: ExpertConsultationItem[];
};

const DUMMY_DATA: ExpertConsultationItem[] = [
  {
    id: 1,
    name: 'Energy and Fuel',
    slug: 'energy-and-fuel',
    thumbnail:
      'https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=1200&auto=format&fit=crop',
    description:
      'Mentorship for petroleum, gas, energy operations and industrial growth strategies.',
    category: {
      id: 1,
      name: 'Industrial',
      slug: 'industrial',
    },
  },
  {
    id: 2,
    name: 'Manufacturing Excellence',
    slug: 'manufacturing',
    thumbnail:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    description:
      'Learn scaling, automation and operational efficiency from manufacturing leaders.',
    category: {
      id: 1,
      name: 'Industrial',
      slug: 'industrial',
    },
  },
  {
    id: 3,
    name: 'Social Enterprises & CSR Funding',
    slug: 'social-enterprises-csr-funding',
    thumbnail:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop',
    description:
      'Guidance for NGOs, CSR initiatives and social impact funding opportunities.',
    category: {
      id: 2,
      name: 'Professional',
      slug: 'professional',
    },
  },
  {
    id: 4,
    name: 'Business Consulting',
    slug: 'business-consulting',
    thumbnail:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
    description:
      'Connect with experienced consultants for strategy, finance and growth planning.',
    category: {
      id: 2,
      name: 'Professional',
      slug: 'professional',
    },
  },
  {
    id: 5,
    name: 'Startup Fundraising',
    slug: 'startup-fundraising',
    thumbnail:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop',
    description:
      'Learn investor pitching, fundraising and startup scaling from founders and VCs.',
    category: {
      id: 3,
      name: 'Startup',
      slug: 'startup',
    },
  },
  {
    id: 6,
    name: 'Product & UX Mentorship',
    slug: 'product-ux',
    thumbnail:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
    description:
      'Get mentorship in product strategy, user experience and digital innovation.',
    category: {
      id: 3,
      name: 'Startup',
      slug: 'startup',
    },
  },
];

export function ExpertConsultation({
  backgroundColor,
  accentColor,
  data = DUMMY_DATA,
}: Props): React.ReactElement {
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(12)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;

  const groupedData = useMemo(() => {
    const map: Record<string, ExpertConsultationItem[]> = {};
    data.forEach((item) => {
      const key = item.category?.name ?? 'Other';
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(item);
    });
    return Object.entries(map);
  }, [data]);

  useEffect(() => {
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
  }, [contentOpacity, contentTranslate, glowPulse]);

  const glowOpacity = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.6],
  });

  return (
    <ScrollView
      style={[styles.scrollRoot, { backgroundColor }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroOuter}>
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
          colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.03)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.glass}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: contentOpacity,
                transform: [{ translateY: contentTranslate }],
              },
            ]}
          >
            <Text style={styles.heading}>
              Connect with{' '}
              <Text style={[styles.headingAccent, { color: accentColor }]}>
                experts
              </Text>
            </Text>

            <View style={styles.modeRow}>
              <View style={[styles.modeChip, { borderColor: `${accentColor}38` }]}>
                <Text style={[styles.modeText, { color: accentColor }]}>Audio</Text>
              </View>

              <View style={styles.modeDivider} />

              <View style={styles.modeChipMuted}>
                <Text style={styles.modeTextMuted}>Video</Text>
              </View>
            </View>

            <Text style={styles.sub}>
              Verified professionals — instant guidance, your preferred format.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && { transform: [{ scale: 0.97 }] },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Book consultation"
            >
              <LinearGradient
                colors={[accentColor, '#0EA5E9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Book consultation</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </LinearGradient>
      </View>

      {groupedData.map(([category, items]) => (
        <View key={category} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{category}</Text>
            <View style={styles.sectionLine} />
          </View>

          <FlatList
            horizontal
            nestedScrollEnabled
            data={items}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.imageWrap}>
                  <Image
                    source={{ uri: item.thumbnail }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(15,23,42,0.65)']}
                    style={styles.imageOverlay}
                  />
                  <View style={styles.floatingBadge}>
                    <Text style={styles.floatingBadgeText}>Expert Mentors</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text numberOfLines={2} style={styles.cardTitle}>
                    {item.name}
                  </Text>
                  <Text numberOfLines={3} style={styles.cardDescription}>
                    {item.description}
                  </Text>
                  <View style={styles.cardFooter}>
                    <View style={styles.tag}>
                      <Text style={[styles.tagText, { color: accentColor }]}>
                        {item.category.slug}
                      </Text>
                    </View>
                    <View style={styles.arrowWrap}>
                      <Text style={styles.arrow}>→</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollRoot: {
    width: '100%',
  },

  scrollContent: {
    paddingBottom: THEME.spacing[16],
  },

  heroOuter: {
    paddingHorizontal: THEME.spacing[12],
    paddingTop: THEME.spacing[8],
    paddingBottom: THEME.spacing[8],
    position: 'relative',
    overflow: 'hidden',
  },

  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -56,
    right: -24,
  },

  glass: {
    borderRadius: THEME.radius[16],
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[12],
    borderWidth: StyleSheet.hairlineWidth * 2,
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
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: -0.35,
    paddingHorizontal: THEME.spacing[4],
  },

  headingAccent: {
    fontWeight: '900',
  },

  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: THEME.spacing[10],
    marginBottom: THEME.spacing[8],
    gap: THEME.spacing[8],
  },

  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },

  modeChipMuted: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.12)',
  },

  modeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  modeTextMuted: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },

  modeDivider: {
    width: 14,
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: 'rgba(15,23,42,0.16)',
    borderRadius: 1,
  },

  sub: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    textAlign: 'center',
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing[10],
    paddingHorizontal: THEME.spacing[4],
  },

  button: {
    width: '100%',
  },

  buttonGradient: {
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: THEME.spacing[8],
  },

  buttonText: {
    color: THEME.colors.white,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  /* —— Category rows (matches MentorshipProgram) —— */
  section: {
    marginTop: THEME.spacing[12],
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing[12],
    marginBottom: THEME.spacing[8],
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.2,
  },

  sectionLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: 'rgba(15,23,42,0.1)',
    marginLeft: THEME.spacing[10],
    borderRadius: 1,
  },

  horizontalList: {
    paddingLeft: THEME.spacing[12],
    paddingRight: THEME.spacing[4],
  },

  card: {
    width: 220,
    marginRight: THEME.spacing[10],
    borderRadius: THEME.radius[16],
    backgroundColor: THEME.colors.white,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: THEME.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
  },

  imageWrap: {
    height: 118,
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  imageOverlay: {
    ...StyleSheet.absoluteFill,
  },

  floatingBadge: {
    position: 'absolute',
    top: THEME.spacing[8],
    left: THEME.spacing[8],
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 4,
    borderRadius: 999,
  },

  floatingBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    letterSpacing: 0.2,
  },

  cardBody: {
    paddingHorizontal: THEME.spacing[10],
    paddingTop: THEME.spacing[10],
    paddingBottom: THEME.spacing[10],
  },

  cardTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.15,
  },

  cardDescription: {
    marginTop: THEME.spacing[8],
    fontSize: 12,
    lineHeight: 16,
    color: THEME.colors.textSecondary,
  },

  cardFooter: {
    marginTop: THEME.spacing[10],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  tag: {
    backgroundColor: 'rgba(37,99,235,0.08)',
    paddingHorizontal: THEME.spacing[8],
    paddingVertical: 4,
    borderRadius: 999,
  },

  tagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },

  arrowWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: THEME.colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrow: {
    color: THEME.colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
