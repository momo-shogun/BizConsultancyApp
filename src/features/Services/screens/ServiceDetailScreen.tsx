import React, { useLayoutEffect, useMemo, useState } from 'react';

import { Pressable, Text, View, ScrollView } from 'react-native';

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

import { SERVICE_TABS, type DetailTabKey } from './serviceTabs';

import { useServiceBySlug } from '../hooks/useServiceBySlug';

import { styles } from './ServiceDetailsStyle';
// import { ScrollView } from 'react-native-gesture-handler';

type ServiceDetailRouteProp = RouteProp<
  ServicesStackParamList,
  typeof ROUTES.Services.Detail
>;

export function ServiceDetailScreen(): React.ReactElement {
  const route = useRoute<ServiceDetailRouteProp>();

  const navigation =
    useNavigation<NativeStackNavigationProp<ServicesStackParamList>>();

  const slug = route.params.slug;

  const item = useServiceBySlug(slug);

  const [activeTab, setActiveTab] =
    useState<DetailTabKey>('about');

  useLayoutEffect(() => {
    if (item != null) {
      navigation.setOptions({
        title: item.categoryLabel,
      });
    }
  }, [navigation, item]);

  const visibleTabs = useMemo(() => {
    if (item == null) {
      return [];
    }

    return SERVICE_TABS.filter(tab => {
      const value = item?.[tab.key as keyof typeof item];

      if (value == null) {
        return false;
      }

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      if (typeof value === 'object') {
        return Object.keys(value).length > 0;
      }

      return true;
    });
  }, [item]);

  const highlights = useMemo(() => {
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
    ];
  }, [item]);

  if (item == null) {
    return (
      <SafeAreaWrapper edges={['bottom']}>
        <ScreenWrapper style={styles.missWrap}>
          <EmptyState
            title="Service not found"
            description="This service may have been removed."
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
          <View style={styles.heroWrap}>
            {/* <LinearGradient
              colors={[
                THEME.colors.chooseAccountConsultantGrad1,
                THEME.colors.chooseAccountConsultantGrad2,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroBg}
            >
              <Text style={styles.heroTitle}>
                {item.title}
              </Text>

              <Text style={styles.heroSummary}>
                {item.summary}
              </Text>

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
            </LinearGradient> */}

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
            </LinearGradient> ̰
          </View>




          






          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabs}
            >
              {visibleTabs.map(tab => (
                <Pressable
                  key={tab.key}
                  accessibilityRole="button"
                  accessibilityLabel={`${tab.label} tab`}
                  onPress={() => setActiveTab(tab.key)}
                  hitSlop={8}
                  style={({ pressed }) => [
                    styles.tab,
                    activeTab === tab.key
                      ? styles.tabActive
                      : null,
                    pressed ? styles.tabPressed : null,
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.tabText,
                      activeTab === tab.key
                        ? styles.tabTextActive
                        : null,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View> ̰

          {activeTab === 'about' && item.about ? (
            <View style={styles.section}>
              <SectionHeader title="Overview" />

              {item.about.paragraphsSegments?.map(
                (paragraph, index) => (
                  <Text key={index} style={styles.body}>
                    {paragraph.segments
                      ?.map(segment => segment.value)
                      .join(' ')}
                  </Text>
                ),
              )}
            </View>
          ) : null}

          {activeTab === 'ourPackage' &&
            item.ourPackage ? (
            <View style={styles.section}>
              <SectionHeader title="Our Packages" />

              <View style={styles.bulletList}>
                {item.ourPackage.items?.map(pkg => (
                  <View
                    key={pkg.title}
                    style={styles.bulletRow}
                  >
                    <Text style={styles.bulletMark}>
                      {'\u2022'}
                    </Text>

                    <Text style={styles.bulletText}>
                      {pkg.title}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {activeTab === 'process' && item.process ? (
            <View style={styles.section}>
              <SectionHeader title="How it works" />

              <View style={styles.bulletList}>
                {item.process.steps?.map(step => (
                  <View
                    key={step.number}
                    style={styles.bulletRow}
                  >
                    <Text style={styles.bulletMark}>
                      {step.number}.
                    </Text>

                    <Text style={styles.bulletText}>
                      {step.title}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {activeTab === 'documents' &&
            item.documents ? (
            <View style={styles.section}>
              <SectionHeader title="Documents" />

              <View style={styles.bulletList}>
                {item.documents.categories?.flatMap(
                  category =>
                    category.documents.map(doc => (
                      <View
                        key={doc}
                        style={styles.bulletRow}
                      >
                        <Text style={styles.bulletMark}>
                          {'\u2022'}
                        </Text>

                        <Text style={styles.bulletText}>
                          {doc}
                        </Text>
                      </View>
                    )),
                )}
              </View>
            </View>
          ) : null}

          {activeTab === 'benefits' &&
            item.benefits ? (
            <View style={styles.section}>
              <SectionHeader title="Benefits" />

              <View style={styles.bulletList}>
                {item.benefits.items?.map(benefit => (
                  <View
                    key={benefit.title}
                    style={styles.bulletRow}
                  >
                    <Text style={styles.bulletMark}>
                      {'\u2022'}
                    </Text>

                    <Text style={styles.bulletText}>
                      {benefit.title}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {activeTab === 'eligibility' &&
            item.eligibility ? (
            <View style={styles.section}>
              <SectionHeader title="Eligibility" />

              <View style={styles.bulletList}>
                {item.eligibility.items?.map(rule => (
                  <View
                    key={rule.title}
                    style={styles.bulletRow}
                  >
                    <Text style={styles.bulletMark}>
                      {'\u2022'}
                    </Text>

                    <Text style={styles.bulletText}>
                      {rule.title}: {rule.description}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {activeTab === 'compliance' &&
            item.compliance ? (
            <View style={styles.section}>
              <SectionHeader title="Compliance" />

              <View style={styles.bulletList}>
                {item.compliance.items?.map(rule => (
                  <View
                    key={rule}
                    style={styles.bulletRow}
                  >
                    <Text style={styles.bulletMark}>
                      {'\u2022'}
                    </Text>

                    <Text style={styles.bulletText}>
                      {rule}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {activeTab === 'faqs' && item.faqs ? (
            <View style={styles.sectionLast}>
              <SectionHeader title="FAQs" />

              <View style={styles.bulletList}>
                {item.faqs.faqs?.map(faq => (
                  <View
                    key={faq.question}
                    style={styles.bulletRow}
                  >
                    <Text style={styles.bulletMark}>
                      {'\u2022'}
                    </Text>

                    <Text style={styles.bulletText}>
                      {faq.question}
                    </Text>
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