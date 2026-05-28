export function toEnquiryPhone(mobile: string): string {
  const digits = mobile.replace(/\D/g, '');
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits;
}

export function buildEdpEnquiryMessage(params: {
  categoryName: string;
  segmentName: string;
  remark: string;
}): string {
  const parts = [
    `Category: ${params.categoryName}`,
    `Segment: ${params.segmentName}`,
  ];
  const trimmedRemark = params.remark.trim();
  if (trimmedRemark.length > 0) {
    parts.push(`Remark: ${trimmedRemark}`);
  }
  return parts.join(' | ');
}

export function findMasterName(
  items: Array<{ id: number; name: string }>,
  id: string,
): string {
  const match = items.find((item) => String(item.id) === id);
  return match?.name ?? id;
}
