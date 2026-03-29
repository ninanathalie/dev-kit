/**
 * Sentry Configuration — React Native
 *
 * Initializes Sentry for error monitoring in a React Native application.
 * Import this file at the top of your `App.tsx` (before any component renders).
 *
 * Setup:
 *   1. npm install @sentry/react-native
 *   2. Add SENTRY_DSN to your .env file (use react-native-config or expo-constants)
 *   3. Import in App.tsx: import "./sentry.config";
 *   4. Wrap your root component: export default Sentry.wrap(App);
 *
 * For Expo:
 *   npx expo install @sentry/react-native
 *
 * Environment Variables:
 *   SENTRY_DSN — Your Sentry project DSN (required)
 *
 * See: https://docs.sentry.io/platforms/react-native/
 */

import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: __DEV__ ? 1.0 : 0.2,

  // Only send errors in production
  enabled: !__DEV__,

  // Enable native crash reporting (iOS/Android)
  enableNative: true,

  // Attach screenshots to error reports (helps with visual debugging)
  attachScreenshot: true,

  // Enable automatic instrumentation for navigation (React Navigation)
  enableAutoSessionTracking: true,

  // Filter out non-actionable errors
  ignoreErrors: [
    "Non-Error promise rejection captured",
    "Network request failed",
  ],

  environment: __DEV__ ? "development" : "production",
});
