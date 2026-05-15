import React from 'react';
import { Pressable, StyleSheet, Text, View, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';



interface ScreenHeaderProps {
  title: string;
  onBackPress?: () => void;
  onSearchPress?: () => void;
  headerColor?: string;
  showConsultantActions?: boolean;
  onCallPress?: () => void;
  onMessagePress?: () => void;
  showLanguageSwitch?: boolean;
  lang?: 'ENG' | 'HI';
  onLangSwitch?: (lang: 'ENG' | 'HI') => void;
}



export function ScreenHeader(props: ScreenHeaderProps): React.ReactElement {
  const hasBack = props.onBackPress != null;
  const hasSearch = props.onSearchPress != null;

  const isCustomHeader = !!props.headerColor;
  const showConsultantActions = props.showConsultantActions ?? false;
  const isLang = props.showLanguageSwitch ?? false;
  const lang = props.lang ?? 'ENG';

  function onLangSwitch(newLang: 'ENG' | 'HI'): void {
    props.onLangSwitch?.(newLang);
  }

  return (
    <View
      style={[
        styles.container,
        isCustomHeader && {
          backgroundColor: props.headerColor,
        },
      ]}
    >
      <View style={styles.left}>
        {hasBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={props.onBackPress}
            hitSlop={8}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={isCustomHeader ? "#fff" : THEME.colors.textPrimary}
            />
          </Pressable>
        ) : null}

        <Text
          style={[
            styles.title,
            {
              color: isCustomHeader
                ? "#fff"
                : THEME.colors.textPrimary,
            },
          ]}
        >
          {props.title}
        </Text>
      </View>

      {hasSearch ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search"
          onPress={props.onSearchPress}
          hitSlop={8}
          style={styles.rightButton}
        >
          <Ionicons
            name="search"
            size={20}
            color={isCustomHeader ? "#fff" : THEME.colors.textPrimary}
          />
        </Pressable>
      ) : null}

      {showConsultantActions ? (
        <View style={styles.consultant}>
          {/* Call Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Call"
            onPress={props.onCallPress}
            hitSlop={10}
            style={[
              styles.actionButton,
              styles.callButton,
              isCustomHeader && styles.actionButtonDark,
            ]}
          >
            <Ionicons
              name="call"
              size={18}
              color={isCustomHeader ? "#fff" : "#16a34a"}
            />
          </Pressable>

          {/* Message Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Message"
            onPress={props.onMessagePress}
            hitSlop={10}
            style={[
              styles.actionButton,
              styles.messageButton,
              isCustomHeader && styles.actionButtonDark,
            ]}
          >
            <Ionicons
              name="chatbubble-outline"
              size={18}
              color={isCustomHeader ? "#fff" : THEME.colors.textPrimary}
            />
          </Pressable>
        </View>

      ) : null}

      {isLang ? (
        <View style={styles.langToggle}>
          <Pressable
            style={[styles.langBtn, lang === 'ENG' && styles.langBtnActive]}
            onPress={() => onLangSwitch('ENG')}
          //activeOpacity={0.8}
          >
            <Text style={lang === 'ENG' ? styles.langBtnActiveText : styles.langBtnText}>EN</Text>
          </Pressable>
          <Pressable
            style={[styles.langBtn, lang === 'HI' && styles.langBtnActive]}
            onPress={() => onLangSwitch('HI')}
          //activeOpacity={0.8}
          >
            <Text style={lang === 'HI' ? styles.langBtnActiveText : styles.langBtnText}>हिंदी</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    paddingHorizontal: THEME.spacing[16],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.background,
  },
  langToggle: {
    flexDirection: 'row',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  langBtn: {
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[4],
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textSecondary,
    backgroundColor: 'transparent',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  right: {
    width: 32,
  },
  langBtnText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.white,
  },
  langBtnActive: {
    backgroundColor: THEME.colors.accentGreen,
  },
  langBtnActiveText: {
    color: 'white',
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: THEME.typography.size[18],
    fontWeight: THEME.typography.weight.semibold,
    color: THEME.colors.textPrimary,
  },
  consultant: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  actionButton: {
    width: 42,
    height: 42,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  actionButtonDark: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.2)",
  },

  callButton: {
    backgroundColor: "#ECFDF3",
    borderColor: "#BBF7D0",
  },

  messageButton: {
    backgroundColor: "#F9FAFB",
  },
});

