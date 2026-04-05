/**
 * Sentry Configuration — React (Vite)
 *
 * Initializes Sentry for error monitoring in a React/Vite application.
 * Import this file at the top of your `main.tsx` (before React renders).
 *
 * Setup:
 *   1. npm install @sentry/react
 *   2. Add VITE_SENTRY_DSN to your .env file
 *   3. Import in main.tsx: import "./sentry.config";
 *
 * Environment Variables:
 *   VITE_SENTRY_DSN — Your Sentry project DSN (required)
 *
 * See: https://docs.sentry.io/platforms/javascript/guides/react/
 */

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,

  // Session replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Only send errors in production
  enabled: import.meta.env.PROD,

  // React-specific integrations
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],

  // Filter out non-actionable errors
  ignoreErrors: [
    "ResizeObserver loop",
    "Non-Error promise rejection captured",
    "Failed to fetch",
    "NetworkError",
    "Load failed",
  ],

  environment: import.meta.env.MODE,
});
