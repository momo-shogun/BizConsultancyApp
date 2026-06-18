import { ROUTES } from '@/navigation/routeNames';
import { navigationRef } from '@/navigation/navigationContainerRef';

export function navigateToMyServices(isConsultant: boolean): void {
  if (!navigationRef.isReady()) {
    return;
  }

  navigationRef.navigate(ROUTES.Root.App, {
    screen: ROUTES.App.Account,
    params: {
      screen: isConsultant ? ROUTES.Account.ConsultantMyServices : ROUTES.Account.MyServices,
    },
  });
}
