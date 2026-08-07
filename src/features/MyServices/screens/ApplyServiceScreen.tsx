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
import { ApplyServiceDeclarationStep } from '../components/ApplyServiceReviewStep';
import { VaultUploadSourceDialog } from '../components/VaultUploadSourceDialog';
import { useApplyVaultUpload } from '../hooks/useApplyVaultUpload';
import type {
  ServiceDetailFormQuestion,
  ServiceDetailFormStep,
} from '../types/myServices.types';
import {
  APPLY_ERROR_TOAST_DURATION_MS,
  buildChecklistRows,
  buildDeclarationIssueLabels,
  buildDeclarationPayload,
  buildDetailIssueLabels,
  buildUploadIssueLabels,
  collectQuestionsFromSteps,
  collectSectionsFromSteps,
  displayToIsoDate,
  findRequirementForQuestion,
  formatApplyValidationError,
  isDeclarationReadyForSave,
  isoToDisplayDate,
  mergeDocumentSelections,
  todayIsoDate,
} from '../utils/applyServiceReview';
import {
  getServiceDetailQuestionOptions,
  isYesNoChoiceQuestion,
  YES_NO_OPTIONS,
} from '../utils/serviceDetailQuestionOptions';
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
    if (q.answerType === 'upload') {
      continue;
    }
    const cur = detailAnswers[q.id] ?? {};
    if (q.answerType === 'multiinput') {
      const arr = (multiInputs[q.id] ?? []).map((s) => s.trim()).filter(Boolean);
      out.push({ questionId: q.id, answerText: null, answerJson: arr });
      continue;
    }
    if (q.answerType === 'checkbox') {
      const options = Array.isArray((q.configJson as { options?: unknown[] } | null)?.options)
        ? ((q.configJson as { options: unknown[] }).options)
        : [];
      const hasOptions = options.length > 0;
      if (!hasOptions) {
        out.push({
          questionId: q.id,
          answerText: null,
          answerJson: typeof cur.answerJson === 'boolean' ? cur.answerJson : null,
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
    if (q.answerType === 'radio') {
      const options = Array.isArray((q.configJson as { options?: unknown[] } | null)?.options)
        ? ((q.configJson as { options: unknown[] }).options)
        : [];
      if (options.length === 0) {
        out.push({
          questionId: q.id,
          answerText: null,
          answerJson: typeof cur.answerJson === 'boolean' ? cur.answerJson : null,
        });
      } else {
        out.push({
          questionId: q.id,
          answerText: cur.answerText ?? '',
          answerJson: null,
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
  steps,
  stepIndex,
  onStepPress,
}: {
  steps: ServiceDetailFormStep[];
  stepIndex: number;
  onStepPress: (index: number) => void;
}): React.ReactElement {
  return (
    <View style={styles.stepperRow}>
      {steps.map((step, index) => {
        const isActive = index === stepIndex;
        const isDone = index < stepIndex;
        return (
          <Pressable
            key={`${step.kind}-${step.id}`}
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
            <Text
              style={[styles.stepLabel, isActive && styles.stepLabelActive]}
              numberOfLines={2}
            >
              {step.title.trim() || `Step ${index + 1}`}
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
  const [submitterName, setSubmitterName] = useState('');
  const [declarationDateIso, setDeclarationDateIso] = useState(todayIsoDate());
  const [declarationDateDisplay, setDeclarationDateDisplay] = useState(() =>
    isoToDisplayDate(todayIsoDate()),
  );
  const [declarationAccepted, setDeclarationAccepted] = useState<Record<number, boolean>>({});

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

  const wizardSteps = useMemo((): ServiceDetailFormStep[] => {
    return ctx?.form?.steps ?? [];
  }, [ctx?.form?.steps]);

  const allQuestions = useMemo((): ServiceDetailFormQuestion[] => {
    const fromSteps = collectQuestionsFromSteps(wizardSteps);
    if (fromSteps.length > 0) {
      return fromSteps;
    }
    return ctx?.form?.questions ?? [];
  }, [ctx?.form?.questions, wizardSteps]);

  const checklistSections = useMemo(
    () => collectSectionsFromSteps(wizardSteps),
    [wizardSteps],
  );

  const currentStep = wizardSteps[stepIndex] ?? null;
  const isDeclarationStep = currentStep?.kind === 'declaration';
  const isLastStep = stepIndex >= wizardSteps.length - 1 && wizardSteps.length > 0;
  const isApplied = (submission?.status ?? '').toLowerCase() === 'applied';
  const hasWizard = wizardSteps.length > 0;

  const declarationItems = useMemo(() => {
    if (currentStep?.kind === 'declaration') {
      return currentStep.declarationItems;
    }
    return wizardSteps.find((s) => s.kind === 'declaration')?.declarationItems ?? [];
  }, [currentStep, wizardSteps]);

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
    const steps = ctx.form?.steps ?? [];
    const questions =
      collectQuestionsFromSteps(steps).length > 0
        ? collectQuestionsFromSteps(steps)
        : (ctx.form?.questions ?? []);

    const next: DetailAnswerState = {};
    const multi: MultiInputState = {};
    if (ctx.submission?.answers?.length) {
      for (const a of ctx.submission.answers) {
        const q = questions.find((x) => x.id === a.questionId);
        let answerJson = a.answerJson;
        if (q != null && isYesNoChoiceQuestion(q) && typeof answerJson !== 'boolean') {
          const text = (a.answerText ?? '').trim().toLowerCase();
          if (text === 'yes' || text === 'true' || text === '1') {
            answerJson = true;
          } else if (text === 'no' || text === 'false' || text === '0') {
            answerJson = false;
          }
        }
        next[a.questionId] = {
          answerText: a.answerText ?? undefined,
          answerJson,
        };
        if (q?.answerType === 'multiinput' && Array.isArray(a.answerJson)) {
          multi[a.questionId] = (a.answerJson as unknown[]).map((x) => String(x));
        }
      }
    }
    for (const q of questions) {
      if (q.answerType === 'multiinput' && multi[q.id] == null) {
        const cfg = (q.configJson ?? {}) as { minEntries?: number };
        const min = Math.max(1, Number(cfg.minEntries) || 1);
        multi[q.id] = Array.from({ length: min }, () => '');
      }
    }
    setDetailAnswers(next);
    setMultiInputs(multi);

    const nameFromSub = (ctx.submission?.submitterName ?? '').trim();
    setSubmitterName(nameFromSub || (displayName ?? '').trim());

    const dateFromSub = (ctx.submission?.declarationDate ?? '').trim().slice(0, 10);
    const iso = /^(\d{4})-(\d{2})-(\d{2})$/.test(dateFromSub) ? dateFromSub : todayIsoDate();
    setDeclarationDateIso(iso);
    setDeclarationDateDisplay(isoToDisplayDate(iso));

    const acceptedRaw = ctx.submission?.declarationAcceptedJson ?? null;
    const acceptedNext: Record<number, boolean> = {};
    if (acceptedRaw != null) {
      for (const [k, v] of Object.entries(acceptedRaw)) {
        const id = Number(k);
        if (Number.isFinite(id) && v === true) {
          acceptedNext[id] = true;
        }
      }
    }
    setDeclarationAccepted(acceptedNext);
  }, [ctx, displayName]);

  useEffect(() => {
    if (!reqData?.items) {
      return;
    }
    setDraftSelections((prev) => mergeDocumentSelections(reqData.items, prev));
  }, [reqData]);

  useEffect(() => {
    if (!hasWizard || isApplied || ctxLoading) {
      return;
    }
    const t = setTimeout(() => {
      const answers = buildDetailPayload(allQuestions, detailAnswers, multiInputs);
      const includeDeclaration = isDeclarationReadyForSave(
        submitterName,
        declarationDateIso,
        declarationItems,
        declarationAccepted,
      );
      const declaration = includeDeclaration
        ? buildDeclarationPayload(submitterName, declarationDateIso, declarationAccepted)
        : undefined;
      if (answers.length === 0 && declaration == null) {
        return;
      }
      void saveDetails({ submissionId, answers, declaration });
    }, 700);
    return () => clearTimeout(t);
  }, [
    allQuestions,
    ctxLoading,
    declarationAccepted,
    declarationDateIso,
    declarationItems,
    detailAnswers,
    hasWizard,
    isApplied,
    isDeclarationStep,
    multiInputs,
    saveDetails,
    submissionId,
    submitterName,
  ]);

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

  const serviceTitle =
    submission?.serviceName || submission?.serviceSlug || 'Service';

  const checklistRows = useMemo(
    () =>
      buildChecklistRows(
        checklistSections,
        detailAnswers,
        multiInputs,
        draftSelections,
        reqData,
      ),
    [checklistSections, detailAnswers, draftSelections, multiInputs, reqData],
  );

  const detailIssueLabels = useMemo(
    () => buildDetailIssueLabels(allQuestions, detailAnswers, multiInputs),
    [allQuestions, detailAnswers, multiInputs],
  );

  const uploadIssueLabels = useMemo(
    () => buildUploadIssueLabels(allQuestions, draftSelections, reqData),
    [allQuestions, draftSelections, reqData],
  );

  const declarationIssueLabels = useMemo(
    () =>
      buildDeclarationIssueLabels(
        submitterName,
        declarationDateDisplay,
        declarationItems,
        declarationAccepted,
      ),
    [declarationAccepted, declarationDateDisplay, declarationItems, submitterName],
  );

  const canFinalSubmit =
    detailIssueLabels.length === 0 &&
    uploadIssueLabels.length === 0 &&
    declarationIssueLabels.length === 0;

  useEffect(() => {
    if (stepIndex >= wizardSteps.length && wizardSteps.length > 0) {
      setStepIndex(0);
    }
  }, [stepIndex, wizardSteps.length]);

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

  const onDeclarationDateChange = useCallback((value: string): void => {
    setDeclarationDateDisplay(value);
    const iso = displayToIsoDate(value);
    if (iso != null) {
      setDeclarationDateIso(iso);
    }
  }, []);

  const toggleDeclarationAccepted = useCallback((itemId: number): void => {
    setDeclarationAccepted((prev) => ({
      ...prev,
      [itemId]: prev[itemId] !== true,
    }));
  }, []);

  const validateFieldsStep = useCallback(
    (step: ServiceDetailFormStep): boolean => {
      const stepQuestions = step.sections.flatMap((s) => s.questions);
      const detailIssues = buildDetailIssueLabels(stepQuestions, detailAnswers, multiInputs);
      const uploadIssues = buildUploadIssueLabels(stepQuestions, draftSelections, reqData);
      if (detailIssues.length === 0 && uploadIssues.length === 0) {
        return true;
      }
      const message = formatApplyValidationError(detailIssues, uploadIssues, []);
      setSubmitError(message);
      showApplyErrorToast(message, 'Complete required items');
      return false;
    },
    [detailAnswers, draftSelections, multiInputs, reqData],
  );

  const handleOpenFinalSubmit = useCallback((): void => {
    if (!canFinalSubmit) {
      const message = formatApplyValidationError(
        detailIssueLabels,
        uploadIssueLabels,
        declarationIssueLabels,
      );
      setSubmitError(message);
      showApplyErrorToast(message, 'Complete required items');
      return;
    }
    setSubmitError(null);
    setConfirmVisible(true);
  }, [canFinalSubmit, declarationIssueLabels, detailIssueLabels, uploadIssueLabels]);

  const handleFinalApply = useCallback(async (): Promise<void> => {
    if (!canFinalSubmit) {
      const message = formatApplyValidationError(
        detailIssueLabels,
        uploadIssueLabels,
        declarationIssueLabels,
      );
      setSubmitError(message);
      setConfirmVisible(false);
      showApplyErrorToast(message, 'Complete required items');
      return;
    }

    setConfirmVisible(false);
    setSubmitError(null);

    try {
      const answers = buildDetailPayload(allQuestions, detailAnswers, multiInputs);
      const parsedDate = displayToIsoDate(declarationDateDisplay) ?? declarationDateIso;
      await saveDetails({
        submissionId,
        answers,
        declaration: buildDeclarationPayload(
          submitterName,
          parsedDate,
          declarationAccepted,
        ),
      }).unwrap();

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
    allQuestions,
    applySubmission,
    canFinalSubmit,
    declarationAccepted,
    declarationDateDisplay,
    declarationDateIso,
    declarationIssueLabels,
    detailAnswers,
    detailIssueLabels,
    draftSelections,
    multiInputs,
    navigation,
    reqData,
    saveDetails,
    saveDocs,
    submissionId,
    submitterName,
    uploadIssueLabels,
  ]);

  const goNext = useCallback((): void => {
    if (currentStep?.kind === 'fields' && !validateFieldsStep(currentStep)) {
      return;
    }
    if (!isLastStep) {
      setStepIndex((i) => Math.min(i + 1, wizardSteps.length - 1));
    }
  }, [currentStep, isLastStep, validateFieldsStep, wizardSteps.length]);

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

  const renderQuestionField = (q: ServiceDetailFormQuestion): React.ReactElement => {
    if (q.answerType === 'upload') {
      const requirement = findRequirementForQuestion(q, reqData);
      return (
        <View key={q.id} style={styles.fieldBlock} pointerEvents={isApplied ? 'none' : 'auto'}>
          {q.helpText ? <Text style={styles.sectionHint}>{q.helpText}</Text> : null}
          {reqLoading ? (
            <ActivityIndicator color="#0B3B66" />
          ) : requirement == null ? (
            <Text style={styles.uploadMissingHint}>
              {q.questionLabel}
              {q.isRequired === 1 ? ' *' : ''}: document type is not assigned for this service.
            </Text>
          ) : (
            <ApplyDocumentRequirementCard
              item={{
                ...requirement,
                documentTypeName: q.questionLabel,
                isRequired: q.isRequired,
              }}
              selectedIds={
                effectiveDocumentSelections[requirement.serviceDocumentId] ?? []
              }
              isApplied={isApplied}
              isUploading={uploadingForServiceDocumentId === requirement.serviceDocumentId}
              deletingVaultDocId={deletingVaultDocId}
              onToggleDocument={(documentId) =>
                toggleDocument(requirement.serviceDocumentId, documentId)
              }
              onUploadPress={() => requestUploadForRequirement(requirement)}
              onDeletePress={(documentId, documentName) =>
                setDeleteVaultTarget({ id: documentId, name: documentName })
              }
            />
          )}
        </View>
      );
    }

    return (
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
            {q.helpText ? <Text style={styles.sectionHint}>{q.helpText}</Text> : null}
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
        ) : isYesNoChoiceQuestion(q) ? (
          <>
            <Text style={styles.docGroupTitle}>
              {q.questionLabel}
              {q.isRequired === 1 ? ' *' : ''}
            </Text>
            {q.helpText ? <Text style={styles.sectionHint}>{q.helpText}</Text> : null}
            <View style={styles.choiceGroup}>
              {YES_NO_OPTIONS.map((opt) => {
                const selected =
                  opt.value === 'yes'
                    ? detailAnswers[q.id]?.answerJson === true
                    : detailAnswers[q.id]?.answerJson === false;
                return (
                  <Pressable
                    key={opt.value}
                    style={[styles.choiceRow, selected ? styles.choiceRowSelected : null]}
                    onPress={() => {
                      setDetailAnswers((prev) => ({
                        ...prev,
                        [q.id]: { answerJson: opt.value === 'yes' },
                      }));
                    }}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                    accessibilityLabel={`${q.questionLabel}: ${opt.label}`}
                  >
                    <View
                      style={[styles.choiceBox, selected ? styles.choiceBoxSelected : null]}
                    >
                      {selected ? <Text style={styles.choiceCheck}>✓</Text> : null}
                    </View>
                    <Text style={styles.choiceLabel}>{opt.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : q.answerType === 'checkbox' ? (
          <>
            <Text style={styles.docGroupTitle}>
              {q.questionLabel}
              {q.isRequired === 1 ? ' *' : ''}
            </Text>
            {q.helpText ? <Text style={styles.sectionHint}>{q.helpText}</Text> : null}
            <View style={styles.choiceGroup}>
              {getServiceDetailQuestionOptions(q).map((opt) => {
                const selectedValues = Array.isArray(detailAnswers[q.id]?.answerJson)
                  ? (detailAnswers[q.id]?.answerJson as string[])
                  : [];
                const selected = selectedValues.includes(opt.value);
                return (
                  <Pressable
                    key={opt.value}
                    style={[styles.choiceRow, selected ? styles.choiceRowSelected : null]}
                    onPress={() => {
                      const next = selected
                        ? selectedValues.filter((v) => v !== opt.value)
                        : [...selectedValues, opt.value];
                      setDetailAnswers((prev) => ({
                        ...prev,
                        [q.id]: { answerJson: next },
                      }));
                    }}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                    accessibilityLabel={`${q.questionLabel}: ${opt.label}`}
                  >
                    <View
                      style={[styles.choiceBox, selected ? styles.choiceBoxSelected : null]}
                    >
                      {selected ? <Text style={styles.choiceCheck}>✓</Text> : null}
                    </View>
                    <Text style={styles.choiceLabel}>{opt.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : q.answerType === 'radio' ? (
          <>
            <Text style={styles.docGroupTitle}>
              {q.questionLabel}
              {q.isRequired === 1 ? ' *' : ''}
            </Text>
            {q.helpText ? <Text style={styles.sectionHint}>{q.helpText}</Text> : null}
            <View style={styles.choiceGroup}>
              {getServiceDetailQuestionOptions(q).map((opt) => {
                const selected = detailAnswers[q.id]?.answerText === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    style={[styles.choiceRow, selected ? styles.choiceRowSelected : null]}
                    onPress={() => {
                      setDetailAnswers((prev) => ({
                        ...prev,
                        [q.id]: { answerText: opt.value },
                      }));
                    }}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${q.questionLabel}: ${opt.label}`}
                  >
                    <View
                      style={[
                        styles.choiceRadioOuter,
                        selected ? styles.choiceRadioOuterSelected : null,
                      ]}
                    >
                      {selected ? <View style={styles.choiceRadioInner} /> : null}
                    </View>
                    <Text style={styles.choiceLabel}>{opt.label}</Text>
                  </Pressable>
                );
              })}
            </View>
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
        {q.helpText && (q.answerType === 'text' || q.answerType === 'number') ? (
          <Text style={styles.sectionHint}>{q.helpText}</Text>
        ) : null}
      </View>
    );
  };

  const renderFieldsStep = (step: ServiceDetailFormStep): React.ReactElement => (
    <View style={styles.detailsStack}>
      {step.description ? (
        <Text style={styles.sectionHint}>{step.description}</Text>
      ) : null}
      {step.sections.map((section) => (
        <View key={`${section.letter}-${section.id}`} style={styles.groupedSectionCard}>
          <Text style={styles.groupedSectionTitle}>
            {section.letter}. {section.title}
          </Text>
          {section.description ? (
            <Text style={styles.sectionHint}>{section.description}</Text>
          ) : null}
          <View style={styles.inputGap}>
            {section.questions.map((q) => renderQuestionField(q))}
          </View>
        </View>
      ))}
    </View>
  );

  const renderDeclarationStep = (step: ServiceDetailFormStep): React.ReactElement => (
    <ApplyServiceDeclarationStep
      description={step.description}
      checklistRows={checklistRows}
      declarationItems={declarationItems}
      submitterName={submitterName}
      onChangeName={setSubmitterName}
      declarationDateDisplay={declarationDateDisplay}
      onChangeDate={onDeclarationDateChange}
      accepted={declarationAccepted}
      onToggleAccepted={toggleDeclarationAccepted}
      submitError={submitError}
      disabled={isApplied}
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
          <ScreenWrapper style={{ flex: 1, backgroundColor: APPLY_CANVAS }}>
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

              {hasWizard ? (
                <ApplyStepIndicator
                  steps={wizardSteps}
                  stepIndex={stepIndex}
                  onStepPress={setStepIndex}
                />
              ) : (
                <Text style={styles.sectionHint}>Nothing to fill here right now.</Text>
              )}

              {currentStep?.kind === 'fields' ? renderFieldsStep(currentStep) : null}
              {currentStep?.kind === 'declaration'
                ? renderDeclarationStep(currentStep)
                : null}

              {!isApplied && hasWizard && !isDeclarationStep ? (
                <Text style={styles.autosaveHint}>Changes are saved automatically</Text>
              ) : null}
            </ScrollWrapper>

            {!isApplied && hasWizard ? (
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
