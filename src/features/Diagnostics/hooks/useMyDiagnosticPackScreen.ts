import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

import { selectIsAuthenticated } from '@/features/Auth/store/authSelectors';
import {
  useGetMyDiagnosisDashboardQuery,
  useGetMyDiagnosisDocumentRequirementsQuery,
  useRequestDiagnosisFeatureMutation,
  useSaveMyDiagnosisDocumentSelectionsMutation,
} from '@/features/Diagnostics/api/diagnosticsApi';
import type {
  DiagnosisDocumentRequirementItem,
  MyDiagnosisDashboard,
} from '@/features/Diagnostics/types/diagnostics.types';
import { toDocumentSelectionPayload } from '@/features/Diagnostics/utils/diagnosticsMappers';
import { showGlobalError, showGlobalToast } from '@/shared/components';
import { useAppSelector } from '@/store/typedHooks';
import { getApiErrorMessage } from '@/utils/apiError';

const POLL_MS = 30_000;

function cloneRequirementItems(
  items: DiagnosisDocumentRequirementItem[],
): DiagnosisDocumentRequirementItem[] {
  return items.map((item) => ({
    ...item,
    selectedUserDocumentIds: [...item.selectedUserDocumentIds],
  }));
}

export interface UseMyDiagnosticPackScreenResult {
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string | null;
  dashboard: MyDiagnosisDashboard | undefined;
  docItems: DiagnosisDocumentRequirementItem[];
  applyModalVisible: boolean;
  requestingFeatureId: number | null;
  savingDocs: boolean;
  openApplyModal: () => void;
  closeApplyModal: () => void;
  refresh: () => void;
  toggleDocument: (
    requirementId: number,
    userDocumentId: number,
    checked: boolean,
  ) => void;
  applyDocuments: () => Promise<void>;
  requestService: (featureId: number) => Promise<void>;
}

export function useMyDiagnosticPackScreen(): UseMyDiagnosticPackScreenResult {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isFocused = useIsFocused();
  const prevDeliveredRef = useRef<Set<number>>(new Set());

  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [docItems, setDocItems] = useState<DiagnosisDocumentRequirementItem[]>([]);
  const [requestingFeatureId, setRequestingFeatureId] = useState<number | null>(null);

  const pollingInterval = isFocused && isAuthenticated ? POLL_MS : 0;

  const {
    data: dashboard,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: refetchDashboard,
  } = useGetMyDiagnosisDashboardQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval,
  });

  const {
    data: docRequirements,
    refetch: refetchDocRequirements,
  } = useGetMyDiagnosisDocumentRequirementsQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval,
  });

  const [requestFeature] = useRequestDiagnosisFeatureMutation();
  const [saveSelections, { isLoading: savingDocs }] =
    useSaveMyDiagnosisDocumentSelectionsMutation();

  useEffect(() => {
    if (docRequirements?.items != null) {
      setDocItems(cloneRequirementItems(docRequirements.items));
    }
  }, [docRequirements]);

  useEffect(() => {
    if (dashboard?.features == null) {
      return;
    }
    const deliveredIds = new Set(
      dashboard.features
        .filter((f) => f.adminStatus === 'delivered')
        .map((f) => f.id),
    );
    if (prevDeliveredRef.current.size > 0 && dashboard.current != null) {
      for (const id of deliveredIds) {
        if (!prevDeliveredRef.current.has(id)) {
          const title = dashboard.features.find((f) => f.id === id)?.title;
          showGlobalToast({
            message: title != null ? `Delivered: ${title}` : 'A service was marked delivered.',
            variant: 'success',
          });
          break;
        }
      }
    }
    prevDeliveredRef.current = deliveredIds;
  }, [dashboard]);

  const errorMessage = useMemo((): string | null => {
    if (!isAuthenticated) {
      return null;
    }
    if (isError) {
      return getApiErrorMessage(error, 'Could not load diagnostic pack');
    }
    return null;
  }, [error, isAuthenticated, isError]);

  const refresh = useCallback((): void => {
    void refetchDashboard();
    void refetchDocRequirements();
  }, [refetchDashboard, refetchDocRequirements]);

  const openApplyModal = useCallback((): void => {
    if (docRequirements?.items != null) {
      setDocItems(cloneRequirementItems(docRequirements.items));
    }
    setApplyModalVisible(true);
  }, [docRequirements]);

  const closeApplyModal = useCallback((): void => {
    setApplyModalVisible(false);
  }, []);

  const toggleDocument = useCallback(
    (requirementId: number, userDocumentId: number, checked: boolean): void => {
      setDocItems((prev) =>
        prev.map((item) => {
          if (item.diagnosisMembershipDocumentId !== requirementId) {
            return item;
          }
          const next = new Set(item.selectedUserDocumentIds);
          if (checked) {
            next.add(userDocumentId);
          } else {
            next.delete(userDocumentId);
          }
          return { ...item, selectedUserDocumentIds: Array.from(next) };
        }),
      );
    },
    [],
  );

  const applyDocuments = useCallback(async (): Promise<void> => {
    try {
      await saveSelections(toDocumentSelectionPayload(docItems)).unwrap();
      showGlobalToast({ message: 'Documents applied successfully', variant: 'success' });
      setApplyModalVisible(false);
      refresh();
    } catch (err) {
      showGlobalError(getApiErrorMessage(err, 'Failed to apply documents'));
    }
  }, [docItems, refresh, saveSelections]);

  const requestService = useCallback(
    async (featureId: number): Promise<void> => {
      setRequestingFeatureId(featureId);
      try {
        await requestFeature(featureId).unwrap();
        showGlobalToast({ message: 'Service request sent', variant: 'success' });
        refresh();
      } catch (err) {
        showGlobalError(getApiErrorMessage(err, 'Failed to request service'));
      } finally {
        setRequestingFeatureId(null);
      }
    },
    [refresh, requestFeature],
  );

  return {
    isAuthenticated,
    isLoading: isAuthenticated && isLoading && dashboard == null,
    isRefreshing: isFetching && dashboard != null,
    errorMessage,
    dashboard,
    docItems,
    applyModalVisible,
    requestingFeatureId,
    savingDocs,
    openApplyModal,
    closeApplyModal,
    refresh,
    toggleDocument,
    applyDocuments,
    requestService,
  };
}
