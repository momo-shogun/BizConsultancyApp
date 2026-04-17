import React, { useEffect } from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { AuthProvider, useAuth } from './AuthProvider';

function TestConsumer(props: { action?: 'complete' | 'logout' | 'context' }): React.ReactElement {
  const { state, completeOnboarding, logout, selectAccountContext } = useAuth();

  useEffect(() => {
    if (props.action === 'complete') completeOnboarding();
    if (props.action === 'logout') logout();
    if (props.action === 'context') selectAccountContext({ userType: 'consultant', authIntent: 'signup' });
  }, [props.action, completeOnboarding, logout, selectAccountContext]);

  return (
    <Text>
      {state.isAuthenticated ? 'AUTH' : 'NOAUTH'}|{state.userType ?? 'NONE'}|{state.authIntent ?? 'NONE'}
    </Text>
  );
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
  expect(textNodes[0]?.props.children).toBe('NOAUTH|NONE|NONE');
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
  expect(textNodes[0]?.props.children).toBe('AUTH|NONE|NONE');
});

test('AuthProvider can set account context', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | null = null;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <AuthProvider>
        <TestConsumer action="context" />
      </AuthProvider>,
    );
  });

  const textNodes = tree!.root.findAllByType(Text);
  expect(textNodes[0]?.props.children).toBe('NOAUTH|consultant|signup');
});

