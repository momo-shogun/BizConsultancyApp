import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  InteractionManager,
  Modal,
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
  onChange,
}: AnchoredSelectFieldProps): React.ReactElement {
  const tokens = menuTokensFor(theme);
  const triggerRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<MenuAnchor | null>(null);
  const [searchText, setSearchText] = useState('');

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

  const measureAndOpen = useCallback((): void => {
    if (disabled) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        triggerRef.current?.measureInWindow((pageX, pageY, width, height) => {
          const windowHeight = Dimensions.get('window').height;
          const triggerBottom = pageY + height;
          const spaceBelow = windowHeight - triggerBottom - MENU_GAP - VIEWPORT_EDGE;
          const spaceAbove = pageY - MENU_GAP - VIEWPORT_EDGE;
          const preferBelow = spaceBelow >= spaceAbove;

          let top: number;
          let maxHeight: number;

          if (preferBelow) {
            top = triggerBottom + MENU_GAP;
            maxHeight = Math.min(MENU_MAX_HEIGHT, Math.max(MENU_MIN_HEIGHT, spaceBelow));
          } else {
            maxHeight = Math.min(MENU_MAX_HEIGHT, Math.max(MENU_MIN_HEIGHT, spaceAbove));
            top = Math.max(VIEWPORT_EDGE, pageY - maxHeight - MENU_GAP);
          }

          setAnchor({
            top,
            left: pageX,
            width,
            maxHeight,
          });
          setSearchText('');
          setOpen(true);
        });
      });
    });
  }, [disabled]);

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

  const listMaxHeight = anchor != null ? anchor.maxHeight - (search ? 50 : 0) : MENU_MAX_HEIGHT;

  return (
    <>
      <View ref={triggerRef} collapsable={false}>
        <Pressable
          accessibilityRole="button"
          disabled={disabled}
          onPress={measureAndOpen}
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
              {search ? (
                <TextInput
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder={searchPlaceholder}
                  placeholderTextColor={tokens.placeholder}
                  style={[styles.searchInput, { borderColor: tokens.border, color: tokens.text }]}
                  autoCorrect={false}
                />
              ) : null}

              <FlatList
                data={filteredData}
                keyExtractor={(item) => item.value}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                showsVerticalScrollIndicator
                style={{ maxHeight: listMaxHeight }}
                ListEmptyComponent={
                  <Text style={[styles.emptyText, { color: tokens.placeholder }]}>
                    No options found
                  </Text>
                }
                renderItem={({ item }) => {
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
                }}
              />
            </View>
          ) : null}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
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
    elevation: 8,
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
