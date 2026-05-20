import { useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';

type KeyboardEventLike = {
  endCoordinates: { height: number };
  duration?: number;
};

export function useBizAIKeyboardInset(): {
  keyboardHeight: ReturnType<typeof useSharedValue<number>>;
} {
  const keyboardHeight = useSharedValue(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (event: KeyboardEventLike): void => {
      const duration = event.duration ?? (Platform.OS === 'ios' ? 250 : 200);
      keyboardHeight.value = withTiming(event.endCoordinates.height, { duration });
    };

    const onHide = (event: KeyboardEventLike): void => {
      const duration = event.duration ?? (Platform.OS === 'ios' ? 200 : 150);
      keyboardHeight.value = withTiming(0, { duration });
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [keyboardHeight]);

  return { keyboardHeight };
}
