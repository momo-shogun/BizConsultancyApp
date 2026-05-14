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
  ScreenHeader,
  ScreenWrapper,
  ScrollWrapper,
  SectionHeader,
} from '@/shared/components';

import { SERVICE_TABS, type DetailTabKey } from './serviceTabs';

import { useServiceBySlug } from '../hooks/useServiceBySlug';

import { styles } from './ServiceDetailsStyle';
import { OurPackageSection } from './components/Ourpackagesection';
import { AboutSection } from './components/aboutSection/aboutSection';
import { EligibilitySection } from './components/eiligibility/EligibilitySection';
import DocumentCategories from './components/documentChecklist/DocumentCategories';
import BenefitsSection from './components/BenefitsSection/BenefitsSection';
import IdealForSection from './components/idealFor/IdealForSection';
import ComplianceSection from './components/compliance/ComplianceSection';
import FAQSection from './components/faq/faq';
import RecommendedServicesSection from './components/RecommendedServicesSection/RecommendedServicesSection';

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

  const handlePressService = (service: { href: string; title: string; description: string; servicePageId: number }): void => {
    console.log('Pressed recommended service:', service.href);
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
          </View>

          {activeTab === 'about' && item.about ? (
            <AboutSection
              title="Why businesses choose our consulting services"
              titleSegments={[
                'Why businesses choose ',
                {
                  text: 'our consulting',
                  color: 'blue',
                },
                ' services',
              ]}
              intro={[
                'We help startups and enterprises build ',
                {
                  text: 'scalable systems',
                  color: 'emerald',
                },
                ' with modern operational workflows.',
              ]}
              paragraphs={[
                [
                  'Our team focuses on ',
                  {
                    text: 'growth strategy',
                    color: 'orange',
                  },
                  ', execution, and long-term business sustainability.',
                ],
                'From onboarding to scaling, we create systems that reduce friction and improve efficiency.',
              ]}
              tagline={[
                'Built for ambitious founders who want ',
                {
                  text: 'real business momentum',
                  color: 'emerald',
                },
                '.',
              ]}
            />
          ) : null}

          {activeTab === 'ourPackage' && item.ourPackage ? (
            <OurPackageSection ourPackage={item.ourPackage} />
          ) : null}

          {activeTab === 'process' && item?.eligibility ? (
            <EligibilitySection item={item.eligibility} activeTab={activeTab} />
          ) : null}

          {activeTab === 'documents' &&
            item.documents ? (
            <DocumentCategories
              documents={item.documents}
            />
          ) : null}

          {activeTab === 'benefits' &&
            item.benefits ? (
            <BenefitsSection benefits={item.benefits} />
          ) : null}

          {activeTab === 'idealFor' &&
            item.idealFor ? (
            <IdealForSection idealFor={item.idealFor} />
          ) : null}

          {activeTab === 'compliance' &&
            item.compliance ? (
            <ComplianceSection compliance={item.compliance} />
          ) : null}

          {activeTab === 'faqs' && item.faqs ? (
            <FAQSection faqs={item.faqs} />
          ) : null}

          <RecommendedServicesSection
            recommendedServices={item.recommendedServices}
            onPressService={handlePressService}
          />

        </ScrollWrapper>

      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}