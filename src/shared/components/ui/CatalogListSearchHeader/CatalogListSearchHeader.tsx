import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';

const HEADER_BG = '#FFFFFF';

export interface CatalogListSearchHeaderProps {
  onBackPress?: () => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearchClear: () => void;
  isSearchPending?: boolean;
  searchHint?: string | null;
  searchPlaceholder?: string;
  searchAccessibilityLabel?: string;
}

export function CatalogListSearchHeader(props: CatalogListSearchHeaderProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const {
    searchQuery,
    onSearchQueryChange,
    onSearchClear,
    isSearchPending = false,
    searchHint = null,
    searchPlaceholder = 'Search…',
    searchAccessibilityLabel = 'Search',
  } = props;

  const showBack = props.onBackPress != null;

  return (
    <View style={[styles.shell, { paddingTop: insets.top + THEME.spacing[4] }]}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={props.onBackPress}
            hitSlop={8}
            style={({ pressed }) => [styles.backFab, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-back" size={22} color={THEME.colors.textPrimary} />
          </Pressable>
        ) : null}

        <View style={styles.searchShell}>
          <Ionicons name="search" size={16} color={THEME.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            accessibilityLabel={searchAccessibilityLabel}
            placeholder={searchPlaceholder}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={onSearchQueryChange}
            style={styles.searchInput}
            returnKeyType="search"
            clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : 'never'}
            autoCorrect={false}
            autoCapitalize="none"
            selectionColor={THEME.colors.primary}
            multiline={false}
            numberOfLines={1}
            scrollEnabled={false}
          />
          {isSearchPending ? (
            <ActivityIndicator
              size="small"
              color={THEME.colors.primary}
              style={styles.searchTrailing}
            />
          ) : null}
          {Platform.OS !== 'ios' && searchQuery.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              onPress={onSearchClear}
              hitSlop={8}
              style={styles.searchTrailing}
            >
              <Ionicons name="close-circle" size={17} color={THEME.colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {searchHint != null && searchHint.length > 0 ? (
        <Text style={[styles.searchHint, !showBack ? styles.searchHintFull : null]}>{searchHint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    paddingHorizontal: THEME.spacing[12],
    paddingBottom: THEME.spacing[10],
    backgroundColor: HEADER_BG,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: THEME.colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    minWidth: 0,
  },
  backFab: {
    width: 40,
    height: 40,
    flexShrink: 0,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F6F8',
    ...Platform.select({
      android: { elevation: 0 },
      default: {},
    }),
  },
  pressed: {
    opacity: 0.82,
  },
  searchShell: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: THEME.spacing[12],
    borderRadius: 10,
    backgroundColor: '#F4F6F8',
    ...Platform.select({
      android: { elevation: 0 },
      default: {},
    }),
  },
  searchIcon: {
    flexShrink: 0,
    marginRight: THEME.spacing[8],
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    height: 44,
    paddingVertical: 0,
    margin: 0,
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.medium as '500',
    color: THEME.colors.textPrimary,
    ...Platform.select({
      android: {
        includeFontPadding: false,
        textAlignVertical: 'center',
      },
      default: {},
    }),
  },
  searchTrailing: {
    flexShrink: 0,
    marginLeft: THEME.spacing[4],
  },
  searchHint: {
    marginTop: THEME.spacing[4],
    marginLeft: 48,
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
  searchHintFull: {
    marginLeft: THEME.spacing[4],
  },
});
