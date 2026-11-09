import { SeverityNumber } from '@opentelemetry/api-logs';
import { Suspense } from 'react';
import { getPostHogLogger } from '@/lib/posthog-logs';

const UserData = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  getPostHogLogger()?.emit({
    body: 'Dashboard user details rendered',
    severityNumber: SeverityNumber.INFO,
    attributes: {
      dashboard_section: 'users',
      route: '/dashboard/users/[id]',
    },
  });

  return <div>UserDetails #{id}</div>;
};

const UserDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  return (
    <Suspense fallback={<div>Loading user details...</div>}>
      <UserData params={params} />
    </Suspense>
  );
};

export default UserDetailsPage;
