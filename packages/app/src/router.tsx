import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import * as Sentry from '@sentry/tanstackstart-react';
import { routeTree } from './routeTree.gen';
import type { JwtPayload } from './lib/jwt';

let router: ReturnType<typeof createRouter>;

export function createRouter() {
  return createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    context: { user: undefined as JwtPayload | false | undefined },
  });
}

export function getRouter() {
  if (typeof document === 'undefined') {
    return createRouter();
  }

  if (!router) {
    router = createRouter();
    Sentry.init({
      dsn: 'https://733ea511d85aec4e21147882b7b8f0ea@o4509286165774336.ingest.de.sentry.io/4511073371160656',
      sendDefaultPii: true,
      integrations: [
        Sentry.tanstackRouterBrowserTracingIntegration(router),
        Sentry.replayIntegration(),
        Sentry.feedbackIntegration({
          colorScheme: 'system',
        }),
      ],
      enableLogs: true,
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
