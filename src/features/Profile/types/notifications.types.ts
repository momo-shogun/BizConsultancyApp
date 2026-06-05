export type NotificationSectionKey = 'today' | 'yesterday' | 'earlier';

export type UserNotificationFilter = 'all' | 'bookings' | 'payments';

export type ConsultantNotificationFilter = 'all' | 'bookings' | 'payouts';

export type NotificationFilterCategory = 'bookings' | 'payments' | 'payouts' | 'general';

export type NotificationActionTone = 'orange' | 'teal';

export interface NotificationItem {
  id: string;
  section: NotificationSectionKey;
  filterCategory: NotificationFilterCategory;
  title: string;
  body: string;
  timeLabel: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  accentColor?: string;
  unread?: boolean;
  live?: boolean;
  showActions?: boolean;
  actionTone?: NotificationActionTone;
}

export interface NotificationSection {
  key: NotificationSectionKey;
  title: string;
  items: NotificationItem[];
}
