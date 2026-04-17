import React from 'react';

import {
  ProfileSetupScreenContent as ProfileSetupScreenContentBase,
  type ProfileSetupScreenContentProps,
} from '@/features/Auth/components/ProfileSetupScreenContent/ProfileSetupScreenContent';

type Props = Omit<ProfileSetupScreenContentProps, 'roleLabel' | 'companyLabel' | 'companyPlaceholder'>;

export function ProfileSetupScreenContent(props: Props): React.ReactElement {
  return (
    <ProfileSetupScreenContentBase
      {...props}
      roleLabel="Consultant"
      companyLabel="Practice / firm (optional)"
      companyPlaceholder="Consulting firm"
    />
  );
}
