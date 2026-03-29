/**
 * Sentry Configuration — Vue.js
 *
 * Initializes Sentry for error monitoring in a Vue.js application.
 * Import and call this in your `main.ts` after creating the Vue app.
 *
 * Setup:
 *   1. npm install @sentry/vue
 *   2. Add VITE_SENTRY_DSN to your .env file
 *   3. In main.ts:
 *      import { initSentry } from "./sentry.config";
 *      const app = createApp(App);
 *      initSentry(app, router);
 *      app.mount("#app");
 *
 * Environment Variables:
 *   VITE_SENTRY_DSN — Your Sentry project DSN (required)
 *
 * See: https://docs.sentry.io/platforms/javascript/guides/vue/
 */

import * as Sentry from "@sentry/vue";
import type { App } from "vue";
import type { Router } from "vue-router";

/**
 * Initialize Sentry with the Vue app instance and router.
 *
 * @param app - The Vue app instance from createApp()
 * @param router - The Vue Router instance (for route-based performance tracing)
 */
export function initSentry(app: App, router: Router): void {
  Sentry.init({
    app,

    dsn: import.meta.env.VITE_SENTRY_DSN,

    // Performance monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,

    // Session replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Only send errors in production
    enabled: import.meta.env.PROD,

    // Vue + browser integrations
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration(),
    ],

    // Track Vue component names in error reports
    trackComponents: true,

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
}
