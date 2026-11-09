import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { after } from 'next/server';

let loggerProvider: LoggerProvider | undefined;

export function initializePostHogLogs() {
  if (loggerProvider || process.env.NEXT_RUNTIME === 'edge') {
    return;
  }

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!posthogKey || !posthogHost) {
    if (process.env.NODE_ENV !== 'production') {
      const missingVariable = !posthogKey
        ? 'NEXT_PUBLIC_POSTHOG_KEY'
        : 'NEXT_PUBLIC_POSTHOG_HOST';
      console.warn(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      );
    }
    return;
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'next-js-demo' }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${posthogHost.replace(/\/$/, '')}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${posthogKey}`,
            'Content-Type': 'application/json',
          },
        }),
      }),
    ],
  });
}

export function getPostHogLogger() {
  initializePostHogLogs();
  return loggerProvider?.getLogger('next-js-demo.posthog');
}

export function flushPostHogLogsAfterResponse() {
  const provider = loggerProvider;
  if (provider) {
    after(() => provider.forceFlush());
  }
}
