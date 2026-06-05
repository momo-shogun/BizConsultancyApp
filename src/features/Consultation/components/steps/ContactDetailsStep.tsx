import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Input } from '@/shared/components';
import { Dropdown } from '@/shared/components/dropdown';

import { useConsultationOnboarding } from '../../context/ConsultationOnboardingContext';
import type { ConsultationStepComponentProps } from '../../types/consultationOnboarding.types';
import type { ConsultationTypeApi } from '../../types/consultantBooking.types';
import { buildConsultationTypeOptions } from '../../utils/consultationBooking';

export function ContactDetailsStep(_props: ConsultationStepComponentProps): React.ReactElement {
  const { form, feeRates, setContactField, setConsultationType } = useConsultationOnboarding();

  const consultationTypeOptions = useMemo(
    () =>
      buildConsultationTypeOptions(feeRates).map((option) => ({
        label: option.label,
        value: option.value,
      })),
    [feeRates],
  );

  const priceLabel =
    form.price > 0
      ? `₹${Math.round(form.price).toLocaleString('en-IN')}/hr`
      : 'Free consultation';

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your details</Text>
      <Text style={styles.subheading}>
        Choose how you want to consult and enter your contact information.
      </Text>

      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>Consultation mode</Text>
        <Dropdown
          anchorMenu
          anchorMenuMode="inline"
          data={consultationTypeOptions}
          labelField="label"
          valueField="value"
          placeholder="Select audio or video call"
          value={form.consultationType}
          onChange={(item) => {
            if (item != null && typeof item.value === 'string') {
              const nextType = item.value as ConsultationTypeApi;
              if (nextType === 'video' || nextType === 'phone') {
                setConsultationType(nextType);
              }
            }
          }}
        />
        <Text style={styles.priceHint}>
          Booking fee: <Text style={styles.priceValue}>{priceLabel}</Text>
        </Text>
      </View>

      <Input
        label="Full name"
        value={form.contact.fullName}
        onChangeText={(value) => setContactField('fullName', value)}
        placeholder="Enter your full name"
        autoCapitalize="words"
        textContentType="name"
        accessibilityLabel="Full name"
      />

      <Input
        label="Email"
        value={form.contact.email}
        onChangeText={(value) => setContactField('email', value)}
        placeholder="Enter your email"
        keyboardType="email-address"
        textContentType="emailAddress"
        accessibilityLabel="Email address"
      />

      <Input
        label="Phone"
        value={form.contact.phone}
        onChangeText={(value) => setContactField('phone', value.replace(/\D/g, '').slice(0, 10))}
        placeholder="10-digit mobile number"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        maxLength={10}
        accessibilityLabel="Phone number"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B3258',
  },
  subheading: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5B6B7E',
    marginBottom: 4,
  },
  fieldBlock: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  priceHint: {
    fontSize: 13,
    color: '#5B6B7E',
  },
  priceValue: {
    fontWeight: '700',
    color: '#0B3258',
  },
});
