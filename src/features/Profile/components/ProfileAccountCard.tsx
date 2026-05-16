import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { useAuth } from '@/app/providers/AuthProvider';
import { THEME } from '@/constants/theme';
import { logoutSession } from '@/features/Auth/store/authThunks';
import {
  selectAccountRole,
  selectDisplayName,
  selectLoggedInMobile,
} from '@/features/Auth/store/authSelectors';
import type { AuthRole } from '@/features/Auth/types/authApi.types';
import { useAppSelector } from '@/store/typedHooks';
import { buildProfileCardSubtitle } from '@/utils/authProfile';
import { formatIndianMobile, isValidIndianMobile } from '@/utils/formatPhone';

export interface ProfileAccountCardProps {
  accountRole: AuthRole;
  style?: ViewStyle;
}

export function ProfileAccountCard(props: ProfileAccountCardProps): React.ReactElement {
  const { accountRole: screenRole } = props;
  const { logout, selectAccountContext } = useAuth();
  const storedMobile = useAppSelector(selectLoggedInMobile);
  const displayName = useAppSelector(selectDisplayName);
  const storedRole = useAppSelector(selectAccountRole);

  const formattedPhone = useMemo(() => formatIndianMobile(storedMobile), [storedMobile]);
  const hasPhone = isValidIndianMobile(storedMobile);
  const resolvedRole = storedRole ?? screenRole;

  const handleLoginPress = useCallback((): void => {
    logout();
    selectAccountContext({ userType: screenRole, authIntent: 'login' });
  }, [logout, screenRole, selectAccountContext]);

  const titleText = useMemo((): string => {
    if (!hasPhone) {
      return 'Sign in';
    }
    const name = displayName?.trim();
    if (name != null && name.length > 0) {
      return name;
    }
    return 'My account';
  }, [displayName, hasPhone]);

  const subtitleText = useMemo((): string => {
    if (!hasPhone) {
      return 'Sign in to view your mobile number';
    }
    return buildProfileCardSubtitle(resolvedRole, formattedPhone);
  }, [formattedPhone, hasPhone, resolvedRole]);

  const ctaLabel = hasPhone ? 'Upgrade' : 'Sign in';

  return (
    <View style={[styles.card, props.style]}>
      <View style={styles.inner}>
        <View style={styles.row}>
          <Pressable
            style={styles.left}
            onPress={hasPhone ? undefined : handleLoginPress}
            disabled={hasPhone}
            accessibilityRole={hasPhone ? 'text' : 'button'}
            accessibilityLabel={
              hasPhone ? `${titleText}, ${subtitleText}` : 'Sign in to view your mobile number'
            }
          >
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>
                {titleText}
              </Text>
            </View>
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitleText}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hasPhone ? 'Upgrade membership' : 'Sign in'}
            onPress={hasPhone ? undefined : handleLoginPress}
            disabled={hasPhone}
          >
            <LinearGradient
              colors={['#ffedd8', '#f3d5b5', '#e7bc91']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaBtn}
            >
              <Text style={styles.ctaText}>{ctaLabel}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: THEME.spacing[10],
    marginVertical: THEME.spacing[10],
    borderRadius: THEME.radius[12],
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: THEME.spacing[12],
  },
  left: {
    flex: 1,
    minWidth: 0,
    gap: THEME.spacing[4],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  title: {
    flex: 1,
    minWidth: 0,
    color: THEME.colors.accentAmber,
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
  },
  chevron: {
    color: THEME.colors.accentAmber,
    fontSize: THEME.typography.size[14],
  },
  subtitle: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.regular as '400',
    lineHeight: 18,
  },
  ctaBtn: {
    paddingHorizontal: THEME.spacing[20],
    paddingVertical: THEME.spacing[8],
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: THEME.colors.black,
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    letterSpacing: 0.3,
  },
});
