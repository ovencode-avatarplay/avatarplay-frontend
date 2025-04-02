'use client';
import React from 'react';
import ProfileUpdate from '@/app/view/profile/ProfileUpdate';
type Props = {
  params: {
    id?: string[];
  };
};

const PageProfileUpdate = ({params: {id = ['0']}}: Props) => {
  const profileId = parseInt(id?.[0]);
  return (
    <>
      <ProfileUpdate profileId={profileId} />
    </>
  );
};

export default PageProfileUpdate;
