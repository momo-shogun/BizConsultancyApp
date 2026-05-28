module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
        },
      },
    ],
    // Must be last.
    'react-native-reanimated/plugin',
  ],
};
