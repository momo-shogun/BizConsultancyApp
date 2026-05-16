import type {
  ConsultationDateOption,
  ConsultationTimePeriod,
  ConsultationTimeSlot,
} from '../types/consultationOnboarding.types';

const PERIOD_LABELS: Record<ConsultationTimePeriod, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  night: 'Night',
};

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function addDays(base: Date, days: number): Date {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

export function buildConsultationDateOptions(count = 7): ConsultationDateOption[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: count }, (_, index) => {
    const date = addDays(today, index);
    const slotCount = index === 0 ? 4 : index % 3 === 0 ? 2 : 6;
    return {
      id: `date-${index}`,
      date,
      label: formatDateLabel(date),
      slotCount,
      availability: slotCount <= 3 ? 'limited' : 'available',
    };
  });
}

const SLOT_TEMPLATES: Array<{ label: string; period: ConsultationTimePeriod; available: boolean }> = [
  { label: '07:30 PM', period: 'evening', available: true },
  { label: '08:00 PM', period: 'night', available: false },
  { label: '08:30 PM', period: 'night', available: false },
  { label: '09:00 PM', period: 'night', available: false },
  { label: '09:30 PM', period: 'night', available: false },
  { label: '10:00 PM', period: 'night', available: true },
  { label: '10:30 PM', period: 'night', available: true },
  { label: '11:00 PM', period: 'night', available: false },
  { label: '11:30 PM', period: 'night', available: true },
];

export function buildConsultationTimeSlots(): ConsultationTimeSlot[] {
  return SLOT_TEMPLATES.map((slot, index) => ({
    id: `slot-${index}`,
    ...slot,
  }));
}

export function groupSlotsByPeriod(
  slots: ConsultationTimeSlot[],
): Array<{ period: ConsultationTimePeriod; label: string; slots: ConsultationTimeSlot[] }> {
  const order: ConsultationTimePeriod[] = ['morning', 'afternoon', 'evening', 'night'];
  return order
    .map((period) => ({
      period,
      label: PERIOD_LABELS[period],
      slots: slots.filter((slot) => slot.period === period),
    }))
    .filter((group) => group.slots.length > 0);
}

export function formatPreviewDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
