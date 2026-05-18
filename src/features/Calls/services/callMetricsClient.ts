export type ClientCallMetric =
  | 'time_to_ring_ms'
  | 'call_setup_latency_ms'
  | 'reconnect_count'
  | 'packet_loss_pct';

export function recordCallMetric(
  metric: ClientCallMetric,
  value: number,
  tags?: Record<string, string>,
): void {
  if (__DEV__) {
    console.log('[voip_metric]', metric, value, tags ?? {});
  }
}
