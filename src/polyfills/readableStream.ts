import { ReadableStream as ReadableStreamPolyfill } from 'web-streams-polyfill/dist/ponyfill';

declare global {
  // eslint-disable-next-line no-var
  var ReadableStream: typeof ReadableStreamPolyfill | undefined;
}

if (globalThis.ReadableStream == null) {
  globalThis.ReadableStream = ReadableStreamPolyfill;
}
