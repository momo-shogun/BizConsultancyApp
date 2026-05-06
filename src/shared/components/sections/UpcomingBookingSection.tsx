import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import { Button } from '@/shared/components';

export interface UpcomingBooking {
  dateLabel: string;
  timeLabel: string;
  consultantName: string;
  consultantTitle?: string;
  callType: 'video' | 'audio';
}

export interface UpcomingBookingSectionProps {
  title?: string;
  booking: UpcomingBooking | null;
  onJoinCallPress?: () => void;
  onCardPress?: () => void;
}

export function UpcomingBookingSection(props: UpcomingBookingSectionProps): React.ReactElement {
  const title = props.title ?? 'Upcoming booking';
  const isActionable = props.onJoinCallPress != null;

  const a11yLabel = useMemo(() => {
    if (!props.booking) return `${title}. No upcoming booking.`;
    const who = props.booking.consultantName;
    const when = [props.booking.dateLabel, props.booking.timeLabel].filter(Boolean).join(' ');
    const type = props.booking.callType === 'video' ? 'Video call' : 'Audio call';
    return `${title}. ${type}. ${who}. ${when}.`;
  }, [props.booking, title]);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.headerTitle} accessibilityRole="header">
          {title}
        </Text>
      </View>

      {props.booking ? (
        <Pressable
          accessibilityRole={props.onCardPress != null ? 'button' : 'summary'}
          accessibilityLabel={a11yLabel}
          accessibilityHint={props.onCardPress != null ? 'Opens booking details' : undefined}
          onPress={props.onCardPress}
          disabled={props.onCardPress == null}
          style={({ pressed }) => [styles.card, pressed && props.onCardPress != null ? styles.cardPressed : null]}
        >
          <View style={styles.topAccent} />
          <View style={styles.cardTop}>
            <View style={styles.left}>
              <View style={styles.row}>
                <View style={styles.iconChip}>
                  <Ionicons name="calendar-outline" size={16} color={THEME.colors.primary} />
                </View>
                <View style={styles.when}>
                  <View style={styles.whenTopRow}>
                    <Text style={styles.whenText} numberOfLines={1}>
                      {props.booking.dateLabel}
                    </Text>
                    <View style={styles.callTypePill}>
                      <Ionicons
                        name={props.booking.callType === 'video' ? 'videocam-outline' : 'call-outline'}
                        size={14}
                        color={THEME.colors.primary}
                      />
                      <Text style={styles.callTypeText}>
                        {props.booking.callType === 'video' ? 'Video call' : 'Audio call'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.whenSub} numberOfLines={1}>
                    {props.booking.timeLabel}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.iconChipMuted}>
                  <Ionicons name="person-outline" size={16} color={THEME.colors.textSecondary} />
                </View>
                <View style={styles.who}>
                  <Text style={styles.consultantName} numberOfLines={1}>
                    {props.booking.consultantName}
                  </Text>
                  {props.booking.consultantTitle ? (
                    <Text style={styles.consultantTitle} numberOfLines={1}>
                      {props.booking.consultantTitle}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>

            <View style={styles.right}>
              <View style={styles.statusPill}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Scheduled</Text>
              </View>
            </View>
          </View>

          {isActionable ? (
            <View style={styles.actionsRow}>
              {props.onJoinCallPress ? (
                <Button
                  label="Join call"
                  accessibilityLabel="Join call"
                  onPress={props.onJoinCallPress}
                  style={styles.actionBtn}
                />
              ) : null}
            </View>
          ) : null}
        </Pressable>
      ) : (
        <View style={styles.emptyCard} accessibilityLabel={a11yLabel}>
          <View style={styles.emptyIcon}>
            <Ionicons name="calendar-clear-outline" size={18} color={THEME.colors.textSecondary} />
          </View>
          <View style={styles.emptyTextWrap}>
            <Text style={styles.emptyTitle}>No upcoming booking</Text>
            <Text style={styles.emptySubtitle}>When you book a consultation, it will show up here.</Text>
          </View>
        </View>
      )}
    </View>
  );
}

UpcomingBookingSection.displayName = 'UpcomingBookingSection';

const styles = StyleSheet.create({
  section: {
    marginTop: THEME.spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing[12],
    paddingHorizontal: THEME.spacing[16],
    gap: THEME.spacing[12],
  },
  headerTitle: {
    flex: 1,
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.35,
  },
  card: {
    marginHorizontal: THEME.spacing[16],
    borderRadius: THEME.radius[16],
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingBottom: THEME.spacing[16],
    shadowColor: THEME.colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },
  topAccent: {
    height: 8,
    backgroundColor: THEME.colors.primary,
    opacity: 0.9,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: THEME.spacing[12],
    paddingTop: THEME.spacing[16],
    paddingHorizontal: THEME.spacing[16],
  },
  left: {
    flex: 1,
    minWidth: 0,
    gap: THEME.spacing[12],
  },
  right: {
    flexShrink: 0,
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[12],
  },
  iconChip: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 81, 50, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconChipMuted: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  when: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  whenTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: THEME.spacing[8],
  },
  whenText: {
    color: THEME.colors.textPrimary,
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    letterSpacing: -0.25,
    flex: 1,
  },
  callTypePill: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(15, 81, 50, 0.10)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15, 81, 50, 0.20)',
  },
  callTypeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: THEME.colors.primary,
  },
  whenSub: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    lineHeight: 18,
  },
  who: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  consultantName: {
    color: THEME.colors.textPrimary,
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
  },
  consultantTitle: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(46, 189, 133, 0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(46, 189, 133, 0.24)',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: THEME.colors.success,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: '#047857',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing[12],
    marginTop: THEME.spacing[16],
    paddingHorizontal: THEME.spacing[16],
  },
  actionBtn: {
    flex: 1,
    minWidth: 180,
  },
  emptyCard: {
    marginHorizontal: THEME.spacing[16],
    borderRadius: THEME.radius[16],
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: THEME.spacing[16],
    flexDirection: 'row',
    gap: THEME.spacing[12],
    alignItems: 'center',
  },
  emptyIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTextWrap: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  emptyTitle: {
    color: THEME.colors.textPrimary,
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.semibold as '600',
  },
  emptySubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    lineHeight: 18,
  },
});

