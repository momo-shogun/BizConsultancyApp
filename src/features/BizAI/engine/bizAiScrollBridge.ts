import { makeMutable, withSpring } from 'react-native-reanimated';

import { BIZ_AI_MOTION, BIZ_AI_SPRING } from '../constants/bizAiMotionConfig';

export type BizAIScrollPayload = {
  offsetY: number;
  velocityY?: number;
};

/** Latest scroll offset (px). */
export const bizAiScrollY = makeMutable(0);

/** Estimated vertical velocity (px/s). */
export const bizAiScrollVelocityY = makeMutable(0);

/** Smoothed expand amount 0 (fully hidden) → 1 (fully revealed). */
export const bizAiExpand = makeMutable(0);

/** Smoothed compact morph 0 (full) → 1 (minimized pill). */
export const bizAiCompact = makeMutable(0);

/** Parallax lag layer 0 → 1 (trails expand motion). */
export const bizAiParallax = makeMutable(0);

/** 0 idle · 1 actively scrolling (decays on UI thread). */
export const bizAiScrollActivity = makeMutable(0);

const lastOffsetY = makeMutable(0);
const lastTimestamp = makeMutable(0);
const expandTarget = makeMutable(0);
const compactTarget = makeMutable(0);

function springExpand(to: number): void {
  'worklet';
  const growing = to >= expandTarget.value;
  expandTarget.value = to;
  bizAiExpand.value = withSpring(to, growing ? BIZ_AI_SPRING.reveal : BIZ_AI_SPRING.compact);
  bizAiParallax.value = withSpring(to, BIZ_AI_SPRING.parallax);
}

function springCompact(to: number): void {
  'worklet';
  if (Math.abs(to - compactTarget.value) < BIZ_AI_MOTION.targetEpsilon) {
    return;
  }
  compactTarget.value = to;
  bizAiCompact.value = withSpring(to, BIZ_AI_SPRING.compact);
}

function computeTargets(
  offsetY: number,
  deltaY: number,
  velocityY: number,
): { expand: number; compact: number } {
  'worklet';
  const scrollingDown = deltaY > BIZ_AI_MOTION.scrollDownDelta || velocityY > BIZ_AI_MOTION.scrollDownVelocity;
  const scrollingUpFast =
    deltaY < BIZ_AI_MOTION.scrollUpDelta || velocityY < BIZ_AI_MOTION.scrollUpVelocity;
  const nearTop = offsetY < BIZ_AI_MOTION.topInset;
  const idle =
    Math.abs(velocityY) < BIZ_AI_MOTION.idleVelocity && Math.abs(deltaY) < 1.2;

  if (nearTop) {
    return { expand: 0, compact: 0 };
  }

  if (scrollingUpFast) {
    return { expand: 0.8, compact: 0.88 };
  }

  if (scrollingDown || (idle && offsetY > BIZ_AI_MOTION.revealScrollY)) {
    return { expand: 1, compact: 0 };
  }

  if (idle) {
    return { expand: 0.92, compact: 0.15 };
  }

  return { expand: expandTarget.value, compact: compactTarget.value };
}

/** Call from tab screen `onScroll` handlers (UI thread). */
export function reportBizAIScroll(payload: BizAIScrollPayload): void {
  'worklet';
  const now = Date.now();
  const offsetY = Math.max(payload.offsetY, 0);
  const deltaY = offsetY - lastOffsetY.value;
  const elapsed = Math.max(now - lastTimestamp.value, 1);

  lastOffsetY.value = offsetY;
  lastTimestamp.value = now;

  bizAiScrollY.value = offsetY;

  const velocityY =
    payload.velocityY != null && Number.isFinite(payload.velocityY)
      ? payload.velocityY
      : (deltaY / elapsed) * 1000;
  bizAiScrollVelocityY.value = velocityY;

  const activityBump = Math.min(
    1,
    Math.abs(velocityY) / 900 + Math.abs(deltaY) / 36,
  );
  bizAiScrollActivity.value = Math.max(bizAiScrollActivity.value, activityBump);

  const { expand, compact } = computeTargets(offsetY, deltaY, velocityY);

  if (Math.abs(expand - expandTarget.value) >= BIZ_AI_MOTION.targetEpsilon) {
    springExpand(expand);
  }

  springCompact(compact);
}

/** Decay scroll activity — invoke from `useFrameCallback` on UI thread. */
export function decayBizAIScrollActivity(deltaMs: number): void {
  'worklet';
  if (bizAiScrollActivity.value <= 0) {
    return;
  }
  bizAiScrollActivity.value = Math.max(
    0,
    bizAiScrollActivity.value - deltaMs * BIZ_AI_MOTION.activityDecayPerMs,
  );
}

export function resetBizAIScrollBridge(): void {
  'worklet';
  lastOffsetY.value = 0;
  lastTimestamp.value = 0;
  expandTarget.value = 0;
  compactTarget.value = 0;
  bizAiScrollY.value = 0;
  bizAiScrollVelocityY.value = 0;
  bizAiExpand.value = 0;
  bizAiCompact.value = 0;
  bizAiParallax.value = 0;
  bizAiScrollActivity.value = 0;
}
