jest.mock('@pushpendersingh/react-native-otp-verify', () => ({
  startSmsRetriever: jest.fn(() => Promise.resolve('started')),
  getAppSignature: jest.fn(() => Promise.resolve('TEST_HASH123')),
  removeSmsListener: jest.fn(() => Promise.resolve('removed')),
  addSmsListener: jest.fn(() => ({ remove: jest.fn() })),
  extractOtp: jest.fn((message: string) => {
    const match = message.match(/\b\d{6}\b/);
    return match ? match[0] : null;
  }),
}));
