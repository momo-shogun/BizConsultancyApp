import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

/** Standard push onto root stack (Flipkart / Zepto-style slide from right). */
export const rootSlideFromRightScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  gestureEnabled: true,
  fullScreenGestureEnabled: true,
};
