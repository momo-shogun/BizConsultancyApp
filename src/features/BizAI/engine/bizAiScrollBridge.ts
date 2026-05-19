import { makeMutable } from 'react-native-reanimated';

/** Latest vertical scroll offset from the active tab screen. */
export const bizAiScrollY = makeMutable(0);

/** Per-frame scroll delta (positive = scrolling down). */
export const bizAiScrollDeltaY = makeMutable(0);

/** 0 hidden · 1 expanded · 0.72 compact */
export const bizAiVisibilityProgress = makeMutable(1);

const lastScrollY = makeMutable(0);

/** Call from any tab screen scroll handler (UI thread). */
export function reportBizAIScroll(offsetY: number): void {
  'worklet';
  const delta = offsetY - lastScrollY.value;
  lastScrollY.value = offsetY;
  bizAiScrollY.value = offsetY;
  bizAiScrollDeltaY.value = delta;

  if (offsetY < 24) {
    bizAiVisibilityProgress.value = 0.55;
    return;
  }

  if (delta > 6) {
    bizAiVisibilityProgress.value = 1;
    return;
  }

  if (delta < -14) {
    bizAiVisibilityProgress.value = 0.72;
  }
}

export function resetBizAIScrollBridge(): void {
  'worklet';
  lastScrollY.value = 0;
  bizAiScrollY.value = 0;
  bizAiScrollDeltaY.value = 0;
  bizAiVisibilityProgress.value = 1;
}
