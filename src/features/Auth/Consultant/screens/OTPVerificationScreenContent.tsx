import React from 'react';

import {
  OTPVerificationScreenContent as OTPVerificationScreenContentBase,
  type OTPVerificationScreenContentProps,
} from '@/features/Auth/components/OTPVerificationScreenContent/OTPVerificationScreenContent';

type Props = Omit<OTPVerificationScreenContentProps, 'roleLabel'>;

export function OTPVerificationScreenContent(props: Props): React.ReactElement {
  return <OTPVerificationScreenContentBase {...props} roleLabel="Consultant" />;
}
