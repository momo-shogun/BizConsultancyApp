import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';
import { EmptyState, SafeAreaWrapper, ScreenHeader, ScreenWrapper, SectionHeader } from '@/shared/components';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
}

const DATA: ServiceItem[] = [
  { id: 'strategy', title: 'Business Strategy', description: 'Roadmaps, market fit, growth plans.' },
  { id: 'finance', title: 'Finance & Compliance', description: 'Cashflow, tax basics, compliance guidance.' },
  { id: 'marketing', title: 'Marketing', description: 'Positioning, campaigns, content strategy.' },
];

export function ServicesListingScreen(): React.ReactElement {
  const renderItem = useCallback(({ item }: { item: ServiceItem }): React.ReactElement => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>
      </View>
    );
  }, []);

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ScreenHeader title="Services" />
      <ScreenWrapper>
        <FlatList
          data={DATA}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.content}
          renderItem={renderItem}
          ListHeaderComponent={<SectionHeader title="Browse services" subtitle="Pick a category to explore." />}
          ListEmptyComponent={<EmptyState title="No services yet" description="This will be populated from API later." />}
        />
      </ScreenWrapper>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: THEME.spacing[16],
    gap: THEME.spacing[12],
  },
  card: {
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius[16],
    padding: THEME.spacing[16],
    gap: THEME.spacing[8],
  },
  cardTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textPrimary,
  },
  cardDesc: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
  },
});

