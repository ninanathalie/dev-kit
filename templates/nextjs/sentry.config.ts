/**
 * Sentry Configuration — Next.js
 *
 * Initializes Sentry for error monitoring in a Next.js application.
 * This file should be imported in your `instrumentation.ts` (App Router)
 * or `_app.tsx` (Pages Router).
 *
 * Setup:
 *   1. npm install @sentry/nextjs
 *   2. Add NEXT_PUBLIC_SENTRY_DSN to your .env file
 *   3. Run: npx @sentry/wizard@latest -i nextjs
 *      (or manually configure using this template)
 *
 * Environment Variables:
 *   NEXT_PUBLIC_SENTRY_DSN — Your Sentry project DSN (required)
 *   SENTRY_AUTH_TOKEN      — For source map uploads in CI (optional)
 *
 * See: https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // DSN is read from environment variable — never hardcode this
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring — adjust sample rate for production traffic
  // 1.0 = 100% of transactions captured (reduce for high-traffic apps)
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,

  // Session replay — captures user interactions leading up to errors
  // Only available on Sentry's paid plans; safe to leave enabled on free tier (just won't record)
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Only send errors in production (avoid noise during development)
  enabled: process.env.NODE_ENV === "production",

  // Filter out known non-actionable errors
  ignoreErrors: [
    // Browser extensions and third-party scripts
    "ResizeObserver loop",
    "Non-Error promise rejection captured",
    // Network errors that are expected
    "Failed to fetch",
    "NetworkError",
    "Load failed",
  ],

  // Set the environment tag for filtering in Sentry dashboard
  environment: process.env.NODE_ENV,
});
