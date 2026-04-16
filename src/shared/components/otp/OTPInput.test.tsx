import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { OTPInput } from './OTPInput';

test('OTPInput renders digits', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | null = null;

  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <OTPInput value="123" length={6} onChange={() => undefined} accessibilityLabel="OTP input" />,
    );
  });

  const texts = tree!.root.findAllByType(Text).map((t) => t.props.children);
  expect(texts.join('')).toContain('123');
});

