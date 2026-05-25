import type { ComponentProps } from 'react';
import type Ionicons from 'react-native-vector-icons/Ionicons';

export type DiagnosisStatusIconName = ComponentProps<typeof Ionicons>['name'];

export interface DiagnosisStatusVisual {
  icon: DiagnosisStatusIconName;
  color: string;
  label: string;
}

export function getDiagnosisStatusVisual(userStatus: string): DiagnosisStatusVisual {
  switch (userStatus) {
    case 'requested':
      return { icon: 'time-outline', color: '#2563EB', label: 'Requested' };
    case 'delivered':
      return { icon: 'checkmark-circle-outline', color: '#059669', label: 'Delivered' };
    case 'in_progress':
      return { icon: 'hourglass-outline', color: '#D97706', label: 'In progress' };
    case 'not_available':
      return { icon: 'close-circle-outline', color: '#DC2626', label: 'Not available' };
    case 'pending':
    default:
      return { icon: 'ellipse-outline', color: '#94A3B8', label: 'Queued' };
  }
}

export function isDiagnosisFeatureRequestDisabled(adminStatus: string): boolean {
  return (
    adminStatus === 'requested' ||
    adminStatus === 'delivered' ||
    adminStatus === 'not_available'
  );
}

export function diagnosisFeatureRequestLabel(adminStatus: string): string {
  if (adminStatus === 'requested') {
    return 'Requested';
  }
  return 'Request';
}

export function isImageDiagnosisDocument(
  mimeType: string | null,
  filename: string | null,
): boolean {
  const mime = (mimeType ?? '').toLowerCase();
  if (mime.startsWith('image/')) {
    return true;
  }
  const name = (filename ?? '').toLowerCase();
  return ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.svg'].some((ext) =>
    name.endsWith(ext),
  );
}
