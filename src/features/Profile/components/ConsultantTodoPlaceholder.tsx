import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { PROFILE_CANVAS } from '@/features/Profile/constants/profileScreenTheme';
import { THEME } from '@/constants/theme';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';

export interface ConsultantTodoPlaceholderProps {
  title: string;
  todoMessage: string;
  iconName?: string;
  iconColor?: string;
  iconBgColor?: string;
}

export function ConsultantTodoPlaceholder({
  title,
  todoMessage,
  iconName = 'construct-outline',
  iconColor = '#059669',
  iconBgColor = 'rgba(5,150,105,0.12)',
}: ConsultantTodoPlaceholderProps): React.ReactElement {
  const navigation = useNavigation();

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={PROFILE_CANVAS}>
      <ScreenHeader title={title} onBackPress={() => navigation.goBack()} />

      <View style={styles.body}>
        <View style={[styles.iconWrap, { backgroundColor: iconBgColor }]}>
          <Ionicons name={iconName} size={36} color={iconColor} />
        </View>

        <Text style={styles.heading}>{title}</Text>
        <Text style={styles.subtitle}>This section is under development.</Text>

        <View style={styles.todoCard}>
          <Text style={styles.todoBadge}>#TODO</Text>
          <Text style={styles.todoText}>{todoMessage}</Text>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing[24],
    paddingBottom: THEME.spacing[48],
    gap: THEME.spacing[12],
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing[8],
  },
  heading: {
    fontSize: THEME.typography.size[20],
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: THEME.typography.size[14],
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: THEME.spacing[8],
  },
  todoCard: {
    width: '100%',
    marginTop: THEME.spacing[12],
    padding: THEME.spacing[16],
    borderRadius: 16,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: THEME.spacing[8],
  },
  todoBadge: {
    alignSelf: 'flex-start',
    fontSize: THEME.typography.size[12],
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  todoText: {
    fontSize: THEME.typography.size[14],
    lineHeight: 21,
    color: '#334155',
    fontWeight: '500',
  },
});
