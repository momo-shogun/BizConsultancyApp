import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  consultantDropdownTokens,
  dropdownStyles,
  dropdownTokens,
  type DropdownMenuTheme,
} from './dropdown.styles';

export type AnchorMenuMode = 'inline' | 'overlay';

export interface AnchoredSelectOption {
  label: string;
  value: string;
}

export interface AnchoredSelectFieldProps {
  data: AnchoredSelectOption[];
  value: string | null;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  search?: boolean;
  searchPlaceholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  menuContainerStyle?: StyleProp<ViewStyle>;
  theme?: DropdownMenuTheme;
  /** Kept for API compatibility — menu always opens just under the trigger. */
  anchorMode?: AnchorMenuMode;
  onChange: (value: string) => void;
}

function menuTokensFor(theme: DropdownMenuTheme): typeof dropdownTokens {
  return theme === 'consultant' ? consultantDropdownTokens : dropdownTokens;
}

interface MenuAnchor {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
}

const MENU_GAP = 4;
const MENU_MAX_HEIGHT = 220;
const MENU_MIN_HEIGHT = 96;
const VIEWPORT_EDGE = 8;
const OPEN_BELOW_MIN_SPACE = 72;

export function AnchoredSelectField({
  data,
  value,
  placeholder = 'Select item',
  disabled = false,
  error = false,
  search = false,
  searchPlaceholder = 'Search...',
  containerStyle,
  menuContainerStyle,
  theme = 'default',
  anchorMode = 'inline',
  onChange,
}: AnchoredSelectFieldProps): React.ReactElement {
  const tokens = menuTokensFor(theme);
  const triggerRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<MenuAnchor | null>(null);
  const [searchText, setSearchText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const selectedLabel = useMemo((): string => {
    if (value == null || value.length === 0) {
      return '';
    }
    return data.find((item) => item.value === value)?.label ?? '';
  }, [data, value]);

  const filteredData = useMemo((): AnchoredSelectOption[] => {
    const query = searchText.trim().toLowerCase();
    if (!search || query.length === 0) {
      return data;
    }
    return data.filter((item) => item.label.toLowerCase().includes(query));
  }, [data, search, searchText]);

  const computeAnchor = useCallback(
    (pageX: number, pageY: number, width: number, height: number): MenuAnchor => {
      const windowHeight = Dimensions.get('window').height;
      const triggerBottom = pageY + height;
      const viewportBottom = windowHeight - keyboardHeight;
      const spaceBelow = viewportBottom - triggerBottom - MENU_GAP - VIEWPORT_EDGE;
      const spaceAbove = pageY - MENU_GAP - VIEWPORT_EDGE;
      const openBelow = spaceBelow >= OPEN_BELOW_MIN_SPACE || spaceBelow >= spaceAbove;

      if (openBelow) {
        return {
          top: triggerBottom + MENU_GAP,
          left: pageX,
          width,
          maxHeight: Math.min(MENU_MAX_HEIGHT, Math.max(MENU_MIN_HEIGHT, spaceBelow)),
        };
      }

      const maxHeight = Math.min(MENU_MAX_HEIGHT, Math.max(MENU_MIN_HEIGHT, spaceAbove));
      return {
        top: Math.max(VIEWPORT_EDGE, pageY - maxHeight - MENU_GAP),
        left: pageX,
        width,
        maxHeight,
      };
    },
    [keyboardHeight],
  );

  const measureAndOpen = useCallback((): void => {
    if (disabled) {
      return;
    }

    Keyboard.dismiss();

    const runMeasure = (): void => {
      triggerRef.current?.measureInWindow((pageX, pageY, width, height) => {
        setAnchor(computeAnchor(pageX, pageY, width, height));
        setSearchText('');
        setOpen(true);
      });
    };

    const delayMs = Platform.OS === 'ios' ? 100 : 60;
    setTimeout(runMeasure, delayMs);
  }, [computeAnchor, disabled]);

  const handleTriggerPress = useCallback((): void => {
    if (disabled) {
      return;
    }

    Keyboard.dismiss();

    if (anchorMode === 'inline') {
      setOpen((prev) => {
        if (prev) {
          setSearchText('');
        }
        return !prev;
      });
      return;
    }

    measureAndOpen();
  }, [anchorMode, disabled, measureAndOpen]);

  const close = useCallback((): void => {
    setOpen(false);
    setSearchText('');
  }, []);

  const handleSelect = useCallback(
    (item: AnchoredSelectOption): void => {
      onChange(item.value);
      close();
    },
    [close, onChange],
  );

  const listMaxHeight =
    anchor != null
      ? anchor.maxHeight - (search ? 50 : 0)
      : MENU_MAX_HEIGHT - (search ? 50 : 0);

  const renderMenuListItem = useCallback(
    ({ item }: { item: AnchoredSelectOption }) => {
      const selected = item.value === value;
      return (
        <Pressable
          accessibilityRole="button"
          onPress={() => handleSelect(item)}
          style={({ pressed }) => [
            dropdownStyles.itemContainer,
            selected ? { backgroundColor: tokens.activeItem } : null,
            pressed ? styles.itemPressed : null,
          ]}
        >
          <Text
            style={[
              dropdownStyles.itemText,
              theme === 'consultant' && selected
                ? { color: consultantDropdownTokens.selectedText, fontWeight: '600' }
                : null,
            ]}
          >
            {item.label}
          </Text>
        </Pressable>
      );
    },
    [handleSelect, theme, tokens.activeItem, value],
  );

  const menuList = (
    <FlatList
      data={filteredData}
      keyExtractor={(item) => item.value}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
      showsVerticalScrollIndicator
      style={{ maxHeight: listMaxHeight }}
      ListEmptyComponent={
        <Text style={[styles.emptyText, { color: tokens.placeholder }]}>No options found</Text>
      }
      renderItem={renderMenuListItem}
    />
  );

  const searchField =
    search && open ? (
      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder={searchPlaceholder}
        placeholderTextColor={tokens.placeholder}
        style={[styles.searchInput, { borderColor: tokens.border, color: tokens.text }]}
        autoCorrect={false}
      />
    ) : null;

  return (
    <View style={[styles.host, open ? styles.hostOpen : null]}>
      <View ref={triggerRef} collapsable={false}>
        <Pressable
          accessibilityRole="button"
          disabled={disabled}
          onPress={handleTriggerPress}
          style={({ pressed }) => [
            dropdownStyles.trigger,
            styles.triggerInner,
            theme === 'consultant' ? { borderColor: tokens.border } : null,
            error ? dropdownStyles.error : null,
            disabled ? styles.triggerDisabled : null,
            pressed && !disabled ? styles.triggerPressed : null,
            containerStyle,
          ]}
        >
          <Text
            style={[
              styles.triggerText,
              selectedLabel.length > 0
                ? [
                    dropdownStyles.selectedText,
                    theme === 'consultant'
                      ? { color: consultantDropdownTokens.selectedText }
                      : null,
                  ]
                : dropdownStyles.placeholderText,
            ]}
            numberOfLines={1}
          >
            {selectedLabel.length > 0 ? selectedLabel : placeholder}
          </Text>
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={tokens.icon}
          />
        </Pressable>
      </View>

      {open && anchorMode === 'inline' ? (
        <View
          style={[
            styles.inlineMenu,
            { borderColor: tokens.menuBorder, maxHeight: MENU_MAX_HEIGHT },
            menuContainerStyle,
          ]}
        >
          {searchField}
          {menuList}
        </View>
      ) : null}

      {anchorMode === 'overlay' ? (
        <Modal
          visible={open && anchor != null}
          transparent
          animationType="fade"
          statusBarTranslucent
          presentationStyle="overFullScreen"
          onRequestClose={close}
        >
          <View style={[styles.overlay, { backgroundColor: tokens.overlay }]}>
            <Pressable accessibilityRole="button" style={StyleSheet.absoluteFill} onPress={close} />

            {anchor != null ? (
              <View
                style={[
                  styles.menu,
                  {
                    top: anchor.top,
                    left: anchor.left,
                    width: anchor.width,
                    maxHeight: anchor.maxHeight,
                    borderColor: tokens.menuBorder,
                  },
                  menuContainerStyle,
                ]}
              >
                {searchField}
                {menuList}
              </View>
            ) : null}
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'relative',
  },
  hostOpen: {
    zIndex: 20,
  },
  inlineMenu: {
    marginTop: MENU_GAP,
    backgroundColor: dropdownTokens.background,
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: 'hidden',
    elevation: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  triggerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
  },
  triggerText: {
    flex: 1,
    marginRight: 8,
  },
  triggerDisabled: {
    opacity: 0.55,
  },
  triggerPressed: {
    opacity: 0.92,
  },
  overlay: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    backgroundColor: dropdownTokens.background,
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: 'hidden',
    elevation: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  searchInput: {
    margin: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderRadius: 10,
    height: 38,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  emptyText: {
    padding: 14,
    fontSize: 13,
    color: dropdownTokens.placeholder,
    textAlign: 'center',
  },
  itemPressed: {
    opacity: 0.9,
  },
});
