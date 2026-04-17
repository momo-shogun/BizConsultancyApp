import React from 'react';

import {
  SignupScreenContent as SignupScreenContentBase,
  type SignupScreenContentProps,
} from '@/features/Auth/components/SignupScreenContent';

type Props = Omit<SignupScreenContentProps, 'roleLabel'>;

export function SignupScreenContent(props: Props): React.ReactElement {
  return <SignupScreenContentBase {...props} roleLabel="Consultant" />;
}
