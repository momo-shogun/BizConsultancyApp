jest.mock('@avasapp/react-native-otp-autofill', () => ({
  useOtpListener: jest.fn(() => ({
    isListening: false,
    loading: false,
    receivedOtp: null,
    receivedMessage: null,
    error: null,
    startListener: jest.fn(() => Promise.resolve()),
    stopListener: jest.fn(),
  })),
  useGetHash: jest.fn(() => ({
    hash: null,
    loading: false,
    error: null,
    refetch: jest.fn(() => Promise.resolve()),
  })),
}));
