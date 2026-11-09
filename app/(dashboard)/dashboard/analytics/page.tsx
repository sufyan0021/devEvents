import { SeverityNumber } from '@opentelemetry/api-logs';
import { connection } from 'next/server';
import {
  flushPostHogLogsAfterResponse,
  getPostHogLogger,
} from '@/lib/posthog-logs';

export const instant = false;

const Analytics = async () => {
  await connection();

  getPostHogLogger()?.emit({
    body: 'Dashboard analytics rendered',
    severityNumber: SeverityNumber.INFO,
    attributes: {
      dashboard_section: 'analytics',
      route: '/dashboard/analytics',
    },
  });
  flushPostHogLogsAfterResponse();

  return <div>Analytics</div>;
};

export default Analytics;
