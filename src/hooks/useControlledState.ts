import { useCallback, useMemo, useState } from 'react';

/**
 * Small controlled/uncontrolled helper.
 * If `value` is provided, state is controlled and `setValue` only calls `onChange`.
 * Otherwise, internal state is used.
 */
export function useControlledState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): readonly [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);

  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return useMemo(() => [current, setValue] as const, [current, setValue]);
}

