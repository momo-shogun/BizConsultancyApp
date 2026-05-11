import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
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
import { styles } from './ServiceDetailsStyle';

type ServiceDetailRouteProp = RouteProp<
  ServicesStackParamList,
  typeof ROUTES.Services.Detail
>;

type DetailTabKey = 'overview' | 'included' | 'how';

export function ServiceDetailScreen(): React.ReactElement {
  const route = useRoute<ServiceDetailRouteProp>();

  const navigation =
    useNavigation<NativeStackNavigationProp<ServicesStackParamList>>();

  const slug = route.params.slug;

  const item = useServiceBySlug(slug);

  const extras = useMemo(() => getServiceDetailExtras(slug), [slug]);

  const [activeTab, setActiveTab] = useState<DetailTabKey>('overview');

  useLayoutEffect(() => {
    if (item != null) {
      navigation.setOptions({
        title: item.categoryLabel,
      });
    }
  }, [navigation, item]);

  /* -------------------------------------------------------------------------- */
  /*                             IMPORTANT FIX                                  */
  /* -------------------------------------------------------------------------- */
  /* Hooks MUST stay above conditional returns                                  */
  /* -------------------------------------------------------------------------- */

  const highlights = useMemo((): readonly {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
  }[] => {
    if (item == null) {
      return [];
    }

    return [
      {
        id: 'timeline',
        icon: 'time-outline',
        title: item.headerRight,
        subtitle: 'Typical turnaround',
      },
      {
        id: 'support',
        icon: 'headset-outline',
        title: 'Expert support',
        subtitle: 'Guided by verified consultants',
      },
      {
        id: 'updates',
        icon: 'notifications-outline',
        title: 'Milestone updates',
        subtitle: 'Stay informed at each step',
      },
      {
        id: 'docs',
        icon: 'document-text-outline',
        title: 'Document checklist',
        subtitle: 'Templates + review included',
      },
    ];
  }, [item]);

  /* -------------------------------------------------------------------------- */
  /*                             CONDITIONAL RETURN                             */
  /* -------------------------------------------------------------------------- */

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

  return (
    <SafeAreaWrapper edges={['bottom']}>
      <ScreenWrapper style={styles.flex}>
        <ScrollWrapper
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* -------------------------------------------------------------------------- */}
          {/*                                   HERO                                     */}
          {/* -------------------------------------------------------------------------- */}

          <View style={styles.heroWrap}>
            <LinearGradient
              colors={[
                THEME.colors.chooseAccountConsultantGrad1,
                THEME.colors.chooseAccountConsultantGrad2,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroBg}
            >
              <View pointerEvents="none" style={styles.heroDecor}>
                <View style={styles.heroGlowA} />
                <View style={styles.heroGlowB} />
                <View style={styles.heroGlowC} />
              </View>

              {/* ------------------------------- TOP ROW ------------------------------ */}

              <View style={styles.heroTopRow}>
                <View style={styles.badgesRow}>
                  <View style={styles.pillLight}>
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color={THEME.colors.textPrimary}
                    />

                    <Text style={styles.pillLightText} numberOfLines={1}>
                      {item.headerRight}
                    </Text>
                  </View>
                   
                  {item.badgeLabel ? (
                    <View style={styles.dealChip}>
                      <Ionicons
                        name="sparkles-outline"
                        size={14}
                        color={THEME.colors.white}
                      />

                      <Text
                        style={styles.dealChipText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.badgeLabel}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>

              {/* ------------------------------ CONTENT ------------------------------ */}

              <Text style={styles.heroTitle}>{item.title}</Text>

              <Text style={styles.heroSummary}>{item.summary}</Text>

              {/* ----------------------------- TRUST ROW ----------------------------- */}

              <View style={styles.trustRow}>
                <View style={styles.trustItem}>
                  <Ionicons name="star" size={14} color="#FFD166" />

                  <Text style={styles.trustText}>4.8</Text>

                  <Text style={styles.trustTextMuted}>(1.2k)</Text>
                </View>

                <View style={styles.trustDot} />

                <View style={styles.trustItem}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={14}
                    color={THEME.colors.white}
                  />

                  <Text style={styles.trustText}>Verified experts</Text>
                </View>
              </View>

              {/* ------------------------------- CARD -------------------------------- */}

              <View style={styles.heroCard}>
                <View style={styles.heroCardLeft}>
                  <Text style={styles.priceLabel}>
                    {item.priceLabel ?? '—'}
                  </Text>

                  <Text style={styles.subLabel}>
                    Ex GST • Government Fee As per the State Fees
                  </Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Get started with ${item.title}`}
                  hitSlop={8}
                  onPress={() => console.log('Get started', item.slug)}
                  style={({ pressed }) => [
                    styles.heroCta,
                    pressed ? styles.heroCtaPressed : null,
                  ]}
                >
                  <Text style={styles.heroCtaText}>Get started</Text>

                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={THEME.colors.white}
                  />
                </Pressable>
              </View>

              {/* --------------------------- QUICK ACTIONS --------------------------- */}

              <View style={styles.quickActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Document checklist"
                  hitSlop={8}
                  onPress={() => console.log('Checklist', item.slug)}
                  style={({ pressed }) => [
                    styles.quickBtn,
                    pressed ? styles.quickPressed : null,
                  ]}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={16}
                    color={THEME.colors.white}
                  />

                  <Text style={styles.quickBtnText}>Checklist</Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Talk to an expert"
                  hitSlop={8}
                  onPress={() => console.log('Talk to expert', item.slug)}
                  style={({ pressed }) => [
                    styles.quickBtn,
                    pressed ? styles.quickPressed : null,
                  ]}
                >
                  <Ionicons
                    name="call-outline"
                    size={16}
                    color={THEME.colors.white}
                  />

                  <Text style={styles.quickBtnText}>Talk to expert</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </View>

          {/* -------------------------------------------------------------------------- */}
          {/*                               HIGHLIGHTS                                   */}
          {/* -------------------------------------------------------------------------- */}

          <View style={styles.highlights}>
            <View style={styles.highlightsHeader}>
              <Text style={styles.highlightsTitle}>Service highlights</Text>
            </View>

            <View style={styles.highlightsList}>
              {highlights.map(h => (
                <View key={h.id} style={styles.highlightRow}>
                  <View style={styles.highlightIcon}>
                    <Ionicons
                      name={h.icon as never}
                      size={18}
                      color={THEME.colors.accentAmber}
                    />
                  </View>

                  <View style={styles.highlightText}>
                    <Text style={styles.highlightTitle}>{h.title}</Text>

                    <Text style={styles.highlightSubtitle}>{h.subtitle}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* -------------------------------------------------------------------------- */}
          {/*                                   TABS                                     */}
          {/* -------------------------------------------------------------------------- */}

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
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'overview' ? styles.tabTextActive : null,
                ]}
              >
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
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'included' ? styles.tabTextActive : null,
                ]}
              >
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
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'how' ? styles.tabTextActive : null,
                ]}
              >
                How it works
              </Text>
            </Pressable>
          </View>

          {/* -------------------------------------------------------------------------- */}
          {/*                                  CONTENT                                   */}
          {/* -------------------------------------------------------------------------- */}

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
                {extras.included.map(line => (
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
                {extras.howItWorks.map(line => (
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
