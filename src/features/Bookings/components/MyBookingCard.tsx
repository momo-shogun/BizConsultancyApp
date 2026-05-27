import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { MyConsultantBooking } from '@/features/Bookings/types/myConsultantBooking.types';
import {
  formatBookingDate,
  hasBookingStarted,
} from '@/features/Bookings/utils/bookingDateTime';
import {
  canShowCallAction,
  getBookingConsultationKind,
  getBookingStatusTone,
  getPaymentLabel,
} from '@/features/Bookings/utils/bookingDisplay';
import {
  formatConsultationTypeLabel,
  getCustomerInitial,
} from '@/features/Bookings/utils/consultantSelfBookingDisplay';

import { styles, WA } from './MyBookingCard.styles';

export interface MyBookingCardProps {
  booking: MyConsultantBooking;
  filter: 'upcoming' | 'past';
  isCalling: boolean;
  onCallPress: () => void;
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

export function MyBookingCard({
  booking,
  filter,
  isCalling,
  onCallPress,
}: MyBookingCardProps): React.ReactElement {
  const showCall = canShowCallAction(booking, filter);
  const consultationKind = getBookingConsultationKind(booking.consultationType);
  const isVideo = consultationKind === 'video';
  const isPhone = consultationKind === 'phone';
  const showConsultationIcon = isVideo || isPhone;
  const slotReady = hasBookingStarted(booking.bookingDate, booking.slotTime);
  const canCall = showCall && slotReady && !isCalling;
  const consultantName = booking.consultantName ?? 'Consultant';
  const amountLabel =
    booking.amount != null && booking.amount > 0
      ? `₹${booking.amount.toLocaleString('en-IN')}`
      : null;

  const callLabel = isCalling
    ? 'Connecting…'
    : isVideo
      ? 'Video call'
      : 'Voice call';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getCustomerInitial(consultantName)}</Text>
          </View>
          {showConsultationIcon ? (
            <View
              style={[
                styles.consultationBadge,
                isVideo ? styles.consultationBadgeVideo : styles.consultationBadgePhone,
              ]}
              accessibilityLabel={isVideo ? 'Video consultation' : 'Phone consultation'}
            >
              <Ionicons
                name={isVideo ? 'videocam' : 'call'}
                size={13}
                color="#FFFFFF"
              />
            </View>
          ) : null}
        </View>

        <View style={styles.main}>
          <View style={styles.titleRow}>
            <Text style={styles.consultantName} numberOfLines={1}>
              {consultantName}
            </Text>
            {amountLabel != null ? <Text style={styles.amount}>{amountLabel}</Text> : null}
          </View>
          <Text style={styles.subtitle} numberOfLines={1}>
            {formatBookingDate(booking.bookingDate)} · {booking.slotTime}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons
              name={isVideo ? 'videocam-outline' : 'call-outline'}
              size={15}
              color={WA.muted}
            />
            <Text style={styles.metaText} numberOfLines={1}>
              {formatConsultationTypeLabel(booking.consultationType)} ·{' '}
              {getPaymentLabel(booking)}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <StatusBadge status={booking.status} />
          </View>
        </View>

        {showCall ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isVideo ? 'Start video call' : 'Start voice call'}
            disabled={!canCall}
            onPress={onCallPress}
            style={({ pressed }) => [
              styles.quickCallBtn,
              !canCall ? styles.quickCallBtnDisabled : null,
              pressed && canCall ? { opacity: 0.9 } : null,
            ]}
          >
            {isCalling ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons
                name={isVideo ? 'videocam' : 'call'}
                size={22}
                color={canCall ? '#FFFFFF' : WA.disabledText}
              />
            )}
          </Pressable>
        ) : null}
      </View>

      {showCall ? (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={callLabel}
            disabled={!canCall}
            onPress={onCallPress}
            style={({ pressed }) => [
              styles.callCta,
              !canCall ? styles.callCtaDisabled : null,
              pressed && canCall ? styles.callCtaPressed : null,
            ]}
          >
            {isCalling ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons
                  name={isVideo ? 'videocam' : 'call'}
                  size={20}
                  color={canCall ? '#FFFFFF' : WA.disabledText}
                />
                <Text style={[styles.callCtaText, !canCall ? styles.callCtaTextDisabled : null]}>
                  {callLabel}
                </Text>
              </>
            )}
          </Pressable>
          {!slotReady ? (
            <Text style={styles.callHint}>
              Call unlocks at {booking.slotTime} on {formatBookingDate(booking.bookingDate)}
            </Text>
          ) : null}
        </>
      ) : null}
    </View>
  );
}
