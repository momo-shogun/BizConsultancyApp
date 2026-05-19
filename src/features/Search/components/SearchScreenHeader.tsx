import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

import { SEARCH_PLACEHOLDERS } from '../constants/searchContent';

const PLACEHOLDER_ROTATE_MS = 3200;
const BAR_HEIGHT = 48;

type SearchScreenHeaderProps = {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  onCancel: () => void;
  accentColor: string;
  autoFocus?: boolean;
};

export function SearchScreenHeader({
  value,
  onChangeText,
  onClear,
  onCancel,
  accentColor,
  autoFocus = true,
}: SearchScreenHeaderProps): React.ReactElement {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [placeholderIndex, setPlaceholderIndex] = useState<number>(0);

  useEffect(() => {
    if (!autoFocus) {
      return;
    }
    const handle = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(handle);
  }, [autoFocus]);

  useEffect(() => {
    const handle = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, PLACEHOLDER_ROTATE_MS);
    return () => clearInterval(handle);
  }, []);

  const showClear = value.length > 0;

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.searchShell,
          isFocused && { borderColor: `${accentColor}66` },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={THEME.colors.textSecondary}
          style={styles.leadingIcon}
        />
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
          placeholderTextColor={THEME.colors.textSecondary}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="never"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel="Search services"
        />
        {showClear ? (
          <Pressable
            onPress={onClear}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            style={styles.clearBtn}
          >
            <Ionicons name="close-circle" size={20} color={THEME.colors.textSecondary} />
          </Pressable>
        ) : (
          <View style={styles.clearSpacer} />
        )}
      </View>
      <Pressable
        onPress={onCancel}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Cancel search"
        style={({ pressed }) => [styles.cancelBtn, pressed && styles.cancelPressed]}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
    paddingHorizontal: THEME.spacing[12],
    paddingBottom: THEME.spacing[10],
  },
  searchShell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: BAR_HEIGHT,
    borderRadius: 14,
    backgroundColor: THEME.colors.white,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingLeft: THEME.spacing[12],
    paddingRight: THEME.spacing[8],
    ...Platform.select({
      ios: {
        shadowColor: '#0B0F19',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      default: {
        elevation: 2,
      },
    }),
  },
  leadingIcon: {
    marginRight: THEME.spacing[8],
  },
  input: {
    flex: 1,
    height: BAR_HEIGHT,
    fontSize: THEME.typography.size[16],
    lineHeight: Platform.OS === 'ios' ? 20 : 22,
    color: THEME.colors.textPrimary,
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
    ...Platform.select({
      android: {
        includeFontPadding: false,
        textAlignVertical: 'center',
      },
      ios: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    }),
  },
  clearBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: THEME.spacing[4],
  },
  clearSpacer: {
    width: 28,
    marginLeft: THEME.spacing[4],
  },
  cancelBtn: {
    height: BAR_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing[2],
  },
  cancelPressed: {
    opacity: 0.65,
  },
  cancelText: {
    fontSize: THEME.typography.size[15],
    fontWeight: THEME.typography.weight.semibold as '600',
    color: THEME.colors.primary,
    lineHeight: 20,
  },
});
