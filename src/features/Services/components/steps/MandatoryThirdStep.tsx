import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useOnboardingFormContext } from '../../context/OnboardingFormContext';
import { formatInr } from '../../utils/onboarding/onboardingPricing';

export function MandatoryThirdStep(): React.ReactElement {
  const { pricingSummary } = useOnboardingFormContext();

  if (pricingSummary == null) {
    return (
      <View style={styles.container}>
        <Text style={styles.callout}>Mandatory review</Text>
        <Text style={styles.title}>Review, confirm, and submit</Text>
        <Text style={styles.description}>
          Review your selections and confirm to complete registration.
        </Text>
      </View>
    );
  }

  const bullets: string[] = [
    `Service: ${pricingSummary.serviceTitle}`,
    `Total payable: ${formatInr(pricingSummary.totalPayableRupees)}`,
  ];

  if (pricingSummary.gstMode === 'excluded' && pricingSummary.gstAmountRupees > 0) {
    bullets.push(
      `GST (${pricingSummary.gstPercent}%): ${formatInr(pricingSummary.gstAmountRupees)}`,
    );
  }

  if (pricingSummary.professionalFeeAmount != null) {
    bullets.push(
      `${pricingSummary.professionalFeeLabel ?? 'Professional fee'}: ${pricingSummary.professionalFeeAmount}`,
    );
  }

  if (pricingSummary.governmentFeeAmount != null) {
    bullets.push(
      `${pricingSummary.governmentFeeLabel ?? 'Government fee'}: ${pricingSummary.governmentFeeAmount}`,
    );
  }

  if (pricingSummary.amountInPaise < 100) {
    bullets.push('No online payment required for this plan.');
  } else {
    bullets.push('Secure payment via Razorpay or wallet on finish.');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.callout}>Mandatory review</Text>
      <Text style={styles.title}>Review, confirm, and submit</Text>
      <Text style={styles.description}>
        Confirm pricing for {pricingSummary.serviceTitle} before completing your
        registration.
      </Text>

      <View style={styles.summaryList}>
        {bullets.map((line) => (
          <Text key={line} style={styles.bullet}>
            • {line}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  callout: {
    textTransform: 'uppercase',
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B3258',
  },
  description: {
    fontSize: 14,
    color: '#546778',
    lineHeight: 20,
  },
  summaryList: {
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F4F8FC',
    borderWidth: 1,
    borderColor: '#D7E7F5',
  },
  bullet: {
    fontSize: 14,
    color: '#0B3258',
    lineHeight: 20,
  },
});
