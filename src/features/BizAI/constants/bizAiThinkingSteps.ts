/** Matches portal `ChatWidget` THINKING_STEPS (biz-assistant chat pipeline). */
export const BIZ_AI_THINKING_STEPS = [
  'Analyzing your request',
  'Identifying key details',
  'Finding relevant information',
] as const;

/** Interval while `POST /biz-assistant/chat` is in flight (portal: 900ms). */
export const BIZ_AI_THINKING_STEP_MS = 900;
