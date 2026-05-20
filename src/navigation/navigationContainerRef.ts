import { createNavigationContainerRef } from '@react-navigation/native';

import type { RootStackParamList } from './types';

/** Shared across app + native push paths to avoid cyclic imports through `RootNavigator`. */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
