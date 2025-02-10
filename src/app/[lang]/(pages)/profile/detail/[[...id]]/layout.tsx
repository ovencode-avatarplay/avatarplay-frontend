import React from 'react';
import PageProfileDetail from './page';

type Props = {
  params: {
    id?: number[];
  };
  children: React.ReactNode;
};

const layout = (props: Props) => {
  const profileId = props?.params?.id?.[0] || 0;
  return <PageProfileDetail profileId={profileId}></PageProfileDetail>;
};

export default layout;
