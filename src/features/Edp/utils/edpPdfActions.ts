import { navigationRef } from '@/navigation/navigationContainerRef';
import { ROUTES } from '@/navigation/routeNames';
import { showGlobalToast } from '@/shared/components';

export function openEdpModulePdf(url: string, moduleName: string): void {
  const trimmedUrl = url.trim();
  if (trimmedUrl.length === 0) {
    showGlobalToast({
      variant: 'error',
      title: 'PDF unavailable',
      message: 'This module PDF could not be opened on your device.',
    });
    return;
  }

  if (!navigationRef.isReady()) {
    showGlobalToast({
      variant: 'error',
      title: 'Could not open PDF',
      message: 'Please try again in a moment.',
    });
    return;
  }

  navigationRef.navigate(ROUTES.Root.App, {
    screen: ROUTES.App.Edp,
    params: {
      screen: ROUTES.Edp.ModulePdf,
      params: {
        title: moduleName.trim().length > 0 ? moduleName.trim() : 'Module PDF',
        pdfUrl: trimmedUrl,
      },
    },
  });
}
