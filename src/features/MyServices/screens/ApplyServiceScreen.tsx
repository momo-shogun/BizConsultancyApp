import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Dialog } from '@/shared/components/dialog';
import {
  Input,
  KeyboardWrapper,
  SafeAreaWrapper,
  ScreenHeader,
  ScreenWrapper,
  ScrollWrapper,
  showGlobalToast,
} from '@/shared/components';
import type { AccountStackParamList } from '@/navigation/types';
import { ROUTES } from '@/navigation/routeNames';
import { getApiErrorMessage } from '@/utils/apiError';
import { selectDisplayName } from '@/features/Auth/store/authSelectors';

import {
  useApplyMyOnboardingSubmissionMutation,
  useDeleteMyVaultDocumentMutation,
  useGetMyOnboardingSubmissionByIdQuery,
  useGetServiceDetailFormContextQuery,
  useGetSubmissionDocumentRequirementsQuery,
  useSaveServiceDetailFormAnswersMutation,
  useSaveSubmissionDocumentSelectionsMutation,
} from '../api/myServicesApi';
import { ApplyDocumentRequirementCard } from '../components/ApplyDocumentRequirementCard';
import { ApplyServiceReviewStep } from '../components/ApplyServiceReviewStep';
import { VaultUploadSourceDialog } from '../components/VaultUploadSourceDialog';
import { useApplyVaultUpload } from '../hooks/useApplyVaultUpload';
import type { ServiceDetailFormQuestion } from '../types/myServices.types';
import {
  APPLY_ERROR_TOAST_DURATION_MS,
  buildDetailIssueLabels,
  buildDocumentReviewIssues,
  formatApplyValidationError,
  mergeDocumentSelections,
} from '../utils/applyServiceReview';
import { APPLY_CANVAS, styles } from './ApplyServiceScreen.styles';

function showApplyErrorToast(message: string, title = 'Could not submit'): void {
  showGlobalToast({
    variant: 'error',
    title,
    message,
    duration: APPLY_ERROR_TOAST_DURATION_MS,
    position: 'top',
    messageNumberOfLines: 6,
  });
}

function showApplySuccessToast(message: string): void {
  showGlobalToast({
    variant: 'success',
    message,
    duration: 4000,
    position: 'top',
  });
}

type ApplyRoute = RouteProp<AccountStackParamList, typeof ROUTES.Account.ApplyService>;

type DetailAnswerState = Record<number, { answerText?: string; answerJson?: unknown }>;
type MultiInputState = Record<number, string[]>;

type StepKey = 'details' | 'documents' | 'submit';

const STEP_LABELS: Record<StepKey, string> = {
  details: 'Details',
  documents: 'Documents',
  submit: 'Submit',
};

function buildDetailPayload(
  questions: ServiceDetailFormQuestion[],
  detailAnswers: DetailAnswerState,
  multiInputs: MultiInputState,
): Array<{ questionId: number; answerText?: string | null; answerJson?: unknown }> {
  const out: Array<{
    questionId: number;
    answerText?: string | null;
    answerJson?: unknown;
  }> = [];
  for (const q of questions) {
    const cur = detailAnswers[q.id] ?? {};
    if (q.answerType === 'multiinput') {
      const arr = (multiInputs[q.id] ?? []).map((s) => s.trim()).filter(Boolean);
      out.push({ questionId: q.id, answerText: null, answerJson: arr });
      continue;
    }
    if (q.answerType === 'checkbox') {
      const cfg = q.configJson as { options?: unknown[] } | null;
      const hasOptions = Array.isArray(cfg?.options) && cfg.options.length > 0;
      if (!hasOptions) {
        out.push({
          questionId: q.id,
          answerText: null,
          answerJson: typeof cur.answerJson === 'boolean' ? cur.answerJson : false,
        });
      } else {
        out.push({
          questionId: q.id,
          answerText: null,
          answerJson: Array.isArray(cur.answerJson) ? cur.answerJson : [],
        });
      }
      continue;
    }
    out.push({
      questionId: q.id,
      answerText: cur.answerText ?? '',
      answerJson: null,
    });
  }
  return out;
}

function ApplyStepIndicator({
  stepKeys,
  stepIndex,
  onStepPress,
}: {
  stepKeys: StepKey[];
  stepIndex: number;
  onStepPress: (index: number) => void;
}): React.ReactElement {
  return (
    <View style={styles.stepperRow}>
      {stepKeys.map((key, index) => {
        const isActive = index === stepIndex;
        const isDone = index < stepIndex;
        return (
          <Pressable
            key={key}
            accessibilityRole="button"
            onPress={() => onStepPress(index)}
            style={styles.stepItem}
          >
            <View
              style={[
                styles.stepDot,
                isActive && styles.stepDotActive,
                isDone && styles.stepDotDone,
              ]}
            >
              {isDone ? (
                <Ionicons name="checkmark" size={14} color="#0F5132" />
              ) : (
                <Text
                  style={[
                    styles.stepDotText,
                    isActive && styles.stepDotTextActive,
                  ]}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
              {STEP_LABELS[key]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ApplyServiceScreen(): React.ReactElement {
  const navigation =
    useNavigation<NativeStackNavigationProp<AccountStackParamList>>();
  const route = useRoute<ApplyRoute>();
  const submissionId = route.params.submissionId;

  const [stepIndex, setStepIndex] = useState(0);
  const [detailAnswers, setDetailAnswers] = useState<DetailAnswerState>({});
  const [multiInputs, setMultiInputs] = useState<MultiInputState>({});
  const [draftSelections, setDraftSelections] = useState<Record<number, number[]>>({});
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteVaultTarget, setDeleteVaultTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [deletingVaultDocId, setDeletingVaultDocId] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const displayName = useSelector(selectDisplayName);
  const personNameForUpload = (displayName ?? 'User').trim() || 'User';

  const { data: submission } = useGetMyOnboardingSubmissionByIdQuery(submissionId);
  const { data: ctx, isLoading: ctxLoading } = useGetServiceDetailFormContextQuery(submissionId);
  const { data: reqData, isLoading: reqLoading } =
    useGetSubmissionDocumentRequirementsQuery(submissionId);

  const [saveDetails] = useSaveServiceDetailFormAnswersMutation();
  const [saveDocs] = useSaveSubmissionDocumentSelectionsMutation();
  const [applySubmission, { isLoading: isApplying }] =
    useApplyMyOnboardingSubmissionMutation();
  const [deleteVaultDocument] = useDeleteMyVaultDocumentMutation();

  const hasDetailsTab = (ctx?.form?.questions.length ?? 0) > 0;
  const hasDocumentsTab = (reqData?.items.length ?? 0) > 0;
  const isApplied = (submission?.status ?? '').toLowerCase() === 'applied';

  const {
    uploadingForServiceDocumentId,
    uploadSourceItem,
    requestUploadForRequirement,
    closeUploadSourceDialog,
    uploadFromSource,
  } = useApplyVaultUpload({
    submissionId,
    isApplied,
    personNameForUpload,
    setDraftSelections,
  });

  const effectiveDocumentSelections = useMemo(
    () =>
      reqData?.items != null
        ? mergeDocumentSelections(reqData.items, draftSelections)
        : draftSelections,
    [draftSelections, reqData?.items],
  );

  useEffect(() => {
    if (ctx == null) {
      return;
    }
    const next: DetailAnswerState = {};
    const multi: MultiInputState = {};
    if (ctx.submission?.answers?.length) {
      for (const a of ctx.submission.answers) {
        next[a.questionId] = {
          answerText: a.answerText ?? undefined,
          answerJson: a.answerJson,
        };
        const q = ctx.form?.questions.find((x) => x.id === a.questionId);
        if (q?.answerType === 'multiinput' && Array.isArray(a.answerJson)) {
          multi[a.questionId] = (a.answerJson as unknown[]).map((x) => String(x));
        }
      }
    }
    if (ctx.form?.questions) {
      for (const q of ctx.form.questions) {
        if (q.answerType === 'multiinput' && !multi[q.id]) {
          const cfg = (q.configJson ?? {}) as { minEntries?: number };
          const min = Math.max(1, Number(cfg.minEntries) || 1);
          multi[q.id] = Array.from({ length: min }, () => '');
        }
      }
    }
    setDetailAnswers(next);
    setMultiInputs(multi);
  }, [ctx]);

  useEffect(() => {
    if (!reqData?.items) {
      return;
    }
    setDraftSelections((prev) =>
      mergeDocumentSelections(reqData.items, prev),
    );
  }, [reqData]);

  useEffect(() => {
    if (!hasDetailsTab || isApplied || ctxLoading) {
      return;
    }
    const t = setTimeout(() => {
      const questions = ctx?.form?.questions ?? [];
      if (questions.length === 0) {
        return;
      }
      const answers = buildDetailPayload(questions, detailAnswers, multiInputs);
      if (answers.length === 0) {
        return;
      }
      void saveDetails({ submissionId, answers });
    }, 700);
    return () => clearTimeout(t);
  }, [detailAnswers, multiInputs, hasDetailsTab, isApplied, ctxLoading, ctx, submissionId, saveDetails]);

  useEffect(() => {
    if (!reqData || isApplied || reqLoading) {
      return;
    }
    const t = setTimeout(() => {
      const merged = mergeDocumentSelections(reqData.items, draftSelections);
      const items = reqData.items.map((it) => ({
        serviceDocumentId: it.serviceDocumentId,
        userDocumentIds: merged[it.serviceDocumentId] ?? [],
      }));
      void saveDocs({ submissionId, items });
    }, 500);
    return () => clearTimeout(t);
  }, [draftSelections, reqData, isApplied, reqLoading, submissionId, saveDocs]);

  const stepKeys = useMemo((): StepKey[] => {
    const list: StepKey[] = [];
    if (hasDetailsTab) {
      list.push('details');
    }
    if (hasDocumentsTab) {
      list.push('documents');
    }
    list.push('submit');
    return list;
  }, [hasDetailsTab, hasDocumentsTab]);

  const currentStep = stepKeys[stepIndex] ?? 'submit';
  const isLastStep = stepIndex >= stepKeys.length - 1;
  const serviceTitle =
    submission?.serviceName || submission?.serviceSlug || 'Service';

  const documentIssues = useMemo(
    () => buildDocumentReviewIssues(reqData?.items ?? [], draftSelections),
    [draftSelections, reqData?.items],
  );

  const detailIssueLabels = useMemo(
    () =>
      buildDetailIssueLabels(ctx?.form?.questions ?? [], detailAnswers, multiInputs),
    [ctx?.form?.questions, detailAnswers, multiInputs],
  );

  const docsOk = !hasDocumentsTab || documentIssues.length === 0;
  const detailsOk = !hasDetailsTab || detailIssueLabels.length === 0;
  const canFinalSubmit = docsOk && detailsOk;

  useEffect(() => {
    if (stepIndex >= stepKeys.length) {
      setStepIndex(0);
    }
  }, [stepIndex, stepKeys.length]);

  useEffect(() => {
    if (canFinalSubmit) {
      setSubmitError(null);
    }
  }, [canFinalSubmit]);

  const toggleDocument = useCallback(
    (serviceDocumentId: number, userDocumentId: number): void => {
      if (isApplied) {
        return;
      }
      setDraftSelections((prev) => {
        const current = prev[serviceDocumentId] ?? [];
        const isSelected = current.includes(userDocumentId);
        return {
          ...prev,
          [serviceDocumentId]: isSelected
            ? current.filter((id) => id !== userDocumentId)
            : [...current, userDocumentId],
        };
      });
    },
    [isApplied],
  );

  const handleOpenFinalSubmit = useCallback((): void => {
    if (!canFinalSubmit) {
      const message = formatApplyValidationError(documentIssues, detailIssueLabels);
      setSubmitError(message);
      showApplyErrorToast(message, 'Complete required items');
      return;
    }
    setSubmitError(null);
    setConfirmVisible(true);
  }, [canFinalSubmit, detailIssueLabels, documentIssues]);

  const handleFinalApply = useCallback(async (): Promise<void> => {
    if (!canFinalSubmit) {
      const message = formatApplyValidationError(documentIssues, detailIssueLabels);
      setSubmitError(message);
      setConfirmVisible(false);
      showApplyErrorToast(message, 'Complete required items');
      return;
    }

    setConfirmVisible(false);
    setSubmitError(null);

    try {
      if (reqData != null) {
        const merged = mergeDocumentSelections(reqData.items, draftSelections);
        const items = reqData.items.map((it) => ({
          serviceDocumentId: it.serviceDocumentId,
          userDocumentIds: merged[it.serviceDocumentId] ?? [],
        }));
        await saveDocs({ submissionId, items }).unwrap();
      }
      await applySubmission(submissionId).unwrap();
      showApplySuccessToast('Application submitted successfully.');
      navigation.goBack();
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, 'Failed to submit application.');
      setSubmitError(message);
      showApplyErrorToast(message);
    }
  }, [
    applySubmission,
    canFinalSubmit,
    detailIssueLabels,
    documentIssues,
    draftSelections,
    navigation,
    reqData,
    saveDocs,
    submissionId,
  ]);

  const goNext = useCallback((): void => {
    if (!isLastStep) {
      setStepIndex((i) => Math.min(i + 1, stepKeys.length - 1));
    }
  }, [isLastStep, stepKeys.length]);

  const confirmDeleteVaultDocument = useCallback(async (): Promise<void> => {
    if (deleteVaultTarget == null) {
      return;
    }
    setDeletingVaultDocId(deleteVaultTarget.id);
    try {
      await deleteVaultDocument({
        submissionId,
        documentId: deleteVaultTarget.id,
      }).unwrap();
      setDeleteVaultTarget(null);
    } catch (err: unknown) {
      showApplyErrorToast(getApiErrorMessage(err, 'Delete failed'), 'Delete failed');
    } finally {
      setDeletingVaultDocId(null);
    }
  }, [deleteVaultDocument, deleteVaultTarget, submissionId]);

  const goBack = useCallback((): void => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    } else {
      navigation.goBack();
    }
  }, [navigation, stepIndex]);

  const isLoading = ctxLoading || reqLoading;

  const renderDetailsStep = (): React.ReactElement => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Service details</Text>
      <Text style={styles.sectionHint}>Answers save automatically as you type.</Text>
      <View style={styles.inputGap}>
        {(ctx?.form?.questions ?? []).map((q) => (
          <View
            key={q.id}
            style={styles.fieldBlock}
            pointerEvents={isApplied ? 'none' : 'auto'}
          >
            {q.answerType === 'multiinput' ? (
              <>
                <Text style={styles.docGroupTitle}>
                  {q.questionLabel}
                  {q.isRequired === 1 ? ' *' : ''}
                </Text>
                {(multiInputs[q.id] ?? ['']).map((val, idx) => (
                  <Input
                    key={`${q.id}-${idx}`}
                    label={idx === 0 ? undefined : `Entry ${idx + 1}`}
                    value={val}
                    onChangeText={(text) => {
                      setMultiInputs((prev) => {
                        const arr = [...(prev[q.id] ?? [])];
                        arr[idx] = text;
                        return { ...prev, [q.id]: arr };
                      });
                    }}
                    placeholder={q.placeholder ?? 'Enter value'}
                    accessibilityLabel={`${q.questionLabel} entry ${idx + 1}`}
                  />
                ))}
                {!isApplied ? (
                  <Pressable
                    style={styles.multiAddBtn}
                    onPress={() => {
                      setMultiInputs((prev) => ({
                        ...prev,
                        [q.id]: [...(prev[q.id] ?? []), ''],
                      }));
                    }}
                  >
                    <Text style={styles.multiAddText}>+ Add another entry</Text>
                  </Pressable>
                ) : null}
              </>
            ) : q.answerType === 'number' ? (
              <Input
                label={`${q.questionLabel}${q.isRequired === 1 ? ' *' : ''}`}
                value={String(detailAnswers[q.id]?.answerText ?? '')}
                onChangeText={(text) => {
                  setDetailAnswers((prev) => ({
                    ...prev,
                    [q.id]: { answerText: text },
                  }));
                }}
                placeholder={q.placeholder ?? 'Enter number'}
                keyboardType="number-pad"
                accessibilityLabel={q.questionLabel}
              />
            ) : (
              <Input
                label={`${q.questionLabel}${q.isRequired === 1 ? ' *' : ''}`}
                value={String(detailAnswers[q.id]?.answerText ?? '')}
                onChangeText={(text) => {
                  setDetailAnswers((prev) => ({
                    ...prev,
                    [q.id]: { answerText: text },
                  }));
                }}
                placeholder={q.placeholder ?? 'Enter answer'}
                accessibilityLabel={q.questionLabel}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const renderDocumentsStep = (): React.ReactElement | null => {
    if (reqData == null) {
      return null;
    }
    return (
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Upload documents</Text>
        <Text style={styles.sectionHint}>
          Upload from camera or gallery. Files are saved to your vault and selected for this
          application.
        </Text>
        {reqData.items.map((it) => (
          <ApplyDocumentRequirementCard
            key={it.serviceDocumentId}
            item={it}
            selectedIds={effectiveDocumentSelections[it.serviceDocumentId] ?? []}
            isApplied={isApplied}
            isUploading={uploadingForServiceDocumentId === it.serviceDocumentId}
            deletingVaultDocId={deletingVaultDocId}
            onToggleDocument={(documentId) =>
              toggleDocument(it.serviceDocumentId, documentId)
            }
            onUploadPress={() => requestUploadForRequirement(it)}
            onDeletePress={(documentId, documentName) =>
              setDeleteVaultTarget({ id: documentId, name: documentName })
            }
          />
        ))}
      </View>
    );
  };

  const renderSubmitStep = (): React.ReactElement => (
    <ApplyServiceReviewStep
      hasDocumentsTab={hasDocumentsTab}
      hasDetailsTab={hasDetailsTab}
      docsOk={docsOk}
      detailsOk={detailsOk}
      documentIssues={documentIssues}
      detailIssueLabels={detailIssueLabels}
      submitError={submitError}
    />
  );

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={APPLY_CANVAS} contentBgColor={APPLY_CANVAS}>
      <ScreenHeader title="Apply for service" onBackPress={() => navigation.goBack()} />

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0B3B66" />
        </View>
      ) : (
        <KeyboardWrapper style={styles.flex}>
          <ScreenWrapper
            style={{ flex: 1, backgroundColor: APPLY_CANVAS }}
          >
            <ScrollWrapper
              style={styles.flex}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.heroCard}>
                <Text style={styles.heroLabel}>Applying for</Text>
                <Text style={styles.heroTitle}>{serviceTitle}</Text>
              </View>

              {isApplied ? (
                <View style={styles.appliedBanner}>
                  <Ionicons name="checkmark-circle" size={20} color="#047857" />
                  <Text style={styles.appliedText}>Application already submitted</Text>
                </View>
              ) : null}

              <ApplyStepIndicator
                stepKeys={stepKeys}
                stepIndex={stepIndex}
                onStepPress={setStepIndex}
              />

              {currentStep === 'details' && hasDetailsTab ? renderDetailsStep() : null}
              {currentStep === 'documents' && hasDocumentsTab ? renderDocumentsStep() : null}
              {currentStep === 'submit' ? renderSubmitStep() : null}

              {!isApplied && currentStep !== 'submit' ? (
                <Text style={styles.autosaveHint}>Changes are saved automatically</Text>
              ) : null}
            </ScrollWrapper>

            {!isApplied ? (
              <View style={styles.footer}>
                <Pressable
                  accessibilityRole="button"
                  onPress={goBack}
                  style={styles.footerBtnOutline}
                >
                  <Text style={styles.footerBtnOutlineText}>
                    {stepIndex === 0 ? 'Cancel' : 'Back'}
                  </Text>
                </Pressable>

                {isLastStep ? (
                  <Pressable
                    accessibilityRole="button"
                    disabled={isApplying}
                    onPress={handleOpenFinalSubmit}
                    style={[
                      styles.footerBtnSubmit,
                      !canFinalSubmit && styles.footerBtnSubmitDisabled,
                    ]}
                  >
                    {isApplying ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.footerBtnPrimaryText}>Final submit</Text>
                    )}
                  </Pressable>
                ) : (
                  <Pressable
                    accessibilityRole="button"
                    onPress={goNext}
                    style={styles.footerBtnPrimary}
                  >
                    <Text style={styles.footerBtnPrimaryText}>Continue</Text>
                  </Pressable>
                )}
              </View>
            ) : (
              <View style={styles.footer}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => navigation.goBack()}
                  style={[styles.footerBtnPrimary, styles.footerSpacer]}
                >
                  <Text style={styles.footerBtnPrimaryText}>Done</Text>
                </Pressable>
              </View>
            )}
          </ScreenWrapper>
        </KeyboardWrapper>
      )}

      <VaultUploadSourceDialog
        visible={uploadSourceItem != null}
        onClose={closeUploadSourceDialog}
        documentLabel={uploadSourceItem?.documentTypeName ?? null}
        onSelectSource={(source) => void uploadFromSource(source)}
      />

      <Dialog
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        variant="warning"
        title="Submit application?"
        description="Your application will be locked after final submit."
        actions={[
          { label: 'Cancel', variant: 'ghost', onPress: () => setConfirmVisible(false) },
          { label: 'Submit', onPress: () => void handleFinalApply() },
        ]}
      />

      <Dialog
        visible={deleteVaultTarget != null}
        onClose={() => setDeleteVaultTarget(null)}
        variant="warning"
        title="Delete file?"
        description={
          deleteVaultTarget != null
            ? `Remove "${deleteVaultTarget.name}" from your vault?`
            : undefined
        }
        actions={[
          { label: 'Cancel', variant: 'ghost', onPress: () => setDeleteVaultTarget(null) },
          {
            label: 'Delete',
            onPress: () => void confirmDeleteVaultDocument(),
          },
        ]}
      />
    </SafeAreaWrapper>
  );
}
