import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Input } from '@/shared/components';

import type { ChecklistRow } from '../utils/applyServiceReview';
import type { ServiceDetailFormDeclarationItem } from '../types/myServices.types';
import { styles } from '../screens/ApplyServiceScreen.styles';

export interface ApplyServiceDeclarationStepProps {
  description: string | null;
  checklistRows: ChecklistRow[];
  declarationItems: ServiceDetailFormDeclarationItem[];
  submitterName: string;
  onChangeName: (value: string) => void;
  declarationDateDisplay: string;
  onChangeDate: (value: string) => void;
  accepted: Record<number, boolean>;
  onToggleAccepted: (itemId: number) => void;
  submitError: string | null;
  disabled: boolean;
}

export function ApplyServiceDeclarationStep({
  description,
  checklistRows,
  declarationItems,
  submitterName,
  onChangeName,
  declarationDateDisplay,
  onChangeDate,
  accepted,
  onToggleAccepted,
  submitError,
  disabled,
}: ApplyServiceDeclarationStepProps): React.ReactElement {
  return (
    <View style={styles.declarationRoot}>
      <Text style={styles.declarationHeading}>Review & declaration</Text>
      {description != null && description.trim().length > 0 ? (
        <Text style={styles.declarationIntro}>{description}</Text>
      ) : (
        <Text style={styles.declarationIntro}>
          Confirm each section is complete, accept the acknowledgements, then submit.
        </Text>
      )}

      {submitError != null && submitError.length > 0 ? (
        <View style={styles.reviewErrorBanner}>
          <Ionicons name="alert-circle" size={20} color="#DC2626" />
          <Text style={styles.reviewErrorBannerText}>{submitError}</Text>
        </View>
      ) : null}

      <View style={styles.checklistTable}>
        <View style={styles.checklistHeaderRow}>
          <Text style={[styles.checklistHeaderCell, styles.checklistColSection]}>Section</Text>
          <Text style={[styles.checklistHeaderCell, styles.checklistColRequirement]}>
            Requirement
          </Text>
          <Text style={[styles.checklistHeaderCell, styles.checklistColStatus]}>Status</Text>
        </View>
        {checklistRows.length === 0 ? (
          <View style={styles.checklistBodyRow}>
            <Text style={styles.checklistEmptyText}>No sections to review.</Text>
          </View>
        ) : (
          checklistRows.map((row, index) => (
            <View key={`${row.section}-${index}`} style={styles.checklistBodyRow}>
              <Text style={[styles.checklistBodyCell, styles.checklistColSection]}>
                {row.section}
              </Text>
              <Text style={[styles.checklistBodyCellMuted, styles.checklistColRequirement]}>
                {row.requirement}
              </Text>
              <Text
                style={[
                  styles.checklistColStatus,
                  row.complete
                    ? styles.checklistStatusComplete
                    : styles.checklistStatusIncomplete,
                ]}
              >
                {row.complete ? 'Complete' : 'Incomplete'}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.declarationCard}>
        <Text style={styles.declarationCardTitle}>Applicant Declaration</Text>

        {declarationItems.length === 0 ? (
          <Text style={styles.sectionHint}>No acknowledgements configured.</Text>
        ) : (
          <View style={styles.declarationAckList}>
            {declarationItems.map((item) => {
              const checked = accepted[item.id] === true;
              return (
                <Pressable
                  key={item.id}
                  disabled={disabled}
                  onPress={() => onToggleAccepted(item.id)}
                  style={[
                    styles.declarationAckRow,
                    checked ? styles.declarationAckRowSelected : null,
                  ]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked, disabled }}
                  accessibilityLabel={item.label}
                >
                  <View
                    style={[
                      styles.choiceBox,
                      checked ? styles.choiceBoxSelected : null,
                    ]}
                  >
                    {checked ? <Text style={styles.choiceCheck}>✓</Text> : null}
                  </View>
                  <Text style={styles.declarationAckLabel}>
                    {item.label}
                    {item.isRequired === 1 ? ' *' : ''}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={styles.declarationFields} pointerEvents={disabled ? 'none' : 'auto'}>
          <Input
            label="Name of Person Submitting *"
            value={submitterName}
            onChangeText={onChangeName}
            placeholder="Full name"
            accessibilityLabel="Name of person submitting"
          />
          <Input
            label="Date *"
            value={declarationDateDisplay}
            onChangeText={onChangeDate}
            placeholder="DD/MM/YYYY"
            accessibilityLabel="Declaration date"
          />
        </View>
      </View>
    </View>
  );
}

/** @deprecated Use ApplyServiceDeclarationStep */
export const ApplyServiceReviewStep = ApplyServiceDeclarationStep;
