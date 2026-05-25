import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { MyServicesFilterTab } from '../types/myServices.types';

export interface MyServicesFilterBarProps {
  tabs: Array<{ id: MyServicesFilterTab; label: string }>;
  activeTab: MyServicesFilterTab;
  counts: Record<MyServicesFilterTab, number>;
  onTabChange: (tab: MyServicesFilterTab) => void;
}

export function MyServicesFilterBar({
  tabs,
  activeTab,
  counts,
  onTabChange,
}: MyServicesFilterBarProps): React.ReactElement {
  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {tabs.map((tab) => {
          const selected = tab.id === activeTab;
          const count = counts[tab.id];
          return (
            <Pressable
              key={tab.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onTabChange(tab.id)}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.chipSelected,
                pressed && styles.chipPressed,
              ]}
            >
              <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                {tab.label}
              </Text>
              {count > 0 ? (
                <View style={[styles.count, selected && styles.countSelected]}>
                  <Text style={[styles.countText, selected && styles.countTextSelected]}>
                    {count}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
  },
  row: {
    gap: 8,
    paddingRight: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipSelected: {
    backgroundColor: '#0F5132',
    borderColor: '#0F5132',
  },
  chipPressed: {
    opacity: 0.9,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  chipLabelSelected: {
    color: '#FFFFFF',
  },
  count: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  countSelected: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  countTextSelected: {
    color: '#FFFFFF',
  },
});
