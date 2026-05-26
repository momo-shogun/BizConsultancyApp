import { Linking } from 'react-native';

import { showGlobalToast } from '@/shared/components';

export async function openEdpModulePdf(url: string, moduleName: string): Promise<void> {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      showGlobalToast({
        variant: 'error',
        title: 'PDF unavailable',
        message: 'This module PDF could not be opened on your device.',
      });
      return;
    }
    await Linking.openURL(url);
    showGlobalToast({
      variant: 'info',
      title: 'Opening PDF',
      message: `${moduleName} — use your browser or viewer to save the file.`,
      duration: 4000,
    });
  } catch {
    showGlobalToast({
      variant: 'error',
      title: 'Could not open PDF',
      message: 'Please try again in a moment.',
    });
  }
}
