import React from 'react';

import {
  LoginScreenContent as LoginScreenContentBase,
  type LoginScreenContentProps,
} from '@/features/Auth/components/LoginScreenContent/LoginScreenContent';

type Props = Omit<LoginScreenContentProps, 'roleLabel'>;

export function LoginScreenContent(props: Props): React.ReactElement {
  return <LoginScreenContentBase {...props} roleLabel="Consultant" />;
}

