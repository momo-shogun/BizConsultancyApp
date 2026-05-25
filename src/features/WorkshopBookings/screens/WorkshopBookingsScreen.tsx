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
  canOpenWorkshopRecording,
  canViewCertificate,
  formatWorkshopDisplayDate,
  hasWorkshopPassed,
} from '@/features/WorkshopBookings/utils/workshopBookingDisplay';
import { navigationRef } from '@/navigation/navigationContainerRef';
import { ROUTES } from '@/navigation/routeNames';
import type { AccountStackParamList } from '@/navigation/types';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import { useAppSelector } from '@/store/typedHooks';
import { getApiErrorMessage } from '@/utils/apiError';

import { WORKSHOP_CANVAS, styles } from './WorkshopBookingsScreen.styles';

type Nav = NativeStackNavigationProp<
  AccountStackParamList,
  typeof ROUTES.Account.WorkshopBookings
>;

const PAGE_SIZE = 10;

interface CertificateViewModel {
  workshopName: string;
  date: string;
  userName: string;
  certificateNumber: string;
}

interface WorkshopRowProps {
  item: WorkshopBookingItem;
  isLast: boolean;
  onViewCertificate: (item: WorkshopBookingItem) => void;
}

function WorkshopRow(props: WorkshopRowProps): React.ReactElement {
  const { item, isLast, onViewCertificate } = props;
  const passed = hasWorkshopPassed(item);
  const joinAvailable = canJoinWorkshop(item);
  const recordingAvailable = canOpenWorkshopRecording(item);
  const certificateAvailable = canViewCertificate(item);

  const openUrl = useCallback((url: string): void => {
    void Linking.openURL(url);
  }, []);

  return (
    <View style={[styles.workshopRow, isLast ? styles.workshopRowLast : null]}>
      <Text style={styles.workshopTitle} numberOfLines={2}>
        {item.workshopName ?? `Workshop #${item.workshopId}`}
      </Text>

      <View style={styles.metaTags}>
        <View style={styles.metaTag}>
          <Text style={styles.metaTagText}>{item.bookingStatus || 'active'}</Text>
        </View>
        <View style={styles.metaTag}>
          <Text style={styles.metaTagText}>{(item.workshopType ?? 'webinar').toLowerCase()}</Text>
        </View>
        <View style={styles.metaTag}>
          <Text style={styles.metaTagText}>{(item.type ?? 'online').toLowerCase()}</Text>
        </View>
      </View>

      <Text style={styles.metaLine}>
        {formatWorkshopDisplayDate(item.workshopDate, item.createdAt)} · ₹
        {Number(item.amount || 0).toLocaleString('en-IN')}
      </Text>

      <View style={styles.actionsRow}>
        {joinAvailable ? (
          <Pressable
            style={[styles.actionBtn, styles.actionBtnPrimary]}
            onPress={() => openUrl(item.joinUrl as string)}
          >
            <Text style={styles.actionBtnText}>Join</Text>
          </Pressable>
        ) : passed ? (
          <View style={[styles.actionBtn, styles.actionBtnWarning]}>
            <Text style={styles.actionBtnTextWarning}>Completed</Text>
          </View>
        ) : (
          <View style={[styles.actionBtn, styles.actionBtnMuted]}>
            <Text style={styles.actionBtnTextMuted}>Join later</Text>
          </View>
        )}

        {recordingAvailable ? (
          <Pressable
            style={[styles.actionBtn, styles.actionBtnSky]}
            onPress={() => openUrl(item.workshopUrl as string)}
          >
            <Text style={styles.actionBtnText}>Recording</Text>
          </Pressable>
        ) : (
          <View style={[styles.actionBtn, styles.actionBtnMuted]}>
            <Text style={styles.actionBtnTextMuted}>
              {passed ? 'No recording' : 'After event'}
            </Text>
          </View>
        )}

        {certificateAvailable ? (
          <Pressable
            style={[styles.actionBtn, styles.actionBtnPrimary]}
            onPress={() => onViewCertificate(item)}
          >
            <Text style={styles.actionBtnText}>Certificate</Text>
          </Pressable>
        ) : (
          <View style={[styles.actionBtn, styles.actionBtnMuted]}>
            <Text style={styles.actionBtnTextMuted}>Cert pending</Text>
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
      <SafeAreaWrapper edges={['top', 'bottom']} bgColor={WORKSHOP_CANVAS}>
        <ScreenHeader title="Workshop Bookings" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0D9488" />
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={WORKSHOP_CANVAS}>
      <ScreenHeader title="Workshop Bookings" onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
          <View style={styles.heroLeft}>
            <Ionicons name="school-outline" size={22} color="#FFFFFF" />
            <View>
              <Text style={styles.heroTitle}>My workshops</Text>
              <Text style={styles.heroMeta}>
                {bookings.length} booking{bookings.length === 1 ? '' : 's'}
              </Text>
            </View>
          </View>
          <Pressable onPress={browseWorkshops} hitSlop={8}>
            <Text style={styles.browseLink}>Browse</Text>
          </Pressable>
        </LinearGradient>

        {bookings.length > 0 ? (
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
          </View>
        ) : null}

        <View style={styles.listBlock}>
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderTitle}>Workshops</Text>
            <Text style={styles.listHeaderMeta}>
              {filtered.length} result{filtered.length === 1 ? '' : 's'}
            </Text>
          </View>

          {isError ? (
            <View style={styles.emptyBlock}>
              <Text style={styles.detailLine}>
                {getApiErrorMessage(error, 'Unable to load workshop bookings.')}
              </Text>
              <Pressable style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={refetch}>
                <Text style={styles.actionBtnText}>Retry</Text>
              </Pressable>
            </View>
          ) : null}

          {!isError && filtered.length === 0 ? (
            <View style={styles.emptyBlock}>
              <Ionicons name="calendar-outline" size={28} color="#0D9488" />
              <Text style={styles.detailLine}>No workshop bookings found.</Text>
              <Pressable
                style={[styles.actionBtn, styles.actionBtnPrimary]}
                onPress={browseWorkshops}
              >
                <Text style={styles.actionBtnText}>Browse workshops</Text>
              </Pressable>
            </View>
          ) : null}

          {!isError &&
            paginated.map((item, index) => (
              <WorkshopRow
                key={item.id}
                item={item}
                isLast={index === paginated.length - 1}
                onViewCertificate={handleViewCertificate}
              />
            ))}
        </View>

        {totalPages > 1 ? (
          <View style={styles.pagination}>
            <Pressable
              disabled={currentPage <= 1}
              onPress={() => setPage((p) => Math.max(1, p - 1))}
              style={[styles.pageBtn, currentPage <= 1 ? styles.pageBtnDisabled : null]}
            >
              <Text style={styles.pageBtnText}>Previous</Text>
            </Pressable>
            <Text style={styles.pageLabel}>
              {currentPage} / {totalPages}
            </Text>
            <Pressable
              disabled={currentPage >= totalPages}
              onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={[styles.pageBtn, currentPage >= totalPages ? styles.pageBtnDisabled : null]}
            >
              <Text style={styles.pageBtnText}>Next</Text>
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
    </SafeAreaWrapper>
  );
}
