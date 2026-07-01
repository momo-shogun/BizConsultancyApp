import { navigationRef } from '@/navigation/navigationContainerRef';
import { ROUTES } from '@/navigation/routeNames';
import { showGlobalToast } from '@/shared/components';

const ENROLL_MESSAGE = 'Enroll in the EDP programme to access this content.';
const CONSULTANT_MESSAGE = 'Switch to a user account to enroll in EDP.';

export function promptEdpEnrollment(options?: { isConsultant?: boolean }): void {
  const isConsultant = options?.isConsultant === true;

  showGlobalToast({
    variant: 'info',
    title: 'Enrollment required',
    message: isConsultant ? CONSULTANT_MESSAGE : ENROLL_MESSAGE,
    duration: 4000,
  });

  if (!navigationRef.isReady()) {
    return;
  }

  navigationRef.navigate(ROUTES.Root.App, {
    screen: ROUTES.App.Account,
    params: { screen: ROUTES.Account.MyEdp },
  });
}
