import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { ZeptoHeaderV1Props } from '../../navigation/Header/ZeptoHeaderV1.types';
import type { ZeptoTabCProps } from '../../Tabs/ZeptoTabC.types';

export interface ZeptoHSProps {
  header: ZeptoHeaderV1Props;
  tabStrip: ZeptoTabCProps;
  children?: ReactNode;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

