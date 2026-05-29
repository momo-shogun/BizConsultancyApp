import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {
  useGetMasterCategoriesQuery,
  useGetMasterSegmentsQuery,
} from '@/features/consultant/api/consultantApi';
import type { MasterDataItem } from '@/features/consultant/types/masterData.types';
import {
  buildExpertConsultationSections,
  toMasterCategoryRefs,
} from '@/features/Home/utils/expertConsultationMappers';
import { ROUTES } from '@/navigation/routeNames';
import { navigationRef } from '@/navigation/navigationContainerRef';
import { THEME } from '@/constants/theme';

import { ExpertConsultationSectionSkeleton } from './components/ExpertConsultationSectionSkeleton';
import { ExpertConsultationSegmentCard } from './components/ExpertConsultationSegmentCard';

type Props = {
  backgroundColor: string;
  accentColor: string;
};

const LOADING_SECTION_COUNT = 2;

export function ExpertConsultation({
  backgroundColor,
  accentColor,
}: Props): React.ReactElement {
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(12)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;

  const {
    data: categoriesRaw = [],
    isLoading: categoriesLoading,
    isFetching: categoriesFetching,
  } = useGetMasterCategoriesQuery();

  const {
    data: segments = [],
    isLoading: segmentsLoading,
    isFetching: segmentsFetching,
  } = useGetMasterSegmentsQuery();

  const isLoading =
    categoriesLoading || segmentsLoading || categoriesFetching || segmentsFetching;

  const categorySections = useMemo(() => {
    const categories = toMasterCategoryRefs(categoriesRaw);
    return buildExpertConsultationSections(categories, segments);
  }, [categoriesRaw, segments]);

  const onBookConsultationPress = useCallback((): void => {
    if (!navigationRef.isReady()) {
      return;
    }
    navigationRef.navigate(ROUTES.Root.ConsultantsList);
  }, []);

  const onSegmentPress = useCallback((segment: MasterDataItem, categoryId: number): void => {
    if (!navigationRef.isReady()) {
      return;
    }
    const resolvedCategoryId = segment.categoryId ?? segment.category?.id ?? categoryId;
    navigationRef.navigate(ROUTES.Root.ConsultantsList, {
      categoryId: resolvedCategoryId,
      segmentId: segment.id,
    });
  }, []);

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
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false}
      nestedScrollEnabled
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
                pressed ? { transform: [{ scale: 0.97 }] } : null,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Book consultation"
              onPress={onBookConsultationPress}
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

      {isLoading ? (
        Array.from({ length: LOADING_SECTION_COUNT }, (_, index) => (
          <ExpertConsultationSectionSkeleton key={`expert-consultation-loading-${index}`} />
        ))
      ) : (
        categorySections.map((section) => {
          const categorySlug =
            section.category.slug?.trim() ||
            section.category.name.trim().toLowerCase().replace(/\s+/g, '-');

          return (
            <View key={String(section.category.id)} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.category.name}</Text>
                <View style={styles.sectionLine} />
              </View>

              <FlatList
                horizontal
                nestedScrollEnabled
                data={section.segments}
                keyExtractor={(item) => String(item.id)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                renderItem={({ item }) => (
                  <ExpertConsultationSegmentCard
                    item={item}
                    accentColor={accentColor}
                    categorySlug={categorySlug}
                    categoryId={section.category.id}
                    onPress={onSegmentPress}
                  />
                )}
              />
            </View>
          );
        })
      )}
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

  content: {
    alignItems: 'center',
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
    marginBottom : 10,
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
