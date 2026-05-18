import type { CallEventEnvelope } from '../types/callApi.types';

const SEEN_TTL_MS = 10 * 60 * 1000;

export class CallReliabilityManager {
  private seenEventIds = new Map<string, number>();
  private lastEventVersion = 0;
  private buffer: CallEventEnvelope[] = [];

  getLastEventVersion(): number {
    return this.lastEventVersion;
  }

  shouldApply(eventId: string | undefined, eventVersion: number | undefined): boolean {
    if (eventId != null && eventId.length > 0) {
      this.pruneSeen();
      if (this.seenEventIds.has(eventId)) {
        return false;
      }
    }
    if (eventVersion != null && eventVersion > 0 && eventVersion <= this.lastEventVersion) {
      return false;
    }
    return true;
  }

  markApplied(eventId: string | undefined, eventVersion: number | undefined): void {
    if (eventId != null && eventId.length > 0) {
      this.seenEventIds.set(eventId, Date.now());
    }
    if (eventVersion != null && eventVersion > this.lastEventVersion) {
      this.lastEventVersion = eventVersion;
    }
  }

  bufferOutOfOrder(envelope: CallEventEnvelope): void {
    this.buffer.push(envelope);
    this.buffer.sort((a, b) => (a.eventVersion ?? 0) - (b.eventVersion ?? 0));
  }

  drainReady(): CallEventEnvelope[] {
    const ready: CallEventEnvelope[] = [];
    while (this.buffer.length > 0) {
      const next = this.buffer[0];
      const version = next.eventVersion ?? 0;
      if (version > 0 && version > this.lastEventVersion + 1) {
        break;
      }
      ready.push(this.buffer.shift() as CallEventEnvelope);
    }
    return ready;
  }

  reset(): void {
    this.seenEventIds.clear();
    this.lastEventVersion = 0;
    this.buffer = [];
  }

  private pruneSeen(): void {
    const now = Date.now();
    for (const [id, ts] of this.seenEventIds.entries()) {
      if (now - ts > SEEN_TTL_MS) {
        this.seenEventIds.delete(id);
      }
    }
  }
}
