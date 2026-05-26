import React, { useCallback, useMemo } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAuth } from '@/app/providers/AuthProvider';
import { THEME } from '@/constants/theme';
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
  avatarUri?: string | null;
  onPress?: () => void;
  style?: ViewStyle;
}

const CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 4 },
  default: {},
});

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
  const avatarInitial = titleText.charAt(0).toUpperCase();

  return (
    <View style={[styles.card, props.style]}>
      <View style={styles.row}>
        <Pressable
          style={styles.left}
          onPress={hasPhone ? props.onPress : handleLoginPress}
          disabled={hasPhone ? props.onPress == null : false}
          accessibilityRole={hasPhone && props.onPress != null ? 'button' : hasPhone ? 'text' : 'button'}
          accessibilityLabel={
            hasPhone ? `${titleText}, ${subtitleText}` : 'Sign in to view your mobile number'
          }
        >
          <View style={styles.avatar}>
            {hasPhone && props.avatarUri != null ? (
              <Image source={{ uri: props.avatarUri }} style={styles.avatarImage} resizeMode="cover" />
            ) : hasPhone ? (
              <Text style={styles.avatarInitial}>{avatarInitial}</Text>
            ) : (
              <Ionicons name="person-outline" size={22} color={THEME.colors.primary} />
            )}
          </View>

          <View style={styles.textBlock}>
            <Text style={styles.title} numberOfLines={1}>
              {titleText}
            </Text>
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitleText}
            </Text>
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={hasPhone ? 'Upgrade membership' : 'Sign in'}
          onPress={hasPhone ? undefined : handleLoginPress}
          disabled={hasPhone}
          style={({ pressed }) => [pressed && !hasPhone ? { opacity: 0.88 } : null]}
        >
          <View style={[styles.ctaBtn, hasPhone ? styles.ctaBtnMuted : null]}>
            <Text style={[styles.ctaText, hasPhone ? styles.ctaTextMuted : null]}>{ctaLabel}</Text>
            {!hasPhone ? (
              <Ionicons name="chevron-forward" size={14} color={THEME.colors.white} />
            ) : null}
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: THEME.spacing[12],
    marginVertical: THEME.spacing[10],
    borderRadius: THEME.radius[16],
    overflow: 'hidden',
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: THEME.spacing[16],
    ...CARD_SHADOW,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[12],
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(15,81,50,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(15,81,50,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitial: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.primary,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    gap: THEME.spacing[4],
  },
  title: {
    color: THEME.colors.textPrimary,
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold as '700',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium as '500',
    lineHeight: 17,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[4],
    paddingHorizontal: THEME.spacing[14],
    paddingVertical: THEME.spacing[10],
    borderRadius: THEME.radius[12],
    backgroundColor: THEME.colors.primary,
  },
  ctaBtnMuted: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ctaText: {
    color: THEME.colors.white,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold as '600',
    letterSpacing: 0.15,
  },
  ctaTextMuted: {
    color: THEME.colors.textSecondary,
  },
});
