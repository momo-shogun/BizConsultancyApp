import React from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { THEME } from '@/constants/theme';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
  textContentType?: 'emailAddress' | 'password' | 'telephoneNumber' | 'oneTimeCode' | 'name';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  accessibilityLabel: string;
  maxLength?: number;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  rightAdornment?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function Input(props: InputProps): React.ReactElement {
  const focus = useSharedValue(0);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focus.value,
      [0, 1],
      [THEME.colors.border, THEME.colors.primary],
    );

    // iOS shadow + Android elevation. Keep subtle for production UI.
    const shadowOpacity = withTiming(focus.value === 1 ? 0.12 : 0, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });

    return {
      borderColor,
      shadowColor: THEME.colors.primary,
      shadowOpacity,
      shadowRadius: withTiming(focus.value === 1 ? 10 : 0, {
        duration: 180,
        easing: Easing.out(Easing.cubic),
      }),
      shadowOffset: {
        width: 0,
        height: 6,
      },
      elevation: withTiming(focus.value === 1 ? 3 : 0, {
        duration: 180,
        easing: Easing.out(Easing.cubic),
      }),
    };
  }, []);

  return (
    <View style={styles.container}>
      {props.label ? <Text style={styles.label}>{props.label}</Text> : null}
      <Animated.View
        style={[styles.inputContainer, animatedContainerStyle, props.containerStyle]}
      >
        <View style={styles.row}>
          <TextInput
            accessibilityLabel={props.accessibilityLabel}
            style={[styles.input, props.inputStyle]}
            value={props.value}
            onChangeText={props.onChangeText}
            placeholder={props.placeholder}
            placeholderTextColor={THEME.colors.textSecondary}
            secureTextEntry={props.secureTextEntry}
            keyboardType={props.keyboardType}
            textContentType={props.textContentType}
            maxLength={props.maxLength}
            autoCapitalize={props.autoCapitalize ?? 'none'}
            onFocus={() => {
              focus.value = withTiming(1, { duration: 160, easing: Easing.out(Easing.cubic) });
              props.onFocus?.();
            }}
            onBlur={() => {
              focus.value = withTiming(0, { duration: 160, easing: Easing.out(Easing.cubic) });
              props.onBlur?.();
            }}
          />
          {props.rightAdornment ? (
            <View style={styles.rightAdornment}>{props.rightAdornment}</View>
          ) : null}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: THEME.spacing[8],
  },
  label: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.medium,
    color: THEME.colors.textPrimary,
  },
  inputContainer: {
    minHeight: 48,
    borderRadius: THEME.radius[12],
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
  },
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: THEME.spacing[16],
    color: THEME.colors.textPrimary,
    fontSize: THEME.typography.size[16],
  },
  rightAdornment: {
    paddingRight: THEME.spacing[12],
  },
});

