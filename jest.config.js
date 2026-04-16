module.exports = {
  preset: '@react-native/jest-preset',
  maxWorkers: 1,
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|react-native-gesture-handler|react-native-vector-icons)',
  ],
};
