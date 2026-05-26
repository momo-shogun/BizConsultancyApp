import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type {
  ConsultantBookingsFilter,
  ConsultantSelfBooking,
} from '@/features/Bookings/types/consultantSelfBooking.types';
import { formatBookingDate } from '@/features/Bookings/utils/bookingDateTime';
import {
  canConsultantStartCall,
  formatConsultationTypeLabel,
  getConsultantBookingPaymentLabel,
  getCustomerInitial,
} from '@/features/Bookings/utils/consultantSelfBookingDisplay';
import { getBookingStatusTone } from '@/features/Bookings/utils/bookingDisplay';
import { THEME } from '@/constants/theme';

import { styles } from './ConsultantBookingCard.styles';

export interface ConsultantBookingCardProps {
  booking: ConsultantSelfBooking;
  filter: ConsultantBookingsFilter;
  isLast: boolean;
  isCalling: boolean;
  onViewProfile: () => void;
  onStartCall: () => void;
}

function StatusBadge(props: { status: string }): React.ReactElement {
  const tone = getBookingStatusTone(props.status);
  const toneStyle =
    tone === 'pending'
      ? styles.statusPending
      : tone === 'confirmed'
        ? styles.statusConfirmed
        : tone === 'completed'
          ? styles.statusCompleted
          : tone === 'cancelled'
            ? styles.statusCancelled
            : styles.statusDefault;
  const textStyle =
    tone === 'pending'
      ? styles.statusPendingText
      : tone === 'confirmed'
        ? styles.statusConfirmedText
        : tone === 'completed'
          ? styles.statusCompletedText
          : tone === 'cancelled'
            ? styles.statusCancelledText
            : styles.statusDefaultText;

  return (
    <View style={[styles.statusBadge, toneStyle]}>
      <Text style={[styles.statusText, textStyle]}>{props.status}</Text>
    </View>
  );
}

export function ConsultantBookingCard({
  booking,
  filter,
  isLast,
  isCalling,
  onViewProfile,
  onStartCall,
}: ConsultantBookingCardProps): React.ReactElement {
  const isVideo = booking.consultationType.toLowerCase() === 'video';
  const canCall = canConsultantStartCall(booking, filter);
  const amountLabel =
    booking.amount != null && booking.amount > 0
      ? `₹${booking.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : 'Free';

  return (
    <View style={[styles.card, isLast ? styles.cardLast : null]}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getCustomerInitial(booking.name)}</Text>
        </View>
        <View style={styles.main}>
          <View style={styles.titleRow}>
            <Text style={styles.customerName} numberOfLines={1}>
              {booking.name}
            </Text>
            <StatusBadge status={booking.status} />
          </View>
          <Text style={styles.amount}>{amountLabel}</Text>
        </View>
      </View>

      <View style={styles.metaBlock}>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={14} color="#94A3B8" />
          <Text style={styles.metaText}>
            {formatBookingDate(booking.bookingDate)} · {booking.slotTime}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons
            name={isVideo ? 'videocam-outline' : 'call-outline'}
            size={14}
            color="#94A3B8"
          />
          <Text style={styles.metaText}>
            {formatConsultationTypeLabel(booking.consultationType)} ·{' '}
            {getConsultantBookingPaymentLabel(booking)}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={onViewProfile}
          style={({ pressed }) => [styles.profileBtn, pressed ? { opacity: 0.88 } : null]}
        >
          <Text style={styles.profileBtnText}>View profile</Text>
        </Pressable>

        {filter === 'upcoming' ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isVideo ? 'Start video call' : 'Start phone call'}
            disabled={!canCall || isCalling}
            onPress={onStartCall}
            style={({ pressed }) => [
              styles.callBtn,
              !canCall ? styles.callBtnDisabled : null,
              pressed && canCall ? { opacity: 0.9 } : null,
            ]}
          >
            {isCalling ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons
                  name={isVideo ? 'videocam' : 'call'}
                  size={16}
                  color={canCall ? '#FFFFFF' : '#94A3B8'}
                />
                <Text style={[styles.callBtnText, !canCall ? styles.callBtnTextDisabled : null]}>
                  {isVideo ? 'Video' : 'Call'}
                </Text>
              </>
            )}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
