import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { selectDisplayName } from '@/features/Auth/store/authSelectors';
import {
  useGetMyWorkshopBookingsQuery,
  type WorkshopBookingItem,
} from '@/features/Home/api/workshopBookingsApi';
import {
  canJoinWorkshop,
  canViewCertificate,
  formatWorkshopDisplayDate,
  hasWorkshopPassed,
} from '@/features/WorkshopBookings/utils/workshopBookingDisplay';
import { THEME } from '@/constants/theme';
import { navigationRef } from '@/navigation/navigationContainerRef';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { AccountHubScreenShell } from '@/shared/components';
import { useAppSelector } from '@/store/typedHooks';
import { getApiErrorMessage } from '@/utils/apiError';

import { WORKSHOP_CANVAS, styles } from './WorkshopBookingsScreen.styles';

type Nav = NativeStackNavigationProp<
  AccountStackParamList,
  typeof ROUTES.Account.WorkshopBookings
>;

const PAGE_SIZE = 10;

interface WorkshopCardVisual {
  gradient: readonly [string, string];
  accent: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

function getWorkshopCardVisual(item: WorkshopBookingItem): WorkshopCardVisual {
  const type = (item.workshopType ?? item.type ?? '').toLowerCase();
  if (type.includes('offline') || type.includes('in-person')) {
    return {
      gradient: ['#FBBF24', '#D97706'],
      accent: '#D97706',
      icon: 'people-outline',
    };
  }
  if (type.includes('live')) {
    return {
      gradient: ['#60A5FA', '#2563EB'],
      accent: '#2563EB',
      icon: 'radio-outline',
    };
  }
  return {
    gradient: ['#2DD4BF', '#0D9488'],
    accent: '#0D9488',
    icon: 'school-outline',
  };
}

function getStatusPillStyle(status: string): {
  bg: string;
  border: string;
  text: string;
} {
  const normalized = status.toLowerCase();
  if (normalized.includes('active') || normalized.includes('confirm')) {
    return {
      bg: 'rgba(255,255,255,0.92)',
      border: 'rgba(5,150,105,0.35)',
      text: '#047857',
    };
  }
  if (normalized.includes('cancel')) {
    return {
      bg: 'rgba(255,255,255,0.92)',
      border: 'rgba(220,38,38,0.3)',
      text: '#B91C1C',
    };
  }
  return {
    bg: 'rgba(255,255,255,0.92)',
    border: 'rgba(15,23,42,0.12)',
    text: '#475569',
  };
}

interface CertificateViewModel {
  workshopName: string;
  date: string;
  userName: string;
  certificateNumber: string;
}

interface WorkshopBookingCardProps {
  item: WorkshopBookingItem;
  onViewCertificate: (item: WorkshopBookingItem) => void;
}

function WorkshopBookingCard(props: WorkshopBookingCardProps): React.ReactElement {
  const { item, onViewCertificate } = props;
  const visual = getWorkshopCardVisual(item);
  const passed = hasWorkshopPassed(item);
  const joinAvailable = canJoinWorkshop(item);
  const certificateAvailable = canViewCertificate(item);
  const statusLabel = item.bookingStatus || 'active';
  const statusStyle = getStatusPillStyle(statusLabel);

  const openUrl = useCallback((url: string): void => {
    void Linking.openURL(url);
  }, []);

  const displayDate = formatWorkshopDisplayDate(item.workshopDate, item.createdAt);
  const amountLabel = `₹${Number(item.amount || 0).toLocaleString('en-IN')}`;
  const modeLabel = (item.type ?? 'online').toLowerCase();
  const typeLabel = (item.workshopType ?? 'webinar').toLowerCase();

  return (
    <View style={styles.card}>
      <View style={styles.cardHero}>
        <LinearGradient
          colors={[visual.gradient[0], visual.gradient[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardHeroGradient}
        >
          <LinearGradient
            colors={['transparent', 'rgba(15,23,42,0.45)']}
            style={styles.cardHeroOverlay}
          />
          <View style={styles.floatingBadge}>
            <Text style={styles.floatingBadgeText}>Workshop</Text>
          </View>
          <View
            style={[
              styles.statusPill,
              { backgroundColor: statusStyle.bg, borderColor: statusStyle.border },
            ]}
          >
            <Text style={[styles.statusPillText, { color: statusStyle.text }]}>{statusLabel}</Text>
          </View>
          <Ionicons name={visual.icon} size={32} color="#FFFFFF" />
        </LinearGradient>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.workshopName ?? `Workshop #${item.workshopId}`}
        </Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {passed
            ? 'This session has ended. Access recording or certificate when available.'
            : joinAvailable
              ? 'Your seat is confirmed. Join when the session goes live.'
              : 'Scheduled session — join link opens closer to start time.'}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Ionicons name="calendar-outline" size={13} color={visual.accent} />
            <Text style={styles.metaChipText}>{displayDate}</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="globe-outline" size={13} color={visual.accent} />
            <Text style={styles.metaChipText}>{modeLabel}</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="pricetag-outline" size={13} color={visual.accent} />
            <Text style={styles.metaChipText}>{typeLabel}</Text>
          </View>
        </View>
        <View style={styles.amountChip}>
          <Text style={styles.amountText}>Paid {amountLabel}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        {joinAvailable ? (
          <Pressable
            style={[styles.actionPill, styles.actionPillPrimary]}
            onPress={() => openUrl(item.joinUrl as string)}
          >
            <Ionicons name="videocam-outline" size={14} color="#FFFFFF" />
            <Text style={styles.actionPillText}>Join live</Text>
          </Pressable>
        ) : passed ? (
          <View style={[styles.actionPill, styles.actionPillWarning]}>
            <Ionicons name="checkmark-circle-outline" size={14} color="#B45309" />
            <Text style={[styles.actionPillText, styles.actionPillTextWarning]}>Completed</Text>
          </View>
        ) : (
          <View style={[styles.actionPill, styles.actionPillMuted]}>
            <Ionicons name="time-outline" size={14} color="#64748B" />
            <Text style={[styles.actionPillText, styles.actionPillTextDark]}>Join later</Text>
          </View>
        )}

        {/* {recordingAvailable ? (
          <Pressable
            style={[styles.actionPill, styles.actionPillSky]}
            onPress={() => openUrl(item.workshopUrl as string)}
          >
            <Ionicons name="play-circle-outline" size={14} color="#FFFFFF" />
            <Text style={styles.actionPillText}>Recording</Text>
          </Pressable>9
        ) : (
          <View style={[styles.actionPill, styles.actionPillMuted]}>
            <Ionicons name="play-outline" size={14} color="#94A3B8" />
            <Text style={[styles.actionPillText, styles.actionPillTextDark]}>
              {passed ? 'No recording' : 'After event'}
            </Text>
          </View>
        )} */}

        {certificateAvailable ? (
          <Pressable
            style={[styles.actionPill, styles.actionPillPrimary]}
            onPress={() => onViewCertificate(item)}
          >
            <Ionicons name="ribbon-outline" size={14} color="#FFFFFF" />
            <Text style={styles.actionPillText}>Certificate</Text>
          </Pressable>
        ) : (
          <View style={[styles.actionPill, styles.actionPillMuted]}>
            <Ionicons name="document-outline" size={14} color="#94A3B8" />
            <Text style={[styles.actionPillText, styles.actionPillTextDark]}>Cert pending</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export function WorkshopBookingsScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const displayName = useAppSelector(selectDisplayName);
  const { data: bookings = [], isLoading, isError, isFetching, refetch, error } =
    useGetMyWorkshopBookingsQuery();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [certificate, setCertificate] = useState<CertificateViewModel | null>(null);

  const filtered = useMemo((): WorkshopBookingItem[] => {
    const q = search.trim().toLowerCase();
    if (q.length === 0) {
      return bookings;
    }
    return bookings.filter((b) => {
      const workshopName = (b.workshopName ?? '').toLowerCase();
      const paymentType = (b.type ?? '').toLowerCase();
      const paymentId = (b.paymentId ?? b.orderId ?? '').toLowerCase();
      const status = (b.bookingStatus ?? '').toLowerCase();
      const workshopType = (b.workshopType ?? '').toLowerCase();
      return (
        workshopName.includes(q) ||
        paymentType.includes(q) ||
        paymentId.includes(q) ||
        status.includes(q) ||
        workshopType.includes(q)
      );
    });
  }, [bookings, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo((): WorkshopBookingItem[] => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [currentPage, filtered]);

  const browseWorkshops = useCallback((): void => {
    navigationRef.navigate(ROUTES.Root.WorkshopsList);
  }, []);

  const handleViewCertificate = useCallback(
    (item: WorkshopBookingItem): void => {
      setCertificate({
        workshopName: item.workshopName ?? `Workshop #${item.workshopId}`,
        date: formatWorkshopDisplayDate(item.workshopDate, item.createdAt),
        userName: displayName?.trim() || 'Participant',
        certificateNumber: item.certificateNumber ?? '',
      });
    },
    [displayName],
  );

  if (isLoading) {
    return (
      <AccountHubScreenShell
        title="Workshop Bookings"
        onBackPress={() => navigation.goBack()}
        canvasColor={WORKSHOP_CANVAS}
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0D9488" />
        </View>
      </AccountHubScreenShell>
    );
  }

  return (
    <AccountHubScreenShell
      title="Workshop Bookings"
      onBackPress={() => navigation.goBack()}
      canvasColor={WORKSHOP_CANVAS}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor="#0D9488" />
        }
      >
        <LinearGradient
          colors={['#0D9488', '#0F766E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroTop}>
            <View style={styles.heroLeft}>
              <View style={styles.heroIconWrap}>
                <Ionicons name="school-outline" size={22} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.heroTitle}>My workshops</Text>
                <Text style={styles.heroMeta}>
                  {bookings.length} booking{bookings.length === 1 ? '' : 's'} · Join, replay, or
                  download certificates
                </Text>
              </View>
            </View>
            <Pressable style={styles.browseBtn} onPress={browseWorkshops} hitSlop={8}>
              <Text style={styles.browseBtnText}>Browse</Text>
              <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
            </Pressable>
          </View>
        </LinearGradient>

        {bookings.length > 0 ? (
          <>
            <View style={styles.searchWrap}>
              <Ionicons name="search-outline" size={18} color="#64748B" />
              <TextInput
                value={search}
                onChangeText={(text) => {
                  setSearch(text);
                  setPage(1);
                }}
                placeholder="Search workshop, status, payment…"
                placeholderTextColor="#94A3B8"
                style={styles.searchInput}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {search.length > 0 ? (
                <Pressable onPress={() => setSearch('')} hitSlop={8} accessibilityLabel="Clear search">
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </Pressable>
              ) : null}
            </View>
            <Text style={styles.resultsMeta}>
              {filtered.length} workshop{filtered.length === 1 ? '' : 's'} found
            </Text>
          </>
        ) : null}

        {isError ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={18} color={THEME.colors.danger} />
            <Text style={styles.errorText}>
              {getApiErrorMessage(error, 'Unable to load workshop bookings.')}
            </Text>
            <Pressable onPress={refetch} accessibilityRole="button" accessibilityLabel="Retry">
              <Text style={styles.retryLink}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {!isError && filtered.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="calendar-outline" size={26} color="#0D9488" />
            </View>
            <Text style={styles.emptyTitle}>No workshop bookings</Text>
            <Text style={styles.emptyBody}>
              Explore live webinars and expert-led sessions to grow your business skills.
            </Text>
            <Pressable style={styles.primaryBtn} onPress={browseWorkshops}>
              <Text style={styles.primaryBtnText}>Browse workshops</Text>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
            </Pressable>
          </View>
        ) : (
          <View style={styles.cardsList}>
            {paginated.map((item) => (
              <WorkshopBookingCard
                key={item.id}
                item={item}
                onViewCertificate={handleViewCertificate}
              />
            ))}
          </View>
        )}

        {totalPages > 1 ? (
          <View style={styles.pagination}>
            <Pressable
              disabled={currentPage <= 1}
              onPress={() => setPage((p) => Math.max(1, p - 1))}
              style={[styles.pageBtn, currentPage <= 1 ? styles.pageBtnDisabled : null]}
            >
              <Ionicons name="chevron-back" size={18} color={THEME.colors.textPrimary} />
            </Pressable>
            <Text style={styles.pageLabel}>
              Page {currentPage} of {totalPages}
            </Text>
            <Pressable
              disabled={currentPage >= totalPages}
              onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={[styles.pageBtn, currentPage >= totalPages ? styles.pageBtnDisabled : null]}
            >
              <Ionicons name="chevron-forward" size={18} color={THEME.colors.textPrimary} />
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      <Modal
        visible={certificate != null}
        transparent
        animationType="fade"
        onRequestClose={() => setCertificate(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setCertificate(null)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Workshop Certificate</Text>
            {certificate != null ? (
              <View style={styles.certBox}>
                <Text style={styles.certLine}>
                  This is to certify that{' '}
                  <Text style={styles.certHighlight}>{certificate.userName}</Text>
                </Text>
                <Text style={styles.certLine}>
                  attended{' '}
                  <Text style={styles.certHighlight}>{certificate.workshopName}</Text>
                </Text>
                <Text style={styles.certLine}>
                  on <Text style={styles.certHighlight}>{certificate.date}</Text>
                </Text>
                {certificate.certificateNumber.length > 0 ? (
                  <Text style={styles.certNumber}>No. {certificate.certificateNumber}</Text>
                ) : null}
              </View>
            ) : null}
            <Pressable style={styles.modalCloseBtn} onPress={() => setCertificate(null)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </AccountHubScreenShell>
  );
}
