import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

export interface EdpEnrollmentRequiredViewProps {
  isConsultant?: boolean;
  onEnrollPress?: () => void;
}

export function EdpEnrollmentRequiredView(
  props: EdpEnrollmentRequiredViewProps,
): React.ReactElement {
  return (
    <View style={styles.root}>
      <View style={styles.iconWrap}>
        <Ionicons name="school-outline" size={28} color={THEME.colors.primary} />
      </View>
      <Text style={styles.title}>Enrollment required</Text>
      <Text style={styles.body}>
        {props.isConsultant === true
          ? 'Switch to a user account to purchase and access EDP modules, videos, and PDFs.'
          : 'Purchase the EDP programme to access modules, videos, and PDFs.'}
      </Text>
      {props.isConsultant !== true && props.onEnrollPress != null ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Enroll in EDP programme"
          onPress={props.onEnrollPress}
          style={({ pressed }) => [styles.btn, pressed ? styles.pressed : null]}
        >
          <Text style={styles.btnText}>Enroll now</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing[24],
    paddingVertical: THEME.spacing[32],
    gap: THEME.spacing[12],
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37,99,235,0.1)',
    marginBottom: THEME.spacing[4],
  },
  title: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    textAlign: 'center',
  },
  body: {
    fontSize: THEME.typography.size[14],
    lineHeight: 20,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
  btn: {
    marginTop: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[20],
    paddingVertical: THEME.spacing[12],
    borderRadius: THEME.radius[12],
    backgroundColor: THEME.colors.primary,
  },
  btnText: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.white,
  },
  pressed: {
    opacity: 0.9,
  },
});
