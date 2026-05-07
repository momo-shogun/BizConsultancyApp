import React, { useLayoutEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { ServicesStackParamList } from '@/navigation/types';
import {
  EmptyState,
  RecommendedServiceCard,
  SafeAreaWrapper,
  ScreenWrapper,
  ScrollWrapper,
  SectionHeader,
} from '@/shared/components';

import { getServiceDetailExtras } from '../data/demoServices';
import { useServiceBySlug } from '../hooks/useServiceBySlug';

type ServiceDetailRouteProp = RouteProp<ServicesStackParamList, typeof ROUTES.Services.Detail>;

export function ServiceDetailScreen(): React.ReactElement {
  const route = useRoute<ServiceDetailRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<ServicesStackParamList>>();
  const slug = route.params.slug;
  const item = useServiceBySlug(slug);
  const extras = useMemo(() => getServiceDetailExtras(slug), [slug]);

  useLayoutEffect(() => {
    if (item != null) {
      navigation.setOptions({ title: item.title });
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

  return (
    <SafeAreaWrapper edges={['bottom']}>
      <ScreenWrapper style={styles.flex}>
        <ScrollWrapper contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <RecommendedServiceCard
            item={item}
            cardWidth="100%"
            fullWidth
            onPress={undefined}
            onCtaPress={() => {
              console.log('Get started', item.slug);
            }}
          />

          <View style={styles.section}>
            <SectionHeader title="Overview" />
            <Text style={styles.body}>{extras.overview}</Text>
          </View>

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
  section: {
    gap: THEME.spacing[8],
  },
  sectionLast: {
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
