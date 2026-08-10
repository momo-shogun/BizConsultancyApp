import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type {
  ApplyInstanceDraft,
  ServiceDetailFormQuestion,
  ServiceDetailFormSection,
  ServiceDetailFormStep,
} from '../types/myServices.types';
import {
  formatSummaryAnswerDisplay,
  sumAggregateForSummary,
} from '../utils/summarySection';
import { styles } from '../screens/ApplyServiceScreen.styles';

interface ApplyShareholdingSummaryProps {
  section: ServiceDetailFormSection;
  sourceStep: ServiceDetailFormStep | undefined;
  sourceInstances: ApplyInstanceDraft[];
  questionsById: Map<number, ServiceDetailFormQuestion>;
  instancesByStep: Record<number, ApplyInstanceDraft[]>;
  disabled: boolean;
  onEditInstance: (sourceStepId: number, instanceIndex: number) => void;
}

export function ApplyShareholdingSummary(
  props: ApplyShareholdingSummaryProps,
): React.ReactElement | null {
  const cfg = props.section.configJson;
  if (cfg == null) {
    return null;
  }

  const columns = cfg.columns;
  const actionLabel = (cfg.actionLabel ?? '').trim();
  const sourceStepId = Number(cfg.sourceStepId);
  const agg = sumAggregateForSummary(cfg, props.instancesByStep);
  const emptyLabel = props.sourceStep
    ? ((props.sourceStep.instanceLabel ?? props.sourceStep.title ?? 'record')
        .trim()
        .toLowerCase() || 'record')
    : 'records';

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.groupedSectionTitle}>
        {props.section.letter}. {props.section.title}
      </Text>
      {props.section.description ? (
        <Text style={styles.sectionHint}>{props.section.description}</Text>
      ) : null}

      <View style={styles.summaryTable}>
        <View style={styles.summaryHeaderRow}>
          {columns.map((col) => (
            <Text
              key={`h-${col.questionId}-${col.headerLabel}`}
              style={[styles.summaryHeaderCell, styles.summaryFlexCell]}
              numberOfLines={2}
            >
              {col.headerLabel}
            </Text>
          ))}
          {actionLabel.length > 0 ? (
            <Text style={[styles.summaryHeaderCell, styles.summaryActionCell]}>Action</Text>
          ) : null}
        </View>

        {props.sourceInstances.length === 0 ? (
          <View style={styles.summaryBodyRow}>
            <Text style={styles.summaryEmptyText}>
              No {emptyLabel} yet. Complete the linked step first.
            </Text>
          </View>
        ) : (
          props.sourceInstances.map((inst, idx) => (
            <View
              key={inst.clientKey}
              style={[
                styles.summaryBodyRow,
                idx === props.sourceInstances.length - 1 && !agg
                  ? styles.summaryBodyRowLast
                  : null,
              ]}
            >
              {columns.map((col) => {
                const q = props.questionsById.get(col.questionId);
                return (
                  <Text
                    key={`${inst.clientKey}-${col.questionId}`}
                    style={[styles.summaryBodyCell, styles.summaryFlexCell]}
                    numberOfLines={3}
                  >
                    {formatSummaryAnswerDisplay(q, inst)}
                  </Text>
                );
              })}
              {actionLabel.length > 0 ? (
                <Pressable
                  accessibilityRole="button"
                  disabled={props.disabled || !Number.isFinite(sourceStepId)}
                  onPress={() => props.onEditInstance(sourceStepId, idx)}
                  style={styles.summaryActionCell}
                >
                  <Text
                    style={[
                      styles.summaryActionText,
                      (props.disabled || !Number.isFinite(sourceStepId)) &&
                        styles.summaryActionTextDisabled,
                    ]}
                  >
                    {actionLabel}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ))
        )}

        {agg != null ? (
          <View style={styles.summaryFooter}>
            <Ionicons
              name={agg.ok ? 'checkmark-circle' : 'alert-circle'}
              size={16}
              color={agg.ok ? '#0284C7' : '#E11D48'}
            />
            <Text
              style={[
                styles.summaryFooterText,
                agg.ok ? styles.summaryFooterOk : styles.summaryFooterBad,
              ]}
            >
              Total must equal {agg.target}%
              {!agg.ok ? ` (currently ${agg.sum}%)` : ''}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
