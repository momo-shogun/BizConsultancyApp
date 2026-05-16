import React, { useEffect } from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';

import { store } from '@/store';

import { AuthProvider, useAuth } from './AuthProvider';

function TestConsumer(props: { action?: 'complete' | 'context' }): React.ReactElement {
  const { state, completeOnboarding, selectAccountContext } = useAuth();

  useEffect(() => {
    if (props.action === 'complete') completeOnboarding();
    if (props.action === 'context') selectAccountContext({ userType: 'consultant', authIntent: 'signup' });
  }, [props.action, completeOnboarding, selectAccountContext]);

  return (
    <Text>
      {state.isAuthenticated ? 'AUTH' : 'NOAUTH'}|{state.userType ?? 'NONE'}|{state.authIntent ?? 'NONE'}
    </Text>
  );
}

test('AuthProvider exposes flow context', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | null = null;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <Provider store={store}>
        <AuthProvider>
          <TestConsumer action="context" />
        </AuthProvider>
      </Provider>,
    );
  });

  const textNodes = tree!.root.findAllByType(Text);
  expect(textNodes[0]?.props.children).toBe('NOAUTH|consultant|signup');
});
