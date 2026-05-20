/** Reanimated spring presets — tuned for floating UI (no harsh overshoot). */
export const BIZ_AI_SPRING = {
  reveal: { damping: 19, stiffness: 210, mass: 0.88 },
  compact: { damping: 23, stiffness: 260, mass: 0.78 },
  parallax: { damping: 28, stiffness: 165, mass: 1.05 },
  press: { damping: 16, stiffness: 380, mass: 0.55 },
  tabGate: { damping: 22, stiffness: 240, mass: 0.8 },
} as const;

export const BIZ_AI_MOTION = {
  /** Scroll offset below which the entry is fully hidden. */
  topInset: 24,
  /** Minimum scroll depth before full reveal can latch. */
  revealScrollY: 48,
  /** Expand value below which master visibility is exactly zero. */
  visibilityHiddenExpand: 0,
  /** Expand at which fade-in begins (buffers spring overshoot). */
  visibilityFadeInStart: 0.1,
  /** Expand at which the entry is fully opaque. */
  visibilityFullExpand: 0.82,
  /** Master visibility under this — no hit testing, no display. */
  visibilityHitTestCutoff: 0.04,
  /** Delta Y per frame — scroll down. */
  scrollDownDelta: 1.5,
  /** Velocity Y (px/s) — scroll down. */
  scrollDownVelocity: 90,
  /** Fast scroll up — compact, not hidden. */
  scrollUpVelocity: -220,
  scrollUpDelta: -6,
  /** Target change threshold before starting a new spring. */
  targetEpsilon: 0.012,
  /** Idle velocity magnitude (px/s). */
  idleVelocity: 55,
  /** Activity decay rate per ms (UI thread). */
  activityDecayPerMs: 0.0042,
} as const;
