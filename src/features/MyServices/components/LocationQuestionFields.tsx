import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AnchoredSelectField } from '@/shared/components/dropdown/anchoredSelectField';

import {
  useGetLocationCityOptionsQuery,
  useGetLocationStateOptionsQuery,
} from '../api/myServicesApi';
import {
  parseLocationDraft,
  type LocationAnswer,
} from '../utils/locationAnswer';

export interface LocationQuestionFieldsProps {
  questionLabel: string;
  helpText: string | null;
  required: boolean;
  disabled: boolean;
  answerJson: unknown;
  onChange: (value: LocationAnswer | { stateId: number; stateLabel: string } | null) => void;
}

export function LocationQuestionFields({
  questionLabel,
  helpText,
  required,
  disabled,
  answerJson,
  onChange,
}: LocationQuestionFieldsProps): React.ReactElement {
  const draft = parseLocationDraft(answerJson);
  const { data: states = [], isFetching: loadingStates } = useGetLocationStateOptionsQuery();
  const { data: cities = [], isFetching: loadingCities } = useGetLocationCityOptionsQuery(
    draft.stateId ?? 0,
    { skip: draft.stateId == null },
  );

  const stateOptions = useMemo(() => {
    const options = states.map((row) => ({ label: row.label, value: String(row.value) }));
    if (
      draft.stateId != null &&
      draft.stateLabel.length > 0 &&
      !options.some((o) => o.value === String(draft.stateId))
    ) {
      return [{ label: draft.stateLabel, value: String(draft.stateId) }, ...options];
    }
    return options;
  }, [states, draft.stateId, draft.stateLabel]);
  const cityOptions = useMemo(() => {
    const options = cities.map((row) => ({ label: row.label, value: String(row.value) }));
    if (
      draft.cityId != null &&
      draft.cityLabel.length > 0 &&
      !options.some((o) => o.value === String(draft.cityId))
    ) {
      return [{ label: draft.cityLabel, value: String(draft.cityId) }, ...options];
    }
    return options;
  }, [cities, draft.cityId, draft.cityLabel]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>
        {questionLabel}
        {required ? ' *' : ''}
      </Text>
      {helpText != null && helpText.length > 0 ? (
        <Text style={styles.hint}>{helpText}</Text>
      ) : null}
      <View style={styles.fields}>
        <View style={styles.field}>
          <Text style={styles.label}>State</Text>
          <AnchoredSelectField
            data={stateOptions}
            value={draft.stateId != null ? String(draft.stateId) : null}
            placeholder={loadingStates ? 'Loading states…' : 'Select state'}
            disabled={disabled || loadingStates}
            search
            searchPlaceholder="Search state"
            onChange={(value) => {
              const selected = states.find((s) => String(s.value) === value);
              const stateId = Number(value);
              const stateLabel = selected?.label ?? draft.stateLabel;
              if (!Number.isFinite(stateId) || stateId <= 0 || stateLabel.length === 0) {
                onChange(null);
                return;
              }
              onChange({ stateId, stateLabel });
            }}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>City</Text>
          <AnchoredSelectField
            data={cityOptions}
            value={draft.cityId != null ? String(draft.cityId) : null}
            placeholder={
              draft.stateId == null
                ? 'Select state first'
                : loadingCities
                  ? 'Loading cities…'
                  : 'Select city'
            }
            disabled={disabled || draft.stateId == null || loadingCities}
            search
            searchPlaceholder="Search city"
            onChange={(value) => {
              if (draft.stateId == null || draft.stateLabel.length === 0) {
                onChange(null);
                return;
              }
              const selected = cities.find((c) => String(c.value) === value);
              const cityId = Number(value);
              const cityLabel = selected?.label ?? draft.cityLabel;
              if (!Number.isFinite(cityId) || cityId <= 0 || cityLabel.length === 0) {
                onChange({ stateId: draft.stateId, stateLabel: draft.stateLabel });
                return;
              }
              onChange({
                stateId: draft.stateId,
                stateLabel: draft.stateLabel,
                cityId,
                cityLabel,
              });
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  hint: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  fields: {
    gap: 12,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
});
