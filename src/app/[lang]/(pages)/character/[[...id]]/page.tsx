'use client';

import ProfileDetail from '@/app/view/profile/ProfileDetail';

type Props = {
  params: {
    id?: number[];
  };
};

const PageProfileDetail = ({params}: Props) => {
  const profileId = params?.id?.[0] || 0;
  return (
    <>
      <ProfileDetail profileId={profileId} />
    </>
  );
};

export default PageProfileDetail;
