import type { ComponentProps } from 'react';
import type Ionicons from 'react-native-vector-icons/Ionicons';

export type SettingsIconName = ComponentProps<typeof Ionicons>['name'];

export interface SettingsRowConfig {
  id: string;
  icon: SettingsIconName;
  iconColor: string;
  iconBgColor: string;
  title: string;
  subtitle: string;
}

export interface SettingsSectionConfig {
  id: string;
  title: string;
  rows: SettingsRowConfig[];
}
