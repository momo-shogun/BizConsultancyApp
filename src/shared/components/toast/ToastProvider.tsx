import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { setToastRef } from './toastRef';
import { Toast } from './toast';
import type { ToastConfig, ToastContextValue } from './toast.types';

type ToastState = {
  visible: boolean;
  config: ToastConfig | null;
};

const INITIAL_STATE: ToastState = {
  visible: false,
  config: null,
};

export function ToastProvider(props: React.PropsWithChildren): React.ReactElement {
  const [state, setState] = useState<ToastState>(INITIAL_STATE);

  const dismiss = useCallback((): void => {
    setState((prev) => ({ ...prev, visible: false }));
  }, []);

  const show = useCallback((config: ToastConfig | string): void => {
    const next: ToastConfig =
      typeof config === 'string' ? { message: config, variant: 'info' } : config;
    setState({ visible: true, config: next });
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (message: string, title?: string) =>
        show({ variant: 'success', message, title }),
      error: (message: string, title?: string) =>
        show({ variant: 'error', message, title }),
      warning: (message: string, title?: string) =>
        show({ variant: 'warning', message, title }),
      info: (message: string, title?: string) =>
        show({ variant: 'info', message, title }),
      alert: (message: string, title?: string) =>
        show({ variant: 'alert', message, title }),
      dismiss,
    }),
    [dismiss, show],
  );

  useEffect(() => {
    setToastRef(value);
    return () => {
      setToastRef(null);
    };
  }, [value]);

  const active = state.config;

  return (
    <>
      {props.children}
      {active != null ? (
        <Toast
          visible={state.visible}
          variant={active.variant}
          title={active.title}
          message={active.message}
          duration={active.duration}
          action={active.action}
          dismissible={active.dismissible}
          position={active.position}
          onDismiss={dismiss}
        />
      ) : null}
    </>
  );
}
