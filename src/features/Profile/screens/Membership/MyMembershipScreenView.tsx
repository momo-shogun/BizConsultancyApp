import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  ACCOUNT_HUB_GREEN_HEADER_GRADIENT,
  ACCOUNT_HUB_GREEN_HEADER_STATUS_BAR,
  ACCOUNT_HUB_LIST_CANVAS,
} from '@/constants/accountScreenTheme';
import { THEME } from '@/constants/theme';
import {
  useMyMembershipScreen,
  type MembershipServiceItem,
  type MyMembershipCardModel,
  type UseMyMembershipScreenOptions,
} from '@/features/Profile/hooks/useUserMyMembershipScreen';
import { AccountHubScreenShell, ScreenWrapper } from '@/shared/components';

import styles from '../User/UsermembershipCard.styles';

export interface MyMembershipScreenViewProps extends UseMyMembershipScreenOptions {
  emptySubtitle?: string;
}

function ActiveBadge(): React.ReactElement {
  return (
    <View style={styles.activeBadge}>
      <View style={styles.activeDot} />
      <Text style={styles.activeBadgeText}>ACTIVE</Text>
    </View>
  );
}

type MembershipInfoCardProps = Pick<
  MyMembershipCardModel,
  | 'planName'
  | 'planSubtitle'
  | 'amount'
  | 'validity'
  | 'startDate'
  | 'expiryDate'
  | 'progressPercent'
>;

function MembershipInfoCard({
  planName,
  planSubtitle,
  amount,
  validity,
  startDate,
  expiryDate,
  progressPercent,
}: MembershipInfoCardProps): React.ReactElement {
  const clampedProgress = Math.min(100, Math.max(0, progressPercent));

  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={styles.starIconWrapper}>
          <Text style={styles.starIcon}>☆</Text>
        </View>
        <ActiveBadge />
      </View>

      <Text style={styles.planName}>{planName}</Text>
      <Text style={styles.planSubtitle}>{planSubtitle}</Text>

      <View style={styles.infoGrid}>
        <View style={styles.infoCell}>
          <Text style={styles.infoLabel}>Amount</Text>
          <Text style={styles.infoValue}>{amount}</Text>
        </View>
        <View style={styles.infoCell}>
          <Text style={styles.infoLabel}>Validity</Text>
          <Text style={styles.infoValue}>{validity}</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCell}>
          <Text style={styles.infoLabel}>Start</Text>
          <Text style={styles.infoValue}>{startDate}</Text>
        </View>
        <View style={styles.infoCell}>
          <Text style={styles.infoLabel}>Expiry</Text>
          <Text style={styles.infoValue}>{expiryDate}</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Validity used</Text>
          <Text style={styles.progressElapsed}>{`${Math.round(clampedProgress)}% elapsed`}</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${clampedProgress}%` }]} />
        </View>
      </View>
    </View>
  );
}

function PaymentCard({
  amount,
  status,
}: {
  amount: string;
  status: string;
}): React.ReactElement {
  return (
    <View style={styles.paymentCard}>
      <View style={styles.paymentIconWrapper}>
        <Text style={styles.paymentIcon}>💳</Text>
      </View>
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentLabel}>Payment</Text>
        <Text style={styles.paymentAmount}>{amount}</Text>
      </View>
      <View style={styles.paymentStatusBadge}>
        <Text style={styles.paymentStatusText}>{status}</Text>
      </View>
    </View>
  );
}

interface ServiceItemProps {
  service: MembershipServiceItem;
  requesting: boolean;
  onRequest: (featureId: number) => void;
}

function ServiceItem({ service, requesting, onRequest }: ServiceItemProps): React.ReactElement {
  const isDelivered =
    service.userStatus?.toLowerCase() === 'delivered' ||
    service.userStatus?.toLowerCase() === 'active' ||
    service.userStatus?.toLowerCase() === 'used';
  const canRequest = service.canRequest && !requesting && service.featureId != null;

  return (
    <View style={styles.serviceItem}>
      <View style={styles.serviceIconWrapper}>
        <Text style={styles.serviceIcon}>🕐</Text>
      </View>
      <View style={styles.serviceContent}>
        <Text style={styles.serviceTitle}>{service.title}</Text>
        <Text
          style={[
            styles.serviceStatus,
            !isDelivered ? styles.serviceStatusPending : null,
            isDelivered ? styles.serviceStatusCompleted : null,
          ]}
        >
          {service.statusLabel}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${service.requestLabel} ${service.title}`}
          disabled={!canRequest}
          onPress={() => {
            if (service.featureId != null) {
              onRequest(service.featureId);
            }
          }}
          style={({ pressed }) => [
            styles.requestButton,
            !canRequest ? styles.requestButtonDisabled : null,
            pressed && canRequest ? { opacity: 0.75 } : null,
          ]}
        >
          {requesting ? (
            <ActivityIndicator size="small" color={THEME.colors.primary} />
          ) : (
            <Text
              style={[
                styles.requestButtonText,
                !canRequest ? styles.requestButtonTextDisabled : null,
              ]}
            >
              {service.requestLabel}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

interface MembershipCardProps extends MyMembershipCardModel {
  requestingFeatureId: number | null;
  onRequestService: (featureId: number) => void;
}

function MembershipCard({
  requestingFeatureId,
  onRequestService,
  ...props
}: MembershipCardProps): React.ReactElement {
  return (
    <>
      <MembershipInfoCard
        planName={props.planName}
        planSubtitle={props.planSubtitle}
        amount={props.amount}
        validity={props.validity}
        startDate={props.startDate}
        expiryDate={props.expiryDate}
        progressPercent={props.progressPercent}
      />

      <PaymentCard amount={props.paymentAmount} status={props.paymentStatus} />

      {props.services.length > 0 ? (
        <View style={screenStyles.servicesSection}>
          <Text style={screenStyles.servicesTitle}>Services</Text>
          {props.services.map((service) => (
            <ServiceItem
              key={service.id}
              service={service}
              requesting={requestingFeatureId === service.featureId}
              onRequest={onRequestService}
            />
          ))}
        </View>
      ) : null}
    </>
  );
}

export function MyMembershipScreenView({
  membershipLine,
  emptySubtitle = 'Purchase a membership plan to view your plan details here.',
}: MyMembershipScreenViewProps): React.ReactElement {
  const screen = useMyMembershipScreen({ membershipLine });

  return (
    <AccountHubScreenShell
      title="My Membership"
      canvasColor={ACCOUNT_HUB_LIST_CANVAS}
      headerColor={ACCOUNT_HUB_GREEN_HEADER_STATUS_BAR}
      headerGradientColors={ACCOUNT_HUB_GREEN_HEADER_GRADIENT}
      onBackPress={screen.onBackPress}
    >
      <ScreenWrapper style={screenStyles.screen}>
        {screen.isLoading ? (
          <View style={screenStyles.centered}>
            <ActivityIndicator size="large" color={THEME.colors.primary} />
          </View>
        ) : !screen.hasVerifiedLogin || screen.cardProps == null ? (
          <View style={screenStyles.centered}>
            <Text style={screenStyles.emptyTitle}>No active membership</Text>
            <Text style={screenStyles.emptyText}>{emptySubtitle}</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={screenStyles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <MembershipCard
              {...screen.cardProps}
              requestingFeatureId={screen.requestingFeatureId}
              onRequestService={(featureId) => void screen.onRequestService(featureId)}
            />
          </ScrollView>
        )}
      </ScreenWrapper>
    </AccountHubScreenShell>
  );
}

const screenStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: ACCOUNT_HUB_LIST_CANVAS,
  },
  scrollContent: {
    padding: THEME.spacing[16],
    paddingBottom: THEME.spacing[32],
    gap: THEME.spacing[12],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing[24],
    gap: THEME.spacing[8],
  },
  emptyTitle: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textPrimary,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  servicesSection: {
    gap: THEME.spacing[12],
  },
  servicesTitle: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing[4],
  },
});
