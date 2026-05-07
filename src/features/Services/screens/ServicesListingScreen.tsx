import React, { useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { THEME } from '@/constants/theme';
import { ROUTES } from '@/navigation/routeNames';
import type { ServicesStackParamList } from '@/navigation/types';
import {
  EmptyState,
  RecommendedServiceCard,
  type RecommendedServiceItem,
  SafeAreaWrapper,
  ScreenHeader,
  ScreenWrapper,
  SectionHeader,
} from '@/shared/components';

import { DEMO_SERVICES } from '../data/demoServices';

const LIST_SEPARATOR_HEIGHT = THEME.spacing[12];

export function ServicesListingScreen(): React.ReactElement {
  const navigation = useNavigation<NativeStackNavigationProp<ServicesStackParamList>>();

  const goToDetail = useCallback(
    (slug: string): void => {
      navigation.navigate(ROUTES.Services.Detail, { slug });
    },
    [navigation],
  );

  const renderItem = useCallback<ListRenderItem<RecommendedServiceItem>>(
    ({ item }) => {
      return (
        <RecommendedServiceCard
          item={item}
          cardWidth="100%"
          fullWidth
          onPress={() => {
            goToDetail(item.slug);
          }}
          onCtaPress={() => {
            goToDetail(item.slug);
          }}
        />
      );
    },
    [goToDetail],
  );

  const keyExtractor = useCallback((i: RecommendedServiceItem): string => i.id, []);

  const ItemSeparator = useCallback((): React.ReactElement => {
    return <View style={styles.separator} />;
  }, []);

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader title="Services" onSearchPress={() => {}} />
      <ScreenWrapper>
        <FlatList
          data={DEMO_SERVICES}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <SectionHeader
                title="Browse services"
                subtitle="Pick a service to see scope, pricing, and next steps."
              />
            </View>
          }
          ListEmptyComponent={
            <EmptyState title="No services yet" description="This will be populated from API later." />
          }
        />
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: THEME.spacing[16],
    paddingBottom: THEME.spacing[24],
    flexGrow: 1,
  },
  listHeader: {
    marginBottom: THEME.spacing[12],
  },
  separator: {
    height: LIST_SEPARATOR_HEIGHT,
  },
});
