import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { ServicesStackParamList } from '@/navigation/types';
import {
  EmptyState,
  SafeAreaWrapper,
  ScreenWrapper,
  ScrollWrapper,
  SectionHeader,
} from '@/shared/components';

import { getServiceDetailExtras } from '../data/demoServices';
import { useServiceBySlug } from '../hooks/useServiceBySlug';

type ServiceDetailRouteProp = RouteProp<ServicesStackParamList, typeof ROUTES.Services.Detail>;

type DetailTabKey = 'overview' | 'included' | 'how';

export function ServiceDetailScreen(): React.ReactElement {
  const route = useRoute<ServiceDetailRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<ServicesStackParamList>>();
  const slug = route.params.slug;
  const item = useServiceBySlug(slug);
  const extras = useMemo(() => getServiceDetailExtras(slug), [slug]);
  const [activeTab, setActiveTab] = useState<DetailTabKey>('overview');

  useLayoutEffect(() => {
    if (item != null) {
      navigation.setOptions({ title: item.categoryLabel });
    }
  }, [navigation, item]);

  if (item == null) {
    return (
      <SafeAreaWrapper edges={['bottom']}>
        <ScreenWrapper style={styles.missWrap}>
          <EmptyState
            title="Service not found"
            description="This service may have been removed or the link is invalid. Use the back button to return."
          />
        </ScreenWrapper>
      </SafeAreaWrapper>
    );
  }

  const highlights = useMemo((): readonly { id: string; icon: string; title: string; subtitle: string }[] => {
    const base: readonly { id: string; icon: string; title: string; subtitle: string }[] = [
      { id: 'timeline', icon: 'time-outline', title: item.headerRight, subtitle: 'Typical turnaround' },
      { id: 'support', icon: 'headset-outline', title: 'Expert support', subtitle: 'Guided by verified consultants' },
      { id: 'updates', icon: 'notifications-outline', title: 'Milestone updates', subtitle: 'Stay informed at each step' },
      { id: 'docs', icon: 'document-text-outline', title: 'Document checklist', subtitle: 'Templates + review included' },
    ];
    return base;
  }, [item.headerRight]);

  return (
    <SafeAreaWrapper edges={['bottom']}>
      <ScreenWrapper style={styles.flex}>
        <ScrollWrapper contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.heroWrap}>
            <LinearGradient
              colors={[THEME.colors.chooseAccountConsultantGrad1, THEME.colors.chooseAccountConsultantGrad2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroBg}
            >
              <View pointerEvents="none" style={styles.heroDecor}>
                <View style={styles.heroGlowA} />
                <View style={styles.heroGlowB} />
                <View style={styles.heroGlowC} />
              </View>

              <View style={styles.heroTopRow}>
                <View style={styles.badgesRow}>
                  <View style={styles.pillLight}>
                    <Ionicons name="time-outline" size={14} color={THEME.colors.textPrimary} />
                    <Text style={styles.pillLightText} numberOfLines={1}>
                      {item.headerRight}
                    </Text>
                  </View>
                </View>

                {item.badgeLabel ? (
                  <View style={styles.dealChip}>
                    <Ionicons name="sparkles-outline" size={14} color={THEME.colors.white} />
                    <Text style={styles.dealChipText} numberOfLines={1}>
                      {item.badgeLabel}
                    </Text>
                  </View>
                ) : null}
              </View>

              <Text style={styles.heroTitle}>{item.title}</Text>
              <Text style={styles.heroSummary}>{item.summary}</Text>

              <View style={styles.trustRow}>
                <View style={styles.trustItem}>
                  <Ionicons name="star" size={14} color="#FFD166" />
                  <Text style={styles.trustText}>4.8</Text>
                  <Text style={styles.trustTextMuted}>(1.2k)</Text>
                </View>
                <View style={styles.trustDot} />
                <View style={styles.trustItem}>
                  <Ionicons name="shield-checkmark-outline" size={14} color={THEME.colors.white} />
                  <Text style={styles.trustText}>Verified experts</Text>
                </View>
              </View>

              <View style={styles.heroCard}>
                <View style={styles.heroCardLeft}>
                  <Text style={styles.priceLabel}>{item.priceLabel ?? '—'}</Text>
                  <Text style={styles.subLabel}>Transparent pricing • No hidden fees</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Get started with ${item.title}`}
                  hitSlop={8}
                  onPress={() => console.log('Get started', item.slug)}
                  style={({ pressed }) => [styles.heroCta, pressed ? styles.heroCtaPressed : null]}
                >
                  <Text style={styles.heroCtaText}>Get started</Text>
                  <Ionicons name="arrow-forward" size={16} color={THEME.colors.white} />
                </Pressable>
              </View>

              <View style={styles.quickActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Document checklist"
                  hitSlop={8}
                  onPress={() => console.log('Checklist', item.slug)}
                  style={({ pressed }) => [styles.quickBtn, pressed ? styles.quickPressed : null]}
                >
                  <Ionicons name="document-text-outline" size={16} color={THEME.colors.white} />
                  <Text style={styles.quickBtnText}>Checklist</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Talk to an expert"
                  hitSlop={8}
                  onPress={() => console.log('Talk to expert', item.slug)}
                  style={({ pressed }) => [styles.quickBtn, pressed ? styles.quickPressed : null]}
                >
                  <Ionicons name="call-outline" size={16} color={THEME.colors.white} />
                  <Text style={styles.quickBtnText}>Talk to expert</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.highlights}>
            <View style={styles.highlightsHeader}>
              <Text style={styles.highlightsTitle}>Service highlights</Text>
            </View>
            <View style={styles.highlightsList}>
              {highlights.map((h) => (
                <View key={h.id} style={styles.highlightRow}>
                  <View style={styles.highlightIcon}>
                    <Ionicons name={h.icon as never} size={18} color={THEME.colors.accentAmber} />
                  </View>
                  <View style={styles.highlightText}>
                    <Text style={styles.highlightTitle}>{h.title}</Text>
                    <Text style={styles.highlightSubtitle}>{h.subtitle}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.tabs}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Overview tab"
              onPress={() => setActiveTab('overview')}
              hitSlop={8}
              style={({ pressed }) => [
                styles.tab,
                activeTab === 'overview' ? styles.tabActive : null,
                pressed ? styles.tabPressed : null,
              ]}
            >
              <Text style={[styles.tabText, activeTab === 'overview' ? styles.tabTextActive : null]}>
                Overview
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Included tab"
              onPress={() => setActiveTab('included')}
              hitSlop={8}
              style={({ pressed }) => [
                styles.tab,
                activeTab === 'included' ? styles.tabActive : null,
                pressed ? styles.tabPressed : null,
              ]}
            >
              <Text style={[styles.tabText, activeTab === 'included' ? styles.tabTextActive : null]}>
                Included
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="How it works tab"
              onPress={() => setActiveTab('how')}
              hitSlop={8}
              style={({ pressed }) => [
                styles.tab,
                activeTab === 'how' ? styles.tabActive : null,
                pressed ? styles.tabPressed : null,
              ]}
            >
              <Text style={[styles.tabText, activeTab === 'how' ? styles.tabTextActive : null]}>
                How it works
              </Text>
            </Pressable>
          </View>

          {activeTab === 'overview' ? (
            <View style={styles.section}>
              <SectionHeader title="Overview" />
              <Text style={styles.body}>{extras.overview}</Text>
            </View>
          ) : null}

          {activeTab === 'included' ? (
            <View style={styles.section}>
              <SectionHeader title="What's included" />
              <View style={styles.bulletList}>
                {extras.included.map((line) => (
                  <View key={line} style={styles.bulletRow}>
                    <Text style={styles.bulletMark}>{'\u2022'}</Text>
                    <Text style={styles.bulletText}>{line}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {activeTab === 'how' ? (
            <View style={styles.sectionLast}>
              <SectionHeader title="How it works" />
              <View style={styles.bulletList}>
                {extras.howItWorks.map((line) => (
                  <View key={line} style={styles.bulletRow}>
                    <Text style={styles.bulletMark}>{'\u2022'}</Text>
                    <Text style={styles.bulletText}>{line}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollWrapper>
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  missWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: THEME.spacing[24],
    gap: THEME.spacing[20],
  },
  heroWrap: {
    paddingHorizontal: THEME.spacing[16],
    marginTop: THEME.spacing[8],
  },
  heroBg: {
    borderRadius: 22,
    padding: THEME.spacing[16],
    gap: THEME.spacing[12],
    overflow: 'hidden',
  },
  heroDecor: {
    ...StyleSheet.absoluteFill,
  },
  heroGlowA: {
    position: 'absolute',
    right: -80,
    top: -60,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  heroGlowB: {
    position: 'absolute',
    left: -70,
    bottom: -90,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: 'rgba(14,165,233,0.18)',
  },
  heroGlowC: {
    position: 'absolute',
    left: 60,
    top: 70,
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: THEME.spacing[12],
  },
  badgesRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[8],
  },
  pillLight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    backgroundColor: 'rgba(255,255,255,0.88)',
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[8],
    borderRadius: 999,
    maxWidth: '100%',
  },
  pillLightText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  dealChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    backgroundColor: 'rgba(0,0,0,0.18)',
    paddingHorizontal: THEME.spacing[12],
    paddingVertical: THEME.spacing[8],
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  dealChipText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
    letterSpacing: 0.2,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  heroSummary: {
    fontSize: THEME.typography.size[14],
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 20,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    marginTop: 2,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  trustText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
  },
  trustTextMuted: {
    fontSize: THEME.typography.size[12],
    color: 'rgba(255,255,255,0.80)',
  },
  heroCard: {
    backgroundColor: THEME.colors.white,
    borderRadius: 18,
    padding: THEME.spacing[16],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: THEME.spacing[12],
    shadowColor: THEME.colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  heroCardLeft: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.2,
  },
  subLabel: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
  heroCta: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[8],
    backgroundColor: THEME.colors.accentAmber,
    borderRadius: 999,
    paddingHorizontal: THEME.spacing[12],
    height: 40,
  },
  heroCtaPressed: {
    opacity: 0.9,
  },
  heroCtaText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
  },
  quickActions: {
    flexDirection: 'row',
    gap: THEME.spacing[12],
    marginTop: 2,
  },
  quickBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[8],
    backgroundColor: 'rgba(0,0,0,0.20)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  quickPressed: {
    opacity: 0.9,
  },
  quickBtnText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.white,
  },
  highlights: {
    paddingHorizontal: THEME.spacing[16],
    gap: THEME.spacing[12],
  },
  highlightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  highlightsTitle: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  highlightsList: {
    gap: THEME.spacing[12],
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[12],
    padding: THEME.spacing[12],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
  },
  highlightIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: `${THEME.colors.accentAmber}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  highlightTitle: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textPrimary,
  },
  highlightSubtitle: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
  tabs: {
    paddingHorizontal: THEME.spacing[16],
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
  },
  tabActive: {
    backgroundColor: THEME.colors.black,
    borderColor: THEME.colors.black,
  },
  tabPressed: {
    opacity: 0.9,
  },
  tabText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.textSecondary,
  },
  tabTextActive: {
    color: THEME.colors.white,
  },
  section: {
    paddingHorizontal: THEME.spacing[16],
    gap: THEME.spacing[8],
  },
  sectionLast: {
    paddingHorizontal: THEME.spacing[16],
    gap: THEME.spacing[8],
    marginBottom: THEME.spacing[8],
  },
  body: {
    fontSize: THEME.typography.size[16],
    lineHeight: 24,
    color: THEME.colors.textSecondary,
  },
  bulletList: {
    gap: THEME.spacing[8],
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing[8],
  },
  bulletMark: {
    fontSize: THEME.typography.size[16],
    color: THEME.colors.textPrimary,
    lineHeight: 24,
    marginTop: 0,
  },
  bulletText: {
    flex: 1,
    fontSize: THEME.typography.size[16],
    lineHeight: 24,
    color: THEME.colors.textSecondary,
  },
});
