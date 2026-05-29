import { Platform, StatusBar } from 'react-native';

/** Home shell uses light tinted headers — always use dark status bar icons. */
export const HOME_STATUS_BAR_STYLE = 'dark-content' as const;

export function applyHomeStatusBar(backgroundColor: string): void {
  StatusBar.setBarStyle(HOME_STATUS_BAR_STYLE, true);
  if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor(backgroundColor, true);
    StatusBar.setTranslucent(false);
  }
}

/** Re-apply on next frame so Android does not revert after tab background changes. */
export function applyHomeStatusBarSoon(backgroundColor: string): void {
  applyHomeStatusBar(backgroundColor);
  requestAnimationFrame(() => {
    applyHomeStatusBar(backgroundColor);
  });
}
