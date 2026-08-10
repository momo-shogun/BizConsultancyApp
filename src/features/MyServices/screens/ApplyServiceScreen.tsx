import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { ApplyShareholdingSummary } from '../components/ApplyShareholdingSummary';
import { VaultUploadSourceDialog } from '../components/VaultUploadSourceDialog';
import { useApplyVaultUpload } from '../hooks/useApplyVaultUpload';
import type {
  ApplyInstanceDraft,
  ServiceDetailFormQuestion,
  ServiceDetailFormStep,
} from '../types/myServices.types';
import {
  APPLY_ERROR_TOAST_DURATION_MS,
  addAnotherButtonLabel,
  buildAllFieldsIssueLabels,
  buildChecklistRows,
  buildDeclarationIssueLabels,
  buildDeclarationPayload,
  buildDocumentSelectionPayload,
  buildInstancesPayload,
  buildInitialInstancesByStep,
  buildStepIssueLabels,
  createEmptyInstance,
  defaultInstanceLabel,
  displayToIsoDate,
  docSelectionKey,
  findRequirementForQuestion,
  formatIssueList,
  instanceDraftKeyPart,
  isDeclarationReadyForSave,
  isoToDisplayDate,
  mergeDocumentSelections,
  remapDraftSelectionsClientKeysToServerIds,
  scrubDraftSelectionsForInstanceParts,
  scrubUserDocumentFromDraftSelections,
  stepQuestions,
  syncInstanceIdsFromServer,
  todayIsoDate,
} from '../utils/applyServiceReview';
import {
  getServiceDetailQuestionOptions,
  isYesNoChoiceQuestion,
  YES_NO_OPTIONS,
} from '../utils/serviceDetailQuestionOptions';
import {
  buildQuestionsByIdMap,
  fieldSections,
  summarySections,
} from '../utils/summarySection';
import {
  isQuestionVisible,
  parseNumberBounds,
  parseTextInputVariant,
  sanitizeNumberInput,
  scrubHiddenAnswers,
} from '../utils/serviceDetailVisibility';
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
  const [instancesByStep, setInstancesByStep] = useState<
    Record<number, ApplyInstanceDraft[]>
  >({});
  const [draftSelections, setDraftSelections] = useState<Record<string, number[]>>({});
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
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const hydratedCtxIdRef = useRef<number | null>(null);
  const instancesByStepRef = useRef(instancesByStep);
  const wizardStepsRef = useRef<ServiceDetailFormStep[]>([]);
  const skipNextAutosaveRef = useRef(false);

  const displayName = useSelector(selectDisplayName);
  const personNameForUpload = (displayName ?? 'User').trim() || 'User';

  const { data: submission } = useGetMyOnboardingSubmissionByIdQuery(submissionId);
  const { data: ctx, isLoading: ctxLoading, refetch: refetchCtx } =
    useGetServiceDetailFormContextQuery(submissionId);
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

  useEffect(() => {
    instancesByStepRef.current = instancesByStep;
  }, [instancesByStep]);

  useEffect(() => {
    wizardStepsRef.current = wizardSteps;
  }, [wizardSteps]);

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

  const saveInstancesAndReloadIds = useCallback(async (): Promise<
    Record<number, ApplyInstanceDraft[]>
  > => {
    const steps = wizardStepsRef.current;
    const local = instancesByStepRef.current;
    const instances = buildInstancesPayload(steps, local);
    if (instances.length === 0) {
      return local;
    }

    setIsSavingDetails(true);
    try {
      await saveDetails({ submissionId, instances }).unwrap();
      const refreshed = await refetchCtx().unwrap();
      const synced = syncInstanceIdsFromServer(
        local,
        refreshed.submission?.instances ?? [],
      );
      skipNextAutosaveRef.current = true;
      setInstancesByStep(synced);
      instancesByStepRef.current = synced;
      setDraftSelections((prev) =>
        remapDraftSelectionsClientKeysToServerIds(synced, prev),
      );
      return synced;
    } finally {
      setIsSavingDetails(false);
    }
  }, [refetchCtx, saveDetails, submissionId]);

  const ensureAnswerInstanceId = useCallback(
    async (stepId: number, instanceIndex: number): Promise<number | null> => {
      const current = instancesByStepRef.current[stepId]?.[instanceIndex];
      if (current?.id != null && current.id > 0) {
        return current.id;
      }
      const merged = await saveInstancesAndReloadIds();
      const id = merged[stepId]?.[instanceIndex]?.id ?? null;
      return id != null && id > 0 ? id : null;
    },
    [saveInstancesAndReloadIds],
  );

  const {
    uploadingSelectionKey,
    uploadSourceTarget,
    requestUploadForRequirement,
    closeUploadSourceDialog,
    uploadFromSource,
  } = useApplyVaultUpload({
    submissionId,
    isApplied,
    personNameForUpload,
    setDraftSelections,
    ensureAnswerInstanceId,
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

    if (hydratedCtxIdRef.current !== submissionId) {
      hydratedCtxIdRef.current = submissionId;
      setInstancesByStep(
        buildInitialInstancesByStep(
          steps,
          ctx.submission?.instances ?? [],
          ctx.submission?.answers ?? [],
        ),
      );

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
      return;
    }

    if ((ctx.submission?.instances ?? []).length > 0) {
      setInstancesByStep((prev) => {
        const synced = syncInstanceIdsFromServer(
          prev,
          ctx.submission?.instances ?? [],
        );
        setDraftSelections((sel) =>
          remapDraftSelectionsClientKeysToServerIds(synced, sel),
        );
        return synced;
      });
    }
  }, [ctx, displayName, submissionId]);

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
    if (skipNextAutosaveRef.current) {
      skipNextAutosaveRef.current = false;
      return;
    }
    const t = setTimeout(() => {
      const instances = buildInstancesPayload(wizardSteps, instancesByStep);
      const includeDeclaration = isDeclarationReadyForSave(
        submitterName,
        declarationDateIso,
        declarationItems,
        declarationAccepted,
      );
      const declaration = includeDeclaration
        ? buildDeclarationPayload(submitterName, declarationDateIso, declarationAccepted)
        : undefined;
      if (instances.length === 0 && declaration == null) {
        return;
      }
      setIsSavingDetails(true);
      void saveDetails({ submissionId, instances, declaration })
        .unwrap()
        .then(async () => {
          const needsIds = Object.values(instancesByStepRef.current).some((list) =>
            list.some((inst) => inst.id == null || inst.id <= 0),
          );
          if (!needsIds) {
            return;
          }
          try {
            const refreshed = await refetchCtx().unwrap();
            const synced = syncInstanceIdsFromServer(
              instancesByStepRef.current,
              refreshed.submission?.instances ?? [],
            );
            skipNextAutosaveRef.current = true;
            setInstancesByStep(synced);
            instancesByStepRef.current = synced;
            setDraftSelections((prev) =>
              remapDraftSelectionsClientKeysToServerIds(synced, prev),
            );
          } catch {
            // upload path can retry
          }
        })
        .catch(() => {
          // silent autosave
        })
        .finally(() => setIsSavingDetails(false));
    }, 700);
    return () => clearTimeout(t);
  }, [
    ctxLoading,
    declarationAccepted,
    declarationDateIso,
    declarationItems,
    hasWizard,
    instancesByStep,
    isApplied,
    refetchCtx,
    saveDetails,
    submissionId,
    submitterName,
    wizardSteps,
  ]);

  useEffect(() => {
    if (!reqData || isApplied || reqLoading) {
      return;
    }
    const t = setTimeout(() => {
      const items = buildDocumentSelectionPayload(reqData.items, draftSelections);
      if (items.length === 0) {
        return;
      }
      void saveDocs({ submissionId, items });
    }, 500);
    return () => clearTimeout(t);
  }, [draftSelections, reqData, isApplied, reqLoading, submissionId, saveDocs]);

  const serviceTitle =
    submission?.serviceName || submission?.serviceSlug || 'Service';

  const checklistRows = useMemo(
    () => buildChecklistRows(wizardSteps, instancesByStep, draftSelections, reqData),
    [draftSelections, instancesByStep, reqData, wizardSteps],
  );

  const fieldsIssueLabels = useMemo(
    () => buildAllFieldsIssueLabels(wizardSteps, instancesByStep, draftSelections, reqData),
    [draftSelections, instancesByStep, reqData, wizardSteps],
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
    fieldsIssueLabels.length === 0 && declarationIssueLabels.length === 0;

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

  const updateInstance = useCallback(
    (
      stepId: number,
      instanceIndex: number,
      updater: (inst: ApplyInstanceDraft) => ApplyInstanceDraft,
    ): void => {
      setInstancesByStep((prev) => {
        const list = [...(prev[stepId] ?? [])];
        const current = list[instanceIndex];
        if (current == null) {
          return prev;
        }
        const next = updater(current);
        const step = wizardStepsRef.current.find((s) => s.id === stepId);
        const questions = step != null ? stepQuestions(step) : [];
        const cleaned = scrubHiddenAnswers(
          questions,
          next.detailAnswers,
          next.multiInputs,
        );
        list[instanceIndex] = {
          ...next,
          detailAnswers: cleaned.answers,
          multiInputs: cleaned.multiInputs,
        };
        return { ...prev, [stepId]: list };
      });
    },
    [],
  );

  const toggleDocument = useCallback(
    (
      serviceDocumentId: number,
      answerInstanceId: number | null,
      userDocumentId: number,
    ): void => {
      if (isApplied || answerInstanceId == null || answerInstanceId <= 0) {
        return;
      }
      const key = docSelectionKey(serviceDocumentId, answerInstanceId);
      setDraftSelections((prev) => {
        const current = prev[key] ?? [];
        const isSelected = current.includes(userDocumentId);
        return {
          ...prev,
          [key]: isSelected
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

  const addInstance = useCallback(
    (step: ServiceDetailFormStep): void => {
      if (isApplied || step.isRepeatable !== 1) {
        return;
      }
      setInstancesByStep((prev) => {
        const list = [...(prev[step.id] ?? [])];
        if (list.length >= step.maxInstances) {
          return prev;
        }
        list.push(createEmptyInstance(step, list.length));
        return { ...prev, [step.id]: list };
      });
    },
    [isApplied],
  );

  const removeInstance = useCallback(
    (step: ServiceDetailFormStep, index: number): void => {
      if (isApplied || step.isRepeatable !== 1) {
        return;
      }
      const list = instancesByStep[step.id] ?? [];
      if (list.length <= step.minInstances) {
        return;
      }
      const removed = list[index];
      if (removed == null) {
        return;
      }
      const partsToScrub = [
        removed.clientKey,
        removed.id != null && removed.id > 0 ? String(removed.id) : '',
      ].filter((p) => p.length > 0);

      setDraftSelections((prev) =>
        scrubDraftSelectionsForInstanceParts(prev, partsToScrub),
      );
      setInstancesByStep((prev) => {
        const nextList = [...(prev[step.id] ?? [])];
        nextList.splice(index, 1);
        const reindexed = nextList.map((inst, idx) => ({
          ...inst,
          instanceIndex: idx,
          label:
            (inst.label ?? '').trim().length > 0
              ? inst.label
              : defaultInstanceLabel(step, idx),
        }));
        return { ...prev, [step.id]: reindexed };
      });
    },
    [instancesByStep, isApplied],
  );

  const validateFieldsStep = useCallback(
    (step: ServiceDetailFormStep): boolean => {
      const drafts = instancesByStep[step.id] ?? [];
      const issues = buildStepIssueLabels(
        step,
        drafts,
        draftSelections,
        reqData,
        instancesByStep,
      );
      if (issues.length === 0) {
        return true;
      }
      const message = formatIssueList(issues);
      setSubmitError(message);
      showApplyErrorToast(message, 'Complete required items');
      return false;
    },
    [draftSelections, instancesByStep, reqData],
  );

  const handleOpenFinalSubmit = useCallback((): void => {
    if (!canFinalSubmit) {
      const message = formatIssueList([
        ...fieldsIssueLabels,
        ...declarationIssueLabels,
      ]);
      setSubmitError(message);
      showApplyErrorToast(message, 'Complete required items');
      return;
    }
    setSubmitError(null);
    setConfirmVisible(true);
  }, [canFinalSubmit, declarationIssueLabels, fieldsIssueLabels]);

  const handleFinalApply = useCallback(async (): Promise<void> => {
    if (!canFinalSubmit) {
      const message = formatIssueList([
        ...fieldsIssueLabels,
        ...declarationIssueLabels,
      ]);
      setSubmitError(message);
      setConfirmVisible(false);
      showApplyErrorToast(message, 'Complete required items');
      return;
    }

    setConfirmVisible(false);
    setSubmitError(null);

    try {
      const instances = buildInstancesPayload(wizardSteps, instancesByStep);
      const parsedDate = displayToIsoDate(declarationDateDisplay) ?? declarationDateIso;
      await saveDetails({
        submissionId,
        instances,
        declaration: buildDeclarationPayload(
          submitterName,
          parsedDate,
          declarationAccepted,
        ),
      }).unwrap();

      if (reqData != null) {
        const items = buildDocumentSelectionPayload(reqData.items, draftSelections);
        if (items.length > 0) {
          await saveDocs({ submissionId, items }).unwrap();
        }
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
    declarationAccepted,
    declarationDateDisplay,
    declarationDateIso,
    declarationIssueLabels,
    draftSelections,
    fieldsIssueLabels,
    instancesByStep,
    navigation,
    reqData,
    saveDetails,
    saveDocs,
    submissionId,
    submitterName,
    wizardSteps,
  ]);

  const goNext = useCallback((): void => {
    if (currentStep?.kind === 'fields' && !validateFieldsStep(currentStep)) {
      return;
    }
    if (!isLastStep) {
      setStepIndex((i) => Math.min(i + 1, wizardSteps.length - 1));
    }
  }, [currentStep, isLastStep, validateFieldsStep, wizardSteps.length]);

  const handleStepPress = useCallback(
    (index: number): void => {
      if (index === stepIndex) {
        return;
      }
      if (index > stepIndex) {
        for (let i = stepIndex; i < index; i++) {
          const step = wizardSteps[i];
          if (step?.kind === 'fields' && !validateFieldsStep(step)) {
            return;
          }
        }
      }
      setStepIndex(index);
    },
    [stepIndex, validateFieldsStep, wizardSteps],
  );

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
      setDraftSelections((prev) =>
        scrubUserDocumentFromDraftSelections(prev, deleteVaultTarget.id),
      );
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

  const renderQuestionField = (
    q: ServiceDetailFormQuestion,
    instance: ApplyInstanceDraft,
    stepId: number,
    instanceIndex: number,
  ): React.ReactElement => {
    if (q.answerType === 'upload') {
      const requirement = findRequirementForQuestion(q, reqData);
      const instanceKeyPart = instanceDraftKeyPart(instance);
      const selectionKey =
        requirement != null
          ? docSelectionKey(requirement.serviceDocumentId, instanceKeyPart)
          : null;
      const canUploadNow = instance.id != null && instance.id > 0;
      return (
        <View
          key={`${instance.clientKey}-${q.id}`}
          style={styles.fieldBlock}
          pointerEvents={isApplied ? 'none' : 'auto'}
        >
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
                selectionKey != null
                  ? (effectiveDocumentSelections[selectionKey] ?? [])
                  : []
              }
              isApplied={isApplied}
              isUploading={
                uploadingSelectionKey === selectionKey ||
                (!canUploadNow && isSavingDetails)
              }
              deletingVaultDocId={deletingVaultDocId}
              onToggleDocument={(documentId) =>
                toggleDocument(requirement.serviceDocumentId, instance.id, documentId)
              }
              onUploadPress={() =>
                requestUploadForRequirement(
                  requirement,
                  stepId,
                  instanceIndex,
                  instance.id,
                )
              }
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
        key={`${instance.clientKey}-${q.id}`}
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
            {(() => {
              const cfg = (q.configJson ?? {}) as {
                minEntries?: number;
                maxEntries?: number;
                entryPlaceholder?: string;
              };
              const minEntries = Math.max(1, Number(cfg.minEntries) || 1);
              const maxEntries = Math.max(minEntries, Number(cfg.maxEntries) || minEntries);
              const rows = instance.multiInputs[q.id] ?? Array.from({ length: minEntries }, () => '');
              return (
                <>
                  {rows.map((val, idx) => (
                    <View key={`${q.id}-${idx}`} style={styles.multiRow}>
                      <View style={styles.multiRowInput}>
                        <Input
                          label={idx === 0 ? undefined : `Entry ${idx + 1}`}
                          value={val}
                          onChangeText={(text) => {
                            updateInstance(stepId, instanceIndex, (inst) => {
                              const arr = [...(inst.multiInputs[q.id] ?? [])];
                              arr[idx] = text;
                              return {
                                ...inst,
                                multiInputs: { ...inst.multiInputs, [q.id]: arr },
                              };
                            });
                          }}
                          placeholder={
                            (typeof cfg.entryPlaceholder === 'string'
                              ? cfg.entryPlaceholder
                              : null) ??
                            q.placeholder ??
                            'Enter value'
                          }
                          accessibilityLabel={`${q.questionLabel} entry ${idx + 1}`}
                        />
                      </View>
                      {!isApplied && rows.length > minEntries ? (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Remove entry ${idx + 1}`}
                          onPress={() => {
                            updateInstance(stepId, instanceIndex, (inst) => {
                              const arr = [...(inst.multiInputs[q.id] ?? [])];
                              if (arr.length <= minEntries) {
                                return inst;
                              }
                              arr.splice(idx, 1);
                              return {
                                ...inst,
                                multiInputs: { ...inst.multiInputs, [q.id]: arr },
                              };
                            });
                          }}
                          style={styles.multiRemoveBtn}
                        >
                          <Text style={styles.multiRemoveText}>Remove</Text>
                        </Pressable>
                      ) : null}
                    </View>
                  ))}
                  {!isApplied && rows.length < maxEntries ? (
                    <Pressable
                      style={styles.multiAddBtn}
                      onPress={() => {
                        updateInstance(stepId, instanceIndex, (inst) => {
                          const arr = [...(inst.multiInputs[q.id] ?? [])];
                          if (arr.length >= maxEntries) {
                            showApplyErrorToast(
                              `At most ${maxEntries} entries`,
                              'Limit reached',
                            );
                            return inst;
                          }
                          return {
                            ...inst,
                            multiInputs: {
                              ...inst.multiInputs,
                              [q.id]: [...arr, ''],
                            },
                          };
                        });
                      }}
                    >
                      <Text style={styles.multiAddText}>+ Add another entry</Text>
                    </Pressable>
                  ) : null}
                </>
              );
            })()}
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
                    ? instance.detailAnswers[q.id]?.answerJson === true
                    : instance.detailAnswers[q.id]?.answerJson === false;
                return (
                  <Pressable
                    key={opt.value}
                    style={[styles.choiceRow, selected ? styles.choiceRowSelected : null]}
                    onPress={() => {
                      updateInstance(stepId, instanceIndex, (inst) => ({
                        ...inst,
                        detailAnswers: {
                          ...inst.detailAnswers,
                          [q.id]: { answerJson: opt.value === 'yes' },
                        },
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
                const selectedValues = Array.isArray(instance.detailAnswers[q.id]?.answerJson)
                  ? (instance.detailAnswers[q.id]?.answerJson as string[])
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
                      updateInstance(stepId, instanceIndex, (inst) => ({
                        ...inst,
                        detailAnswers: {
                          ...inst.detailAnswers,
                          [q.id]: { answerJson: next },
                        },
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
                const selected = instance.detailAnswers[q.id]?.answerText === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    style={[styles.choiceRow, selected ? styles.choiceRowSelected : null]}
                    onPress={() => {
                      updateInstance(stepId, instanceIndex, (inst) => ({
                        ...inst,
                        detailAnswers: {
                          ...inst.detailAnswers,
                          [q.id]: { answerText: opt.value },
                        },
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
        ) : (
          (() => {
            const variant =
              q.answerType === 'text'
                ? parseTextInputVariant(q.configJson)
                : 'text';
            const bounds =
              q.answerType === 'number' ? parseNumberBounds(q.configJson) : null;
            const placeholder =
              q.placeholder ??
              (q.answerType === 'number'
                ? 'Enter number'
                : variant === 'date'
                  ? 'YYYY-MM-DD'
                  : variant === 'email'
                    ? 'name@example.com'
                    : variant === 'tel'
                      ? 'Phone number'
                      : 'Enter answer');
            const keyboardType =
              q.answerType === 'number'
                ? 'decimal-pad'
                : variant === 'email'
                  ? 'email-address'
                  : variant === 'tel'
                    ? 'phone-pad'
                    : 'default';
            const hintParts = [
              q.helpText?.trim() ?? '',
              bounds != null && (bounds.min != null || bounds.max != null)
                ? [
                    bounds.min != null ? `Min ${bounds.min}` : '',
                    bounds.max != null ? `Max ${bounds.max}` : '',
                  ]
                    .filter((p) => p.length > 0)
                    .join(' · ')
                : '',
            ].filter((p) => p.length > 0);
            return (
              <>
                <Input
                  label={`${q.questionLabel}${q.isRequired === 1 ? ' *' : ''}`}
                  value={String(instance.detailAnswers[q.id]?.answerText ?? '')}
                  onChangeText={(text) => {
                    const next =
                      q.answerType === 'number' ? sanitizeNumberInput(text) : text;
                    updateInstance(stepId, instanceIndex, (inst) => ({
                      ...inst,
                      detailAnswers: {
                        ...inst.detailAnswers,
                        [q.id]: { answerText: next },
                      },
                    }));
                  }}
                  placeholder={placeholder}
                  keyboardType={keyboardType}
                  textContentType={
                    variant === 'email'
                      ? 'emailAddress'
                      : variant === 'tel'
                        ? 'telephoneNumber'
                        : undefined
                  }
                  multiline={variant === 'textarea'}
                  accessibilityLabel={q.questionLabel}
                />
                {hintParts.length > 0 ? (
                  <Text style={styles.sectionHint}>{hintParts.join(' · ')}</Text>
                ) : null}
              </>
            );
          })()
        )}
      </View>
    );
  };

  const renderInstanceCard = (
    step: ServiceDetailFormStep,
    instance: ApplyInstanceDraft,
    instanceIndex: number,
    showHeader: boolean,
  ): React.ReactElement => {
    const canRemove =
      !isApplied &&
      step.isRepeatable === 1 &&
      (instancesByStep[step.id] ?? []).length > step.minInstances;

    return (
      <View
        key={`inst-${step.id}-${instance.clientKey}`}
        style={styles.instanceCard}
      >
        {showHeader ? (
          <View style={styles.instanceCardHeader}>
            <Text style={styles.instanceCardTitle}>
              {(instance.label ?? '').trim() || defaultInstanceLabel(step, instanceIndex)}
            </Text>
            {canRemove ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => removeInstance(step, instanceIndex)}
                style={styles.instanceRemoveBtn}
              >
                <Text style={styles.instanceRemoveText}>Remove</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {step.isRepeatable === 1 ? (
          <View style={styles.instanceLabelInputWrap} pointerEvents={isApplied ? 'none' : 'auto'}>
            <Input
              label="Label"
              value={instance.label ?? ''}
              onChangeText={(text) => {
                updateInstance(step.id, instanceIndex, (inst) => ({
                  ...inst,
                  label: text,
                }));
              }}
              placeholder={defaultInstanceLabel(step, instanceIndex)}
              accessibilityLabel="Instance label"
            />
          </View>
        ) : null}

        {fieldSections(step).map((section) => (
          <View key={`${section.letter}-${section.id}`} style={styles.groupedSectionCard}>
            <Text style={styles.groupedSectionTitle}>
              {section.letter}. {section.title}
            </Text>
            {section.description ? (
              <Text style={styles.sectionHint}>{section.description}</Text>
            ) : null}
            <View style={styles.inputGap}>
              {section.questions
                .filter((q) =>
                  isQuestionVisible(q, stepQuestions(step), instance.detailAnswers),
                )
                .map((q) => renderQuestionField(q, instance, step.id, instanceIndex))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const questionsById = useMemo(
    () => buildQuestionsByIdMap(wizardSteps),
    [wizardSteps],
  );

  const jumpToSourceInstance = useCallback(
    (sourceStepId: number, instanceIndex: number): void => {
      const idx = wizardSteps.findIndex((s) => s.id === sourceStepId);
      if (idx < 0) {
        showApplyErrorToast('Could not find the linked step to edit');
        return;
      }
      setStepIndex(idx);
      void instanceIndex;
    },
    [wizardSteps],
  );

  const renderFieldsStep = (step: ServiceDetailFormStep): React.ReactElement => {
    const drafts = instancesByStep[step.id] ?? [];
    const isRepeatable = step.isRepeatable === 1;
    const canAdd =
      !isApplied && isRepeatable && drafts.length < step.maxInstances;
    const summaries = summarySections(step);

    return (
      <View style={styles.detailsStack}>
        {step.description ? (
          <Text style={styles.sectionHint}>{step.description}</Text>
        ) : null}

        {drafts.map((inst, idx) =>
          renderInstanceCard(step, inst, idx, isRepeatable),
        )}

        {summaries.map((section) => {
          const sourceStepId = Number(section.configJson?.sourceStepId);
          const sourceStep = wizardSteps.find((s) => s.id === sourceStepId);
          const sourceInstances = Number.isFinite(sourceStepId)
            ? (instancesByStep[sourceStepId] ?? [])
            : [];
          return (
            <ApplyShareholdingSummary
              key={`summary-${section.id}-${section.letter}`}
              section={section}
              sourceStep={sourceStep}
              sourceInstances={sourceInstances}
              questionsById={questionsById}
              instancesByStep={instancesByStep}
              disabled={isApplied}
              onEditInstance={jumpToSourceInstance}
            />
          );
        })}

        {isRepeatable ? (
          <Pressable
            accessibilityRole="button"
            disabled={!canAdd}
            onPress={() => addInstance(step)}
            style={[styles.addInstanceBtn, !canAdd && styles.addInstanceBtnDisabled]}
          >
            <Text
              style={[
                styles.addInstanceText,
                !canAdd && styles.addInstanceTextDisabled,
              ]}
            >
              {addAnotherButtonLabel(step)}
            </Text>
          </Pressable>
        ) : null}

        {isRepeatable && drafts.length < step.minInstances ? (
          <Text style={styles.uploadMissingHint}>
            Add at least {step.minInstances}{' '}
            {(step.instanceLabel ?? 'record').trim() || 'record'}(s) before continuing.
          </Text>
        ) : null}
      </View>
    );
  };

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
                  onStepPress={handleStepPress}
                />
              ) : (
                <Text style={styles.sectionHint}>Nothing to fill here right now.</Text>
              )}

              {currentStep?.kind === 'fields' ? renderFieldsStep(currentStep) : null}
              {currentStep?.kind === 'declaration'
                ? renderDeclarationStep(currentStep)
                : null}

              {!isApplied && hasWizard && !isDeclarationStep ? (
                <Text style={styles.autosaveHint}>
                  {isSavingDetails
                    ? 'Saving…'
                    : 'Changes are saved automatically'}
                </Text>
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
        visible={uploadSourceTarget != null}
        onClose={closeUploadSourceDialog}
        documentLabel={uploadSourceTarget?.item.documentTypeName ?? null}
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
