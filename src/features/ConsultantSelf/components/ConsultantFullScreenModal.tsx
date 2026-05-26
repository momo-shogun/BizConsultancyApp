import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import { PROFILE_HEADER_GRADIENT } from '@/features/Profile/constants/profileScreenTheme';

export const CONSULTANT_MODAL_SCRIM = 'rgba(15, 23, 42, 0.72)';

const FOOTER_PADDING = 12;
const HANDLE_ROW_HEIGHT = 14;
const MIN_SCROLL_HEIGHT = 120;

export interface ConsultantFullScreenModalProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function ConsultantFullScreenModal({
  visible,
  title,
  subtitle,
  eyebrow = 'Consultant dashboard',
  onClose,
  children,
  footer,
  contentContainerStyle,
}: ConsultantFullScreenModalProps): React.ReactElement {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const footerBottomInset = FOOTER_PADDING + insets.bottom;
  const maxSheetHeight = Math.round(windowHeight * 0.92);

  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  const onHeaderLayout = useCallback((event: LayoutChangeEvent): void => {
    setHeaderHeight(event.nativeEvent.layout.height);
  }, []);

  const onFooterLayout = useCallback((event: LayoutChangeEvent): void => {
    setFooterHeight(event.nativeEvent.layout.height);
  }, []);

  useEffect(() => {
    if (!visible) {
      setHeaderHeight(0);
      setFooterHeight(0);
    }
  }, [visible]);

  useEffect(() => {
    if (footer == null) {
      setFooterHeight(0);
    }
  }, [footer]);

  const scrollMaxHeight = Math.max(
    MIN_SCROLL_HEIGHT,
    maxSheetHeight - headerHeight - footerHeight - HANDLE_ROW_HEIGHT,
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[styles.sheetHost, { maxHeight: maxSheetHeight }]}
          pointerEvents="box-none"
        >
          <View style={[styles.sheet, { maxHeight: maxSheetHeight }]} pointerEvents="auto">
            <View style={styles.handleRow}>
              <View style={styles.handle} />
            </View>

            <View onLayout={onHeaderLayout}>
              <LinearGradient
                colors={[...PROFILE_HEADER_GRADIENT]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
              >
                <Text style={styles.eyebrow}>{eyebrow}</Text>
                <Text style={styles.title}>{title}</Text>
                {subtitle != null && subtitle.length > 0 ? (
                  <Text style={styles.subtitle}>{subtitle}</Text>
                ) : null}
              </LinearGradient>
            </View>

            <ScrollView
              style={{ maxHeight: scrollMaxHeight }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
              nestedScrollEnabled
              bounces
              contentContainerStyle={[styles.scrollBody, contentContainerStyle]}
            >
              {children}
            </ScrollView>

            {footer != null ? (
              <View
                onLayout={onFooterLayout}
                style={[styles.footer, { paddingBottom: footerBottomInset }]}
              >
                {footer}
              </View>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: CONSULTANT_MODAL_SCRIM,
    justifyContent: 'flex-end',
  },
  sheetHost: {
    width: '100%',
  },
  sheet: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 2,
    backgroundColor: '#FFFFFF',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 10,
    backgroundColor: '#FFFFFF',
  },
});
