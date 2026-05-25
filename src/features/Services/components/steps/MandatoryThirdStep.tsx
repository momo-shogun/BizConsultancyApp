import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { THEME } from '@/constants/theme';
import { useOnboardingFormContext } from '../../context/OnboardingFormContext';
import { formatInr } from '../../utils/onboarding/onboardingPricing';

interface PriceLineItem {
  id: string;
  label: string;
  value: string;
}

function PriceLineRow({ item }: { item: PriceLineItem }): React.ReactElement {
  return (
    <View style={styles.lineRow}>
      <Text style={styles.lineLabel} numberOfLines={1}>
        {item.label}
      </Text>
      <Text style={styles.lineValue}>{item.value}</Text>
    </View>
  );
}

export function MandatoryThirdStep(): React.ReactElement {
  const { pricingSummary } = useOnboardingFormContext();

  const lineItems = useMemo((): PriceLineItem[] => {
    if (pricingSummary == null) {
      return [];
    }

    const items: PriceLineItem[] = [];

    if (
      pricingSummary.gstMode === 'excluded' &&
      pricingSummary.gstAmountRupees > 0 &&
      pricingSummary.basePriceRupees > 0
    ) {
      items.push({
        id: 'base',
        label: 'Base price',
        value: formatInr(pricingSummary.basePriceRupees),
      });
      items.push({
        id: 'gst',
        label: `GST (${pricingSummary.gstPercent}%)`,
        value: formatInr(pricingSummary.gstAmountRupees),
      });
    } else if (pricingSummary.gstMode === 'included') {
      items.push({
        id: 'gst-note',
        label: 'Taxes',
        value: 'GST included',
      });
    }

    if (pricingSummary.professionalFeeAmount != null) {
      items.push({
        id: 'prof',
        label: pricingSummary.professionalFeeLabel ?? 'Professional fee',
        value: pricingSummary.professionalFeeAmount,
      });
    }

    if (pricingSummary.governmentFeeAmount != null) {
      items.push({
        id: 'gov',
        label: pricingSummary.governmentFeeLabel ?? 'Government fee',
        value: pricingSummary.governmentFeeAmount,
      });
    }

    return items;
  }, [pricingSummary]);

  if (pricingSummary == null) {
    return (
      <View style={styles.container}>
        <Text style={styles.headline}>Review & confirm</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Review & confirm</Text>
      <Text style={styles.serviceName} numberOfLines={1}>
        {pricingSummary.serviceTitle}
      </Text>

      <LinearGradient
        colors={['#0B3B66', '#146E9A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.priceHero}
      >
        <Text style={styles.priceHeroLabel}>Total payable</Text>
        <Text style={styles.priceHeroAmount}>
          {formatInr(pricingSummary.totalPayableRupees)}
        </Text>
      </LinearGradient>

      {lineItems.length > 0 ? (
        <View style={styles.breakdownCard}>
          {lineItems.map((item) => (
            <PriceLineRow key={item.id} item={item} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  headline: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B3258',
  },
  serviceName: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2,
  },
  priceHero: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    overflow: 'hidden',
  },
  priceHeroLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  priceHeroAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  breakdownCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FAFCFE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 2,
  },
  lineLabel: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
  },
  lineValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B3258',
    textAlign: 'right',
  },
});
