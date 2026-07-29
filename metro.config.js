// Use the SDK-aware entry (`expo/metro-config`), not the raw `@expo/metro-config`
// package, so the transform worker and source-map serializer match the installed
// Expo SDK. Prevents the "Unexpected module with full source map found" polyfill error.
const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro configuration
 * https://docs.expo.dev/guides/customizing-metro/
 *
 * @type {import('expo/metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

module.exports = config;
