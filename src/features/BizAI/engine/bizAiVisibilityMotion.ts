import { Extrapolation, interpolate } from 'react-native-reanimated';

import { BIZ_AI_MOTION } from '../constants/bizAiMotionConfig';

/** Single 0→1 gate for opacity, shadow, glow, scale, and pointer events. */
export function computeBizAiMasterVisibility(expand: number, tabGate: number): number {
  'worklet';
  const reveal = interpolate(
    expand,
    [
      BIZ_AI_MOTION.visibilityHiddenExpand,
      BIZ_AI_MOTION.visibilityFadeInStart,
      BIZ_AI_MOTION.visibilityFullExpand,
      1,
    ],
    [0, 0, 1, 1],
    Extrapolation.CLAMP,
  );
  return reveal * tabGate;
}
