import React, { useEffect } from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { AuthProvider, useAuth } from './AuthProvider';

function TestConsumer(props: { action?: 'complete' | 'logout' }): React.ReactElement {
  const { state, completeOnboarding, logout } = useAuth();

  useEffect(() => {
    if (props.action === 'complete') completeOnboarding();
    if (props.action === 'logout') logout();
  }, [props.action, completeOnboarding, logout]);

  return <Text>{state.isAuthenticated ? 'AUTH' : 'NOAUTH'}</Text>;
}

test('AuthProvider defaults to not authenticated', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | null = null;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
  });

  const textNodes = tree!.root.findAllByType(Text);
  expect(textNodes[0]?.props.children).toBe('NOAUTH');
});

test('AuthProvider can complete onboarding', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | null = null;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <AuthProvider>
        <TestConsumer action="complete" />
      </AuthProvider>,
    );
  });

  const textNodes = tree!.root.findAllByType(Text);
  expect(textNodes[0]?.props.children).toBe('AUTH');
});

