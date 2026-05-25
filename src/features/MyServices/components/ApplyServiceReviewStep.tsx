import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { styles } from '../screens/ApplyServiceScreen.styles';

export interface DocumentReviewIssue {
  label: string;
  need: number;
  have: number;
}

export interface ApplyServiceReviewStepProps {
  hasDocumentsTab: boolean;
  hasDetailsTab: boolean;
  docsOk: boolean;
  detailsOk: boolean;
  documentIssues: DocumentReviewIssue[];
  detailIssueLabels: string[];
  submitError: string | null;
}

function StatusRow({
  ok,
  okLabel,
  failLabel,
}: {
  ok: boolean;
  okLabel: string;
  failLabel: string;
}): React.ReactElement {
  return (
    <View style={styles.reviewStatusRow}>
      <Ionicons
        name={ok ? 'checkmark-circle' : 'close-circle'}
        size={18}
        color={ok ? '#047857' : '#DC2626'}
      />
      <Text style={[styles.reviewStatusText, ok ? styles.reviewStatusOk : styles.reviewStatusError]}>
        {ok ? okLabel : failLabel}
      </Text>
    </View>
  );
}

export function ApplyServiceReviewStep({
  hasDocumentsTab,
  hasDetailsTab,
  docsOk,
  detailsOk,
  documentIssues,
  detailIssueLabels,
  submitError,
}: ApplyServiceReviewStepProps): React.ReactElement {
  const canSubmit = (!hasDocumentsTab || docsOk) && (!hasDetailsTab || detailsOk);

  return (
    <View style={styles.reviewRoot}>
      <Text style={styles.reviewHeading}>Review</Text>
      <Text style={styles.reviewIntro}>
        Check everything below before final submit. After submit, this application cannot be
        edited.
      </Text>

      {submitError != null && submitError.length > 0 ? (
        <View style={styles.reviewErrorBanner}>
          <Ionicons name="alert-circle" size={20} color="#DC2626" />
          <Text style={styles.reviewErrorBannerText}>{submitError}</Text>
        </View>
      ) : null}

      {hasDetailsTab ? (
        <View style={styles.reviewSectionCard}>
          <Text style={styles.reviewSectionTitle}>Service details</Text>
          <StatusRow
            ok={detailsOk}
            okLabel="Done"
            failLabel="Missing required answers"
          />
          {!detailsOk && detailIssueLabels.length > 0 ? (
            <View style={styles.reviewIssueList}>
              {detailIssueLabels.map((label) => (
                <Text key={label} style={styles.reviewIssueLine}>
                  {label}: complete this field
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      {hasDocumentsTab ? (
        <View style={styles.reviewSectionCard}>
          <Text style={styles.reviewSectionTitle}>Documents</Text>
          <StatusRow ok={docsOk} okLabel="Done" failLabel="Missing" />
          {!docsOk && documentIssues.length > 0 ? (
            <View style={styles.reviewIssueList}>
              {documentIssues.map((issue) => (
                <Text key={issue.label} style={styles.reviewIssueLine}>
                  {issue.label}: upload {Math.max(0, issue.need - issue.have)} more
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      {!canSubmit ? (
        <Text style={styles.reviewHint}>
          Complete the items marked in red, then tap Final submit.
        </Text>
      ) : (
        <Text style={styles.reviewHintOk}>
          Everything looks ready. You can submit your application.
        </Text>
      )}
    </View>
  );
}
