import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Input } from '@/shared/components';

import { useConsultationOnboarding } from '../../context/ConsultationOnboardingContext';
import type { ConsultationStepComponentProps } from '../../types/consultationOnboarding.types';

export function ContactDetailsStep(_props: ConsultationStepComponentProps): React.ReactElement {
  const { form, setContactField } = useConsultationOnboarding();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your details</Text>
      <Text style={styles.subheading}>
        We will use this information to confirm your consultation booking.
      </Text>

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
});
