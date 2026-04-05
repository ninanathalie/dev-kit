/// Sentry Configuration — Flutter
///
/// Initializes Sentry for error monitoring in a Flutter application.
///
/// Setup:
///   1. Add to pubspec.yaml: sentry_flutter: ^8.0.0
///   2. Add SENTRY_DSN to your .env file (use flutter_dotenv or --dart-define)
///   3. Replace your main() function:
///      ```dart
///      Future<void> main() async {
///        await initSentry(() => runApp(const MyApp()));
///      }
///      ```
///
/// Environment Variables:
///   SENTRY_DSN — Your Sentry project DSN (required)
///
/// See: https://docs.sentry.io/platforms/flutter/

import 'package:flutter/foundation.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

/// Initialize Sentry and run the app inside Sentry's error boundary.
///
/// [appRunner] is the function that starts your app (e.g., `() => runApp(MyApp())`).
/// Sentry wraps this to catch any unhandled errors during startup.
Future<void> initSentry(Future<void> Function() appRunner) async {
  await SentryFlutter.init(
    (options) {
      // DSN is read from environment — pass via --dart-define=SENTRY_DSN=...
      // or use flutter_dotenv to load from .env file
      options.dsn = const String.fromEnvironment('SENTRY_DSN');

      // Performance monitoring — adjust for production traffic
      options.tracesSampleRate = kReleaseMode ? 0.2 : 1.0;

      // Only send errors in release builds
      options.enabled = kReleaseMode;

      // Capture failed HTTP requests automatically
      options.enableAutoPerformanceTracing = true;

      // Attach device info to error reports
      options.attachThreads = true;

      // Set environment tag
      options.environment = kReleaseMode ? 'production' : 'development';
    },
    appRunner: appRunner,
  );
}
