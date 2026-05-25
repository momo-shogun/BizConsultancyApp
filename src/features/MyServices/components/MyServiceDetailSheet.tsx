import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useGetMyOnboardingSubmissionFullDetailQuery } from '../api/myServicesApi';
import type { MyOnboardingSubmission } from '../types/myServices.types';
import { formatDisplayDate, formatInrAmount } from '../utils/myServicesStatus';
import { MyServiceStatusBadge } from './MyServiceStatusBadge';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const SHEET_MAX_HEIGHT = WINDOW_HEIGHT * 0.88;
/** Space for handle, header, summary, and bottom safe padding. */
const SHEET_CHROME_HEIGHT = 168;
const SCROLL_MAX_HEIGHT = SHEET_MAX_HEIGHT - SHEET_CHROME_HEIGHT;

function formatAnswerValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '—';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'string') {
    return value.trim() || '—';
  }
  if (Array.isArray(value)) {
    return value.map(String).join(', ') || '—';
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

export interface MyServiceDetailSheetProps {
  item: MyOnboardingSubmission | null;
  visible: boolean;
  onClose: () => void;
}

export function MyServiceDetailSheet({
  item,
  visible,
  onClose,
}: MyServiceDetailSheetProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const submissionId = item?.id ?? 0;
  const { data, isLoading, error } = useGetMyOnboardingSubmissionFullDetailQuery(
    submissionId,
    { skip: !visible || submissionId <= 0 },
  );

  const title =
    item?.serviceName || item?.serviceSlug || (item != null ? `Submission #${item.id}` : '');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close details"
          style={styles.backdrop}
          onPress={onClose}
        />

        <View style={[styles.sheet, { maxHeight: SHEET_MAX_HEIGHT, paddingBottom: insets.bottom }]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>{title}</Text>
              {item != null ? <MyServiceStatusBadge status={item.status} /> : null}
            </View>
            <Pressable accessibilityRole="button" onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color="#64748B" />
            </Pressable>
          </View>

          {item != null ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryItem}>{formatInrAmount(item.amount)}</Text>
              <Text style={styles.summaryDot}>·</Text>
              <Text style={styles.summaryItem}>
                {formatDisplayDate(item.transactionDate || item.createdAt)}
              </Text>
            </View>
          ) : null}

          {isLoading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#0B3B66" />
            </View>
          ) : error != null ? (
            <View style={styles.errorWrap}>
              <Text style={styles.error}>Could not load full details.</Text>
            </View>
          ) : (
            <ScrollView
              style={[styles.scroll, { maxHeight: SCROLL_MAX_HEIGHT }]}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator
              bounces
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              {data?.onboarding.rows.length ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Onboarding</Text>
                  {data.onboarding.rows.map((row) => (
                    <View key={`onb-${row.questionId}-${row.order}`} style={styles.qaRow}>
                      <Text style={styles.question}>{row.question}</Text>
                      <Text style={styles.answer}>{formatAnswerValue(row.answer)}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {data?.serviceDetails?.answers.length ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    {data.serviceDetails.formName ?? 'Service details'}
                  </Text>
                  {data.serviceDetails.answers.map((row) => (
                    <View key={`sd-${row.questionId}`} style={styles.qaRow}>
                      <Text style={styles.question}>{row.questionLabel}</Text>
                      <Text style={styles.answer}>{formatAnswerValue(row.value)}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {data?.documents.length ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Documents</Text>
                  {data.documents.map((doc) => (
                    <View key={`doc-${doc.selectionId}`} style={styles.docRow}>
                      <Ionicons name="document-text-outline" size={18} color="#0B3B66" />
                      <View style={styles.docText}>
                        <Text style={styles.question}>{doc.requirementDocumentType}</Text>
                        <Text style={styles.answer}>
                          {doc.originalFilename ?? 'Attached file'}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}

              {!data?.onboarding.rows.length &&
              !data?.serviceDetails?.answers.length &&
              !data?.documents.length ? (
                <Text style={styles.emptySection}>No additional detail records yet.</Text>
              ) : null}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  sheet: {
    width: '100%',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginTop: 10,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    gap: 12,
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B3258',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 12,
    gap: 6,
    flexWrap: 'wrap',
  },
  summaryItem: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  summaryDot: {
    color: '#CBD5E1',
  },
  loading: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  errorWrap: {
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  error: {
    color: '#DC2626',
    fontSize: 14,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 16,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  qaRow: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    gap: 4,
  },
  question: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  answer: {
    fontSize: 14,
    color: '#0B3258',
    lineHeight: 20,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  docText: {
    flex: 1,
    gap: 2,
  },
  emptySection: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
