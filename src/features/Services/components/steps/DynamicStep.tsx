import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useOnboardingFormContext } from '../../context/OnboardingFormContext';
import type { OnboardingFieldValue, OnboardingFormQuestion } from '../../types/serviceOnboarding.types';
import type { StepComponentProps } from '../types';

function formatQuestionLabel(raw: string): string {
  const t = raw.trim();
  if (!t) {
    return t;
  }
  const letters = t.replace(/[^a-zA-Z]/g, '');
  if (letters.length < 4) {
    return t;
  }
  const upper = [...letters].filter((c) => c === c.toUpperCase()).length;
  if (upper / letters.length >= 0.65) {
    const lower = t.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
  return t;
}

function QuestionField({
  question,
  value,
  error,
  onChange,
}: {
  question: OnboardingFormQuestion;
  value: OnboardingFieldValue;
  error?: string;
  onChange: (next: OnboardingFieldValue) => void;
}): React.ReactElement {
  const label = formatQuestionLabel(question.question);
  const isSelect = question.type === 'select' || question.type === 'radio';
  const isCheckbox = question.type === 'checkbox';
  const hasCheckboxOptions = isCheckbox && question.options.length > 0;
  const isTextarea = question.type === 'textarea';
  const isNumber = question.type === 'number';
  const isFile = question.type === 'file';

  if (isSelect || question.type === 'radio') {
    return (
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>
          {label}
          {question.required ? <Text style={styles.required}> *</Text> : null}
        </Text>
        <View style={styles.optionsGroup}>
          {question.options.map((opt) => {
            const selected = value === opt.value;
            return (
              <Pressable
                key={opt.id}
                style={[styles.optionRow, selected ? styles.optionRowSelected : null]}
                onPress={() => onChange(opt.value)}
              >
                <View style={[styles.radioOuter, selected ? styles.radioOuterSelected : null]}>
                  {selected ? <View style={styles.radioInner} /> : null}
                </View>
                <Text style={styles.optionLabel}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>
        {error != null ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }

  if (hasCheckboxOptions) {
    const selectedValues = Array.isArray(value) ? value : [];
    return (
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>
          {label}
          {question.required ? <Text style={styles.required}> *</Text> : null}
        </Text>
        <View style={styles.optionsGroup}>
          {question.options.map((opt) => {
            const selected = selectedValues.includes(opt.value);
            return (
              <Pressable
                key={opt.id}
                style={[styles.optionRow, selected ? styles.optionRowSelected : null]}
                onPress={() => {
                  const next = selected
                    ? selectedValues.filter((v) => v !== opt.value)
                    : [...selectedValues, opt.value];
                  onChange(next);
                }}
              >
                <View style={[styles.checkBox, selected ? styles.checkBoxSelected : null]}>
                  {selected ? <Text style={styles.checkMark}>✓</Text> : null}
                </View>
                <Text style={styles.optionLabel}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>
        {error != null ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }

  if (isCheckbox) {
    const checked = value === true;
    return (
      <View style={styles.fieldBlock}>
        <Pressable
          style={[styles.optionRow, checked ? styles.optionRowSelected : null]}
          onPress={() => onChange(!checked)}
        >
          <View style={[styles.checkBox, checked ? styles.checkBoxSelected : null]}>
            {checked ? <Text style={styles.checkMark}>✓</Text> : null}
          </View>
          <Text style={styles.optionLabel}>
            {question.placeholder ?? label}
            {question.required ? <Text style={styles.required}> *</Text> : null}
          </Text>
        </Pressable>
        {error != null ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }

  const stringValue =
    typeof value === 'string' || typeof value === 'number' ? String(value) : '';

  return (
    <View style={styles.fieldBlock}>
      <View style={styles.fieldRow}>
        <Text style={styles.fieldLabel}>
          {label}
          {question.required ? <Text style={styles.required}> *</Text> : null}
        </Text>
        <TextInput
          style={[
            styles.input,
            isTextarea ? styles.textArea : null,
            error != null ? styles.inputError : null,
          ]}
          value={stringValue}
          onChangeText={(text) => onChange(isNumber ? text : text)}
          placeholder={
            isFile
              ? 'Enter file reference or complete in document step later'
              : (question.placeholder ?? '')
          }
          keyboardType={
            question.type === 'email'
              ? 'email-address'
              : question.type === 'phone'
                ? 'phone-pad'
                : isNumber
                  ? 'numeric'
                  : 'default'
          }
          multiline={isTextarea}
          numberOfLines={isTextarea ? 4 : 1}
          textAlignVertical={isTextarea ? 'top' : 'center'}
        />
      </View>
      {error != null ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export function DynamicStep({ config }: StepComponentProps): React.ReactElement {
  const { formValues, errors, setFieldValue, getQuestionsForStepNumber } =
    useOnboardingFormContext();

  const stepNumber =
    typeof config.data?.stepNumber === 'number' ? config.data.stepNumber : 1;
  const questions = getQuestionsForStepNumber(stepNumber);

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.summaryText}>
          No questions in this step. Tap Next to continue.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.summaryText}>{config.description}</Text>
      <View style={styles.fieldsContainer}>
        {questions.map((question) => {
          const key = String(question.id);
          return (
            <QuestionField
              key={key}
              question={question}
              value={formValues[key]}
              error={errors[key]}
              onChange={(next) => setFieldValue(question.id, next)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#546778',
  },
  fieldsContainer: {
    gap: 12,
  },
  fieldBlock: {
    gap: 8,
  },
  fieldRow: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D7E7F5',
    backgroundColor: '#F4F8FC',
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B3258',
  },
  required: {
    color: '#DC2626',
  },
  input: {
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D7E7F5',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0B3258',
  },
  textArea: {
    minHeight: 96,
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  optionsGroup: {
    gap: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D7E7F5',
    backgroundColor: '#F4F8FC',
  },
  optionRowSelected: {
    borderColor: '#0B3B66',
    backgroundColor: '#E8F2FA',
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    color: '#0B3258',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#98A2B3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#0B3B66',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0B3B66',
  },
  checkBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#98A2B3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxSelected: {
    backgroundColor: '#0B3B66',
    borderColor: '#0B3B66',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
