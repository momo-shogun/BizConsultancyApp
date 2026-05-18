import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';

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
  ScreenHeader,
  ScreenWrapper,
  ScrollWrapper,
  SectionHeader,
} from '@/shared/components';

import { SERVICE_DETAIL_TABS, type DetailTabKey } from './serviceTabs';

import { useServiceBySlug } from '../hooks/useServiceBySlug';
import { mapAboutToUiProps } from '../utils/serviceAboutUi';

import { styles } from './ServiceDetailsStyle';
import { AboutSection } from './components/aboutSection/aboutSection';
import { EligibilitySection } from './components/eiligibility/EligibilitySection';
import DocumentCategories from './components/documentChecklist/DocumentCategories';
import BenefitsSection from './components/BenefitsSection/BenefitsSection';
import IdealForSection from './components/idealFor/IdealForSection';
import ComplianceSection from './components/compliance/ComplianceSection';
import FAQSection from './components/faq/faq';
import RecommendedServicesSection from './components/RecommendedServicesSection/RecommendedServicesSection';
import { ProcessSection } from './components/process/ProcessSection';

type ServiceDetailRouteProp = RouteProp<
  ServicesStackParamList,
  typeof ROUTES.Services.Detail
>;

export function ServiceDetailScreen(): React.ReactElement {
  const route = useRoute<ServiceDetailRouteProp>();

  const navigation =
    useNavigation<NativeStackNavigationProp<ServicesStackParamList>>();

  const slug = route.params.slug;

  const { service: item, isLoading, isError } = useServiceBySlug(slug);

  const [activeTab, setActiveTab] =
    useState<DetailTabKey>('about');

  const openRelatedService = useCallback(
    (targetSlug: string): void => {
      navigation.navigate(ROUTES.Services.Detail, { slug: targetSlug });
    },
    [navigation],
  );

  useLayoutEffect(() => {
    if (item != null) {
      navigation.setOptions({
        title: item.categoryLabel,
      });
    }
  }, [navigation, item]);

  const aboutUi = useMemo(() => mapAboutToUiProps(item?.about), [item?.about]);

  const tabPanel = useMemo((): React.ReactElement | null => {
    if (item == null) {
      return null;
    }

    switch (activeTab) {
      case 'about':
        return aboutUi != null ? <AboutSection {...aboutUi} /> : null;
      case 'eligibility':
        // Prerequisites tab ← API `eligibility` (badge, title, items, …)
        if (item.eligibility == null || item.eligibility.items.length === 0) {
          return (
            <View style={styles.tabEmptyWrap}>
              <EmptyState
                title="No prerequisites"
                description="Prerequisite details are not available for this service yet."
              />
            </View>
          );
        }
        return <EligibilitySection eligibility={item.eligibility} />;
      case 'process':
        return item.process != null ? <ProcessSection process={item.process} /> : null;
      case 'documents':
        return item.documents != null ? (
          <DocumentCategories documents={item.documents} />
        ) : null;
      case 'benefits':
        return item.benefits != null ? <BenefitsSection benefits={item.benefits} /> : null;
      case 'idealFor':
        return item.idealFor != null ? <IdealForSection idealFor={item.idealFor} /> : null;
      case 'compliance':
        return item.compliance != null ? (
          <ComplianceSection compliance={item.compliance} />
        ) : null;
      case 'faqs':
        return item.faqs != null ? <FAQSection faqs={item.faqs} /> : null;
      default:
        return null;
    }
  }, [activeTab, aboutUi, item]);

  if (isLoading) {
    return (
      <SafeAreaWrapper edges={['bottom']}>
        <ScreenWrapper style={styles.missWrap}>
          <EmptyState title="Loading service" description="Please wait…" />
        </ScreenWrapper>
      </SafeAreaWrapper>
    );
  }

  if (item == null || isError) {
    return (
      <SafeAreaWrapper edges={['bottom']}>
        <ScreenWrapper style={styles.missWrap}>
          <EmptyState
            title="Service not found"
            description="We could not load this service. Check the link or try again."
          />
        </ScreenWrapper>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper edges={['bottom', 'top']}  bgColor='#0F5132' isLight={true}>
      {/* <ScreenHeader title="title" headerColor="#0F5132" onSearchPress={() => {}} /> */}
      <ScreenWrapper style={styles.flex}>
        <ScrollWrapper
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
                  onPress={() => navigation.navigate(ROUTES.Services.Onboarding, { slug: item.slug })}
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

              {(item.hero?.quickActions?.length ?? 0) > 0 ? (
                <View style={styles.quickActions}>
                  {item.hero?.quickActions.map((action) => (
                    <Pressable
                      key={action.text}
                      accessibilityRole="button"
                      accessibilityLabel={action.text}
                      hitSlop={8}
                      onPress={() => {
                        if (action.text.toLowerCase().includes('expert')) {
                          navigation.getParent()?.navigate(ROUTES.Root.ConsultantsList);
                          return;
                        }
                        setActiveTab('documents');
                      }}
                      style={({ pressed }) => [
                        styles.quickBtn,
                        pressed ? styles.quickPressed : null,
                      ]}
                    >
                      <Ionicons
                        name={
                          action.text.toLowerCase().includes('expert')
                            ? 'call-outline'
                            : 'document-text-outline'
                        }
                        size={16}
                        color={THEME.colors.white}
                      />
                      <Text style={styles.quickBtnText}>{action.text}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </LinearGradient>
          </View>

          <View style={styles.tabBarWrap}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabs}
            >
              {SERVICE_DETAIL_TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <Pressable
                    key={tab.key}
                    accessibilityRole="button"
                    accessibilityLabel={`${tab.label} tab`}
                    onPress={() => setActiveTab(tab.key)}
                    hitSlop={8}
                    style={({ pressed }) => [
                      styles.tab,
                      isActive ? styles.tabActive : null,
                      pressed ? styles.tabPressed : null,
                    ]}
                  >
                    {isActive ? <View style={styles.tabActiveIndicator} /> : null}
                    <Text
                      numberOfLines={1}
                      style={[styles.tabText, isActive ? styles.tabTextActive : null]}
                    >
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {tabPanel}

          {item.recommendedServices != null ? (
            <RecommendedServicesSection
              recommendedServices={item.recommendedServices}
              onPressService={(service) => openRelatedService(service.slug)}
            />
          ) : null}

        </ScrollWrapper>

      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}