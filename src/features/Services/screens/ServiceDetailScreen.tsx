import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { Pressable, Text, View } from 'react-native';

import type { RouteProp } from '@react-navigation/native';

import { useNavigation, useRoute } from '@react-navigation/native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import LinearGradient from 'react-native-linear-gradient';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

import { ROUTES } from '@/navigation/routeNames';
import { navigationRef } from '@/navigation/navigationContainerRef';

import type { ServicesStackParamList } from '@/navigation/types';

import {
  EmptyState,
  SafeAreaWrapper,
  ScreenHeader,
  ScreenWrapper,
  ScrollWrapper,
} from '@/shared/components';
import { PremiumHorizontalTabBar } from '@/shared/components/navigation/PremiumHorizontalTabBar';

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
import { ServiceDetailSkeleton } from './components/ServiceDetailSkeleton';

type ServiceDetailRouteProp = RouteProp<
  ServicesStackParamList,
  typeof ROUTES.Services.Detail
>;

const DOCUMENT_CHECKLIST_LABEL = 'Document Checklist';

type HeroQuickActionDisplay = {
  id: string;
  text: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
};

function isExpertConsultationAction(text: string, href: string): boolean {
  const normalizedText = text.toLowerCase();
  const normalizedHref = href.toLowerCase();
  return (
    normalizedText.includes('expert') ||
    normalizedText.includes('consultant') ||
    normalizedHref.includes('consultant')
  );
}

function isGetStartedAction(text: string, href: string): boolean {
  const normalizedText = text.toLowerCase();
  const normalizedHref = href.toLowerCase();
  return (
    normalizedText.includes('get started') ||
    normalizedText.includes('get-started') ||
    normalizedHref.includes('onboarding')
  );
}

function isDocumentChecklistAction(text: string, href: string): boolean {
  const normalizedText = text.toLowerCase();
  const normalizedHref = href.toLowerCase();
  return (
    normalizedText.includes('document') ||
    normalizedText.includes('checklist') ||
    normalizedHref.includes('document')
  );
}

function buildHeroQuickActions(
  raw: ReadonlyArray<{ text: string; href: string }>,
  openConsultantsList: () => void,
  openDocumentsTab: () => void,
): HeroQuickActionDisplay[] {
  const actions: HeroQuickActionDisplay[] = [];
  let hasDocumentChecklist = false;

  for (const action of raw) {
    if (isGetStartedAction(action.text, action.href)) {
      continue;
    }

    if (isExpertConsultationAction(action.text, action.href)) {
      actions.push({
        id: `expert-${action.text}`,
        text: action.text,
        icon: 'call-outline',
        onPress: openConsultantsList,
      });
      continue;
    }

    if (isDocumentChecklistAction(action.text, action.href)) {
      hasDocumentChecklist = true;
      actions.push({
        id: 'document-checklist',
        text: DOCUMENT_CHECKLIST_LABEL,
        icon: 'document-text-outline',
        onPress: openDocumentsTab,
      });
    }
  }

  if (!hasDocumentChecklist) {
    actions.push({
      id: 'document-checklist',
      text: DOCUMENT_CHECKLIST_LABEL,
      icon: 'document-text-outline',
      onPress: openDocumentsTab,
    });
  }

  return actions;
}

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

  const handleBack = useCallback((): void => {
    navigation.navigate(ROUTES.Services.List);
  }, [navigation]);

  const openConsultantsList = useCallback((): void => {
    if (navigationRef.isReady()) {
      navigationRef.navigate(ROUTES.Root.ConsultantsList, {
        returnTo: 'services-list',
      });
    }
  }, []);

  const openDocumentsTab = useCallback((): void => {
    setActiveTab('documents');
  }, []);

  const heroQuickActions = useMemo((): HeroQuickActionDisplay[] => {
    if (item?.hero?.quickActions == null) {
      return buildHeroQuickActions([], openConsultantsList, openDocumentsTab);
    }
    return buildHeroQuickActions(
      item.hero.quickActions,
      openConsultantsList,
      openDocumentsTab,
    );
  }, [item?.hero?.quickActions, openConsultantsList, openDocumentsTab]);

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
      <SafeAreaWrapper edges={['bottom', 'top']} bgColor="#0F5132" isLight>
        <ScreenWrapper style={styles.flex}>
          <ScrollWrapper
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <ServiceDetailSkeleton />
          </ScrollWrapper>
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
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                    onPress={handleBack}
                    hitSlop={8}
                    style={styles.heroBackButton}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={22}
                      color={THEME.colors.white}
                    />
                  </Pressable>

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

              {heroQuickActions.length > 0 ? (
                <View style={styles.quickActions}>
                  {heroQuickActions.map((action) => (
                    <Pressable
                      key={action.id}
                      accessibilityRole="button"
                      accessibilityLabel={action.text}
                      hitSlop={8}
                      onPress={action.onPress}
                      style={({ pressed }) => [
                        styles.quickBtn,
                        pressed ? styles.quickPressed : null,
                      ]}
                    >
                      <Ionicons
                        name={action.icon}
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

          <PremiumHorizontalTabBar
            tabs={SERVICE_DETAIL_TABS}
            activeKey={activeTab}
            onTabPress={setActiveTab}
            theme="light"
            testID="service-detail-tabs"
          />

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