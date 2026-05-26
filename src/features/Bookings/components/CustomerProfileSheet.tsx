import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { ConsultantSelfBooking } from '@/features/Bookings/types/consultantSelfBooking.types';
import { THEME } from '@/constants/theme';

export interface CustomerProfileSheetProps {
  booking: ConsultantSelfBooking | null;
  visible: boolean;
  onClose: () => void;
}

function ProfileField(props: { label: string; value: string }): React.ReactElement {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{props.label}</Text>
      <Text style={styles.fieldValue}>{props.value}</Text>
    </View>
  );
}

export function CustomerProfileSheet({
  booking,
  visible,
  onClose,
}: CustomerProfileSheetProps): React.ReactElement {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Customer profile</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={22} color="#64748B" />
          </Pressable>
        </View>
        <Text style={styles.subtitle}>Details for this booking.</Text>

        {booking != null ? (
          <View style={styles.body}>
            <ProfileField label="Name" value={booking.name || '—'} />
            <ProfileField label="Email" value={booking.email || '—'} />
            <ProfileField label="Phone" value={booking.phone || '—'} />
            {booking.notes != null && booking.notes.trim().length > 0 ? (
              <ProfileField label="Notes" value={booking.notes} />
            ) : null}
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
  },
  sheet: {
    backgroundColor: THEME.colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: THEME.spacing[20],
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[28],
    maxHeight: '70%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: THEME.spacing[12],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing[4],
  },
  title: {
    fontSize: THEME.typography.size[18],
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: THEME.typography.size[12],
    color: '#64748B',
    marginBottom: THEME.spacing[16],
  },
  body: {
    gap: THEME.spacing[14],
  },
  field: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: THEME.typography.size[12],
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  fieldValue: {
    fontSize: THEME.typography.size[16],
    color: THEME.colors.textPrimary,
    fontWeight: '500',
    lineHeight: 22,
  },
});
