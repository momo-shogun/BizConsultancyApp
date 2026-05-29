import React, { useEffect } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';

const EXPAND_SPRING = {
  damping: 19,
  stiffness: 240,
  mass: 0.72,
} as const;

const COLLAPSE_SPRING = {
  damping: 22,
  stiffness: 280,
  mass: 0.65,
} as const;

const EXPANDED_HEIGHT = 58;

export interface AnimatedHeaderSearchBarProps {
  visible: boolean;
  value: string;
  onChangeText: (value: string) => void;
  inputRef: React.RefObject<TextInput | null>;
  placeholder: string;
  accessibilityLabel: string;
  /** When true, sits inside a gradient header — tighter vertical spacing */
  embeddedInHeader?: boolean;
}

export function AnimatedHeaderSearchBar(props: AnimatedHeaderSearchBarProps): React.ReactElement {
  const progress = useSharedValue(props.visible ? 1 : 0);

  useEffect(() => {
    const focusInput = (): void => {
      props.inputRef.current?.focus();
    };

    if (props.visible) {
      progress.value = withSpring(1, EXPAND_SPRING, (finished) => {
        if (finished) {
          runOnJS(focusInput)();
        }
      });
      return;
    }

    progress.value = withSpring(0, COLLAPSE_SPRING);
  }, [props.inputRef, props.visible, progress]);

  const embedded = props.embeddedInHeader === true;
  const expandedTopGap = embedded ? THEME.spacing[4] : THEME.spacing[8];
  const expandedBottomGap = embedded ? 0 : THEME.spacing[4];

  const containerStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      height: interpolate(p, [0, 1], [0, EXPANDED_HEIGHT], Extrapolation.CLAMP),
      opacity: interpolate(p, [0, 0.4, 1], [0, 0.85, 1], Extrapolation.CLAMP),
      marginTop: interpolate(p, [0, 1], [0, expandedTopGap], Extrapolation.CLAMP),
      marginBottom: interpolate(p, [0, 1], [0, expandedBottomGap], Extrapolation.CLAMP),
    };
  });

  const fieldStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      transform: [
        { translateY: interpolate(p, [0, 1], [-10, 0], Extrapolation.CLAMP) },
        { scale: interpolate(p, [0, 1], [0.94, 1], Extrapolation.CLAMP) },
      ],
    };
  });

  return (
    <Animated.View
      style={[styles.outer, containerStyle]}
      pointerEvents={props.visible ? 'auto' : 'none'}
      accessibilityElementsHidden={!props.visible}
      importantForAccessibility={props.visible ? 'auto' : 'no-hide-descendants'}
    >
      <Animated.View style={[styles.searchWrap, fieldStyle]}>
        <Ionicons name="search-outline" size={18} color="#8696A0" />
        <TextInput
          ref={props.inputRef}
          value={props.value}
          onChangeText={props.onChangeText}
          placeholder={props.placeholder}
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel={props.accessibilityLabel}
        />
        {props.value.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={() => props.onChangeText('')}
            hitSlop={8}
          >
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </Pressable>
        ) : null}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer: {
    overflow: 'hidden',
    paddingHorizontal: THEME.spacing[16],
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    backgroundColor: THEME.colors.white,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E9EDEF',
    paddingHorizontal: THEME.spacing[12],
    shadowColor: '#075E54',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 11,
    fontSize: THEME.typography.size[14],
    color: THEME.colors.textPrimary,
  },
});
