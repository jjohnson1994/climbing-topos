import * as Sentry from '@sentry/tanstackstart-react';
Sentry.init({
  dsn: 'https://733ea511d85aec4e21147882b7b8f0ea@o4509286165774336.ingest.de.sentry.io/4511073371160656',
  sendDefaultPii: true,
  enableLogs: true,
  tracesSampleRate: 1.0,
});
