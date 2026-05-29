import React from 'react';
import { Text, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { bizAiCreditsScreenStyles as s } from '../screens/BizAiCreditsScreen.styles';

export interface BizAiCreditsAlertBannerProps {
  variant: 'error' | 'success';
  message: string;
}

export function BizAiCreditsAlertBanner({
  variant,
  message,
}: BizAiCreditsAlertBannerProps): React.ReactElement {
  const isError = variant === 'error';

  return (
    <View style={[s.alertBanner, isError ? s.alertBannerError : s.alertBannerSuccess]}>
      <Ionicons
        name={isError ? 'alert-circle' : 'checkmark-circle'}
        size={20}
        color={isError ? '#DC2626' : '#059669'}
      />
      <Text
        style={[
          s.alertBannerText,
          isError ? s.alertBannerTextError : s.alertBannerTextSuccess,
        ]}
      >
        {message}
      </Text>
    </View>
  );
}
