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

const PRIMARY = THEME.colors.primary;
const PRIMARY_TINT = 'rgba(15, 81, 50, 0.09)';
const PRIMARY_TINT_STRONG = 'rgba(15, 81, 50, 0.14)';
const OVERLAY = 'rgba(15, 23, 42, 0.52)';

const OPEN_SPRING = {
  damping: 26,
  stiffness: 300,
  mass: 0.85,
} as const;

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

  const sheetHeightRef = useRef<number>(540);
  const isFirstPaneRender = useRef<boolean>(true);

  const translateY = useRef(new Animated.Value(600)).current;
  const backdrop = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const activeHighlightOpacity = useRef(new Animated.Value(1)).current;
  const paneOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;
    setActiveSectionId((prev) => (prev.length > 0 ? prev : sections[0]?.id ?? ''));
  }, [sections, visible]);

  useEffect(() => {
    const slideOffset = sheetHeightRef.current + 80;

    if (visible) {
      setIsMounted(true);
      translateY.setValue(slideOffset);
      backdrop.setValue(0);
      contentOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 1,
          duration: 300,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          ...OPEN_SPRING,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 280,
          delay: 60,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (!isMounted) {
      return;
    }

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 160,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdrop, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: slideOffset,
        duration: 260,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setIsMounted(false);
    });
  }, [backdrop, contentOpacity, isMounted, translateY, visible]);

  const onSheetLayout = (e: LayoutChangeEvent): void => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) sheetHeightRef.current = h;
  };

  const activeSection = useMemo(
    () => sections.find((s) => s.id === activeSectionId) ?? sections[0],
    [activeSectionId, sections],
  );

  useEffect(() => {
    activeHighlightOpacity.setValue(0);
    Animated.timing(activeHighlightOpacity, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [activeHighlightOpacity, activeSectionId]);

  useEffect(() => {
    if (isFirstPaneRender.current) {
      isFirstPaneRender.current = false;
      return;
    }

    paneOpacity.setValue(0);
    Animated.timing(paneOpacity, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeSectionId, paneOpacity]);

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

  const handleSectionPress = (sectionId: string): void => {
    if (sectionId === activeSectionId) return;
    setActiveSectionId(sectionId);
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
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>

          <Animated.View style={[styles.header, { opacity: contentOpacity }]}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>{title}</Text>
              {activeCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{activeCount}</Text>
                </View>
              ) : null}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={10}
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed ? styles.closeBtnPressed : null]}
            >
              <Ionicons name="close" size={18} color={THEME.colors.textSecondary} />
            </Pressable>
          </Animated.View>

          <Animated.View style={[styles.body, { opacity: contentOpacity }]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.leftRailContent}
              style={styles.leftRail}
              bounces={false}
            >
              {sections.map((section) => {
                const isActive = section.id === activeSectionId;
                const hasSelection = Boolean(value.selected[section.id]);
                return (
                  <Pressable
                    key={section.id}
                    accessibilityRole="button"
                    accessibilityLabel={section.title}
                    onPress={() => handleSectionPress(section.id)}
                    style={({ pressed }) => [
                      styles.railItem,
                      pressed ? styles.pressedSoft : null,
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
                          isActive ? styles.railTextActive : null,
                        ]}
                        numberOfLines={1}
                      >
                        {section.title}
                      </Text>
                      {hasSelection && !isActive ? (
                        <View style={styles.dotIndicator} />
                      ) : null}
                    </View>
                    {isActive ? <View style={styles.railAccent} /> : null}
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.divider} />

            <Animated.View style={[styles.rightPaneWrap, { opacity: paneOpacity }]}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.rightPaneContent}
                style={styles.rightPane}
                bounces={false}
                keyboardShouldPersistTaps="handled"
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
                        isSelected ? styles.optionRowSelected : null,
                        pressed && !isSelected ? styles.optionPressed : null,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected ? styles.optionTextSelected : null,
                        ]}
                      >
                        {opt.label}
                      </Text>
                      <View style={[styles.radio, isSelected ? styles.radioSelected : null]}>
                        {isSelected ? <View style={styles.radioDot} /> : null}
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Animated.View>
          </Animated.View>

          <Animated.View style={[styles.footer, { opacity: contentOpacity }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear all filters"
              onPress={handleClear}
              hitSlop={8}
              style={({ pressed }) => [styles.clearBtn, pressed ? styles.clearBtnPressed : null]}
            >
              <Ionicons
                name="refresh-outline"
                size={15}
                color={THEME.colors.textSecondary}
                style={styles.clearIcon}
              />
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Apply filters"
              onPress={handleApply}
              hitSlop={8}
              style={({ pressed }) => [styles.applyBtn, pressed ? styles.applyBtnPressed : null]}
            >
              <Text style={styles.applyText}>
                {activeCount > 0 ? `Show results (${activeCount})` : 'Show results'}
              </Text>
              <Ionicons name="arrow-forward" size={16} color={THEME.colors.white} style={styles.applyIcon} />
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
    backgroundColor: OVERLAY,
  },

  sheet: {
    backgroundColor: THEME.colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    minHeight: 520,
    maxHeight: 640,
    flexDirection: 'column',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 20,
    overflow: 'hidden',
  },

  handleRow: {
    paddingTop: 10,
    paddingBottom: 6,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.border,
  },

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
    backgroundColor: PRIMARY,
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
    color: THEME.colors.white,
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

  body: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: THEME.colors.border,
  },

  leftRail: {
    alignSelf: 'stretch',
    minWidth: 112,
    maxWidth: 144,
    backgroundColor: THEME.colors.surface,
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
  railItemActiveBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: THEME.colors.white,
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
    top: 8,
    bottom: 8,
    width: 3,
    borderRadius: 2,
    backgroundColor: PRIMARY,
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
    backgroundColor: PRIMARY,
    marginLeft: 4,
  },
  pressedSoft: {
    opacity: 0.88,
  },

  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: THEME.colors.border,
  },

  rightPaneWrap: {
    flex: 1,
  },
  rightPane: {
    flex: 1,
  },
  rightPaneContent: {
    paddingVertical: THEME.spacing[8],
    paddingHorizontal: 4,
  },

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
    backgroundColor: PRIMARY_TINT,
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
    color: PRIMARY,
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
    borderColor: PRIMARY,
    backgroundColor: PRIMARY_TINT_STRONG,
  },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: PRIMARY,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
    paddingHorizontal: THEME.spacing[16],
    paddingTop: THEME.spacing[12],
    paddingBottom: THEME.spacing[28],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
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
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  applyBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  applyIcon: {
    marginTop: 0.5,
  },
  applyText: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.white,
    letterSpacing: -0.2,
  },
});
