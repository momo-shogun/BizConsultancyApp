import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterSection {
  id: string;
  title: string;
  options: FilterOption[];
}

export interface FilterSheetValue {
  selected: Record<string, string | null>;
}

export interface FilterSheetProps {
  visible: boolean;
  title?: string;
  sections: FilterSection[];
  value: FilterSheetValue;
  onChange: (next: FilterSheetValue) => void;
  onClose: () => void;
  onApply?: () => void;
  onClear?: () => void;
}

export function FilterSheet(props: FilterSheetProps): React.ReactElement {
  const {
    visible,
    title = 'Filters',
    sections,
    value,
    onChange,
    onClose,
    onApply,
    onClear,
  } = props;

  const [isMounted, setIsMounted] = useState<boolean>(visible);
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id ?? '');
  const [sheetHeight, setSheetHeight] = useState<number>(540);

  const translateY = useRef(new Animated.Value(600)).current;
  const backdrop = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const activeHighlightOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;
    setActiveSectionId((prev) => (prev.length > 0 ? prev : sections[0]?.id ?? ''));
  }, [sections, visible]);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      translateY.setValue(sheetHeight + 80);
      backdrop.setValue(0);
      contentOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 22,
          stiffness: 260,
          mass: 0.9,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 320,
          delay: 80,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 140,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(backdrop, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: sheetHeight + 80,
        duration: 240,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setIsMounted(false);
    });
  }, [backdrop, contentOpacity, sheetHeight, translateY, visible]);

  const onSheetLayout = (e: LayoutChangeEvent): void => {
    const h = e.nativeEvent.layout.height;
    if (h > 0 && h !== sheetHeight) setSheetHeight(h);
  };

  const activeSection = useMemo(
    () => sections.find((s) => s.id === activeSectionId) ?? sections[0],
    [activeSectionId, sections],
  );

  useEffect(() => {
    // Subtle fade-in highlight when active section changes
    activeHighlightOpacity.setValue(0);
    Animated.timing(activeHighlightOpacity, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [activeHighlightOpacity, activeSectionId]);

  const selectedOptionId = activeSection?.id ? value.selected[activeSection.id] : null;

  const activeCount = Object.values(value.selected).filter(Boolean).length;

  const handleSelectOption = (optionId: string): void => {
    if (activeSection == null) return;
    const current = value.selected[activeSection.id];
    onChange({
      selected: {
        ...value.selected,
        [activeSection.id]: current === optionId ? null : optionId,
      },
    });
  };

  const handleClear = (): void => {
    const cleared: Record<string, string | null> = {};
    for (const section of sections) cleared[section.id] = null;
    onChange({ selected: cleared });
    onClear?.();
  };

  const handleApply = (): void => {
    onApply?.();
    onClose();
  };

  return (
    <Modal
      visible={isMounted}
      transparent
      animationType="none"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close filters"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        >
          <Animated.View style={[styles.backdrop, { opacity: backdrop }]} />
        </Pressable>

        <Animated.View
          onLayout={onSheetLayout}
          style={[styles.sheet, { transform: [{ translateY }] }]}
        >
          {/* Drag handle */}
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <Animated.View style={[styles.header, { opacity: contentOpacity }]}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>{title}</Text>
              {activeCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{activeCount}</Text>
                </View>
              )}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={10}
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
            >
              <Ionicons name="close" size={18} color={THEME.colors.textSecondary} />
            </Pressable>
          </Animated.View>

          {/* Body */}
          <Animated.View style={[styles.body, { opacity: contentOpacity }]}>
            {/* Left rail */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.leftRailContent}
              style={styles.leftRail}
            >
              {sections.map((section) => {
                const isActive = section.id === activeSectionId;
                const hasSelection = !!value.selected[section.id];
                return (
                  <Pressable
                    key={section.id}
                    accessibilityRole="button"
                    accessibilityLabel={section.title}
                    onPress={() => setActiveSectionId(section.id)}
                    style={({ pressed }) => [
                      styles.railItem,
                      isActive && styles.railItemActive,
                      pressed && styles.pressedScale,
                    ]}
                  >
                    {isActive ? (
                      <Animated.View
                        pointerEvents="none"
                        style={[
                          styles.railItemActiveBg,
                          { opacity: activeHighlightOpacity },
                        ]}
                      />
                    ) : null}
                    <View style={styles.railItemInner}>
                      <Text
                        style={[
                          styles.railText,
                          isActive && styles.railTextActive,
                        ]}
                        numberOfLines={1}
                      >
                        {section.title}
                      </Text>
                      {hasSelection && !isActive && (
                        <View style={styles.dotIndicator} />
                      )}
                    </View>
                    {isActive && <View style={styles.railAccent} />}
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Right pane */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.rightPaneContent}
              style={styles.rightPane}
            >
              {activeSection?.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    accessibilityRole="radio"
                    accessibilityLabel={opt.label}
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => handleSelectOption(opt.id)}
                    style={({ pressed }) => [
                      styles.optionRow,
                      isSelected && styles.optionRowSelected,
                      pressed && styles.optionPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <View style={[styles.radio, isSelected && styles.radioSelected]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>

          {/* Footer */}
          <Animated.View style={[styles.footer, { opacity: contentOpacity }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear all filters"
              onPress={handleClear}
              hitSlop={8}
              style={({ pressed }) => [styles.clearBtn, pressed && styles.clearBtnPressed]}
            >
              <Ionicons name="refresh-outline" size={15} color={THEME.colors.textSecondary} style={styles.clearIcon} />
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Apply filters"
              onPress={handleApply}
              hitSlop={8}
              style={({ pressed }) => [styles.applyBtn, pressed && styles.applyBtnPressed]}
            >
              <Text style={styles.applyText}>
                {activeCount > 0 ? `Show results (${activeCount})` : 'Show results'}
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" style={styles.applyIcon} />
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

FilterSheet.displayName = 'FilterSheet';

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10,10,20,0.55)',
  },

  // Sheet
  sheet: {
    backgroundColor: THEME.colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    minHeight: 520,
    maxHeight: 640,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 20,
    overflow: 'hidden',
  },

  // Handle
  handleRow: {
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.border,
  },

  // Header
  header: {
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[4],
    paddingBottom: THEME.spacing[12],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },  
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: THEME.colors.textPrimary,
  },
  badge: {
    backgroundColor: THEME.colors.accentAmber,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnPressed: {
    backgroundColor: THEME.colors.border,
  },

  // Body
  body: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: THEME.colors.border,
  },

  // Left rail
  leftRail: {
    alignSelf: 'stretch',
    minWidth: 112,
    maxWidth: 144,
    // backgroundColor: THEME.colors.surface,
  },
  leftRailContent: {
    paddingVertical: THEME.spacing[8],
  },
  railItem: {
    paddingVertical: 13,
    paddingHorizontal: THEME.spacing[12],
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  railItemActive: {
    // keep layout stable; active bg is rendered via railItemActiveBg
  },
  railItemActiveBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: THEME.colors.surface,
    opacity: 1,
  },
  railItemInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  railAccent: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3,
    borderRadius: 2,
    backgroundColor: THEME.colors.accentAmber,
  },
  railText: {
    fontSize: 13,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
    flex: 1,
  },
  railTextActive: {
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.accentAmber,
    marginLeft: 4,
  },
  pressedScale: {
    opacity: 0.7,
  },

  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: THEME.colors.border,
  },

  // Right pane
  rightPane: {
    flex: 1,
  },
  rightPaneContent: {
    paddingVertical: THEME.spacing[8],
    paddingHorizontal: 4,
  },

  // Options
  optionRow: {
    marginHorizontal: THEME.spacing[8],
    marginVertical: 2,
    paddingVertical: 13,
    paddingHorizontal: THEME.spacing[12],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    gap: THEME.spacing[12],
  },
  optionRowSelected: {
    backgroundColor: `${THEME.colors.accentAmber}12`,
  },
  optionPressed: {
    backgroundColor: THEME.colors.surface,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '400',
    color: THEME.colors.textPrimary,
    flex: 1,
    letterSpacing: -0.1,
  },
  optionTextSelected: {
    fontWeight: '600',
    color: THEME.colors.accentAmber,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: THEME.colors.accentAmber,
    backgroundColor: `${THEME.colors.accentAmber}14`,
  },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: THEME.colors.accentAmber,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[28],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: THEME.colors.border,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: THEME.spacing[16],
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
    gap: 4,
  },
  clearBtnPressed: {
    backgroundColor: THEME.colors.surface,
  },
  clearIcon: {
    marginTop: 0.5,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  applyBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: THEME.colors.accentAmber,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: THEME.colors.accentAmber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  applyBtnPressed: {
    opacity: 0.88,
    shadowOpacity: 0.14,
  },
  applyIcon: {
    marginTop: 0.5,
  },
  applyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.2,
  },
});