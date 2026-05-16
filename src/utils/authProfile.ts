import type { AuthRole } from '@/features/Auth/types/authApi.types';
import { formatAccountRoleLabel } from '@/features/Auth/store/authSelectors';

/**
 * Builds profile card subtitle: `Role · +91 XXXXX XXXXX` (omits empty parts).
 */
export function buildProfileCardSubtitle(
  role: AuthRole | null | undefined,
  formattedPhone: string | null,
): string {
  const parts: string[] = [];
  const roleLabel = formatAccountRoleLabel(role);
  if (roleLabel !== 'Member') {
    parts.push(roleLabel);
  }
  if (formattedPhone != null && formattedPhone.length > 0) {
    parts.push(formattedPhone);
  }
  return parts.join(' · ');
}
