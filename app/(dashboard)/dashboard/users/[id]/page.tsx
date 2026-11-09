import { Suspense } from 'react';

const UserData = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

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
